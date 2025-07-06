// filepath: wave-survival-action-game/actions.js

// Game variables
let player;
let enemies = [];
let buffs = [];
let score = 0;
let wave = 1;
let gameOver = false;

// Initialize the game
function initGame() {
    player = {
        name: '',
        health: 100,
        attack: 10,
        position: 2 // Starting position in the grid (0-4)
    };
    enemies = [];
    buffs = [];
    score = 0;
    wave = 1;
    gameOver = false;
    startWave();
    renderGameArea(); // Render the initial state of the game
}

// Start a new wave
function startWave() {
    let enemyCount = wave % 20 === 0 ? 1 : Math.floor(Math.random() * 2) + 3; // 3-4 enemies
    for (let i = 0; i < enemyCount; i++) {
        enemies.push(createEnemy());
    }
    spawnBuffs();
}

// Create a new enemy
function createEnemy() {
    return {
        health: 50,
        position: Math.floor(Math.random() * 5), // Random horizontal position
        isBoss: wave % 20 === 0
    };
}

// Spawn buffs randomly
function spawnBuffs() {
    let buffCount = Math.floor(Math.random() * 2) + 1; // 1-2 buffs
    for (let i = 0; i < buffCount; i++) {
        buffs.push(createBuff());
    }
}

// Create a new buff
function createBuff() {
    return {
        type: 'health', // Example buff type
        position: Math.floor(Math.random() * 5)
    };
}

// Move player
function movePlayer(direction) {
    if (direction === 'left' && player.position > 0) {
        player.position--;
    } else if (direction === 'right' && player.position < 4) {
        player.position++;
    }
}

// Attack enemies
function attackEnemies() {
    enemies.forEach((enemy, index) => {
        if (enemy.position === player.position) {
            enemy.health -= player.attack;
            if (enemy.health <= 0) {
                score += 10; // Increase score
                enemies.splice(index, 1); // Remove enemy
            }
        }
    });
}

// Check for game over
function checkGameOver() {
    if (player.health <= 0) {
        gameOver = true;
        saveScore();
    }
}

// Save score to local storage
function saveScore() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    scores.sort((a, b) => b - a); // Sort scores descending
    scores = scores.slice(0, 10); // Keep top 10 scores
    localStorage.setItem('scores', JSON.stringify(scores));
}

// Render the game area
function renderGameArea() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = ''; // Clear previous content

    // Render player
    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    playerElement.style.gridColumnStart = player.position + 1;
    playerElement.style.gridRowStart = 15; // Player is always at the bottom
    gameArea.appendChild(playerElement);

    // Render enemies
    enemies.forEach((enemy) => {
        const enemyElement = document.createElement('div');
        enemyElement.className = enemy.isBoss ? 'enemy boss' : 'enemy';
        enemyElement.style.gridColumnStart = enemy.position + 1;
        enemyElement.style.gridRowStart = 1; // Enemies start at the top
        gameArea.appendChild(enemyElement);
    });

    // Render buffs
    buffs.forEach((buff) => {
        const buffElement = document.createElement('div');
        buffElement.className = `buff ${buff.type}`;
        buffElement.style.gridColumnStart = buff.position + 1;
        buffElement.style.gridRowStart = Math.floor(Math.random() * 14) + 1; // Random row
        gameArea.appendChild(buffElement);
    });
}

// Update the game area after each action
function updateGameArea() {
    renderGameArea();
}

// Start the game
document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const viewScoresButton = document.getElementById('viewScores');
    const backToMenuButton = document.getElementById('backToMenu');
    const menu = document.getElementById('menu');
    const gameArea = document.getElementById('gameArea');
    const scoreboard = document.getElementById('scoreboard');

    // Evento para iniciar un nuevo juego
    startGameButton.addEventListener('click', () => {
        menu.classList.add('d-none');
        gameArea.classList.remove('d-none');
        // Aquí se puede inicializar la lógica del juego
        console.log('Juego iniciado');
        initGame();
    });

    // Evento para ver los puntajes
    viewScoresButton.addEventListener('click', () => {
        menu.classList.add('d-none');
        scoreboard.classList.remove('d-none');
        // Aquí se puede cargar y mostrar los puntajes
        console.log('Mostrando puntajes');
    });

    // Evento para volver al menú principal
    backToMenuButton.addEventListener('click', () => {
        scoreboard.classList.add('d-none');
        gameArea.classList.add('d-none');
        menu.classList.remove('d-none');
        console.log('Volviendo al menú principal');
    });
});