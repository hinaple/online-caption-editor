const events = {};

export const addEvent = (key, cb) => {
    if(!events[key]) events[key] = [];
    const data = {
        cb, symbol: Symbol()
    }
    events[key].push(data);
    return data;
}

export const removeEvent = (key, sym) => {
    if(!events[key]) return null;
    const index = events[key].findIndex(evt => evt.symbol === sym);
    return events[key].splice(index, 1);
}

export const call = (key, data = null) => {
    if(!events[key]) return;
    events[key].forEach(evt => { evt.cb(data); });
}