export default class Project {
    constructor(name, captions = [], setting = {}) {
        this.name = name;
        this.captions = captions;
        this.setting = setting;
        
        this.sort();
    }
    static parse(str) {
        const obj = JSON.parse(str);
        return new this(obj.name, obj.caption, obj.video);
    }
    toString() {
        return JSON.stringify({
            name: this.name,
            caption: this.captions,
            setting: this.setting
        });
    }
    sort() {
        this.captions.sort((a, b) => a.startTime.time - b.startTime.time);
    }
    setName(name) {
        this.name = name;
    }
    addCaption(caption) {
        this.captions.push(caption);
    }
    removeCaption(index) {
        this.captions.splice(index, 1);
    }
    findCurrentCaption(currentMs) {
        return this.captions.find(currentCaption => currentCaption.isInTime(currentMs));
    }
}