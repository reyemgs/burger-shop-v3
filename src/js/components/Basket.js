export default class Basket {
    constructor() {
        this.basketWrapper = document.querySelector('.basket');
        this.addedProducts = [];
        this.totalPrice = 0;

        this.productWrapper = null;
        this.quantityElem = null;
    }

    changeQuantityEvent(product) {
        this.updateQuantity(product);
        this.updateTotalPrice();
    }

    addProductEvent(product) {
        this.addProduct(product);
        this.updateTotalPrice();
    }

    updateQuantity(product) {
        product.basketQuantityElem.innerHTML = product.quantity;
    }

    addProduct(product) {
        const currentProduct = product;

        currentProduct.onChangeQuantity(productCard => this.changeQuantityEvent(productCard));

        const addedProduct = this.addedProducts.find(item => item === product);
        if (!addedProduct) {
            this.addedProducts.push(product);
            currentProduct.inBasket = true;
            currentProduct.changeButton();
        }
        this.renderProduct(product);
    }

    removeProduct(product) {
        const index = this.addedProducts.findIndex(item => item === product);
        const currentProduct = this.addedProducts[index];

        currentProduct.quantity = 1;
        currentProduct.priceWithIngridients = currentProduct.price;
        currentProduct.inBasket = false;
        currentProduct.changeButton();
        currentProduct.updateQuantity();

        currentProduct.offChangeQuantity();

        if (currentProduct.type === 'multiple') {
            currentProduct.resetDefault();
        }

        this.addedProducts.splice(index, 1);
        currentProduct.basketProductWrapper.remove();
    }

    updateTotalPrice() {
        const totalPriceLabel = document.querySelector('.basket-total-price');
        this.totalPrice = 0;
        for (const item of this.addedProducts) {
            if (item.type === 'multiple') {
                this.totalPrice += item.priceWithIngridients * item.quantity;
            } else {
                this.totalPrice += item.price * item.quantity;
            }
        }
        totalPriceLabel.innerHTML = `Итого: ${this.totalPrice} руб.`;
    }

    renderProduct(product) {
        const contentWrapper = document.querySelector('.basket-content-wrapper');
        const addedProduct = product;

        const productWrapper = document.createElement('div');
        productWrapper.classList.add('basket-product');
        addedProduct.basketProductWrapper = productWrapper;

        const productName = document.createElement('span');
        productName.className = 'basket-product-name';
        productName.innerHTML = addedProduct.name;

        const productQuantity = document.createElement('span');
        productQuantity.className = 'basket-product-quantity';
        productQuantity.innerHTML = addedProduct.quantity;
        addedProduct.basketQuantityElem = productQuantity;

        const removeButton = document.createElement('div');
        removeButton.className = 'remove-button';
        removeButton.innerHTML = '<i class="fas fa-trash-alt fa-lg"></i>';
        removeButton.addEventListener('click', () => {
            this.removeProduct(product);
            this.updateTotalPrice();
        });

        if (addedProduct.type === 'multiple') {
            productWrapper.append(
                productName,
                productQuantity,
                removeButton,
                this.renderIngridients(addedProduct)
            );
        } else {
            productWrapper.append(productName, productQuantity, removeButton);
        }
        contentWrapper.append(productWrapper);
    }

    renderIngridients(product) {
        const ingridientWrapper = document.createElement('ul');
        ingridientWrapper.className = 'basket-ingridient-wrapper';

        for (const ingridient of product.addedIngridients) {
            const li = document.createElement('li');
            li.className = 'basket-ingridient';
            li.textContent += ingridient.name;
            if (ingridient.type === 'single') {
                ingridientWrapper.prepend(li);
            } else {
                ingridientWrapper.append(li);
            }
        }
        return ingridientWrapper;
    }

    updateIngridients(product) {
        const ingridientWrapper = document.querySelector('.basket-ingridient-wrapper');
        const productWrapper = product.basketProductWrapper;
        ingridientWrapper.innerHTML = '';

        for (const ingridient of product.addedIngridients) {
            const li = document.createElement('li');
            li.className = 'basket-ingridient';
            li.textContent += ingridient.name;
            if (ingridient.type === 'single') {
                ingridientWrapper.prepend(li);
            } else {
                ingridientWrapper.append(li);
            }
        }
        productWrapper.append(ingridientWrapper);
    }

    render() {
        const header = document.createElement('span');
        header.className = 'basket-header';
        header.innerHTML = '<i class="fas fa-shopping-basket"></i> Корзина';

        const body = document.createElement('div');
        body.className = 'basket-body';

        const labelWrapper = document.createElement('div');
        labelWrapper.className = 'basket-label-wrapper';

        const nameLabel = document.createElement('span');
        nameLabel.className = 'basket-name-label';
        nameLabel.innerHTML = 'Название';

        const quantityLabel = document.createElement('span');
        quantityLabel.className = 'basket-quantity-label';
        quantityLabel.innerHTML = 'Количество';

        const productsWrapper = document.createElement('div');
        productsWrapper.className = 'basket-content-wrapper';

        const totalPriceLabel = document.createElement('span');
        totalPriceLabel.className = 'basket-total-price';
        totalPriceLabel.innerHTML = `Итого: ${this.totalPrice} руб.`;

        const orderButton = document.createElement('button');
        orderButton.className = 'order-button';
        orderButton.innerHTML = 'ОФОРМИТЬ ЗАКАЗ';

        labelWrapper.append(nameLabel, quantityLabel);
        body.append(labelWrapper, productsWrapper, totalPriceLabel, orderButton);
        this.basketWrapper.append(header, body);
    }
}
