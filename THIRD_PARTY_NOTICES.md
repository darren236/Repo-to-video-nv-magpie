# Third-party design reference

The optional `shotcraft-ink` renderer adapts the visual language and motion ideas in [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft), specifically its Ink Press template and the `paper-title-card`, `spotlight-hero-card`, and `deck-deal-flyin` shot recipes. Reference revision: `1266a3ec4831289c4d893d42dd5102723658039a`.

video-shotcraft is licensed under Apache License 2.0. A copy of its license is in `third_party/video-shotcraft-LICENSE`. The renderer here is a new implementation for narration-timed repo explainers. It does not bundle video-shotcraft's example screenshots, music, or sound effects.

The `ShotcraftPilot` production trial at `video/src/shotcraft-production.tsx` also adapts upstream code from `demos/camera/terminal-3d/Terminal3D.tsx`, `demos/interaction/voice-waveform-live/VoiceWaveformLive.tsx`, and their `Look.tsx` / `Polish.tsx` fixtures. Its spotlight and group-photo shots adapt motion from `demos/opening/spotlight-hero-card/SpotlightHeroCard.tsx` and `demos/outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx`. Target-repository media replaces Shotcraft example media. See `examples/nemotron-transcribe-pilot/shot-map.md` for the exact mappings and revisions.
