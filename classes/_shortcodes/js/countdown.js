function initialiseCountdown(countFrom, updateCall, action){
    var remaining = countFrom;
    var interval = null

    function updateCountdown(){
        remaining -= 1;
        updateCall(remaining);

        if(remaining <= 0){
            clearInterval(interval)
            action();
        }
    }

    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
}