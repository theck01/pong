
function PongPaddle (x, y, ymin, ymax, controllable, player_one) {

  // PongPaddle CONSTANTS
  this.Y_VELOCITY = 1; // normalized pixels per frame
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
    if(this.y < y){
      if((y - this.y) > this.Y_VELOCITY)
        this.y += this.Y_VELOCITY; else this.y = y;
    }
    else{
      if((this.y - y) > this.Y_VELOCITY)
        this.y -= this.Y_VELOCITY;
      else this.y = y;
    }

    if(this.y - this.HEIGHT/2 < this.ymin) this.y = this.ymin + this.HEIGHT/2;
    if(this.y + this.HEIGHT/2 > this.ymax) this.y = this.ymax - this.HEIGHT/2;
  };

  /* returns true if the y cordinate is within the bounds of the paddle, false 
   * if not */
  this.bounds = function (y) {
    if(y < (this.y + this.HEIGHT/2) && y > (this.y - this.HEIGHT/2))
      return true;
    return false;
  };

  /* returns the speed modifier of a ball collision at y coordinate */
  this.smod = function (y) {
    return (y - this.y)*2/this.HEIGHT;
  }

  /* draws the paddle on the screen with the given drawing context and modifiers
   * for x and y sizing */
  this.draw = function (context, xoff, yoff, mod) {
    var x = (this.x - (this.WIDTH/2))*mod + xoff;
    var y = (this.y - (this.HEIGHT/2))*mod + yoff;
    var w = this.WIDTH * mod;
    var h = this.HEIGHT * mod;
    context.fillRect(x, y, w, h);
  };
};


function PongBall (x, y) {

  // PongBall CONSTANTS
  this.SIZE = 2; // normalized pixels (side width)
  this.DEFAULT_X_VELOCITY = 2; // normalized pixels per frame
  this.DEFAULT_Y_VELOCITY = 1.5; // normalized pixels per frame
  this.MAX_VELOCITY = 3;

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
    if(this.x_collision) this.x_collision = false;
    else this.x += this.x_velocity;

    if(this.y_collision) this.y_collision = false;
    else this.y += this.y_velocity;
  };

  /* collides changes velocities and collision states depending on the current
   * ball velocities and collision direciton */
  this.collides = function (direction, smod) {
    if(direction == "top" && this.y_velocity < 0){
      this.y_collision = true;
      this.y_velocity = -this.y_velocity;
    }
    else if(direction == "bottom" && this.y_velocity > 0){
      this.y_collision = true;
      this.y_velocity = -this.y_velocity;
    }
    else if(direction == "left" && this.x_velocity < 0){
      this.x_collision = true;
      this.x_velocity = - this.x_velocity;
      if(Math.abs(this.y_velocity+smod) < this.MAX_VELOCITY)
        this.y_velocity += smod;
    }
    else if(direction == "right" && this.x_velocity > 0){
      this.x_collision = true;
      this.x_velocity = - this.x_velocity;
      if(Math.abs(this.y_velocity+smod) < this.MAX_VELOCITY)
        this.y_velocity += smod;
    }
  };

  /* reset moves ball to the given position with x velocity in the given 
   * direction */
  this.reset = function (x, y, x_direction) {

    this.x = x;
    this.y = y;

    if(x_direction == "left") this.x_velocity = -this.DEFAULT_X_VELOCITY;
    else if(x_direction == "right") this.x_velocity = this.DEFAULT_X_VELOCITY;
    else{
      if((Math.random() - 0.5) < 0) this.x_velocity = -this.DEFAULT_X_VELOCITY;
      else this.x_velocity = this.DEFAULT_X_VELOCITY;
    }

    /* give the ball some arbitrary y velocity between 0 and 
     * this.DEFAULT_VELOCITY */
    this.y_velocity = Math.random()*this.DEFAULT_Y_VELOCITY*2 - 
                      this.DEFAULT_Y_VELOCITY;
  };

  /* draws the ball on the screen with the given drawing context and modifiers
   * for x and y sizing */
  this.draw = function (context, xoff, yoff, mod) {
    var x = (this.x - (this.SIZE/2)) * mod + xoff;
    var y = (this.y - (this.SIZE/2)) * mod + yoff;
    var w = this.SIZE * mod;
    var h = this.SIZE * mod;
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
    if(m < this.max && m > this.min) return true;
    return false;
  };
};


