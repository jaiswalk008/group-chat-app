const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
app.use(bodyParser.urlencoded({ extended: true }));

let users = {}; // Object to store usernames

app.get('/login', (req, res, next) => {
  res.send(`
    <html>
    <head>
      <title>User login</title>
    </head>
    <body>
      <form action="/" id="form">
        <input type="text" name="username" placeholder="username"><br>
        <button type="submit">Submit</button>
      </form>
    </body>
    <script>
      const form = document.getElementById('form');
      form.addEvenetListener('submit',(e)=>{
        localStorage.setItem('username',e.target.username.value);
      })
      </script>
    </html>
  `);
});
const userName = localStorage.getItem('username');
console.log(userName);
app.post('/', (req, res, next) => {
  const message =userName+":"+ req.body.message;
  
  fs.appendFile('message.txt', message + '\n', (err) => {
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
      
      res.send(`
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

app.listen(4000);
