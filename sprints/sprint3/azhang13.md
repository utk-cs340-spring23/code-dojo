# Sprint 3
<!-- (include your name, github id, and group name here) -->
- **Name:** Alex Zhang
- **github id:** alexmingzhang
- **group name:** code dojo

### What you planned to do
<!-- (Give a short bulleted list of the items you planned to do for this sprint. Include the github issue number and link to the issue) -->
- Integrate front-end and back-end https://github.com/utk-cs340-spring23/code-dojo/issues/26 https://github.com/utk-cs340-spring23/code-dojo/issues/69
- Add method to get/set a player's answer to the current active question https://github.com/utk-cs340-spring23/code-dojo/issues/46
- Prevent duplicate nicknames in the same quizroom https://github.com/utk-cs340-spring23/code-dojo/issues/41
- Add question timer to host page https://github.com/utk-cs340-spring23/code-dojo/issues/73
- Allow more than one correct answer for free-response questions https://github.com/utk-cs340-spring23/code-dojo/issues/68
- Let players view their score/grade https://github.com/utk-cs340-spring23/code-dojo/issues/39
- Set up docker image for a consistent development environment https://github.com/utk-cs340-spring23/code-dojo/issues/4
- Player leaderboards https://github.com/utk-cs340-spring23/code-dojo/issues/40
- Set up Mongo DB https://github.com/utk-cs340-spring23/code-dojo/issues/3
- Create multiple question mode (multiple choice, code, etc.) https://github.com/utk-cs340-spring23/code-dojo/issues/23

### What you did not do
<!-- (Give a short bulleted list of the items that you planned to do, but did not accomplish) -->
- Player leaderboards https://github.com/utk-cs340-spring23/code-dojo/issues/40
- Set up Mongo DB https://github.com/utk-cs340-spring23/code-dojo/issues/3
- Create multiple question mode (multiple choice, code, etc.) https://github.com/utk-cs340-spring23/code-dojo/issues/23


### What problems you encountered
<!-- (List the problems you encountered) -->
- Had difficulty ensuring consistency between the VSCode extension "live server" and actual node.js server
- Could not get the node.js server to work on Windows machines; added a suitable docker container as an alternative
- Productivity bottle-necked by having to wait on other group members

### Issues you worked on
<!-- (List the specific github issues that you worked on with a link to the issue (ex: #1 Sample Issue) -->
- Integrate front-end and back-end https://github.com/utk-cs340-spring23/code-dojo/issues/26
- Fix room ID input for the home page https://github.com/utk-cs340-spring23/code-dojo/issues/69
- Add functionality to easily get and set a player's answer to the current active question https://github.com/utk-cs340-spring23/code-dojo/issues/46
- Prevent overlapping nicknames https://github.com/utk-cs340-spring23/code-dojo/issues/41
- Add question timer to host page https://github.com/utk-cs340-spring23/code-dojo/issues/73
- Allow more than one correct answer for free-response questions https://github.com/utk-cs340-spring23/code-dojo/issues/68
- Let players view their score/grade https://github.com/utk-cs340-spring23/code-dojo/issues/39
- Set up docker image for development environment https://github.com/utk-cs340-spring23/code-dojo/issues/4


### Files you worked on
<!-- (Give a bulleted list of the files in your github repo that you worked on. Give the full pathname.) -->
- code-dojo/public/index.html
- code-dojo/public/ABOUT_PAGE/aboutPage.html
- code-dojo/public/quizPage.html
- code-dojo/public/teacherPage.html
- code-dojo/public/css/quizPage.css
- code-dojo/public/js/host.js
- code-dojo/public/js/index.js
- code-dojo/public/js/quiz.js
- code-dojo/public/js/teacherPage.js
- code-dojo/public/FAQ_PAGE/faqPage.html
- code-dojo/server/host.ts
- code-dojo/server/player.ts
- code-dojo/server/question.ts
- code-dojo/server/quizroom.ts
- code-dojo/server/server.ts
- code-dojo/Dockerfile
- code-dojo/docker-compose.yml

### What you accomplished
<!-- (Give a description of the features you added or tasks you accomplished. Provide some detail here. This section will be a little longer than the bulleted lists above) -->
- Successfully integrated front-end and back-end components to produce a cohesive and unified website
- Used URL parameters to transmit information between web pages
- Added method for getting/setting a player's answer to the current question in the quiz room
- Full conversion to TypeScript access modifiers
- Began work on multiple question modes using an abstract class
- Added check to prevent duplicate nicknames in the same quizroom
- Included a question timer for the host page
- Add score counter for quiz page
- Set up docker image for preparation in development and testing with MongoDB
