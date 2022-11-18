const db = require('../model/data')

class login {
    index(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            // var sql = 
            //     `SELECT * FROM chat_app.messages as m, chat_app.clients as c where m.client_from=c.client_id and 
            //     username="${username}" and password="${password}"`;
            var sql = `SELECT * FROM clients where username="${username}" and password="${password}"`;
            db.query(sql, (err, results) => {
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
    }
}

module.exports = new login;