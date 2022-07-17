export default evt => {
    const fnKeys = [];
    if(evt.ctrlKey) fnKeys.push("ctrl");
    if(evt.altKey) fnKeys.push("alt");
    if(evt.shiftKey) fnKeys.push("shift");
    return {
        key: evt.key,
        fnKeys
    }
}