![Code Dojo](public/img/dojoFavicon.png "Title")

# Code Dojo
A gamified social learning web application for computer science—like a mix of Kahoot and LeetCode.

Teachers can create quiz rooms with coding questions that students can answer in real-time.
Students can fill in solutions to coding problems and verify their answers locally.
Once completed, students can submit their answers, which get automatically graded.

## Developers

| Developer        | Github ID                                         | Role                    |
| ---------------- | ------------------------------------------------- | ----------------------- |
| Harrison Dehler  | [hdehler](https://github.com/hdehler)             | Front-end Developer     |
| Griffin Lee      | [glee30](https://github.com/Griff2325)            | Front-end Developer     |
| Nagendra Upadhy  | [nupadhy](https://github.com/nupadhy3)            | Front-end Developer     |
| Alex Zhang       | [alexmingzhang](https://github.com/alexmingzhang) | Back-end Developer      |

## Download & Installation
To use, first make sure you have [node.js](https://nodejs.org/en/) installed on your system.
Clone this repository and open a terminal, and `cd` to the code-dojo directory.
You can do this using the following commands:

    $ git clone https://github.com/utk-cs340-spring23/code-dojo.git
    $ cd code-dojo

For first-time setup, run the following commands:

    $ npm install
    $ npm run compile

## Usage
After installing, you can start the server at any time with the following command:

    $ npm start

Then head to localhost:3000 to view the home page.
From here, you can:
- **Join a quiz room** by entering the session ID and a nickname into the middle input field
- **Host a quiz room** by navigating to [Teacher Page](http://localhost:3000/teacherPage.html) in the navigation bar
- **View your notes** by navigating to [Notes](http://localhost:3000/NOTES_PAGE/notesPage.html) in the navigation bar
- **View miscellaneous info** in the [About](http://localhost:3000/ABOUT_PAGE/aboutPage.html) and [FAQ](http://localhost:3000/FAQ_PAGE/faqPage.html) sections of the navigation bar

## License

Code Dojo is licensed under the GNU General Public License v3.0 (read more [here](https://github.com/utk-cs340-spring23/code-dojo/blob/main/LICENSE)).
