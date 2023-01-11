<script>
    import { onMount } from "svelte";

    export let value = 80;

    const storageValue = Number(localStorage.getItem("zoomLv"));
    if(storageValue) value = storageValue;
    else saveValue();

    function saveValue() {
        localStorage.setItem("zoomLv", value.toString())
    }

    const MIN = 1;
    const MAX = 200;
    let lineEl;
    let lineWidth;
    let linePos;
    
    export let updateLine = () => {
        const lineInfo = lineEl.getBoundingClientRect();
        lineWidth = lineInfo.width;
        linePos = lineInfo.x;
    }
    onMount(() => {
        updateLine();
    });

    let clicking = false;
    function mouseDown(evt) {
        console.log(value);
        clicking = true;
        mouseMove(evt);
    }
    function mouseMove(evt) {
        if(!clicking) return;
        window.getSelection().removeAllRanges();
        let mousePos = evt.clientX - linePos;
        if(mousePos < 0) mousePos = 0;
        else if(mousePos > lineWidth) mousePos = lineWidth;
        value = mousePos / lineWidth * (MAX - MIN) + MIN;
    }
    function mouseUp() {
        clicking = false;
        saveValue();
    }
</script>

<style>
    .bar {
        width: 200px;
        height: 6px;
        background-color: #000;
        border-radius: 3px;
        position: relative;
        cursor: pointer;
    }
    .handle {
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #000;
        top: 50%;
        transform: translateY(-50%);
    }
</style>

<svelte:body
    on:mousemove={mouseMove}
    on:mouseup={mouseUp}
/>

<div
    class="bar"
    bind:this={lineEl}
    id="aaaaa"
    on:mousedown={mouseDown}
>
    <div class="handle" style={`left: ${(value - MIN) / (MAX - MIN) * lineWidth - 9}px;`}></div>
</div>