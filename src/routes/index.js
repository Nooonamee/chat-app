const login = require('./login.route');
const signup = require('./login.route');
function route(app, io, dirname) {
    app.post('/login', login);
    app.post('/signup', signup);
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