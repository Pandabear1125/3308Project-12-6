const player1 = document.querySelectorAll('.player-1 .player__digits span');
const player2 = document.querySelectorAll('.player-2 .player__digits span');
const startButton = document.querySelector('.timer__start-bttn bttn'); 
const resetButton = document.querySelector('.timer__reset-bttn bttn');

let player1Time = 600;
let player2Time = 600; 
let currentPlayer = 1;
let interval; 

function updateTimer() {
    const player1Minutes = Math.floor(player1Time / 60); 
    const player1Seconds = player1Time % 60;
    player1[0].textContent = player1Minutes.toString().padStart(2, '0');
    player1[1].textContent = player1Seconds.toString().padStart(2, '0'); 

    const player2Minutes = Math.floor(player2Time / 60);
    const player2Seconds = player2Time % 60; 
    player2[0].textContent = player2Minutes.toString().padStart(2, '0');
    player2[1].textContent = player2Seconds.toString().padStart(2, '0'); 
}

function startTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
        startButton.textContent = 'START'; 
    }
    else {
        interval = setInterval(() => {
            if (currentPlayer == 1) {
                player1Time--;
                if (player1Time == 0) {
                    clearInterval(interval);
                }
            }
            else {
                player2Time--;
                if (player2Time == 0) {
                    clearInterval(interval);
                }
            }
            updateTimer();
        }, 1000);
        startButton.textContent = 'PAUSE'; 
    }
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    player1Time = 600;
    player2Time = 600;
    currentPlayer = 1;
    updateTimer();
    startButton.textContent = 'START'; 
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1; 
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
document.querySelectorAll('.player__tile').forEach(tile => {
    tile.addEventListener('click', switchPlayer); 
});

updateTimer();
