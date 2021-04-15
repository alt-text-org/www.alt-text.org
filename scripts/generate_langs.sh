#!/usr/bin/env bash

curl -sL 'https://datahub.io/JohnSnowLabs/iso-639-1-and-639-2-language-codes-list/r/iso-639-1-and-639-2-language-codes-list-csv.json' \
  | grep -vE '^//' \
  | jq '[.[] | {code: .Alpha2_Code, name: .English_Name}]' \
  | jq '. - map(select(.code == null))' \
  | jq 'map(.name |= split("; ")[0])' \
  | cat <(echo -n 'const languages = ') - > ../js/languages.js