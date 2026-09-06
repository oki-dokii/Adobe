from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIB = (ROOT / "scripts" / "lib").read_text if False else ROOT / "scripts" / "lib"


def test_no_write_methods_in_http_client():
    text = (LIB / "http.py").read_text()
    assert "POST" not in text or "not allowed" in text
    assert "PUT" not in text
    assert "DELETE" not in text


def test_all_skill_md_exist():
    man = (ROOT / "marketplace.json").read_text()
    import json

    data = json.loads(man)
    for s in data["skills"]:
        p = ROOT / s["path"] / "SKILL.md"
        assert p.is_file(), p
        body = p.read_text()
        assert f"name: {s['id']}" in body
        assert "description:" in body
        scripts = ROOT / s["path"] / "scripts"
        assert scripts.is_dir()
        refs = ROOT / s["path"] / "references"
        assert refs.is_dir()
