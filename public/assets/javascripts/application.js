
function centerDiv(div_id){

  var div = $(div_id);

  var top_offset = ($(window).height() - div.height())/2;
  if (top_offset < 0) top_offset = 0;

  var left_offset = ($(window).width() - div.width())/2;
  if (left_offset < 0) left_offset = 0;

  div.css({ 
    top: top_offset + "px",
    left: left_offset + "px"
  });
}

function maximizeDiv(div_id){

  var div = $(div_id);

  div.width($(window).width());
  div.height($(window).height());
  div.css({
    top: "0px",
    left: "0px",
  });
}

$(function () {
  maximizeDiv('#canvas');
  centerDiv('#menu');
});

$(window).resize(function (event) {
  maximizeDiv('#canvas');
  centerDiv('#menu');
});


