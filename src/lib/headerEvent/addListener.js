import obj from "./_object.js";

export default (key, cb) => {
    if(!obj[key]) obj[key] = [];
    const symbol = Symbol()
    obj[key].push({ callback: cb, symbol });
    return symbol;
}