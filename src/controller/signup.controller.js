const db = require('../model/data')

class login {
    index(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;
        var nickname = req.body.nickname;
        if (password != password2) res.send("mat khau khong khop!!!")
        if (username && password&& password == password2) {
            var sql = `INSERT INTO clients (username, password, nickname) VALUES ("${username}", "${password}", "${nickname}");`;
            db.query(sql, (err, results) => {
                if (err) res.send("Ten dang nhap da duoc su dung");
                console.log(results)
                res.redirect('/login');
                res.end();
            });
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    }
}

module.exports = new login;