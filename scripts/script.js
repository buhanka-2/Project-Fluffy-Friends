/**
 * ГЛАВНЫЙ СКРИПТ ВЕТЕРИНАРНОЙ КЛИНИКИ "ПУШИСТЫЕ ДРУЗЬЯ"
 * 
 * Алгоритм работы модального окна записи:
 * 1. Пользователь нажимает кнопку "Запись на прием"
 * 2. Система открывает модальное окно с формой
 * 3. Пользователь заполняет данные
 * 4. При отправке:
 *    - Если данные не заполнены → показать ошибку
 *    - Если данные валидны → "отправить" данные
 *    - Показать сообщение об успехе
 *    - Закрыть модальное окно
 * 
 * 
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Загрузка данных
    setTimeout(() => {
        loadDoctorsData();
        initForms();
    }, 1500);

    // Инициализация форм с LocalStorage
    function initForms() {
        // Форма обратного звонка
        const callbackForm = {
            phoneInput: document.getElementById('telephone'),
            button: document.getElementById('tel_Button')
        };

        // Форма записи на прием
        const appointmentForm = document.querySelector('form');
        
        // Восстановление данных из LocalStorage
        if (localStorage.getItem('callbackPhone')) {
            callbackForm.phoneInput.value = localStorage.getItem('callbackPhone');
        }

        // Обработчик формы обратного звонка
        if (callbackForm.button) {
            callbackForm.button.addEventListener('click', function(e) {
                e.preventDefault();
                const phone = callbackForm.phoneInput.value.trim();
                
                if (phone) {
                    if (validatePhone(phone)) {
                        // Сохраняем в LocalStorage
                        localStorage.setItem('callbackPhone', phone);
                        
                        console.log('Запрос обратного звонка на номер:', phone);
                        alert('Спасибо! Мы вам перезвоним в ближайшее время.');
                    } else {
                        alert('Пожалуйста, введите корректный номер телефона');
                    }
                } else {
                    alert('Пожалуйста, введите ваш телефон');
                }
            });
        }

        // Обработчик формы записи
        if (appointmentForm) {
            // Восстановление данных
            if (localStorage.getItem('appointmentName')) {
                document.getElementById('title').value = localStorage.getItem('appointmentName');
            }
            if (localStorage.getItem('appointmentPhone')) {
                document.getElementById('num_tel').value = localStorage.getItem('appointmentPhone');
            }

            appointmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('title').value.trim();
                const phone = document.getElementById('num_tel').value.trim();
                let isValid = true;
                
                // Валидация
                if (!name) {
                    document.getElementById('title').style.borderColor = 'red';
                    isValid = false;
                } else {
                    document.getElementById('title').style.borderColor = '#ddd';
                    localStorage.setItem('appointmentName', name);
                }
                
                if (!validatePhone(phone)) {
                    document.getElementById('num_tel').style.borderColor = 'red';
                    isValid = false;
                } else {
                    document.getElementById('num_tel').style.borderColor = '#ddd';
                    localStorage.setItem('appointmentPhone', phone);
                }
                
                if (isValid) {
                    // Сохраняем все данные
                    const appointmentData = {
                        name,
                        phone,
                        timestamp: new Date().toISOString()
                    };
                    
                    // Получаем существующие записи или создаем новый массив
                    const appointments = JSON.parse(localStorage.getItem('appointments') || []);
                    appointments.push(appointmentData);
                    localStorage.setItem('appointments', JSON.stringify(appointments));
                    
                    alert(`Спасибо, ${name.split(' ')[0]}! Запись оформлена.`);
                    closeModal();
                } else {
                    alert('Пожалуйста, заполните все поля корректно!');
                }
            });
        }
    }

    // Функция загрузки данных о врачах с инициализацией Swiper
    function loadDoctorsData() {
        fetch('data/data.json')
            .then(response => response.json())
            .then(data => {
                // Инициализация Swiper после загрузки данных
                // Инициализация Swiper
                const swiper = new Swiper('.doctorsSwiper', {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        }
                    }
                });

                // Добавление карточек врачей
                const swiperWrapper = document.querySelector('.swiper-wrapper');
                
                doctorsData.forEach(doctor => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.innerHTML = `
                        <h3>${doctor.name}</h3>
                        <p>${doctor.position}</p>
                        <img src="${doctor.photo}" alt="${doctor.name}" class="doctor-photo">
                    `;
                    
                    swiperWrapper.appendChild(slide);
                });

                // Обновляем Swiper после добавления слайдов
                swiper.update();
            });
    }

    // ========== 1. Инициализация переменных ==========
    const DOM = {
        appointmentBtn: document.getElementById('nav__Button'),
        callbackBtn: document.getElementById('tel_Button'),
        phoneInput: document.getElementById('telephone'),
        header: document.querySelector('.header'),
        doctorCards: document.querySelectorAll('.docktor__card'),
        appointmentForm: document.querySelector('form'),
        nameInput: document.getElementById('title'),
        phoneFormInput: document.getElementById('num_tel')
    };
    
    // Создаем элементы для модального окна
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
    
    
    // ========== 2. Функции ==========
    
    /**
     * Открывает модальное окно записи
     * @param {string} doctorName - Имя врача для записи (опционально)
     */
    function openAppointmentModal(doctorName = '') {
        if (doctorName) {
            DOM.nameInput.value = `Запись к ${doctorName}`;
        }
        DOM.appointmentForm.style.display = 'block';
        modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('Открыто модальное окно записи');
    }
    
    /** Закрывает модальное окно */
    function closeModal() {
        DOM.appointmentForm.style.display = 'none';
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
        console.log('Модальное окно закрыто');
    }
    
    /** Валидация телефонного номера */
    function validatePhone(phone) {
        const regex = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
        return regex.test(phone);
    }
    
    /** Плавный скролл к верху страницы */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // ========== 3. Обработчики событий ==========
    
    // 3.1. Кнопка записи в шапке
    if (DOM.appointmentBtn) {
        DOM.appointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openAppointmentModal();
        });
    }
    
    // 3.2. Форма обратного звонка
    if (DOM.callbackBtn) {
        DOM.callbackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (DOM.phoneInput && DOM.phoneInput.value) {
                if (validatePhone(DOM.phoneInput.value)) {
                    console.log('Запрос обратного звонка на номер:', DOM.phoneInput.value);
                    alert('Спасибо! Мы вам перезвоним в ближайшее время.');
                    DOM.phoneInput.value = '';
                } else {
                    alert('Пожалуйста, введите корректный номер телефона');
                }
            } else {
                alert('Пожалуйста, введите ваш телефон');
            }
        });
    }
    
    // 3.3. Фиксированная шапка при скролле
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
        
        // Показываем/скрываем кнопку "вверх"
        toggleScrollTopButton();
    });
    
    // 3.4. Карточки врачей
    DOM.doctorCards.forEach(card => {
        card.addEventListener('click', function() {
            const doctorName = this.querySelector('h3').textContent;
            console.log('Выбрана карточка врача:', doctorName);
            openAppointmentModal(doctorName);
        });
    });
    
    // 3.5. Форма записи
    if (DOM.appointmentForm) {
        DOM.appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Валидация имени
            if (!DOM.nameInput.value.trim()) {
                DOM.nameInput.style.borderColor = 'red';
                isValid = false;
            } else {
                DOM.nameInput.style.borderColor = '#ddd';
            }
            
            // Валидация телефона
            if (!validatePhone(DOM.phoneFormInput.value)) {
                DOM.phoneFormInput.style.borderColor = 'red';
                isValid = false;
            } else {
                DOM.phoneFormInput.style.borderColor = '#ddd';
            }
            
            if (isValid) {
                console.log('Данные для отправки:', {
                    name: DOM.nameInput.value,
                    phone: DOM.phoneFormInput.value,
                    doctors: doctorsTitles
                });
                
                alert(`Спасибо, ${DOM.nameInput.value.split(' ')[0]}! Запись оформлена.`);
                closeModal();
                this.reset();
            } else {
                alert('Пожалуйста, заполните все поля корректно!');
            }
        });
    }
    
    // 3.6. Закрытие модального окна
    modalOverlay.addEventListener('click', closeModal);
    
    // 3.7. Кнопка скролла вверх
    const scrollTopBtn = createScrollTopButton();
    scrollTopBtn.addEventListener('click', scrollToTop);
    
    // ========== 4. Вспомогательные функции ==========
    
    /** Создает кнопку для скролла вверх */
    function createScrollTopButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '↑';
        btn.className = 'scroll-to-top';
        btn.style.display = 'none';
        document.body.appendChild(btn);
        return btn;
    }
    
    /** Показывает/скрывает кнопку скролла */
    function toggleScrollTopButton() {
        const btn = document.querySelector('.scroll-to-top');
        if (btn) {
            btn.style.display = window.scrollY > 300 ? 'block' : 'none';
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        // Находим все заголовки на странице
        const headings = document.querySelectorAll('h1, h2, h3');
        
        // Создаем массив с текстом заголовков
        const headingsArray = Array.from(headings).map(heading => heading.textContent.trim());
        
        // Выводим массив в консоль
        console.log('Массив заголовков:', headingsArray);
    });


    // ========== 5. Динамическое создание блока врачей ==========
    
    // Объект с данными врачей
    const doctorsData = {
        title: "Наши квалифицированные врачи",
        description: "3 ветеринарных специалиста",
        callToAction: "Вызвать врача",
        doctors: [
            {
                name: "Иванова Анна Петровна",
                position: "Главный ветеринарный врач",
                photo: "images/doctor1.jpg"
            },
            {
                name: "Смирнов Дмитрий Игоревич",
                position: "Ветеринарный врач-кардиолог",
                photo: "images/doctor2.jpg"
            },
            {
                name: "Кузнецова Елена Владимировна",
                position: "Ветеринарный врач-дерматолог",
                photo: "images/doctor3.jpg"
            }
        ]
    };

    // Функция для создания блока врачей
    function createDoctorsSection(data) {
        const doctorsSection = document.querySelector('.docktors');
        
        // Очищаем существующий контент
        doctorsSection.innerHTML = '';
        
        // Создаем заголовок
        const title = document.createElement('h1');
        title.className = 'docktors__title';
        title.textContent = data.title;
        doctorsSection.appendChild(title);
        
        // Создаем описание
        const description = document.createElement('p');
        description.textContent = data.description;
        doctorsSection.appendChild(description);
        
        // Добавляем горизонтальную линию
        doctorsSection.appendChild(document.createElement('hr'));
        
        // Создаем призыв к действию
        const cta = document.createElement('h2');
        cta.textContent = data.callToAction;
        doctorsSection.appendChild(cta);
        
        // Добавляем горизонтальную линию
        doctorsSection.appendChild(document.createElement('hr'));
        
        // Создаем контейнер для карточек врачей
        const doctorsContainer = document.createElement('div');
        doctorsContainer.className = 'container'; // Используем существующий класс container
        
        // Создаем карточки для каждого врача
        data.doctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'docktor__card';
            
            // Добавляем обработчик клика
            doctorCard.addEventListener('click', () => openAppointmentModal(doctor.name));
            
            // Заполняем карточку данными в соответствии с существующей структурой
            doctorCard.innerHTML = `
                <h3>${doctor.name}</h3>
                <p>${doctor.position}</p>
                <img src="${doctor.photo}" alt="${doctor.name}" style="max-width: 200px; border-radius: 8px;">
            `;
            
            doctorsContainer.appendChild(doctorCard);
        });
        
        doctorsSection.appendChild(doctorsContainer);
    }

    // Вызываем функцию создания блока врачей
    createDoctorsSection(doctorsData);
});