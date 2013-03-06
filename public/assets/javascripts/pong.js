
function PongPaddle (x, y, ymin, ymax, controllable, player_one) {

  // PongPaddle CONSTANTS
  this.Y_VELOCITY = 0.8; // normalized pixels per frame
  this.WIDTH = 2; // normalized pixels
  this.HEIGHT = 10; // normalized pixels

  // PongPaddle PROPERTIES
  this.x = x; // x position of the center of the paddle
  this.y = y; // y position of the center of the paddle
  this.ymin = ymin;
  this.ymax = ymax;
  this.controllabe = controllable; // boolean, is the paddle player 
                                   // controllable?
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
        this.y -= this.Y_VELOCITY;
      else this.y = y;
    }

    if(this.y - this.HEIGHT/2 < this.ymin) this.y = this.ymin + this.HEIGHT/2;
    if(this.y + this.HEIGHT/2 > this.ymax) this.y = this.ymax - this.HEIGHT/2;
  };

  /* returns true if the y cordinate is within the bounds of the paddle, false 
   * if not */
  this.bounds = function (y) {
    if (y < (this.y + this.HEIGHT/2) && y > (this.y - this.HEIGHT/2))
      return true;
    return false;
  };

  /* returns the speed modifier of a ball collision at y coordinate */
  this.smod = function (y) {
    return (y - this.y)*2/this.HEIGHT;
  }

  /* draws the paddle on the screen with the given drawing context and modifiers
   * for x and y sizing */
  this.draw = function (context, xmod, ymod) {
    var x = Math.round((this.x - (this.WIDTH/2)) * xmod);
    var y = Math.round((this.y - (this.HEIGHT/2)) * ymod);
    var w = Math.round(this.WIDTH * xmod);
    var h = Math.round(this.HEIGHT * ymod);
    context.fillRect(x, y, w, h);
  };
};


