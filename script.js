// --- 1. كود تبديل اللغة ---
const langToggleBtn = document.getElementById('lang-toggle');
const htmlElement = document.documentElement;

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

// --- 2. كود التنقل السلس (Smooth Scroll) ---
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// --- 3. كود عداد السلة ---
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        cartCountElement.textContent = cartCount;
        
        const originalHTML = button.innerHTML;
        const isArabic = document.documentElement.getAttribute('lang') === 'ar';
        
        button.innerHTML = isArabic ? '<i class="fa-solid fa-check"></i> تمت' : '<i class="fa-solid fa-check"></i> Added';
        button.style.backgroundColor = '#2ecc71';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '#d4af37';
        }, 1000);
    });
});

// --- 4. زر "اطلب الآن" ---
document.querySelector('.btn-order').addEventListener('click', () => {
    document.querySelector('#meals').scrollIntoView({ behavior: 'smooth' });
});
