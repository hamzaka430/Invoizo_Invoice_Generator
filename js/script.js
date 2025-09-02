/*

Tooplate 2141 Minimal White

https://www.tooplate.com/view/2141-minimal-white

*/

// JavaScript Document

        // 3D Donut Loader Control with Performance Optimization
        window.addEventListener('load', function() {
            const loader = document.getElementById('loader');
            
            // Hide loader after page loads
            setTimeout(() => {
                loader.classList.add('hidden');
                
                // Remove loader from DOM after transition
                setTimeout(() => {
                    loader.style.display = 'none';
                    // Free up memory
                    loader.remove();
                }, 500);
            }, 1500); // Show loader for 1.5 seconds minimum
            
            // Performance monitoring
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('🚀 Page Load Performance:');
                console.log('📊 DNS Lookup:', perfData.domainLookupEnd - perfData.domainLookupStart, 'ms');
                console.log('🔗 Connection Time:', perfData.connectEnd - perfData.connectStart, 'ms');
                console.log('📥 Download Time:', perfData.responseEnd - perfData.responseStart, 'ms');
                console.log('⚡ Total Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            }
        });

        // Show loader function (can be called for other operations)
        function showLoader() {
            const loader = document.getElementById('loader');
            loader.style.display = 'flex';
            loader.classList.remove('hidden');
        }

        // Hide loader function
        function hideLoader() {
            const loader = document.getElementById('loader');
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Navbar scroll effect and active menu highlighting with throttling
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-link');
        let isScrolling = false;

        function handleScroll() {
            const navbar = document.getElementById('navbar');
            
            // Navbar style on scroll
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Active menu highlighting
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').slice(1) === current) {
                    item.classList.add('active');
                }
            });
            
            isScrolling = false;
        }

        // Throttled scroll event
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                requestAnimationFrame(handleScroll);
                isScrolling = true;
            }
        }, { passive: true });

        // Trigger scroll event on load to set initial active state
        window.dispatchEvent(new Event('scroll'));

        // Smooth scrolling for navigation links
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

        // Fade in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Invoice functionality is handled in invoice-script.js
        // Contact form submission handling for Web3Forms
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                // Let Web3Forms handle the submission - don't prevent default
                const submitBtn = this.querySelector('.submit-btn');
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Re-enable button after submission (in case of errors)
                setTimeout(() => {
                    submitBtn.textContent = 'Contact Us';
                    submitBtn.disabled = false;
                }, 3000);
            });
        }