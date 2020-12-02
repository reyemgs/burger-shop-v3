import Fetch from './api/Fetch.js';
import ProductCard from './components/ProductCard.js';
import MenuList from './components/MenuList.js';
import Basket from './components/Basket.js';
import EventEmitter from './components/EventEmitter.js';
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

        this.globalEventEmitter = new EventEmitter();
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
    }

    initSideBar() {
        this.menuList = new MenuList(this.response.categories);
        this.menuList.render();
        this.menuList.onRenderProducts(category => {
            this.renderProductsByCategory(category);
        });
        this.menuList.onPage('pizza');

        this.basket = new Basket(this.globalEventEmitter);
        this.basket.render();
    }

    initModal() {
        this.modal = new Modal(this.response.modal, this.ingridients, this.globalEventEmitter);
        this.modal.render();
        this.modal.onRenderIngridients(category => {
            this.renderIngridientsByCategory(category);
        });
    }

    initProductEvents() {
        for (const productCard of this.productCards) {
            productCard.onAddInBasket(product => this.basket.addProductEvent(product));
            if (productCard.type === 'multiple') {
                productCard.onResetDefault(product => this.resetIngridients(product));
                productCard.onOpenModal(product => this.modal.open(product));
            }
        }
    }

    initProductCards() {
        let id = 1;
        for (const product of this.response.menu) {
            product.id = id++;
            product.marketImage = this.response.markets[product.market].image;
            const productCard = new ProductCard(product, this.globalEventEmitter);
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

                const ingridientCard = new IngridientCard(ingridient, this.globalEventEmitter);
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
        const defaultComponents = {
            sizes: '1x',
            breads: 'white-italian',
            vegetables: [],
            sauces: [],
            fillings: [],
        };
        resetedProduct.components = defaultComponents;
        resetedProduct.addedIngridients = [];
        for (const ingridient of this.ingridientCards) {
            if (
                resetedProduct.type === 'multiple' &&
                resetedProduct.components[ingridient.category] === ingridient.key
            ) {
                resetedProduct.addedIngridients.push(ingridient);
            }
        }
    }
}

const app = new App();
app.init();
