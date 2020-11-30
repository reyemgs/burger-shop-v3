export default class Modal {
    constructor(props, ingridients, handler) {
        this.navigationItems = props;
        this.ingridients = ingridients;
        this.currentProduct = null;
        this.currentPage = null;

        this.eventHandler = handler;

        this.eventHandler.on('openModal', product => {
            this.open(product);
        });

        this.eventHandler.on('addIngridient', ingridient => {
            this.addIngridient(ingridient);
        });

        this.eventHandler.on('updateModalPrice', () => {
            this.updatePrice();
        });
    }

    open(product) {
        this.currentPage = 1;
        this.currentProduct = product;

        const content = document.querySelector('.modal-content');
        const menuItem = this.getMenuItem(this.currentPage);
        this.activeModal();
        this.activePage(menuItem);

        document.body.style.overflow = 'hidden';
        content.innerHTML = '';

        this.eventHandler.emit('renderIngridientsByCategory', menuItem.category);
        this.activateIngridients(menuItem.category);
        this.createPrice();
    }

    close() {
        this.currentProduct = null;
        this.currentPage = null;

        this.activeModal();

        document.body.removeAttribute('style');
    }

    activeModal() {
        const wrapper = document.querySelector('.modal-wrapper');
        const shadow = document.querySelector('.shadow-modal');
        wrapper.classList.toggle('active');
        shadow.classList.toggle('active');
    }

    nextPage() {
        if (this.isLastPage()) {
            return;
        }

        this.currentPage += 1;
        const content = document.querySelector('.modal-content');
        const menuItem = this.getMenuItem(this.currentPage);

        if (this.isLastPage()) {
            this.onDonePage(content, menuItem);
            return;
        }

        this.activePage(menuItem);
        content.innerHTML = '';

        this.eventHandler.emit('renderIngridientsByCategory', menuItem.category);
        this.activateIngridients(menuItem.category);
    }

    previousPage() {
        if (this.currentPage === 1) return;

        this.currentPage -= 1;

        if (this.currentPage === this.navigationItems.length - 1) {
            this.createPrice();
        }

        const content = document.querySelector('.modal-content');
        const menuItem = this.getMenuItem(this.currentPage);

        this.activePage(menuItem);
        content.innerHTML = '';

        this.eventHandler.emit('renderIngridientsByCategory', menuItem.category);
        this.activateIngridients(menuItem.category);
    }

    onDonePage(content, menuItem) {
        content.innerHTML = '';
        this.renderDonePage();
        this.activePage(menuItem);
    }

    isLastPage() {
        return this.currentPage === this.navigationItems.length;
    }

    activePage(menuItem) {
        const items = document.querySelectorAll('.modal-menu-item');

        for (const item of items) {
            item.classList.remove('active');
            if (item.getAttribute('data-category') === menuItem.category) {
                const title = document.querySelector('.modal-title');
                item.classList.add('active');
                title.innerHTML = menuItem.title;
            }
        }
    }

    createPrice() {
        const footer = document.querySelector('.modal-footer');
        footer.innerHTML = '';

        const price = document.createElement('span');
        price.className = 'modal-price';
        price.innerHTML = `Цена: ${this.currentProduct.priceWithIngridients}`;

        footer.append(price);
    }

    updatePrice() {
        const price = document.querySelector('.modal-price');
        price.innerHTML = `Цена: ${this.currentProduct.priceWithIngridients}`;
    }

    updateTotalPrice() {
        const totalPrice = document.querySelector('.modal-total-price');
        totalPrice.innerHTML = `Итого: ${
            this.currentProduct.priceWithIngridients * this.currentProduct.quantity
        }`;
    }

    calculatePrice() {
        const ingridients = this.currentProduct.addedIngridients;
        this.currentProduct.priceWithIngridients = this.currentProduct.price;

        for (const ingridient of ingridients) {
            this.currentProduct.priceWithIngridients += ingridient.price;
        }
    }

    getMenuItem(id) {
        return this.navigationItems.find(item => item.id === id);
    }

    addIngridient(ingridient) {
        if (ingridient.type === 'single') {
            this.addSingle(ingridient);
        } else {
            this.addMultiple(ingridient);
        }
    }

    addSingle(ingridient) {
        const { components } = this.currentProduct;
        const product = this.currentProduct;
        const addedIngridient = product.addedIngridients.find(item => item.key === ingridient.key);

        if (addedIngridient) return;

        this.deactivateIngridients(ingridient.category);
        components[ingridient.category] = ingridient.key;
        product.addIngridient(ingridient);
        this.calculatePrice();
        ingridient.addActiveClass();
        this.eventHandler.emit('updateIngridients');
    }

    addMultiple(ingridient) {
        const { components } = this.currentProduct;
        const product = this.currentProduct;
        const addedIngridient = components[ingridient.category].find(item => item === ingridient.key);

        if (!addedIngridient) {
            if (this.isSauces(ingridient)) return;

            components[ingridient.category].push(ingridient.key);
            product.addIngridient(ingridient);
            this.calculatePrice();
            ingridient.addActiveClass();
            this.eventHandler.emit('updateIngridients');
            return;
        }

        this.removeIngridient(ingridient);
        product.removeIngridient(ingridient);
        this.calculatePrice();
        ingridient.removeActiveClass();
        this.eventHandler.emit('updateIngridients');
    }

    removeIngridient(ingridient) {
        const { components } = this.currentProduct;
        const index = components[ingridient.category].findIndex(item => item === ingridient.key);
        components[ingridient.category].splice(index, 1);
    }

    isSauces(ingridient) {
        return (
            ingridient.category === 'sauces' &&
            this.currentProduct.components[ingridient.category].length === 3
        );
    }

    getIngridientsName(components, category) {
        const names = [];
        components.map(item => names.push(this.ingridients[category][item].name));

        if (names.length === 0) {
            return 'Нет';
        }

        return names.join(', ');
    }

    activateIngridients(category) {
        if (this.currentProduct.addedIngridients.length === 0) return;
        const filtered = this.currentProduct.addedIngridients.filter(item => item.category === category);
        if (filtered.length === 0) return;
        filtered.map(item => item.addActiveClass());
    }

    deactivateIngridients(category) {
        const filtered = this.currentProduct.addedIngridients.filter(item => item.category === category);
        filtered.forEach(item => {
            this.currentProduct.removeIngridient(item);
            item.removeActiveClass();
        });
    }

    increaseQuantity() {
        if (this.currentProduct.quantity === 99) return;
        this.currentProduct.quantity += 1;
        this.currentProduct.updateQuantity();
        this.eventHandler.emit('changeQuantity');
    }

    decreaseQuantity() {
        if (this.currentProduct.quantity === 1) return;
        this.currentProduct.quantity -= 1;
        this.currentProduct.updateQuantity();
        this.eventHandler.emit('changeQuantity');
    }

    addInBasket() {
        if (this.currentProduct.inBasket) return;
        this.eventHandler.emit('addInBasket', this.currentProduct);
    }

    changeButton() {
        const inBasketButton = document.querySelector('.modal-in-basket');
        if (this.currentProduct.inBasket) {
            inBasketButton.innerHTML = 'В КОРЗИНЕ';
            inBasketButton.style.background = '#999999';
            inBasketButton.style.border = '2px solid #999999';
            inBasketButton.style.color = 'white';
        } else {
            inBasketButton.removeAttribute('style');
            inBasketButton.innerHTML = 'В КОРЗИНУ';
        }
    }

    renderDonePage() {
        const product = this.currentProduct;

        let {
            vegetables: productVegetables,
            sauces: productSauces,
            fillings: productFillings,
        } = product.components;
        const { sizes: productSizes, breads: productBreads } = product.components;

        productVegetables = this.getIngridientsName(productVegetables, 'vegetables');
        productSauces = this.getIngridientsName(productSauces, 'sauces');
        productFillings = this.getIngridientsName(productFillings, 'fillings');

        const { sizes, breads } = this.ingridients;

        const wrapper = document.createElement('div');
        wrapper.className = 'done-wrapper';

        const header = document.createElement('span');
        header.className = 'done-header';
        header.innerHTML = 'Ваш сендвич готов!';

        const info = document.createElement('div');
        info.className = 'done-info';

        const sizeElem = document.createElement('span');
        sizeElem.className = 'done-size';
        sizeElem.innerHTML = `Размер: ${sizes[productSizes].name} `;

        const breadElem = document.createElement('span');
        breadElem.className = 'done-bread';
        breadElem.innerHTML = `Хлеб: ${breads[productBreads].name}`;

        const vegetablesElem = document.createElement('span');
        vegetablesElem.className = 'done-vegetables';
        vegetablesElem.innerHTML = `Овощи: ${productVegetables}`;

        const saucesElem = document.createElement('span');
        saucesElem.className = 'done-sauces';
        saucesElem.innerHTML = `Соусы: ${productSauces}`;

        const fillingsElem = document.createElement('span');
        fillingsElem.className = 'done-fillings';
        fillingsElem.innerHTML = `Начинка: ${productFillings}`;

        const name = document.createElement('span');
        name.className = 'done-name';
        name.innerHTML = `${product.name}`;

        const image = document.createElement('img');
        image.className = 'product-image';
        image.setAttribute('src', `./js/data${product.image}`);

        const footer = document.querySelector('.modal-footer');
        footer.innerHTML = '';

        const totalPrice = document.createElement('span');
        totalPrice.className = 'modal-total-price';
        totalPrice.innerHTML = `Итого: ${product.priceWithIngridients * product.quantity}`;

        const quantity = document.createElement('span');
        quantity.className = 'modal-product-quantity';
        quantity.innerHTML = product.quantity;

        const increaseButton = document.createElement('div');
        increaseButton.className = 'modal-increase-button';
        increaseButton.innerHTML = '<i class="fas fa-plus-circle"></i>';

        const decreaseButton = document.createElement('div');
        decreaseButton.className = 'modal-decrease-button';
        decreaseButton.innerHTML = '<i class="fas fa-minus-circle"></i>';

        const inBasketButton = document.createElement('button');
        inBasketButton.className = 'modal-in-basket';
        inBasketButton.innerHTML = 'В КОРЗИНУ';

        increaseButton.addEventListener('click', () => {
            this.increaseQuantity();
            this.updateTotalPrice();
            quantity.innerHTML = product.quantity;
        });

        decreaseButton.addEventListener('click', () => {
            this.decreaseQuantity();
            this.updateTotalPrice();
            quantity.innerHTML = product.quantity;
        });

        inBasketButton.addEventListener('click', () => {
            if (this.currentProduct.inBasket) return;
            this.addInBasket();
            this.close();
        });

        const content = document.querySelector('.modal-content');
        footer.append(decreaseButton, quantity, increaseButton, totalPrice, inBasketButton);
        info.append(sizeElem, breadElem, vegetablesElem, saucesElem, fillingsElem);
        wrapper.append(header, info, name);
        content.append(image, wrapper);
        this.changeButton();
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('modal-wrapper');

        const content = document.createElement('div');
        content.className = 'modal-content';

        const closeButton = document.createElement('div');
        closeButton.className = 'close-modal';
        closeButton.innerHTML = '<i class="fas fa-times fa-2x"></i>';

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'modal-button-wrapper';

        const nextButton = document.createElement('button');
        nextButton.className = 'next-button';
        nextButton.innerHTML = 'ВПЕРЕД';

        const previousButton = document.createElement('button');
        previousButton.className = 'previous-button';
        previousButton.innerHTML = 'НАЗАД';

        buttonWrapper.append(previousButton, nextButton);

        const inBasketButton = document.createElement('button');
        inBasketButton.className = 'modal-in-basket';
        inBasketButton.innerHTML = 'В КОРЗИНУ';

        const title = document.createElement('span');
        title.className = 'modal-title';

        const header = document.createElement('div');
        header.className = 'modal-header';
        header.append(title, closeButton);

        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        const price = document.createElement('span');
        price.className = 'modal-price';
        price.innerHTML = `Цена: `;

        const ul = document.createElement('ul');
        ul.className = 'items-list';

        for (const item of this.navigationItems) {
            const li = document.createElement('li');

            li.setAttribute('data-category', item.category);
            li.className = 'modal-menu-item';
            li.innerHTML = item.name;

            ul.append(li);
        }

        nextButton.addEventListener('click', () => this.nextPage());
        previousButton.addEventListener('click', () => this.previousPage());
        closeButton.addEventListener('click', () => this.close());

        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'items-wrapper';
        itemWrapper.append(ul);

        const shadow = document.createElement('div');
        shadow.classList.add('shadow-modal');

        wrapper.append(header, buttonWrapper, itemWrapper, content, footer);
        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        rightSideWrapper.after(wrapper, shadow);
    }
}
