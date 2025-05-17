// Game state
let gameState = {
    board: Array(25).fill(''),
    players: ['J', 'R', 'T'],
    currentPlayerIndex: 0,
    gameOver: false
};

// DOM elements
const cells = document.querySelectorAll('.cell');
const playerTurn = document.getElementById('player-turn');
const gameStatus = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');
const playerIndicators = document.querySelectorAll('.player-indicator');
const container = document.querySelector('.container');
const body = document.body;

// Create rainbow background
const rainbowBg = document.createElement('div');
rainbowBg.classList.add('rainbow-bg');
body.appendChild(rainbowBg);

// Add stars to background
createStars();

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = parseInt(cell.dataset.index);
        makeMove(index);
    });
});

resetBtn.addEventListener('click', resetGame);

// Game functions
function makeMove(index) {
    // Check if the move is valid
    if (gameState.board[index] !== '' || gameState.gameOver) {
        return;
    }
    
    // Get current player
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Update game state
    gameState.board[index] = currentPlayer;
    
    // Update UI
    renderBoard();
    
    // Add move effect to the cell
    const cell = cells[index];
    cell.classList.add('move-effect');
    setTimeout(() => {
        cell.classList.remove('move-effect');
    }, 500);
    
    // Create random effect for each move
    createRandomEffect(currentPlayer, index);
    
    // Check for win or draw
    if (checkWin()) {
        gameState.gameOver = true;
        gameStatus.textContent = `Player ${currentPlayer} wins!`;
        
        // Create win celebration effects
        createWinEffects(currentPlayer);
        return;
    }
    
    if (checkDraw()) {
        gameState.gameOver = true;
        gameStatus.textContent = "It's a draw!";
        
        // Create draw effects
        createDrawEffects();
        return;
    }
    
    // Switch to next player
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updatePlayerTurn();
}

function renderBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = ''; // Clear text content since we're using images
        cell.classList.remove('j', 'r', 't');
        
        if (gameState.board[index]) {
            cell.classList.add(gameState.board[index].toLowerCase());
        }
    });
}

function updatePlayerTurn() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    playerTurn.textContent = `Player ${currentPlayer}'s turn`;
    
    // Update player indicators
    playerIndicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    const activeIndicator = document.querySelector(`.player-indicator.${currentPlayer.toLowerCase()}`);
    if (activeIndicator) {
        activeIndicator.classList.add('active');
    }
}

function checkWin() {
    // For a 5x5 board with 3-in-a-row win condition
    
    // Check rows
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
            const startIndex = row * 5 + col;
            if (checkConsecutive(startIndex, 1, 3)) {
                return true;
            }
        }
    }
    
    // Check columns
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
            const startIndex = row * 5 + col;
            if (checkConsecutive(startIndex, 5, 3)) {
                return true;
            }
        }
    }
    
    // Check diagonals (top-left to bottom-right)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const startIndex = row * 5 + col;
            if (checkConsecutive(startIndex, 6, 3)) {
                return true;
            }
        }
    }
    
    // Check diagonals (top-right to bottom-left)
    for (let row = 0; row < 3; row++) {
        for (let col = 2; col < 5; col++) {
            const startIndex = row * 5 + col;
            if (checkConsecutive(startIndex, 4, 3)) {
                return true;
            }
        }
    }
    
    return false;
}

function checkConsecutive(startIndex, step, count) {
    const symbol = gameState.board[startIndex];
    if (!symbol) return false;
    
    const indices = [];
    for (let i = 0; i < count; i++) {
        const index = startIndex + i * step;
        indices.push(index);
        if (gameState.board[index] !== symbol) {
            return false;
        }
    }
    
    // Highlight winning cells
    highlightWinningCells(indices);
    return true;
}

function checkDraw() {
    return !gameState.board.includes('');
}

function highlightWinningCells(indices) {
    indices.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
    
    // Create laser between winning cells
    if (indices.length >= 2) {
        createLaserBetweenCells(indices);
    }
}

function resetGame() {
    gameState.board = Array(25).fill('');
    gameState.currentPlayerIndex = 0;
    gameState.gameOver = false;
    
    updatePlayerTurn();
    gameStatus.textContent = '';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('j', 'r', 't', 'winning-cell');
    });
    
    // Remove all effects
    document.querySelectorAll('.laser, .explosion, .ufo, .confetti, .bouncing-z').forEach(el => {
        el.remove();
    });
    
    // Reset rainbow background
    rainbowBg.style.opacity = 0;
    
    // Add reset effect
    createResetEffect();
}

