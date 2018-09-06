var canvas     = document.getElementById("renderArea");
var ctx        = canvas.getContext("2d");
var width      = 10;
var x          = (canvas.width / 2) - width;
var y          = canvas.height / 2;
var tx         = x;
var ty         = y + 60;
var rightPress = false;
var leftPress  = false;
var upPress    = false;
var downPress  = false;
var keyPress   = false;
var dead       = false;
var turns      = [];
var coords     = [];
var dx         = 0;
var dy         = -2;
var tdx        = 0;
var tdy        = -2;

var timer      = 0;
var thisIndex;
var turnPos;
var score = 0;


function putScore(){
  score += 1;
  document.getElementById("score").innerHTML = "Score: " + score;
}
function generateFoodCoordX(){
  var x1 = Math.floor(Math.random() * canvas.width);
  
  if(x1 > 505)
  {
    x1 -= 5;
  }
  if(x1 < 10)
  {
    x1 += 5;
  }
  return x1;
}

function generateFoodCoordY(){
  var y1 = Math.floor(Math.random() * canvas.height);
  if(y1 > 385)
  {
    y1 -= 5;
  }
  if(y1 < 10)
  {
    y1 += 5;
  }
  document.getElementById("footer").innerHTML = "X Y: "+ randX + " " + y1;
  return y1;
}

var randX = generateFoodCoordX();
var randY = generateFoodCoordY();

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
//Method for focusing on only one
//key when it's pressed, ignoring others
//******sleep fox x milliseconds*************
function validKeys(right, left, up, down){
  rightPress = right;
  leftPress  = left;
  upPress    = up;
  downPress  = down;
}
//Contains method for array
//*******if element present in array*******
function contains(array, item){
  //Return index of this item
  thisIndex = array.indexOf(item);
  return array.indexOf(item) > -1;
}
//Adds a turn
function newTurn(pos, dir){
  turns.push(pos);
  turns.push(dir);
}
//Highlight area of death
function blink(){
  ctx.beginPath();
  ctx.rect(x, y, width, width);
  ctx.fillStyle = "#faff00";
  ctx.fill();
  ctx.closePath();
  dead = true;
}
//Render part of snake
function renderBox(){
  document.getElementById("test").innerHTML = "X Y: "+ x + " " + y;
  ctx.beginPath();
  ctx.rect(x, y, width, width);
  ctx.fillStyle = "#dd7f1a";
  ctx.fill();
  ctx.closePath();
}
//Render snake and track movement
function render(){
  turnPos = x + "," + y;

  //which key?
  if(rightPress){
    if(x < canvas.width - width && (dx != -2)){
      dx = 2;
      dy = 0;
      newTurn(turnPos, "right");
    }
  }else if(leftPress){
    if(x > width && (dx != 2)){
      dx = -2;
      dy = 0;
      newTurn(turnPos, "left");
    }
  }
  if(upPress){
    if(y > width && (dy != 2)){
      dy = -2;
      dx = 0;
      newTurn(turnPos, "up");
    }
  }else if(downPress && (dy != -2)){
    if(y < canvas.height - width){
      dy = 2;
      dx = 0;
      newTurn(turnPos, "down");
    }
  }

  //Game over? -- states
  if(y > canvas.height - width){ //touches bottom
    blink();
    clearInterval(loop);  
  }
  else if(y < 0){  //touches top
    blink();
    clearInterval(loop); 
  }

  if(x < 0){  //touches left
    blink();
    clearInterval(loop); 
  }
  else if(x > canvas.width - width){  //touches right
    blink();
    clearInterval(loop); 
  } 


  coords.push(x + "," + y);
  x += dx;
  y += dy;
  
  if(!(dead)){
    renderBox();
  }
  
  if(contains(coords, x + "," + y)){ //touches self
      blink();
      clearInterval(loop);  
  }
  //If touching food:
  //Erase food
  //Respawn food
  //Grow
  if((x > randX - width && x < randX + width) && (y > randY - width && y < randY + width)){
     putScore();
     clearFood();
     randX = generateFoodCoordX();
     randY = generateFoodCoordY();
     //Have trailer wait 200 (20 * 10) milliseconds
     timer = 20;
  }
  //Cover trail
  renderTrailer();
  //Render food bit
  renderFood();
}
//Cover area behind snake, giving
//it size
function renderTrailer(){
  ctx.beginPath();
  ctx.rect(tx, ty, width, width);
  ctx.fillStyle = "#eae2da";  //"#eae2da"
  ctx.fill();
  ctx.closePath();
  
  if(contains(turns, tx + "," + ty)){
    switch(turns[thisIndex + 1]){
      case "right":
        tdx = 2;
        tdy = 0;
        break;
      case "left":
        tdx = -2;
        tdy = 0;
        break;
      case "up":
        tdx = 0;
        tdy = -2;
        break;
      case "down":
        tdx = 0;
        tdy = 2;
        break;
    }
    //Delete item from array
    turns.splice(thisIndex, 1);
  }
  
  if(contains(coords, tx + "," + ty)){
    coords.splice(thisIndex, 1);
  }
  
  if(timer <= 0){
    tx += tdx;
    ty += tdy;
  }else{
    timer -= 1;
  }
}
//Render food bit
function renderFood(){
  ctx.beginPath();
  ctx.rect(randX, randY, width, width);
  ctx.fillStyle = "#ea0b0b";
  ctx.fill();
  ctx.closePath();
}
//Clear food bit
function clearFood(){
  ctx.beginPath();
  ctx.rect(randX, randY, width, width);
  ctx.fillStyle = "#eae2da";
  ctx.fill();
  ctx.closePath();
}


//Add key listeners
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
//Keydown
function keyDown(e) {
    keyPress = true;
    if(e.keyCode == 39) {
        validKeys(true, false, false, false); //right
    }
    else if(e.keyCode == 37) {
        validKeys(false, true, false, false); //left
    }else if(e.keyCode == 38){
        validKeys(false, false, true, false); //up
    }else if(e.keyCode == 40){
        validKeys(false, false, false, true); //down
    }
}
//Keyup
function keyUp(e){
    keyPress = false;
    if(e.keyCode == 39) {
        rightPress = false;
    }
    else if(e.keyCode == 37) {
        leftPress = false;
    }else if(e.keyCode == 38){
        upPress = false;
    }else if(e.keyCode == 40){
        downPress = false;
    }
}
//Wait 2 seconds, then start
sleep(2000);
var loop = setInterval(render, 10);
