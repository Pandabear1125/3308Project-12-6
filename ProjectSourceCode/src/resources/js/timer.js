let playing = false;
let currentPlayer = 1;
const panel = document.querySelector('.player');
const buttons = document.querySelectorAll('.bttn');
// Sound effects for project.
const timesUp = new Audio('audio/460133__eschwabe3__robot-affirmative.wav');
const click = new Audio('audio/561660__mattruthsound.wav');

// Add a leading zero to numbers less than 10.

const padZero = (number) => {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}


// Add a leading zero to numbers less than 10.
const padZero = () => {
    // code
}

// Warn the player if time drops below thirty seconds.
const timeWarning = () => {
    // code
}

// Create a class for the timer.
class Timer {
    // code
}

// Swap player's timer after a move (player1 = 1, player2 = 2).
const swapPlayer = () => {
    // code
}

// Start timer countdown to zero.
const startTimer = () => {
    // code
    let timerId = setInterval(function() {
        // code
    }, 1000)
}