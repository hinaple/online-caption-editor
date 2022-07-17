export default class Project {
    constructor(name, captions = [], video = null) {
        this.name = name;
        this.captions = captions;
        this.video = video;
        
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
            video: this.video
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