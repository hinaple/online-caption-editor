<script>
    import { onMount, onDestroy } from "svelte";
    import Player from "./Player/Player.svelte";
    import Captions from "./Captions.svelte";
    import Reference from "./Reference.svelte";
    import Setting from "./Setting.svelte";
    import Syncbar from "./Syncbar.svelte";
    import { addListener, clearListeners } from "../lib/headerEvent";
    import KeyEvents from "../lib/keyevent";

    export let project = {};

    let playerType;
    let playerSync;
    let currentCaption;
    let currentCaptionContent;
    let currentTime;
    let duration;
    let updateSyncbar;

    let selectingCaption;
    let controller;
    let reloadSyncBar;
    let reloadCaptionsList;

    let layout = "typing";

    function reloadAll() {
        reloadCaptionsList();
        reloadSyncBar();
    }
    
    const keyEvtArr = [];
    function clearKeyEvt() {
        keyEvtArr.forEach(currentEvt => {
            KeyEvents.removeEvent(currentEvt);
        });
    }
    onMount(() => {
        addListener("typeview", () => {
            layout = "typing";
            clearKeyEvt();
        });
        addListener("syncview", () => {
            layout = "syncing";

            keyEvtArr.push(KeyEvents.KeyEvent.makeEvent("Escape", evt => {
                selectingCaption = -1;
                evt.preventDefault();
            }, "down"));

            keyEvtArr.push(KeyEvents.KeyEvent.makeEvent("Enter", evt => {
                evt.preventDefault();
            }, "down"));

            keyEvtArr.push(KeyEvents.KeyEvent.makeEvent("ArrowDown", evt => {
                selectingCaption++;
                if(selectingCaption >= project.captions.length) selectingCaption = 0;
                evt.preventDefault();
            }, "down", [ "ctrl" ]));
            
            keyEvtArr.push(KeyEvents.KeyEvent.makeEvent("ArrowUp", evt => {
                selectingCaption--;
                if(selectingCaption < 0) selectingCaption = project.captions.length - 1;
                evt.preventDefault();
            }, "down", [ "ctrl" ]));

            keyEvtArr.push(KeyEvents.KeyEvent.makeEvent("[", evt => {
                if(!project.captions[selectingCaption]) return;
                project.captions[selectingCaption].startTime.set(currentTime);

                if(currentTime > project.captions[selectingCaption].endTime.time)
                    project.captions[selectingCaption].endTime.set(currentTime);

                reloadAll();

                evt.preventDefault();
            }, "down", [ "ctrl" ]));

            keyEvtArr.push(KeyEvents.KeyEvent.makeEvent("]", evt => {
                if(!project.captions[selectingCaption]) return;
                project.captions[selectingCaption].endTime.set(currentTime);
                selectingCaption++;
                if(selectingCaption >= project.captions.length) selectingCaption = -1;
                reloadAll();

                evt.preventDefault();
            }, "down", [ "ctrl" ]));
        });
    });
    onDestroy(() => {
        clearListeners("typeview");
        clearListeners("syncview");
        clearKeyEvt();
    });

    $: if(currentCaption || currentTime || selectingCaption) updateCaptionCont();
    function updateCaptionCont(evt = null) {
        if(layout === "syncing") {
            currentCaptionContent =
                project.captions[selectingCaption]?.content ??
                project?.findCurrentCaption(currentTime)?.content ??
                null;
        }
        else {
            currentCaptionContent =
                evt?.detail ??
                currentCaption?.content ??
                project?.findCurrentCaption(currentTime)?.content ??
                null;
        }
    }

    function VidMount() {
        updateSyncbar();
    }

    function gotoSync(evt) {
        controller.goto(evt.detail / 1000);
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
    .vid-set.sync {
        width: 80%;
    }
    .video {
        aspect-ratio: 16 / 10;
        height: 100%;
    }
    .captions {
        display: flex;
        flex-direction: row;
        gap: 15px;
        width: 60%;
    }
    .captions.sync {
        width: 30%;
    }
</style>

<div class="container">
    {#if layout === "typing"}
        <div class="vid-set">
            <div class="video">
                <Player
                    videoId={project.setting.ytid}
                    bind:this={playerType}
                    currentCaption={currentCaptionContent}
                    bind:timestamp={currentTime}
                    bind:duration={duration}
                    project={project}
                />
            </div>
            <Setting project={project} />
        </div>
        <div class="captions">
            <Captions
                captions={project.captions}
                bind:currentCaption={currentCaption}
                on:input={updateCaptionCont}
                on:editStop={updateCaptionCont}
                bind:reload={reloadCaptionsList}
            />
            <Reference /> 
        </div>
    {:else if layout === "syncing"}
        <div class="vid-set sync">
            <Player
                videoId={project.setting.ytid}
                bind:this={playerSync}
                currentCaption={currentCaptionContent}
                bind:timestamp={currentTime}
                bigCC={true}
                on:vidMount={VidMount}
                bind:controller={controller}
                project={project}
            />
            <Syncbar 
                captions={project.captions}
                bind:timestamp={currentTime}
                duration={duration}
                bind:updateSyncbar={updateSyncbar}
                bind:selectingCaption={selectingCaption}
                bind:reload={reloadSyncBar}
                on:goto={gotoSync}
            />
        </div>
        <div class="captions sync">
            <Captions
                captions={project.captions}
                bind:currentCaption={currentCaption}
                bind:selectedCaption={selectingCaption}
                forSync={true}
                on:goto={gotoSync}
                on:reload={reloadSyncBar}
                bind:reload={reloadCaptionsList}
            />
        </div>
    {/if}
</div>