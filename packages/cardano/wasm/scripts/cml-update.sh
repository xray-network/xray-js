#!/bin/bash

SUBMODULE_DIR=rust/cardano-multiplatform-lib
cd $SUBMODULE_DIR
git fetch --tags
LATEST_TAG=$(git tag -l --sort=-v:refname | head -n 1)
echo "✅ Latest tag found: $LATEST_TAG"
git checkout $LATEST_TAG
git submodule update --init --recursive
echo "✅ Updated submodule <<$SUBMODULE_DIR>> to latest tag $LATEST_TAG"
