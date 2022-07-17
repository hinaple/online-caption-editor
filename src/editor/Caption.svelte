<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    const dispatch = createEventDispatcher();
    import { scale } from "svelte/transition";
    import Caption from "../lib/caption.js";
    import { outClick } from "../lib/outclick";

    export let part = 'middle';
    export let caption = new Caption();
    export let editing = false;

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

    function autoGrow() {
        textarea.style.height = "5px";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
    function captionClick() {
        if(editing) return;
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
            if(evt.key === "ArrowDown") move(1);
            else if(evt.key === "ArrowUp") move(-1);
        }
        else if(evt.shiftKey) {
            if(evt.key === '+') {
                newCaption();
                evt.preventDefault();
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
        caption.setContent(editCont.trim());
        dispatch("stopEdit");
        editCont = '';
        reRender();
    }
    function strToLines(str) {
        return str.split('\n');
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
        animation: from-left 0.3s 0s forwards ease-out;
    }
    .caption.top {
        border-top: solid 2px #141124;
    }
    .time {
        height: 24px;
        padding: 2px 9px 2px 9px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: right;
        margin: 0 0 3px auto;
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
    class:top={part === "top"}
    class:bottom={part === "bottom"}
    out:scale={{ duration: 200 }}
>
    <div class="time">
        {caption.startTime ?? '?'}~{caption.endTime ?? '?'}
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
                use:outClick
                on:outclick={blurContent}
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