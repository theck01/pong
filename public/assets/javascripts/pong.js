
function PongPaddle (x, y, controllable, player_one) {

  // PongPaddle CONSTANTS
  this.Y_VELOCITY = 3; // normalized pixels per frame
  this.WIDTH = 3; // normalized pixels
  this.HEIGHT = 10; // normalized pixels

  // PongPaddle PROPERTIES
  this.x = x; // x position of the center of the paddle
  this.y = y; // y position of the center of the paddle
  this.controllabe = controllable; // boolean, is the paddle player controllable?
  this.player_one = player_one; // boolean, does the paddle represent player one

  // PongPaddle METHODS

  /* sets the position of the object to be nearer to y on the y  axis */
  this.move_to = function (y) {
    if (this.y < y) {
      if ((y - this.y) > this.Y_VELOCITY)
        this.y += this.Y_VELOCITY;
      else this.y = y;
    }
    else {
      if ((this.y - y) > this.Y_VELOCITY)
        this.y += this.Y_VELOCITY;
      else this.y = y;
    }
  };

  /* returns true if the y cordinate is within the bounds of the paddle, false 
   * if not */
  this.bounds = function (y) {
    if (y < (this.y + this.WIDTH/2) && y > (this.y - this.WIDTH/2))
      return true;
    return false;
  };

  /* returns the speed modifier of a ball collision at y coordinate */
  this.smod = function (y) {
    return (y - this.y)*2/this.WIDTH;
  }

  /* draws the paddle on the screen with the given drawing context and modifiers
   * for x and y sizing */
  this.draw = function (context, xmod, ymod) {
    x = Math.round((this.x - (this.WIDTH/2)) * xmod);
    y = Math.round((this.y - (this.HEIGHT/2)) * ymod);
    w = Math.round(this.WIDTH * xmod);
    h = Math.round(this.HEIGHT * ymod);
    context.fillRect(x, y, w, h);
  };
};


function PongBall (x, y) {

  // PongBall CONSTANTS
  this.SIZE = 3; // normalized pixels (side width)
  this.DEFAULT_VELOCITY = 3; // normalized pixels per frame

  // PongBall PROPERTIES
  this.x_velocity = 3; // normalized pixels per frame
  this.y_velocity = 3; // normalized pixels per frame
  this.x = x; // normalized pixels
  this.y = y; // normalized pixels
  this.x_collision = false; // is ball mid-collision with an object in the x
                            // direction
  this.y_collision = false; // is ball mid-collision with an object in the y
                            // direction

  // PongBall METHODS

  /* move changes the ball position depending on collision state and velocity */
  this.move = function () {
    if (this.x_collision) this.x_collision = false;
    else this.x += this.x_velocity;

    if (this.y_collision) this.y_collision = false;
    else this.y += this.y_velocity;
  };

  /* collides changes velocities and collision states depending on the current
   * ball velocities and collision direciton */
  this.collides = function (direction, smod) {
    if (direction == "top" && this.y_velocity < 0)
      this.y_collision = true;
    else if (direction == "bottom" && this.y_velocity > 0)
      this.y_collision = true;
    else if (direction == "left" && this.x_velocity < 0) {
      this.x_collision = true;
      if (Math.abs(this.y_velocity+smod) < this.MAX_SPEED)
        this.y_velocity += smod;
    }
    else if (direction == "right" && this.x_velocity > 0) {
      this.x_collision = true;
      if (Math.abs(this.y_velocity+smod) < this.MAX_SPEED)
        this.y_velocity += smod;
    }
  };

  /* reset moves ball to the given position with x velocity in the given direction */
  this.reset = function (x, y, x_direction) {

    this.x = x;
    this.y = y;

    if (x_direction == "left") this.x_velocity = -this.DEFAULT_VELOCITY;
    else if (x_direction == "right") this.x_velocity = this.DEFAULT_VELOCITY;
    else {
      if ((Math.random() - 0.5) < 0) this.x_velocity = -this.DEFAULT_VELOCITY;
      else this.x_velocity = this.DEFAULT_VELOCITY;
    }

    // give the ball some arbitrary y velocity between 0 and this.DEFAULT_VELOCITY
    this.y_velocity = Math.round(Math.random()*this.DEFAULT_VELOCITY);
  };

  /* draws the ball on the screen with the given drawing context and modifiers
   * for x and y sizing */
  this.draw = function (context, xmod, ymod) {
    x = Math.round((this.x - (this.SIZE/2)) * xmod);
    y = Math.round((this.y - (this.SIZE/2)) * ymod);
    w = Math.round(this.SIZE * xmod);
    h = Math.round(this.SIZE * ymod);
    context.fillRect(x, y, w, h);
  };
};


