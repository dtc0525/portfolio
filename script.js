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

        // Form submission handler
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });

        // Active nav link highlighting
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

function openModal() {
    document.getElementById('resumeModal').classList.add('active');
}

function closeModal() {
    document.getElementById('resumeModal').classList.remove('active');
}

// Close modal when clicking outside the content
window.onclick = function(event) {
    const modal = document.getElementById('resumeModal');
    if (event.target === modal) {
        closeModal();
    }
}