const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

const chatList = [
    {sender: {id: "1", name: "Thomas", avatar: "picture",},title: "First Chat", timestamp: "0000"},
    {sender: {id: "2", name: "Emmanuelle", avatar: "picture",},title: "Second Chat", timestamp: "0000"},
    {sender: {id: "3", name: "Christian", avatar: "picture",},title: "Third Chat", timestamp: "0000"},
];

const chatContent = [
    {message: {sender: "Thomas", avatar: "picture"}, text: "Welcome to my chat First Chat", timestamp: "0000"},
    {message: {sender: "Emmanuelle", avatar: "picture"}, text: "Welcome to my chat Second Chat", timestamp: "0000"},
    {message: {sender: "Christian", avatar: "picture"}, text: "Welcome to my chat Third Chat", timestamp: "0000"},
];

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log('token', token);
    next();
});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Chat</h1>');
});

app.post('/login', (req, res) => {
    if(req.login === 'admin' && req.password === 'admin'){
        res.status(200);
    }else{
        res.status(403)
    }

    res.json({});
});

app.get('/chat/list', (req, res) => {
    res.json(chatList);
});

app.get('/chat/:id', (req, res) => {
    const chatId = req.params.id;
    console.log(chatId);
    if(chatId >= 0 && chatId < chatContent.length){
        res.json(chatContent[req.params.id]);
    }else{
        res.status(404);
        res.json({message: "This chat doesn't exist"});
    }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('my-message', (msg) => {
    console.log('message: ' + msg);
    io.emit('my-broadcast', `server: ${msg}`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});