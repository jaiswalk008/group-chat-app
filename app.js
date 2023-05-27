const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let users = {}; // Object to store usernames

app.get('/login', (req, res, next) => {
  res.send(`
    <html>
    <head>
      <title>User login</title>
    </head>
    <body>
      <form action="/" method="POST" id="form">
        <input type="text" name="username" placeholder="username"><br>
        <button type="submit">Submit</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/', (req, res, next) => {
  const message = req.body.message;
  const username = req.body.username;
  
  if (username) {
    users[req.ip] = username; // Store the username for the current IP
  }
  
  const formattedMessage = getMessageWithUsername(req.ip, message);
  
  fs.appendFile('message.txt', formattedMessage + '\n', (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  
  res.redirect('/');
});

app.get('/', (req, res, next) => {
  fs.readFile('message.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      const chatHistory = data || 'Send a message to start the conversation';
      
      res.status(200).send(`
        <html>
        <head>
          <title>Group Chat</title>
        </head>
        <body>
          <h2>Group Chat</h2>
          <div>
            <h3>Chat History:</h3>
            <pre>${chatHistory}</pre>
          </div>
          <form action="/" method="POST">
            <input type="text" name="message" placeholder="Enter Message"><br>
            <button type="submit">Send</button>
          </form>
        </body>
        </html>
      `);
    }
  });
});

function getMessageWithUsername(ip, message) {
  const username = users[ip];
  
  if (username) {
    return `${username}: ${message}`;
  }
  
  return message;
}

app.listen(4000);
