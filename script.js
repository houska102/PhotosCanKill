

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var dragged = 0
var keysPressed = [];
var mouseQueue = [];
var paused = false;
var game;
var DEG2RAD = Math.PI / 180;

window.onload = () => {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext("2d")
  let width = window.innerWidth
  let height = window.innerHeight
  canvas.width = width
  canvas.height = height
  game = new Game(width,height,ctx);
  game.drawFrame();
  window.addEventListener("mousedown",(e)=>{
    console.log(e)
    if(!paused){
      mouseQueue.push({x:e.pageX , y:e.pageY});
    }
  })
}

window.addEventListener("keydown",(e)=>{
  if(e.keyCode==80){
    if(paused){
        game.unPause();
        paused = false
    } else {
      if (!game.gameOverFlag) {
        game.pause();
        paused = true;
      }
    }
  } else {
      if(!keysPressed.includes(e.keyCode)){
      keysPressed.push(e.keyCode)
    }
  }
})
window.addEventListener("keyup",(e)=>{
  for (var i = 0; i < keysPressed.length; i++) {
    if (keysPressed[i]===e.keyCode) {
      keysPressed.splice(i,1);
      break;
    }
  }
})


