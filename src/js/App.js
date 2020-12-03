import Fetch from './api/Fetch.js';
import ProductCard from './components/ProductCard.js';
import MenuList from './components/MenuList.js';
import Basket from './components/Basket.js';
import Modal from './components/Modal.js';
import IngridientCard from './components/IngridientCard.js';

class App {
    constructor() {
        this.response = null;
        this.url = './js/data/data.json';

        this.productCards = [];
        this.ingridientCards = [];
        this.ingridients = {};

        this.menuList = null;
        this.basket = null;
        this.modal = null;
    }

    async request(url) {
        const fetchApi = new Fetch();
        const data = await fetchApi.loadJSON(url);
        this.response = data;
    }

    init() {
        this.request(this.url).then(() => this.initComponents());
    }

    initComponents() {
        this.initProductCards();
        this.initIngridientCards();
        this.initSideBar();
        this.initModal();
        this.initProductEvents();
        this.initIngridientEvents();
    }

    initSideBar() {
        this.menuList = new MenuList(this.response.categories);
        this.menuList.render();
        this.menuList.onRenderProducts(category => {
            this.renderProductsByCategory(category);
        });
        this.menuList.onPage('pizza');

        this.basket = new Basket();
        this.basket.render();
    }

    initModal() {
        this.modal = new Modal(this.response.modal, this.ingridients);
        this.modal.render();
        this.modal.onRenderIngridients(category => {
            this.renderIngridientsByCategory(category);
        });
        this.modal.onUpdateIngridients(product => this.basket.updateIngridients(product));
    }

    initProductEvents() {
        for (const productCard of this.productCards) {
            productCard.onAddInBasket(product => this.basket.addProductEvent(product));
            if (productCard.type === 'multiple') {
                productCard.onResetDefault(product => this.resetIngridients(product));
                productCard.onOpenModal(product => this.modal.open(product));
                productCard.setDefaultComponents();
                productCard.resetDefault();
            }
        }
    }

    initIngridientEvents() {
        for (const ingridientCard of this.ingridientCards) {
            ingridientCard.onAddIngridient(ingridient => this.modal.addIngridient(ingridient));
            ingridientCard.onUpdateModalPrice(() => this.modal.updatePrice());
            ingridientCard.onUpdateBasketTotalPrice(() => this.basket.updateTotalPrice());
        }
    }

    initProductCards() {
        let id = 1;
        for (const product of this.response.menu) {
            product.id = id++;
            product.marketImage = this.response.markets[product.market].image;
            const productCard = new ProductCard(product);
            this.productCards.push(productCard);
        }
    }

    initIngridientCards() {
        let id = 1;
        this.ingridients = this.response.ingridients;
        for (const category in this.ingridients) {
            for (const key in this.ingridients[category]) {
                const ingridient = this.ingridients[category][key];
                ingridient.id = id++;
                ingridient.category = category;
                ingridient.key = key;

                const ingridientCard = new IngridientCard(ingridient);
                this.ingridientCards.push(ingridientCard);
            }
        }
    }

    renderProductsByCategory(category) {
        const filtered = this.productCards.filter(item => item.category === category);
        for (const product of filtered) {
            product.render();
        }
    }

    renderIngridientsByCategory(category) {
        const filtered = this.ingridientCards.filter(item => item.category === category);
        for (const ingridient of filtered) {
            ingridient.render();
        }
    }

    resetIngridients(product) {
        const resetedProduct = product;

        resetedProduct.components = JSON.parse(JSON.stringify(resetedProduct.defaultComponents));
        resetedProduct.addedIngridients = [];

        for (const ingridient of this.ingridientCards) {
            const addedComponents = resetedProduct.components[ingridient.category];

            if (Array.isArray(addedComponents)) {
                for (const multipleIngridient of addedComponents) {
                    if (multipleIngridient === ingridient.key) {
                        resetedProduct.addedIngridients.push(ingridient);
                    }
                }
            } else if (resetedProduct.components[ingridient.category] === ingridient.key) {
                resetedProduct.addedIngridients.push(ingridient);
            }
        }
    }
}

const app = new App();
app.init();
