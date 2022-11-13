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
            io.emit('chat message', msg, msg.room);
        });
        socket.on('create', (room, id) => {
            socket.join(room);
            var sql_msg = `SELECT * FROM chat_app.messages` // where client_from=${id}`;
            var sql_room = `SELECT room FROM chat_app.client_room where client=${id}`;
            db.query(sql_room, (err, results) => {
                if (err) throw err;
                io.to(room).emit("get_room", results);
            });
            db.query(sql_msg, (err, results) => {
                if (err) throw err;
                io.to(room).emit("get_old_messages", results);
            });
            socket.on("get_client_in_room", (r)=>{
                var sql_c = `SELECT client FROM chat_app.client_room where room=${r}`;
                db.query(sql_c, (err, results) => {
                    if (err) throw err;
                    io.to(room).emit("res_c"+r, results);
                });
            })
        });
    });
}

module.exports = server;