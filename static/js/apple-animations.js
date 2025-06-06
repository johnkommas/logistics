/**
 * Apple-inspired animations and transitions for Logistics ERP Visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Apple-style animations
    initAppleAnimations();
    
    // Add scroll-based animations
    initScrollAnimations();
    
    // Enhanced ERP diagram interactions
    enhanceERPDiagram();
    
    // Smooth transitions for procedure cards
    enhanceProcedureCards();
    
    // Initialize parallax effects
    initParallaxEffects();
});

/**
 * Initialize Apple-style animations
 */
function initAppleAnimations() {
    // Replace default animate.css animations with custom Apple-style animations
    document.querySelectorAll('.animate__animated').forEach(element => {
        // Add a slight delay to each element based on its position
        const delay = Array.from(element.parentNode.children).indexOf(element) * 0.1;
        element.style.animationDelay = `${delay}s`;
        
        // Add will-change property for better performance
        element.style.willChange = 'opacity, transform';
    });
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const elements = document.querySelectorAll('.department-section, .kpi-card, .process-diagram');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element is in viewport
                entry.target.classList.add('animate__fadeIn');
                // Unobserve after animation is applied
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.2, // 20% of the element must be visible
        rootMargin: '0px 0px -100px 0px' // trigger slightly before element is in view
    });
    
    // Observe each element
    elements.forEach(element => {
        // Remove any existing animation classes
        element.classList.remove('animate__animated', 'animate__fadeIn');
        // Add opacity: 0 initially
        element.style.opacity = '0';
        // Observe the element
        observer.observe(element);
    });
}

/**
 * Enhanced ERP diagram interactions
 */
function enhanceERPDiagram() {
    const diagram = document.getElementById('erp-diagram');
    if (!diagram) return;
    
    const departmentCircles = diagram.querySelectorAll('.department-circle');
    const connectionLines = diagram.querySelectorAll('.connection-line');
    const centralCircle = diagram.querySelector('circle:first-of-type');
    
    // Add Apple-style hover effects
    departmentCircles.forEach(circle => {
        const department = circle.getAttribute('data-department');
        const departmentText = diagram.querySelector(`text[x="${circle.getAttribute('cx')}"][y="${circle.getAttribute('cy')}"]`);
        
        // Store original attributes
        const originalR = circle.getAttribute('r');
        const originalFontSize = departmentText ? window.getComputedStyle(departmentText).fontSize : '14px';
        
        circle.addEventListener('mouseenter', () => {
            // Smooth scale up animation
            gsapFallback(() => {
                circle.style.transition = 'r 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.3s ease';
                circle.setAttribute('r', parseInt(originalR) * 1.1);
                circle.style.fill = getComputedStyle(document.documentElement).getPropertyValue('--apple-highlight');
                
                if (departmentText) {
                    departmentText.style.transition = 'font-size 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    departmentText.style.fontSize = parseInt(originalFontSize) * 1.2 + 'px';
                    departmentText.style.fontWeight = 'bold';
                }
            });
            
            // Highlight connection line with Apple-style animation
            connectionLines.forEach(line => {
                if (line.getAttribute('data-department') === department) {
                    line.style.transition = 'stroke 0.3s ease, stroke-width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    line.style.stroke = getComputedStyle(document.documentElement).getPropertyValue('--apple-highlight');
                    line.style.strokeWidth = '5';
                    line.classList.add('data-flow');
                }
            });
            
            // Subtle pulse animation for central circle
            if (centralCircle) {
                centralCircle.style.transition = 'fill 0.3s ease';
                centralCircle.style.fill = getComputedStyle(document.documentElement).getPropertyValue('--apple-highlight');
            }
        });
        
        circle.addEventListener('mouseleave', () => {
            // Smooth scale down animation
            gsapFallback(() => {
                circle.style.transition = 'r 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.3s ease';
                circle.setAttribute('r', originalR);
                circle.style.fill = '';
                
                if (departmentText) {
                    departmentText.style.transition = 'font-size 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    departmentText.style.fontSize = originalFontSize;
                    departmentText.style.fontWeight = '';
                }
            });
            
            // Reset connection line
            connectionLines.forEach(line => {
                if (line.getAttribute('data-department') === department) {
                    line.style.transition = 'stroke 0.3s ease, stroke-width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    line.style.stroke = '';
                    line.style.strokeWidth = '';
                    line.classList.remove('data-flow');
                }
            });
            
            // Reset central circle
            if (centralCircle) {
                centralCircle.style.transition = 'fill 0.3s ease';
                centralCircle.style.fill = '';
            }
        });
    });
    
    // Add subtle continuous animation to central circle
    if (centralCircle) {
        centralCircle.classList.add('pulse-animation');
    }
}

