"""Audio QA helpers.

  python qa_audio.py transcribe in.wav out.json [model]
      Whisper word-level transcript: {"words":[{"text","start","end","prob"}]}
  python qa_audio.py levels narration.wav music.wav|- sfx.wav|- cues.json music_gain sfx_gain out.json
      Measures voice loudness, music-under-voice level and each SFX cue's level relative to the voice at that moment.
  python qa_audio.py loudness in.wav
      {"lufs": integrated loudness, "peak_db": sample peak}
"""
import json
import sys

import numpy as np
import soundfile as sf

SR = 16000


def load(path, sr=SR):
    if path in ("-", "", None):
        return None
    x, r = sf.read(path, always_2d=True)
    x = x.mean(axis=1)
    if r != sr:
        x = np.interp(np.linspace(0, len(x) - 1, int(len(x) * sr / r)), np.arange(len(x)), x)
    return x.astype(np.float32)


def db(x):
    return float(20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-9)) if len(x) else -120.0


def transcribe(path, out, model="small.en", prompt_file=None):
    from faster_whisper import WhisperModel
    m = WhisperModel(model, device="cpu", compute_type="int8")
    prompt = open(prompt_file, encoding="utf-8").read().strip() if prompt_file else None
    segs, _ = m.transcribe(path, word_timestamps=True, language="en", beam_size=5, vad_filter=False, initial_prompt=prompt or None)
    words = [{"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "prob": round(w.probability, 3)}
             for s in segs for w in (s.words or []) if w.word.strip()]
    json.dump({"words": words}, open(out, "w", encoding="utf-8"), indent=0)


def levels(narr, music, sfx, cues_path, music_gain, sfx_gain, out):
    v = load(narr)
    m = load(music)
    f = load(sfx)
    cues = json.load(open(cues_path, encoding="utf-8")) if cues_path not in ("-", "") else []
    if isinstance(cues, dict):  # {"cues": [...], "speech": [...], ...}
        cues = cues["cues"]
    n = len(v)
    if m is not None:
        m = np.resize(m, n) * float(music_gain)
    if f is not None:
        f = np.pad(f, (0, max(0, n - len(f))))[:n] * float(sfx_gain)
    win = int(0.4 * SR)
    frames = n // win
    vr = np.array([db(v[i * win:(i + 1) * win]) for i in range(frames)])
    speaking = vr > (np.percentile(vr, 90) - 25)
    voice_db = float(np.median(vr[speaking])) if speaking.any() else -30.0
    res = {"voice_db": round(voice_db, 1), "speaking_ratio": round(float(speaking.mean()), 2)}
    if m is not None:
        mr = np.array([db(m[i * win:(i + 1) * win]) for i in range(frames)])
        res["music_under_voice_db"] = round(float(np.median(mr[speaking])) - voice_db, 1) if speaking.any() else None
        res["music_in_pauses_db"] = round(float(np.median(mr[~speaking])) - voice_db, 1) if (~speaking).any() else None
    out_cues = []
    if f is not None:
        for i, c in enumerate(cues):
            a = int(c["t"] * SR)
            seg = f[a:a + int(0.35 * SR)]
            k = min(frames - 1, max(0, a // win))
            out_cues.append({"i": i, "t": c["t"], "sfx": c.get("sfx", ""), "rel_voice_db": round(db(seg) - voice_db, 1), "during_speech": bool(speaking[k])})
    res["cues"] = out_cues
    json.dump(res, open(out, "w", encoding="utf-8"), indent=0)


def loudness(path):
    import pyloudnorm as pyln
    x, r = sf.read(path, always_2d=True)
    lufs = pyln.Meter(r).integrated_loudness(x)
    print(json.dumps({"lufs": round(float(lufs), 1), "peak_db": round(float(20 * np.log10(np.abs(x).max() + 1e-9)), 1)}))


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "transcribe":
        transcribe(sys.argv[2], sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else "small.en", sys.argv[5] if len(sys.argv) > 5 else None)
    elif cmd == "levels":
        levels(*sys.argv[2:9])
    elif cmd == "loudness":
        loudness(sys.argv[2])
