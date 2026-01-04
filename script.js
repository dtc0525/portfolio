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


// EmailJS initialization
emailjs.init('rGE8Y48VVhPgOf0ga');

// Form submission handler with EmailJS
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('.submit-btn');
    const status = document.getElementById('formStatus');
    
    btn.textContent = 'Sending...';
    btn.disabled = true;
    status.textContent = '';
    
    // Send the form
    emailjs.sendForm('service_as1d2v7', 'template_eehbtkt', this)
        .then(function() {
            status.textContent = 'Message sent successfully!';
            status.style.color = 'green';
            document.getElementById('contactForm').reset();
        }, function(error) {
            status.textContent = 'Failed to send message. Please try again.';
            status.style.color = 'red';
            console.error('EmailJS error:', error);
        })
        .finally(function() {
            btn.textContent = 'Send Message';
            btn.disabled = false;
        });
});