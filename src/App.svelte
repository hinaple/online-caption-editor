<script>
      import Header from "./Header.svelte";
      import Landing from "./Landing.svelte";
      import Editor from "./editor/Editor.svelte";

      import DetectKeyEvents from "./lib/keyevent/DetectKeyEvents.svelte"
      
      let headerHiding = true;
      let project;
      let currentScreen = "landing";

      function changeScreen(screen) {
            currentScreen = screen;
      }
      function startEditing(evt) {
            project = evt.detail.project;
            changeScreen("editing");
      }
</script>

<DetectKeyEvents/>

<Header hiding={headerHiding}/>
{#if currentScreen === "landing"}
      <Landing
            on:showHeader={() => { headerHiding = false; }}
            on:startProj={startEditing}
      />
{:else if currentScreen === "editing"}
      <Editor project={project}/>
{/if}