/**
 * Enhance procedure cards with Apple-style interactions
 */
function enhanceProcedureCards() {
    const cards = document.querySelectorAll('.procedure-card');
    
    cards.forEach(card => {
        // Add subtle hover state
        card.addEventListener('mouseenter', () => {
            gsapFallback(() => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease';
                card.style.transform = 'scale(1.03) translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                
                // Enhance icon animation
                const icon = card.querySelector('.procedure-icon');
                if (icon) {
                    icon.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease';
                    icon.style.transform = 'scale(1.1)';
                    icon.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--apple-highlight');
                }
                
                // Enhance title animation
                const title = card.querySelector('h3');
                if (title) {
                    title.style.transition = 'color 0.3s ease';
                    title.style.color = getComputedStyle(document.documentElement).getPropertyValue('--apple-highlight');
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsapFallback(() => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease';
                card.style.transform = '';
                card.style.boxShadow = '';
                
                // Reset icon
                const icon = card.querySelector('.procedure-icon');
                if (icon) {
                    icon.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease';
                    icon.style.transform = '';
                    icon.style.backgroundColor = '';
                }
                
                // Reset title
                const title = card.querySelector('h3');
                if (title) {
                    title.style.transition = 'color 0.3s ease';
                    title.style.color = '';
                }
            });
        });
        
        // Add click effect
        card.addEventListener('mousedown', () => {
            gsapFallback(() => {
                card.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.transform = 'scale(0.98) translateY(-8px)';
            });
        });
        
        card.addEventListener('mouseup', () => {
            gsapFallback(() => {
                card.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.transform = 'scale(1.03) translateY(-10px)';
            });
        });
    });
}

/**
 * Initialize parallax effects for background elements
 */
function initParallaxEffects() {
    // Add subtle parallax effect to header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 0) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                header.style.backdropFilter = 'saturate(180%) blur(20px)';
                header.style.webkitBackdropFilter = 'saturate(180%) blur(20px)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                header.style.backdropFilter = 'saturate(180%) blur(20px)';
                header.style.webkitBackdropFilter = 'saturate(180%) blur(20px)';
            }
        });
    }
    
    // Add subtle parallax effect to procedure cards
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.procedure-card');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        cards.forEach(card => {
            if (card.matches(':hover')) {
                gsapFallback(() => {
                    card.style.transform = `scale(1.03) translateY(-10px) rotateX(${mouseY * 5}deg) rotateY(${mouseX * -5}deg)`;
                });
            }
        });
    });
}

/**
 * Fallback for GSAP if not available
 * @param {Function} callback - Function to execute
 */
function gsapFallback(callback) {
    // If GSAP is available, use it for smoother animations
    if (typeof gsap !== 'undefined') {
        // GSAP implementation would go here
        // For now, just execute the callback
        callback();
    } else {
        // Use standard CSS transitions as fallback
        callback();
    }
}

/**
 * Enhanced counter animation for KPI values with Apple-style easing
 */
function initEnhancedCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const decimalPlaces = (target.toString().split('.')[1] || '').length;
        const duration = 2500; // Slightly longer for smoother animation
        
        let startTime;
        let current = 0;
        
        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutExpo(progress);
            
            current = target * easedProgress;
            counter.textContent = current.toFixed(decimalPlaces);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target.toFixed(decimalPlaces);
            }
        }
        
        // Start the animation when the element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(animate);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Call enhanced counters function when DOM is loaded
document.addEventListener('DOMContentLoaded', initEnhancedCounters);