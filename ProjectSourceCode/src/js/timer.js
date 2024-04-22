// JavaScript code for the timer
let sec1 = 0;
let sec2 = 0;
let timerInterval1;
let timerInterval2;
let currentPlayer = 1;
var gameType = 'standard';

function resetTimer() {
    clearInterval(timerInterval1); 
    clearInterval(timerInterval2); 
    sec1 = 0;
    sec2 = 0;
    const intitialTime = getInitialTimeForGameType(gameType); 
    min1 = intitialTime;
    min2 = intitialTime;

    // Set the initial timer values
    updateTimerDisplay('player1', min1, sec1);
    updateTimerDisplay('player2', min2, sec2); 
}
function updateTimerDisplay(player, minutes, seconds) {
    const minutesElement = document.getElementById(`min${player === 'player1' ? '1' : '2'}`); 
    const secondsElement = document.getElementById(`sec${player === 'player1' ? '1' : '2'}`);

    minutesElement.textContent = padZero(minutes);
    secondsElement.textContent = padZero(seconds);
}

function startTimer1() {
    clearInterval(timerInterval2);
    timerInterval1 = setInterval(updateTimer1, 1000);
    currentPlayer = 1; 
}

function startTimer2() {
    clearInterval(timerInterval1); 
    timerInterval2 = setInterval(updateTimer2, 1000);
    currentPlayer = 2; 
}

function updateTimer1() {
  if (min1 == 0 && sec1 == 0) {
    clearInterval(timerInterval1);
    return;
  }

  sec1--;
  if (sec1 < 0) {
    sec1 = 59;
    min1--;
  }

  updateTimerDisplay('player1', min1, sec1); 
}

function updateTimer2() {
    if(min2 == 0 && sec2 == 0) {
        clearInterval(timerInterval2);
        return;
    }

    sec2--;
    if (sec2 < 0) {
        sec2 = 59;
        min2--;
    }

    updateTimerDisplay('player2', min2, sec2);  
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}

function switchPlayer() {
    if (currentPlayer === 1) {
        startTimer2();
        clearInterval(timerInterval1);
        currentPlayer = 2;
    } else {
        startTimer1();
        clearInterval(timerInterval2);
        currentPlayer = 1;
    }

}

function getInitialTimeForGameType(gameType) {
    switch (gameType) {
        case 'blitz':
          return 5; // 5 minutes
        case 'bullet':
          return 3; // 3 minutes
        case 'standard':
          return 10; // 10 minutes
        default:
          return 10; // Default to 10 minutes
    }
}

function updateTimerBasedOnGameType(gameType) {
   this.gameType = gameType;
   resetTimer();

}

window.addEventListener('load', function() {
    resetTimer();
});

document.addEventListener('DOMContentLoaded', function() {
    const gameType = getGameTypeFromQuery();
    updateTimerBasedOnGameType(gameType);
  });
  
  function getGameTypeFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameType = urlParams.get('game-type');
    return gameType || 'standard'; // Return 'standard' if game-type is not present in the query
  }