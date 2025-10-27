// Okay, let's get this party started. Wait for the page to be fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- GRABBING ALL THE HTML ELEMENTS WE NEED ---
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.getElementById('closeBtn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const foodCards = document.querySelectorAll('.food-card');

    // --- OUR APP'S "MEMORY" ---
    // This array will hold everything in the user's cart.
    let cart = [];

    // --- EVENT LISTENERS (THE "EARS" OF OUR APP) ---

    // Cart icon click -> open the modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    // Close button click -> close the modal
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Clicking outside the modal -> close it
    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // --- MENU FILTERING LOGIC ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // First, remove the 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Then, add the 'active' class to the button we just clicked
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            // Now, loop through all the food cards and show/hide them
            foodCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block'; // Show the card
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });
        });
    });

    // --- CART LOGIC ---
    // Add an event listener to each "Add to Cart" button
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addItemToCart(name, price);
        });
    });

    // This is a bit tricky. We use "event delegation" for buttons inside the cart
    // because they are created dynamically after the page loads.
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;

        // Check if the clicked element is a 'remove' or 'quantity' button
        if (target.classList.contains('remove-item')) {
            const name = target.getAttribute('data-name');
            removeItemFromCart(name);
        } else if (target.classList.contains('quantity-btn')) {
            const name = target.getAttribute('data-name');
            const change = parseInt(target.getAttribute('data-change')); // +1 or -1
            updateItemQuantity(name, change);
        }
    });

    // Checkout button - just a simple alert for this project
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thanks for your order! We\'ll start cooking right away.');
            cart = []; // Clear the cart
            renderCart(); // Update the display
            cartModal.style.display = 'none';
        } else {
            alert('Your cart is empty! Add some delicious food first.');
        }
    });


    // --- FUNCTIONS (THE "BRAINS" OF OUR APP) ---

    /**
     * Adds an item to our cart array.
     */
    function addItemToCart(name, price) {
        // Check if the item is already in the cart
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            // If it is, just increase the quantity
            existingItem.quantity++;
        } else {
            // If not, add it as a new item
            cart.push({ name, price, quantity: 1 });
        }
        // Update the cart display every time we add something
        renderCart();
    }

    /**
     * This function redraws the entire cart in the modal.
     * It's the main function for updating the cart UI.
     */
    function renderCart() {
        // Clear the current cart display
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartCount.textContent = '0';
            totalPriceElement.textContent = '0.00';
            return; // Stop here if the cart is empty
        }

        let total = 0;
        let itemCount = 0;

        // Loop through each item in our cart array and create HTML for it
        cart.forEach(item => {
            total += item.price * item.quantity;
            itemCount += item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            // This is the HTML structure for a single item in the cart
            cartItemElement.innerHTML = `
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-name="${item.name}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-name="${item.name}" data-change="1">+</button>
                    </div>
                </div>
                <div>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <i class="fas fa-trash remove-item" data-name="${item.name}"></i>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        // Finally, update the total price and the little number on the cart icon
        totalPriceElement.textContent = total.toFixed(2);
        cartCount.textContent = itemCount;
    }

    /**
     * Removes an item completely from the cart.
     */
    function removeItemFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        renderCart(); // Re-render the cart to show the change
    }

    /**
     * Changes the quantity of an item in the cart.
     */
    function updateItemQuantity(name, change) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += change;
            // If quantity goes to 0 or below, remove the item
            if (item.quantity <= 0) {
                removeItemFromCart(name);
            } else {
                renderCart(); // Otherwise, just re-render
            }
        }
    }
});