document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });

    // --- Typing Animation ---
    const textElements = ["Computer Science Student", "Machine Learning Enthusiast", "Web Developer"];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    const typingTextElement = document.querySelector('.typing-text');
    let isDeleting = false;

    function type() {
        if (count === textElements.length) {
            count = 0;
        }
        currentText = textElements[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        typingTextElement.textContent = letter;

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2; // Type faster when deleting
        }

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at the end
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }
    
    // Start typing
    setTimeout(type, 1000);

    // --- Scroll Events: Navbar, Progress, Back to Top, Active Sections ---
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.querySelector('.scroll-progress');
    const sections = document.querySelectorAll('section');

    // Active section highlight with IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => {
        sectionObserver.observe(sec);
    });

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                let scrollY = window.scrollY;
                
                // Sticky Navbar
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Back to top button
                if (scrollY > 500) {
                    backToTop.classList.add('active');
                } else {
                    backToTop.classList.remove('active');
                }

                // Scroll Progress Bar
                let totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                let progressHeight = (scrollY / totalHeight) * 100;
                progressBar.style.width = progressHeight + '%';

                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // --- Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    // Add base reveal class to all elements with data-reveal attribute
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Form Submission with SmtpJS ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.8';
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Send Email using SmtpJS
            Email.send({
                Host: "smtp.gmail.com",
                Username: "jsamyak787@gmail.com",
                Password: "moxa wnes pwrm lclq",
                To: "jsamyak787@gmail.com",
                From: "jsamyak787@gmail.com", // Gmail requires From to be the authenticated email, but we put the user's email in the body
                Subject: `Portfolio Contact: ${subject} - from ${name}`,
                Body: `<h3>New Message from Portfolio Website</h3>
                       <p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Subject:</strong> ${subject}</p>
                       <p><strong>Message:</strong><br>${message.replace(/\\n/g, '<br>')}</p>`
            }).then(
                function(response) {
                    if (response === 'OK') {
                        btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                        btn.style.background = '#00b894';
                        contactForm.reset();
                    } else {
                        btn.innerHTML = 'Failed to Send <i class="fas fa-times"></i>';
                        btn.style.background = '#d63031';
                        // SmtpJS might return an error message
                        console.error("Email Error:", response);
                        alert("There was an error sending your message. Please try again later.");
                    }
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.style.opacity = '1';
                    }, 4000);
                }
            );
        });
    }
});
