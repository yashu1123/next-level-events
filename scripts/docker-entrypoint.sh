#!/bin/sh
set -eu

# Wrangler records applied migrations, so restarts only apply pending SQL.
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js \
  d1 migrations apply DB --local --config dist/server/wrangler.json \
  --persist-to .wrangler/state

exec "$@"
