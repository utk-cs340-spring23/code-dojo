# Sprint 2
<!-- (include your name, github id, and group name here) -->
- **Name:** Alex Zhang
- **github id:** alexmingzhang
- **group name:** code dojo

### What you planned to do
<!-- (Give a short bulleted list of the items you planned to do for this sprint. Include the github issue number and link to the issue) -->
- Migrate Server Code to TypeScript https://github.com/utk-cs340-spring23/code-dojo/issues/28
- Create Host and Player classes https://github.com/utk-cs340-spring23/code-dojo/issues/27
- Add question timer https://github.com/utk-cs340-spring23/code-dojo/issues/32 https://github.com/utk-cs340-spring23/code-dojo/issues/42
- Refactor server code https://github.com/utk-cs340-spring23/code-dojo/issues/38
- Allow host to view player submitted answers https://github.com/utk-cs340-spring23/code-dojo/issues/44
- Prevent overlapping nicknames https://github.com/utk-cs340-spring23/code-dojo/issues/41
- Let players view their scores/grades https://github.com/utk-cs340-spring23/code-dojo/issues/39
- Implement player leaderboards https://github.com/utk-cs340-spring23/code-dojo/issues/40
- Integrate front-end and back-end https://github.com/utk-cs340-spring23/code-dojo/issues/26

### What you did not do
<!-- (Give a short bulleted list of the items that you planned to do, but did not accomplish) -->
- Prevent overlapping nicknames https://github.com/utk-cs340-spring23/code-dojo/issues/41
- Let players view their scores/grades https://github.com/utk-cs340-spring23/code-dojo/issues/39
- Implement player leaderboards https://github.com/utk-cs340-spring23/code-dojo/issues/40
- Integrate front-end and back-end https://github.com/utk-cs340-spring23/code-dojo/issues/26

### What problems you encountered
Implementing a fully-synchronous timer was much harder than anticipated. In addition, of the pre-existing code had to be refactored in order to support the addition of timed questions. For example, we had to wrap questions in a class that contained time info, and defer grading from the moment the user submits to when the host closes the question.

### Issues you worked on
- Migrate Server Code to TypeScript https://github.com/utk-cs340-spring23/code-dojo/issues/28
- Create Host and Player classes https://github.com/utk-cs340-spring23/code-dojo/issues/27
- Add question timer https://github.com/utk-cs340-spring23/code-dojo/issues/32 https://github.com/utk-cs340-spring23/code-dojo/issues/42
- Refactor server code https://github.com/utk-cs340-spring23/code-dojo/issues/38
- Allow host to view player submitted answers https://github.com/utk-cs340-spring23/code-dojo/issues/44

### Files you worked on
<!-- (Give a bulleted list of the files in your github repo that you worked on. Give the full pathname.) -->
- code-dojo/public/host.html
- code-dojo/public/host.js
- code-dojo/public/quiz.html
- code-dojo/public/quiz.js
- code-dojo/public/util.js
- code-dojo/server/host.ts
- code-dojo/server/player.ts
- code-dojo/server/question.ts
- code-dojo/server/server.ts

### What you accomplished
<!-- (Give a description of the features you added or tasks you accomplished. Provide some detail here. This section will be a little longer than the bulleted lists above) -->
- Full migration to TypeScript for the server-side code base, including the addition of TypeScript-specific features like class access modifiers
- Created Host class that contains the host's preferred name and socket
- Created Player class that contains nickname, socket, answer history, and score in the current quiz
- Created Question class that contains prompt, answer, grading info, and timer info
- Started implementation of different question types with an override-able "check_answer()" method; will have specific implementation for each derived Question class
- Refactored code to use modern TypeScript-specific features such as class access modifiers, virtual/override class methods, public getters for private/protected members, etc.
- Refactored the server code base for improved readability, including the addition of comments
- Deferred question grading to when the question closes, instead of the moment when the user submits the answer
- Implemented an accurate question timer that is fully synchronous across all clients
- Implemented functionality for host to see each players' submitted answer
- Debugged specific edge-cases (e.g. synchronizing timer when a player joins a QuizRoom with a timed question)
- Extended error checking with additional checks and asserts
