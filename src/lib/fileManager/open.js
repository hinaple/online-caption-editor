export default (multiple = false, accept = []) => new Promise((res, rej) => {
    const Input = document.createElement("input");
    Input.className = "disable";
    Input.type = "file";
    Input.accept = accept.join(',');
    if(multiple) Input.multiple = multiple;
    Input.addEventListener("change", () => {
        if(multiple) res(Input.files);
        else res(Input.files[0]);
    });
    
    //document.body.append(Input);
    Input.click();
});