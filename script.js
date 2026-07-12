var typed = new Typed("#typing", {
    strings: [
        "Computer Science Graduate",
        "Aspiring Front-End Developer",
        "UI/UX Design Enthusiast",
        "Open to Entry-Level Opportunities"
    ],
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 1800,
    loop: true,
    showCursor: true,
    cursorChar: "|"
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {

            // Background wipe
            entry.target.classList.add("wipe-active");

            // Typing animation
            const typing = entry.target.querySelector(".typing");

            if (typing) {

                if (typing._typed) {
                    typing._typed.destroy();
                }

                typing.textContent = "";

                typing._typed = new Typed(typing, {
                    strings: [typing.dataset.text],
                    typeSpeed: 150,
                    showCursor: false,
                    loop: false
                });
            }

        } else {

            // Reset background when leaving viewport
            entry.target.classList.remove("wipe-active");

        }

    });

}, {
    threshold: 0.4
});

document.querySelectorAll(".animate-section").forEach(section => {
    observer.observe(section);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '#1f1a3d';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = '#6a0dad';
        }
    });
});



class ProjectsCarousel {
    constructor() {
        this.projectCards = Array.from(document.querySelectorAll('.project-card'));
        this.totalProjects = this.projectCards.length;
        this.cardsPerView = this.getCardsPerView();

        this.realIndex = 0;        // which real card is currently "first", for the dots
        this.isAnimating = false;
        this.transitionDuration = 500; // ms, must match the transitions set below

        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds

        this.init();
        this.setupResponsive();
        this.startAutoplay();
    }

    getCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }

    init() {
        this.createCarouselStructure();
        this.createControls();
        this.track = document.querySelector('.carousel-track');
        this.track.style.transform = 'translateX(0)';
    }

    createCarouselStructure() {
        const projectsGrid = document.querySelector('.projects-grid');

        const carouselTrack = document.createElement('div');
        carouselTrack.className = 'carousel-track';

        while (projectsGrid.firstChild) {
            carouselTrack.appendChild(projectsGrid.firstChild);
        }

        projectsGrid.appendChild(carouselTrack);
        projectsGrid.classList.add('carousel-container');
    }

    createControls() {
        const projectsGrid = document.querySelector('.projects-grid');

        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'carousel-controls-wrapper';

        controlsWrapper.innerHTML = `
            <div class="carousel-controls">
                <button class="carousel-btn prev-btn" aria-label="Previous">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-btn next-btn" aria-label="Next">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="carousel-dots"></div>
        `;

        projectsGrid.parentNode.insertBefore(controlsWrapper, projectsGrid.nextSibling);

        this.createDots();

        document.querySelector('.prev-btn').addEventListener('click', () => {
            this.prev();
            this.resetAutoplay();
        });
        document.querySelector('.next-btn').addEventListener('click', () => {
            this.next();
            this.resetAutoplay();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
                this.resetAutoplay();
            }
            if (e.key === 'ArrowRight') {
                this.next();
                this.resetAutoplay();
            }
        });

        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => this.stopAutoplay());
        carouselContainer.addEventListener('mouseleave', () => this.startAutoplay());
    }

    createDots() {
        const dotsContainer = document.querySelector('.carousel-dots');
        dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalProjects; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
        this.updateDots();
    }

    updateDots() {
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.realIndex);
        });
    }

    getCardWidth() {
        const card = this.track.children[0];
        const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
        return card.offsetWidth + gap;
    }

    // Slide forward one card, then permanently move the card that scrolled
    // out of view (now offscreen left) to the end of the track and reset
    // the transform to 0. Because that reset happens with transitions off,
    // and the moved card lands exactly where the animation left off, there
    // is nothing to visibly "snap" — it's a genuine infinite loop.
    next() {
        if (this.isAnimating || this.totalProjects <= 1) return;
        this.isAnimating = true;

        const cardWidth = this.getCardWidth();
        this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
        this.track.style.transform = `translateX(-${cardWidth}px)`;

        this.realIndex = (this.realIndex + 1) % this.totalProjects;
        this.updateDots();

        setTimeout(() => {
            const first = this.track.firstElementChild;
            this.track.appendChild(first);

            this.track.style.transition = 'none';
            this.track.style.transform = 'translateX(0)';
            // Force layout flush so this instant reset is committed now,
            // before any future call re-enables the transition.
            this.track.getBoundingClientRect();

            this.isAnimating = false;
        }, this.transitionDuration);
    }

    // Mirror image of next(): move the last card to the front first, offset
    // the transform instantly so nothing visibly moves yet, then animate
    // back to 0 — which slides that card into view from the left.
    prev() {
        if (this.isAnimating || this.totalProjects <= 1) return;
        this.isAnimating = true;

        const cardWidth = this.getCardWidth();
        const last = this.track.lastElementChild;
        this.track.insertBefore(last, this.track.firstElementChild);

        this.track.style.transition = 'none';
        this.track.style.transform = `translateX(-${cardWidth}px)`;
        this.track.getBoundingClientRect(); // flush before animating

        requestAnimationFrame(() => {
            this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
            this.track.style.transform = 'translateX(0)';
        });

        this.realIndex = (this.realIndex - 1 + this.totalProjects) % this.totalProjects;
        this.updateDots();

        setTimeout(() => {
            this.isAnimating = false;
        }, this.transitionDuration);
    }

    // Jump directly to a given real slide by rotating the DOM order instantly
    // (no slide animation, matching typical dot-click behavior).
    goToSlide(targetIndex) {
        if (this.isAnimating || targetIndex === this.realIndex) return;
        this.isAnimating = true;

        const diff = (targetIndex - this.realIndex + this.totalProjects) % this.totalProjects;
        for (let i = 0; i < diff; i++) {
            this.track.appendChild(this.track.firstElementChild);
        }

        this.track.style.transition = 'none';
        this.track.style.transform = 'translateX(0)';
        this.track.getBoundingClientRect();

        this.realIndex = targetIndex;
        this.updateDots();

        this.isAnimating = false;
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.cardsPerView = this.getCardsPerView();
                // Card width is measured live on every move, so no
                // structural rebuild is needed on resize anymore.
            }, 250);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ProjectsCarousel();
    }, 100);
});