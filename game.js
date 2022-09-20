const canvas = document.getElementsByTagName("canvas")[0];
const g = canvas.getContext("2d");

const movement = 1;
const colors = ["#aad751", "#a2d149"]
//const colors = ["#ffaa00", "#ffff00"]
const apple = new Image();
apple.src = "resources/apple.png";

let applePos = [14, 8];
let snakeHeadPos = [8, 8];
let snakeBody = []
let action = "RIGHT"
let eaten = 0;

document.addEventListener("keydown", (e) => {
    let keyCode = e.which || e.keyCode;

    switch(keyCode) {
        //S
        case 87:
            action = "DOWN";
            break;
        //W
        case 83:
            action = "UP";
            break;
        //D
        case 68:
            action = "RIGHT";
            break;
        //A
        case 65:
            action = "LEFT";
        default:
            break;
    }
});

let count = 0;

gameLoop();
function gameLoop() {
    count++;
    draw();

    if(count == 2){
        count = 0;
        moveBody();
        move();
    }

    isEating();
    isOnCorner();
    isInSelf();

    setTimeout(gameLoop, 50);
}

function isInSelf() {
    for(pos of snakeBody) {
        if(!(snakeHeadPos[0] == pos[0] && snakeHeadPos[1] == pos[1])) continue;

        gameOver();
    }
}

function isOnCorner() {
    let x = snakeHeadPos[0];
    let y = snakeHeadPos[1];

    if((x == 20 || x == -1) || (y == -1 || y == 18)) {
        gameOver();
    }
}

function gameOver() {
    window.alert("Dein Score: " + eaten);
    window.location = "/Snake";
}

function isEating() {
    if(snakeHeadPos[0] == applePos[0] && snakeHeadPos[1] == applePos[1]) {
        addBody();
        draw();
        eaten++;
        spawnApple();
        updateScore();
    }
}

function move() {
    switch(action) {
        case "RIGHT":
            snakeHeadPos[0]+=movement;
            break;
        case "LEFT":
            snakeHeadPos[0]-=movement;
            break;
        case "UP":
            snakeHeadPos[1]+=movement;
            break;
        case "DOWN":
            snakeHeadPos[1]-=movement;
            break;
        default:
            window.alert("Unknown action '" + action + "'")
            break;
    }
}

function moveBody() {
    for (let i = 0; i < snakeBody.length; i++) {
        try{
            snakeBody[i][0] = snakeBody[i+1][0];
            snakeBody[i][1] = snakeBody[i+1][1];
        }catch(e) {
            snakeBody[i][0] = snakeHeadPos[0];
            snakeBody[i][1] = snakeHeadPos[1];
        }
    }
}

function draw(){
    drawBackground();

    //Draw snake
    drawSnake(); 

    //Draw apple
    drawApple();
}

function drawSnake() {
    //g.fillStyle = "rgb(" + rand(255) + ", " + rand(255) + "," + rand(255) + ")";
    g.fillStyle = "#0022ff";

    setShadow(true);
    g.fillRect(snakeHeadPos[0]*25, snakeHeadPos[1]*25, 25, 25);

    for(pos of snakeBody) {
        g.fillRect(pos[0]*25, pos[1]*25, 25, 25)
    }

    setShadow(false);
    
    //EYE DRAW
    drawEyes();
}

function drawEyes() {
    g.fillStyle = "#ffffff";
    switch(action) {
        case "DOWN":
            g.fillRect(snakeHeadPos[0]*25+4, snakeHeadPos[1]*25+5, 3, 3);
            g.fillRect(snakeHeadPos[0]*25+18, snakeHeadPos[1]*25+5, 3, 3);
            break;
        case "UP":
            g.fillRect(snakeHeadPos[0]*25+4, snakeHeadPos[1]*25+15, 3, 3);
            g.fillRect(snakeHeadPos[0]*25+18, snakeHeadPos[1]*25+15, 3, 3);
            break;
        case "RIGHT":
            g.fillRect(snakeHeadPos[0]*25+18, snakeHeadPos[1]*25+5, 3, 3);
            g.fillRect(snakeHeadPos[0]*25+18, snakeHeadPos[1]*25+15, 3, 3);        
            break;
        case "LEFT":
            g.fillRect(snakeHeadPos[0]*25+4, snakeHeadPos[1]*25+5, 3, 3);
            g.fillRect(snakeHeadPos[0]*25+4, snakeHeadPos[1]*25+15, 3, 3);
            break;
        default: break;
    }
}

function drawApple() {
    setShadow(true);
    g.drawImage(apple, applePos[0]*25-4, applePos[1]*25-3, 32, 30);
    setShadow(false);
}

function drawBackground() {
    let i = 0;
    for (let x = 0; x < 22; x++) {
        i++;
        for (let y = 0; y < 18; y++) {
            i++;
            g.fillStyle = i % 2 == 0 ? colors[0] : colors[1];
            g.fillRect(25*x, y*25, 25, 25); 
        }
    }
}

function setShadow(b) {
    if(b) {
        g.shadowColor = '#121212';
        g.shadowBlur = 4;
    }else{
        g.shadowColor = '';
        g.shadowBlur = 0;
    }
}

function updateScore() {
    document.getElementById("score").innerHTML = "" + eaten;
}

function addBody() {
    //When the body doesn't exist
    let snake = []

    if(moveBody.length == 0){
        snake = [snakeHeadPos[0], snakeHeadPos[1]];
    }else{
        snake = moveBody[moveBody.length-1];
    }

    switch(action) {
        case "RIGHT":
            snakeBody.push([snake[0]-1, snake[1]]);
            break;
        case "LEFT":
            snakeBody.push([snake[0]+1, snake[1]]);
            break;
        case "UP":
            snakeBody.push([snake[0], snake[1]-1]);
            break;
        case "DOWN":
            snakeBody.push([snake[0], snake[1]+1]);
            break;
        default: break;                
    }
}

function spawnApple() {
    applePos = [rand(20), rand(16)];

    if(applePos[0] == 0) spawnApple();
    if(applePos[1] == 0) spawnApple();
}

function rand(i) {
    return Math.floor(Math.random() * i);
}
