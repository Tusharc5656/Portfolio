document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        // Prevent scrolling when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 2. Sticky Navbar & Active Link Update on Scroll
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Update
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    const fadeElements = document.querySelectorAll('.fade-in-section, .reveal-on-scroll');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(
        entries,
        observer
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                entry.target.classList.add('revealed');
                
                // If it's a stat number, trigger count up
                if (entry.target.querySelector('.stat-number')) {
                    startCounter(entry.target);
                }
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // Stats Counter Function
    function startCounter(statCard) {
        const counters = statCard.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            if (counter.classList.contains('counted')) return;
            counter.classList.add('counted');
            
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let currentCount = 0;
            const updateCount = () => {
                currentCount += increment;
                if (currentCount < target) {
                    counter.innerText = Math.ceil(currentCount);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // 4. Form Submission with Email Redirect
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const btn = contactForm.querySelector('.submit-btn');
            const btnSpan = btn.querySelector('span');
            const originalText = btnSpan.textContent;
            
            // UI Feedback
            btnSpan.textContent = 'Redirecting to Email...';
            btn.classList.add('loading');
            btn.style.opacity = '0.7';

            // Construct mailto link
            const recipient = 'tushar2004sk@gmail.com';
            const subject = encodeURIComponent(`Portfolio Message from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

            // Redirect after a short delay for UX
            setTimeout(() => {
                window.location.href = mailtoLink;
                
                // Reset button state
                btnSpan.textContent = 'Opened Email Client!';
                btn.classList.remove('loading');
                btn.style.background = '#10b981'; // Success green
                btn.style.opacity = '1';
                contactForm.reset();

                setTimeout(() => {
                    btnSpan.textContent = originalText;
                    btn.style.background = ''; // reset to CSS variable
                }, 3000);
            }, 1000);
        });
    }


    // 5. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });

        // Hover effect for links and buttons
        const hoverables = document.querySelectorAll('a, button, .glass-card, input, textarea');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursorFollower.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                cursorFollower.classList.remove('hovering');
            });
        });

        // Bubble pop-out effect for About Me paragraphs
        const aboutParagraphs = document.querySelectorAll('.about-text p');
        aboutParagraphs.forEach(p => {
            p.addEventListener('mouseenter', () => {
                cursor.classList.add('bubble-active');
                cursorFollower.classList.add('bubble-active');
                p.classList.add('pop-out-text');
            });
            p.addEventListener('mouseleave', () => {
                cursor.classList.remove('bubble-active');
                cursorFollower.classList.remove('bubble-active');
                p.classList.remove('pop-out-text');
            });
        });
    }

    // 6. Scroll Progress indicator
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight * 100}%`;
            scrollProgress.style.width = scroll;
        });
    }

    // 7. Spotlight & 3D Tilt Effect
    const interactiveCards = document.querySelectorAll('.glass-card, .project-card, .stat-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt Logic
            if (card.hasAttribute('data-tilt')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card.hasAttribute('data-tilt')) {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            }
        });
    });

    // 8. Typewriter Effect
    class TypeWriter {
        constructor(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.tick();
            this.isDeleting = false;
        }
        tick() {
            let i = this.loopNum % this.toRotate.length;
            let fullTxt = this.toRotate[i];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

            let that = this;
            let delta = 200 - Math.random() * 100;

            if (this.isDeleting) { delta /= 2; }

            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.loopNum++;
                delta = 500;
            }

            setTimeout(function() {
                that.tick();
            }, delta);
        }
    }

    const elements = document.getElementsByClassName('typewrite');
    for (let i = 0; i < elements.length; i++) {
        let toRotate = elements[i].getAttribute('data-type');
        let period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TypeWriter(elements[i], JSON.parse(toRotate), period);
        }
    }

    // 9. Generate Animated Background Stars
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        const starCount = 80;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random properties for continuous flowing live stars
            const size = Math.random() * 2.5 + 0.8; // slightly larger
            const left = Math.random() * 120; // 0% to 120%
            const top = Math.random() * 120; // start slightly lower
            const duration = Math.random() * 10 + 8; // 8s to 18s moving upward
            const delay = Math.random() * -20; // negative delay to pre-fill screen
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;
            star.style.setProperty('--duration', `${duration}s`);
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
    }

    // 10. Certificate Modal Logic
    const certCards = document.querySelectorAll('.cert-card');
    const certModal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    if (certCards.length > 0 && certModal && modalImg) {
        certCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // If the click is on the "Official Credential" link, don't open modal
                if (e.target.closest('.cert-link-btn')) return;
                
                const imgSrc = card.getAttribute('data-cert');
                modalImg.src = imgSrc;
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        const closeModal = () => {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 10.5 Iframe Modal Logic for Live Projects
    const liveBtns = document.querySelectorAll('.live-demo-btn');
    const iframeModal = document.getElementById('iframe-modal');
    const projectIframe = document.getElementById('project-iframe');

    if (liveBtns.length > 0 && iframeModal && projectIframe) {
        liveBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const url = btn.getAttribute('data-live');
                if (url && url !== '#') {
                    projectIframe.src = url;
                    iframeModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeIframeModal = () => {
            iframeModal.classList.remove('active');
            projectIframe.src = ''; // Clear src to stop video/audio if any
            document.body.style.overflow = '';
        };

        const iframeModalClose = iframeModal.querySelector('.modal-close');
        const iframeModalBackdrop = iframeModal.querySelector('.modal-backdrop');

        if (iframeModalClose) iframeModalClose.addEventListener('click', closeIframeModal);
        if (iframeModalBackdrop) iframeModalBackdrop.addEventListener('click', closeIframeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && iframeModal.classList.contains('active')) {
                closeIframeModal();
            }
        });
    }

    // 11. Magnetic Effect
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // 12. Copy to Clipboard
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.contact-method-card');
            const copyText = parent.querySelector('.copyable').getAttribute('data-copy');
            
            navigator.clipboard.writeText(copyText).then(() => {
                toast.classList.add('active');
                setTimeout(() => {
                    toast.classList.remove('active');
                }, 3000);
            });
        });
    });

    // 13. Back to Top
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Trigger scroll event on load to initialize active links/nav styling
    window.dispatchEvent(new Event('scroll'));
});
