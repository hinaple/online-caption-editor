<script>
    export let caption = "";
</script>

<style>
    .caption {
        padding: 5px;
        background-color: #141124a2;
        color: #fff;
        font-weight: 400;
        font-size: 15px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 30px;
        border-radius: 5px;
        user-select: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
    }
    .line {
        text-align: center;
    }
</style>

{#if caption}
    <div class="caption">
        {#each caption.split("\n") as line}
            <span class="line">
                {line}
            </span>
        {/each}
    </div>
{/if}