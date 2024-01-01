// 1) array of objects each with x and y

// 2) array will loop thru, and draw object.x and object.y

//let's skip "more efficiently" for now"

//start off w/ one item in array- snake head, then upon eating apple, will have 2 things in array. now head - ie index 0, will
//become the NEW x and y, and the new body piece will have the OLD x and y.

//(A) install array, B) above 2) C) add new item - the body part - the head will be where the apple was


//eat an apple, add new segment which is the head's current location (x and y)(save this old head location first), head will get apple's location (x and y),
// BUT IS STILL at position 0 in the array!
//

// Now we have eaten a few more apples... head's   O O O O O the index 0- ie the snakes FACE will get the apple's location
//( you must set it in the object )

//index 1 will get OLD index 0, 2 will get old 1, ETC.

// ~END OF PSEUDO CODE~     

(function () {
    'use strict';

    const CELL_SIZE = 64;

    const canvas = document.querySelector('#theCanvas');
    function resizeCanvas() {
        canvas.width = (window.innerWidth - 2) - ((window.innerWidth - 2) % CELL_SIZE);
        canvas.height = (window.innerHeight - 2) - ((window.innerHeight - 2) % CELL_SIZE);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const context = canvas.getContext('2d');

    //const snakeHead = document.querySelector('image');
    const snakeHead = new Image();
    snakeHead.src = "images/snakehead.png";
    /*setTimeout(() => {
      context.drawImage(snakeHead, 200, 200);
    }, 1000);*/

    const crashSound = document.querySelector('#crash');
    const crunchSound = document.querySelector('#crunch');

    let speed = 1000;
    let score = 0;

    class Snake {
        constructor() {
            this.parts = [{ x: 0, y: 0 }];

            this.draw();
        }

        draw() {
            this.parts.forEach(p => {    //loop through EACH object in parts, and for each one, draw snake head at that specific x and y
                context.drawImage(snakeHead, p.x, p.y);
            });

        }

        move() {
            let x = this.parts[0].x;  //take the first object in the parts array, take its x and y, and then figure out how much to move
            let y = this.parts[0].y;
            switch (direction) {
                case 'ArrowUp':
                    y -= CELL_SIZE;
                    break;
                case 'ArrowRight':
                    x += CELL_SIZE;
                    break;
                case 'ArrowDown':
                    y += CELL_SIZE;
                    break;
                case 'ArrowLeft':
                    x -= CELL_SIZE;
                    break;
            }

            if (x < 0 || x > canvas.width - CELL_SIZE
                || y < 0 || y > canvas.height - CELL_SIZE) {
                gameOver = true;
            }

            if (!gameOver) {
                this.parts[0].x = x;
                this.parts[0].y = y;

                if (this.parts[0].x === apple.x && this.parts[0].y === apple.y) {
                    score++;
                    speed = speed - (speed * 0.10);
                    crunchSound.currentTime = 0;
                    crunchSound.play();
                    apple.move();
                }
            }

            this.draw();
        }
    }

    class Apple {
        constructor() {
            this.move();
        }

        draw() {
            context.drawImage(appleImg, this.x, this.y);
        }

        move() {
            this.x = Apple.getRandomNumber(0, canvas.width - 1);
            this.y = Apple.getRandomNumber(0, canvas.height - 1);
            this.draw();
        }

        static getRandomNumber(min, max) {
            let r = Math.floor(Math.random() * ((max - min) + 1)) + min;
            return r - r % CELL_SIZE;
        }
    }

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        snake.move();
        apple.draw();
        context.font = 'bold 32px Arial';
        context.fillStyle = '#ff0000';
        context.fillText(`Score ${score}`, canvas.width - 160, 40);
        if (!gameOver) {
            setTimeout(gameLoop, speed);
        } else {
            crashSound.currentTime = 0;
            crashSound.play();
            context.font = 'bold 32px Arial';
            context.fillStyle = '#000000';
            context.fillText(`GAME OVER!!!`, (canvas.width / 2) - 80, (canvas.height / 2) - 16);
        }
    }

    let snake;
    let gameOver = false;
    snakeHead.onload = () => {
        snake = new Snake();
        // context.drawImage(snakeHead, 0, 0);
        setTimeout(gameLoop, speed);
    };

    const appleImg = new Image();
    appleImg.src = 'images/redapple.png';
    let apple = new Apple();
    appleImg.onload = () => {
        apple.draw();
    };

    let direction = 'ArrowRight';
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowRight':
            case 'ArrowDown':
            case 'ArrowLeft':
                direction = e.key;
                break;
        }
    });
}());
