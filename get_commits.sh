# replace alex zhang and azhang13 with your own information
git ls-tree -r head --name-only public | xargs -n 1 git blame | grep -i "alex zhang" > sprint1/azhang13.commits.txt
git ls-tree -r head --name-only server | xargs -n 1 git blame | grep -i "alex zhang" >> sprint1/azhang13.commits.txt
