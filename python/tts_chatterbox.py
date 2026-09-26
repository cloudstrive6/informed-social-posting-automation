"""Expressive narration with Chatterbox (Resemble AI, MIT) + Whisper word alignment.

Usage: python tts_chatterbox.py job.json
job.json = {"model": "turbo"|"base", "voice_ref": optional path to a 10-20 s reference clip,
            "exaggeration": 0.55, "out_wav", "out_json",
            "scenes": [{"id", "text", "speed", "pause_after_ms"}]}
Output timeline matches tts_kokoro.py: {"duration", "scenes": [{"id","start","end","words":[{"text","start","end"}]}]}
Chatterbox embeds Resemble's imperceptible Perth watermark in all audio (responsible-AI provenance).
"""
import json
import re
import sys

import numpy as np
import soundfile as sf
import torch

torch.set_num_threads(max(1, torch.get_num_threads()))
SR_OUT = 24000


def sentences(text):
    parts = re.split(r"(?<=[.!?…])\s+", text.strip())
    out = []
    for p in parts:  # keep chunks a comfortable length for the model
        while len(p) > 260:
            cut = p.rfind(",", 0, 240)
            cut = cut if cut > 80 else 240
            out.append(p[: cut + 1].strip())
            p = p[cut + 1:].strip()
        if p:
            out.append(p)
    return out


def resample(wav, sr_in, sr_out):
    if sr_in == sr_out:
        return wav
    n = int(len(wav) * sr_out / sr_in)
    return np.interp(np.linspace(0, len(wav) - 1, n), np.arange(len(wav)), wav).astype(np.float32)


def time_stretch(wav, speed):
    """Gentle speed change without pitch shift (phase-vocoder-free: skip if ~1)."""
    if abs(speed - 1) < 0.03:
        return wav
    import librosa
    return librosa.effects.time_stretch(wav, rate=speed).astype(np.float32)


def main(job_path):
    job = json.load(open(job_path, encoding="utf-8"))
    ref = job.get("voice_ref") or None
    if job.get("model", "turbo") == "turbo":
        from chatterbox.tts_turbo import ChatterboxTurboTTS
        model = ChatterboxTurboTTS.from_pretrained(device="cpu")
        gen = lambda t: model.generate(t, audio_prompt_path=ref) if ref else model.generate(t)
    else:
        from chatterbox.tts import ChatterboxTTS
        model = ChatterboxTTS.from_pretrained(device="cpu")
        ex = float(job.get("exaggeration", 0.55))
        gen = lambda t: model.generate(t, audio_prompt_path=ref, exaggeration=ex, cfg_weight=0.45) if ref else model.generate(t, exaggeration=ex, cfg_weight=0.45)

    chunks = [np.zeros(int(SR_OUT * 0.2), np.float32)]
    t = 0.2
    bounds = []
    for scene in job["scenes"]:
        start = t
        sents = sentences(scene["text"])
        for k, s in enumerate(sents):
            wav = gen(s).squeeze().detach().cpu().numpy().astype(np.float32)
            wav = resample(wav, model.sr, SR_OUT)
            loud = np.nonzero(np.abs(wav) > 1e-3)[0]  # trim leading/trailing silence only
            if len(loud):
                wav = wav[max(0, loud[0] - 240): loud[-1] + 480]
            wav = time_stretch(wav, float(scene.get("speed", 1.0)))
            chunks.append(wav)
            t += len(wav) / SR_OUT
            if k < len(sents) - 1:  # natural breath between sentences
                gap = 0.22 if s.endswith(",") else 0.32
                chunks.append(np.zeros(int(SR_OUT * gap), np.float32))
                t += gap
        pause = max(0, int(scene.get("pause_after_ms", 300))) / 1000
        chunks.append(np.zeros(int(SR_OUT * pause), np.float32))
        bounds.append((scene["id"], start, t))
        t += pause
        print(f"  tts {scene['id']}: {t:.1f}s", flush=True)
    chunks.append(np.zeros(int(SR_OUT * 0.5), np.float32))
    audio = np.concatenate(chunks)
    audio = audio / (np.abs(audio).max() or 1) * 0.89
    sf.write(job["out_wav"], audio, SR_OUT)

    # word-level alignment with Whisper
    from faster_whisper import WhisperModel
    wm = WhisperModel(job.get("whisper_model", "base.en"), device="cpu", compute_type="int8")
    segs, _ = wm.transcribe(job["out_wav"], word_timestamps=True, language="en", vad_filter=False)
    words = [{"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)} for seg in segs for w in (seg.words or []) if w.word.strip()]
    timeline = []
    for sid, a, b in bounds:
        ws = [w for w in words if a - 0.05 <= (w["start"] + w["end"]) / 2 < b + 0.05]
        timeline.append({"id": sid, "start": round(a, 3), "end": round(b, 3), "words": ws})
    json.dump({"duration": round(len(audio) / SR_OUT, 3), "scenes": timeline}, open(job["out_json"], "w", encoding="utf-8"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1])
