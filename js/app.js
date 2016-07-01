var app = {
  canvas : {
    w : 600,
    h : 600
  },
  defaults : {
    dotWidth : 16
  }
};

var game = {
  score : 0,
  passed_fighters : 0
};


var canonballs = [];
var crossBar;
var explosion;

var delay = 5;

var debugLine = false;

var delay_count = 0;

var para_squirrels = [];

var intervalID;


var keyIsDown = false;
var currentKey;

var keys = [];

var Player = {
  x : 600 / 2,
  y : 520,
  w : 36,
  h : 98,
  rotation : 0,
  moveLeft : function() {
    // this.x -= 10;



    if(this.x > 50){
      this.x -= 10;
    } else {
      this.x = 50;
    }

  },
  moveRight : function() {
    // this.x += 10;
    if(this.x < app.canvas.w-50){
      this.x += 10;
    } else {
      this.x = app.canvas.w-50;
    }



  },
  draw : function() {

    //fill(255);
    //rect(this.x, this.y, this.w, this.h);

    image(canon,this.x, this.y, this.w, this.h);

    if(keys[39] ) {
      // right
      Player.moveRight();
    }

    if(keys[37] ) {
      // left
      Player.moveLeft();
    }

    if(keys[32] ) {

      if(delay_count == 0){
        addBullet(Player.x);
      }

    }

    if(delay_count == delay){
      delay_count = 0;
    } else {
      delay_count += 1;
    }


  }
};


function setup() {
  var myCanvas = createCanvas(app.canvas.w, app.canvas.h);
  myCanvas.parent('myContainer');

  noStroke();

  canon = loadImage("./img/canon.png");
  canonball = loadImage("./img/canonball.png");
  para_squirrel = loadImage("./img/squirrel_01.png");
  para_squirrel_01 = loadImage("./img/squirrel_00.png");
  explosion = loadImage("./img/explosion.png");

  intervalID = window.setInterval(function(){

    var xValue = random(100, 500);

    para_squirrels.push({
      beginX : xValue,  // Initial x-coordinate
      beginY : 10,  // Initial y-coordinate
      endX : xValue,   // Final x-coordinate
      endY : app.canvas.h + 20,   // Final y-coordinate
      // distX : 0,          // X-axis distance to move
      // distY : 0,          // Y-axis distance to move

      hasBeenHit : 0,

      w : 90,
      h : 90,

      // x : this.beginX,        // Current x-coordinate
      // y : this.beginY,        // Current y-coordinate
      step : 0.01,    // Size of each step along the path
      pct : 0.0,      // Percentage traveled (0.0 to 1.0)

      display : function () {

        this.pct += this.step;

        this.distX = this.endX - this.beginX;
        this.distY = this.endY - this.beginY;

        if (this.pct < 1.0) {
          this.x = this.beginX + (this.pct * this.distX);
          this.y = this.beginY + (this.pct * this.distY);
        }

        if(this.hasBeenHit){
          image(explosion,this.x, this.y, this.w, this.h);
        } else {
          //image(para_squirrel,this.x, this.y, this.w, this.h);
        }

        if(this.y > app.canvas.h/3){
          image(para_squirrel_01,this.x, this.y, this.w, this.h);
          this.step = 0.005
        } else {
          image(para_squirrel,this.x, this.y, this.w, this.h);
        }


      }
    });

  //addBullet(Player.x);

}, 750);
}

function draw() {

// clear screen:
fill(255);
rect(0, 0, app.canvas.w, app.canvas.h);

//image(gunnersview,0,0,600,600);

// draw each bullet...
for(var i=0; i<canonballs.length; i+=1){
  canonballs[i].display();

  //remove old bullets...
  if(canonballs[i].y < 20){
    canonballs.splice(i,1);
  }
}

for(var i=0; i<para_squirrels.length; i+=1){
  para_squirrels[i].display();

  if(para_squirrels[i].y >= app.canvas.h-60){

    // if not hit and passed player, then add to passed_fighters count...
    if(!para_squirrels[i].hasBeenHit){
      game.passed_fighters += 1;
      document.getElementById('passed_fighters').innerHTML = game.passed_fighters;
    }

    // remove from array
    para_squirrels.splice(i,1);

    //document.getElementById('score').innerHTML = para_squirrels[i].x;
  } else {
    //document.getElementById('passed_fighters').innerHTML = para_squirrels[i].x;
  }
}

// draw player
Player.draw();
}

function addBullet(inX){

var xValue = inX;
var yValue = app.canvas.h-80;

canonballs.push({

  beginX : xValue,  // Initial x-coordinate
  beginY : 500,  // Initial y-coordinate
  endX : xValue,   // Final x-coordinate
  endY : 0,   // Final y-coordinate
  distX : 0,          // X-axis distance to move
  distY : 0,          // Y-axis distance to move

  w : 36,
  h : 36,

  x : 300,
  y : 550,

  // x : Player.x + Player.w/2,        // Current x-coordinate
  // y : 10,        // Current y-coordinate
  step : 0.02,    // Size of each step along the path
  pct : 0.0,      // Percentage traveled (0.0 to 1.0)

  display : function () {

    this.x = Number(this.x);
    this.y = Number(this.y);

    this.pct += this.step;
    if (this.pct < 1.0) {
      this.x = this.beginX + (this.pct * this.distX);
      this.y = this.beginY + (this.pct * this.distY);
    }



    this.distX = this.endX - this.beginX;
    this.distY = this.endY - this.beginY;

    // if there are ships in the ship array
    if(para_squirrels.length > 0){
    // look to see if the x,y of this bullet is in each of the ships 2d area

      for(var i = 0; i<para_squirrels.length; i+=1){

        hit = collidePointRect(this.x, this.y,para_squirrels[i].x,para_squirrels[i].y,para_squirrels[i].w,para_squirrels[i].h); //see if the mouse is in the rect

        if(hit && !para_squirrels[i].hasBeenHit ){
          // console.log("hit",this.x, this.y,para_squirrels[i].x, para_squirrels[i].y, para_squirrels[i].w, para_squirrels[i].h);
          para_squirrels[i].hasBeenHit = true;
          game.score += 1;
          document.getElementById('score').innerHTML = game.score;
        } else{

        }

      }

    }


    image(canonball,this.x, this.y,36,36);

  }
});
}




// key events
document.body.addEventListener("keydown", function (e) {
// console.log(e.keyCode);
  //e.preventDefault()
  keys[e.keyCode] = true;
  return false;
});
document.body.addEventListener("keyup", function (e) {
  // e.preventDefault()
  keys[e.keyCode] = false;
  return false;
});
