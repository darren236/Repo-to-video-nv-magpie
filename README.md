# Repo-to-video-nv-magpie

Turn a Git repository into a narrated MP4. Claude drafts a sourced storyboard, NVIDIA Magpie TTS Multilingual makes the voice, and Remotion renders the video.

[![Watch the pilot](https://img.shields.io/badge/Watch-62s_pilot-176d5a?style=for-the-badge)](https://darren236.github.io/Repo-to-video-nv-magpie/) [![Read the guide](https://img.shields.io/badge/Read-user_guide-334b46?style=for-the-badge)](docs/usage.md) [![MIT License](https://img.shields.io/badge/License-MIT-176d5a?style=for-the-badge)](LICENSE)

## Example

[![Watch the Nemotron pilot on GitHub Pages](examples/nemotron-transcribe-pilot/poster.png)](https://darren236.github.io/Repo-to-video-nv-magpie/)

[Watch on GitHub Pages](https://darren236.github.io/Repo-to-video-nv-magpie/) · [Source repo: Nemotron 3.5 Transcribe](https://github.com/darren236/nemotron-transcribe-h100-demos) · [Shot map](examples/nemotron-transcribe-pilot/shot-map.md)

The film uses real demo output, four [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) shots, and a visible Magpie voice credit. Its source is [editable in Remotion](video/src/shotcraft-production.tsx).

## Try it

Requires Python 3.10+, Git, Node.js, an authenticated Claude CLI, and `NVIDIA_API_KEY` ([get access](https://build.nvidia.com/nvidia/magpie-tts-multilingual/api)).

```bash
cd video && npm ci && cd ..
python3 repo_video.py prepare https://github.com/owner/repo --out projects/demo
# Review projects/demo/storyboard.json
python3 repo_video.py render projects/demo
```

Output: `projects/demo/video.mp4`. See the [illustrated user guide](docs/usage.md), [video-creator skill](skills/video-creator/SKILL.md), [MIT license](LICENSE), and [third-party notices](THIRD_PARTY_NOTICES.md).
