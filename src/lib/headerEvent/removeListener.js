import obj from "./_object.js";

export default (key, symbol) => {
    const result = obj[key].findIndex(evt => evt.symbol === symbol);
    if(result < 0) return false;
    return obj[key].splice(result, 1);
}