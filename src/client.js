var messages = document.getElementById('messages')
var contact = document.getElementById('contacts')
var form = document.getElementById('form')
var input = document.getElementById('input')
var usercurent = ""
var sk_room = "room"
var msgs
var room
var r_c
var friend=[]
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
        msgs.push({
            client_from: usercurent.client_id,
            date_send: date,
            mess: input.value,
            mess_id: 0,
            room_to: room
        })
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
        var im
        if (usercurent.client_id == msg.client) {
            content = 
            `<div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send">
                    ${msg.mess}
                    <span class="msg_time_send">${msg.date}</span>
                </div>
                <div class="img_cont_msg">
                    ${usercurent.client_id > 3 ?
                        `<img src="./views/imgs/0.jpg" class="rounded-circle user_img_msg">`
                        :
                        `<img src="./views/imgs/${usercurent.client_id}.jpg" class="rounded-circle user_img_msg">`
                    }
                </div>
            </div>`
        }
        else {
            content = 
            `<div class="d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                ${msg.client > 3 ?
                    `<img src="./views/imgs/0.jpg" class="rounded-circle user_img_msg">`
                    :
                    `<img src="./views/imgs/${msg.client}.jpg" class="rounded-circle user_img_msg">`
                }
                </div>
                <div class="msg_cotainer">
                    ${msg.mess}
                    <span class="msg_time">${msg.date}</span>
                </div>
            </div>`
        }
        messages.innerHTML += content;
        window.scrollTo(0, document.body.scrollHeight);
    }
});

setTimeout(()=>socket.emit("create", sk_room, usercurent.client_id),500)

socket.on("get_room", (res) => {
    res.forEach(r => {
        var img_r = ""
        socket.emit("get_client_in_room",(r.room))
        socket.once("res_c"+r.room, (c)=> {
            console.log(c)
            c.forEach(i=>{
                if(i.client!=usercurent.client_id) {
                    img_r += i.client+""
                    if(!friend.find(e=>e==i.client)) friend.push(i.client)
                }
            })
            render_room(r.room, img_r)
        })
    })
    setTimeout(() => {
        render_msg()
    }, 100);
})

function render_room(r, id) {
    contact.innerHTML +=
        `<li class="room room${r}" id="${r}"> 
            <div class="d-flex bd-highlight">
                <div class="img_cont">
                    <img src="./views/imgs/${get_img(id)}.jpg" class="rounded-circle user_img img${r}">
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                    <span class="user_nickname name${r}">${get_name(id)}</span>
                    <p>online</p>
                </div>
            </div>
        </li>`
}

socket.on("get_old_messages", (res) => {
    msgs = res;
})

function render_msg() {
    var rooms = document.querySelectorAll('.room')
    rooms.forEach(r => {
        if (r.classList.contains("active")) room = r.id;
        r.addEventListener('click', (e) => {
            r_c = r.id
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
                    var date = new Date(msg.date_send)
                    date = date.getDate()+'-'+(date.getMonth())+'-'+date.getFullYear();
                    if (usercurent.client_id == msg.client_from) {
                        content =
                            `<div class="d-flex justify-content-end mb-4">
                                <div class="msg_cotainer_send">
                                    ${msg.mess}
                                    <span class="msg_time_send">${date}</span>
                                </div>
                                <div class="img_cont_msg">
                                    ${
                                        msg.client_from > 3 ?
                                        `<img src="./views/imgs/0.jpg" class="rounded-circle user_img_msg">`
                                        :
                                        `<img src="./views/imgs/${msg.client_from}.jpg" class="rounded-circle user_img_msg">`
                                    }
                                </div>
                            </div>`
                    }
                    else content =
                        `<div class="d-flex justify-content-start mb-4">
                                <div class="img_cont_msg">
                                ${
                                    msg.client_from > 3 ?
                                    `<img src="./views/imgs/0.jpg" class="rounded-circle user_img_msg">`
                                    :
                                    `<img src="./views/imgs/${msg.client_from}.jpg" class="rounded-circle user_img_msg">`
                                }
                                </div>
                                <div class="msg_cotainer">
                                    ${msg.mess}
                                    <span class="msg_time">${date}</span>
                                </div>
                            </div>`
                    messages.innerHTML += content;
                }
            })
            document.getElementsByClassName('tn')[0].innerHTML=dem+" tin nhắn"
        })
    });
}

