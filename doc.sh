#!/usr/bin/env sh

git add docs/
git commit -m 'update docs'
git pull origin docs
git push origin docs