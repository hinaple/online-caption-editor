<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import CaptionList from "./CaptionList.svelte";
    import CaptionComponent from "./Caption.svelte";
    import CaptionPlus from "./CaptionPlus.svelte";
    import Caption from "../lib/caption.js";

    export let captions = [];
    export let type = "Editing";
    export let currentCaption = null;

    let editing;
    $: updateCurrentCaption(editing);

    function updateCurrentCaption(editingIdx) {
        if(typeof editingIdx == "number") currentCaption = captions[editingIdx];
        else currentCaption = null;
    }
    function input(cont) {
        dispatch("input", cont);
    }
    function startEdit(idx) {
        editing = idx;
    }
    function stopEdit(idx) {
        if(editing === idx) {
            editing = null;
            updateCurrentCaption(editing);
            dispatch("editStop");
        }
    }
    function move(evt, idx) {
        const result = idx + evt.detail;
        if(result < 0) return;
        else if(result >= captions.length) {
            pushCaption()
        }
        startEdit(result);
    }
    function reloadCaptions() {
        captions = [ ...captions ];
    }
    function pushCaption() {
        captions.push(new Caption());
    }
    function newCaption(idx) {
        if(idx >= captions.length) pushCaption();
        else captions.splice(idx, 0, new Caption());
        reloadCaptions();
    }
    function insertCaption(idx) {
        newCaption(idx);
        startEdit(idx);
    }
</script>

<style>
    .captions {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        padding: 10px 0 25px 0;
        scroll-behavior: smooth;
    }
</style>

<CaptionList>
    <span slot="title">{type}</span>
    <div class="captions">
        {#if captions.length}
            {#each captions as caption, index (caption.key)}
                <CaptionComponent
                    caption={caption}
                    part={
                        !index? 'top': (
                            index === captions.length - 1?
                                'bottom':
                                'middle'
                        )
                    }
                    on:edit={() => { startEdit(index); }}
                    on:stopEdit={() => { stopEdit(index); }}
                    on:move={evt => { move(evt, index) }}
                    on:input={evt => { input(evt.detail) }}
                    on:newCaption={() => insertCaption(index + 1)}
                    editing={editing === index}
                />
                <CaptionPlus on:click={() => insertCaption(index + 1)} />
            {/each}
        {:else}
            <CaptionPlus on:click={() => insertCaption(0)} />
        {/if}
    </div>
</CaptionList>