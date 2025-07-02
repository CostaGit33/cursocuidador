document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Scroll: header e parallax
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        const heroBg = document.querySelector('.hero-background');
        if (heroBg) {
            heroBg.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
        }

        updateScrollProgress();
        handleScrollAnimation();
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = header ? header.offsetHeight : 0;
                const top = target.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer para animações
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('feature-card') || entry.target.classList.contains('modulo-card')) {
                    const index = [...entry.target.parentElement.children].indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.feature-card, .modulo-card, .gallery-item').forEach(el => observer.observe(el));

    // Galeria (lightbox)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) createLightbox(img.src, img.alt);
        });
    });

    function createLightbox(src, alt = '') {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        const removeLightbox = () => {
            lightbox.remove();
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', escHandler);
        };

        const escHandler = (e) => {
            if (e.key === 'Escape') removeLightbox();
        };

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                removeLightbox();
            }
        });

        document.addEventListener('keydown', escHandler);
    }

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const percent = (scrollTop / docHeight) * 100;
        let progress = document.querySelector('.scroll-progress');
        if (!progress) {
            progress = document.createElement('div');
            progress.className = 'scroll-progress';
            document.body.appendChild(progress);
        }
        progress.style.width = `${percent}%`;
    }

    // Efeito máquina de escrever
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const original = heroTitle.textContent.trim();
        heroTitle.textContent = '';
        let i = 0;
        const type = () => {
            if (i < original.length) {
                heroTitle.textContent += original.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        };
        setTimeout(type, 500);
    }

    // Floating elements
    function createFloatingElements() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        for (let i = 0; i < 6; i++) {
            const el = document.createElement('div');
            el.className = 'floating-element';
            el.style.cssText = `
                position: absolute;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random()}s;
            `;
            hero.appendChild(el);
        }
    }
    createFloatingElements();

    // Formulário
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            let isValid = true;
            form.querySelectorAll('input[required], textarea[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                showNotification('Mensagem enviada com sucesso!', 'success');
                form.reset();
            } else {
                showNotification('Preencha todos os campos obrigatórios.', 'error');
            }
        });
    });

    function showNotification(msg, type) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.textContent = msg;
        notif.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 1rem 2rem; border-radius: 5px;
            color: white; z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notif.style.transform = 'translateX(100%)';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // Lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                obs.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => lazyObserver.observe(img));

    // Scroll-animate
    const scrollElements = document.querySelectorAll('.scroll-animate');
    function elementInView(el, divisor = 1) {
        const top = el.getBoundingClientRect().top;
        return top <= (window.innerHeight || document.documentElement.clientHeight) / divisor;
    }
    function handleScrollAnimation() {
        scrollElements.forEach(el => {
            if (elementInView(el)) {
                el.classList.add('scrolled');
            } else {
                el.classList.remove('scrolled');
            }
        });
    }
});
