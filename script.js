// Let's get this party started. Wait for the page to be fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // --- INITIALIZING AOS ANIMATIONS ---
    AOS.init({
        duration: 800, // Animation duration
        once: true // Animation happens only once
    });

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

    // --- MOBILE MENU ELEMENTS ---
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.querySelector('.main-nav');
    const overlay = document.getElementById('overlay');

    // --- OUR APP'S "MEMORY" ---
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

    // --- MOBILE MENU TOGGLE ---
    hamburger.addEventListener('click', () => {
        // Toggle the 'active' class on the hamburger and the nav
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
        });
    });
    
    // Close mobile menu when overlay is clicked
    overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mainNav.classList.remove('active');
        overlay.classList.remove('active');
    });

    // --- MENU FILTERING LOGIC ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            foodCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- CART LOGIC ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addItemToCart(name, price);
        });
    });

    // Event delegation for dynamic cart buttons
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('remove-item')) {
            const name = target.getAttribute('data-name');
            removeItemFromCart(name);
        } else if (target.classList.contains('quantity-btn')) {
            const name = target.getAttribute('data-name');
            const change = parseInt(target.getAttribute('data-change'));
            updateItemQuantity(name, change);
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thanks for your order! We\'ll start cooking right away.');
            cart = [];
            renderCart();
            cartModal.style.display = 'none';
        } else {
            alert('Your cart is empty! Add some delicious food first.');
        }
    });

    // --- FUNCTIONS (THE "BRAINS" OF OUR APP) ---

    function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        renderCart();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartCount.textContent = '0';
            totalPriceElement.textContent = '0.00';
            return;
        }

        let total = 0;
        let itemCount = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            itemCount += item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
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

        totalPriceElement.textContent = total.toFixed(2);
        cartCount.textContent = itemCount;
    }

    function removeItemFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        renderCart();
    }

    function updateItemQuantity(name, change) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeItemFromCart(name);
            } else {
                renderCart();
            }
        }
    }
});