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
        height: 43px;
        border-bottom: solid 2px #141124;
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 15px 0 15px;
        font-weight: 900;
        box-sizing: border-box;
        user-select: none;
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
            Empty Here...
        </div>
    </slot>
</div>