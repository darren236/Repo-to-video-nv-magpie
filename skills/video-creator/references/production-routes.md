# Using the upstream library

The reference checkout belongs at `third_party/video-shotcraft-upstream/` in the Repo-to-video project. It is excluded from the public repository. Clone [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) there and check out revision `1266a3ec4831289c4d893d42dd5102723658039a` when reproducing the bundled pilot. Inspect its `git rev-parse HEAD` and use its own `SKILL.md` to locate current docs. For another video, record the revision actually used.

## What the library provides

- `template/` is the complete **Ink Press** film project. Its `TEMPLATE.md` describes the required screenshot slices, `live-layout.json`, shot timing, scene code, and sound changes. It is a close-reproduction route for a visual product; it is not a general JSON theme.
- `references/sequences/` contains film-structure recipes such as `promo-energy-arc.md`.
- `gallery/api/library.json` lists cards and each card's `styles[].key` variants. `references/shots/<category>/<card>.md` describes intent, timing, materials, and pitfalls. The card's **reference implementation** points to a specific TSX file under `demos/` or `template/`.
- `demos/` contains working Remotion shot implementations. Read `demos/README.md` for wiring and dependencies. Some demos need `demos/_fixtures/` or textures; `assets/lib/` contains reusable components that should be copied into the video project when needed.
- `references/aesthetic-rules.md` and `references/final-review.md` guide visual review. `references/workbench.md` describes a separate editability contract; a generic Remotion project does not meet it automatically.

## Choose a route

**Ink Press reproduction:** Read `template/TEMPLATE.md` in full. Run the template locally to see its existing film. Capture the target product's real pages and elements, replace demo assets and layout coordinates, adapt the scene copy and branding, then retime the sequence for the requested narration. Keep a record of changed source files and asset provenance. If the repo has no screenshotable product, prefer the custom film route.

**Custom film:** Inspect the source repository or product before choosing effects. Read a suitable sequence recipe, then search the gallery catalog by the actual visual need (for example, terminal behavior, a data flow, a feature interaction, or a before/after comparison). Shortlist a few distinct cards. Resolve every chosen name and variant in `library.json`; read the full card and its exact reference TSX before coding. Use the actual demo motion and its supporting components, adapted to the target's images, data, copy, palette, and voice timing. The selected card is a starting structure, not permission to invent claims or show fictional UI as real. A plain real-footage shot can sit between card-based shots without being represented as another Shotcraft card.

**Narrated repo explainer:** The existing `repo_video.py prepare` may make an evidence file and editable draft storyboard. Verify its claims and write a shot map. Reuse the project's Magpie narration when appropriate. For selected card-based scenes, adapt the upstream implementation with a timing plan that follows the measured voice. A shot may need a longer hold, a shorter line of narration, or an extra bridge; do not simply stretch the main motion until it feels slow. Screen captions should follow the audio. Add sources in the project notes and on screen where legible.

**Single-shot revision:** Use the existing film's design tokens and timeline. Inspect the named card, exact demo implementation, and adjacent transitions. Render entering, peak, and settled frames and verify the edit in the full film.

## Catalog lookup

From `repo-to-video/`, run the bundled helper against the checkout:

```bash
python3 skills/video-creator/scripts/shotcraft_catalog.py --repo third_party/video-shotcraft-upstream --query terminal
python3 skills/video-creator/scripts/shotcraft_catalog.py --repo third_party/video-shotcraft-upstream --category data
python3 skills/video-creator/scripts/shotcraft_catalog.py --repo third_party/video-shotcraft-upstream --name terminal-3d
```

The helper is for discovery; its output does not replace the selected card or TSX. If a Gallery variant has a `style-key`, record it in the shot map. A good shot map includes: viewer claim, exact target-repo evidence, real or illustrated asset, card/variant, upstream TSX, duration and hold, voice range, caption range, and review status.

## Tested example in this workspace

The Nemotron pilot in `examples/nemotron-transcribe-pilot/` is a completed custom film. Read its `shot-map.md` when a concrete example helps. It combines two copied and adapted demo implementations (`terminal-3d`, `voice-waveform-live`), two shots adapted from demo motion (`spotlight-hero-card`, `outro-group-photo-launch`), and plain Remotion proof shots playing the target repo's real caption clip and displaying its exact methods SVG. It reuses bundled Magpie WAVs and derives the waveform from the exact source WAV and saved word times. Its separate SRT is sentence-timed by estimate; the video does not pretend it is word-aligned.

On this host, the installed Chrome binary is `/opt/google/chrome/chrome`. Remotion rendering may need `--browser-executable=/opt/google/chrome/chrome` and a process environment that permits Chrome's local sockets. Validate the encoded MP4 with the bundled `ffprobe` under `video/node_modules/@remotion/compositor-linux-x64-gnu/`; sample frames from the encoded file as well as Remotion stills. This is a host-specific rendering note, not a requirement for other environments.
