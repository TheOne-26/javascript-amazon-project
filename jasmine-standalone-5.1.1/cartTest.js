
import {
  addToCart,
  cart,
  loadfromstorage
} from '../data/cart.js';

describe('test suite: addToCart', () => {

  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify([])
    );

    loadfromstorage();
  });

  it('adds an existing product to the cart', () => {
    // Start with one existing product
    localStorage.getItem.and.returnValue(
      JSON.stringify([{
        productID: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }])
    );

    loadfromstorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);
    expect(cart[0].productID).toEqual(
      'e43638ce-6aa0-4b85-b27f-e1d07eb678c6'
    );
    expect(cart[0].quantity).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('adds a new product to the cart', () => {
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

});
