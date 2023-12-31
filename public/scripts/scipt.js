// DOM elements
// ----------------------------------------------
const messageForm = document.querySelector("#messageForm");
const message = document.querySelector("#message");
const chatHistory = document.querySelector("#chatHistory");
const user = document.querySelector("#user");
const setUser = document.querySelector("#setUser");
const canvasEl = document.querySelector("#canvas");
const ctx = canvasEl.getContext('2d');
// Constants
const CANVAS_WIDTH = canvasEl.getBoundingClientRect().width;
const CANVAS_HEIGHT = canvasEl.getBoundingClientRect().height;
// dependencies
// ----------------------------------------------

// skapa en websocket i klienten
const websocket = new WebSocket("ws://localhost:8081");

const zoomLevel = 4;

// TILE SIZES
const tileWidth = 16 * zoomLevel; // TILE: 64
const tileHeight = 16 * zoomLevel; // TILE: 64 
let isChatFocused = false;


// event listeners
// ----------------------------------------------
messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Handle chat message submission
    sendMessage();

});

setUser.addEventListener("click", confirmSetUser);

websocket.addEventListener("message", (event) => {
    const messageData = JSON.parse(event.data);

    if (messageData.type === 'chatMessage') {
        // Handle chat messages
        renderMessage(messageData, "someone else");
    } else if (messageData.type === 'gameState') {
        // Handle game state messages
        receiveGameState(messageData);
    }
    // Add more conditions for other message types if needed
});


// Add event listeners for focus and blur events on the message input
message.addEventListener("focus", () => {
    isChatFocused = true;
});

message.addEventListener("blur", () => {
    isChatFocused = false;
});
user.addEventListener("focus", () => {
    isChatFocused = true;
});

user.addEventListener("blur", () => {
    isChatFocused = false;
});

function handleGameInput(event) {
    const gameInput = { type: 'gameInput', key: event.key };
    websocket.send(JSON.stringify(gameInput));

    // Only send game state when handling game input and the chat is not focused
    if (!isChatFocused) {
        sendGameState();
    }
}


function sendGameState() {


    const gameState = {
        type: 'gameState',
        data: {
            player1: { x: player1.x, y: player1.y },
            player2: { x: player2.x, y: player2.y },
        }
    };

    websocket.send(JSON.stringify(gameState));
    console.log('Sent game state:', gameState);
}



function receiveGameState(messageData) {
    console.log('Received game state:', messageData);

    // Extract player positions from received game state
    const player1Position = messageData.data.player1;
    const player2Position = messageData.data.player2;

    // Update player positions
    player1.x = player1Position.x;
    player1.y = player1Position.y;

    player2.x = player2Position.x;
    player2.y = player2Position.y;

    
    // Call renderGameState with the updated player positions
    renderGameState(player1, player2, ctx,);
}



//Function render game state

function renderGameState(player1, player2, ctx, deltatime) {
    // Clear Canvas
    // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    currentMap.draw(ctx);

    // Draw player1
    player1.draw(ctx, deltatime);

    // Draw player2
    player2.draw(ctx, deltatime);


}


function sendMessage() {
    let obj = { message: message.value, user: user.value, type: 'chatMessage' };
    websocket.send(JSON.stringify(obj));
    // Render your own chat message on the page
    renderMessage(obj, "");
    message.value = "";
}
function receiveMessage(event) {
    console.log("event", event);
    // omvandla event.data till JavaScript objekt
    const obj = JSON.parse(event.data);
    console.log("obj", obj);
    //rendera
    renderMessage(obj, "someone else");
}
function renderMessage(obj, other) {
    // Skapa en container
    let div = document.createElement("div");
    div.classList = "container";
    // Skapa ett element för meddelandet
    let p = document.createElement("p");
    p.textContent = obj.message;
    p.classList = "message-text";
    // Skapa ett element för username
    let span = document.createElement("span");
    span.textContent = obj.user;
    if (other.length > 0) {
        span.classList = "other";
    }
    else {
        span.classList = "username";
    }
    //skapa timestamp
    let timestamp = document.createElement("time");
    let date = new Date();
    timestamp.textContent = date.toLocaleTimeString().slice(0, 5);
    timestamp.datatime = date.toISOString();
    div.appendChild(p);
    div.appendChild(span);
    div.appendChild(timestamp);
    // Lägg till DOM
    chatHistory.appendChild(div);
}

