<script>
    import Player from "./Player/Player.svelte";
    import Captions from "./Captions.svelte";
    import Reference from "./Reference.svelte";

    export let project = {};

    let player;
    let currentCaption;
    let currentCaptionContent;
    let currentTime;

    $: if(currentCaption || currentTime) updateCaptionCont();
    function updateCaptionCont(evt = null) {
        currentCaptionContent =
            evt?.detail ??
            currentCaption?.content ??
            project?.findCurrentCaption(currentTime)?.content ??
            null;
    }
</script>

<style>
    .container {
        width: 100%;
        height: 100%;
        padding: calc(80px + 15px) 15px 15px 15px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        gap: 15px;
    }
    .vid-set {
        width: 40%;
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 15px;
    }
    .video {
        aspect-ratio: 16 / 10;
        height: 100%;
    }
    .setting {
        width: 100%;
        height: 100%;
        background-color: #dbd8e7;
        border-radius: 5px;
    }
    .caption-editor {
        width: 30%;
        height: 100%;
    }
</style>

<div class="container">
    <div class="vid-set">
        <div class="video">
            <Player bind:this={player} currentCaption={currentCaptionContent} bind:timestamp={currentTime}/>
        </div>
        <div class="setting">

        </div>
    </div>
    <div class="caption-editor">
        <Captions
            captions={project.captions}
            bind:currentCaption={currentCaption}
            on:input={updateCaptionCont}
            on:editStop={updateCaptionCont}
        />
    </div>
    <div class="caption-editor">
        <Reference />
    </div>
</div>