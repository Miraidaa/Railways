let playerName = "";
let difficulty = "";
let timer;
let timeElapsed = 0;
let tileImages = {};
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.querySelector("#game-grid").appendChild(canvas);

const tileTypes = ["empty", "bridge", "oasis", "mountain", "straight_rail", "mountain_rail", "bridge_rail"];
tileTypes.forEach(type => {
    const img = new Image();
    img.src = `tiles/${type}.png`;
    tileImages[type] = img;
});

function preloadImages() {
    tileTypes.forEach(type => {
        const img = new Image();
        img.src = `tiles/${type}.png`;
        tileImages[type] = img;
    });
}

preloadImages();  


    document.querySelector("#easy").addEventListener("click", function() {
        selectDifficulty("Easy");
    });
    document.querySelector("#hard").addEventListener("click", function() {
        selectDifficulty("Hard");
    });

    document.querySelector("#rules-btn").addEventListener("click", showRules);
    document.querySelector("#start-btn").addEventListener("click", startGame);
    document.querySelector("#backToMenu").addEventListener("click", goToMenu);
    document.querySelector("#closeRulesBtn").addEventListener("click", closeRules);
    document.querySelector("#game-start-image").addEventListener("click", hideSplashScreen);

let gridData = []; 

function hideSplashScreen() {
    document.querySelector("#splash-screen").style.display = "none";
    document.querySelector("#menu").style.display = "block";
}

document.querySelector("#game-start-image").addEventListener("click", hideSplashScreen);

function selectDifficulty(level) {
    difficulty = level;
    document.querySelector("#easy").style.backgroundColor = level === "Easy" ? "#a4c2a8" : "#d9dec3";
    document.querySelector("#hard").style.backgroundColor = level === "Hard" ? "#a4c2a8" : "#d9dec3";
}

function showRules() {
    document.querySelector("#rules").style.display = "flex";
}

function closeRules() {
    document.querySelector("#rules").style.display = "none";
}

function startGame() {
    playerName = document.querySelector("#player-name").value;

    if (!playerName || !difficulty) {
        document.querySelector("#warning-message").textContent = "Please enter your name and select a difficulty level.";
        return;
    }

    document.querySelector("#player-display").textContent = playerName;
    document.querySelector("#difficulty-display").textContent = difficulty;
    document.querySelector("#menu").style.display = "none";
    document.querySelector("#game").style.display = "block";

    const gridSize = difficulty === "Easy" ? 5 : 7;
    setupCanvas(gridSize);
    initializeGrid(gridSize); 
    renderGrid(gridSize); 
    startTimer();
}

function setupCanvas(gridSize) {
    const tileSize = 60;
    canvas.width = gridSize * tileSize;
    canvas.height = gridSize * tileSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initializeGrid(gridSize) {
    gridData = [];
    for (let row = 0; row < gridSize; row++) {
        const rowData = [];
        for (let col = 0; col < gridSize; col++) {
            const baseTile = getRandomTileType();  
            rowData.push({ base: baseTile, rail: { type: "", rotation: 0 } });
        }
        gridData.push(rowData);
    }
}

function renderGrid(gridSize) {
    const tileSize = 60;
    ctx.clearRect(0, 0, canvas.width, canvas.height);  

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const x = col * tileSize;
            const y = row * tileSize;
            const baseTile = gridData[row][col].base;
            const railTile = gridData[row][col].rail;

   
            drawTile(baseTile, x, y, tileSize);

         
            if (railTile.type) {
                drawTileWithRotation(railTile.type, x, y, tileSize, railTile.rotation);
            }
        }
    }
}

function drawTile(type, x, y, tileSize) {
    const img = tileImages[type];

    if (img.complete) {
        ctx.drawImage(img, x, y, tileSize, tileSize);
    } else {
        console.error(`Image ${type} not loaded yet.`);
    }
}

function drawTileWithRotation(type, x, y, tileSize, rotation) {
    const img = tileImages[type];
    
   
    if (img.complete) {
        ctx.save();
        ctx.translate(x + tileSize / 2, y + tileSize / 2);  
        ctx.rotate(rotation * Math.PI / 180);  
        ctx.drawImage(img, -tileSize / 2, -tileSize / 2, tileSize, tileSize); 
        ctx.restore();
    } else {
        console.error(`Image ${type} not loaded yet.`);
    }
}



canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / 60);
    const row = Math.floor(y / 60);

    const baseTile = gridData[row][col].base;

    if (!gridData[row][col].rail.type) {
        if (baseTile === "empty") {
            gridData[row][col].rail.type = "straight_rail";  
        } else if (baseTile === "mountain") {
            gridData[row][col].rail.type = "mountain_rail";  
        } else if (baseTile === "bridge") {
            gridData[row][col].rail.type = "bridge_rail";  
        } else if (baseTile === "oasis") {
            console.log("No rail can be placed on an oasis tile.");
            return; 
        }

        renderGrid(gridData.length); 
    } else {
        gridData[row][col].rail.rotation = (gridData[row][col].rail.rotation + 90) % 360;
        renderGrid(gridData.length); 
    }
});


function getRandomTileType() {
    const randomIndex = Math.floor(Math.random() * 4); 
    const baseTileTypes = ["empty", "bridge", "oasis", "mountain"];
    return baseTileTypes[randomIndex];
}



function startTimer() {
    timeElapsed = 0;
    timer = setInterval(() => {
        timeElapsed++;
        document.querySelector("#timer-display").textContent = formatTime(timeElapsed);
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function goToMenu() {
    clearInterval(timer);
    document.querySelector("#game").style.display = "none";
    document.querySelector("#menu").style.display = "block";
}