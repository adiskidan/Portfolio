// Portfolio JavaScript - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth Scrolling Navigation
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }
    
    // Active Navigation Link on Scroll
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        function updateActiveNav() {
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();
    }
    
    // Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animate skill bars if they exist
                    if (entry.target.classList.contains('skills-grid')) {
                        animateSkills();
                    }
                }
            });
        }, observerOptions);
        
        // Elements to animate
        const animateElements = document.querySelectorAll('.service-card, .project-item, .skill-item, .contact-item');
        animateElements.forEach(el => observer.observe(el));
        
        // Animate sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));
    }
    
    // Animate Skills Progress
    function animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.transform = 'translateY(0)';
                skill.style.opacity = '1';
            }, index * 100);
        });
    }
    
    // Mobile Menu Toggle
    function initMobileMenu() {
        // Create mobile menu button
        const header = document.querySelector('header .container');
        const mobileMenuBtn = document.createElement('div');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        header.appendChild(mobileMenuBtn);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    function toggleMobileMenu() {
        const nav = document.querySelector('nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        nav.classList.toggle('mobile-active');
        mobileBtn.classList.toggle('active');
    }
    
    function closeMobileMenu() {
        const nav = document.querySelector('nav');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav && mobileBtn) {
            nav.classList.remove('mobile-active');
            mobileBtn.classList.remove('active');
        }
    }
    
    // Header Scroll Effect
    function initHeaderScroll() {
        const header = document.querySelector('header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // Typing Animation for Hero Text
    function initTypingAnimation() {
        const heroTitle = document.querySelector('.hero-text h1');
        const heroSubtitle = document.querySelector('.hero-text h2');
        
        if (heroTitle && heroSubtitle) {
            const titleText = heroTitle.textContent;
            const subtitleText = heroSubtitle.textContent;
            
            heroTitle.textContent = '';
            heroSubtitle.textContent = '';
            
            // Animate title
            typeWriter(heroTitle, titleText, 100);
            
            // Animate subtitle after title completes
            setTimeout(() => {
                typeWriter(heroSubtitle, subtitleText, 50);
            }, titleText.length * 100 + 500);
        }
    }
    
    function typeWriter(element, text, speed) {
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Parallax Effect for Hero Background
    function initParallaxEffect() {
        const heroSection = document.querySelector('#home');
        const digitalBg = document.querySelector('.digital-bg');
        const csBg = document.querySelector('.cs-bg');
        
        if (heroSection && digitalBg) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                
                if (digitalBg) {
                    digitalBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                }
                
                if (csBg) {
                    csBg.style.transform = `translateY(${scrolled * parallaxSpeed * 0.3}px)`;
                }
            });
        }
    }
    
    // Interactive Hover Effects
    function initInteractiveEffects() {
        // Service cards tilt effect
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
        
        // Project cards hover effect
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.querySelector('.project-link').style.transform = 'translateX(10px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.querySelector('.project-link').style.transform = 'translateX(0)';
            });
        });
    }
    
    // Form Validation (if contact form is added later)
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Add form validation logic here
                console.log('Form submitted');
            });
        });
    }
    
    // Loading Animation
    function initLoadingAnimation() {
        document.body.classList.add('loading');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.remove('loading');
                // Start animations after load
                startProgressBars();
                animateCounters();
            }, 500);
        });
    }
    
    // Progress Bars for Skills
    function startProgressBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((skill, index) => {
            const progress = skill.getAttribute('data-progress') || '85';
            const progressBar = document.createElement('div');
            progressBar.className = 'skill-progress';
            progressBar.style.width = '0%';
            
            const progressBg = document.createElement('div');
            progressBg.className = 'skill-progress-bg';
            progressBg.appendChild(progressBar);
            
            skill.appendChild(progressBg);
            
            setTimeout(() => {
                progressBar.style.width = progress + '%';
            }, 100 + (index * 100));
        });
    }
    
    // Animated Counters
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // Scroll Progress Indicator
    function initScrollIndicator() {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        document.body.appendChild(scrollIndicator);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollIndicator.style.width = scrollPercent + '%';
        });
    }
    
    // Theme Toggle
    function initThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        
        document.querySelector('header .container').appendChild(themeToggle);
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            icon.className = document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
            
            // Save theme preference
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }
    }
    
    // Back to Top Button
    function initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Cursor Trail Effect
    function initCursorTrail() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-trail';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.classList.add('clicked');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('clicked');
        });
    }
    
    // Initialize all functions
    function init() {
        initSmoothScrolling();
        initActiveNavigation();
        initScrollAnimations();
        initMobileMenu();
        initHeaderScroll();
        initTypingAnimation();
        initParallaxEffect();
        initInteractiveEffects();
        initFormValidation();
        initLoadingAnimation();
        initScrollIndicator();
        initThemeToggle();
        initBackToTop();
        initCursorTrail();
    }
    
    // Start the application
    init();
    
    // Utility functions
    window.portfolioUtils = {
        scrollToTop: function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        
        animateElement: function(element, animation) {
            element.style.animation = animation;
        },
        
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };
    
    // Performance optimization
    const debouncedScroll = portfolioUtils.debounce(function() {
        // Add scroll-related performance optimizations here
    }, 10);
    
    window.addEventListener('scroll', debouncedScroll);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    console.log('Portfolio initialized successfully!');
});