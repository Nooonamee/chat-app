var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var rooms = document.querySelectorAll('.room')
var usercurent = ""
var sk_room = "room"
var msgs
var room
rooms.forEach(r => {
    if(r.classList.contains("active")) room = r.id;
    r.addEventListener('click', (e) => {
        rooms.forEach(r => r.classList.remove("active"))
        r.classList.add("active")
        room = r.id
        console.log(room);
        messages.innerHTML = ""
        msgs.forEach(msg => {
            if (msg.room_to == room) {
                // console.log(msg)
                if (usercurent.client_id == msg.client_from) {
                    content = 
                    `<div class="d-flex justify-content-end mb-4">
                        <div class="msg_cotainer_send">
                            ${msg.mess}
                            <span class="msg_time_send">${msg.date_send}</span>
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
                            ${msg.mess}
                            <span class="msg_time">${msg.date_send}</span>
                        </div>
                    </div>`
                messages.innerHTML += content;
            }
        })
    })
});

if(usercurent == "") socket.on('setuser', (res) => {
    usercurent = res[0]
    sk_room += usercurent.client_id
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
            room: room
        });
        input.value = '';
    }
});

socket.on('chat message', (msg, id, sender) => {
    if(id == room) {
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
    }
});

setTimeout(()=>socket.emit("create", sk_room, usercurent.client_id),1000)
socket.on("get_old_messages", (res) => {
    msgs = res;
    res.forEach(msg => {
        if (msg.room_to == room) {
            // console.log(msg)
            if (usercurent.client_id == msg.client_from) {
                content = 
                `<div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer_send">
                        ${msg.mess}
                        <span class="msg_time_send">${msg.date_send}</span>
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
                        ${msg.mess}
                        <span class="msg_time">${msg.date_send}</span>
                    </div>
                </div>`
            messages.innerHTML += content;
        }
    })
})
socket.on("get_room", (res) => console.log(res))
