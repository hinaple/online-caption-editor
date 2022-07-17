<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #dbd8e7;
        border-radius: 5px;
        box-sizing: border-box;
    }
    .title {
        width: 100%;
        height: 40px;
        border-bottom: solid 2px #141124;
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 15px;
        font-weight: 900;
    }
    .no-content {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }
</style>

<div class="container">
    <div class="title">
        <slot name="title"/>
    </div>
    <slot>
        <div class="no-content">
            No Captions
        </div>
    </slot>
</div>