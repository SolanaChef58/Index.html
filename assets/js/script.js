// script.js
document.addEventListener('DOMContentLoaded', () => {
    initializeObserver();
    initializeMobileMenu();
    initializeDarkMode();
});

function initializeObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('counter')) animateCounter(entry.target);
                if (entry.target.classList.contains('progress')) animateProgress(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.milestone, .card, .counter, .progress')
        .forEach(el => observer.observe(el));
}

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuToggle?.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu?.contains(e.target) && !menuToggle?.contains(e.target)) {
            mobileMenu?.classList.remove('active');
            menuToggle?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function initializeDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const toggleDarkMode = (e) => document.body.classList.toggle('dark-mode', e.matches);
    prefersDark.addListener(toggleDarkMode);
    toggleDarkMode(prefersDark);
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / duration * 10;
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        element.textContent = Math.floor(current);

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 10);
}

function animateProgress(element) {
    element.style.width = `${element.dataset.target}%`;
}

function copyAddress() {
    const address = '3gC8oidaJ61fkB2QCYvm9xKMZG8szBgBMbuLAGgNeGJD';
    navigator.clipboard.writeText(address).then(() => {
        const button = document.querySelector('.copy-button');
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}
