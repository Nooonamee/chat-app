const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
var mysql = require('mysql');
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'src')))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/dangnhap.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg.data.receiver+": "+msg.data.msg);
    });
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "chat_app"
});

con.connect((err) => {
    if (err) throw err;
    app.get('/client', (req, res) => {
        var sql = "SELECT * FROM clients";
        con.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.send(results);
    })})
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});