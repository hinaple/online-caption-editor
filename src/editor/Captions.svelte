<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { flip } from "svelte/animate";
    import Window from "./Window.svelte";
    import CaptionComponent from "./Caption.svelte";
    import CaptionPlus from "./CaptionPlus.svelte";
    import Caption from "../lib/caption.js";

    export let captions = [];
    export let showCaptions = captions;
    export let type = "Editing";
    export let currentCaption = null;
    export let forSync = false;
    export let selectedCaption = captions.length? 0: -1;

    export const reload = () => {
        showCaptions = [ ...captions ];
    }

    function isInScreen(node) {
        const rect = node.getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < -100 || rect.top - viewHeight >= 100);
    }
    function fastFlip(node, fromTo, params = {}) {
        if(isInScreen(node)) return flip(node, fromTo, params);
        else return { delay: 0, duration: 0 };
    }

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
    async function removeCaption(idx) {
        const targetCaption = captions[idx];
        targetCaption.setDeleted();
        captions.splice(idx, 1);
        reloadCaptions();
    }
    function changeGeneration() {
        captions.forEach(caption => caption.getOld());
    }
    function reloadCaptions() {
        reload();
        dispatch("reload");
    }
    reloadCaptions();
    function pushCaption() {
        captions.push(new Caption());
    }
    async function newCaption(idx) {
        if(idx >= captions.length) pushCaption();
        else captions.splice(idx, 0, new Caption());
        reloadCaptions();
        setTimeout(changeGeneration, 1000);
    }
    function insertCaption(idx) {
        newCaption(idx);
        startEdit(idx);
    }
    async function swapCaptions(a, b) {
        changeGeneration();
        const tempCaption = captions[a];
        captions[a] = captions[b];
        captions[b] = tempCaption;
        if(editing === a) editing = b;
        else if(editing === b) editing = a;
        reloadCaptions();
    }

    function selectCaption(idx) {
        selectedCaption = idx;
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
    .caption-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    hr {
        width: calc(100% - 28px);
        background-color: #141124;
        height: 2px;
        margin: 0;
        flex-shrink: 0;
        flex-grow: 0;
        box-sizing: border-box;
        border: none;
    }
</style>

<Window>
    <span slot="title">{type}</span>
    <div class="captions">
        {#if captions.length}
            <hr />
            {#each showCaptions as caption, index (caption.key)}
                <div class="caption-container" animate:fastFlip={{ duration: 200, index }}>
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
                        on:delete={() => removeCaption(index)}
                        on:swap={evt => swapCaptions(index, index + evt.detail)}
                        editing={editing === index}

                        forSync={forSync}
                        on:select={() => { selectCaption(index) }}
                        on:goto={(evt) => { dispatch("goto", evt.detail) }}
                        selecting={index === selectedCaption}
                    />
                    {#if !forSync}
                        <CaptionPlus on:click={() => insertCaption(index + 1)} />
                    {:else}
                        <hr />
                    {/if}
                </div>
            {/each}
        {:else}
            <CaptionPlus on:click={() => insertCaption(0)} />
        {/if}
    </div>
</Window>