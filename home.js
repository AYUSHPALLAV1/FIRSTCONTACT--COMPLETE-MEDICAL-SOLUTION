document.addEventListener('DOMContentLoaded', () => {
    // Animation Logic
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down, .ins-fly-left, .ins-fly-right, .ins-fly-top, .ins-fly-bottom, .ins-fly-bottom-left, .ins-fly-top-right, .ins-fly-bottom-right, .ins-fly-scale');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Scroll Transition Logic between Hero and Consultation
    const heroSection = document.getElementById('hero-section');
    
    if (heroSection) {
        const heroContent = heroSection.querySelector('.hero-content');
        const heroVisuals = heroSection.querySelector('.hero-visuals');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            
            // Fade out and scale down as user scrolls
            // Effect completes when scrolled 70% of hero height
            const limit = heroHeight * 0.7;
            
            if (scrollY <= limit) {
                const progress = scrollY / limit;
                const opacity = 1 - progress;
                const scale = 1 - (progress * 0.1); // Slight scale down to 0.9
                const translateY = scrollY * 0.2; // Slight parallax move down
                
                if (heroContent) {
                    heroContent.style.opacity = Math.max(opacity, 0);
                    heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
                }
                
                if (heroVisuals) {
                    heroVisuals.style.opacity = Math.max(opacity, 0);
                    heroVisuals.style.transform = `translateY(${translateY}px) scale(${scale})`;
                }
            } else {
                // Ensure hidden if scrolled past
                if (heroContent) heroContent.style.opacity = 0;
                if (heroVisuals) heroVisuals.style.opacity = 0;
            }
        });
    }

    // Scroll Transition: Consultation -> Insurance
    const consultationSection = document.getElementById('consultation-section');
    
    if (consultationSection) {
        const consultContent = consultationSection.querySelector('.consultation-content');
        const consultVisuals = consultationSection.querySelector('.section-image');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const sectionTop = consultationSection.offsetTop;
            const sectionHeight = consultationSection.offsetHeight;
            
            // Calculate scroll relative to the section start
            const relativeScroll = scrollY - sectionTop;
            
            // Only animate when we are scrolling through the sticky section
            if (relativeScroll >= 0 && relativeScroll <= sectionHeight) {
                const limit = sectionHeight * 0.7;
                
                if (relativeScroll <= limit) {
                    const progress = relativeScroll / limit;
                    const opacity = 1 - progress;
                    const scale = 1 - (progress * 0.1);
                    const translateY = relativeScroll * 0.2;
                    
                    if (consultContent) {
                        consultContent.style.opacity = Math.max(opacity, 0);
                        consultContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    }
                    if (consultVisuals) {
                        consultVisuals.style.opacity = Math.max(opacity, 0);
                        consultVisuals.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    }
                } else {
                    if (consultContent) consultContent.style.opacity = 0;
                    if (consultVisuals) consultVisuals.style.opacity = 0;
                }
            } else if (relativeScroll < 0) {
                // Reset when scrolling back up above the section
                if (consultContent) {
                    consultContent.style.opacity = 1;
                    consultContent.style.transform = 'none';
                }
                if (consultVisuals) {
                    consultVisuals.style.opacity = 1;
                    consultVisuals.style.transform = 'none';
                }
            }
        });
    }

    // Scroll Transition: Insurance -> Medidose
    const insuranceSection = document.getElementById('insurance-section');
    
    if (insuranceSection) {
        const insuranceContent = insuranceSection.querySelector('.insurance-content');
        const insuranceVisuals = insuranceSection.querySelector('.section-image');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const sectionTop = insuranceSection.offsetTop;
            const sectionHeight = insuranceSection.offsetHeight;
            
            // Calculate scroll relative to the section start
            const relativeScroll = scrollY - sectionTop;
            
            // Only animate when we are scrolling through the sticky section
            if (relativeScroll >= 0 && relativeScroll <= sectionHeight) {
                const limit = sectionHeight * 0.7;
                
                if (relativeScroll <= limit) {
                    const progress = relativeScroll / limit;
                    const opacity = 1 - progress;
                    const scale = 1 - (progress * 0.1);
                    const translateY = relativeScroll * 0.2;
                    
                    if (insuranceContent) {
                        insuranceContent.style.opacity = Math.max(opacity, 0);
                        insuranceContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    }
                    if (insuranceVisuals) {
                        insuranceVisuals.style.opacity = Math.max(opacity, 0);
                        insuranceVisuals.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    }
                } else {
                    if (insuranceContent) insuranceContent.style.opacity = 0;
                    if (insuranceVisuals) insuranceVisuals.style.opacity = 0;
                }
            } else if (relativeScroll < 0) {
                // Reset when scrolling back up above the section
                if (insuranceContent) {
                    insuranceContent.style.opacity = 1;
                    insuranceContent.style.transform = 'none';
                }
                if (insuranceVisuals) {
                    insuranceVisuals.style.opacity = 1;
                    insuranceVisuals.style.transform = 'none';
                }
            }
        });
    }

    // Scroll Transition: Medidose -> Testimonials
    const medidoseSection = document.getElementById('medidose-section');
    
    if (medidoseSection) {
        const medidoseContent = medidoseSection.querySelector('.medidose-content');
        const medidoseVisuals = medidoseSection.querySelector('.section-image');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const sectionTop = medidoseSection.offsetTop;
            const sectionHeight = medidoseSection.offsetHeight;
            
            // Calculate scroll relative to the section start
            const relativeScroll = scrollY - sectionTop;
            
            // Only animate when we are scrolling through the sticky section
            if (relativeScroll >= 0 && relativeScroll <= sectionHeight) {
                const limit = sectionHeight * 0.7;
                
                if (relativeScroll <= limit) {
                    const progress = relativeScroll / limit;
                    const opacity = 1 - progress;
                    const scale = 1 - (progress * 0.1);
                    const translateY = relativeScroll * 0.2;
                    
                    if (medidoseContent) {
                        medidoseContent.style.opacity = Math.max(opacity, 0);
                        medidoseContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    }
                    if (medidoseVisuals) {
                        medidoseVisuals.style.opacity = Math.max(opacity, 0);
                        medidoseVisuals.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    }
                } else {
                    if (medidoseContent) medidoseContent.style.opacity = 0;
                    if (medidoseVisuals) medidoseVisuals.style.opacity = 0;
                }
            } else if (relativeScroll < 0) {
                // Reset when scrolling back up above the section
                if (medidoseContent) {
                    medidoseContent.style.opacity = 1;
                    medidoseContent.style.transform = 'none';
                }
                if (medidoseVisuals) {
                    medidoseVisuals.style.opacity = 1;
                    medidoseVisuals.style.transform = 'none';
                }
            }
        });
    }
});
