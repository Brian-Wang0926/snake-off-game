const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method 會回傳一個 canvas 的 drawing context
// drawing context 可以用來在 canvas 內畫圖
const unit = 20;
const row = canvas.height / unit; // 320/20=16
const column = canvas.width / unit; // 320/20=16

let snake = [] // array中的每個元素，都是一個物件
function createSnake(){
    // 物件的工作是，儲存身體的 x, y座標
    snake[0] = {
        x: 80,
        y: 0,
    };

    snake[1] = {
        x: 60,
        y: 0,
    };

    snake[2] = {
        x: 40,
        y: 0,
    };

    snake[3] = {
        x: 20,
        y: 0,
    };
}

// 初始設定
createSnake();

// 果實
class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
    }
    // 畫一個果實
    drawFruit(){
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit); 
    }
    // 選一個位置不能與蛇重疊
    pickALocation(){
        let overlapping = false;
        let new_x;
        let new_y;

        function checkOverlap(new_x, new_y){
            for(let i = 0; i < snake.length; i++){
                if(new_x == snake[i].x && new_y == snake[i].y){
                    console.log("overlapping...")
                    overlapping = true;
                    return;
                } else {
                    overlapping = false;
                }
            }
        }

        do{
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            console.log("果實可能的座標位置",new_x, new_y);
            checkOverlap(new_x, new_y);
        } while(overlapping);

        this.x = new_x;
        this.y = new_y;
    }
}
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e){
    if(e.key == "ArrowRight" && d != "Left"){
        d = "Right";
    } else if (e.key == "ArrowDown" && d != "Up"){
        d = "Down";
    } else if (e.key == "ArrowLeft" && d != "Right"){
        d = "Left";
    } else if (e.key == "ArrowUp" && d != "Down"){
        d = "Up";
    }

    // 每次按下方向鍵後，在下一幀被畫出來前，不接受任何 keydown 事件
    // 可以防止蛇在邏輯上自殺
    window.removeEventListener("keydown",changeDirection);
}; 
let highestScore;
loadHighestScore();
let score = 0;

document.getElementById("myScore").innerHTML = "遊戲分數："+ score;
document.getElementById("myScore2").innerHTML = "最高分數："+ highestScore;
function draw(){
    // 每次畫圖前，確認蛇頭有沒有咬到自己其他部位
    for(let i = 1; i < snake.length; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            clearInterval(myGame)
            alert("GAME OVER!")
            return;
        }
    }    
    // 背景全設定為黑色
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    myFruit.drawFruit();

    // 畫出蛇
    for(let i = 0; i < snake.length; i++){
        if (i == 0){
            ctx.fillStyle = "lightgreen";
        } else {
            ctx.fillStyle = "lightBlue";
        }
        ctx.strokeStyle = "white";

        // 穿牆
        if (snake[i].x >= canvas.width ){
            snake[i].x = 0;
        } 
        if (snake[i].x < 0){
            snake[i].x = canvas.width - unit;
        }
        if (snake[i].y >= canvas.height ){
            snake[i].y = 0;
        }
        if (snake[i].y < 0){
            snake[i].y = canvas.height - unit;
        }
        //  x, y, witdh, height
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }
    //以目前d變數的方向，去決定蛇的下一幀要放哪個座標
    let snakeX = snake[0].x; // snake[0]是一個物件，但 snake[0].x 是一個 number
    let snakeY = snake[0].y;

    if (d == "Left"){
        snakeX -= unit;
    } else if (d == "Up"){
        snakeY -= unit; // 向上 Y 軸是 -
    } else if (d == "Right"){
        snakeX += unit;
    } else if (d == "Down"){
        snakeY += unit;
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    // 確認蛇是否有吃到果實
    if(snake[0].x == myFruit.x && snake[0].y == myFruit.y){
        // 重新選定新的果實在隨機位置
        myFruit.pickALocation();
        // 更新分數
        score++;
        setHighestScore(score);
        document.getElementById("myScore").innerHTML = "遊戲分數："+ score;
        document.getElementById("myScore2").innerHTML = "最高分數："+ highestScore;
    } else {
        snake.pop();
    }
    snake.unshift(newHead);
    window.addEventListener("keydown", changeDirection)

}
let myGame = setInterval(draw, 100);

function loadHighestScore(){
    if (localStorage.getItem("highestScore") == null){
        highestScore = 0;
    } else {
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}

function setHighestScore(score){
    if(score > highestScore){
        localStorage.setItem("highestScore", score);
        highestScore = score;
    }
}