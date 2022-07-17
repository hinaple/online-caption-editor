<script>
    import { fade } from "svelte/transition";
    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    export let volume = 0;
    export let clicking = false;
    
    let lineEl;
    let lineWidth;
    let linePos;
    onMount(() => {
        const lineInfo = lineEl.getBoundingClientRect();
        lineWidth = lineInfo.width;
        linePos = lineInfo.x;
    });
    function setVolume(vol) {
        volume = vol;
        dispatch("setVolume", vol);
    }
    function mouseMove(evt) {
        if(!clicking) return;
        window.getSelection().removeAllRanges();
        let mousePos = evt.clientX - linePos + 10;
        if(mousePos < 0) mousePos = 0;
        else if(mousePos > lineWidth) mousePos = lineWidth;
        setVolume(mousePos / lineWidth * 100);
    }
    function mouseUp() {
        clicking = false;
    }
    function mouseDown(evt) {
        clicking = true;
        mouseMove(evt);
    }
</script>

<style>
    .nomouse-mouse-zone {
        box-sizing: border-box;
        position: absolute;
        width: 100px;
        transform: translate(-55px, calc(-100% + 15px));
        padding: 0 0 5px 0;
    }
    .nomouse-container {
        width: 100%;
        padding: 20px;
        background-color: #141124;
        border-radius: 5px;
        box-shadow: #14112485 0 3px 10px;
    }
    .nomouse-volume-line {
        width: 100%;
        height: 10px;
        background-color: #fff;
        border-radius: 5px;
        padding: 0;
    }
    .nomouse-current-volume {
        height: 100%;
        border-radius: 5px;
        background-color: #8e38ff;
        transition: width 0.1s 0s ease;
    }
</style>

<svelte:body on:mousemove={mouseMove} on:mouseup={mouseUp}/>

<div class="nomouse-mouse-zone">
    <div class="nomouse-container" transition:fade={{ duration: 100 }}>
        <div class="nomouse-volume-line" on:mousedown={mouseDown} bind:this={lineEl}>
            <div class="nomouse-current-volume" style={`width: ${volume}%;${clicking? 'transition: none;': ''}`}></div>
        </div>
    </div>
</div>