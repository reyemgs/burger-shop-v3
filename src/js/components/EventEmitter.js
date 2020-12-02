export default class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(eventName, fn, object) {
        if (this.events.has(eventName)) {
            const listeners = this.events.get(eventName);
            listeners.push({ object: object, fn: fn });
        } else {
            this.events.set(eventName, []);
            const listeners = this.events.get(eventName);
            listeners.push({ object: object, fn: fn });
        }
        console.log(this.events.get(eventName));
    }

    off(eventName, object) {
        if (this.events.has(eventName)) {
            const listeners = this.events.get(eventName);
            for (let i = 0; i < listeners.length; i++) {
                if (listeners[i].object === object) {
                    listeners.splice(i, 1);
                    console.log(this.events.get(eventName));
                    break;
                }
            }
        }
    }

    emit(eventName, data) {
        if (this.events.has(eventName)) {
            this.events.get(eventName).forEach(instanse => instanse.fn(data));
        }
    }
}
