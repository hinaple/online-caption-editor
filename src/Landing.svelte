<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import FM from "./lib/fileManager";
    import CM from "./lib/SRTmanager";
    import Project from "./lib/project.js";
    import Prompt from "./Prompt.svelte";

    setTimeout(() => dispatch("showHeader"), 1300);

    let project;
    let asking = null;
    function newFile() {
        project = new Project('')
        askName();
    }
    function openFile() {
        FM.open(false, [".srt",".oce"]).then(file => {
            const fileName = FM.getExtension(file.name.trim());
            FM.read(file).then(cont => {
                if(fileName.extension === "srt") {
                    project = new Project(
                        fileName.rest,
                        CM.parse(cont)
                    );
                    askName();
                }
                else if(fileName.extension === "oce") {
                    project = Project.parse(cont);
                    askName();
                }
            });
        });
    }
    function askName() {
        asking = {
            title: "Enter Project Name!",
            value: project.name
        };
    }
    function removeModal() { asking = null; }
    function enterName() {
        removeModal();
        dispatch("startProj", { project });
    }

</script>

<style>
    .main-container {
        width: 100%;
        height: 100%;
    }
    .frame {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
    }
    .frame.first {
        display: flex;
        flex-direction: row;
        gap: 20px;
        align-items: center;
        justify-content: center;
        animation: fade-shrink 0.6s 1.3s ease forwards;
        pointer-events: none;
    }
    .frame.second {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        justify-content: center;
        color: #fff;
        animation: appear 0.6s 1.5s ease forwards;
        opacity: 0;
        pointer-events: none;
    }
    .logo {
        width: 300px;
    }
    .title {
        color: #fff;
        font-size: 50px;
        font-weight: 900;
        overflow: hidden;
    }
    .title-line {
        position: relative;
        animation: show-title 0.5s ease forwards;
        opacity: 0;
    }
    .title :nth-child(1) {
        animation-delay: 0;
    }
    .title :nth-child(2) {
        animation-delay: .2s;
    }
    .title :nth-child(3) {
        animation-delay: .4s;
    }
    .title :nth-child(4) {
        animation-delay: .6s;
    }
    .small-title {
        font-size: 30px;
        font-weight: 900;
    }
    .buttons {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: center;
    }
    .button {
        cursor: pointer;
        user-select: none;
    }
    .button.start {
        width: calc(100% - 100px);
        max-width: 200px;
        height: 80px;
        border-radius: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        color: #141124;
        font-size: 20px;
        font-weight: 900;
        transform: scaleX(0);
        animation: get-wider 0.4s 1.4s ease-out forwards;
        transition: all 0.3s 0s ease;
    }
    .button.start:hover {
        max-width: 240px;
        letter-spacing: 2px;
    }
    .button.open {
        font-weight: 900;
        font-size: 18px;
        text-decoration: underline;
        transition: letter-spacing 0.3s 0s ease;
    }
    .button.open:hover {
        letter-spacing: 2px;
    }
    @keyframes show-title {
        0% {
            left: -100px;
            opacity: 0;
        }
        100% {
            left: 0;
            opacity: 1;
        }
    }
    @keyframes fade-shrink {
        to {
            opacity: 0;
            pointer-events: none;
        }
    }
    @keyframes appear {
        to {
            opacity: 1;
            pointer-events: all;
        }
    }
    @keyframes get-wider {
        from {
            transform: scaleX(0);
        }
        to {
            transform: scaleX(100%);
        }
    }
</style>

<div class="main-container">
    {#if asking}
        <Prompt
            title={asking.title}
            bind:value={asking.value}
            on:cancel={removeModal}
            on:confirm={enterName}
        />
    {/if}
    <div class="frame first">
        <img class="logo" alt="OCAEI" src="./img/logo.png">
        <div class="title">
            <span class="title-line small-title">
                The Ultimate<br>
            </span>
            <span class="title-line">ONLINE<br></span>
            <span class="title-line">CAPTION<br></span>
            <span class="title-line">EDITOR<br></span>
        </div>
    </div>
    <div class="frame second">
        <div class="title">
            OCAEI!
        </div>
        <div class="buttons">
            <div class="button start" on:click={newFile}>
                New Project
            </div> or
            <span class="button open" on:click={openFile}>
                Open File
            </span>
        </div>
    </div>
</div>