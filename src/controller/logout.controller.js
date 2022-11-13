const db = require('../model/data')

class login {
    index(req, res) {
        res.cookie("loggedin", false)
        res.redirect("/login");
    }
}

module.exports = new login;