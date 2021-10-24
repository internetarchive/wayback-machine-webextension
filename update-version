#!/bin/bash

echo "Updating version to $1"

sed -i '' -e "s/MARKETING_VERSION\ \=\ [0-9\.]*/MARKETING_VERSION = $1/" safari/Wayback\ Machine.xcodeproj/project.pbxproj
sed -i '' -e "s/\"version\"\:\ \"[0-9\.]*\"/\"version\"\:\ \"$1\"/" webextension/manifest.json
sed -i '' -e "s/\"version\"\:\ \"[0-9\.]*\"/\"version\"\:\ \"$1\"/" package.json

