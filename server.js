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
        res.sendFile(__dirname + '/index.html');
        io.on('connection', (socket) => {
            socket.on('user_login', (user) => {
                console.log(user)
                if(user == req.cookies.user || user == "") io.emit('user_login', req.cookies.user)
            });
        });
    }
    else res.redirect("/login")
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/dangnhap.html');
});

app.post('/', function(req, res) {
    var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
        var sql = `SELECT * FROM clients where username="${username}" and password="${password}"`;
        con.query(sql, (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
				res.cookie("loggedin", true)
                res.cookie("user", results[0])
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

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/dangki.html');
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