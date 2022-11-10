socket = io();
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var usercurent = ""
var data = ""
var room = "room"

if(usercurent == "") socket.on('setuser', (db) => {
    usercurent = db[0]
    data = db
    room = room+usercurent.nickname
});

// setTimeout(()=>{
//     // if (usercurent=="") 
//     console.log('rong')
// },1000)

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        var today = new Date()
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        socket.emit('chat message', {
            nickname: usercurent.nickname,
            client: usercurent.client_id,
            mess: input.value,
            date: date,
            room: 1
        });
        input.value = '';
    }
});

socket.on('chat message', (msg, id) => {
    if(id == usercurent.room_to) {
        var item = document.createElement('li');
        item.textContent = msg;
        console.log(item)
        // messages.appendChild(item);
        messages.innerHTML += `<li>${msg}</li>`;
        window.scrollTo(0, document.body.scrollHeight);
    }
});

socket.emit("create", room)
socket.on("event", (res) => console.log(res))
