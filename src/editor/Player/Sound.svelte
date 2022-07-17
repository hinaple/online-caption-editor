<script>
    import Volume from "./Volume.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let volume = 0;
    let prvVolume = volume || 50;
    let showVolume = false;

    let controlling;

    function setVolume(vol) {
        volume = vol?.detail ?? vol;
        dispatch("setVolume", volume);
    }
    function mute(evt) {
        if(evt.target.className.startsWith("nomouse")) return;
        if(volume) {
            prvVolume = volume;
            setVolume(0);
        }
        else setVolume(prvVolume);
    }
    function onMouseOver() {
        showVolume = true;
    }
    function onMouseOut() {
        showVolume = false;
    }
</script>

<style>
    .speaker {
        cursor: pointer;
        flex-shrink: 0;
        width: 28px;
        height: 29px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 3px;
    }
    .icon {
        box-sizing: border-box;
        width: 19px;
        height: 100%;
        flex-shrink: 0;
        background-color: #141124;
        border: solid;
        border-width: 8px 10px 8px 0;
        border-color: #dbd8e7 #141124 #dbd8e7 transparent;
        transition: opacity 0.2s 0s ease;
    }
    .volume {
        width: 9px;
        height: 24px;
        box-sizing: border-box;
        border: solid;
        border-width: 6px 9px 6px 0;
        border-color: transparent #141124 transparent transparent;
        transform-origin: left;
        transition: transform 0.1s 0s ease;
    }
</style>

<div
    class="speaker"
    on:click={mute}
    on:focus={onMouseOver}
    on:mouseover={onMouseOver}
    on:mouseout={onMouseOut}
    on:blur={onMouseOut}
>
    <div class="icon" style={`opacity: ${volume? '1': '0.5'};`}></div>
    <div class="volume" style={`transform: scale(${volume}%)`}></div>
    {#if showVolume || controlling}
        <Volume
            bind:volume={volume}
            on:setVolume={setVolume}
            bind:clicking={controlling}
        />
    {/if}
</div>