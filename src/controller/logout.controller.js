class logout {
    index(req, res) {
        res.cookie("loggedin", false)
        res.redirect("/login");
    }
}

module.exports = new logout;