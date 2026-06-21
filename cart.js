document.addEventListener("DOMContentLoaded", () => {
    // Inject Cart HTML into body
    const cartHTML = `
    <!-- Cart Overlay & Drawer -->
    <div class="cart-overlay"></div>
    <div class="cart-drawer">
        <div class="cart-header">
            <h2>Your Cart</h2>
            <button class="close-cart-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
        <div class="cart-items-container">
            <!-- Items will be injected here -->
        </div>
        <div class="cart-footer">
            <div class="cart-subtotal">
                <span>Subtotal</span>
                <span class="subtotal-price">₹0</span>
            </div>
            <a href="checkout.html" class="checkout-btn">Proceed to Checkout</a>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);

    const cartBtns = document.querySelectorAll('.cart-btn');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const subtotalPriceEl = document.querySelector('.subtotal-price');
    const cartBadges = document.querySelectorAll('.cart-badge');
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');

    let cart = JSON.parse(localStorage.getItem('vorelis_cart')) || [];

    function saveCart() {
        localStorage.setItem('vorelis_cart', JSON.stringify(cart));
    }

    function openCart() {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart();
    }

    function closeCart() {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    }));
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadges.forEach(badge => {
            badge.textContent = totalItems;
        });
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty-msg">Your cart is currently empty.</div>';
            subtotalPriceEl.textContent = '₹0';
            updateCartBadge();
            return;
        }

        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div>
                            <h4 class="cart-item-title">${item.title}</h4>
                            <p class="cart-item-variant">Size: ${item.size || 'M'} | Color: ${item.color || 'Standard'}</p>
                            <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="qty-control">
                                <button class="qty-btn minus-btn" data-index="${index}">-</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button class="qty-btn plus-btn" data-index="${index}">+</button>
                            </div>
                            <button class="remove-item-btn" data-index="${index}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        subtotalPriceEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        updateCartBadge();

        // Attach listeners for newly rendered buttons
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.index, -1));
        });
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.index, 1));
        });
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => removeItem(e.target.dataset.index));
        });
    }

    function updateQuantity(index, change) {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
        renderCart();
    }

    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }

    // Quick Add functionality for shop page
    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.product-card-rounded');
            const title = productCard.querySelector('.product-title').textContent;
            const priceStr = productCard.querySelector('.price-sale').textContent;
            const price = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
            const image = productCard.querySelector('.product-img').src;

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ title, price, image, quantity: 1, size: 'M', color: 'Default' });
            }

            saveCart();
            updateCartBadge();
            openCart();
        });
    });

    // Initial badge update
    updateCartBadge();

    // Mobile Bottom Nav Scroll Reveal
    const bottomNav = document.querySelector('.bottom-nav.mobile-only');
    if (bottomNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                bottomNav.classList.add('nav-visible');
            } else {
                bottomNav.classList.remove('nav-visible');
            }
        });
        
        // Initial check in case user is already scrolled down on page load
        if (window.scrollY > 50) {
            bottomNav.classList.add('nav-visible');
        }
    }
});