// Visual effects functions
function createRandomEffect(player, cellIndex) {
    const effectType = Math.floor(Math.random() * 4);
    const cell = cells[cellIndex];
    const cellRect = cell.getBoundingClientRect();
    const centerX = cellRect.left + cellRect.width / 2;
    const centerY = cellRect.top + cellRect.height / 2;
    
    switch (effectType) {
        case 0:
            createMiniExplosion(centerX, centerY, player);
            break;
        case 1:
            createLaser(centerX, centerY, player);
            break;
        case 2:
            createUFO(centerX, centerY);
            break;
        case 3:
            createConfetti(centerX, centerY);
            break;
    }
}

function createMiniExplosion(x, y, player) {
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    
    // Set color based on player
    let color;
    switch (player) {
        case 'J': color = 'rgba(52, 152, 219, 0.8)'; break;
        case 'R': color = 'rgba(231, 76, 60, 0.8)'; break;
        case 'T': color = 'rgba(46, 204, 113, 0.8)'; break;
        default: color = 'rgba(255, 165, 0, 0.8)';
    }
    
    explosion.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,165,0,0.6) 70%, rgba(255,0,0,0.4) 100%)`;
    
    document.body.appendChild(explosion);
    
    // Animate explosion
    let size = 0;
    const maxSize = 100;
    const interval = setInterval(() => {
        size += 5;
        explosion.style.width = `${size}px`;
        explosion.style.height = `${size}px`;
        
        if (size >= maxSize) {
            clearInterval(interval);
            setTimeout(() => {
                explosion.remove();
            }, 200);
        }
    }, 10);
}

function createLaser(x, y, player) {
    const laser = document.createElement('div');
    laser.classList.add('laser');
    
    // Set color based on player
    switch (player) {
        case 'J': laser.style.backgroundColor = 'rgba(52, 152, 219, 0.7)'; break;
        case 'R': laser.style.backgroundColor = 'rgba(231, 76, 60, 0.7)'; break;
        case 'T': laser.style.backgroundColor = 'rgba(46, 204, 113, 0.7)'; break;
    }
    
    const angle = Math.random() * 360;
    laser.style.top = `${y}px`;
    laser.style.left = `${x}px`;
    laser.style.transform = `rotate(${angle}deg)`;
    
    document.body.appendChild(laser);
    
    setTimeout(() => {
        laser.remove();
    }, 500);
}

function createUFO(x, y) {
    const ufo = document.createElement('div');
    ufo.classList.add('ufo');
    ufo.style.left = `${x}px`;
    ufo.style.top = `${y}px`;
    
    document.body.appendChild(ufo);
    
    // Animate UFO
    let posX = x;
    let posY = y;
    const targetX = Math.random() * window.innerWidth;
    const targetY = -50;
    const speed = 2;
    
    const interval = setInterval(() => {
        const dx = targetX - posX;
        const dy = targetY - posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 10) {
            clearInterval(interval);
            ufo.remove();
            return;
        }
        
        posX += (dx / distance) * speed;
        posY += (dy / distance) * speed;
        
        ufo.style.left = `${posX}px`;
        ufo.style.top = `${posY}px`;
    }, 16);
}

function createConfetti(x, y) {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        
        // Random rotation
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 2; // Upward bias
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const interval = setInterval(() => {
            posX += vx;
            posY += vy;
            opacity -= 0.01;
            
            confetti.style.left = `${posX}px`;
            confetti.style.top = `${posY}px`;
            confetti.style.opacity = opacity;
            
            if (opacity <= 0 || posY > window.innerHeight) {
                clearInterval(interval);
                confetti.remove();
            }
        }, 16);
    }
}

function createLaserBetweenCells(indices) {
    // Get the first and last cell in the winning line
    const firstCell = cells[indices[0]];
    const lastCell = cells[indices[indices.length - 1]];
    
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();
    
    const startX = firstRect.left + firstRect.width / 2;
    const startY = firstRect.top + firstRect.height / 2;
    const endX = lastRect.left + lastRect.width / 2;
    const endY = lastRect.top + lastRect.height / 2;
    
    // Calculate angle and distance
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Create laser
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.style.top = `${startY}px`;
    laser.style.left = `${startX}px`;
    laser.style.width = `${distance}px`;
    laser.style.transform = `rotate(${angle}deg)`;
    
    // Set color based on the winning player
    const player = gameState.board[indices[0]];
    switch (player) {
        case 'J': laser.style.backgroundColor = 'rgba(52, 152, 219, 0.7)'; break;
        case 'R': laser.style.backgroundColor = 'rgba(231, 76, 60, 0.7)'; break;
        case 'T': laser.style.backgroundColor = 'rgba(46, 204, 113, 0.7)'; break;
    }
    
    document.body.appendChild(laser);
    
    // Animate laser
    let opacity = 1;
    const interval = setInterval(() => {
        opacity -= 0.01;
        laser.style.opacity = opacity;
        
        if (opacity <= 0) {
            clearInterval(interval);
            laser.remove();
        }
    }, 30);
}

function createWinEffects(player) {
    // Show rainbow background
    rainbowBg.style.opacity = 0.3;
    
    // Create explosions
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createMiniExplosion(x, y, player);
        }, i * 300);
    }
    
    // Create UFOs
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight + 50;
            createUFO(x, y);
        }, i * 1000);
    }
    
    // Create confetti shower
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            for (let j = 0; j < 5; j++) {
                const x = j * window.innerWidth / 5 + Math.random() * 100;
                createConfetti(x, -20);
            }
        }, i * 500);
    }
    
    // Create bouncing Z images
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createBouncingZ();
        }, i * 400);
    }
}

function createDrawEffects() {
    // Create UFO invasion
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight + 50;
            createUFO(x, y);
        }, i * 400);
    }
    
    // Create some lasers
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const player = gameState.players[Math.floor(Math.random() * gameState.players.length)];
            createLaser(x, y, player);
        }, i * 200);
    }
}

function createResetEffect() {
    // Create a wave of explosions from the center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + i * 50;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const player = gameState.players[Math.floor(Math.random() * gameState.players.length)];
            createMiniExplosion(x, y, player);
        }, i * 100);
    }
}

function createStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.opacity = Math.random() * 0.8 + 0.2;
        
        document.body.appendChild(star);
        
        // Twinkle animation
        setInterval(() => {
            const newOpacity = Math.random() * 0.8 + 0.2;
            star.style.opacity = newOpacity;
        }, Math.random() * 5000 + 2000);
    }
}

// Function to create bouncing Z images
function createBouncingZ() {
    const zImage = document.createElement('img');
    zImage.src = 'Z.png';
    zImage.classList.add('bouncing-z', 'animate__animated', 'animate__bounceIn');
    
    // Random position
    const size = Math.random() * 150 + 100; // Random size between 100px and 250px
    const x = Math.random() * (window.innerWidth - size);
    const y = Math.random() * (window.innerHeight - size);
    
    zImage.style.position = 'absolute';
    zImage.style.width = `${size}px`;
    zImage.style.height = 'auto';
    zImage.style.left = `${x}px`;
    zImage.style.top = `${y}px`;
    zImage.style.zIndex = '100';
    zImage.style.opacity = '0';
    
    document.body.appendChild(zImage);
    
    // Fade in
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        zImage.style.opacity = opacity;
        
        if (opacity >= 1) {
            clearInterval(fadeIn);
            
            // Start bouncing animation
            setTimeout(() => {
                zImage.classList.remove('animate__bounceIn');
                zImage.classList.add('animate__bounce');
                zImage.style.animationIterationCount = 'infinite';
                
                // Random movement
                let posX = x;
                let posY = y;
                let vx = (Math.random() - 0.5) * 10;
                let vy = (Math.random() - 0.5) * 10;
                
                const moveInterval = setInterval(() => {
                    posX += vx;
                    posY += vy;
                    
                    // Bounce off edges
                    if (posX <= 0 || posX >= window.innerWidth - size) {
                        vx = -vx;
                    }
                    if (posY <= 0 || posY >= window.innerHeight - size) {
                        vy = -vy;
                    }
                    
                    zImage.style.left = `${posX}px`;
                    zImage.style.top = `${posY}px`;
                    
                    // Random rotation
                    const rotation = Math.random() * 20 - 10;
                    zImage.style.transform = `rotate(${rotation}deg)`;
                    
                }, 50);
                
                // Remove after some time
                setTimeout(() => {
                    clearInterval(moveInterval);
                    
                    // Fade out
                    let fadeOpacity = 1;
                    const fadeOut = setInterval(() => {
                        fadeOpacity -= 0.05;
                        zImage.style.opacity = fadeOpacity;
                        
                        if (fadeOpacity <= 0) {
                            clearInterval(fadeOut);
                            zImage.remove();
                        }
                    }, 100);
                }, 8000);
            }, 1000);
        }
    }, 50);
}

// Initialize the game
updatePlayerTurn();
