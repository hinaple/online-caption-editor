export default file => new Promise(res => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = evt => {
        res(evt.target.result);
    }
});