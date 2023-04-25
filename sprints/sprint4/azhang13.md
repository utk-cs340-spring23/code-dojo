# Sprint 4
<!-- (include your name, github id, and group name here) -->
- **Name:** Alex Zhang
- **github id:** alexmingzhang
- **group name:** code dojo

### What you planned to do
<!-- (Give a short bulleted list of the items you planned to do for this sprint. Include the github issue number and link to the issue) -->
- Implement multiple-choice questions https://github.com/utk-cs340-spring23/code-dojo/issues/89
- Implement code questions https://github.com/utk-cs340-spring23/code-dojo/issues/92
- Fix host page for Google Chrome https://github.com/utk-cs340-spring23/code-dojo/issues/91
- Allow variable number of answer choices for multiple-choice questions https://github.com/utk-cs340-spring23/code-dojo/issues/93
- Sandbox code submissions in Docker https://github.com/utk-cs340-spring23/code-dojo/issues/100
- Set maximum running time for running code submissions https://github.com/utk-cs340-spring23/code-dojo/issues/101



### What you did not do
<!-- (Give a short bulleted list of the items that you planned to do, but did not accomplish) -->
- Allow variable number of answer choices for multiple-choice questions https://github.com/utk-cs340-spring23/code-dojo/issues/93
- Sandbox code submissions in Docker https://github.com/utk-cs340-spring23/code-dojo/issues/100
- Set maximum running time for running code submissions https://github.com/utk-cs340-spring23/code-dojo/issues/101


### What problems you encountered
<!-- (List the problems you encountered) -->
- Implementing the different question styles was more work than anticipated.
- The project is becoming disorganized, and it is getting difficult to find where specific features are implemented as well as adding new features.
- Did not get around to implementing back-end for other members' features.

### Issues you worked on
<!-- (List the specific github issues that you worked on with a link to the issue (ex: #1 Sample Issue) -->
- Implement multiple-choice questions https://github.com/utk-cs340-spring23/code-dojo/issues/89
- Implement code questions https://github.com/utk-cs340-spring23/code-dojo/issues/92
- Fix host page for Google Chrome https://github.com/utk-cs340-spring23/code-dojo/issues/91


### Files you worked on
<!-- (Give a bulleted list of the files in your github repo that you worked on. Give the full pathname.) -->
- code-dojo/public/quizPage.html
- code-dojo/public/teacherPage.html
- code-dojo/public/js/host.js
- code-dojo/public/js/quiz.js
- code-dojo/server/host.ts
- code-dojo/server/player.ts
- code-dojo/server/question.ts
- code-dojo/server/quizroom.ts
- code-dojo/server/runcode.ts
- code-dojo/server/server.ts

### What you accomplished
<!-- (Give a description of the features you added or tasks you accomplished. Provide some detail here. This section will be a little longer than the bulleted lists above) -->
- Created an arbitrary "Question" base class with derived classes for each of the question types (free response, multiple choice, code), with an over-rideable `check_answer()` method for each
- Implemented a (rather crude) way of compiling and running player submitted code; currently runs on the server's bare metal, but we plan to sandbox this process
- Used asynchronous functions to compile and run player submitted code in parallel
- Began work on a quiz results page, using the charts.js library create histograms of player answers for each question
