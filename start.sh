#!/bin/bash

# This script compiles all the server typescript into javascript and starts the server
# If you're running this without docker, then you can go to http://localhost:3000 to view the webiste

npx tsc --project ./tsconfig.json
node server/server.js
