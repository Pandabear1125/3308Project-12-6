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
        
    }
})