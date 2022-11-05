var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var name = prompt("Tên bạn là: ")

console.log(form)

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', {
            status: "success",
            messages: input.value,
            data: {
                receiver: name,
                msg: input.value
            }
        });
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});