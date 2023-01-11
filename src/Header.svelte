<script>
    export let hiding = false;

    import HeadBtns from "./HeadBtns.svelte";
</script>

<style>
    .header {
        width: 100%;
        height: 80px;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ffffff11;
        z-index: 3;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: solid 1px #fff;
        transition: top 0.3s 0s ease;
        user-select: none;
    }
    .header.hiding {
        top: -81px;
    }
    .title-box {
        margin-left: 30px;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15px;
    }
    .logo {
        height: 60%;
        pointer-events: none;
    }
    .title {
        font-weight: 800;
        font-size: 30px;
        color: #fff;
    }
    .buttons {
        height: 100%;
        margin-left: 40px;
    }
</style>

<div class="header" class:hiding>
    <div class="title-box">
        <img alt="logo" class="logo" src="./img/logo.png">
        <span class="title">OCAEI</span>
    </div>
    <div class="buttons">
        <HeadBtns />
    </div>
</div>