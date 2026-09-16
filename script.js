// =========================================
// 1. كود تبديل اللغة (عربي / إنجليزي)
// =========================================
const langToggleBtn = document.getElementById('lang-toggle');
const htmlElement = document.documentElement;

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const currentLang = htmlElement.getAttribute('lang');
        const newLang = currentLang === 'ar' ? 'en' : 'ar';

        // تغيير لغة واتجاه الصفحة
        htmlElement.setAttribute('lang', newLang);
        htmlElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');

        // تغيير نص زر التبديل
        langToggleBtn.innerHTML = newLang === 'ar'
            ? '<i class="fa-solid fa-globe"></i> <span>English</span>'
            : '<i class="fa-solid fa-globe"></i> <span>العربية</span>';

        // تبديل النصوص في جميع العناصر التي تحتوي على data-ar و data-en
        document.querySelectorAll('[data-ar]').forEach(el => {
            const text = el.getAttribute(`data-${newLang}`);
            if (text) {
                el.textContent = text;
            }
        });

        // تغيير عنوان الصفحة (Title)
        const titleElement = document.querySelector('title');
        if (titleElement) {
            document.title = titleElement.getAttribute(`data-${newLang}`);
        }
    });
}

// =========================================
// 2. كود التنقل السلس (Smooth Scroll)
// =========================================
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // منع السلوك الافتراضي

        // إزالة الكلاس active من جميع الروابط
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        // إضافة الكلاس active للرابط الذي تم الضغط عليه
        this.classList.add('active');

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// =========================================
// 3. كود عداد السلة (إضافة الأصناف)
// =========================================
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');
const addButtons = document.querySelectorAll('.add-btn');

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }

        // تأثير بصري بسيط عند الإضافة
        const originalHTML = button.innerHTML;
        const isArabic = document.documentElement.getAttribute('lang') === 'ar';

        button.innerHTML = isArabic
            ? '<i class="fa-solid fa-check"></i> تمت'
            : '<i class="fa-solid fa-check"></i> Added';
        button.style.backgroundColor = '#2ecc71'; // لون أخضر

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '#6F4E37'; // رجوع للون البني الأساسي
        }, 1000);
    });
});

// =========================================
// 4. زر "اطلب الآن" في قسم الترحيب
// =========================================
const orderBtn = document.querySelector('.btn-order');
if (orderBtn) {
    orderBtn.addEventListener('click', () => {
        const mealsSection = document.querySelector('#meals');
        if (mealsSection) {
            mealsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// =========================================
// 5. كود نافذة إتمام الطلب (Checkout Modal)
// =========================================
const modal = document.getElementById('checkout-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeModalBtn = document.querySelector('.close-modal');
const checkoutForm = document.getElementById('checkout-form');

// فتح النافذة عند الضغط على أيقونة السلة
if (cartIcon && modal) {
    cartIcon.addEventListener('click', () => {
        if (cartCount === 0) {
            alert(document.documentElement.getAttribute('lang') === 'ar'
                ? 'السلة فارغة! أضف بعض الأصناف أولاً.'
                : 'Your cart is empty! Add some items first.');
            return;
        }
        modal.style.display = 'flex';
    });
}

// إغلاق النافذة بزر X
if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// إغلاق النافذة عند الضغط خارج المحتوى
if (modal) {
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// تأكيد الطلب
if (checkoutForm && modal) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        const isArabic = document.documentElement.getAttribute('lang') === 'ar';

        alert(isArabic
            ? 'تم استلام طلبك بنجاح! سيصلك خلال 30-45 دقيقة. شكراً لثقتك بنا.'
            : 'Your order has been received successfully! It will arrive within 30-45 minutes. Thank you!');

        checkoutForm.reset();
        modal.style.display = 'none';
        cartCount = 0;
        if (cartCountElement) {
            cartCountElement.textContent = 0;
        }
    });
}

// =========================================
// 6. كود فتح وإغلاق القائمة الجانبية (للموبايل)
// =========================================
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
    // فتح / إغلاق القائمة عند الضغط على زر الهامبرجر
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // منع انتشار الحدث
        sidebar.classList.toggle('active');
    });

    // إغلاق القائمة تلقائياً عند الضغط على أي رابط داخلها
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    });

    // إغلاق القائمة عند الضغط في أي مكان خارجها
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('active');
        }
    });
}