function PongBall (x, y) {

  // PongBall CONSTANTS
  this.SIZE = 2; // normalized pixels (side width)
  this.DEFAULT_X_VELOCITY = 1.5; // normalized pixels per frame
  this.DEFAULT_Y_VELOCITY = 1; // normalized pixels per frame
  this.MAX_VELOCITY = 2;

  // PongBall PROPERTIES
  this.x_velocity = this.DEFAULT_X_VELOCITY; // normalized pixels per frame
  this.y_velocity = Math.random()*this.DEFAULT_Y_VELOCITY*2 - 
                    this.DEFAULT_Y_VELOCITY; // normalized pixels per frame
  this.x = x; // normalized pixels
  this.y = y; // normalized pixels
  this.x_collision = false; // is ball mid-collision with an object in the x
                            // direction
  this.y_collision = false; // is ball mid-collision with an object in the y
                            // direction
                            
  // PongBall METHODS

  this.getX = function () {
    return this.x;
  };

  this.getY = function () {
    return this.y;
  };

  this.getXVelocity = function () {
    return this.x_velocity;
  }

  this.getYVelocity = function () {
    return this.y_velocity;
  }

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
    if (direction == "top" && this.y_velocity < 0){
      this.y_collision = true;
      this.y_velocity = -this.y_velocity;
    }
    else if (direction == "bottom" && this.y_velocity > 0){
      this.y_collision = true;
      this.y_velocity = -this.y_velocity;
    }
    else if (direction == "left" && this.x_velocity < 0) {
      this.x_collision = true;
      this.x_velocity = - this.x_velocity;
      if (Math.abs(this.y_velocity+smod) < this.MAX_VELOCITY)
        this.y_velocity += smod;
    }
    else if (direction == "right" && this.x_velocity > 0) {
      this.x_collision = true;
      this.x_velocity = - this.x_velocity;
      if (Math.abs(this.y_velocity+smod) < this.MAX_VELOCITY)
        this.y_velocity += smod;
    }
  };

  /* reset moves ball to the given position with x velocity in the given 
   * direction */
  this.reset = function (x, y, x_direction) {

    this.x = x;
    this.y = y;

    if (x_direction == "left") this.x_velocity = -this.DEFAULT_X_VELOCITY;
    else if (x_direction == "right") this.x_velocity = this.DEFAULT_X_VELOCITY;
    else {
      if ((Math.random() - 0.5) < 0) this.x_velocity = -this.DEFAULT_X_VELOCITY;
      else this.x_velocity = this.DEFAULT_X_VELOCITY;
    }

    /* give the ball some arbitrary y velocity between 0 and 
     * this.DEFAULT_VELOCITY */
    this.y_velocity = Math.random()*this.DEFAULT_Y_VELOCITY*2 - 
                      this.DEFAULT_Y_VELOCITY;
  };

  /* draws the ball on the screen with the given drawing context and modifiers
   * for x and y sizing */
  this.draw = function (context, xmod, ymod) {
    var x = Math.round((this.x - (this.SIZE/2)) * xmod);
    var y = Math.round((this.y - (this.SIZE/2)) * ymod);
    var w = Math.round(this.SIZE * xmod);
    var h = Math.round(this.SIZE * ymod);
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


function Game (players) {

  // Game PROPERTIES
  this.ball = new PongBall(100, 50);

  if (players == 0) {
    this.left_paddle = new PongPaddle(20,50,0,100,false,true);
    this.right_paddle = new PongPaddle(179,50,0,100,false,false);
  }
  else if (players == 1) {
    this.left_paddle = new PongPaddle(20,50,0,100,true,true);
    this.right_paddle = new PongPaddle(179,50,0,100,false,false);
  }
  else {
    this.left_paddle = new PongPaddle(20,50,0,100,true,true);
    this.right_paddle = new PongPaddle(179,50,0,100,true,false);
  }

  this.left_gutter = new BoundingRange(-9,0);
  this.right_gutter = new BoundingRange(199,209);
  this.top_wall = new BoundingRange(-9,0);
  this.bottom_wall = new BoundingRange(99,109);
  this.left_collision = new BoundingRange(20,20+Math.abs(this.ball.getXVelocity()+1));
  this.right_collision = new BoundingRange(179-Math.abs(this.ball.getXVelocity()+1),179);

  // GAME METHODS

  this.draw = function (context) {
    var xmod = $(window).width()/200;
    var ymod = $(window).height()/100;

    this.ball.draw(context, 1, 1);
    this.left_paddle.draw(context, 1, 1);
    this.right_paddle.draw(context, 1, 1);
    
    context.moveTo(-0.5,-0.5);
    context.lineTo(200.5,-0.5);
    context.moveTo(-0.5,100.5);
    context.lineTo(200.5,100.5);
    context.stroke();
  };

  this.step = function () {
    
    // COLLISION DETECTION 

    // check for top and bottom collisions
    if (this.top_wall.bounds(this.ball.getY())) this.ball.collides("top",0);
    else if (this.bottom_wall.bounds(this.ball.getY())) 
      this.ball.collides("bottom",0);

    // check for left and right paddle collisions
    if (this.left_collision.bounds(this.ball.getX()) && 
       this.left_paddle.bounds(this.ball.getY())){
      this.ball.collides("left", this.left_paddle.smod(this.ball.getY()));
    }
    else if (this.right_collision.bounds(this.ball.getX()) && 
       this.right_paddle.bounds(this.ball.getY())){
      this.ball.collides("right", this.right_paddle.smod(this.ball.getY()));
    }

    // check for passed balls (ADD POINT SCORING)
    if (this.left_gutter.bounds(this.ball.getX())) this.ball.reset(100,50,"right");
    else if (this.right_gutter.bounds(this.ball.getX())) 
      this.ball.reset(100,50,"left");

    // MOVEMENT
    this.ball.move();
    if (this.ball.getXVelocity() > 0) {
      this.left_paddle.move_to(50);
      this.right_paddle.move_to(this.ball.getY());
    }
    else {
      this.left_paddle.move_to(this.ball.getY());
      this.right_paddle.move_to(50);
    }
  };
};
  

$(function () {
  var game = new Game (0);
  var canvas = $('#pong_table')[0];

  setInterval(function () {

    var width = canvas.width;
    canvas.width = 0;
    canvas.width = width;

    var context = canvas.getContext('2d');
    game.draw(context);
    game.step();
  }, 16);
});
