"""Kokoro TTS narration with word-level timestamps.

Usage: python python/tts_kokoro.py job.json
job.json = {"voice": "af_heart", "out_wav": "...", "out_json": "...",
            "scenes": [{"id": "s1", "text": "...", "speed": 1.0, "pause_after_ms": 250}]}
Writes a 24 kHz mono WAV and a JSON timeline:
{"duration": 612.4, "scenes": [{"id", "start", "end", "words": [{"text", "start", "end"}]}]}
"""
import json
import sys

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SR = 24000


def main(job_path: str) -> None:
    job = json.load(open(job_path, encoding="utf-8"))
    voice = job.get("voice", "af_heart")
    pipeline = KPipeline(lang_code=voice[0])  # 'a' = American English, 'b' = British English

    chunks = [np.zeros(int(SR * 0.15), dtype=np.float32)]  # short lead-in
    t = 0.15
    timeline = []
    for scene in job["scenes"]:
        start = t
        words = []
        for result in pipeline(scene["text"], voice=voice, speed=float(scene.get("speed", 1.0)), split_pattern=r"\n+"):
            if result.audio is None:
                continue
            audio = result.audio.detach().cpu().numpy().astype(np.float32)
            for tok in result.tokens or []:
                if tok.start_ts is None or tok.end_ts is None or not tok.text.strip():
                    continue
                if not any(ch.isalnum() for ch in tok.text):
                    # punctuation: glue to previous word so captions show it
                    if words:
                        words[-1]["text"] += tok.text
                    continue
                words.append({"text": tok.text, "start": round(t + tok.start_ts, 3), "end": round(t + tok.end_ts, 3)})
            chunks.append(audio)
            t += len(audio) / SR
        pause = max(0, int(scene.get("pause_after_ms", 250))) / 1000
        if pause:
            chunks.append(np.zeros(int(SR * pause), dtype=np.float32))
        timeline.append({"id": scene["id"], "start": round(start, 3), "end": round(t, 3), "words": words})
        t += pause
        print(f"  tts {scene['id']}: {t:.1f}s", flush=True)

    chunks.append(np.zeros(int(SR * 0.4), dtype=np.float32))
    t += 0.4
    audio = np.concatenate(chunks)
    peak = float(np.max(np.abs(audio))) or 1.0
    audio = audio / peak * 0.89  # normalize to about -1 dBFS
    sf.write(job["out_wav"], audio, SR)
    json.dump({"duration": round(t, 3), "scenes": timeline}, open(job["out_json"], "w", encoding="utf-8"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1])
