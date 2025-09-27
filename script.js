// Game State Variables
let gameSequence = [];
let playerSequence = [];
let level = 0;
let isGameRunning = false;
let isPlayerTurn = false;
let speed = 600; // Time in milliseconds for flash duration and delay

// DOM Elements
const startButton = document.getElementById('start-btn');
const messageDisplay = document.getElementById('message');
const levelDisplay = document.getElementById('current-level');
const colorBoxes = document.querySelectorAll('.box');

// Available Colors
const colors = ['red', 'green', 'blue', 'yellow'];

// --- Core Functions ---

/**
 * Flashes a single box.
 * @param {string} colorId - The ID of the box to flash ('red', 'green', etc.)
 */
function flashBox(colorId) {
    const box = document.getElementById(colorId);
    if (!box) return;

    // Add active class to start the glow/color change
    box.classList.add('active');
    
    // Remove active class after the speed duration
    setTimeout(() => {
        box.classList.remove('active');
    }, speed * 0.5);
}

/**
 * Plays the entire generated sequence for the player.
 */
function playSequence() {
    isPlayerTurn = false;
    let delay = 0;
    
    // Disable player input during playback
    colorBoxes.forEach(box => box.removeEventListener('click', handlePlayerClick));
    messageDisplay.textContent = "Watch carefully...";
    
    gameSequence.forEach((colorId, index) => {
        // Schedule the flash
        setTimeout(() => {
            flashBox(colorId);
        }, delay);

        // Increment delay for the next flash
        delay += speed;
    });

    // Start player turn after the sequence finishes
    setTimeout(() => {
        startPlayerTurn();
    }, delay + 500); // Add a small pause after playback
}

/**
 * Starts the player's turn, enabling clicks and resetting player sequence.
 */
function startPlayerTurn() {
    isPlayerTurn = true;
    playerSequence = [];
    messageDisplay.textContent = "Your turn! Repeat the pattern.";
    
    // Enable player input
    colorBoxes.forEach(box => box.addEventListener('click', handlePlayerClick));
}

/**
 * Adds a random color to the game sequence and updates the speed.
 */
function nextRound() {
    level++;
    levelDisplay.textContent = level;
    
    // Decrease speed slightly every few levels to increase difficulty
    if (level % 4 === 0 && speed > 300) {
        speed -= 50; 
    }

    // Add new random color to the sequence
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(nextColor);
    
    playSequence();
}

/**
 * Handles the player clicking a color box.
 */
function handlePlayerClick(event) {
    if (!isPlayerTurn) return;

    // The data-color attribute on the div gives us the color ID
    const clickedColor = event.target.dataset.color; 
    playerSequence.push(clickedColor);

    // Give immediate feedback to the player
    flashBox(clickedColor);

    // Check if the clicked color matches the sequence up to this point
    checkPlayerInput();
}

/**
 * Checks the player's current input against the game sequence.
 */
function checkPlayerInput() {
    const index = playerSequence.length - 1;

    if (playerSequence[index] !== gameSequence[index]) {
        // Game Over
        endGame();
        return;
    }

    if (playerSequence.length === gameSequence.length) {
        // Sequence completed successfully
        isPlayerTurn = false;
        messageDisplay.textContent = "Correct! Get ready for Level " + (level + 1) + "...";

        // Pause before starting the next round
        setTimeout(nextRound, 1500);
    }
}

/**
 * Initializes the game state and starts the first round.
 */
function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    level = 0;
    gameSequence = [];
    playerSequence = [];
    speed = 600; // Reset speed for new game

    startButton.disabled = true;
    startButton.textContent = "Playing...";
    
    messageDisplay.textContent = "Starting...";
    setTimeout(nextRound, 1000);
}

/**
 * Resets the game after a failure.
 */
function endGame() {
    isGameRunning = false;
    isPlayerTurn = false;
    
    // Briefly flash the background to signal failure (visual feedback)
    // Note: 'var(--color-background)' is defined in styles.css
    document.body.style.backgroundColor = 'red';
    setTimeout(() => {
        // We use the CSS variable here, so the JS needs the CSS to be loaded.
        document.body.style.backgroundColor = 'var(--color-background)';
    }, 300);

    messageDisplay.textContent = `Game Over! You reached Level ${level}.`;
    startButton.disabled = false;
    startButton.textContent = "Start New Game";

    // Remove all click listeners
    colorBoxes.forEach(box => box.removeEventListener('click', handlePlayerClick));
}

// --- Event Listeners ---
startButton.addEventListener('click', startGame);