function confirmSetUser() {
    console.log("Vem...");

    const name = user.value;

    //Kontrollera att det finns ett namn
    if (name.length > 2) {

        //visa chat formulär och historik
        //se till att man inte kan ändra sitt namn
        setUser.classList = "hidden";
        user.setAttribute("disabled", "disabled");
        messageForm.classList = "";
        chatHistory.classList = "";
    }
}

function checkMapChangeCollision(
    player,
    mapChangeX,
    mapChangeY,
    mapChangeWidth,
    mapChangeHeight,
    map
) {
    return (
        // Check if player's position is within the boundaries of the map change area on the current map
        player.x >= mapChangeX &&
        player.x + player.width <= mapChangeX + mapChangeWidth &&
        player.y >= mapChangeY &&
        player.y + player.height <= mapChangeY + mapChangeHeight
    );
}

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

const firstMap = new Map({
    imageSrc: "./images/first-map.png",
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borders: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 130
    },
    player1StartingCordinates: {
        x: 350,
        y: 320
    },
    player2StartingCordinates: {
        x: 450,
        y: 320
    },
    nextMapCollisionBox: {
        x: 5.4,
        y: 0,
        width: 3,
        height: 1.5,
    },
    nextMap: null

});

const sandMap = new Map({
    imageSrc: "./images/sand-map.png",
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borders: {
        top: 45,
        left: 0,
        right: 0,
        bottom: 0
    },
    player1StartingCordinates: {
        x: 370,
        y: 400
    },
    player2StartingCordinates: {
        x: 450,
        y: 400
    }, nextMapCollisionBox: {
        x: 5.4,
        y: 7.5,
        width: 3,
        height: 1.5,
    },


});
let currentMap = firstMap;

firstMap.nextMap = sandMap
sandMap.nextMap = firstMap





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
    if (isChatFocused) {
        return;
    }
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
    checkCollisions(player1, player2);
    let mapChangeX = currentMap.nextMapCollisionBox.x * tileWidth;
    let mapChangeY = currentMap.nextMapCollisionBox.y * tileHeight;
    let mapChangeWidth = currentMap.nextMapCollisionBox.width * tileWidth;
    let mapChangeHeight = currentMap.nextMapCollisionBox.height * tileHeight;


    // Check if player1 collides with the map change box
    if (
        checkMapChangeCollision(
            player1,
            mapChangeX,
            mapChangeY,
            mapChangeWidth,
            mapChangeHeight,
            currentMap
        )
    ) {
        currentMap = currentMap.nextMap
        player1.x = currentMap.player1StartingCordinates.x;
        player1.y = currentMap.player1StartingCordinates.y;
        player2.x = currentMap.player2StartingCordinates.x;
        player2.y = currentMap.player2StartingCordinates.y;
    }
    // Check if player1 collides with the map change box
    if (
        checkMapChangeCollision(
            player2,
            mapChangeX,
            mapChangeY,
            mapChangeWidth,
            mapChangeHeight,
            currentMap
        )
    ) {
        currentMap = currentMap.nextMap
        player1.x = currentMap.player1StartingCordinates.x;
        player1.y = currentMap.player1StartingCordinates.y;
        player2.x = currentMap.player2StartingCordinates.x;
        player2.y = currentMap.player2StartingCordinates.y;
    }
    ctx.fillStyle = "rgba(0,255,0,0.5)";
    ctx.fillRect(mapChangeX, mapChangeY, mapChangeWidth, mapChangeHeight);

    player1.draw(ctx, deltatime);
    player2.draw(ctx, deltatime);

    // Do gameLoop again
    requestAnimationFrame(gameLoop);

}

window.addEventListener('keydown', (event) => {
    console.log("KeyDown event trigged. key", event.key, "has been pressed");
    handleGameInput(event);
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
    handleGameInput(event);
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