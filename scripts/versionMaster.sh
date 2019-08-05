#!/bin/bash

NUM_COMMITS="$(git rev-list HEAD --count)"
LAST_COMMIT="$(git rev-parse --short HEAD)"
PRE_ID="dev.$NUM_COMMITS.$LAST_COMMIT"

npm --no-git-tag-version version prerelease --preid "$PRE_ID"
