<script>
    import { onMount, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import ZoomBar from "./ZoomBar.svelte";

    export let captions = [];
    let showCaptions = captions;
    export let duration = 0;
    export let timestamp = 0;
    export let selectingCaption = captions.length? 0: -1;
    export const updateSyncbar = () => {
        const bounding = container.getBoundingClientRect();
        centerPos = bounding.width / 2;
        updateZoomBar();
    }
    let timelineRatio;

    onMount(() => {
        updateSyncbar();
        gridArr = new Array(Math.floor(duration) + 1).fill(true);
    });

    let container;
    let centerPos;
    let gridArr = [];
    
    let updateZoomBar;

    export const reload = () => {
        showCaptions = captions;
    }

    function select(idx) {
        dispatch("select", idx);
        if(selectingCaption === idx) dispatch("goto", captions[selectingCaption].startTime.time);
        else selectingCaption = idx;
    }
</script>

<style>
    .container {
        background-color: #dbd8e7;
        border-radius: 5px;
        height: 200px;
        overflow: hidden;
        position: relative;
    }
    .ctrl-zone {
        position: absolute;
        top: 0;
        right: 0;
        padding-right: 20px;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        z-index: 2;
    }
    .center-bar {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 4px;
        border-radius: 2px;
        height: calc(100% - 20px);
        background-color: #000;
        z-index: 10;
    }
    .triangle {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border: solid;
        border-width: 20px 15px 0 15px;
        border-color: #000 transparent transparent transparent;
    }
    .timeline {
        height: 100%;
        position: absolute;
    }
    .horizontal-bar {
        height: 3px;
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: #000;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .vertical-bar {
        width: 3px;
        height: 60px;
        background-color: #000;
        border-radius: 2px;
    }
    .vertical-bar.big {
        height: 80px;
        width: 4px;
    }
    .caption {
        position: absolute;
        box-sizing: border-box;
        border-radius: 10px;
        background-color: #fff;
        color: #000;
        user-select: none;
        overflow: hidden;
        white-space: nowrap;
        height: 50px;
        font-size: 18px;
        box-shadow: rgba(0, 0, 0, .4) 0 3px 8px;
        border: solid #141124 3px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        transition: .1s 0s ease;
        transition-property: border-color, background-color, border-width, color, font-weight;
    }
    .caption.selecting {
        border-color: #4e3ac0;
        border-width: 5px;
        background-color: #000;
        color: #fff;
        font-weight: 900;
    }
    .caption-content {
        margin-left: 10px;
    }
</style>

<div class="container" bind:this={container}>
    <div class="ctrl-zone">
        <ZoomBar bind:value={timelineRatio} bind:updateLine={updateZoomBar} />
    </div>
    <div class="center-bar">
        <div class="triangle"></div>
    </div>
    <div class="timeline" style={
        `width: ${duration * timelineRatio}px;` +
        `left: ${-timestamp / 1000 * timelineRatio + centerPos}px;`
    }>
        <div class="horizontal-bar">
            {#each gridArr as g, i}
                <div class="vertical-bar" class:big={!(i % 5)}></div>
            {/each}
            {#each showCaptions as caption, i}
                <div
                    class="caption"
                    class:selecting={i === selectingCaption}
                    style={
                        `left: ${caption.startTime.time / 1000 * timelineRatio}px;` +
                        `width: ${(caption.endTime.time - caption.startTime.time) / 1000 * timelineRatio}px;`
                    }
                    on:click={() => { select(i) }}
                >
                    <span class="caption-content">{caption.content}</span>
                </div>
            {/each}
        </div>
    </div>
</div>