
function pongPaddle(x, y, controllable){

  // pongPaddle CONSTANTS
  this.MOVEMENT_SPEED = 10;
  this.WIDTH = 10;
  this.HEIGHT = 50;

  // pongPaddle PROPERTIES
  this.x = x;
  this.y = y;
  this.controllabe = controllable;

  // pongPaddle METHODS

  /* sets the position of the object to be nearer to destination on the y 
   * axis */
  this.move_to = function (destination) {
    if (this.y < destination) {
      if((destination - this.y) > this.MOVEMENT_SPEED)
        this.y += this.MOVEMENT_SPEED;
      else this.y = destination;
    }
    else {
      if((this.y - destination) > this.MOVEMENT_SPEED)
        this.y += this.MOVEMENT_SPEED;
      else this.y = destination;
    }
  };

  /* draws the paddle on the screen with the given drawing context and modifiers for
   * x and y sizing */
  this.draw = function (context, xmod, ymod) {
    x = (this.x - (this.WIDTH/2)) * xmod;
    y = (this.y - (this.HEIGHT/2)) * ymod;
    w = this.WIDTH * xmod;
    h = this.HEIGHT * ymod;
    context.fillRect(x, y, w, h);
  };
};

$(function () {
  var paddle = new pongPaddle( 20, 100, false );
  var context = $('#canvas')[0].getContext('2d');
  paddle.draw(context, 1, 1);
});
