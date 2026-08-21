#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${1:-.}"

if [ "${PROJECT_DIR}" = "--help" ] || [ "${PROJECT_DIR}" = "-h" ]; then
  cat <<'HELP'
Usage:
  bash scripts/check-onboarding.sh <project-dir>

Checks a project for onboarding facts:
- package scripts
- env example
- Prisma custom output
- Docker standalone mismatch

Examples:
  bash .claude/skills/project-onboarding/scripts/check-onboarding.sh .
  bash scripts/check-onboarding.sh /path/to/project
HELP
  exit 0
fi

if [ ! -d "$PROJECT_DIR" ]; then
  echo "ERROR: project directory not found: $PROJECT_DIR" >&2
  exit 2
fi

cd "$PROJECT_DIR"

echo "# Onboarding Check"
echo

if [ -f package.json ]; then
  echo "## package.json scripts"
  grep -E '"(dev|build|start|lint|test|typecheck)"[[:space:]]*:' package.json || true
  echo
else
  echo "WARN: package.json not found"
fi

if [ -f .env.example ]; then
  echo "OK: .env.example found"
else
  echo "WARN: .env.example not found"
fi

if [ -f prisma/schema.prisma ]; then
  echo
  echo "## Prisma"
  grep -n 'output.*generated/prisma' prisma/schema.prisma >/dev/null \
    && echo "OK: Prisma custom output detected" \
    || echo "WARN: Prisma custom output not detected"
fi

if [ -f Dockerfile ] && [ -f next.config.ts ]; then
  echo
  echo "## Docker"
  if grep -q '.next/standalone' Dockerfile && ! grep -q 'output.*standalone' next.config.ts; then
    echo 'WARN: Dockerfile uses .next/standalone but next.config.ts has no output: "standalone"'
  else
    echo "OK: Docker standalone setting looks consistent"
  fi
fi
