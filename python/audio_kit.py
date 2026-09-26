"""InforMed audio kit: procedural sound effects + ambient synth score (no licensing issues, no downloads).

  python audio_kit.py sfx   cues.json duration out.wav      # cues: [{"t":1.2,"sfx":"pop","gain":0.6}, ...]
  python audio_kit.py music mood duration out.wav [seed]     # moods: curious, tense, hopeful, wonder, dark
"""
import json
import sys

import numpy as np
import soundfile as sf

SR = 44100


def env(n, attack, decay_tau):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-t / decay_tau)


def sweep_sine(f0, f1, dur, curve=3.0):
    n = int(SR * dur)
    t = np.linspace(0, 1, n)
    f = f1 + (f0 - f1) * np.exp(-curve * t) if f0 > f1 else f0 + (f1 - f0) * (t ** 0.7)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def lowpass(x, cutoff):
    """One-pole low-pass with per-sample (array) or constant cutoff."""
    if np.ndim(cutoff) == 0:
        from scipy.signal import lfilter
        a = np.exp(-2 * np.pi * float(cutoff) / SR)
        return lfilter([1 - a], [1, -a], x)
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def sfx(name, rng):
    v = 1 + (rng.random() - 0.5) * 0.18  # pitch variation per occurrence
    if name == "pop":
        n = int(SR * 0.12)
        x = sweep_sine(900 * v, 260 * v, 0.12, 6) * env(n, 0.002, 0.035)
        x[:60] += np.linspace(0.6, 0, 60)
        return x
    if name == "bubble":
        out = np.zeros(int(SR * 0.3))
        for k, off in enumerate([0, 0.07, 0.15]):
            n = int(SR * 0.08)
            s = sweep_sine(380 * v * (1 + 0.25 * k), 1300 * v * (1 + 0.2 * k), 0.08) * env(n, 0.003, 0.025)
            i = int(off * SR)
            out[i:i + n] += s * (0.9 - 0.2 * k)
        return out
    if name == "blip":
        n = int(SR * 0.05)
        t = np.arange(n) / SR
        a = (np.sin(2 * np.pi * 1320 * v * t) + 0.3 * np.sin(2 * np.pi * 2640 * v * t)) * env(n, 0.002, 0.02)
        b = (np.sin(2 * np.pi * 1760 * v * t) + 0.3 * np.sin(2 * np.pi * 3520 * v * t)) * env(n, 0.002, 0.03)
        return np.concatenate([a, np.zeros(int(SR * 0.02)), b]) * 0.6
    if name == "ding":
        n = int(SR * 1.6)
        t = np.arange(n) / SR
        f = 1046 * v
        x = sum(amp * np.sin(2 * np.pi * f * m * t) * np.exp(-t / (0.9 / m)) for m, amp in [(1, 1), (2, 0.4), (2.76, 0.25), (4.1, 0.12)])
        return x * env(n, 0.002, 10) * 0.6
    if name in ("whoosh", "whip", "swoosh"):
        dur = {"whoosh": 0.7, "whip": 0.3, "swoosh": 0.45}[name]
        n = int(SR * dur)
        t = np.linspace(0, 1, n)
        shape = np.sin(np.pi * t ** (0.6 if name == "whip" else 0.8)) ** 2
        cutoff = 300 + 5000 * shape * v
        x = lowpass(noise(n, int(rng.integers(1e9))), cutoff) * shape
        return x / (np.abs(x).max() + 1e-9) * 0.8
    if name == "swell":
        n = int(SR * 1.0)
        t = np.linspace(0, 1, n)
        x = lowpass(noise(n, int(rng.integers(1e9))), 200 + 3000 * t ** 2) * t ** 2.5
        x += 0.3 * np.sin(2 * np.pi * 220 * v * np.arange(n) / SR) * t ** 3
        return x / (np.abs(x).max() + 1e-9) * 0.7
    if name == "hit":
        n = int(SR * 1.2)
        t = np.arange(n) / SR
        boom = np.sin(2 * np.pi * np.cumsum(55 + 90 * np.exp(-t * 25)) / SR) * np.exp(-t / 0.35)
        crack = lowpass(noise(n, int(rng.integers(1e9))), 2500) * np.exp(-t / 0.05)
        return (boom + 0.5 * crack) * 0.8
    if name == "tick":
        n = int(SR * 0.02)
        return lowpass(noise(n, int(rng.integers(1e9))), 6000) * env(n, 0.0005, 0.004) * 0.6
    return np.zeros(1)


