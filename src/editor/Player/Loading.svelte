<script>
    import { fade } from "svelte/transition";
</script>

<style>
    .loading {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: #141124ab;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loader {
        position: absolute;
        width: 130px;
        height: 130px;
        animation: spin 2s 0s linear infinite;
        border-radius: 50%;
        box-shadow:
            #6eb9ffc4 0 30px 50px,
            #eaf5ffd0 0 20px 20px,
            #be6effc4 0 -30px 50px,
            #eaf5ffd0 0 -20px 20px;
    }

    @keyframes spin {
        to {
            transform: rotateZ(360deg);
        }
    }
</style>

<div class="loading" transition:fade={{ duration: 100 }}>
    <div class="loader"></div>
</div>