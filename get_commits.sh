# replace alex zhang and azhang13 with your own information
git ls-tree -r HEAD --name-only public | grep -Ev "\.(png|jpeg)$" | xargs -n 1 git blame | grep -i "Dehler" > sprint1/hdehler.commits.txt

