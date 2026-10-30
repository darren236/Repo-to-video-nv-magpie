# Usage

## Generate a video

`prepare` accepts a local Git repository or a plain public GitHub repository URL. It reads selected tracked text files, records file hashes, and asks the authenticated Claude CLI for a five-scene storyboard. Review `projects/demo/evidence.json` and edit `storyboard.json` before rendering.

```bash
python3 repo_video.py prepare /path/to/repo --out projects/demo
python3 repo_video.py render projects/demo
```

`render` requests five WAV clips from NVIDIA Magpie TTS Multilingual using the default `Magpie-Multilingual.EN-US.Aria` voice, then makes a 1080p MP4 with Remotion. Set `NVIDIA_API_KEY` in your environment or in a local `.env` file; `.env` and `projects/` are ignored by Git. Rendering also saves approximate sentence-timed `captions.srt`, `manifest.json`, and source evidence. Check the script, claims, and caption timing before sharing the result.

## Visual choices

The CLI defaults to `standard`. For a paper-and-ink style adapted from Shotcraft motion ideas, use `--template shotcraft-ink` on `render`, or restyle existing narration without another TTS request:

```bash
python3 repo_video.py rerender projects/demo --template shotcraft-ink
```

For a film built from [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)'s actual shot implementations, follow the [video-creator skill](../skills/video-creator/SKILL.md). The [Nemotron pilot](../examples/nemotron-transcribe-pilot/pilot.mp4) uses that route. Its [manifest](../examples/nemotron-transcribe-pilot/manifest.json) records the source commit, Shotcraft revision, voice, and media hashes. Rebuild the bundled example from `video/` without another Magpie request:

```bash
mkdir -p ../projects/nemotron-transcribe-pilot
npx remotion render src/index.ts ShotcraftPilot ../projects/nemotron-transcribe-pilot/pilot.mp4
```

## Source and privacy

`prepare` skips common secret paths, binary assets, and lines resembling credentials, but these filters are not a guarantee. Inspect `evidence.json` before using confidential repositories: selected excerpts go to Claude, and narration text goes to NVIDIA. The input repository is never modified. The CLI does not record an app's UI or publish the output.
