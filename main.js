document.addEventListener('DOMContentLoaded', () => {
    // ------------------ Navbar Scroll Effect ------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ------------------ Mobile Menu Toggle ------------------
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileToggle.textContent = mobileNav.classList.contains('active') ? '✕' : '☰';
        });

        // Close mobile nav when clicking a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileToggle.textContent = '☰';
            });
        });
    }

    // ------------------ Intersection Observer for Fade-in ------------------
    const fadeElements = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Optional: stop observing once it has appeared
                // observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // ------------------ Active Link Logic ------------------
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === './')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// WhatsApp Animation Logic
document.addEventListener('DOMContentLoaded', () => {
    const waMockups = document.querySelectorAll('.wa-mockup-wrapper');
    
    if (waMockups.length === 0) return;

    function checkScroll() {
        waMockups.forEach(mockup => {
            if (mockup.dataset.animated === "true") return;
            const rect = mockup.getBoundingClientRect();
            // Start animation when the top of the mockup is inside the viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                mockup.dataset.animated = "true";
                startWaAnimation(mockup);
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    // Initial check in case it's already in view on load
    setTimeout(checkScroll, 500);
    
    function startWaAnimation(mockup) {
        const body = mockup.querySelector('.wa-body');
        if (!body) return;
        const msgs = body.querySelectorAll('.wa-msg');
        const typing = body.querySelector('.typing-indicator');
        
        // Setup initial times
        const now = new Date();
        let minutes = now.getMinutes();
        let hours = now.getHours();
        
        msgs.forEach((msg, index) => {
            const timeSpan = msg.querySelector('.wa-msg-time');
            if(timeSpan) {
                let m = minutes + Math.floor(index / 2);
                let h = hours;
                if(m >= 60) { m -= 60; h += 1; }
                const ampm = h >= 12 ? 'م' : 'ص';
                const h12 = h % 12 || 12;
                timeSpan.textContent = `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
            }
        });

        let currentMsg = 0;
        
        function showNext() {
            if (currentMsg >= msgs.length) {
                if (typing) typing.classList.remove('active');
                return;
            }
            
            const msg = msgs[currentMsg];
            const isAI = msg.classList.contains('ai');
            
            if (isAI && typing) {
                typing.classList.add('active');
                body.appendChild(typing); // move to bottom
                body.scrollTop = body.scrollHeight;
                
                setTimeout(() => {
                    typing.classList.remove('active');
                    displayMsg(msg);
                }, 1500); // AI thinks for 1.5s
            } else {
                if (typing) typing.classList.remove('active');
                displayMsg(msg);
            }
        }
        
        function displayMsg(msg) {
            msg.style.display = 'block';
            body.appendChild(msg); // move to bottom
            // trigger reflow
            void msg.offsetWidth;
            msg.classList.add('show');
            body.scrollTop = body.scrollHeight;
            
            currentMsg++;
            
            // Next message after a delay based on who sent it
            const delay = msg.classList.contains('user') ? 800 : 2000;
            setTimeout(showNext, delay);
        }
        
        // Start after a short delay
        setTimeout(showNext, 500);
    }
});
