import EVENTS from './constants/EVENTS.js';
import EventEmitter from './EventEmitter.js';

const { ADD_IN_BASKET, CHANGE_QUANTITY, OPEN_MODAL, RESET_DEFAULT_INGRIDIENTS } = EVENTS;

export default class ProductCard {
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.image = props.image;
        this.price = props.price;
        this.description = props.description;
        this.market = props.market;
        this.marketImage = props.marketImage;
        this.category = props.category;
        this.type = props.type;
        this.weight = props.weight;
        this.components = props.components;

        this.quantity = 1;
        this.priceWithIngridients = this.price;
        this.defaultComponents = null;
        this.inBasket = false;
        this.inBasketButton = null;
        this.quantityElem = null;
        this.basketQuantityElem = null;
        this.basketProductWrapper = null;
        this.basketIngridientWrapper = null;

        this.addedIngridients = [];

        this.eventEmitter = new EventEmitter();
    }

    setDefaultComponents() {
        this.defaultComponents = JSON.parse(JSON.stringify(this.components));
    }

    onChangeQuantity(fn) {
        this.eventEmitter.on(CHANGE_QUANTITY, fn);
    }

    offChangeQuantity(fn) {
        this.eventEmitter.off(CHANGE_QUANTITY, fn);
    }

    increaseQuantity() {
        if (this.quantity === 99) return;
        this.quantity += 1;
        this.changeQuantity();
    }

    decreaseQuantity() {
        if (this.quantity === 1) return;
        this.quantity -= 1;
        this.changeQuantity();
    }

    changeQuantity() {
        if (this.inBasket) {
            this.eventEmitter.emit(CHANGE_QUANTITY, this);
            console.log('[EMIT] CHANGE_QUANTITY:', this.eventEmitter.events.get(CHANGE_QUANTITY));
        }
    }

    onAddInBasket(fn) {
        this.eventEmitter.on(ADD_IN_BASKET, fn);
    }

    offAddInBasket(fn) {
        this.eventEmitter.off(ADD_IN_BASKET, fn);
    }

    addInBasket() {
        this.eventEmitter.emit(ADD_IN_BASKET, this);
    }

    onOpenModal(fn) {
        this.eventEmitter.on(OPEN_MODAL, fn);
    }

    offOpenModal(fn) {
        this.eventEmitter.off(OPEN_MODAL, fn);
    }

    openModal() {
        this.eventEmitter.emit(OPEN_MODAL, this);
    }

    addIngridient(ingridient) {
        const addedIngrdient = this.addedIngridients.find(item => item === ingridient);
        if (!addedIngrdient) {
            this.addedIngridients.push(ingridient);
        }
    }

    removeIngridient(ingridient) {
        const index = this.addedIngridients.findIndex(item => item === ingridient);
        this.addedIngridients.splice(index, 1);
    }

    onResetDefault(fn) {
        this.eventEmitter.on(RESET_DEFAULT_INGRIDIENTS, fn, this);
    }

    offResetDefault() {
        this.eventEmitter.off(RESET_DEFAULT_INGRIDIENTS, this);
    }

    resetDefault() {
        this.eventEmitter.emit(RESET_DEFAULT_INGRIDIENTS, this);
    }

    updateQuantity() {
        this.quantityElem.innerHTML = this.quantity;
    }

    changeButton() {
        if (this.inBasket) {
            if (this.type === 'multiple') {
                this.inBasketButton.innerHTML = 'ИЗМЕНИТЬ';
                this.inBasketButton.style.background = '#fa6045';
                this.inBasketButton.style.border = '2px solid #fa6045';
                this.inBasketButton.style.color = 'white';
                return;
            }
            this.inBasketButton.innerHTML = 'В КОРЗИНЕ';
            this.inBasketButton.style.background = '#999999';
            this.inBasketButton.style.border = '2px solid #999999';
            this.inBasketButton.style.color = 'white';
        } else {
            this.inBasketButton.removeAttribute('style');
            this.inBasketButton.innerHTML = 'В КОРЗИНУ';
        }
    }

    render() {
        const market = document.createElement('img');
        market.className = 'product-market';
        market.setAttribute('src', `./js/data${this.marketImage}`);

        const image = document.createElement('img');
        image.className = 'product-image';
        image.setAttribute('src', `./js/data${this.image}`);

        const name = document.createElement('span');
        name.className = 'product-name';
        name.innerHTML = this.name;

        const description = document.createElement('div');
        description.className = 'product-description';
        description.innerHTML = this.description;

        const price = document.createElement('span');
        price.className = 'product-price';
        price.innerHTML = `Цена: ${this.price} руб.`;

        const quantityLabel = document.createElement('span');
        quantityLabel.className = 'product-quantity-label';
        quantityLabel.innerHTML = 'Количество';

        const inBasketButton = document.createElement('button');
        inBasketButton.className = 'in-basket-button';
        inBasketButton.setAttribute('data-product-card-id', this.id);
        inBasketButton.innerHTML = 'В КОРЗИНУ';
        this.inBasketButton = inBasketButton;
        this.changeButton();

        const quantityWrapper = document.createElement('div');
        quantityWrapper.className = 'set-quantity-wrapper';

        const quantity = document.createElement('span');
        quantity.className = 'product-quantity';
        quantity.setAttribute('data-quantity-id', this.id);
        quantity.innerHTML = this.quantity;

        const increaseButton = document.createElement('div');
        increaseButton.className = 'increase-button';
        increaseButton.setAttribute('data-increase-id', this.id);
        increaseButton.innerHTML = '<i class="fas fa-plus-circle"></i>';

        const decreaseButton = document.createElement('div');
        decreaseButton.className = 'decrease-button';
        decreaseButton.setAttribute('data-decrease-id', this.id);
        decreaseButton.innerHTML = '<i class="fas fa-minus-circle"></i>';

        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        const productCardWrapper = document.createElement('div');
        productCardWrapper.className = 'product-card-wrapper';

        increaseButton.addEventListener('click', () => {
            this.increaseQuantity();
            quantity.innerHTML = this.quantity;
        });
        decreaseButton.addEventListener('click', () => {
            this.decreaseQuantity();
            quantity.innerHTML = this.quantity;
        });
        inBasketButton.addEventListener('click', () => {
            if (this.type === 'multiple') {
                this.openModal();
                return;
            }
            if (this.inBasket) return;
            this.addInBasket();
        });

        this.quantityElem = quantity;

        quantityWrapper.append(quantityLabel, decreaseButton, quantity, increaseButton, inBasketButton);
        productCardWrapper.append(market, image, name, description, price, quantityWrapper);
        rightSideWrapper.append(productCardWrapper);
    }
}
