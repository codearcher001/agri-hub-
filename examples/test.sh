#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /path/to/leaf.jpg" >&2
  exit 1
fi

curl -s -X POST http://localhost:3000/api/analyze \
  -F "image=@$1" | jq .

