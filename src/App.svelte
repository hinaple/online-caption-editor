<script>
    import Header from "./Header.svelte";
    import Landing from "./Landing.svelte";
    import Editor from "./editor/Editor.svelte";
    import Prompt from "./Prompt.svelte";

    import DetectKeyEvents from "./lib/keyevent/DetectKeyEvents.svelte"
    import { addListener } from "./lib/headerEvent";
    import Project from "./lib/project.js";
      
    let headerHiding = true;
    let project;
    let currentScreen = "landing";

    function changeScreen(screen) {
        currentScreen = screen;
    }
    function startEditing(evt) {
        project = evt.detail?.project ?? evt;
        changeScreen("editing");
    }

    let asking = null;
    function askWithoutSave(cb) {
        asking = {
            title: "Are you sure you to exit without saving?",
            type: "confirm",
            confirm: () => {
                asking = null;
                cb();
            },
            cancel: () => {
                asking = null;
            }
        }
    }
    function askName(cb) {
        asking = {
            title: "Enter Project Name!",
            type: "prompt",
            value: '',
            confirm: () => {
                asking = null;
                cb();
            },
            cancel: () => {
                asking = null;
            }
        };
    }
    addListener("new", () => {
        if(project) askWithoutSave(() => {
            askName(() => {
                startEditing(new Project(''));
            });
        })
        else askName(() => {
            startEditing(new Project(''));
        });
    });
</script>

<DetectKeyEvents />

{#if asking}
    <Prompt
        title={asking.title}
        type={asking.type}
        value={asking.value}
        on:confirm={asking.confirm}
        on:cancel={asking.cancel}
    />
{/if}

<Header hiding={headerHiding}/>
{#if currentScreen === "landing"}
    <Landing
        on:showHeader={() => { headerHiding = false; }}
        on:startProj={startEditing}
    />
{:else if currentScreen === "editing"}
    <Editor project={project}/>
{/if}