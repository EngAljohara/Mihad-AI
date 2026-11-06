// عناصر الصفحة
const mom = document.getElementById('mom');
const dad = document.getElementById('dad');
const momPreview = document.getElementById('momPreview');
const dadPreview = document.getElementById('dadPreview');
const momInfo = document.getElementById('momInfo');
const dadInfo = document.getElementById('dadInfo');
const matchBtn = document.getElementById('matchBtn');
const loader = document.getElementById('loader'); // لو عندك لودر

// روابط مؤقتة للصور (لا تُحفظ على القرص)
let momObjectURL = null;
let dadObjectURL = null;

function handleFileInput(inputEl, previewEl, infoEl, who) {
    const file = inputEl.files && inputEl.files[0];
    if (!file) {
        previewEl.removeAttribute('src');
        if (infoEl) infoEl.textContent = '';
        return;
    }

    // التحقق من النوع والحجم (اختياري لكن مفيد)
    const okTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!okTypes.includes(file.type)) {
        alert('الرجاء اختيار صورة بصيغة JPG/PNG/WebP');
        inputEl.value = '';
        return;
    }
    const maxMB = 8;
    if (file.size > maxMB * 1024 * 1024) {
        alert(`حجم الصورة كبير. الحد الأقصى ${maxMB}MB`);
        inputEl.value = '';
        return;
    }

    // إنشاء رابط مؤقت للمعاينة
    const url = URL.createObjectURL(file);
    previewEl.src = url;

    if (who === 'mom') {
        if (momObjectURL) URL.revokeObjectURL(momObjectURL);
        momObjectURL = url;
    } else {
        if (dadObjectURL) URL.revokeObjectURL(dadObjectURL);
        dadObjectURL = url;
    }

    // قراءة أبعاد الصورة للتنبيه على نسبة 2:3 (قريبة من 4×6)
    const img = new Image();
    img.onload = () => {
        const ratio = (img.width / img.height).toFixed(2);
        const near23 = Math.abs((img.width / img.height) - (2 / 3)) < 0.05;
        if (infoEl) {
            infoEl.textContent = `الأبعاد: ${img.width}×${img.height} — النسبة ${ratio} ${near23 ? '✓ مناسبة (قريبة من 4×6)' : '⚠️ يفضّل 4×6 (نسبة 2:3)'
                }`;
        }
    };
    img.src = url;
}

// ربط أحداث الرفع
if (mom) mom.addEventListener('change', () => handleFileInput(mom, momPreview, momInfo, 'mom'));
if (dad) dad.addEventListener('change', () => handleFileInput(dad, dadPreview, dadInfo, 'dad'));

// زر "ابدأ المطابقة" — حالياً فقط نتأكد أنّ الصور انرفعت وجاهزة
if (matchBtn) {
    matchBtn.addEventListener('click', async () => {
        if (!mom?.files?.length || !dad?.files?.length) {
            alert('فضلاً ارفعي صورة الأم وصورة الأب أولاً.');
            return;
        }

        if (loader) loader.style.display = 'flex';

        // تجهيز عناصر Image — هذه نستخدمها لاحقاً للمطابقة الحقيقية
        const momImg = new Image(); momImg.src = momObjectURL;
        const dadImg = new Image(); dadImg.src = dadObjectURL;
        await Promise.all([
            new Promise(r => momImg.onload = r),
            new Promise(r => dadImg.onload = r),
        ]);

        if (loader) loader.style.display = 'none';
        alert('تمام — الصور انرفعت من جهازك وجاهزة للمطابقة ✅');
    });
}

// تنظيف الروابط المؤقتة عند الخروج
window.addEventListener('beforeunload', () => {
    if (momObjectURL) URL.revokeObjectURL(momObjectURL);
    if (dadObjectURL) URL.revokeObjectURL(dadObjectURL);
});


// تعريف بسيط لحالة الدخول (عميل فقط)
function isOrgAuthed() { return sessionStorage.getItem('orgAuthed') === '1'; }

// خذي دالة goto الأصلية لو عندك
const _goto = window.goto || function (id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

// احمي الوصول لصفحة المطابقة ولوحة المؤسسة
window.goto = function (id) {
    const protectedPages = ['matching', 'admin']; // اللي نبي نحميها
    if (protectedPages.includes(id) && !isOrgAuthed()) {
        alert('هذه الصفحة مخصصة للمؤسسات. الرجاء تسجيل الدخول.');
        return _goto('login-org');
    }
    return _goto(id);
};












document.getElementById('orgLogoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('orgAuthed');
    alert('تم تسجيل الخروج');
    goto('login-org');
});



document.querySelector('#login-org button')?.addEventListener('click', () => {
    const email = document.getElementById('email-org').value.trim().toLowerCase();
    const password = document.getElementById('password-org').value.trim();

    const isDomainOk = email.endsWith('.sa');
    const isPassOk = false; // Demo login disabled: implement real Firebase Auth

    if (!isDomainOk) {
        alert('الرجاء استخدام بريد رسمي ينتهي بـ .sa');
        return;
    }

    if (!isPassOk) {
        alert('كلمة المرور غير صحيحة');
        return;
    }

    sessionStorage.setItem('orgAuthed', '1');
    window.location.href = 'admin.html';
});
