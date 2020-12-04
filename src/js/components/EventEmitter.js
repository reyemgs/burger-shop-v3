export default class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(eventName, fn) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        const listeners = this.events.get(eventName);
        listeners.push(fn);
    }

    off(eventName, fn) {
        if (!this.events.has(eventName)) return;
        const listeners = this.events.get(eventName);
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i] === fn) {
                listeners.splice(i, 1);
                // if (listeners.length === 0) {
                //     this.events.delete(eventName);
                // }
                // break;
            }
        }
    }

    emit(eventName, data) {
        if (this.events.has(eventName)) {
            this.events.get(eventName).forEach(fn => fn(data));
        }
    }
}
