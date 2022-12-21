let express = require('express')

// Create an express app
const app = express();

// Set up a route to handle the callback
app.get('/oauth/callback', (req, res) => {
  // Extract the authorization code from the query parameters
  const code = req.query.code;
  console.log(`code: ${code}`)
  // Do something with the code, like store it in a database or use it to get an access token
  // ...

  // Send a response to the client
  res.send('Thank you for granting permission to your Reddit account!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});