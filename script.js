document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.querySelector('.video-modal');
    const modalContent = document.querySelector('.video-container');
    const closeModal = document.querySelector('.close-modal');

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Portfolio item click handler
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.dataset.video;
            // Create VK video iframe
            const iframe = document.createElement('iframe');
            iframe.src = `https://vk.com/video_ext.php?oid=${videoId.split('_')[0]}&id=${videoId.split('_')[1]}&hd=4`;
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;';
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            
            modalContent.innerHTML = '';
            modalContent.appendChild(iframe);
            modal.style.display = 'block';
        });
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        modalContent.innerHTML = '';
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Добавляем задержку для последовательной анимации
                if (entry.target.classList.contains('partner')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.portfolio-item, .partner').forEach(el => {
        observer.observe(el);
    });

    // Переключение между горизонтальными и вертикальными видео
    const typeButtons = document.querySelectorAll('.portfolio-type-selector button');
    const portfolioGrids = document.querySelectorAll('.portfolio-grid');
    
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок и сеток
            typeButtons.forEach(btn => btn.classList.remove('active'));
            portfolioGrids.forEach(grid => grid.classList.remove('active'));
            
            // Добавляем активный класс выбранной кнопке и соответствующей сетке
            button.classList.add('active');
            const type = button.dataset.type;
            document.querySelector(`.portfolio-grid.${type}`).classList.add('active');
        });
    });

    // Анимация фонового текста при прокрутке
    const backgroundTexts = document.querySelectorAll('.background-text');

    window.addEventListener('scroll', () => {
        backgroundTexts.forEach(text => {
            const section = text.closest('section');
            const rect = section.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollPercent = 1 - (rect.top / window.innerHeight);
                const rotation = scrollPercent * 15;
                
                text.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${1 + scrollPercent * 0.2})`;
                text.style.opacity = Math.max(0.02, Math.min(0.04, 0.02 + scrollPercent * 0.02));
            }
        });
    });

    // Прокрутка фотографий
    const photosGrid = document.querySelector('.photos-grid');
    const prevBtn = document.querySelector('.scroll-btn.prev');
    const nextBtn = document.querySelector('.scroll-btn.next');

    if (prevBtn && nextBtn) {
        let isScrolling = false;
        let scrollTimeout;
        const getScrollAmount = () => {
            const photoItem = document.querySelector('.photo-item');
            if (!photoItem) return 0;
            // На мобильных устройствах прокручиваем по одной фотографии
            return window.innerWidth <= 768 ? 
                photoItem.offsetWidth + 16 : 
                (photoItem.offsetWidth + 16) * 2;
        };
        
        let scrollAmount = getScrollAmount();

        prevBtn.addEventListener('click', () => {
            if (isScrolling) return;
            isScrolling = true;
            photosGrid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 500);
        });

        nextBtn.addEventListener('click', () => {
            if (isScrolling) return;
            isScrolling = true;
            photosGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 600); // Увеличиваем время анимации для более плавного перехода
        });

        // Обновляем scrollAmount при изменении размера окна
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                scrollAmount = getScrollAmount();
            }, 250);
        });
    }

    // Предзагрузка изображений
    const preloadImages = () => {
        const images = document.querySelectorAll('.photo-item img');
        images.forEach((img, index) => {
            if (index < 4) { // Загружаем только первые 4 изображения сразу
                img.loading = 'eager';
            }
        });
    };
    preloadImages();

    // Анимация счетчиков
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 секунды
        const steps = 50;
        const stepValue = target / steps;
        let current = 0;
        
        const updateCounter = () => {
            current += stepValue;
            if (current > target) current = target;
            counter.textContent = Math.round(current);
            
            if (current < target) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    };
    
    // Запускаем анимацию когда счетчики появляются в поле зрения
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));

    // Переключение между горизонтальными и вертикальными работами в дизайне
    const designTypeButtons = document.querySelectorAll('.design-type-selector button');
    const designGrids = document.querySelectorAll('.design-grid');
    
    designTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок и сеток
            designTypeButtons.forEach(btn => btn.classList.remove('active'));
            designGrids.forEach(grid => grid.classList.remove('active'));
            
            // Добавляем активный класс выбранной кнопке и соответствующей сетке
            button.classList.add('active');
            const type = button.dataset.type;
            document.querySelector(`.design-grid.${type}`).classList.add('active');
        });
    });
}); 