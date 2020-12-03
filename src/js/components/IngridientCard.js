import EVENTS from './constants/EVENTS.js';
import EventEmitter from './EventEmitter.js';

const {
    ADD_INGRIDIENT,
    SET_DEFAULT_INGRIDIENTS,
    UPDATE_BASKET_TOTAL_PRICE,
    UPDATE_MODAL_PRICE,
} = EVENTS;

export default class IngridientCard {
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.price = props.price;
        this.image = props.image;
        this.description = props.description;
        this.category = props.category;
        this.key = props.key;
        this.type = props.type;
        this.currentWrapper = null;

        this.eventEmitter = new EventEmitter();
    }

    onSetDefaultIngridients(fn) {
        this.eventEmitter.on(SET_DEFAULT_INGRIDIENTS, fn, this);
    }

    offSetDefaultIngridients() {
        this.eventEmitter.off(SET_DEFAULT_INGRIDIENTS, this);
    }

    setDefaultIngridients() {
        this.eventEmitter.emit(SET_DEFAULT_INGRIDIENTS, this);
    }

    onAddIngridient(fn) {
        this.eventEmitter.on(ADD_INGRIDIENT, fn, this);
    }

    offAddIngridient() {
        this.eventEmitter.off(ADD_INGRIDIENT, this);
    }

    addIngridient() {
        this.eventEmitter.emit(ADD_INGRIDIENT, this);
    }

    onUpdateBasketTotalPrice(fn) {
        this.eventEmitter.on(UPDATE_BASKET_TOTAL_PRICE, fn, this);
    }

    offUpdateBasketTotalPrice() {
        this.eventEmitter.off(UPDATE_BASKET_TOTAL_PRICE, this);
    }

    updateBasketTotalPrice() {
        this.eventEmitter.emit(UPDATE_BASKET_TOTAL_PRICE);
    }

    onUpdateModalPrice(fn) {
        this.eventEmitter.on(UPDATE_MODAL_PRICE, fn, this);
    }

    offUpdateModalPrice() {
        this.eventEmitter.off(UPDATE_MODAL_PRICE, this);
    }

    updateModalPrice() {
        this.eventEmitter.emit(UPDATE_MODAL_PRICE);
    }

    addActiveClass() {
        this.currentWrapper.classList.add('active');
    }

    removeActiveClass() {
        this.currentWrapper.classList.remove('active');
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'ingridient-wrapper';
        wrapper.setAttribute('data-ingridient-id', this.id);
        wrapper.addEventListener('click', () => {
            this.addIngridient();
            this.updateModalPrice();
            this.updateBasketTotalPrice();
        });
        this.currentWrapper = wrapper;

        const image = document.createElement('img');
        image.className = 'ingridient-image';
        image.setAttribute('src', `./js/data${this.image}`);

        const name = document.createElement('span');
        name.className = 'ingridient-name';
        name.innerHTML = this.name;

        const price = document.createElement('span');
        price.className = 'ingridient-price';
        price.innerHTML = `Цена: ${this.price} руб.`;

        const content = document.querySelector('.modal-content');
        wrapper.append(image, name, price);
        content.append(wrapper);
    }
}
