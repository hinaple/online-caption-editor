<script>
    import { fade } from "svelte/transition";
    import Window from "./Window.svelte";

    export let captions = [];
    let opened = true;

    function toggle() {
        opened = !opened;
    }
</script>

<style>
    .container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: width .3s 0s ease;
    }
    .container.closed {
        width: 53px;
    }
    .head {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .arrow {
        width: 0;
        height: 0;
        border: solid;
        border-width: 15px 10px 0 10px;
        border-color: #000 transparent transparent transparent;
        transform: rotate(0);
        transition: transform .3s 0s ease;
        cursor: pointer;
    }
    .arrow.left {
        transform: rotate(90deg);
    }
    .arrow.right {
        transform: rotate(-90deg);
    }
    textarea {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        resize: none;
        font-family: 'TmoneyRoundWind', sans-serif;
        font-size: 20px;
        padding: 10px;
        background-color: transparent;
    }
</style>

<div class="container" class:closed={!opened}>
    <Window>
        <div slot="title" class="head">
            {#if opened}
                <div class="title" transition:fade={{ duration: 100 }}>Memo</div>
            {:else}
                <span/>
            {/if}
            <div
                class="arrow"
                class:right={opened}
                class:left={!opened}
                on:click={toggle}
            ></div>
        </div>
        <textarea placeholder="Memo Here!"/>
    </Window>
</div>