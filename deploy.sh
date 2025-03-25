#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git add *
git commit -m 'New Deployment'
git push -f https://github.com/lancelot-carrau/Portfolio-photo.git master:gh-pages

cd -