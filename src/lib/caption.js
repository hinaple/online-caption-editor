import Time from "./time";

export default class Caption {
    constructor(content = '', startTime = 0, endTime = 0) {
        this.content = content;
        if(typeof startTime === "string") startTime = Time.parse(startTime);
        if(typeof endTime === "string") endTime = Time.parse(endTime);
        this.startTime = new Time(startTime);
        this.endTime = new Time(endTime);
        this.key = Symbol();
        this.old = false;
        this.deleted = false;
        this.el = null;
    }
    static parse(str) {
        let splitted = str.split('\n');
        //let index = Number(splitted[0]);
        let times = splitted[1].split(/\s*-*>\s*/);
        let startTime = times[0];
        let endTime = times[1];
        let content = splitted.filter((value, index) => index >= 2).join('\n');
        return new this(content, startTime, endTime);
    }
    setContent(cont) {
        this.content = cont;
    }
    addContent(cont) {
        this.content += cont;
    }
    setStart(time) {
        this.startTime.set(time);
    }
    setEnd(time) {
        this.endTime.set(time);
    }
    addStart(ms) {
        this.startTime.add(ms);
    }
    addEnd(ms) {
        this.endTime.add(ms);
    }
    getOld() {
        this.old = true;
    }
    setDeleted() {
        this.deleted = true;
    }
    shift(ms) {
        this.addEnd(ms);
        this.addStart(ms);
    }
    isInTime(current) {
        return this.startTime.time <= current && this.endTime.time > current;
    }
    toString(index) {
        return (
`${index}
${+this.startTime} --> ${+this.endTime}
${this.content}`
        )
    }
}