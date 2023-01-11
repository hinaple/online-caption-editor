<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { outClick } from "./lib/outclick";
    import { call } from "./lib/headerEvent";

    const headButtons = [
        {
            name: "file",
            btns: [
                [ "New Project", "new" ],
                [ "Open Project", "open" ],
                [ "Save Project", "save" ],
                "hr",
                [ "Import .srt", "import" ],
                [ "Export .srt", "export" ],
            ],
            child: null,
            opening: false
        },
        // {
        //     name: "edit",
        //     btns: [
        //         [ "Undo", "undo" ],
        //         [ "Redo", "redo" ],
        //         "hr",
        //         [ "Copy", "copy" ],
        //         [ "Cut", "cut" ],
        //         [ "Paste", "paste" ],
        //     ],
        //     child: null,
        //     opening: false
        // },
        {
            name: "view",
            btns: [
                [ "Typing Layout", "typeview" ],
                [ "Syncing Layout", "syncview" ]
            ]
        },
        {
            name: "help",
            btns: [
                [ "Shortcuts", "shortcut" ],
                "hr",
                [ "Contact", "contact" ],
                [ "Information", "info" ],
            ],
            child: null,
            opening: false
        }
    ]
    function open(menu) {
        if(headButtons[menu].opening) {
            close(menu);
            return;
        }
        headButtons[menu].opening = true;
    }
    function close(menu) {
        if(!headButtons[menu].opening) return;
        headButtons[menu].opening = false;
    }
    function click(menu) {
        call(menu);
    }
</script>

<style>
    .container {
        height: 100%;
        width: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .button {
        color: #fff;
        height: 40%;
        font-size: 20px;
        padding: 0 40px 0 40px;
        border-left: solid 1px #fff;
        border-right: solid 1px #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        cursor: pointer;
    }
    .child-buttons {
        min-width: 100px;
        background-color: #fff;
        padding: 20px 30px 20px 30px;
        border-radius: 20px;
        position: absolute;
        top: 80px;
        color: #141124;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 18px;
        margin-left: -40px;
        transform: scaleY(0);
        transform-origin: top;
        transition: transform 0.2s 0s ease;
        cursor: auto;
        z-index: 3;
        pointer-events: none;
    }
    .child-buttons.opened {
        transform: none;
        pointer-events: all;
    }
    .child-button {
        position: relative;
        cursor: pointer;
    }
    .child-button::before {
        content: ""; 
        position: absolute;
        width: 0;
        height: 1px;
        bottom: -2px;
        left: 0;
        background-color: #141124;
        -webkit-transition: all 0.3s ease-in-out 0s; 
        transition: all 0.3s ease-in-out 0s;
    }
    .child-button:hover::before {
        width: 100%;
    }
    hr {
        border-top: solid 1px #141124;
        width: 100%;
    }
</style>

<div class="container">
    {#each headButtons as menu, index}
        <div class="button"
            use:outClick
            on:outclick={() => { close(index) }}
            on:click|self={() => { open(index) }}
        >
            { menu.name }
            <div class="child-buttons" class:opened={menu.opening}>
                {#each menu.btns as btn}
                    {#if typeof btn === "string"}
                        <hr>
                    {:else}
                        <div
                            class="child-button"
                            on:click={() => {
                                click(btn[1]);
                                close(index);
                            }}
                        >{btn[0]}</div>
                    {/if}
                {/each}
            </div>
        </div>
    {/each}
</div>