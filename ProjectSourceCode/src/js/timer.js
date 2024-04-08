let playing = false; 
let currentPlayer = 1;
const panel = document.querySelector('.player');
const buttons = document.querySelectorAll('.bttn');

// Add a leading zero to numbers less than 10.
const padZero = (number) => {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

// Warn the player if time drops below thirty seconds.
const timeWarning = (player, min, sec) => {
    if (min < 1 && sec <= 30) {
        if (player == 1) {
            document.querySelector('.player-1 .player__digits').style.color = '#CC0000';
        } 
        else {
            document.querySelector('.player-2 .player__digits').style.color = '#CC0000';
        }
    }
}

// Create a class for the timer.
class Timer {
    constructor(player, minutes) {
        this.player = player;
        this.minutes = minutes;
    }

    getMinutes(timeId) {
        return document.getElementById(timeId).textContent;
    }
}

//create an instance for each

let p1time = new Timer('min1', document.getElementById('min1').textContent);
let p2time = new Timer('min2', document.getElementById('min2').textContent);

// Swap player's timer after a move (player1 = 1, player2 = 2).
const swapPlayer = () => {
    if (!playing) return;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    click.play();
}

// Start timer countdown to zero.
const startTimer = () => {
    playing = true;
    let p1sec = 60;
    let p2sec = 60;

    let timerId = setInterval(function() {
        //player 1
        if (currentPlayer === 1) {
            if (playing) {
                buttons[0].disabled = true;
                p1time.minutes = parseInt(p1time.getMinutes('min1'), 10);
                if (p1sec === 60) {
                    p1time.minutes = p1time.minutes - 1; 
                }

                p1sec = p1sec -1;
                document.getElementById('sec1').textContent = padZero(p1sec);
                document.getElementById('min1').textContent = padZero(p1time.minutes);

                if (p1sec === 0 && p1time.minutes === 0) {
                    clearInterval(timerId);
                    playing = false; 
                }

                p1sec = 60;
            }
        }
        else {
            //player 2
            if (playing) {
                p2time.minutes = parseInt(p2time.getMinutes('min2'), 10);
                if (p2sec === 60) {
                    p2time.minutes = p2time.minutes - 1;
                }

                p2sec = p2sec - 1;
                document.getElementById('sec2').textContent = padZero(p2sec);
                document.getElementById('min2').textContent = padZero(p2time.minutes);

                if (p2sec === 0) {
                    if (p2sec === 0 && p2time.minutes === 0) {
                        clearInterval(timerId);
                        playing = false; 
                    }

                    p2sec = 60;
                }
            }
        }
    }, 1000);
}

panel.addEventListener('click', swapPlayer);

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
        if (buttons[i].textContent === 'START') {
            buttons[i].style.color = '#EEEEEE';
            buttons[i].style.backgroundColor = '#606060';
            startTimer();
        }
        else {
            location.reload(true);
        }
    });
}