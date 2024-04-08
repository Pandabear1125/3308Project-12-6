//timer 
document.addEventListener("DOMContentLoaded", function() {
    const gameTypeSelect = document.getElementById("game-type");

    gameTypeSelect.addEventListener("change", function() {
        let timerDuration; 

        switch(selectedGameType) {
            case "standard":
                timerDuration = 600;
                break; 
            case "blitz":
                timerDuration = 180;
                break; 
            case "bullet":
                timerDuration = 60;
                break; 
            default:
                timerDuration = 0; 
        }

        displayTimer(timerDuration); 
    });

    //display
    function displayTimer(durationInSeconds) {
        const timer = document.getElementById("timer");
        timer.innerHTML = ""; 

        const timerDisplay = document.createElement("div");
        timer.appendChild(timerDisplay); 

        const interval = setInterval(function() {
            if (durationInSeconds <= 0) {
                clearInterval(interval);
                timerDisplay.textContent = "Time's up!";
                return; 
            }

            const minutes = Math.floor(durationInSeconds / 60); 
            const seconds = durationInSeconds % 60; 

            timerDisplay.textContent = '${minutes}:${seconds < 10 ? O + seconds : seconds}'; 
            durationInSeconds--; 
        }, 1000); 
    }
})