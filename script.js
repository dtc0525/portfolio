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
        link.style.color = '#272622';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = '#8c492f';
        }
    });
});

document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.sendForm(
        "service_as1d2v7",
        "template_eehbtkt",
        this
    ).then(() => {
        alert("Message sent successfully!");
        this.reset();
    }, (error) => {
        alert("Failed to send message. Please try again.");
        console.error(error);
    });
});

class ProjectsCarousel {
    constructor() {
        this.currentIndex = 0;
        this.projectCards = document.querySelectorAll('.project-card');
        this.totalProjects = this.projectCards.length;
        this.cardsPerView = this.getCardsPerView();
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
        this.updateCarousel();
    }
    
    createCarouselStructure() {
        const projectsGrid = document.querySelector('.projects-grid');
        
        // Wrap existing grid in carousel container
        const carouselTrack = document.createElement('div');
        carouselTrack.className = 'carousel-track';
        
        // Move all project cards into the track
        while (projectsGrid.firstChild) {
            carouselTrack.appendChild(projectsGrid.firstChild);
        }
        
        projectsGrid.appendChild(carouselTrack);
        projectsGrid.classList.add('carousel-container');
    }
    
    createControls() {
        const projectsSection = document.querySelector('#projects');
        const projectsGrid = document.querySelector('.projects-grid');
        
        // Create a wrapper div for controls and dots
        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'carousel-controls-wrapper';
        
        // Create navigation buttons with Font Awesome icons
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
        
        // Insert controls wrapper right after the projects grid
        projectsGrid.parentNode.insertBefore(controlsWrapper, projectsGrid.nextSibling);
        
        // Create dots
        this.createDots();
        
        // Add event listeners
        document.querySelector('.prev-btn').addEventListener('click', () => {
            this.prev();
            this.resetAutoplay();
        });
        document.querySelector('.next-btn').addEventListener('click', () => {
            this.next();
            this.resetAutoplay();
        });
        
        // Add keyboard navigation
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

        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => this.stopAutoplay());
        carouselContainer.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    createDots() {
        const dotsContainer = document.querySelector('.carousel-dots');
        const totalDots = this.totalProjects - this.cardsPerView + 1;
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    updateCarousel() {
        const track = document.querySelector('.carousel-track');
        const cardWidth = 100 / this.cardsPerView;
        const offset = -(this.currentIndex * cardWidth);
        track.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        const totalDots = this.totalProjects - this.cardsPerView + 1;
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    next() {
        const maxIndex = this.totalProjects - this.cardsPerView;
        
        // Loop back to start when reaching the end
        if (this.currentIndex >= maxIndex) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        this.updateCarousel();
    }
    
    prev() {
        const maxIndex = this.totalProjects - this.cardsPerView;
        
        // Loop to end when at the start
        if (this.currentIndex <= 0) {
            this.currentIndex = maxIndex;
        } else {
            this.currentIndex--;
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
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
                const newCardsPerView = this.getCardsPerView();
                if (newCardsPerView !== this.cardsPerView) {
                    this.cardsPerView = newCardsPerView;
                    this.currentIndex = 0;
                    this.createDots();
                    this.updateCarousel();
                }
            }, 250);
        });
    }
}

// Initialize carousel when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure everything is rendered
    setTimeout(() => {
        new ProjectsCarousel();
    }, 100);
});