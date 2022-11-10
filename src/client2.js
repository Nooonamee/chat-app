var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var usercurent = ""
var data = ""
var room = "room"

if(usercurent == "") socket.on('setuser', (db) => {
    usercurent = db[0]
    data = db
    room = room+usercurent.client_id
    // console.log(usercurent)
});

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

socket.on('chat message', (msg, id, sender) => {
    // if(id == usercurent.room_to) {
        var content;
        if (usercurent.client_id == sender) {
            content = 
            `<div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send">
                    ${msg}
                    <span class="msg_time_send">9:10 AM, Today</span>
                </div>
                <div class="img_cont_msg">
                    <img src="https://taimienphi.vn/tmp/cf/aut/anh-gai-xinh-1.jpg" class="rounded-circle user_img_msg">
                </div>
            </div>`
        }
        else content = 
            `<div class="d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                    <img src="https://kynguyenlamdep.com/wp-content/uploads/2022/06/anh-gai-xinh-cuc-dep.jpg" class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer">
                    ${msg}
                    <span class="msg_time">8:40 AM, Today</span>
                </div>
            </div>`
            
        messages.innerHTML += content;
        window.scrollTo(0, document.body.scrollHeight);
    // }
});

setTimeout(()=>socket.emit("create", room, usercurent.client_id),1000)
socket.on("get_old_messages", (res) => console.log(res))
socket.on("get_room", (res) => console.log(res))
