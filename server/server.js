const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve HTML page with form
app.get('/', (req, res) => {
    res.send(`
    <html>
      <head>
        <title>Input Form</title>
      </head>
      <body>
        <h1>Enter some text:</h1>
        <form method="POST" action="/">
          <input type="text" name="userInput" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

// Handle form submission
app.post('/', (req, res) => {
    const userInput = req.body.userInput;
    res.send(`
    <html>
      <head>
        <title>Input Result</title>
      </head>
      <body>
        <h1>You entered:</h1>
        <p>${userInput}</p>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
