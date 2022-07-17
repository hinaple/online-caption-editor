import events from "./store.js";

export default (evt, type) => {
    events[type].update(evts => { evts.push(evt); return evts; });
}