const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


//login page

app.get('/login', (req, res, next) => {
  res.send(`<html><head><title>User login</title></head>
    <body>
      <form action="/login" method="POST" onSubmit='localStorage.setItem("username", document.getElementById("username").value)'>
        <input type="text" name="username" id="username" placeholder="username"><br>
        <button type="submit">Submit</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/login',(req,res)=>{
  res.redirect('/');
})

//post request for writing into the file
app.post('/', (req, res) => {
  const message =req.body.username+":"+ req.body.message;
  
  fs.appendFile('message.txt', message + '\n', (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  
  res.redirect('/');
});

//get request for reading from the file
app.get('/', (req, res) => {
  fs.readFile('message.txt', (err, data) => {
    if (err) {
      console.log(err.message);
    } else {
      const chatHistory = data ;
      
      res.send(`
        <html><head><title>Group Chat</title></head>
        <body>
          <h2>Group Chat</h2>
          <div>
            <h3>Chat:</h3>
            <pre>${chatHistory}</pre>
          </div>
          <form action="/" method="POST" onSubmit='document.getElementById("username").value=localStorage.getItem("username")'>
          <input type='hidden' name='username' id='username'><br>
          <input type='text' name='message' id="message" placeholder="Enter a message">
          
          <button type="submit">Send</button>
          </form>
        </body>
        </html>
      `);
    }
  });
});

app.listen(4000);