function BoundingRange (min,max) {

  // BoundingRange PROPERTIES
  this.min = min;
  this.max = max;

  // BoundingRange Methods
  
  /* bounds returns true if range bounds m, false if not */
  this.bounds = function (m) {
    if (m < this.max && m > this.min) return true;
    return false;
  };
};


function Game (players, context) {


  // Game PROPERTIES
  this.ball = new PongBall(50, 50);

  if (players == 0) {
    this.left_paddle = new PongPaddle(10,50,false,true);
    this.right_paddle = new PongPaddle(90,50,false,false);
  }
  else if (players == 1) {
    this.left_paddle = new PongPaddle(10,50,true,true);
    this.right_paddle = new PongPaddle(90,50,false,false);
  }
  else {
    this.left_paddle = new PongPaddle(10,50,true,true);
    this.right_paddle = new PongPaddle(89,50,true,false);
  }

  this.left_gutter = BoundingRange(0,9);
  this.right_gutter = BoundingRange(90,99);
  this.top_wall = BoundingRange(0,9);
  this.bottom_wall = BoundingRange(90,99);
  this.left_collision = BoundingRange(10,10+Math.abs(this.ball.x_velocity));
  this.right_collision = BoundingRange(89-Math.abs(this.ball.x_velocity),89);

  this.context = context; // drawing context for the canvas

  // GAME METHODS

  this.draw = function () {
    var xmod = $(window).width()/100;
    var ymod = $(window).height()/100;

    this.ball.draw(this.context, xmod, ymod);
    this.left_paddle.draw(this.context, xmod, ymod);
    this.right_paddle.draw(this.context, xmod, ymod);
  };

  this.step = function () {
    
    // COLLISION DETECTION 

    // check for top and bottom collisions
    if (this.top_wall.bounds(this.ball.y)) this.ball.collides("top",0);
    else if (this.bottom_wall.bounds(this.ball.y)) 
      this.ball.collides("bottom",0);

    // check for left and right paddle collisions
    if (this.left_collision.bounds(this.ball.x) && 
       this.left_paddle.bounds(this.ball.y))
      this.ball.collides("left", this.left_paddle.smod(this.ball.y));
    else if (this.right_collision.bounds(this.ball.x) && 
       this.right_paddle.bounds(this.ball.y))
      this.ball.collides("right", this.right_paddle.smod(this.ball.y));

    // check for passed balls (ADD POINT SCORING)
    if (this.left_gutter.bounds(this.ball.x)) this.ball.reset(50,50,"random");
    else if (this.right_gutter.bounds(this.ball.x)) 
      this.ball.reset(50,50,"random");


    // MOVEMENT
    
    this.ball.move();
    if (this.ball.x_velocity > 0) {
      this.left_paddle.move_to(50);
      this.right_paddle.move_to(this.ball.y);
    }
    else {
      this.left_paddle.move_to(this.ball.y);
      this.right_paddle.move_to(50);
    }

    // DRAWING
    
    this.draw();
  };
};
  


$(function () {
  var context = $('#canvas')[0].getContext('2d');
  game = new Game (0,context);
  game.draw();
});
