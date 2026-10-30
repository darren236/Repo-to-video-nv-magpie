# Repo-to-video-nv-magpie

Generate a source-grounded explainer video from a local Git repository or a public GitHub URL. The tool reads selected tracked files, asks the installed Claude CLI for an editable five-scene storyboard, synthesizes each scene with NVIDIA Magpie TTS Multilingual, and renders a 1080p MP4 with Remotion.

## Requirements

- Python 3.10+, Git, Node.js, npm, and an authenticated Claude Code CLI.
- Remotion dependencies: `cd video && npm ci`.
- A NVIDIA API key with access to [Magpie TTS Multilingual](https://build.nvidia.com/nvidia/magpie-tts-multilingual/api). Set `NVIDIA_API_KEY` in the environment or in a local `.env` file in this directory. The `.env` file is ignored by Git.

The default voice is `Magpie-Multilingual.EN-US.Aria`. The NVIDIA key and repository contents stay out of generated logs. Selected excerpts are sent to the Claude CLI; narration text is sent to NVIDIA. Check [NVIDIA's hosted API terms](https://build.nvidia.com/nvidia/magpie-tts-multilingual) before using confidential material.

## Use

```bash
python3 repo_video.py prepare /path/to/repo --out projects/my-video
# Review and edit projects/my-video/storyboard.json.
python3 repo_video.py render projects/my-video
# Or choose the Shotcraft-inspired paper-and-ink renderer for a new video:
python3 repo_video.py render projects/my-video --template shotcraft-ink
```

`render` creates `video.mp4` once. To compare styles after a render, reuse its saved Magpie WAV clips without another NVIDIA request:

```bash
python3 repo_video.py rerender projects/my-video --template shotcraft-ink
```

This creates `video-shotcraft-ink.mp4`, `render-props-shotcraft-ink.json`, and `manifest-shotcraft-ink.json` beside the original video. The `standard` template remains the default. `shotcraft-ink` adapts the warm paper palette, word-by-word title reveal, spotlight focus, and card-dealing motion from [video-shotcraft's Ink Press template and shot recipes](https://github.com/Vincentwei1021/video-shotcraft). It uses the existing storyboard nodes and narration timing, so it does not require product screenshots or Shotcraft's fixed promo timeline. No Shotcraft demo images or audio are bundled.

For a production video built from Shotcraft's actual template or shot implementations, use the [video-creator skill](skills/video-creator/SKILL.md) as `$video-creator`. The `shotcraft-ink` CLI option is a lightweight visual adaptation. The skill selects real Gallery cards and demo code, uses target visuals, and performs shot-level review. The upstream checkout is intentionally excluded from this repository. To inspect the reference implementations used by the pilot:

```bash
git clone https://github.com/Vincentwei1021/video-shotcraft third_party/video-shotcraft-upstream
git -C third_party/video-shotcraft-upstream checkout 1266a3ec4831289c4d893d42dd5102723658039a
```

The [Nemotron Shotcraft pilot](examples/nemotron-transcribe-pilot/pilot.mp4) is a 62-second narrated sample checked against [the demo repository](https://github.com/darren236/nemotron-transcribe-h100-demos) at commit `9c2bc01`. See its [contact sheet](examples/nemotron-transcribe-pilot/contact-sheet.png), [shot map](examples/nemotron-transcribe-pilot/shot-map.md), and [manifest](examples/nemotron-transcribe-pilot/manifest.json). The shot map links four Shotcraft cards and their exact upstream implementations to real repo media and claims. The film displays the repository's video methods figure, introduced at `17499c0`, byte-for-byte. The editable composition is `video/src/shotcraft-production.tsx`; it reuses the five bundled Magpie WAVs. To rebuild from `video/`, run:

```bash
mkdir -p ../projects/nemotron-transcribe-pilot
npx remotion render src/index.ts ShotcraftPilot ../projects/nemotron-transcribe-pilot/video-shotcraft-production-v2.mp4
```

The production pilot uses the demo's real caption MP4, source data, and SVG figure. Its terminal shot is visibly labeled an illustration. The [narration SRT](examples/nemotron-transcribe-pilot/captions.srt) remains sentence-timed by estimate and is not burned into the video. This public sample bundles the final film and inputs needed to render it; generated drafts and earlier renders remain local under the ignored `projects/` directory. Rebuilding the pilot does not request new speech from NVIDIA.

See [third-party notices](THIRD_PARTY_NOTICES.md) for attribution and the upstream license.

For a public repo, `prepare` also accepts a plain `https://github.com/owner/repo` URL. It clones into a temporary directory. The input repo is never modified. The output directory must be new so earlier project files are preserved.

The output includes:

- `evidence.json`: selected source excerpts and file hashes;
- `storyboard.json`: editable titles, narration, visual nodes, and source file references;
- `render-props.json`: timed scene data;
- `audio/`: the five Magpie WAV clips;
- `captions.srt`: approximate sentence-timed captions;
- `manifest.json`: source commit, source hashes, voice, and duration;
- `video.mp4`: final narrated video.

The renderer uses animated cards, flow diagrams, and on-screen captions. Scene duration follows the generated WAV length. Caption timing is estimated from sentence lengths, so listen through and correct the SRT before publishing. Source paths on screen are evidence pointers; review the script against them before rendering. This tool does not prove factual correctness automatically.

## Privacy and limits

`prepare` reads tracked text files only when the input is a Git repo. It skips common secret paths and binary assets, caps source excerpts, and redacts lines resembling credential assignments before sending excerpts to Claude. The filter is a safeguard, not a guarantee; inspect `evidence.json` if the repo may contain sensitive text. For a non-Git directory, the tool walks readable text files with the same filters.

The current release makes codebase explainer videos. It does not run the app, record its UI, or publish the video. It uses the hosted Magpie endpoint; a self-hosted NIM can be added by replacing `synthesize()`.
