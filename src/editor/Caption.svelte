<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    const dispatch = createEventDispatcher();
    import { scale } from "svelte/transition";
    import Caption from "../lib/caption.js";
    import { outClick } from "../lib/outclick";

    const outTransition = (node, args) => scale(node, { duration: caption.deleted? 200: 0 });

    export let part = 'middle';
    export let caption = new Caption();
    export let editing = false;

    export let forSync = false;
    export let selecting = false;

    let reRenderer = {};
    function reRender() {
        reRenderer = {};
    }

    let editCont = caption.content;
    let textarea;

    $: if(textarea) {
        textarea.focus();
        autoGrow();
    }

    function selectCaption() {
        if(!forSync) return;
        if(selecting) dispatch("goto", caption.startTime.time)
        else dispatch("select")
    }

    function autoGrow() {
        textarea.style.height = "5px";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
    function captionClick() {
        if(editing || forSync) return;
        editCont = caption.content;
        dispatch("edit");
    }
    function inputContent(evt) {
        caption.setContent(evt.target.value);
        autoGrow();
        dispatch("input", evt.target.value);
    }
    function keyDown(evt) {
        if(evt.key === "Escape") blurContent();
        if(evt.ctrlKey) {
            if(evt.key === "ArrowDown") {
                if(evt.shiftKey) newCaption();
                else move(1);
            }
            else if(evt.key === "ArrowUp") move(-1);
            else if(evt.key === "Delete") {
                deleteThis();
            }
        }
    }
    function newCaption() {
        caption.setContent(editCont.trim());
        dispatch("newCaption");
    }
    function move(dir) {
        caption.setContent(editCont.trim());
        dispatch("move", dir);
    }
    function blurContent() {
        if(!editing) return;
        caption.setContent(editCont.trim());
        dispatch("stopEdit");
        editCont = '';
        reRender();
    }
    function strToLines(str) {
        return str.split('\n');
    }
    function deleteThis() {
        blurContent();
        dispatch("delete");
    }
    function swap(dir) {
        if(
            dir === -1 && part === "top" ||
            dir === 1 && part === "bottom"
        ) return;
        dispatch("swap", dir);
    }
</script>

<style>
    .caption {
        width: calc(100% - 28px);
        padding: 0 5px 10px 5px;
        margin: 0 14px 0 14px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: right;
        gap: 3px;
        font-size: 15px;
    }
    .caption.forSync {
        cursor: pointer;
        transition: background-color .2s 0s ease;
        user-select: none;
        border-radius: 10px;
    }
    .caption.forSync.selecting {
        background-color: #141124;
        color: #fff;
        padding: 0 5px 10px 10px;
    }
    .caption.new-caption {
        animation: from-left .3s 0s forwards ease-out;
    }
    .options {
        width: 100%;
        height: 24px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 3px auto;
        padding-left: 2px;
    }
    .tools {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        top: 3px;
        gap: 7px;
    }
    .tools.selecting {
        left: 5px;
    }
    .delete {
        position: relative;
        width: 15px;
        height: 15px;
        left: 0;
        opacity: .3;
        cursor: pointer;
        transition: all .3s 0s ease;
    }
    .delete:hover {
        opacity: 1;
        transform: rotate(90deg);
    }
    .delete:before, .delete:after {
        position: absolute;
        content: ' ';
        left: 50%;
        height: 15px;
        width: 2px;
        border-radius: 1px;
        background-color: #141124;
    }
    .delete:before {
        transform: rotate(45deg);
    }
    .delete:after {
        transform: rotate(-45deg);
    }
    .swap {
        width: 10px;
        height: 10px;
        position: relative;
        opacity: .3;
        transition: all .3s 0s ease;
        cursor: pointer;
    }
    .swap.up {
        top: 2.5px;
        transform: rotate(45deg);
    }
    .swap.up:hover {
        opacity: 1;
        top: 0;
    }
    .caption.top .swap.up {
        pointer-events: none;
    }
    .swap.down {
        left: 2px;
        bottom: 2.5px;
        transform: rotate(-135deg);
    }
    .swap.down:hover {
        opacity: 1;
        bottom: 0;
    }
    .caption.bottom .swap.down {
        pointer-events: none;
    }
    .swap:before, .swap:after {
        left: 0;
        top: 0;
        content: ' ';
        position: absolute;
        background-color: #141124;
        border-radius: 2px;
    }
    .swap.selecting:before, .swap.selecting:after {
        background-color: #fff;
    }
    .swap:before {
        width: 2px;
        height: 100%;
    }
    .swap:after {
        width: 100%;
        height: 2px;
    }
    .time {
        padding: 2px 9px 2px 9px;
        margin-bottom: 3px;
        color: #fff;
        background-color: #141124;
        border-radius: 0 0 12px 12px;
        box-shadow: #14112456 0 5px 5px;
    }
    .content {
        width: 100%;
        box-sizing: border-box;
        padding: 0 3px 0 3px;
        overflow-x: hidden;
        display: flex;
        word-break: break-all;
        flex-direction: column;
        gap: 3px;
        cursor: pointer;
        font-weight: 400;
        font-size: 15px;
    }
    .line {
        word-break: break-all;
        line-height: 19px;
    }
    .enter {
        opacity: .5;
    }
    .line.empty {
        opacity: .6;
    }
    .edit-area {
        resize: none;
        width: 100%;
        font-size: 15px;
        background-color: transparent;
        border: none;
        font-weight: 900;
    }
    .edit-area:focus {
        outline: none;
    }
    @keyframes from-left {
        from {
            background-color: #fff;
            border-right: solid #000 5px;
            box-shadow: #000 0 0 10px;
            transform: translateX(-100%);
        }
    }
</style>

<div
    class="caption"
    
    class:forSync={forSync}
    class:selecting={selecting}
    on:click={selectCaption}

    class:new-caption={!caption.old}
    class:top={part === "top"}
    class:bottom={part === "bottom"}
    out:outTransition={{ duration: 200 }}
    use:outClick
    on:outclick={blurContent}
>
    <div class="options">
        <div class="tools" class:selecting={selecting}>
            {#if !forSync}
                <span class="delete" on:click={deleteThis}></span>
            {/if}
            <span class="swap up" class:selecting={selecting} on:click|stopPropagation={() => swap(-1)}></span>
            <span class="swap down" class:selecting={selecting} on:click|stopPropagation={() => swap(1)}></span>
        </div>
        <span class="time">
            {caption.startTime ?? '?'}~{caption.endTime ?? '?'}
        </span>
    </div>
    <div class="content" on:click={captionClick}>
        {#if editing}
            <textarea
                spellcheck={false}
                class="edit-area"
                on:keydown={keyDown}
                on:input={inputContent}
                bind:value={editCont}
                bind:this={textarea}
            />
        {:else}
            {#key reRenderer}
                {#if caption.content.trim() === ''}
                    <span class="line empty">Empty Line</span>
                {:else}
                    {#each strToLines(caption.content) as line, index}
                        <span class="line">{line}
                            {#if strToLines(caption.content).length - 1 !== index}
                                <span class="enter">↵</span>
                            {/if}
                        </span>
                    {/each}
                {/if}
            {/key}
        {/if}
    </div>
</div>