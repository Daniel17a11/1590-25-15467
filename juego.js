const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const gameContainer = document.querySelector('.game');
let playerPos = { x: 0, y: 0, points: 0 };

let coins = [];
let obstacles = [];

// Verifica si una posición está ocupada, excluyendo la posición inicial del jugador
function isOccupied(x, y) {
    if (x === 0 && y === 0) return true;
    
    for (let coin of coins) {
        const coinX = parseInt(coin.style.left);
        const coinY = parseInt(coin.style.top);
        if (coinX === x && coinY === y) {
            return true;
        }
    }
    for (let obstacle of obstacles) {
        const obstacleX = parseInt(obstacle.style.left);
        const obstacleY = parseInt(obstacle.style.top);
        if (obstacleX === x && obstacleY === y) {
            return true;
        }
    }
    return false;
}

// Genera monedas en posiciones aleatorias
function generateCoins(count) {
    for (let i = 0; i < count; i++) {
        const coin = document.createElement('div');
        coin.classList.add('coin');
        let x, y;
        do {
            x = Math.floor(Math.random() * 8) * 50;
            y = Math.floor(Math.random() * 8) * 50;
        } while (isOccupied(x, y));
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coins.push(coin);
        gameContainer.appendChild(coin);
    }
}

// Genera obstáculos en posiciones aleatorias, excepto en (0, 0)
function generateObstacles(count) {
    for (let i = 0; i < count; i++) {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        let x, y;
        do {
            x = Math.floor(Math.random() * 8) * 50;
            y = Math.floor(Math.random() * 8) * 50;
        } while (isOccupied(x, y));
        obstacle.style.left = `${x}px`;
        obstacle.style.top = `${y}px`;
        obstacles.push(obstacle);
        gameContainer.appendChild(obstacle);
    }
}

// Muestra mensaje de victoria
function showWinMessage() {
    const winMessage = document.createElement('div');
    winMessage.classList.add('win-message');
    winMessage.innerHTML = `
        <img src="trophy.png" alt="Trofeo" />
        <h2>¡Felicidades! Has ganado con 15 puntos 🎉</h2>
        <button onclick="restartGame()">Jugar de nuevo</button>
    `;
    gameContainer.appendChild(winMessage);
}

// Muestra mensaje de derrota
function showLoseMessage() {
    const loseMessage = document.createElement('div');
    loseMessage.classList.add('lose-message');
    loseMessage.innerHTML = `
        <h2>¡Perdiste! Vuelve a intentarlo</h2>
        <button onclick="restartGame()">Volver a intentar</button>
    `;
    gameContainer.appendChild(loseMessage);
}

// Reinicia el juego
function restartGame() {
    playerPos = { x: 0, y: 0, points: 0 };
    player.style.left = '0px';
    player.style.top = '0px';
    scoreElement.textContent = `Puntos: 0`;
    document.querySelectorAll('.coin').forEach(coin => coin.remove());
    document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
    document.querySelector('.win-message')?.remove();
    document.querySelector('.lose-message')?.remove();
    coins = [];
    obstacles = [];
    generateCoins(5);
    generateObstacles(3);
}

// Mueve al jugador
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if (newX < 0 || newX > 350 || newY < 0 || newY > 350) return;
    
    playerPos.x = newX;
    playerPos.y = newY;
    player.style.left = `${playerPos.x}px`;
    player.style.top = `${playerPos.y}px`;

    const coins = document.querySelectorAll('.coin');
    coins.forEach(coin => {
        const coinX = parseInt(coin.style.left);
        const coinY = parseInt(coin.style.top);
        if (coinX === playerPos.x && coinY === playerPos.y) {
            coin.remove();
            playerPos.points++;
            scoreElement.textContent = `Puntos: ${playerPos.points}`;

            if (playerPos.points >= 15) {
                showWinMessage();
            } else if (document.querySelectorAll('.coin').length === 0) {
                generateCoins(5);
            }
        }
    });

    obstacles.forEach(obstacle => {
        const obstacleX = parseInt(obstacle.style.left);
        const obstacleY = parseInt(obstacle.style.top);
        if (obstacleX === playerPos.x && obstacleY === playerPos.y) {
            showLoseMessage();
        }
    });
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': movePlayer(0, -50); break;
        case 'ArrowDown': movePlayer(0, 50); break;
        case 'ArrowLeft': movePlayer(-50, 0); break;
        case 'ArrowRight': movePlayer(50, 0); break;
    }

});

generateCoins(5);
generateObstacles(3);
function closeInstructions() {
    document.getElementById('instructions').style.display = 'none';
}

window.onload = () => {
    document.getElementById('instructions').style.display = 'flex';
};

