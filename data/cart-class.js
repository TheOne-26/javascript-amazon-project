class Cart {
  cartItems;

  localStorageKey;

  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadfromstorage();
  }

  loadfromstorage() {
  this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey));

  if (!this.cartItems) {
    this.cartItems = [
      {
        productID: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      },
      {
        productID: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }
    ];
  }
      this.saveToStorage();
}

saveToStorage() {
  localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
}

addToCart(productId) {
  let matchingItem;

  this.cartItems.forEach((cartItem) => {
    if (productId === cartItem.productID) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    this.cartItems.push({
      productID: productId,
      quantity: 1,
      deliveryOptionId: '1'
    });
  }

  this.saveToStorage();
}


removeFromCart(productId) {
  const newCart = [];

  this.cartItems.forEach((cartItem) => {
    if (cartItem.productID !== productId) {
      newCart.push(cartItem);
    }
  });

  this.cartItems = newCart;
  this.saveToStorage();
}


 updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = this.cartItems.find((cartItem) => {
    return cartItem.productID === productId;
  });

  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}


}

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');
