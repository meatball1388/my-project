// ================== МОДАЛЬНОЕ ОКНО КОНТАКТОВ ==================

const dlg      = document.getElementById('contactDialog');
const openBtn  = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form     = document.getElementById('contactForm');

let lastActive = null;

// Открытие модального окна
if (openBtn && dlg) {
    openBtn.addEventListener('click', () => {
        lastActive = document.activeElement;
        dlg.showModal();
        const firstField = dlg.querySelector('input, select, textarea, button');
        if (firstField) firstField.focus();
    });
}

// Закрытие по кнопке "Отмена"
if (closeBtn && dlg) {
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dlg.close('cancel');
    });
}

// Возврат фокуса после закрытия
if (dlg) {
    dlg.addEventListener('close', () => {
        if (lastActive) lastActive.focus();
    });
}

// ================== ВАЛИДАЦИЯ ФОРМЫ ==================

if (form) {
    form.addEventListener('submit', (e) => {
        // Сброс кастомных сообщений
        [...form.elements].forEach(el => el.setCustomValidity?.(''));

        // Базовая HTML5‑валидация
        if (!form.checkValidity()) {
            e.preventDefault();

            const email = form.elements.email;
            if (email && email.validity.typeMismatch) {
                email.setCustomValidity('Введите корректный e-mail, например name@example.com');
            }

            form.reportValidity();

            // Подсветка невалидных полей
            [...form.elements].forEach(el => {
                if (el.willValidate) {
                    el.toggleAttribute('aria-invalid', !el.checkValidity());
                }
            });

            return;
        }

        // Успешная «отправка» без сервера
        e.preventDefault();

        if (dlg) {
            dlg.close('success');
        }

        form.reset();
        showSuccessMessage('Заявка отправлена! Я свяжусь с вами в ближайшее время.');
    });
}

// ================== МАСКА ТЕЛЕФОНА ==================

const phone = document.getElementById('phone');

if (phone) {
    phone.addEventListener('input', () => {
        const digits = phone.value.replace(/\D/g, '').slice(0, 11);
        const d = digits.replace(/^8/, '7');
        const parts = [];

        if (d.length > 0) parts.push('+7');
        if (d.length > 1) parts.push(' (' + d.slice(1, 4));
        if (d.length >= 4) parts[parts.length - 1] += ')';
        if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
        if (d.length >= 8) parts.push('-' + d.slice(7, 9));
        if (d.length >= 10) parts.push('-' + d.slice(9, 11));

        phone.value = parts.join('');
    });
}

// ================== КРАСИВОЕ УВЕДОМЛЕНИЕ ==================

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Убираем уведомление через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);

    // Добавляем CSS‑анимации один раз
    if (!document.getElementById('successMessageAnimations')) {
        const style = document.createElement('style');
        style.id = 'successMessageAnimations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to   { transform: translateX(0);    opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0);    opacity: 1; }
                to   { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ================== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ==================

const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    // восстановление сохранённой темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('theme--dark');
        themeToggle.classList.add('theme-toggle--dark');
        themeToggle.textContent = 'Светлая тема';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme--dark');

        if (isDark) {
            themeToggle.classList.add('theme-toggle--dark');
            themeToggle.textContent = 'Светлая тема';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.classList.remove('theme-toggle--dark');
            themeToggle.textContent = 'Тёмная тема';
            localStorage.setItem('theme', 'light');
        }
    });
}
