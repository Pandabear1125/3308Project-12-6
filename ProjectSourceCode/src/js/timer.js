// JavaScript code for the timer
let min1 = 10;
let sec1 = 0;
let min2 = 10;
let sec2 = 0;
let timerInterval1;
let timerInterval2;
let currentPlayer = 1;

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

  document.getElementById('min1').innerText = padZero(min1);
  document.getElementById('sec1').innerText = padZero(sec1);
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

    document.getElementById('min2').innerText = padZero(min2);
    document.getElementById('sec2').innerText = padZero(sec2); 
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

function updateTimerBasedOnGameType(gameType) {
    var minutes;
        switch (gameType) {
            case 'standard':
                minutes = 10;
                break;
            case 'blitz':
                minutes = 5;
                break;
            case 'bullet':
                minutes = 3;
                break;
            default:
                minutes = 10; // Default to standard if game type is not recognized
        }
        // Set the initial timer values
        document.getElementById('min1').textContent = minutes;
        document.getElementById('min2').textContent = minutes;
}