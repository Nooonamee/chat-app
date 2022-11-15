const db = require('./data')

class client {
    get_allClient(){};
    get_ClientByUserPw(username, password) {

        var sql = `SELECT * FROM chat_app.clients where username="${username}" and password="${password}"`;
        var rs
        db.query(sql, (err, results) => {
            if (err) throw err;
            rs = results;
        });
        return rs
    }
}

module.exports = new client;