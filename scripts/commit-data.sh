#!/usr/bin/env bash
# Commit pipeline state (data/) back to the repo, retrying on concurrent pushes.
set -euo pipefail
msg="${1:-bot: update data}"
git config user.name "informed-bot"
git config user.email "informed-bot@users.noreply.github.com"
git add data
if git diff --cached --quiet; then echo "no data changes"; exit 0; fi
git commit -q -m "$msg"
for i in 1 2 3 4 5; do
  if git pull -q --rebase -X theirs origin "${GITHUB_REF_NAME:-main}" && git push -q origin "HEAD:${GITHUB_REF_NAME:-main}"; then exit 0; fi
  sleep $((i * 5))
done
echo "push failed" >&2; exit 1
