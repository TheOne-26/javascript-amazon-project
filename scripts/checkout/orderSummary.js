
import {
  cart,
  removeFromCart,
  updateDeliveryOption
} from '../../data/cart.js';

import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHtml = '';

  cart.forEach((cartItem) => {
    const matchingProduct = products.find(
      (product) => product.id === cartItem.productID
    );

    if (!matchingProduct) {
      console.error('Product not found:', cartItem.productID);
      return;
    }

    const deliveryOptionId =
      cartItem.deliveryOptionId || cartItem.deliveryOptionsId || '1';

    cartItem.deliveryOptionId = deliveryOptionId;

    const selectedOption = deliveryOptions.find(
      (option) => String(option.id) === String(deliveryOptionId)
    ) || deliveryOptions[0];

    const dateString = dayjs()
      .add(selectedOption.deliveryDays, 'days')
      .format('dddd, MMMM D');

    cartSummaryHtml += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>

            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>

            <div class="product-quantity">
              Quantity:
              <span class="quantity-label">${cartItem.quantity}</span>

              <span
                class="delete-quantity-link link-primary js-delete-quantity-link"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>

            ${deliveryoptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryoptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((option) => {
      const dateString = dayjs()
        .add(option.deliveryDays, 'days')
        .format('dddd, MMMM D');

      const priceString = option.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(option.priceCents)} -`;

      const isChecked =
        String(option.id) === String(cartItem.deliveryOptionId);

      html += `
        <div
          class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${option.id}">

          <input
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}"
            value="${option.id}"
            ${isChecked ? 'checked' : ''}>

          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
    });

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML =
    cartSummaryHtml;

  document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      removeFromCart(productId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
