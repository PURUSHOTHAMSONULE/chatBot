const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Webhook endpoint to handle requests from Dialogflow
app.post('/webhook', (req, res) => {
  // Extract the intent name and parameters from the request
  const intentName = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters;

  // Handle different intents
  switch (intentName) {
    case 'LoginIntent':
      handleLogin(parameters, res);
      break;
    // Add more cases for other intents as needed
    default:
      res.json({
        fulfillmentText: 'Sorry, I don\'t understand that.',
      });
  }
});

// Function to handle login intent
function handleLogin(parameters, res) {
  const email = parameters.email;
  const password = parameters.password;

  // Validate email and password (you should add your validation logic here)

  // Assuming successful validation, store the email and password in the database
  // Replace this with your actual database integration code
  // For example, using Firebase Realtime Database:
  const firebase = require('firebase-admin');
  const serviceAccount = require('./serviceAccountKey.json');
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://your-database.firebaseio.com',
  });
  const db = firebase.database();
  const usersRef = db.ref('users');
  usersRef.push({
    email: email,
    password: password,
  });

  // Send response to Dialogflow
  res.json({
    fulfillmentText: 'Your account has been registered.',
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
