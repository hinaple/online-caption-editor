<script>
    import Window from "./Window.svelte";
    import importSavedSettins from "../lib/settingManager/importSavedSettings.js";
    import { call } from "../lib/settingManager/event.js";

    export let project = {};
    const settings = importSavedSettins(project.setting);
</script>

<style>
    .container {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 15px;
        box-sizing: border-box;
    }
    td {
        font-size: 18px;
        width: fit-content;
    }
    input {
        width: 90%;
        font-size: 18px;
        font-weight: 700;
        padding: 3px;
        border-radius: 12px;
        border: solid #000 2px;
    }
</style>

<Window>
    <span slot="title">Settings</span>
    <div class="container">
        <table>
            {#each settings as setting}
                <tr>
                    <td>{setting.label}</td>
                    <td>
                        <input
                            class="setting-value"
                            type="text"
                            bind:value={setting.value}
                            on:input={evt => call(setting.id, evt)}
                        />
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</Window>