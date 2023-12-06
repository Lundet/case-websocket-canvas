
const canvasEl = document.querySelector("#canvas");
const ctx = canvasEl.getContext('2d');
// Constants
const CANVAS_WIDTH = canvasEl.getBoundingClientRect().width;
const CANVAS_HEIGHT = canvasEl.getBoundingClientRect().height;


const KEYS = {
    arrowUp: { isPressed: false },
    arrowDown: { isPressed: false },
    arrowLeft: { isPressed: false },
    arrowRight: { isPressed: false },

    k: { isPressed: false },

    w: { isPressed: false },
    s: { isPressed: false },
    a: { isPressed: false },
    d: { isPressed: false }
}



const orientalMap = new Map({
    imageSrc: "./images/oriental-map.png",
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borders: {
        top: 0,
        left: 0,
        right: 490,
        bottom: 0
    },
    player1StartingCordinates: {
        x: 90,
        y: 180
    },
    player2StartingCordinates: {
        x: 180,
        y: 180
    },

});


let currentMap = orientalMap;


const player1 = new Player(currentMap.player1StartingCordinates.x, currentMap.player1StartingCordinates.y, "transparent", "./images/punk_guy_green.png");  // Objekt skapas med x,y,width,height som kan ritas ut, som kan flytta sin position

const player2 = new Player(currentMap.player2StartingCordinates.x, currentMap.player2StartingCordinates.y, "transparent", "./images/lundet_guy.png");  // Objekt skapas med x,y,width,height som kan ritas ut, som kan flytta sin position

let isCollidingLeft = false;
let isCollidingRight = false;
let isCollidingTop = false;
let isCollidingBottom = false;
let isCollidingLeftPlayer2 = false;
let isCollidingRightPlayer2 = false;
let isCollidingTopPlayer2 = false;
let isCollidingBottomPlayer2 = false;

function handleInput(keys, map) {

    const borders = map.borders;

    // player 1


    if (keys.arrowUp.isPressed && player1.y > borders.top && !isCollidingTop) {
        player1.move(0, -1, 3);
    }

    if (keys.arrowDown.isPressed && (player1.y + player1.height) < CANVAS_HEIGHT - borders.bottom && !isCollidingBottom) {
        player1.move(0, 1, 0);
    }
    if (keys.arrowLeft.isPressed && player1.x > borders.left && !isCollidingLeft) {
        player1.move(-1, 0, 1);
    }
    if (keys.arrowRight.isPressed && (player1.x + player1.width) < CANVAS_WIDTH - borders.right && !isCollidingRight) {
        player1.move(1, 0, 2);
    }
    if (keys.k.isPressed) {
        player1.move(0, 0, 4);
    }

    // player 2
    if (keys.w.isPressed && player2.y > borders.top && !isCollidingTopPlayer2) {
        player2.move(0, -1, 3);
    }
    if (keys.s.isPressed && (player2.y + player2.height) < CANVAS_HEIGHT - borders.bottom && !isCollidingBottomPlayer2) {
        player2.move(0, 1, 0);
    }

    if (keys.a.isPressed && player2.x > borders.left && !isCollidingLeftPlayer2) {
        player2.move(-1, 0, 1);
    }
    if (keys.d.isPressed && (player2.x + player2.width) < CANVAS_WIDTH - borders.right && !isCollidingRightPlayer2) {
        player2.move(1, 0, 2);
    }




}

let lastTime = 0

