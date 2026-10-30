#!/usr/bin/env python3
"""Search video-shotcraft's authoritative Gallery index without loading previews."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, required=True, help="video-shotcraft checkout")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--name", help="exact card name")
    group.add_argument("--query", help="case-insensitive text in name, use, or summary")
    group.add_argument("--category", help="exact category, such as data or typography")
    parser.add_argument("--limit", type=int, default=25, help="maximum search results")
    args = parser.parse_args()
    if args.limit < 1:
        parser.error("--limit must be positive")

    index = args.repo / "gallery" / "api" / "library.json"
    if not index.is_file():
        parser.error(f"Gallery index not found: {index}")
    cards = json.loads(index.read_text(encoding="utf-8"))["cards"]
    if args.name:
        selected = [card for card in cards if card["name"].casefold() == args.name.casefold()]
    elif args.category:
        selected = [card for card in cards if card.get("category", "").casefold() == args.category.casefold()]
    elif args.query:
        needle = args.query.casefold()
        selected = [card for card in cards if needle in " ".join(str(card.get(key, "")) for key in ("name", "summary", "use", "category", "tags")).casefold()]
    else:
        selected = cards

    selected.sort(key=lambda card: (card.get("category", ""), card["name"]))
    print(f"{len(selected)} matching cards (showing {min(args.limit, len(selected))})")
    for card in selected[:args.limit]:
        styles = ", ".join(style["key"] for style in card.get("styles", []))
        print(f"\n{card['name']}  [{card.get('category', '?')}]  {styles}")
        print(f"  card: {card['source']}")
        print(f"  use: {str(card.get('use', card.get('summary', ''))).strip()[:240]}")


if __name__ == "__main__":
    main()
