// Cart
import '//www.arttakestime.com/cdn/shop/t/8/assets/m-cart.js?v=160529413389941142061732788640'; 

// (Cart) Open the cart dialog + update header cart counter
document.addEventListener('liquid-ajax-cart:request-end', event => {
    const {requestState} = event.detail;

    // If the "add to cart" request is successful
    if (requestState.requestType === 'add' && requestState.responseData?.ok) {
        // Open the cart dialog
        const cartBox = document.getElementById('cartBox');
        if (cartBox) cartBox.open();
    }
});

// (Cart) Update header cart counter 
document.addEventListener("liquid-ajax-cart:queue-end", function() {
    let itemCount = window.liquidAjaxCart.cart.item_count; // Get the item count
    document.querySelectorAll('[data-count]').forEach(function(el) {
        el.setAttribute('data-count', itemCount); // Update the data-count attribute
    });
});

// (Cart) Add attribute while product being added to cart
document.addEventListener('liquid-ajax-cart:request-start', event => {
    const {requestState} = event.detail;
    if (requestState.requestType === 'add') document.body.setAttribute('cart-state', 'processing')
});

// (Cart) Add attribute when product is added to cart
document.addEventListener('liquid-ajax-cart:request-end', event => {
    const {requestState} = event.detail;
    if (requestState.requestType === 'add') {
        document.body.removeAttribute('cart-state', 'processing');
        document.body.setAttribute('cart-state', 'done');
        setTimeout(function() { document.body.removeAttribute('cart-state', 'done') }, 4000);
    }
});

document.addEventListener('liquid-ajax-cart:request-end', event => {
  document.querySelectorAll('[data-ajax-cart-section] [data-ajax-cart-details]').forEach($details => {
    const key = $details.getAttribute('data-ajax-cart-details');
    if (!key) return;
    $details.open = cartDetailsOpen[key];
  });
  cartDetailsInit();
});

// (Cart) Fix for details stays open
const cartDetailsOpen = {};
function cartDetailsInit() {
  document.querySelectorAll('[data-ajax-cart-section] [data-ajax-cart-details]').forEach($details => {
    const key = $details.getAttribute('data-ajax-cart-details');
    if (!key) return;
    cartDetailsOpen[key] = $details.hasAttribute('open');
    $details.addEventListener('toggle', event => {
      cartDetailsOpen[key] = event.target.open;
    });
  });
}
cartDetailsInit();

// Remove in production
//window.liquidAjaxCart.conf('updateOnWindowFocus', false);