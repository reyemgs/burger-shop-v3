import EVENTS from './constants/EVENTS.js';
import EventEmitter from './EventEmitter.js';

const { RENDER_PRODUCTS_BY_CATEGORY } = EVENTS;

export default class MenuList {
    constructor(props) {
        this.items = props;
        this.eventEmitter = new EventEmitter();
    }

    active(category) {
        const categories = document.querySelectorAll('.menu-item');
        for (const li of categories) {
            li.classList.remove('active');
            if (li.getAttribute('id') === category) {
                li.classList.add('active');
            }
        }
    }

    onRenderProducts(fn) {
        this.eventEmitter.on(RENDER_PRODUCTS_BY_CATEGORY, fn);
    }

    offRenderProducts(fn) {
        this.eventEmitter.off(RENDER_PRODUCTS_BY_CATEGORY, fn);
    }

    onPage(category) {
        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        rightSideWrapper.innerHTML = '';
        this.eventEmitter.emit(RENDER_PRODUCTS_BY_CATEGORY, category);
        this.active(category);
    }

    render() {
        const ul = document.querySelector('.menu-list');
        for (const item of this.items) {
            const li = document.createElement('li');
            li.setAttribute('id', item.category);
            li.className = 'menu-item';
            li.innerHTML = item.name;

            li.addEventListener('click', () => this.onPage(item.category));

            ul.append(li);
        }
    }
}
