"""64-bit SimHash for template clustering (one AE∩AF subsystem)."""

from __future__ import annotations

import hashlib
import re
from collections import defaultdict


def _tokens(text: str) -> list[str]:
    return re.findall(r"[A-Za-z0-9]+|</?[a-z]+", text.lower())[:4000]


def simhash64(text: str) -> int:
    v = [0] * 64
    for tok in _tokens(text):
        h = int(hashlib.md5(tok.encode()).hexdigest(), 16)
        for i in range(64):
            v[i] += 1 if (h >> i) & 1 else -1
    out = 0
    for i in range(64):
        if v[i] > 0:
            out |= 1 << i
    return out


def hamming(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def tag_path_signature(html: str) -> str:
    tags = re.findall(r"</?([a-zA-Z0-9]+)", html)
    return "/".join(tags[:80])


class TemplateClusterer:
    """Online SimHash clusters; θ used only for site-wide report language."""

    def __init__(self, ham_threshold: int = 3):
        self.ham_threshold = ham_threshold
        self.centroids: dict[str, int] = {}
        self.members: dict[str, list[str]] = defaultdict(list)
        self._n = 0

    def assign(self, page_id: str, html: str) -> str:
        sig = tag_path_signature(html) + "\n" + html[:2000]
        h = simhash64(sig)
        for tid, c in self.centroids.items():
            if hamming(h, c) <= self.ham_threshold:
                self.members[tid].append(page_id)
                return tid
        self._n += 1
        tid = f"t-{self._n}"
        self.centroids[tid] = h
        self.members[tid].append(page_id)
        return tid

    def shared_node_theta(self, template_id: str, min_pages: int = 2) -> float:
        n = len(self.members.get(template_id, []))
        if n < min_pages:
            return 0.0
        return 1.0 if n >= min_pages else n / max(min_pages, 1)

    def site_wide_ok(self, template_id: str, pages_verified: int) -> bool:
        return self.shared_node_theta(template_id) >= 0.99 and pages_verified >= 2
