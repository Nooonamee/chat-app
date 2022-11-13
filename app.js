const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const io = new Server(server);
const route = require('./src/routes');
const sv = require('./src/server');
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')))
route(app, io, __dirname);
sv(io)
server.listen(3000, () => {
    console.log('listening on *:3000');
});