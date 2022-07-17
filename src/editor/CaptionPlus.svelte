<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { fade } from "svelte/transition";

    function onClick() {
        dispatch("click");
    }
</script>

<style>
    .adder {
        width: calc(100% - 28px);
        background-color: #141124;
        height: 2px;
        display: flex;
        align-items: center;
        flex-direction: column;
        flex-shrink: 0;
        transition: all 0.2s 0s ease;
    }
    .show-plus {
        width: 50px;
        height: 15px;
        background-color: #dbd8e7;
        color: #000;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        border-radius: 0 0 15px 15px;
        box-shadow: rgba(0, 0, 0, .4) 0 4px 4px;
        transition: all 0.2s 0s ease;
        z-index: 2;
        font-weight: 900;
    }
    .show-plus:hover {
        height: 20px;
        box-shadow: rgba(0, 0, 0, .8) 0 7px 7px;
    }
</style>

<div class="adder" on:click={onClick} in:fade={{ duration: 200 }}>
    <div class="show-plus">+</div>
</div>