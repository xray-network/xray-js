#!/bin/bash

SUBMODULE_DIR=rust/message-signing-lib
cd $SUBMODULE_DIR
git fetch
git checkout
git submodule update --init --recursive
echo "✅ Updated submodule <<$SUBMODULE_DIR>> to latest commit"