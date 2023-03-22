# This script compiles all the server typescript into javascript and starts the server
# Head to localhost:3000 in your web browser to view and use the website

npx tsc -t es5 server/server.ts
node server/server.js
