function degitNum(number, deg) {
    return (new Array(deg).join('0') + number).slice(-deg);
}

export default class Time {
    constructor(ms) {
        this.time = ms;
        this.ms = 0;
        this.second = 0;
        this.minute = 0;
        this.hour = 0;
        this._update();
    }
    static parse(str) {
        let splitted = str.split(':');
        let hour = Number(splitted[0]);
        let minute = Number(splitted[1]);
        let secs = splitted[2].split(',');
        let second = Number(secs[0]);
        let ms = Number(secs[1]);
        return (
            ms +
            second * 1000 +
            minute * (1000 * 60) +
            hour * (1000 * 60 * 60)
        );
    }
    
    _update() {
        if(this.time === undefined) return;
        this.ms = this.time % 1000;
        this.second = Math.floor(this.time / 1000) % 60;
        this.minute = Math.floor(this.time / (1000 * 60)) % 60;
        this.hour = Math.floor(this.time / (1000 * 60 * 60)) % 60;
    }
    set(time) {
        this.time = time;
        this._update();
    }
    add(time) {
        let resultTime = this.time + time;
        if(resultTime < 0) resultTime = 0;
        this.set(resultTime);
    }
    toString(removeUnusedUnit = true) {
        if(typeof this.time !== 'number') return '?';
        return (
            ((!removeUnusedUnit && this.hour)? `${degitNum(this.hour, 2)}:`: '') +
            `${degitNum(this.minute, 2)}:` +
            `${degitNum(this.second, 2)}` +
            `,${degitNum(this.ms, 3)}`
        );
    }
}