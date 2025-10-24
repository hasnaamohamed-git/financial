// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to navigation links based on scroll position
    const sections = document.querySelectorAll('.section[id]');
    const navItems = document.querySelectorAll('.nav-menu a');

    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    // Throttled scroll event listener
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.objective-card, .viz-card, .finding-card, .stat-card, .application-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.objective-card, .viz-card, .finding-card, .stat-card, .application-card, .skill-category');
    cards.forEach(card => {
        card.classList.add('hover-lift');
    });

    // Counter animation for statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                
                animateCounter(target, 0, numericValue, 2000, isPercentage);
                observer.unobserve(target);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });

    function animateCounter(element, start, end, duration, isPercentage = false) {
        const startTime = performance.now();
        const suffix = isPercentage ? '%' : '';
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Mobile menu toggle (if needed for future mobile navigation)
    const createMobileMenu = () => {
        const navbar = document.querySelector('.navbar');
        const navContainer = document.querySelector('.nav-container');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
        
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <button class="mobile-menu-close">
                    <i class="fas fa-times"></i>
                </button>
                <ul class="mobile-nav-menu">
                    <li><a href="#abstract">Abstract</a></li>
                    <li><a href="#case-study">Case Study</a></li>
                    <li><a href="#methodology">Methodology</a></li>
                    <li><a href="#visualizations">Visualizations</a></li>
                    <li><a href="#results">Results</a></li>
                    <li><a href="#conclusion">Conclusion</a></li>
                </ul>
            </div>
        `;
        
        // Add to navbar
        navContainer.appendChild(mobileMenuBtn);
        document.body.appendChild(mobileMenu);
        
        // Toggle functionality
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        mobileMenu.querySelector('.mobile-menu-close').addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close on outside click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    };

    // Only create mobile menu on smaller screens
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }

    // Add CSS for mobile menu
    const mobileMenuCSS = `
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        }
        
        .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        .mobile-menu.active {
            display: flex;
        }
        
        .mobile-menu-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 300px;
            width: 90%;
            position: relative;
        }
        
        .mobile-menu-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
        }
        
        .mobile-nav-menu {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .mobile-nav-menu li {
            margin-bottom: 1rem;
        }
        
        .mobile-nav-menu a {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 500;
            font-size: 1.1rem;
            display: block;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .mobile-nav-menu a:hover {
            color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
            
            .nav-menu {
                display: none;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = mobileMenuCSS;
    document.head.appendChild(style);

    // Add active state styles for navigation
    const activeNavCSS = `
        .nav-menu a.active {
            color: #e2e8f0;
            position: relative;
        }
        
        .nav-menu a.active::after {
            content: '';
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            width: 100%;
            height: 2px;
            background: #e2e8f0;
            border-radius: 1px;
        }
    `;
    
    const activeStyle = document.createElement('style');
    activeStyle.textContent = activeNavCSS;
    document.head.appendChild(activeStyle);

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Add loading CSS
    const loadingCSS = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = loadingCSS;
    document.head.appendChild(loadingStyle);
});

// Utility function for smooth scrolling to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Hover effect
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-2px)';
        scrollToTopBtn.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
        scrollToTopBtn.style.boxShadow = 'var(--shadow-lg)';
    });
});