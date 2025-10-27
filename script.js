document.addEventListener('DOMContentLoaded', () => {

    AOS.init({
        duration: 800,
        once: true
    });

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

    const hamburger = document.getElementById('hamburger');
    const mainNav = document.querySelector('.main-nav');
    const overlay = document.getElementById('overlay');

    let cartArray = [];

    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
        });
    });
    
    overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mainNav.classList.remove('active');
        overlay.classList.remove('active');
    });

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

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addItemToCart(name, price);
        });
    });

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
        if (cartArray.length > 0) {
            alert('Order placed! Your delicious food is on its way!');
            cartArray = [];
            renderCart();
            cartModal.style.display = 'none';
        } else {
            alert('Your cart is empty! Add some yummy food first.');
        }
    });

    function addItemToCart(name, price) {
        const existingItem = cartArray.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartArray.push({ name, price, quantity: 1 });
        }
        renderCart();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cartArray.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartCount.textContent = '0';
            totalPriceElement.textContent = '0.00';
            return;
        }

        let total = 0;
        let itemCount = 0;
        cartArray.forEach(item => {
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
                    <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                    <i class="fas fa-trash remove-item" data-name="${item.name}"></i>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        totalPriceElement.textContent = total.toFixed(2);
        cartCount.textContent = itemCount;
    }

    function removeItemFromCart(name) {
        cartArray = cartArray.filter(item => item.name !== name);
        renderCart();
    }

    function updateItemQuantity(name, change) {
        const item = cartArray.find(item => item.name === name);
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