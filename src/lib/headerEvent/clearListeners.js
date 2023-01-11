import obj from "./_object.js";

export default key => {
    if(obj[key]) obj[key] = [];
}