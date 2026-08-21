#!/usr/bin/env python3
"""Tiny teaching helper: keyword-check one output file.
Usage: python3 evals/grade-output.py <output.md>
"""
from pathlib import Path
import sys

if len(sys.argv) != 2:
    print("Usage: python3 evals/grade-output.py <output.md>", file=sys.stderr)
    sys.exit(2)

text = Path(sys.argv[1]).read_text(encoding="utf-8")
checks = {
    "includes npm run dev": "npm run dev" in text,
    "includes prisma generate": "npx prisma generate" in text,
    "mentions standalone gotcha": ".next/standalone" in text and "output" in text and "standalone" in text,
    "does not invent test script": "npm run test" not in text,
}

for name, passed in checks.items():
    print(f"{'PASS' if passed else 'FAIL'}: {name}")

sys.exit(0 if all(checks.values()) else 1)
