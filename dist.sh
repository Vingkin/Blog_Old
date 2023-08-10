#!/usr/bin/env sh
# shellcheck disable=SC2164
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://vingkin.github.io/Blog
git push -f git@github.com:vingkin/Blog.git master:gh-pages

# shellcheck disable=SC2103
cd -