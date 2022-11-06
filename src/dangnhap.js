const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

var form = $('form');
var input = $('.sign-btn');
var username = $(".username")
var password = $(".password")

// form.addEventListener('submit', (e) => {
//     // e.preventDefault();
//     if (username.value) {
//         socket.emit('user',{
//             username: username.value,
//             password: password.value
//         });
//     }
//     else console.log("haven't value!!")
// });

socket.on('login', (user) => {
    if(user!="") {
        socket.emit('user_login', user);
        window.location="/"
    }
    else {
        console.log("dang nhap lai ngay")
    }
});