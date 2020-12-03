const EVENTS = {
    ADD_IN_BASKET: Symbol('addInBasket'),
    ADD_INGRIDIENT: Symbol('addIngridient'),
    CHANGE_QUANTITY: Symbol('changeQuantity'),
    RENDER_PRODUCTS_BY_CATEGORY: Symbol('renderProductsByCategory'),
    RENDER_INGRIDIENTS_BY_CATEGORY: Symbol('renderIngridientsByCategory'),
    RESET_DEFAULT_INGRIDIENTS: Symbol('resetDefaultIngridients'),
    SET_DEFAULT_INGRIDIENTS: Symbol('setDefaultIngridients'),
    OPEN_MODAL: Symbol('openModal'),
    UPDATE_BASKET_TOTAL_PRICE: Symbol('updateBasketTotalPrice'),
    UPDATE_MODAL_PRICE: Symbol('updateModalPrice'),
    UPDATE_BASKET_INGRIDIENTS: Symbol('updateBasketIngridients'),
};

export default EVENTS;
