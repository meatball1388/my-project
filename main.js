// Модальное окно
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

if (openBtn && dlg) {
    openBtn.addEventListener('click', () => {
        lastActive = document.activeElement;
        dlg.showModal();
        dlg.querySelector('input, select, textarea, button')?.focus();
    });
}

if (closeBtn && dlg) {
    closeBtn.addEventListener('click', () => dlg.close('cancel'));
}

if (dlg) {
    dlg.addEventListener('close', () => { 
        lastActive?.focus(); 
    });
}

// Валидация формы
if (form) {
    form.addEventListener('submit', (e) => {
        // 1) Сброс кастомных сообщений
        [...form.elements].forEach(el => el.setCustomValidity?.(''));

        // 2) Проверка встроенных ограничений
        if (!form.checkValidity()) {
            e.preventDefault();

            // Пример: таргетированное сообщение
            const email = form.elements.email;
            if (email?.validity.typeMismatch) {
                email.setCustomValidity('Введите корректный e-mail, например name@example.com');
            }

            form.reportValidity();

            // Ally: подсветка проблемных полей
            [...form.elements].forEach(el => {
                if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
            });
            return;
        }

        // 3) Успешная «отправка» (без сервера)
        e.preventDefault();
        // Если форма внутри <dialog>, закрываем окно:
        if (dlg) {
            dlg.close('success');
        }
        form.reset();
        alert('Сообщение отправлено!');
    });
}

// Маска телефона (дополнительно)
const phone = document.getElementById('phone');
if (phone) {
    phone.addEventListener('input', () => {
        const digits = phone.value.replace(/\D/g,'').slice(0,11);
        const d = digits.replace(/^8/, '7');
        const parts = []
        if (d.length > 0) parts.push('+7');
        if (d.length > 1) parts.push(' (' + d.slice(1,4));
        if (d.length >= 4) parts[parts.length - 1] += ')';
        if (d.length >= 5) parts.push(' ' + d.slice(4,7));
        if (d.length >= 8) parts.push('-' + d.slice(7,9));
        if (d.length >= 10) parts.push('-' + d.slice(9,11));
        phone.value = parts.join('');
    });
}
// В конец файла main.js добавь:

// Дополнительная логика для страницы контактов
if (form && window.location.pathname.includes('contacts')) {
    form.addEventListener('submit', (e) => {
        // ... существующая логика валидации ...
        
        // Заменить alert на более красивое сообщение
        if (dlg && form.checkValidity()) {
            e.preventDefault();
            dlg.close('success');
            form.reset();
            
            // Показать уведомление об успехе
            showSuccessMessage('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
        }
    });
}

// Функция для красивого уведомления
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
    
    // Убрать уведомление через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// CSS анимации через JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
