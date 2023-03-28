# This gets all commits since 2023-03-15 (for sprint 2)
# Replace "alex" with whatever your github name is

git ls-tree -r HEAD --name-only website/server.js | grep -Ev "\.(png|jpeg)$" | xargs -n 1 git blame --since="2023-03-15" | grep -i "nupadhy3" > sprint2/nupadhy3.commits.txt
git ls-tree -r HEAD --name-only website/public | grep -Ev "\.(png|jpeg)$" | xargs -n 1 git blame --since="2023-03-15" | grep -i "nupadhy3" >> sprint2/nupadhy3.commits.txt
