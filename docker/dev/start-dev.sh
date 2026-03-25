#!/bin/sh
set -eu

cd /app

LOCKFILE_PATH="package-lock.json"
NODE_MODULES_DIR="/app/node_modules"
HASH_FILE="$NODE_MODULES_DIR/.package-lock.hash"

mkdir -p "$NODE_MODULES_DIR"

current_hash=""
stored_hash=""

if [ -f "$LOCKFILE_PATH" ]; then
  current_hash="$(sha256sum "$LOCKFILE_PATH" | awk '{print $1}')"
fi

if [ -f "$HASH_FILE" ]; then
  stored_hash="$(cat "$HASH_FILE")"
fi

if [ ! -d "$NODE_MODULES_DIR/react-markdown" ] || [ "$current_hash" != "$stored_hash" ]; then
  echo "Installing dependencies for development container..."
  npm install
  if [ -n "$current_hash" ]; then
    printf '%s' "$current_hash" > "$HASH_FILE"
  fi
fi

exec npm run dev
