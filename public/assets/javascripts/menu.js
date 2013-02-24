function centerMenu(){

  var $menu = $('#menu');

  var top_offset = ($(window).height() - $menu.height())/2;
  if (top_offset < 0) top_offset = 0;

  var left_offset = ($(window).width() - $menu.width())/2;
  if (left_offset < 0) left_offset = 0;

  $menu.css({ 
    top: top_offset + "px",
    left: left_offset + "px"
  });
}

$(function () { centerMenu(); });

$(window).resize(function (event) { centerMenu(); });


