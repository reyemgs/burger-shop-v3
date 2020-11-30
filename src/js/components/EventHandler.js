// export default class EventHandler {
//     constructor() {
//         this.events = {};
//     }

//     on(eventName, fn) {
//         this.events[eventName] = this.events[eventName] || [];
//         this.events[eventName].push(fn);
//     }

//     off(eventName, fn) {
//         if (this.events[eventName]) {
//             for (let i = 0; i < this.events[eventName].length; i++) {
//                 if (this.events[eventName][i] === fn) {
//                     this.events[eventName].splice(i, 1);
//                     break;
//                 }
//             }
//         }
//     }

//     emit(eventName, data) {
//         if (this.events[eventName]) {
//             this.events[eventName].forEach(fn => {
//                 fn(data);
//             });
//         }
//     }
// }

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
