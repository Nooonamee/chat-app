$(document).ready(function () {
    $("#action_menu_btn").click(function () {
      $(".action_menu").toggle();
    });
    $("div[vinh]").click(function () {
      console.log($(this).children().siblings().children());
      $("#chat-width").text('Chat với ' + $(this).children().siblings().children()[2].innerText);
      $("img[trai]").attr("src", $(this).children().siblings().children()[0].currentSrc);
    });
    $("li[dep]").click(function () {
      $('li').removeClass();
      $(this).addClass('active');
    });
  });