<script>
    import { onMount } from "svelte";

    export let timestamp = 0;
    export let duration = 0;
    export let goto = (t, s) => {};

    export let clicking = false;

    let handle;
    let line;
    let length;
    let linePos;

    export const updateLine = () => {
        const lineBox = line.getBoundingClientRect();
        length = lineBox.width - 20;
        linePos = lineBox.left + 5;
    }
    onMount(() => {
        updateLine();
    });

    function getMousePos(evt) { //mouse position relative to timeline
        let mousePos = evt.clientX - linePos;
        if(mousePos < 0) mousePos = 0;
        else if(mousePos > length) mousePos = length;
        return mousePos;
    }
    function mouseDown(evt) {
        window.getSelection().removeAllRanges();
        clicking = true;
        mouseMove(evt);
    }
    function mouseMove(evt) {
        if(!clicking) return;
        evt.preventDefault();
        const mousePos = getMousePos(evt);
        const resultTS = mousePos * duration / length;
        setTS(resultTS, false);
        moveHandle(resultTS * 1000);
    }
    function mouseUp(evt) {
        if(!clicking) return;
        clicking = false;
        const mousePos = getMousePos(evt);
        setTS(mousePos * duration / length, true);
    }

    function setTS(time, seekahead = true) {
        if(time < 0) time = 0;
        else if(time > duration) time = duration;
        timestamp = time * 1000;
        goto(time, seekahead);
    }
    function moveHandle(time = null) {
        handle.style.left = `${(time ?? timestamp) / (duration * 1000) * length}px`
    }
    $: if(handle && !clicking) moveHandle(timestamp);

    // function resize() {
    //     updateLine();
    // }
</script>

<style>
    .timeline {
        width: calc(100%);
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .line {
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background-color: #141124;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s 0s ease;
    }
    .line:hover {
        height: 10px;
        border-radius: 5px;
    }
    .handle {
        width: 20px;
        height: 20px;
        background-color: #141124;
        border-radius: 10px;
        position: relative;
    }
</style>

<svelte:body on:mousemove={mouseMove} on:mouseup={mouseUp}/>

<div class="timeline">
    <div class="line" bind:this={line} on:mousedown={mouseDown}>
        <div class="handle" bind:this={handle}></div>
    </div>
</div>