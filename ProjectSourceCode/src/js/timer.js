// JavaScript code for the timer
let min1 = 10;
let sec1 = 0;
let min2 = 10;
let sec2 = 0;
let timerInterval;

function startTimer1() {
  timerInterval1 = setInterval(updateTimer1, 1000);
}

function startTimer2() {
    timerInterval2 = setInterval(updateTimer2, 1000);
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
  clearInterval(timerInterval);

  min2 = 10;
  sec2 = 0;

  document.getElementById('min2').innerText = padZero(min2);
  document.getElementById('sec2').innerText = padZero(sec2); 

  startTimer2();


}

function resetTimer() {
  clearInterval(timerInterval);
  
  let gameType = document.getElementById('game-type').value;
  if (gameType === 'standard') {
    min1 = 10;
    sec1 = 0;
  }
  else if (gameType === 'blitz') {
    min1 = 5;
    sec1 = 5; 
  }
  else if (gameType === 'bullet') {
    min1 = 3; 
    sec1 = 0; 
  }

  document.getElementById('min1').innerText = padZero(min1);
  document.getElementById('sec1').innerText = padZero(sec1); 
}