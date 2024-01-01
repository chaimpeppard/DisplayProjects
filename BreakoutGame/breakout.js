//board
let board;
let boardWidth = 500;
let boardHeight = 500;

let context;

//player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

let player= {
   x: boardWidth/2 - playerWidth/2,
   y: boardHeight - playerHeight - 5,
   width: playerWidth,
   height: playerHeight, 
   velocityX : playerVelocityX
 }

//ball
let ballWidth = 10;  //Making a giant ball- will it knock out lots of bricks each hit??
let ballHeight= 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}

  //blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3; //add more as game goes on
let blockMaxRows = 50; //limit rows
let blockCount = 0;

let currentLevel = 1; //NEW Initialize with first level

//starting block corner top left

let blockX = 15;
let blockY = 45;
let score = 0;
let gameOver = false;

let backgroundColor = "rgb(10, 155, 255)"; // NEW Set the initial background color


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board   (stopped at 4:50)

    //draw initial player
    // board.style.backgroundColor = "pink";
    // context.fillStyle= "yellow";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    //create blocks
    createBlocks();
}
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
context.clearRect(0,0,board.width, board.height);

    //player
    context.fillStyle= "lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    //ball
    context.fillStyle = "purple";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    
    
   //bounce ball off walls 
    if (ball.y <= 0) {
        //if ball touches top of canvas
        ball.velocityY *= -1; //reverse direction
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)){
        //if ball touches left or right of canvas
        ball.velocityX *=-1; //reverse direction
    }
    else if (ball.y + ball.height >= boardHeight){
        //if ball touches the bottom of canvas
         //game over
         context.font = "12px sans-serif";
         context.fillText("You have lost!! Try again. Or don't. Whatever you want. Press 'Space' to restart", 35, 400);
        gameOver = true;
        }

   
    //bounce the ball off player paddle
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1; //flip y direction up or down 
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1; //flip x direction left or right
    }  
   //blocks
   context.fillStyle = "black"; 
   for (let i = 0; i < blockArray.length; i++){
       let block = blockArray[i];
       if (!block.break) {
           if (topCollision(ball, block) || bottomCollision(ball, block)){
               block.break = true;
               ball.velocityY *= -1;
               blockCount -= 1; 
               score += 100;
           }
           else if (leftCollision(ball, block) || rightCollision(ball, block)){
            block.break = true;
            ball.velocityX *= -1;
            score += 100;
            blockCount -= 1;
           
           } 
           context.fillRect(block.x, block.y, block.width, block.height);
       }
   } 
//next level
if(blockCount == 0){
    score += 100*blockRows*blockColumns;
blockRows = Math.min(blockRows + 2, blockMaxRows);
playerWidth +=20;

//change the board color for the new level NEW
changeBoardColor();

createBlocks();
currentLevel++;

}

   //score
    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);

}

function changeBoardColor() {
    //NEW  Add logic to change the board color based on the current level
    switch (currentLevel) {
        case 2:
            backgroundColor = "lightpink";
            break;
        case 3:
            backgroundColor = "lightgreen";
            break;
        // Add more cases for other levels and corresponding colors
    }
}
function outOfBounds(xPosition){
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e){
    if (gameOver){
        if (e.code == "Space"){
            resetGame();
        }
    }
    if(e.code =="ArrowLeft") {
       // player.x -= player.velocityX;
       let nextPlayerX = player.x - player.velocityX;
       if (!outOfBounds(nextPlayerX)){
        player.x= nextPlayerX;
       }
    }
    else if (e.code =="ArrowRight"){
        //player.x += player.velocityX;    
        let nextPlayerX = player.x + player.velocityX;
       if (!outOfBounds(nextPlayerX)){
        player.x= nextPlayerX;
       }
    }
}
function pickles(a,b){
        return  a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner // MISSING THE D in "WIDTH"
                a.x + a.width > b.x && //a's top right corner passes b's top left corner
                a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
                a.y + a.height > b.y; //a's bottom left corner passes b's top left corner
}

function topCollision(ball, block){ //a is above b (ball is above block)
    return pickles(ball,block) && (ball.y + ball.height) >= block.y;   
}
function bottomCollision(ball, block){ //a is below b (ball is below block)
    return pickles(ball,block) && (block.y +block.height) >= ball.y;

}
function leftCollision(ball, block){ //a is left of b (ball is left of block)
    return pickles(ball,block) && (ball.x +ball.width) >= block.x;

}
function rightCollision(ball, block){ //a is right of b (ball is right of block)
    return pickles(ball,block) && (block.x + block.width) >= ball.x;              //STOPPED at 28 minutes (woohoo! 11/2/23)
}
function createBlocks(){
    blockArray =[]; //clear block array
    for (let c=0; c < blockColumns; c++){
        for (let r=0; r < blockRows; r++){
            let block = {
                x : blockX + c*blockWidth + c*10,
                y : blockY + r*blockHeight + r*10,
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArray.push(block);
        }

    }
    blockCount = blockArray.length;
}
function resetGame(){
  gameOver = false; 
  player= {
    x: boardWidth/2 - playerWidth/2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight, 
    velocityX : playerVelocityX
  } 

  ball = {
x : boardWidth/2,
  y : boardHeight/2,
  width : ballWidth,
  height : ballHeight,
  velocityX: ballVelocityX,
  velocityY: ballVelocityY

}
blockArray = [];
blockRows = 3;
score = 0;
createBlocks();
}


//IDEAS:

// different colors/ backgrounds for different levels

//player can grow longer as level gets higher

//ball speeds up

//powerups

