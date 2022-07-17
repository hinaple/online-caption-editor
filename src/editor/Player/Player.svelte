<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import Youtube from "./Youtube.svelte";
    import Timeline from "./Timeline.svelte";
    import Sound from "./Sound.svelte";
    import Loading from "./Loading.svelte";
    import KeyEvents from "../../lib/keyevent";
    import ShowCaption from "./ShowCaption.svelte";

    export let videoId = "75d_29QWELk";
    export let timestamp = 0;
    export let playing = false;
    export let bufferring = false;
    export let duration = 0;
    export let volume = 0;
    export let currentCaption = null;
    let clicking = false;

    export const controller = {
        play,
        pause,
        toggle,
        goto
    }

    let prevTS = 0;
    let player;

    const evts = [];
    onMount(() => {
        evts.push(KeyEvents.KeyEvent.makeEvent("Tab", evt => {
            toggle();
            evt.preventDefault();
        }, "down"));
        evts.push(KeyEvents.KeyEvent.makeEvent("ArrowRight", evt => {
            goto(timestamp / 1000 + 5)
            evt.preventDefault();
        }, "down", [ "ctrl" ]));
        evts.push(KeyEvents.KeyEvent.makeEvent("ArrowLeft", evt => {
            goto(timestamp / 1000 - 5)
            evt.preventDefault();
        }, "down", [ "ctrl" ]));
    });
    onDestroy(() => {
        evts.forEach(currentEvt => {
            KeyEvents.removeEvent(currentEvt);
        });
    })
    function toggle() {
        if(!player) return;
        playing = !playing;
        if(playing) play();
        else pause();
    }
    function play() {
        player.playVideo();
    }
    function pause() {
        player.pauseVideo();
    }
    function goto(target, seekahead = true) {
        if(!player) return;
        if(target < 0) target = 0;
        else if(target > duration) target = duration;
        player.seekTo(target, seekahead);
    }
    function setVol(evt) {
        if(!player) return;
        player.setVolume(evt.detail);
    }
    function onVideoMount() {
        duration = player.getDuration();
        volume = player.getVolume();
    }
    function onPlay() {
        playing = true;
        bufferring = false;
        dispatch("play");
        updateTS();
        volume = player.getVolume();
    }
    function onPause() {
        playing = false;
        dispatch("pause");
        updateTS();
    }
    function onBuffer() {
        bufferring = true;
        dispatch("buffer");
    }
    function onEnd() {
        playing = false;
        dispatch("end");
    }
    function onStateChange(evt) {
        const code = evt.detail;
        if(code === 1) onPlay();
        else if(code === 2) onPause();
        else if(code === 3) onBuffer();
        else if(code === 0) onEnd();
    }

    function updateTS() {
        timestamp = player.getCurrentTime() * 1000;
    }

    let refresh = 5000;
    window.requestAnimationFrame(updateTimestamp);
    function updateTimestamp(ts) {
        const currentTS = ts - prevTS;
        if(playing && !clicking && !bufferring) {
            refresh -= currentTS;
            timestamp += currentTS;
            if(currentTS > 100 || refresh < 0) {
                refresh = 5000;
                updateTS();
            }
        }
        prevTS = ts;
        window.requestAnimationFrame(updateTimestamp);
    }

    function addZero(num, deg) {
        return (new Array(deg).join('0') + num).slice(-deg);
    }
    function secToFormat(sec, showHour = false) {
        const secs = sec % 60;
        const mins = Math.floor(sec / 60) % 60;
        const hrs = Math.floor(sec / (60 * 60));
        return (
            ((hrs || showHour)? `${hrs}:`: '') +
            `${addZero(mins, 2)}:` + 
            `${addZero(secs, 2)}`
        );
    }
</script>

<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .video {
        width: 100%;
        height: 100%;
        user-select: none;
        position: relative;
    }
    .control {
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        background-color: #dbd8e7;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 20px 0 20px;
        gap: 13px;
        border-radius: 0 0 5px 5px;
    }
    .touch-block {
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    .control-btn {
        --size: 24px;
        box-sizing: border-box;
        width: var(--size);
        height: var(--size);
        border: solid;
        cursor: pointer;
    }
    .control-btn.play {
        border-width: calc(var(--size) / 2) 0 calc(var(--size) / 2) var(--size);
        border-color: transparent transparent transparent #141124;
    }
    .control-btn.pause {
        border-width: 0 calc(var(--size) / 3) 0 calc(var(--size) / 3);
        border-color: transparent #141124 transparent #141124;
    }
    .times {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        user-select: none;
        pointer-events: none;
    }
    .time {
        width: 100%;
    }
    .time.left {
        text-align: right;
    }
</style>

<div class="container">
    <div class="video" on:click={toggle}>
        {#if bufferring}<Loading/>{/if}
        <ShowCaption caption={currentCaption ?? ''} />
        <div class="touch-block">
            <Youtube
                bind:player={player}
                videoId={videoId}
                options={{
                    fs: 0,
                    controls: 0,
                    disablekb: 1,
                    rel: 0,
                    modestbranding: 1,
                    enablejsapi: 1,
                    origin: "preview.fainthit.com",
                    showinfo: 0
                }}
                on:ready={onVideoMount}
                on:stateChange={onStateChange}
            />
        </div>
    </div>
    <div class="control">
        <div on:click={toggle} class="play-pause">
            {#if playing}<div class="control-btn pause"></div>
            {:else}<div class="control-btn play"></div>{/if}
        </div>
        <Timeline
            bind:timestamp={timestamp}
            bind:clicking = {clicking}
            duration={duration}
            goto={goto}
        />
        <Sound volume={volume} on:setVolume={setVol}/>
        <div class="times">
            <div class="time left">{secToFormat(Math.floor(timestamp / 1000), duration > 60 * 60)}</div>
            /
            <div class="time">{secToFormat(duration)}</div>
        </div>
    </div>
</div>