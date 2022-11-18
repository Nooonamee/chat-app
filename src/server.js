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
            var sql_msg = `SELECT * FROM messages` // where client_from=${id}`;
            var sql_room = `SELECT room FROM client_room where client=${id}`;
            db.query(sql_room, (err, results) => {
                if (err) throw err;
                io.to(room).emit("get_room", results);
            });
            db.query(sql_msg, (err, results) => {
                if (err) throw err;
                io.to(room).emit("get_old_messages", results);
            });
            socket.on("get_client_in_room", (r)=>{
                var sql_c = `SELECT client FROM client_room where room=${r}`;
                db.query(sql_c, (err, results) => {
                    if (err) throw err;
                    io.to(room).emit("res_c"+r, results);
                });
            })
            socket.on("out_room", (r_c, id)=>{
                var sql_c = `DELETE FROM client_room WHERE client=${id} and room=${r_c};`;
                db.query(sql_c, (err, results) => {
                    if (err) throw err;
                    io.to(room).emit("out_done");
                });
            })
            socket.on("search_client", (key, id)=> {
                var sql_c = `SELECT * FROM clients where nickname like "%${key}%" and client_id <> ${id};`;
                db.query(sql_c, (err, results) => {
                    if (err) throw err;
                    io.to(room).emit("search_client_rs", results);
                });
            }) 
            socket.on("add_f", (id1, id2)=> {
                var room_id = id1+""+id2
                if (id1>id2) room_id = id2+""+id1 
                const promise = new Promise((resolve)=>{
                    db.query(`INSERT INTO rooms (room_id,name) VALUES(${room_id},"");`, (err) => {
                        if (err) throw err;
                        resolve()
                    });
                })
                promise.then(()=>{
                    db.query(`INSERT INTO client_room(client,room) VALUES(${id1},${room_id});`, (err) => {
                        if (err) throw err;
                    });
                }).then(()=>{
                    db.query(`INSERT INTO client_room(client,room) VALUES(${id2},${room_id});`, (err) => {
                        if (err) throw err;
                    });
                })
                io.to(room).emit("add_done", id2, room_id);
            }) 
            socket.on("create_room_1-n", (members) => {
                var room_id = ""
                members.forEach(element => {
                    room_id+=element
                });
                const promise = new Promise((resolve)=>{
                    db.query(`INSERT INTO rooms (room_id,name) VALUES(${room_id},"");`, (err) => {
                        if (err) throw err;
                        resolve()
                    });
                })
                promise.then(()=>{
                    members.forEach(element => {
                        db.query(`INSERT INTO client_room(client,room) VALUES(${element},${room_id});`, (err) => {
                            if (err) throw err;
                        });
                    });
                })
            })
        });
    });
}

module.exports = server;