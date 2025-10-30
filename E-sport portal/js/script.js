

document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const nav = document.querySelector('header nav ul');

    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burgerMenu.classList.toggle('toggle');
        });
    }

    // Carousel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const container = carousel.querySelector('.carousel-container');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-control.prev');
        const nextBtn = carousel.querySelector('.carousel-control.next');
        let currentIndex = 0;
        const totalItems = items.length;

        function updateCarousel() {
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentIndex) {
                    item.classList.add('active');
                }
            });
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', showNext);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', showPrev);
        }

        // Auto-play
        setInterval(showNext, 7000); // Menja slajd svake 7 sekunde
    }

    // --- Najposecenije stranice ---

    const trackAndSortLinks = () => {
        const pages = [
            { path: 'index.html', title: 'Početna' },
            { path: 'tournaments.html', title: 'Turniri' },
            { path: 'gallery.html', title: 'Galerija' },
            { path: 'about.html', title: 'O nama' },
            { path: 'contact.html', title: 'Kontakt' }
        ];

        // 1. Pracenje poseta
        let pageVisits = JSON.parse(localStorage.getItem('pageVisits')) || {};
        const currentPagePath = window.location.pathname.split('/').pop() || 'index.html';

        // Inicijalizacija broja poseta
        pages.forEach(page => {
            if (!pageVisits[page.path]) {
                pageVisits[page.path] = { count: 0, title: page.title, path: page.path };
            }
        });

        // Increment za trenutnu stranicu
        if (pageVisits[currentPagePath]) {
            pageVisits[currentPagePath].count++;
        }
        
        localStorage.setItem('pageVisits', JSON.stringify(pageVisits));

        // 2. Azuriranje brzih linkova
        const quickLinksList = document.getElementById('quick-links-list');
        if (quickLinksList) {
            const allLinks = Object.values(pageVisits);
            
            // Sortiranje linkova
            const sortedLinks = allLinks.sort((a, b) => b.count - a.count);

            quickLinksList.innerHTML = ''; 

            sortedLinks.forEach(linkInfo => {
                const li = document.createElement('li');
                if (linkInfo && linkInfo.path && linkInfo.title) {
                    li.innerHTML = `<a href="${linkInfo.path}">${linkInfo.title} <span class="visit-count">(${linkInfo.count})</span></a>`;
                    quickLinksList.appendChild(li);
                }
            });
        }
    };

    trackAndSortLinks();


    // Validacija kontakne forme
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const imeInput = document.getElementById('ime');
        const prezimeInput = document.getElementById('prezime');
        const emailInput = document.getElementById('email');
        const lozinkaInput = document.getElementById('lozinka');
        const potvrdalozinkeInput = document.getElementById('potvrdalozinke');
        const porukaInput = document.getElementById('poruka');

        const imeError = document.getElementById('imeError');
        const prezimeError = document.getElementById('prezimeError');
        const emailError = document.getElementById('emailError');
        const lozinkaError = document.getElementById('lozinkaError');
        const potvrdalozinkeError = document.getElementById('potvrdalozinkeError');
        const porukaError = document.getElementById('porukaError');

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            let isValid = true;

            clearErrors();

            // Validacija imena
            if (!imeInput.value.trim()) {
                showError(imeInput, imeError, 'Ime je obavezno!');
                isValid = false;
            }

            // Validacija prezimena
            if (!prezimeInput.value.trim()) {
                showError(prezimeInput, prezimeError, 'Prezime je obavezno!');
                isValid = false;
            }

            // Validacija emaila
            if (!emailInput.value.trim()) {
                showError(emailInput, emailError, 'Email je obavezan!');
                isValid = false;
            } else if (!validateEmail(emailInput.value)) {
                showError(emailInput, emailError, 'Email adresa nije ispravna!');
                isValid = false;
            }

            // Validacija lozinke
            if (!validatePassword(lozinkaInput.value)) {
                showError(lozinkaInput, lozinkaError, 'Lozinka mora imati najmanje 6 karaktera, jedno veliko slovo i jedan broj.');
                isValid = false;
            }

            // Validacija potvrde lozinke
            if (lozinkaInput.value !== potvrdalozinkeInput.value) {
                showError(potvrdalozinkeInput, potvrdalozinkeError, 'Lozinke se ne podudaraju!');
                isValid = false;
            }

            // Validacija poruka
            if (!porukaInput.value.trim()) {
                showError(porukaInput, porukaError, 'Poruka je obavezna!');
                isValid = false;
            }

            if (isValid) {
                alert('Poruka je uspešno poslata!');
                contactForm.reset();
                clearErrors();
            }
        });

        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        function validatePassword(password) {
            // Minimum 6 karaktera, bar jedno veliko slovo i jedan broj
            const re = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
            return re.test(password);
        }

        function showError(input, errorElement, message) {
            if (errorElement) {
                errorElement.textContent = message;
            }
            input.style.borderColor = '#cf6679';
        }

        function clearErrors() {
            const inputs = [imeInput, prezimeInput, emailInput, lozinkaInput, potvrdalozinkeInput, porukaInput];
            const errors = [imeError, prezimeError, emailError, lozinkaError, potvrdalozinkeError, porukaError];
            
            inputs.forEach(input => {
                if (input) input.style.borderColor = '#333';
            });
            
            errors.forEach(error => {
                if (error) error.textContent = '';
            });
        }
    }
});
