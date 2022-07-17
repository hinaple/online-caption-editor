<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { fade } from "svelte/transition";
    const dispatch = createEventDispatcher();

    export let title;
    export let value;
    export let placeholder = '';

    let valueInput;
    onMount(() => {
        valueInput.focus();
        if(value.length) valueInput.setSelectionRange(0, value.length);
    });

    function confirm() {
        dispatch("confirm");
    }
    function cancel() {
        dispatch("cancel");
    }
    function onInput(evt) {
        if(evt.key === "Escape") cancel();
        else if(evt.key === "Enter") confirm();  
    }
</script>

<style>
    .container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        background-color: #141124a8;
    }
    .modal {
        position: fixed;
        width: calc(100% - 200px);
        max-width: 300px;
        padding: 40px;
        z-index: 6;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #f5f5f5;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .title {
        font-weight: 900;
        font-size: 20px;
    }
    .value {
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        border-radius: 20px;
        padding: 5px 8px 5px 8px;
        border: solid 1px #141124;
        transition: border-width 0.2s 0s ease;
        font-size: 18px;
    }
    .value:focus {
        outline: none;
        border-width: 2px;
    }
    .buttons {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: right;
        gap: 10px;
        margin-top: 10px;
    }
    .buttons button {
        font-size: 18px;
        font-weight: 900;
        color: #fff;
        background-color: #141124;
        border: none;
        padding: 6px 13px 6px 13px;
        border-radius: 20px;
    }
    .cancel {
        background-color: #504d5f !important;
    }
</style>

<div class="container" transition:fade={{duration: 200}}>
    <div class="modal">
        <span class="title">
            {title}
        </span>
        <input class="value"
            bind:value={value}
            placeholder={placeholder}
            on:keydown={onInput}
            bind:this={valueInput}
        />
        <div class="buttons">
            <button class="cancel" on:click={cancel}>cancel</button>
            <button class="confirm" on:click={confirm}>confirm</button>
        </div>
    </div>
</div>