def load_audio(path):
    x, r = sf.read(path, always_2d=True)
    x = x.mean(axis=1)
    if r != SR:
        x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * SR / r)), np.arange(len(x)), x)
    return x


def kit_variants(kit_dir, name):
    import glob
    import os
    if not kit_dir:
        return []
    return sorted(glob.glob(os.path.join(kit_dir, name, "*.mp3")) + glob.glob(os.path.join(kit_dir, name, "*.wav")))


def build_sfx(cues_path, duration, out, kit_dir=None):
    """cues file: a list of cues, or {"cues": [...], "speech": [[start, end], ...], "duck_db": 6}.
    A cue is {"t", "sfx", "gain"} (kit sound or built-in synth) or {"t", "file", "gain"} (custom sound)."""
    spec = json.load(open(cues_path, encoding="utf-8"))
    cues = spec["cues"] if isinstance(spec, dict) else spec
    speech = spec.get("speech", []) if isinstance(spec, dict) else []
    duck = 10 ** (-float(spec.get("duck_db", 0)) / 20) if isinstance(spec, dict) else 1.0
    track = np.zeros(int(SR * (duration + 2)))
    rng = np.random.default_rng(7)
    cache = {}
    for c in cues:
        if c.get("file"):
            key = ("file", c["file"])
            if key not in cache:
                cache[key] = load_audio(c["file"])
            s = cache[key]
        else:
            files = kit_variants(kit_dir, c["sfx"])
            if files:
                f = files[int(rng.integers(len(files)))]
                key = ("kit", f)
                if key not in cache:
                    cache[key] = load_audio(f)
            else:
                key = (c["sfx"], len(cache) % 4)  # a few synth variations, reused
                if key not in cache:
                    cache[key] = sfx(c["sfx"], rng)
            s = cache[key]
        s = s / (np.abs(s).max() + 1e-9) * float(c.get("gain", 0.6))
        t = max(0.0, float(c["t"]))
        if not c.get("accent") and any(a <= t <= b for a, b in speech):
            s = s * duck  # effects that land on top of words are pulled down
        i = int(t * SR)
        j = min(len(track), i + len(s))
        track[i:j] += s[: j - i]
    track = track[: int(SR * duration)]
    peak = np.abs(track).max() or 1
    if peak > 0.95:
        track *= 0.95 / peak
    sf.write(out, np.stack([track, track], 1).astype(np.float32), SR)


# ------------------------------------------------------------------ ambient score
NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}
PROGRESSIONS = {
    "curious": [("F", [0, 4, 7, 11, 14]), ("A", [0, 3, 7, 10]), ("D", [0, 3, 7, 10, 14]), ("A#", [0, 4, 7, 11])],
    "wonder": [("C", [0, 4, 7, 11, 14]), ("E", [0, 3, 7, 10]), ("A", [0, 3, 7, 10, 14]), ("F", [0, 4, 7, 11, 18])],
    "hopeful": [("C", [0, 4, 7, 14]), ("G", [0, 4, 7, 11]), ("A", [0, 3, 7, 10]), ("F", [0, 4, 7, 11, 14])],
    "tense": [("D", [0, 3, 7, 10]), ("A#", [0, 4, 7, 11]), ("G", [0, 3, 7, 10]), ("A", [0, 4, 7, 10])],
    "dark": [("C", [0, 3, 7]), ("G#", [0, 4, 7, 11]), ("F", [0, 3, 7, 10]), ("G", [0, 3, 7, 10])],
}


