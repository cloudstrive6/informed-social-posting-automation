# InforMed video style bible

Reference studied: Kurzgesagt, "This Woman Cured Her Cancer with an Insane Method" (15:13), sampled every 15–30 s plus a 1-frame-per-second pacing pass. We emulate the *craft* (flat animated explainer, sound design, pacing). We never copy their characters, assets or music, never use their name in prompts, and always keep our own brand palette and mascot.

## What makes the reference work

### Visuals
- **Flat 2D vector world, no stock footage.** Everything is geometric: circles, rounded blobs, capsules. No outlines in black; instead **thick bright rim strokes** in a lighter tint of the fill (cells = dark fill + glowing rim + contrasting nucleus).
- **Saturated, mood-coded palettes per sequence**: deep purple + magenta + cyan (inside the body), orange/yellow cells on violet (immune battles), mint/teal light backgrounds (clinic, human story), neon green accents for "the hero" (viruses, cures).
- **Depth without 3D**: bokeh circles in the foreground and background, soft vignettes, particles drifting everywhere, darker/blurred background layers, brighter foreground.
- **Nothing is ever static.** Idle motion on every element: cells breathe, particles drift, characters bob, the camera slowly pushes in or pans.
- **Macro ↔ micro storytelling**: a human story (simple cute characters with glasses/scarf, IV stand, chair) cuts to *inside the body* via an **iris zoom** into a circle.
- **Labels, not paragraphs**: short pill labels with an icon ("Natural Killer Cell"), round icon badges with 1–2 word captions ("Alopecia", "Mucositis"), stage chips ("Stage 0 … Stage IV"), a few UI-style cards. Big numbers are rare and dramatic.
- **Shot length 3–7 s** even while one sentence continues; a cut or camera move lands on key words.
- A **recurring mascot** (their bird) appears in human-scale scenes for warmth and comic relief.

### Sound
- Warm, confident **human narrator**, measured pace (~150 wpm), short punchy sentences mixed with long flowing ones, dry humor ("We'll spare you the details, but it was not fun.").
- **Ambient synth score**: soft pads, plucky arpeggios, swells into reveals, drops out for dramatic lines.
- **Sound effects on almost every visual event**: pops when things appear, whooshes on transitions and camera moves, bubbly squelches for cells, UI blips on labels, risers before reveals.

### Writing
- **Cold open in medias res** ("A sharp needle breaks skin and pierces the firm, dark tumor."), stakes, *then* context.
- A real person's story carries the science.
- One-line dramatic beats: "Unfortunately at least one cell survived." / "Stage 3B."

## How InforMed implements it

| Reference trait | Our implementation |
|---|---|
| Flat vector world | `src/media/vector/` component library (cells, immune cells, viruses, bacteria, organs, molecules, DNA, pills, syringes, food, people, mascot, labels, badges, stats), all SVG, all parameterized by palette |
| Scene art direction | **Motion Designer** agent turns each narration scene into 1–3 shots (JSON: palette, background, elements, motions, camera, transition, label) |
| Palettes | `mood` palettes: `body`, `immune`, `clinic`, `night`, `warm`, `brand` |
| Constant motion | GSAP motion presets: float, breathe, spin, drift, orbit, wobble, swim, pop, count-up; seek-safe for the renderer |
| Iris / zoom / whip transitions | Shot transitions rendered in the composition |
| Mascot | "Medi", a heart-shaped character derived from the InforMed logo |
| SFX | Synthesized SFX kit (pop, whoosh, blip, bubble, ding, riser, sparkle) auto-cued from animation events |
| Score | Procedurally generated ambient synth bed per mood, or your own tracks in `assets/music/` |
| Human narrator | Chatterbox TTS (expressive, open source), timed with Whisper word alignment |
| Output | 1920×1080 (long) and 1080×1920 (vertical) at **60 fps** |
