const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

app.use(bodyParser.json());
app.use(cors({origin: ['http://localhost:4200', 'http://127.0.0.1:4200'], credentials: true}));

const chatList = [
    {id: 0, sender: {id: "1", name: "Thomas", avatar: "thomas.jpg",},title: "First Chat", timestamp: (new Date(2024, 5, 26, 10, 31)).getTime()},
    {id: 1, sender: {id: "2", name: "Emmanuelle", avatar: "emmanuelle.jpg",},title: "Second Chat", timestamp: (new Date(2024, 5, 27, 15, 12)).getTime()},
    {id: 2, sender: {id: "3", name: "Christian", avatar: "christian.jpg",},title: "Third Chat", timestamp: (new Date(2024, 5, 28, 11, 43)).getTime()},
];

const chatContent = [
    [{idChatRoom: 0, sender: {name: "Thomas", avatar: "thomas.jpg"}, text: "Welcome to my chat First Chat", timestamp: (new Date(2024, 5, 26, 10, 31)).getTime()}],
    [{idChatRoom: 1, sender: {name: "Emmanuelle", avatar: "emmanuelle.jpg"}, text: "Welcome to my chat Second Chat", timestamp: (new Date(2024, 5, 27, 15, 12)).getTime()}],
    [{idChatRoom: 2, sender: {name: "Christian", avatar: "christian.jpg"}, text: "Welcome to my chat Third Chat", timestamp: (new Date(2024, 5, 28, 11, 43)).getTime()}],
];

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    next();
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('send-message', (message) => {
    message.timestamp = Date.now();
    chatContent[message.idChatRoom].push(message);
    io.emit('broadcast-message', message);
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Chat server</h1>');
});

app.post('/login', (req, res) => {
    if(req.body.login === 'admin' && req.body.password === 'admin'){
        res.status(200);
        res.json({response: 'The login and password are right'});
    }else{
        res.status(403);
        res.json({response: 'The login or password are wrong !!!'});
    }
});

app.get('/chat/list', (req, res) => {
    res.json(chatList);
});

app.get('/chat/:id', (req, res) => {
    const chatId = req.params.id;
    if(chatId >= 0 && chatId < chatContent.length){
        res.json(chatContent[req.params.id]);
    }else{
        res.status(404);
        res.json({message: "This chat doesn't exist"});
    }
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});