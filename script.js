// Wait for the whole page to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECTING ELEMENTS ---
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.getElementById('closeBtn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // --- STATE MANAGEMENT ---
    // This array will hold the items in our cart
    let cart = [];

    // --- EVENT LISTENERS ---

    // Open the cart modal when the cart icon is clicked
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    // Close the cart modal when the 'x' is clicked
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Add an event listener to each "Add to Cart" button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the name and price from the button's data attributes
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            // Call the function to add the item to the cart
            addItemToCart(name, price);
        });
    });

    // Simple checkout button message
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Order placed! (This is a demo, so no real order was made.)');
            cart = []; // Clear the cart
            updateCartUI(); // Update the display
            cartModal.style.display = 'none'; // Close the modal
        } else {
            alert('Your cart is empty!');
        }
    });


    // --- FUNCTIONS ---

    /**
     * Adds an item to the cart array.
     * If the item is already there, it just increases the quantity.
     */
    function addItemToCart(name, price) {
        // Check if the item is already in the cart
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            // If it exists, increase the quantity
            existingItem.quantity++;
        } else {
            // If it doesn't exist, add it to the cart
            cart.push({ name, price, quantity: 1 });
        }

        // Update the cart display
        updateCartUI();
    }

    /**
     * Updates the entire cart UI: the modal, the count, and the total price.
     */
    function updateCartUI() {
        // Clear the current cart display
        cartItemsContainer.innerHTML = '';

        // If the cart is empty, show a message
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartCount.textContent = '0';
            totalPriceElement.textContent = '0.00';
            return; // Stop the function here
        }

        let total = 0;
        let itemCount = 0;

        // Loop through each item in the cart and display it
        cart.forEach(item => {
            total += item.price * item.quantity;
            itemCount += item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        // Update the total price and cart count
        totalPriceElement.textContent = total.toFixed(2);
        cartCount.textContent = itemCount;
    }
});