function checkCollisions() {
    // Check for collision on the left side of player2
    isCollidingLeftPlayer2 = player1.x + player1.width > player2.x &&
        player1.x < player2.x &&
        player1.y < player2.y + player2.height &&
        player1.y + player1.height > player2.y;

    // Check for collision on the right side of player2
    isCollidingRightPlayer2 = player1.x < player2.x + player2.width &&
        player1.x + player1.width > player2.x + player2.width &&
        player1.y < player2.y + player2.height &&
        player1.y + player1.height > player2.y;

    // Check for collision on the top side of player2
    isCollidingTopPlayer2 = player1.y + player1.height > player2.y &&
        player1.y < player2.y &&
        player1.x < player2.x + player2.width &&
        player1.x + player1.width > player2.x;

    // Check for collision on the bottom side of player2
    isCollidingBottomPlayer2 = player1.y < player2.y + player2.height &&
        player1.y + player1.height > player2.y + player2.height &&
        player1.x < player2.x + player2.width &&
        player1.x + player1.width > player2.x;

    // Check for collision on the left side of player1
    isCollidingLeft = player2.x + player2.width > player1.x &&
        player2.x < player1.x &&
        player2.y < player1.y + player1.height &&
        player2.y + player2.height > player1.y;

    // Check for collision on the right side of player1
    isCollidingRight = player2.x < player1.x + player1.width &&
        player2.x + player2.width > player1.x + player1.width &&
        player2.y < player1.y + player1.height &&
        player2.y + player2.height > player1.y;

    // Check for collision on the top side of player1
    isCollidingTop = player2.y + player2.height > player1.y &&
        player2.y < player1.y &&
        player2.x < player1.x + player1.width &&
        player2.x + player2.width > player1.x;

    // Check for collision on the bottom side of player1
    isCollidingBottom = player2.y < player1.y + player1.height &&
        player2.y + player2.height > player1.y + player1.height &&
        player2.x < player1.x + player1.width &&
        player2.x + player2.width > player1.x;
}


function gameLoop(timestamp) {


    const deltatime = timestamp - lastTime;
    lastTime = timestamp

    // Clear Canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);



    currentMap.draw(ctx);

    // Do movements based on which key is pressed
    handleInput(KEYS, currentMap);
    checkCollisions(player1,player2)

    player1.draw(ctx, deltatime);
  
    player2.draw(ctx, deltatime);

    // Do gameLoop again
    requestAnimationFrame(gameLoop);
}
window.addEventListener('keydown', (event) => {
    console.log("KeyDown event trigged. key", event.key, "has been pressed");
    // Player 1
    if (event.key === "ArrowUp") {
        // player1y += -1;
        // player1.move(0, -1);
        KEYS.arrowUp.isPressed = true;
    } else if (event.key === "ArrowDown") {
        // player1.move(0, 1);
        KEYS.arrowDown.isPressed = true;
    } else if (event.key === "ArrowLeft") {
        // player1.move(-1, 0);
        KEYS.arrowLeft.isPressed = true;
    } else if (event.key === "ArrowRight") {
        // player1.move(1, 0);
        KEYS.arrowRight.isPressed = true;
    } else if (event.key === "k") {
        // player1.move(1, 0);
        KEYS.k.isPressed = true;
    }
    // Player 2
    if (event.key === "w") {
        // player2y += -1;
        // player2.move(0, -1);
        KEYS.w.isPressed = true;
    } else if (event.key === "s") {
        // player2.move(0, 1);
        KEYS.s.isPressed = true;
    } else if (event.key === "a") {
        // player2.move(-1, 0);
        KEYS.a.isPressed = true;
    } else if (event.key === "d") {
        // player2.move(1, 0);
        KEYS.d.isPressed = true;
    }
})
window.addEventListener('keyup', (event) => {
    console.log("KeyUp event trigged. key", event.key, "has been released");
    // Player 1
    if (event.key === "ArrowUp") {
        player1.move(0, 0, 3, false);
        KEYS.arrowUp.isPressed = false;
    } else if (event.key === "ArrowDown") {
        player1.move(0, 0, 0, false);
        KEYS.arrowDown.isPressed = false;
    } else if (event.key === "ArrowLeft") {
        player1.move(0, 0, 1, false);
        KEYS.arrowLeft.isPressed = false;
    } else if (event.key === "ArrowRight") {
        player1.move(0, 0, 2, false);
        KEYS.arrowRight.isPressed = false;
    } else if (event.key === "k") {
        player1.move(0, 0, 0, false);
        KEYS.k.isPressed = false;
    }
    // Player 2
    if (event.key === "w") {
        player2.move(0, 0, 3, false);
        KEYS.w.isPressed = false;
    } else if (event.key === "s") {
        player2.move(0, 0, 0, false);
        KEYS.s.isPressed = false;
    } else if (event.key === "a") {
        player2.move(0, 0, 1, false);
        KEYS.a.isPressed = false;
    } else if (event.key === "d") {
        player2.move(0, 0, 2, false);
        KEYS.d.isPressed = false;
    }
})
gameLoop(0);