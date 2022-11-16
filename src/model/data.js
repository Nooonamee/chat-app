const mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "chat_app2"
});

module.exports = con;