// =========================================
// 1. كود تبديل اللغة (عربي / إنجليزي)
// =========================================
const langToggleBtn = document.getElementById('lang-toggle');
const htmlElement = document.documentElement;

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const currentLang = htmlElement.getAttribute('lang');
        const newLang = currentLang === 'ar' ? 'en' : 'ar';

        htmlElement.setAttribute('lang', newLang);
        htmlElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');

        langToggleBtn.innerHTML = newLang === 'ar'
            ? '<i class="fa-solid fa-globe"></i> <span>English</span>'
            : '<i class="fa-solid fa-globe"></i> <span>العربية</span>';

        document.querySelectorAll('[data-ar]').forEach(el => {
            const text = el.getAttribute(`data-${newLang}`);
            if (text) {
                el.textContent = text;
            }
        });

        const titleElement = document.querySelector('title');
        if (titleElement) {
            document.title = titleElement.getAttribute(`data-${newLang}`);
        }
        
        // تحديث السلة عند تغيير اللغة
        updateCartUI();
    });
}

// =========================================
// 2. كود التنقل السلس (Smooth Scroll)
// =========================================
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// =========================================
// 3. كود سلة المشتريات (الحقيقية)
// =========================================
let cart = [];
const cartCountElement = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');
const cartModal = document.getElementById('cart-modal');
const closeCartModalBtn = document.querySelector('.close-cart-modal');
const goToCheckoutBtn = document.getElementById('go-to-checkout');
const checkoutModal = document.getElementById('checkout-modal');

function updateCartUI() {
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
    }

    let subtotal = 0;
    let totalItems = 0;
    const isArabic = document.documentElement.getAttribute('lang') === 'ar';

    if (cart.length === 0) {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = `<p style="text-align:center; color:#7A6A5F; padding:20px;">${isArabic ? 'السلة فارغة' : 'Cart is empty'}</p>`;
        }
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price} ${isArabic ? 'د.إ' : 'AED'}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn decrease" data-index="${index}">-</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="qty-btn increase" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            if (cartItemsContainer) {
                cartItemsContainer.appendChild(itemDiv);
            }
        });
    }

    const discountRate = 0.15;
    const discountAmount = subtotal * discountRate;
    const total = subtotal - discountAmount;
    const currency = isArabic ? 'د.إ' : 'AED';

    if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} ${currency}`;
    if (discountElement) discountElement.textContent = `${discountAmount.toFixed(2)} ${currency}`;
    if (totalElement) totalElement.textContent = `${total.toFixed(2)} ${currency}`;
    if (cartCountElement) cartCountElement.textContent = totalItems;

    // ربط أحداث الأزرار
    document.querySelectorAll('.qty-btn.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity++;
            updateCartUI();
        });
    });

    document.querySelectorAll('.qty-btn.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartUI();
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('.remove-item').getAttribute('data-index');
            cart.splice(index, 1);
            updateCartUI();
        });
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    updateCartUI();
}

document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        const name = card.querySelector('h3').getAttribute('data-ar');
        const priceText = card.querySelector('.price').getAttribute('data-ar');
        const price = parseFloat(priceText.replace(' د.إ', ''));
        
        addToCart(name, price);

        const originalHTML = button.innerHTML;
        const isArabic = document.documentElement.getAttribute('lang') === 'ar';
        button.innerHTML = isArabic ? '<i class="fa-solid fa-check"></i> تمت' : '<i class="fa-solid fa-check"></i> Added';
        button.style.backgroundColor = '#2ecc71';
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '#6F4E37';
        }, 1000);
    });
});

// =========================================
// 4. فتح وإغلاق نافذة السلة
// =========================================
const cartIcon = document.querySelector('.cart-icon');

if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', () => {
        updateCartUI();
        cartModal.style.display = 'flex';
    });
}

if (closeCartModalBtn && cartModal) {
    closeCartModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// =========================================
// 5. الانتقال من السلة إلى إتمام الطلب
// =========================================
if (goToCheckoutBtn && cartModal && checkoutModal) {
    goToCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert(document.documentElement.getAttribute('lang') === 'ar'
                ? 'السلة فارغة! أضف بعض الأصناف أولاً.'
                : 'Your cart is empty! Add some items first.');
            return;
        }
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'flex';
    });
}

// =========================================
// 6. تأكيد الطلب
// =========================================
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm && checkoutModal) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isArabic = document.documentElement.getAttribute('lang') === 'ar';
        
        alert(isArabic
            ? 'تم استلام طلبك بنجاح! سيصلك خلال 30-45 دقيقة. شكراً لثقتك بنا.'
            : 'Your order has been received successfully! It will arrive within 30-45 minutes. Thank you!');
        
        checkoutForm.reset();
        checkoutModal.style.display = 'none';
        cart = [];
        updateCartUI();
    });
}

// =========================================
// 7. كود فتح وإغلاق القائمة الجانبية (للموبايل)
// =========================================
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('active');
        }
    });
}