def hz(name, semis, octave):
    return 440.0 * 2 ** ((NOTE[name] + semis - 9) / 12 + (octave - 4))


def reverb(x, seconds=2.8, mix=0.35, seed=3):
    n = int(SR * seconds)
    ir = noise(n, seed) * np.exp(-np.arange(n) / SR / (seconds / 5))
    ir /= np.sqrt((ir ** 2).sum())
    block = 1 << 17
    L = block + n - 1
    nfft = 1 << int(np.ceil(np.log2(L)))
    H = np.fft.rfft(ir, nfft)
    y = np.zeros(len(x) + n)
    for s in range(0, len(x), block):
        seg = x[s:s + block]
        conv = np.fft.irfft(np.fft.rfft(seg, nfft) * H, nfft)[: len(seg) + n - 1]
        y[s:s + len(conv)] += conv
    return (1 - mix) * x + mix * y[: len(x)] * 3


def build_music(mood, duration, out, seed=1):
    prog = PROGRESSIONS.get(mood, PROGRESSIONS["curious"])
    rng = np.random.default_rng(seed)
    bpm = 96
    beat = 60 / bpm
    chord_len = beat * 8
    total = int(SR * (duration + 3))
    pad = np.zeros(total)
    arp = np.zeros(total)
    bass = np.zeros(total)
    t_chord = 0.0
    k = 0
    while t_chord < duration + 3:
        root, ints = prog[k % len(prog)]
        i0, i1 = int(t_chord * SR), min(total, int((t_chord + chord_len + 1.5) * SR))
        n = i1 - i0
        t = np.arange(n) / SR
        fade = np.minimum(1, t / 1.2) * np.minimum(1, (n / SR - t) / 1.5)
        for semis in ints:
            f = hz(root, semis, 3)
            for det in (-0.12, 0.0, 0.11):  # detuned supersaw-ish pad made of soft partials
                ff = f * 2 ** (det / 12)
                wave = sum(np.sin(2 * np.pi * ff * h * t + rng.random() * 6) / h ** 1.6 for h in range(1, 6))
                pad[i0:i1] += wave * fade * (0.9 + 0.1 * np.sin(2 * np.pi * 0.2 * t)) * 0.05
        fb = hz(root, 0, 1)
        bass[i0:i1] += np.sin(2 * np.pi * fb * t) * fade * 0.22
        # plucky 8th-note arpeggio, chord tones up two octaves
        notes = [hz(root, s, 5) for s in ints] + [hz(root, ints[1] if len(ints) > 1 else 0, 6)]
        for step in range(16):
            ts = t_chord + step * beat / 2
            s0 = int(ts * SR)
            if s0 >= total:
                break
            f = notes[(step * 3 + k) % len(notes)] if step % 2 == 0 else notes[(step + k) % len(notes)]
            m = int(SR * 0.5)
            tt = np.arange(m) / SR
            pl = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt / 0.12)
            e = min(total, s0 + m)
            arp[s0:e] += pl[: e - s0] * (0.07 if step % 4 == 0 else 0.045)
        t_chord += chord_len
        k += 1
    mix = lowpass(pad, 1800) + arp + lowpass(bass, 300)
    mix = reverb(mix, 3.0, 0.4, seed)
    mix = mix[: int(SR * duration)]
    fade_n = int(SR * 2)
    mix[:fade_n] *= np.linspace(0, 1, fade_n)
    mix[-fade_n:] *= np.linspace(1, 0, fade_n)
    mix /= np.abs(mix).max() + 1e-9
    left = mix
    right = np.concatenate([np.zeros(int(SR * 0.012)), mix])[: len(mix)]  # tiny Haas widening
    sf.write(out, (np.stack([left, right], 1) * 0.8).astype(np.float32), SR)


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "sfx":
        build_sfx(sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5] if len(sys.argv) > 5 else None)
    elif cmd == "music":
        build_music(sys.argv[2], float(sys.argv[3]), sys.argv[4], int(sys.argv[5]) if len(sys.argv) > 5 else 1)
