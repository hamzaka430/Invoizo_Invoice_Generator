/**
 * Lazy Loading Implementation for INVOIZO
 * Optimizes page load performance by loading content only when needed
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================== Image Lazy Loading =====================
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Replace data-src with src for lazy loaded images
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Replace data-srcset with srcset for responsive images
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                    img.removeAttribute('data-srcset');
                }
                
                // Add loaded class for transition effects
                img.classList.add('lazy-loaded');
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // ===================== Content Lazy Loading =====================
    const contentObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Load content based on data-lazy-content attribute
                if (element.dataset.lazyContent) {
                    loadLazyContent(element);
                }
                
                // Add visible class for animations
                element.classList.add('lazy-visible');
                
                // Stop observing this element
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.1
    });

    // Observe all elements with lazy-content class
    document.querySelectorAll('.lazy-content').forEach(element => {
        contentObserver.observe(element);
    });

    // ===================== Load Lazy Content Function =====================
    function loadLazyContent(element) {
        const contentType = element.dataset.lazyContent;
        
        switch(contentType) {
            case 'stats':
                animateStats(element);
                break;
            case 'timeline':
                animateTimeline(element);
                break;
            case 'values':
                animateValues(element);
                break;
            default:
                // Generic content loading
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
        }
    }

    // ===================== Animate Statistics =====================
    function animateStats(container) {
        const statNumbers = container.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const isNumber = !isNaN(finalValue.replace(/[^0-9]/g, ''));
            
            if (isNumber) {
                const number = parseInt(finalValue.replace(/[^0-9]/g, ''));
                const suffix = finalValue.replace(/[0-9]/g, '');
                animateCounter(stat, 0, number, suffix, 2000);
            }
        });
    }

    // ===================== Counter Animation =====================
    function animateCounter(element, start, end, suffix, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            if (suffix.includes('K')) {
                element.textContent = Math.floor(current) + 'K+';
            } else if (suffix.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else if (suffix.includes('∞')) {
                element.textContent = '∞';
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }

    // ===================== Animate Timeline =====================
    function animateTimeline(container) {
        const timelineItems = container.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 200);
        });
    }

    // ===================== Animate Values =====================
    function animateValues(container) {
        const valueCards = container.querySelectorAll('.value-card');
        
        valueCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 150);
        });
    }

    // ===================== Lazy Load iframe (if any) =====================
    const iframeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                }
                observer.unobserve(iframe);
            }
        });
    }, {
        rootMargin: '100px 0px'
    });

    // Observe all iframes with data-src
    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
        iframeObserver.observe(iframe);
    });

    // ===================== Preload Critical Resources =====================
    function preloadCriticalResources() {
        // Preload fonts that are used immediately
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap';
        fontLink.as = 'style';
        fontLink.onload = function() {
            this.rel = 'stylesheet';
        };
        document.head.appendChild(fontLink);
    }

    // Initialize preloading
    preloadCriticalResources();

    // ===================== Performance Monitoring =====================
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                
                // Track Core Web Vitals if available
                if ('web-vitals' in window) {
                    // This would require web-vitals library
                    // getCLS(console.log);
                    // getFID(console.log);
                    // getLCP(console.log);
                }
            }, 0);
        });
    }
});

// ===================== CSS for Lazy Loading Transitions =====================
const lazyLoadingStyles = `
<style>
    /* Lazy loading transitions */
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        background-color: #f5f5f5;
        min-height: 200px;
        background-image: linear-gradient(90deg, #f5f5f5 25%, #e5e5e5 50%, #f5f5f5 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    img.lazy-loaded {
        opacity: 1;
        background: none;
        animation: none;
    }
    
    .lazy-content {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        will-change: opacity, transform;
    }
    
    .lazy-content.lazy-visible {
        opacity: 1;
        transform: translateY(0);
        will-change: auto;
    }
    
    /* Timeline animation */
    .timeline-item {
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        will-change: opacity, transform;
    }
    
    .timeline-item.animate-in {
        opacity: 1;
        transform: translateX(0);
        will-change: auto;
    }
    
    /* Value cards animation */
    .value-card {
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        will-change: opacity, transform;
    }
    
    .value-card.animate-in {
        opacity: 1;
        transform: scale(1);
        will-change: auto;
    }
    
    /* Performance optimizations */
    .stats-grid {
        contain: layout;
    }
    
    .timeline-container {
        contain: layout;
    }
    
    .values-grid {
        contain: layout;
    }
    
    /* Reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
        .lazy-content,
        .timeline-item,
        .value-card,
        img {
            transition: none !important;
            animation: none !important;
        }
    }
    
    /* Critical CSS for above-the-fold content */
    .hero {
        contain: layout style;
    }
    
    .nav-container {
        contain: layout;
    }
</style>
`;

// Inject CSS into the document
document.head.insertAdjacentHTML('beforeend', lazyLoadingStyles);
