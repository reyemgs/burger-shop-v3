const EVENTS = {
    ADD_IN_BASKET: Symbol('addInBasket'),
    CHANGE_QUANTITY: Symbol('changeQuantity'),
    RENDER_PRODUCTS_BY_CATEGORY: Symbol('renderProductsByCategory'),
    RENDER_INGRIDIENTS_BY_CATEGORY: Symbol('renderIngridientsByCategory'),
    OPEN_MODAL: Symbol('openModal'),

    UPDATE_BASKET_TOTAL_PRICE: Symbol('updateBasketTotalPrice'),
    UPDATE_BASKET_INGRIDIENTS: Symbol('updateIngridients'),
    SET_DEFAULT_INGRIDIENTS: Symbol('setDefaultIngridients'),
    UPDATE_MODAL_PRICE: Symbol('updateModalPrice'),
    ADD_INGRIDIENT: Symbol('addIngridient'),
};

export default EVENTS;
