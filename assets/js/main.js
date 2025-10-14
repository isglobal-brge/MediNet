// Main JavaScript for SynapNetica Documentation Site

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('nav-menu-open');
            
            // Toggle menu state
            navMenu.classList.toggle('nav-menu-open');
            document.body.classList.toggle('nav-open');
            
            // Toggle icon with smooth transition
            const icon = navToggle.querySelector('.material-icons');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.textContent = navMenu.classList.contains('nav-menu-open') ? 'close' : 'menu';
                    icon.style.transform = 'rotate(0deg)';
                }, 150);
            }
            
            // Add aria attributes for accessibility
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.setAttribute('aria-hidden', isOpen);
        });
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav-menu-open');
                document.body.classList.remove('nav-open');
                
                const icon = navToggle.querySelector('.material-icons');
                if (icon) {
                    icon.textContent = 'menu';
                }
                
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('nav-menu-open')) {
                navMenu.classList.remove('nav-menu-open');
                document.body.classList.remove('nav-open');
                navToggle.focus();
                
                const icon = navToggle.querySelector('.material-icons');
                if (icon) icon.textContent = 'menu';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Safe Animation System - Only for explicitly marked elements
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -30px 0px'
        };
        
        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.hasAttribute('data-animate')) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Only observe elements that are explicitly marked for animation
        const animateElements = document.querySelectorAll('[data-animate]');
        animateElements.forEach(el => animationObserver.observe(el));
    } else {
        // If reduced motion is preferred, make sure all elements are immediately visible
        const potentialAnimateElements = document.querySelectorAll('[data-animate]');
        potentialAnimateElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.add('animate-in');
        });
    }
    
    // Subtle parallax effect for hero sections (disabled on mobile)
    const heroSections = document.querySelectorAll('.hero');
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2; // Reduced intensity
            
            heroSections.forEach(hero => {
                const heroImage = hero.querySelector('.hero-image, .hero-img');
                if (heroImage && scrolled < window.innerHeight) { // Only within viewport
                    heroImage.style.transform = `translateY(${rate}px)`;
                }
            });
        }
        
        // Throttled scroll for performance
        let ticking = false;
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', () => {
            requestTick();
            ticking = false;
        });
    }
    
    // Subtle magnetic effect for buttons (disabled on touch devices)
    if (!('ontouchstart' in window) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        const magneticElements = document.querySelectorAll('.btn:not(.nav-link)');
        
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'transform 0.1s ease-out';
            });
            
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.05; // Much more subtle
                const moveY = y * 0.05;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transition = 'transform 0.2s ease-out';
                el.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // Typing animation removed - was annoying and interfered with readability
    
    // Copy code functionality (for future code blocks)
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '<span class="material-icons">content_copy</span>';
        button.title = 'Copiar código';
        
        button.addEventListener('click', function() {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.innerHTML = '<span class="material-icons">check</span>';
                setTimeout(() => {
                    button.innerHTML = '<span class="material-icons">content_copy</span>';
                }, 2000);
            });
        });
        
        const wrapper = block.parentNode;
        wrapper.style.position = 'relative';
        wrapper.appendChild(button);
    });
    
    // Tab functionality (for future tabbed content)
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
    
    // Search functionality (basic implementation for future use)
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        function performSearch(query) {
            // This would be implemented with actual search functionality
            console.log('Searching for:', query);
            // For now, just show placeholder
            searchResults.innerHTML = `<div class="search-item">Búsqueda: "${query}" (funcionalidad en desarrollo)</div>`;
            searchResults.style.display = 'block';
        }
    }
    
    // Modal functionality
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('modal-open');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('modal-open');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('modal-open');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Form validation
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const errors = validateForm(formData);
            
            if (errors.length > 0) {
                showFormErrors(errors);
            } else {
                // Form is valid, proceed with submission
                console.log('Form is valid, submitting...');
                // Implement actual form submission here
            }
        });
    });
    
    function validateForm(formData) {
        const errors = [];
        
        // Basic validation rules
        const requiredFields = ['name', 'email'];
        
        requiredFields.forEach(field => {
            if (!formData.get(field) || formData.get(field).trim() === '') {
                errors.push(`El campo ${field} es requerido`);
            }
        });
        
        // Email validation
        const email = formData.get('email');
        if (email && !isValidEmail(email)) {
            errors.push('El formato del email no es válido');
        }
        
        return errors;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFormErrors(errors) {
        const errorContainer = document.querySelector('.form-errors');
        if (errorContainer) {
            errorContainer.innerHTML = errors.map(error => 
                `<div class="error-message">${error}</div>`
            ).join('');
            errorContainer.style.display = 'block';
        }
    }
    
    // Tooltip functionality
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                document.body.removeChild(this._tooltip);
                this._tooltip = null;
            }
        });
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<span class="material-icons">keyboard_arrow_up</span>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.title = 'Volver arriba';
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Image Modal/Lightbox Functionality
    initImageModal();
});

// Image Modal/Lightbox System
function initImageModal() {
    // Create modal HTML structure
    const modalHTML = `
        <div id="imageModal" class="image-modal">
            <div class="modal-content">
                <button class="modal-close" aria-label="Cerrar imagen">×</button>
                <img class="modal-image" src="" alt="">
                <div class="modal-caption"></div>
            </div>
        </div>
    `;
    
    // Insert modal into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('imageModal');
    const modalImage = modal.querySelector('.modal-image');
    const modalCaption = modal.querySelector('.modal-caption');
    const closeButton = modal.querySelector('.modal-close');
    
    // Make existing images zoomable
    const images = document.querySelectorAll('img:not(.modal-image)');
    images.forEach(img => {
        // Skip images that are too small, are icons, or are team member photos
        if (img.width < 100 || img.height < 100 || 
            img.classList.contains('nav-icon') || 
            img.classList.contains('about-team-photo')) {
            return;
        }
        
        // Add zoomable class and click handler
        img.classList.add('zoomable');
        img.addEventListener('click', () => openImageModal(img));
        
        // Add keyboard support
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Hacer clic para ampliar imagen');
        
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openImageModal(img);
            }
        });
    });
    
    // Function to open modal with image
    function openImageModal(img) {
        modalImage.src = img.src;
        modalImage.alt = img.alt || 'Imagen ampliada';
        
        // Set caption from alt text or data attribute
        const caption = img.getAttribute('data-caption') || img.alt || '';
        modalCaption.textContent = caption;
        modalCaption.style.display = caption ? 'block' : 'none';
        
        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Focus close button for accessibility
        closeButton.focus();
    }
    
    // Function to close modal
    function closeImageModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Clear image src to free memory
        setTimeout(() => {
            if (!modal.classList.contains('active')) {
                modalImage.src = '';
            }
        }, 300);
    }
    
    // Close button event
    closeButton.addEventListener('click', closeImageModal);
    
    // Close on modal background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
    
    // Prevent scrolling when modal is open
    modal.addEventListener('wheel', (e) => {
        e.preventDefault();
    }, { passive: false });
}

// Theme toggle functionality (for future dark mode)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
}

// Call loadTheme on page load
loadTheme();