import json
import tempfile
import unittest
from pathlib import Path

from repo_video import collect_evidence, safe_source_file, subtitles, validate_storyboard


class CoreTests(unittest.TestCase):
    def test_private_paths_are_excluded_and_key_lines_redacted(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "README.md").write_text("A useful app.\nAPI_KEY=secretvalue\n", encoding="utf-8")
            (root / "private").mkdir()
            (root / "private" / "notes.md").write_text("private", encoding="utf-8")
            (root / ".env").write_text("NVIDIA_API_KEY=secret", encoding="utf-8")
            self.assertFalse(safe_source_file(root, root / "private" / "notes.md"))
            self.assertFalse(safe_source_file(root, root / ".env"))
            evidence = collect_evidence(root)
            self.assertEqual([item["path"] for item in evidence["files"]], ["README.md"])
            self.assertNotIn("secretvalue", json.dumps(evidence))

    def test_storyboard_requires_known_sources(self):
        evidence = {"files": [{"path": "README.md"}]}
        scene = {"title": "How it works", "narration": "A clear explanation of the repository begins with its input, follows the important processing steps, and ends with the output that a developer can inspect and verify in source files.", "visual": "flow", "nodes": ["Input", "Output"], "source_paths": ["README.md"]}
        validate_storyboard({"scenes": [scene] * 4}, evidence)
        scene = {**scene, "source_paths": ["invented.md"]}
        with self.assertRaises(ValueError):
            validate_storyboard({"scenes": [scene] * 4}, evidence)

    def test_captions_cover_audio_duration(self):
        text = subtitles([{"narration": "One two three four five six seven eight nine ten."}], [4.0])
        self.assertIn("00:00:04,000", text)
        self.assertIn("ten.", text)


if __name__ == "__main__":
    unittest.main()
