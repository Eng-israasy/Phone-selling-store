<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تفاصيل المنتج</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <!-- شريط التنقل (اللوغو يظهر تلقائياً من styles.css) -->
    <header class="nav-bar">
        <span class="toggle" id="navToggle">☰</span>
        <div class="menu" id="navMenu">
            <a href="index.html">الرئيسية</a>
            <a href="login.html">تسجيل الدخول</a>
        </div>
    </header>

    <main class="pd-wrap">

        <a href="index.html" class="pd-back">→ العودة إلى الأجهزة</a>

        <!-- بطاقة المنتج -->
        <section class="pd-hero">
            <div class="pd-image">
                <img id="productImage" alt="صورة المنتج">
            </div>

            <div class="pd-info">
                <h1 id="productName">جارٍ التحميل...</h1>
                <p id="productPrice" class="pd-price"></p>
                <p id="productStatue" class="pd-chip"></p>
                <p id="productDescription" class="pd-desc"></p>
                <p class="pd-seller">البائع: <span id="productSeller">—</span></p>

                <!-- روابط التواصل -->
                <div id="contactLinks" class="pd-actions">
                    <a id="whatsappLink" class="pd-btn" href="#" target="_blank" rel="noopener">تواصل عبر WhatsApp</a>
                    <a id="emailLink" class="pd-btn pd-btn-alt" href="#">أرسل بريداً إلكترونياً</a>
                </div>
            </div>
        </section>

        <!-- التقييمات -->
        <section class="pd-card">
            <h2>تقييم البائعين</h2>
            <div id="reviewsList"></div>
        </section>

        <!-- التعليق + الاتصال -->
        <div class="pd-two">
            <section class="pd-card">
                <h2>إضافة تعليق</h2>
                <form id="commentForm">
                    <div class="form-group">
                        <label for="comment">التعليق:</label>
                        <textarea id="comment" rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <button type="submit">إرسال التعليق</button>
                    </div>
                </form>
            </section>

            <section class="pd-card">
                <h2>نموذج الاتصال</h2>
                <form id="contactForm">
                    <div class="form-group">
                        <label for="name">الاسم:</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">البريد الإلكتروني:</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="message">الرسالة:</label>
                        <textarea id="message" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <button type="submit">إرسال الرسالة</button>
                    </div>
                </form>
            </section>
        </div>
    </main>

    <script src="product-details.js"></script>
    <script>
        // قائمة الهاتف
        document.getElementById('navToggle').addEventListener('click', function () {
            document.getElementById('navMenu').classList.toggle('show');
        });

        // اسم البائع + عنوان التبويب (بدون تعديل product-details.js)
        (async function () {
            try {
                const id = new URLSearchParams(location.search).get('id');
                const res = await fetch('./products.json');
                const list = await res.json();
                const p = list.find(x => String(x.id) === id);
                if (!p) return;
                document.getElementById('productSeller').textContent = p.seller || '—';
                document.title = p.name + ' - تفاصيل المنتج';
            } catch (e) { /* تجاهل */ }
        })();
    </script>
</body>
</html>
