import events from "./store.js";

export default evt => {
    for(const type in events) {
        events[type].update(currentEvt => currentEvt.filter(evts => evts !== evt));
    }
}