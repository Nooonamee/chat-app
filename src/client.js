var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var usercurent = ""
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', {
            status: "success",
            messages: input.value,
            data: {
                receiver: usercurent.nickname,
                msg: input.value
            }
        });
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user_login', (user) => {
    usercurent = user
});

socket.emit('user_login', usercurent);