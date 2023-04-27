const express = require('express');
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = 5000;

app.set('view engine', 'ejs');


// Configure session middleware
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve the login page
app.get('/', (req, res) => {
  res.render('login');
});

// Handle the login request
app.post('/login', async (req, res) => {
  const client = new OAuth2Client('358604089602-ldc0bsk5loknpk8anp8tqtu1gf486uam.apps.googleusercontent.com');
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: '358604089602-ldc0bsk5loknpk8anp8tqtu1gf486uam.apps.googleusercontent.com'
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    // Save the user's email in the session
    req.session.email = email;
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(401);
  }
});

// Protect the protected page
app.get('/protected', (req, res) => {
  const email = req.session.email;
  if (email) {
    res.send(`Hello, ${email}! This page is protected.`);
  } else {
    res.redirect(`http://localhost:${port}/auth/google/callback`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});