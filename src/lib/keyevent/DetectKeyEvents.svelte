<script>
    import keyEvents from "./store.js";

    let evts = {
        press: null,
        down: null,
        up: null
    };
    for(const type in evts) {
        keyEvents[type].subscribe(value => {
            evts[type] = value;
        });
    }

    function executeEvt(currentEvt, type) {
        evts[type].forEach(event => {
            if(event.isPressed(currentEvt)) event.callback(currentEvt);
        });
    }

    function keyDown(currentEvt) {
        executeEvt(currentEvt, "down");
    }
    function keyUp(currentEvt) {
        executeEvt(currentEvt, "up");
    }
    function keyPress(currentEvt) {
        executeEvt(currentEvt, "press");
    }
</script>

<svelte:body on:keydown={keyDown} on:keyup={keyUp} on:keypress={keyPress}/>