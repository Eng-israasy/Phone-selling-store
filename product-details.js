
document.addEventListener('DOMContentLoaded', async function() {

    // قراءة معرف المنتج من الرابط
    const productId = new URLSearchParams(window.location.search).get('id');

    if (!productId) {
        document.body.innerHTML = '<h1>المنتج غير موجود</h1>';
        return;
    }

    try {

        // تحميل المنتجات من ملف JSON
        const response = await fetch('./products.json');

        if (!response.ok) {
            throw new Error('تعذر تحميل المنتجات');
        }

        const products = await response.json();

        // البحث عن المنتج المطلوب
        const product = products.find(p => String(p.id) === productId);

        if (!product) {
            document.body.innerHTML = '<h1>المنتج غير موجود</h1>';
            return;
        }

        // عرض تفاصيل المنتج
        document.getElementById('productName').textContent = product.name;

        document.getElementById('productPrice').textContent =
            `السعر: ${product.price} $`;

        document.getElementById('productDescription').textContent =
            `الوصف: ${product.description || product.DescribtionProduct || ''}`;

        document.getElementById('productStatue').textContent =
            `حالة الجهاز: ${product.statue || ''}`;

        const productImage = document.getElementById('productImage');
        productImage.src = product.image;
        productImage.alt = product.name;

        // إعداد WhatsApp
        const whatsappLink = document.getElementById('whatsappLink');

        if (product.phonenumber) {

            const message =
                `مرحباً، أريد الاستفسار عن ${product.name} بسعر ${product.price}$`;

            whatsappLink.href =
                `https://wa.me/${product.phonenumber}?text=${encodeURIComponent(message)}`;

        } else {
            whatsappLink.removeAttribute('href');
        }

        // البريد الإلكتروني غير محدد حالياً
        const emailLink = document.getElementById('emailLink');
        emailLink.href = 'mailto:';

        // عرض التعليقات المحفوظة محلياً
        displayReviews(productId);

        // إضافة تعليق
        document.getElementById('commentForm')
            ?.addEventListener('submit', function(e) {

                e.preventDefault();

                const commentText =
                    document.getElementById('comment').value.trim();

                if (!commentText) {
                    alert('يرجى إدخال تعليق قبل الإرسال.');
                    return;
                }

                const currentUser =
                    JSON.parse(localStorage.getItem('currentUser')) || null;

                const newComment = {
                    id: Date.now(),
                    productId: productId,
                    text: commentText,
                    user: currentUser ? currentUser.text : 'زائر'
                };

                const comments =
                    JSON.parse(localStorage.getItem('comments')) || [];

                comments.push(newComment);

                localStorage.setItem('comments', JSON.stringify(comments));

                document.getElementById('commentForm').reset();

                displayReviews(productId);

                alert('تمت إضافة تعليقك.');
            });

        // نموذج الاتصال
        document.getElementById('contactForm')
            ?.addEventListener('submit', function(e) {

                e.preventDefault();

                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();

                if (!name || !email || !message) {
                    alert('يرجى ملء جميع الحقول.');
                    return;
                }

                const whatsappMessage =
                    `الاسم: ${name}\nالبريد: ${email}\nالرسالة: ${message}`;

                if (product.phonenumber && product.phonenumber !== '9050000000') {

                    const url =
                        `https://wa.me/${product.phonenumber}?text=${encodeURIComponent(whatsappMessage)}`;

                    window.open(url, '_blank');

                    document.getElementById('contactForm').reset();

                } else {
                    alert('يرجى تحديد رقم WhatsApp الحقيقي للمتجر أولاً.');
                }
            });

    } catch (error) {

        console.error('خطأ:', error);

        document.body.innerHTML =
            '<h1>حدث خطأ أثناء تحميل تفاصيل الجهاز.</h1>';
    }

    // =================================
    // عرض التعليقات
    // =================================

    function displayReviews(productId) {

        const comments =
            JSON.parse(localStorage.getItem('comments')) || [];

        const productReviews =
            comments.filter(c => String(c.productId) === String(productId));

        const reviewsList = document.getElementById('reviewsList');

        reviewsList.innerHTML = '';

        if (productReviews.length === 0) {
            reviewsList.textContent = 'لا توجد تعليقات حتى الآن.';
            return;
        }

        productReviews.forEach(comment => {

            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review');

            const user = document.createElement('h3');
            user.textContent = comment.user;

            const text = document.createElement('p');
            text.textContent = comment.text;

            reviewDiv.appendChild(user);
            reviewDiv.appendChild(text);

            // زر حذف التعليق
            const deleteButton = document.createElement('button');

            deleteButton.textContent = 'حذف';

            deleteButton.addEventListener('click', function() {

                if (confirm('هل أنت متأكد من حذف هذا التعليق؟')) {

                    let comments =
                        JSON.parse(localStorage.getItem('comments')) || [];

                    comments = comments.filter(
                        c => c.id !== comment.id
                    );

                    localStorage.setItem(
                        'comments',
                        JSON.stringify(comments)
                    );

                    displayReviews(productId);
                }
            });

            reviewDiv.appendChild(deleteButton);

            reviewsList.appendChild(reviewDiv);
        });
    }

});
