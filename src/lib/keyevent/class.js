import addEvent from "./addEvent.js";

export default class KeyEvent {
    constructor(key, callback, type, fnKeys = []) {
        this.key = key;
        this.type = type;
        this.callback = callback;
        this.fnKeys = this._fnArrToObj(fnKeys);
    }
    static makeEvent(key, callback, type, fnKeys = []) {
        const event = new this(key, callback, type, fnKeys);
        addEvent(event, type)
        return event;
    }
    _fnArrToObj(fnKeys) {
        const keys = {
            ctrl: false,
            alt: false,
            shift: false
        }
        fnKeys.every(key => {
            keys[key] = true;
        });
        return keys;
    }
    isPressed(evt) {
        return (
            this.key === evt.key &&
            Object.entries(this.fnKeys).every(([ keyName, value ]) => {
                return evt[`${keyName}Key`] == value
            })
        );
    }
    changeKey(key, fnKeys = []) {
        this.key = key;
        this.fnKeys = this._fnArrToObj(fnKeys);
    }
}