var action_menu_btn = document.querySelector("#action_menu_btn")
var action_menu = document.querySelector(".action_menu")
var btn_out = document.querySelector(".btn_out")
var create_room_with = document.querySelector(".create_room_with")
var add_mem = document.querySelector(".add_mem")
action_menu_btn.addEventListener("click", ()=> {
    action_menu.classList.toggle("display_none")
    create_room_with.innerHTML=`<i class="fas fa-users"></i>Tạo nhóm với `+document.querySelector('.name'+room).innerHTML
})
create_room_with.addEventListener("click", () => {
    modal.style = "display: block";
    modal__body.innerHTML = `<div>Chọn thêm thành viên</div>`
    var mem = []
    socket.emit("get_client_in_room",(room))
    socket.once("res_c"+room, (c)=> {
        c.forEach(element=>{console.log(element);mem.push(element.client)})
    })
    setTimeout(() => {
        friend.map(e=>{
            console.log(mem)
            modal__body.innerHTML +=
                `<li class="rs room" id=""> 
                    <div class="d-flex bd-highlight">
                        <div class="img_cont">
                            <img src="./views/imgs/${get_img(e)}.jpg" class="rounded-circle user_img">
                            <span class="online_icon"></span>
                        </div>
                        <div class="rs_user">
                            <span class="user_nickname">${get_name(e)}</span>
                            <p>online</p>
                        </div>
                    </div>
                    ${
                        mem.find(x=>x==e) ?
                        `<input type="checkbox" class="select_to_room" name="${e}" checked>`
                        :
                        `<input type="checkbox" class="select_to_room" name="${e}">`
                    }
                </li>`
        })
        modal__body.innerHTML += '<button type="submit" class="btn_create_room">Tạo nhóm</button>'
        document.querySelector(".btn_create_room").addEventListener("click", ()=>{
            var friends = document.querySelectorAll(".select_to_room")
            var members = [usercurent.client_id]
            friends.forEach(e=>{
                if (e.checked) members.push(parseInt(e.name))
            })
            console.log(members)
            if (members.length<3) alert("Chọn ít nhất 1 thành viên")
            else {
                socket.emit("create_room_1-n", members)
                var img = ""
                var r = usercurent.client_id
                members.forEach(element => {
                    img+=element
                    r+=element
                });
                render_room(r, img)
            }
        })
    }, 300);
})
btn_out.addEventListener("click", ()=> {
    socket.emit("out_room", r_c, usercurent.client_id)
    console.log(document.querySelector(`.room${r_c}`).remove())
})
socket.on("out_done", ()=>{
    alert("đã thoát")
})
add_mem.addEventListener("click", ()=> {
    modal.style = "display: block";
    modal__body.innerHTML = `<div>Chọn thêm thành viên</div>`
    friend.map(e=>{
        modal__body.innerHTML +=
            `<li class="rs room" id=""> 
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="./views/imgs/${get_img(e)}.jpg" class="rounded-circle user_img">
                        <span class="online_icon"></span>
                    </div>
                    <div class="rs_user">
                        <span class="user_nickname">${get_name(e)}</span>
                        <p>online</p>
                    </div>
                </div>
            </li>`
    })
    modal__body.innerHTML += `<button>Thêm</button>`
})

var search = document.querySelector(".search")
var modal = document.querySelector(".modal")
var modal__body = document.querySelector(".modal__body")
search.addEventListener("keydown", (e)=> {
    if (e.key == "Enter") {
        socket.emit("search_client", search.value, usercurent.client_id)
    }
})

socket.on("search_client_rs", (rs)=>{
    if(rs.length>0) {
        modal.style = "display: block";
        modal__body.innerHTML =""
        rs.forEach(e=> {
            if(e.client_id!=usercurent.client_id) modal__body.innerHTML += 
            `<li class="rs room" id=""> 
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="./views/imgs/${get_img(e.client_id)}.jpg" class="rounded-circle user_img">
                        <span class="online_icon"></span>
                    </div>
                    <div class="rs_user">
                        <span class="user_nickname">${e.nickname}</span>
                        <p>online</p>
                    </div>
                </div>
                ${friend.find(element=>element==e.client_id) ? 
                    `<p class="btn_add" value="${e.client_id}">Bạn bè</p>`
                    : 
                    `<button class="btn_add" value="${e.client_id}">Kết bạn</button>`
                }
            </li>`
        })
        var btn_adds = document.querySelectorAll("button.btn_add")
        btn_adds.forEach((btn)=> {
            btn.addEventListener("click", ()=>{
                console.log(friend)
                modal.style = "display: none";
                socket.emit("add_f", usercurent.client_id, btn.value)
            })
        })
    }
})

socket.on("add_done", (f, r)=> {
    contact.innerHTML +=
        `<li class="room room${r}" id="${r}"> 
            <div class="d-flex bd-highlight">
                <div class="img_cont">
                    <img src="./views/imgs/${get_img(f)}.jpg" class="rounded-circle user_img img${r}">
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                    <span class="user_nickname name${r}">${get_name(f)}</span>
                    <p>online</p>
                </div>
            </div>
        </li>`
})

function handleOff() {
    modal.style = "display: none";
}



