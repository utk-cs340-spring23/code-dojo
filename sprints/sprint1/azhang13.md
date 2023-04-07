# Sprint 1
<!-- (include your name, github id, and group name here) -->
- **Name:** Alex Zhang
- **github id:** alexmingzhang
- **group name:** code dojo

### What you planned to do
<!-- (Give a short bulleted list of the items you planned to do for this sprint. Include the github issue number and link to the issue) -->

- Set up Node.js server https://github.com/utk-cs340-spring23/code-dojo/issues/2
- Get user input using Node.js https://github.com/utk-cs340-spring23/code-dojo/issues/5
- Create quiz host panel https://github.com/utk-cs340-spring23/code-dojo/issues/15
- Create quiz rooms https://github.com/utk-cs340-spring23/code-dojo/issues/16
- Player nicknames https://github.com/utk-cs340-spring23/code-dojo/issues/25
- Keep track of player stats https://github.com/utk-cs340-spring23/code-dojo/issues/31
- Full migration to TypeScript https://github.com/utk-cs340-spring23/code-dojo/issues/28
- Integrate front-end with back-end https://github.com/utk-cs340-spring23/code-dojo/issues/26

### What you did not do
<!-- (Give a short bulleted list of the items that you planned to do, but did not accomplish) -->
- Full migration to TypeScript https://github.com/utk-cs340-spring23/code-dojo/issues/28
- Integrate front-end with back-end https://github.com/utk-cs340-spring23/code-dojo/issues/26

### What problems you encountered
- Issues with setting up a Docker Image for development

### Issues you worked on
- Set up Node.js server https://github.com/utk-cs340-spring23/code-dojo/issues/2
- Get user input using Node.js https://github.com/utk-cs340-spring23/code-dojo/issues/5
- Create quiz host panel https://github.com/utk-cs340-spring23/code-dojo/issues/15
- Create quiz rooms https://github.com/utk-cs340-spring23/code-dojo/issues/16
- Player nicknames https://github.com/utk-cs340-spring23/code-dojo/issues/25
- Keep track of player stats https://github.com/utk-cs340-spring23/code-dojo/issues/31

### Files you worked on
<!-- (Give a bulleted list of the files in your github repo that you worked on. Give the full pathname.) -->
- code-dojo/public/host.html
- code-dojo/public/host.js
- code-dojo/public/index.html
- code-dojo/public/quiz.html
- code-dojo/public/quiz.js
- code-dojo/public/util.js
- code-dojo/server/player.ts
- code-dojo/server/quizroom.ts
- code-dojo/server/server.ts

### What you accomplished
<!-- (Give a description of the features you added or tasks you accomplished. Provide some detail here. This section will be a little longer than the bulleted lists above) -->
- Set up the base node.js server which communicates to the client via HTTP
- Established communication channel for client to send information to the server (answer submissions and question pushing via the socket.io node package)
- Created a functioning quiz host panel to update the displayed question for all players
- Created quiz rooms, so hosts can create their individual rooms for players to join
- Allowed players to choose nickname; used to track user by their preferred name instead of their Socket ID
- Added a stat tracking system for players (e.g. number of questions correct or incorrect); viewable in the host panel
- Proper error checking and verbose error logging; will be toned down in future iterations