function Game (players) {

  // Game PROPERTIES
  
  this.players = players;
  this.ball = new PongBall(100, 50);

  if(players == 0){
    this.left_paddle = new PongPaddle(20,50,0,100,false,true);
    this.right_paddle = new PongPaddle(179,50,0,100,false,false);
  }
  else if(players == 1){
    this.left_paddle = new PongPaddle(20,50,0,100,true,true);
    this.right_paddle = new PongPaddle(179,50,0,100,false,false);
  }
  else{
    this.left_paddle = new PongPaddle(20,50,0,100,true,true);
    this.right_paddle = new PongPaddle(179,50,0,100,true,false);
  }

  this.left_gutter = new BoundingRange(-9,0);
  this.right_gutter = new BoundingRange(199,209);
  this.top_wall = new BoundingRange(-9,1);
  this.bottom_wall = new BoundingRange(99,109);
  this.left_collision = new BoundingRange(20,20+Math.abs(this.ball.getXVelocity()+1));
  this.right_collision = new BoundingRange(179-Math.abs(this.ball.getXVelocity()+1),179);

  // GAME METHODS

  this.draw = function (width, height, context) {
    
    var xoff = 0;
    var yoff = 0;
    var mod = 0;
    
    if(width > 2*height){
      yoff = 0;
      xoff = (width - 2*height)/2;
      mod = height/100;
    }
    else{
      xoff = 0;
      yoff = (height - width/2)/2;
      mod = width/200;
    }

    this.ball.draw(context, xoff, yoff, mod);
    this.left_paddle.draw(context, xoff, yoff, mod);
    this.right_paddle.draw(context, xoff, yoff, mod);
    
    context.moveTo(0.5+xoff,0.5+yoff);
    context.lineTo(200.5*mod+xoff,0.5+yoff);
    context.moveTo(0.5+xoff,100.5*mod+yoff);
    context.lineTo(200.5*mod+xoff,100.5*mod+yoff);
    context.stroke();
  };

  this.step = function (player1_move, player2_move) {
    
    // COLLISION DETECTION 

    // check for top and bottom collisions
    if(this.top_wall.bounds(this.ball.getY())) this.ball.collides("top",0);
    else if(this.bottom_wall.bounds(this.ball.getY())) 
      this.ball.collides("bottom",0);

    // check for left and right paddle collisions
    if(this.left_collision.bounds(this.ball.getX()) && 
       this.left_paddle.bounds(this.ball.getY())){
      this.ball.collides("left", this.left_paddle.smod(this.ball.getY()));
    }
    else if(this.right_collision.bounds(this.ball.getX()) && 
       this.right_paddle.bounds(this.ball.getY())){
      this.ball.collides("right", this.right_paddle.smod(this.ball.getY()));
    }

    // check for passed balls (ADD POINT SCORING)
    if(this.left_gutter.bounds(this.ball.getX())) this.ball.reset(50,50,"right");
    else if(this.right_gutter.bounds(this.ball.getX())) 
      this.ball.reset(150,50,"left");

    // MOVEMENT
    this.ball.move();

    if(this.players = 0){
      if(this.ball.getXVelocity() > 0){
        this.left_paddle.move_to(50);
        this.right_paddle.move_to(this.ball.getY());
      }
      else{
        this.left_paddle.move_to(this.ball.getY());
        this.right_paddle.move_to(50);
      }
    }
    else if(this.players == 1){
      if(this.ball.getXVelocity() > 0){
        this.right_paddle.move_to(this.ball.getY());
      }
      else{
        this.right_paddle.move_to(50);
      }

      if(player1_move > 0) this.left_paddle.move_to(100);
      else if(player1_move < 0) this.left_paddle.move_to(0);
    }
    else{
      if(player1_move > 0) this.left_paddle.move_to(100);
      else if(player1_move < 0) this.left_paddle.move_to(0);

      if(player2_move > 0) this.right_paddle.move_to(100);
      else if(player2_move < 0) this.right_paddle.move_to(0);
    }
  };
};
  

$(function () {
  var game = new Game (2);
  var canvas = $('#pong_table')[0];
  var player1_key = 0;
  var player2_key = 0;

  setInterval(function () {

    var width = canvas.width;
    canvas.width = 0;
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    var context = canvas.getContext('2d');
    game.draw(canvas.width, canvas.height, context);
    game.step(player1_key, player2_key);

    /* clear processed key events */
  }, 10);

  $(window).keydown(function (event) {
    switch(event.which){
      case 87:
        player1_key = -1;
        break;
      case 83:
        player1_key = 1;
        break;
      case 38:
        player2_key = -1;
        break;
      case 40:
        player2_key = 1;
        break;
      default:
        break;
    }
  });

  $(window).keyup(function (event) {
    switch(event.which){
      case 87:
        player1_key = 0;
        break;
      case 83:
        player1_key = 0;
        break;
      case 38:
        player2_key = 0;
        break;
      case 40:
        player2_key = 0;
        break;
      default:
        break;
    }
  });
});
