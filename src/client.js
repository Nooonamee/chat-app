var messages = document.getElementById('messages')
var contact = document.getElementById('contacts')
var form = document.getElementById('form')
var input = document.getElementById('input')
var usercurent = ""
var sk_room = "room"
var msgs
var room
var li_r

if(usercurent == "") socket.on('setuser', (res) => {
    usercurent = res[0]
    sk_room += usercurent.client_id
});

form.addEventListener('submit', (e) => {
    var today = new Date()
    console.log(today)
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        // +" "+today.getSeconds()+":"+today.getMinutes()+":"+today.getHours();
    e.preventDefault();
    if (input.value) {
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

socket.on('chat message', (msg, id) => {
    if(id == room) {
        var content;
        if (usercurent.client_id == msg.client) {
            content = 
            `<div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send">
                    ${msg.mess}
                    <span class="msg_time_send">${msg.date}</span>
                </div>
                <div class="img_cont_msg">
                    <img src="./views/imgs/${usercurent.client_id}.jpg" class="rounded-circle user_img_msg">
                </div>
            </div>`
        }
        else content = 
            `<div class="d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                    <img src="./views/imgs/${msg.client}.jpg" class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer">
                    ${msg.mess}
                    <span class="msg_time">${msg.date}</span>
                </div>
            </div>`
        messages.innerHTML += content;
        window.scrollTo(0, document.body.scrollHeight);
    }
});

setTimeout(()=>socket.emit("create", sk_room, usercurent.client_id),500)

socket.on("get_room", (res) => {
    li_r = res
    res.forEach(r => {
        var img_r = ""
        socket.emit("get_client_in_room",(r.room))
        socket.once("res_c"+r.room, (c)=> {
            c.forEach(i=>{
                if(i.client!=usercurent.client_id) img_r += i.client+""
            })
            var content2 =
            `<li class="room" id="${r.room}">
                <div class="d-flex bd-highlight" vinh>
                    <div class="img_cont">
                        <img src="./views/imgs/${get_img(img_r)}.jpg" class="rounded-circle user_img img${r.room}">
                        <span class="online_icon"></span>
                    </div>
                    <div class="user_info">
                        <span class="user_nickname name${r.room}">${get_name(img_r)}</span>
                        <p>Quang Vinh đang online</p>
                    </div>
                </div>
            </li>`
            contact.innerHTML += content2;
        })
    })
    setTimeout(() => {
        render_msg()
    }, 100);
})

socket.on("get_old_messages", (res) => {
    msgs = res;
})

function render_msg() {
    var rooms = document.querySelectorAll('.room')
    rooms.forEach(r => {
        if (r.classList.contains("active")) room = r.id;
        r.addEventListener('click', (e) => {
            r.classList.add("active")
            rooms.forEach(r => r.classList.remove("active"))
            room = r.id
            var room_c = document.getElementsByClassName('room_c')
            var ava = document.getElementsByClassName('img'+room)
            var name_r=document.getElementsByClassName('name'+room)
            document.getElementsByClassName('name_c')[0].innerHTML = "Chat với "+name_r[0].innerHTML
            room_c[0].src=ava[0].src
            messages.innerHTML = ""
            var dem=0
            msgs.forEach(msg => {
                if (msg.room_to == room) {
                    dem++
                    // console.log(msg)
                    if (usercurent.client_id == msg.client_from) {
                        content =
                            `<div class="d-flex justify-content-end mb-4">
                                <div class="msg_cotainer_send">
                                    ${msg.mess}
                                    <span class="msg_time_send">${msg.date_send}</span>
                                </div>
                                <div class="img_cont_msg">
                                    <img src="./views/imgs/${msg.client_from}.jpg" class="rounded-circle user_img_msg">
                                </div>
                            </div>`
                    }
                    else content =
                        `<div class="d-flex justify-content-start mb-4">
                                <div class="img_cont_msg">
                                    <img src="./views/imgs/${msg.client_from}.jpg" class="rounded-circle user_img_msg">
                                </div>
                                <div class="msg_cotainer">
                                    ${msg.mess}
                                    <span class="msg_time">${msg.date_send}</span>
                                </div>
                            </div>`
                    messages.innerHTML += content;
                }
            })
            document.getElementsByClassName('tn')[0].innerHTML=dem+" tin nhắn"
        })
    });
}



