document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт подключен и работает!');
    
    // 1. Обработка кнопки в шапке
    const appointmentBtn = document.getElementById('nav__Button');
    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке записи на прием');
            // Здесь будет открытие модального окна
        });
    }
    
    // 2. Обработка формы обратного звонка
    const callbackBtn = document.getElementById('tel_Button');
    if (callbackBtn) {
        callbackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneInput = document.getElementById('telephone');
            if (phoneInput && phoneInput.value) {
                console.log('Запрос обратного звонка на номер:', phoneInput.value);
                // Здесь будет отправка данных на сервер
                alert('Спасибо! Мы вам перезвоним в ближайшее время.');
                phoneInput.value = '';
            } else {
                alert('Пожалуйста, введите ваш телефон');
            }
        });
    }
    
    // 3. Фиксированная шапка при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 4. Обработка карточек врачей
    const doctorCards = document.querySelectorAll('.docktor__card');
    doctorCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Выбрана карточка врача:', this.querySelector('h3').textContent);
            // Здесь будет логика открытия подробной информации
        });
    });
    
    // 5. Валидация формы записи
    const appointmentForm = document.querySelector('form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('title').value;
            const phone = document.getElementById('num_tel').value;
            
            if (name && phone) {
                console.log('Форма записи:', {name, phone});
                // Здесь будет отправка данных на сервер
                alert('Запись оформлена! Мы свяжемся с вами для подтверждения.');
                this.reset();
            } else {
                alert('Пожалуйста, заполните все поля');
            }
        });
    }
    
    console.log('Инициализация завершена');
});