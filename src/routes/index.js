const login = require('./login.route');
const signup = require('./signup.route');
const logout = require('./logout.route');
function route(app, io, dirname) {
    app.post('/login', login);
    app.post('/signup', signup);
    app.post('/logout', logout);
    app.get('/signup', (req, res) => {
        res.sendFile(dirname + '/src/views/dangki.html');
    });
    app.get('/', (req, res) => {
        if (req.cookies.loggedin) {
            res.sendFile(dirname + '/src/views/index.html');
            io.on('connection', (socket) => {
                socket.emit('setuser', req.cookies.user)
            });
        }
        else res.redirect("/login")
    });
    app.get('/login', (req, res) => {
        res.sendFile(dirname + '/src/views/dangnhap.html');
    });
}

module.exports = route;