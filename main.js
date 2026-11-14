
// ========================================
// main.js - Mobile Store
// قراءة المنتجات من products.json
// ========================================

let allProducts = [];

// ========================================
// تسجيل المستخدم
// ========================================

document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const text = document.getElementById('text').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        const error = document.getElementById('errorMessage');
        error.textContent = 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين.';
        error.style.display = 'block';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        const error = document.getElementById('errorMessage');
        error.textContent = 'هذا البريد الإلكتروني مسجل مسبقاً.';
        error.style.display = 'block';
        return;
    }

    users.push({ text, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    window.location.href = 'login.html';
});

// ========================================
// تسجيل الدخول
// ========================================

document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        const error = document.getElementById('errorMessage');
        error.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        error.style.display = 'block';
    }
});

// ========================================
// عرض المنتجات
// ========================================

function displayProducts(products = allProducts) {

    const productsList = document.getElementById('productsList');
    const productContainer = document.getElementById('product-list');

    // استخدام الحاوية الموجودة في الصفحة
    const container = productsList || productContainer;

    if (!container) return;

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>لا توجد أجهزة متاحة حالياً.</p>';
        return;
    }

    products.forEach(product => {

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        // صورة الجهاز
        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;
        productImage.loading = 'lazy';

        productDiv.appendChild(productImage);

        // اسم الجهاز
        const productName = document.createElement('h3');
        productName.textContent = product.name;
        productDiv.appendChild(productName);

        // السعر
        const productPrice = document.createElement('p');
        productPrice.textContent = `السعر: ${product.price} $`;
        productDiv.appendChild(productPrice);

        // الوصف
        const description = document.createElement('p');
        description.textContent =
            `الوصف: ${product.description || product.DescribtionProduct || ''}`;

        productDiv.appendChild(description);

        // حالة الجهاز
        const status = document.createElement('p');
        status.textContent = `حالة الجهاز: ${product.statue || ''}`;
        productDiv.appendChild(status);

        // اسم البائع
        const seller = document.createElement('p');
        seller.textContent = `البائع: ${product.seller || ''}`;
        productDiv.appendChild(seller);

        // رابط التفاصيل
        const detailsLink = document.createElement('a');

        detailsLink.href = `product-details.html?id=${product.id}`;
        detailsLink.textContent = 'المزيد';
        detailsLink.classList.add('details-link');

        productDiv.appendChild(detailsLink);

        // زر الشراء
        const buyButton = document.createElement('button');
        buyButton.textContent = 'شراء الآن';

        buyButton.addEventListener('click', function() {

            const whatsappNumber = product.phonenumber;

            if (!whatsappNumber || whatsappNumber === '9050000000') {
                alert('يرجى تحديث رقم WhatsApp الخاص بالمتجر.');
                return;
            }

            const message =
                `أريد شراء المنتج ${product.name} بسعر ${product.price}$.`;

            const url =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            window.open(url, '_blank');
        });

        productDiv.appendChild(buyButton);

        container.appendChild(productDiv);
    });
}

// ========================================
// البحث عن المنتجات
// ========================================

window.performSearch = function(event) {

    event.preventDefault();

    const searchInput = document.getElementById('searchInput');

    const searchQuery = searchInput.value.trim().toLowerCase();

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );

    displayProducts(filteredProducts);
};

// ========================================
// تحميل المنتجات من ملف JSON
// ========================================

async function loadProducts() {

    try {

        const response = await fetch('./products.json');

        if (!response.ok) {
            throw new Error('تعذر تحميل ملف المنتجات');
        }

        allProducts = await response.json();

        displayProducts();

    } catch (error) {

        console.error('خطأ في تحميل المنتجات:', error);

        const container =
            document.getElementById('productsList') ||
            document.getElementById('product-list');

        if (container) {
            container.innerHTML =
                '<p>حدث خطأ أثناء تحميل الأجهزة. يرجى المحاولة لاحقاً.</p>';
        }
    }
}

// ========================================
// تشغيل الصفحة
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // تحميل المنتجات
    loadProducts();

    // إيقاف إضافة المنتجات من الزوار
    document.getElementById('productForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('إضافة الأجهزة متاحة لإدارة المتجر فقط.');
    });

});
