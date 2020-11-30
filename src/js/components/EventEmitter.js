export default class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(eventName, fn) {
        if (this.events.has(eventName)) return;
        this.events.set(eventName, fn);
    }

    off(eventName) {
        if (this.events.has(eventName)) {
            this.events.delete(eventName);
        }
    }

    emit(eventName, data) {
        if (this.events.has(eventName)) {
            this.events.get(eventName)(data);
        }
    }
}
