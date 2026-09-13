#!/usr/bin/env python3
"""Build and validate the submission zip for Adobe University Hackathon Round 3.

The handout specifies:
1. Exactly one designated entrypoint in marketplace.json.
2. Every skill folder must contain a valid SKILL.md per agentskills.io spec.
3. The root of the zip must contain marketplace.json, README.md, and skills/.
4. Submission zip <= 50 MB with no pre-trained weights.
"""

from __future__ import annotations

import json
import os
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent

EXCLUDE_DIRS = {
    "__pycache__",
    ".pytest_cache",
    ".git",
    "evaluation",
    "tests",
    "docs",
    ".idea",
    ".vscode",
}

EXCLUDE_EXTS = {
    ".pyc",
    ".pyo",
    ".pyd",
    ".DS_Store",
}


def validate_marketplace() -> dict:
    manifest_path = ROOT / "marketplace.json"
    if not manifest_path.is_file():
        sys.exit(f"FAIL: marketplace.json not found at {manifest_path}")
    with open(manifest_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    skills = data.get("skills", [])
    if not skills:
        sys.exit("FAIL: No skills listed in marketplace.json")

    entrypoints = [s for s in skills if s.get("entrypoint") is True]
    if len(entrypoints) != 1:
        sys.exit(f"FAIL: Exactly 1 entrypoint required, found {len(entrypoints)}")

    for s in skills:
        p = ROOT / s["path"]
        if not p.is_dir():
            sys.exit(f"FAIL: Skill path {p} does not exist")
        sk_md = p / "SKILL.md"
        if not sk_md.is_file():
            sys.exit(f"FAIL: Missing SKILL.md in {p}")
        text = sk_md.read_text(encoding="utf-8")
        if "name:" not in text or "description:" not in text:
            sys.exit(f"FAIL: SKILL.md in {p} missing required frontmatter")

    print(f"PASS: marketplace.json valid ({len(skills)} skills, entrypoint={entrypoints[0]['id']})")
    return data


def create_zip(output_path: Path) -> int:
    include_paths = [
        ROOT / "marketplace.json",
        ROOT / "README.md",
        ROOT / "skills",
        ROOT / "scripts",
        ROOT / "references",
    ]

    total_files = 0
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for item in include_paths:
            if not item.exists():
                continue
            if item.is_file():
                arcname = item.relative_to(ROOT)
                zf.write(item, arcname)
                total_files += 1
            elif item.is_dir():
                for root, dirs, files in os.walk(item):
                    # Filter out excluded directories in-place
                    dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
                    for file in files:
                        if any(file.endswith(ext) for ext in EXCLUDE_EXTS):
                            continue
                        full_p = Path(root) / file
                        arcname = full_p.relative_to(ROOT)
                        zf.write(full_p, arcname)
                        total_files += 1

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"Created {output_path.name} with {total_files} files ({size_mb:.2f} MB)")
    if size_mb > 50.0:
        sys.exit(f"FAIL: Zip size {size_mb:.2f} MB exceeds 50 MB limit!")
    return total_files


def verify_zip(zip_path: Path):
    with zipfile.ZipFile(zip_path, "r") as zf:
        names = zf.namelist()

    # Verify root level contents
    if "marketplace.json" not in names:
        sys.exit("FAIL: marketplace.json is not at the root of the zip archive!")
    if "README.md" not in names:
        sys.exit("FAIL: README.md is not at the root of the zip archive!")

    print("PASS: Root-level verification passed (marketplace.json & README.md present at root)")
    print(f"Sample root archive files: {[n for n in names if '/' not in n]}")


if __name__ == "__main__":
    validate_marketplace()
    target_zip = ROOT.parent / "brand-ai-readiness-audit-submission.zip"
    create_zip(target_zip)
    verify_zip(target_zip)
    print(f"\nSUCCESS: Ready for submission at:\n{target_zip}")
