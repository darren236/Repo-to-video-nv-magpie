# Third-party and media notices

The optional `shotcraft-ink` renderer adapts the visual language and motion ideas in [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft), specifically its Ink Press template and the `paper-title-card`, `spotlight-hero-card`, and `deck-deal-flyin` shot recipes. Reference revision: `1266a3ec4831289c4d893d42dd5102723658039a`.

video-shotcraft is licensed under Apache License 2.0. A copy of its license is in `third_party/video-shotcraft-LICENSE`. The renderer here is a new implementation for narration-timed repo explainers. It does not bundle video-shotcraft's example screenshots, music, or sound effects.

The `ShotcraftPilot` production trial at `video/src/shotcraft-production.tsx` also adapts upstream code from `demos/camera/terminal-3d/Terminal3D.tsx`, `demos/interaction/voice-waveform-live/VoiceWaveformLive.tsx`, and their `Look.tsx` / `Polish.tsx` fixtures. Its spotlight and group-photo shots adapt motion from `demos/opening/spotlight-hero-card/SpotlightHeroCard.tsx` and `demos/outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx`. Target-repository media replaces Shotcraft example media. See `examples/nemotron-transcribe-pilot/shot-map.md` for the exact mappings and revisions.

The renderer installs `remotion` and `@remotion/cli` as npm dependencies. They use the separate [Remotion 4.0.539 License](https://github.com/remotion-dev/remotion/blob/v4.0.539/LICENSE.md), which should be reviewed before using the renderer.

## Bundled sample media

The sample video and its poster, contact sheet, caption file, Magpie narration WAVs, and copied source-demo assets are distributed as example outputs, outside this project's MIT grant. The visual assets and muted caption clip come from [the Nemotron Transcribe demo repository at the recorded source commit](https://github.com/darren236/nemotron-transcribe-h100-demos/tree/9c2bc01eb2ec40657b4689ad6b694c2bf63f4b61); the exact files and hashes are listed in the [sample manifest](examples/nemotron-transcribe-pilot/manifest.json). The narration was synthesized with NVIDIA Magpie TTS Multilingual using the Aria voice. No Magpie model weights are bundled.

The source demo's [media notes](https://github.com/darren236/nemotron-transcribe-h100-demos/blob/9c2bc01eb2ec40657b4689ad6b694c2bf63f4b61/demos/README.md) credit its Kokoro-generated conversation, the JFK recording from OpenAI Whisper's test fixture, and the Artemis recording from NASA's audio library. Its [current license and media section](https://github.com/darren236/nemotron-transcribe-h100-demos#license-and-media) explains their separate terms. These sources are credited here without relicensing their media or implying NVIDIA or NASA endorsement.
