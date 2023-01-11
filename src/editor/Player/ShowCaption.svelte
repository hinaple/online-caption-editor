<script>
    export let caption = "";
    export let bigCC = false;
</script>

<style>
    .caption {
        padding: 5px;
        color: #fff;
        font-weight: 400;
        font-size: 15px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 30px;
        user-select: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .line {
        max-width: 90%;
        text-align: center;
        background-color: #141124be;
        border-radius: 5px;
        padding: 1px 8px 1px 8px;
        box-sizing: border-box;
    }
    .line.big {
        font-size: 25px;
    }
</style>

{#if caption}
    <div class="caption">
        {#each caption.split("\n") as line, index}
            <div class="line" class:big={bigCC} class:top={index === 0}>
                {line}
            </div>
        {/each}
    </div>
{/if}