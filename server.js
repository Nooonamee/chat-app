const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
var mysql = require('mysql');
// var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { Server } = require("socket.io");
const { throws } = require('assert');
const io = new Server(server);

app.use(cookieParser())
// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'src')))

app.get('/', (req, res) => {
    if (req.cookies.loggedin) {
        // console.log(req.cookies)
        res.sendFile(__dirname + '/index2.html');
        io.on('connection', (socket) => {
            socket.emit('setuser', req.cookies.user)
        });
    }
    else res.redirect("/login")
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/dangnhap.html');
});

app.post('/login', function(req, res) {
    var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
        // var sql = 
        //     `SELECT * FROM chat_app.messages as m, chat_app.clients as c where m.client_from=c.client_id and 
        //     username="${username}" and password="${password}"`;
        var sql = `SELECT * FROM chat_app.clients where username="${username}" and password="${password}"`;
        con.query(sql, (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
				res.cookie("loggedin", true)
                console.log(results)
                res.cookie("user", results)
                res.redirect('/');
			} else {
				res.send('Incorrect Username and/or Password!');
			}		
			res.end();
        });
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});
app.post('/signup', function(req, res) {
    var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
    var nickname = req.body.nickname;
    if (password != password2) res.send("mat khau khong khop!!!")
	if (username && password&& password == password2) {
        var sql = `INSERT INTO clients (username, password, nickname) VALUES ("${username}", "${password}", "${nickname}");`;
        con.query(sql, (err, results) => {
            if (err) res.send("Ten dang nhap da duoc su dung");
            console.log(results)
            res.redirect('/login');
			res.end();
        });
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/dangki.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log(msg)
        var sql = `INSERT INTO messages (client_from, mess, date_send, room_to)VALUES (${msg.client}, "${msg.mess}","${msg.date}", ${msg.room});`;
        con.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results)
        });
        io.emit('chat message', msg.mess, msg.room, msg.client);
    });
    socket.on('create', (room, id) => {
        socket.join(room);
        console.log("joined "+room)
        var sql_msg = `SELECT * FROM chat_app.messages where client_from=${id}`;
        var sql_room = `SELECT room FROM chat_app.client_room where client=${id}`;
        con.query(sql_room, (err, results) => {
            if (err) throw err;
            io.to(room).emit("get_room", results);
        });
        con.query(sql_msg, (err, results) => {
            if (err) throw err;
            io.to(room).emit("get_old_messages", results);
        });
    });

});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "chat_app"
});

// con.connect((err) => {
//     if (err) throw err;
//     app.get('/client', (req, res) => {
//         var sql = "SELECT * FROM clients";
//         con.query(sql, (err, results) => {
//             if (err) throw err;
//             console.log(results);
//             res.send(results);
//     })})
// });

server.listen(3000, () => {
    console.log('listening on *:3000');
});