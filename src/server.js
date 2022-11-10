const db = require('./model/data')
function server(io) {
    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            console.log(msg)
            var sql = `INSERT INTO messages (client_from, mess, date_send, room_to)VALUES (${msg.client}, "${msg.mess}","${msg.date}", ${msg.room});`;
            db.query(sql, (err, results) => {
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
            db.query(sql_room, (err, results) => {
                if (err) throw err;
                io.to(room).emit("get_room", results);
            });
            db.query(sql_msg, (err, results) => {
                if (err) throw err;
                io.to(room).emit("get_old_messages", results);
            });
        });
    });
}

module.exports = server;