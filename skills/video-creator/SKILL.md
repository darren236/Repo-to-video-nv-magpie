---
name: video-creator
description: Create or revise source-grounded software or product videos with video-shotcraft's real Remotion template or shot implementations, real captures or footage, editable source, and optional narration. Use for repo explainers, product demos, and promos; skip for unrelated text-to-video requests.
---

# Video Creator with Shotcraft

Turn a software repository or product into a clear, source-grounded film. Use [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) as a production library: choose a film structure, inspect the matching template or shot cards and their tuned implementations, adapt them to real assets, then render and review. A palette switch alone does not count as using a Shotcraft template or card.

The upstream checkout for this project belongs at `third_party/video-shotcraft-upstream/`; it is excluded from the published repository. Record its commit in the video manifest. If unavailable, use another checkout or clone upstream into a writable project folder. Keep the upstream checkout unmodified. Read its `SKILL.md` for library conventions and the relevant route in [production routes](references/production-routes.md). Existing user choices and authorization govern the work; a clear request to make the video is enough to proceed with an appropriate route.

## Decide what the film shows

1. Inspect the target repository or product. Record claims against source paths and a commit, or URLs and capture dates for a live site. Identify runnable UI, demos, commands, outputs, and visual assets. Exclude credentials and unrelated private data from captures. Derive typography, color, and layout from the product when it has a visual identity. Recheck claims if the source changes between storyboard and render.
2. Choose the viewer, purpose, format, length, and voice from the request and available context. Write a short narrative before selecting effects. Give each shot one point, one visual proof or clearly labeled illustration, and enough time to read it.
3. Choose the Shotcraft route by fit:
   - **Ink Press film template:** Use only when its screenshot-driven product sequence fits and the user wants close reuse. Read `template/TEMPLATE.md` and adapt its actual Remotion project, assets, layout coordinates, copy, and timing.
   - **Custom film from shot cards:** Use when a new sequence fits the story better. Inspect `references/sequences/`, search `gallery/api/library.json`, read each selected `references/shots/...` card in full, and inspect the exact demo TSX named under its reference implementation. Copy and adapt the implementation or its defined motion behavior; do not reconstruct it from a card title or preview alone.
   - **Single shot:** For a focused revision, inspect only the relevant card, variant, implementation, and neighboring edit points.

The pinned Shotcraft checkout has one complete film template, Ink Press. Its other choices are shot recipes and motion variants that can be composed into a film. Use `scripts/shotcraft_catalog.py` to shortlist candidates. A real footage or evidence shot may use plain Remotion; do not force every shot into a card or claim card usage where there is none.

## Build and deliver

- Make a shot map with each claim, source, on-screen asset, Shotcraft card and variant if used, exact upstream implementation, whether code was copied or motion adapted, duration, and voice cue. Use real screenshots or output when showing product behavior. Label command journeys and conceptual diagrams as illustrations. Do not present fabricated UI as a product capture.
- Preserve the selected motion's action, easing, rest, and known pitfalls. Replace demo branding, placeholder text, synthetic signal, and textures with material from the target. Give adjacent shots different visual jobs. In the Nemotron trial, the waveform's heights were sampled from the exact source WAV and its word reveals used saved alignment times; this is the standard of evidence for an audio-driven shot.
- Use the user's chosen narration provider. In this workspace, NVIDIA Magpie is the established choice; reuse existing WAVs when revising only visuals. Finalize the script, measure audio, and time shots to speech. `repo_video.py` can supply a draft storyboard, but its generic renderers are not Shotcraft implementations. Treat sentence-length SRT timing as an estimate, not word alignment.
- Render an editable Remotion project and final MP4. Inspect entering, peak, and settled frames, then sample the encoded video across the full timeline. Check readable text, accurate evidence labels, voice, captions, and audio balance; verify streams and duration. Record source and Shotcraft revisions, chosen cards, asset hashes, voice model, and output hash. Preserve earlier versions.
- Deliver a direct video link, editable project, shot map, captions when available, and a visual preview when it helps review. State any material limit, such as estimated caption timing. Claim Shotcraft Workbench support only when the project follows its manifest contract. Publishing or sharing requires the user's explicit request.
