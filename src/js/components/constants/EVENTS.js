const EVENTS = {
    ADD_IN_BASKET: Symbol('addInBasket'),
    CHANGE_QUANTITY: Symbol('changeQuantity'),
    UPDATE_BASKET_TOTAL_PRICE: Symbol('updateBasketTotalPrice'),
    UPDATE_BASKET_INGRIDIENTS: Symbol('updateIngridients'),
    SET_DEFAULT_INGRIDIENTS: Symbol('setDefaultIngridients'),
    OPEN_MODAL: Symbol('openModal'),
    UPDATE_MODAL_PRICE: Symbol('updateModalPrice'),
    ADD_INGRIDIENT: Symbol('addIngridient'),
};

export default EVENTS;