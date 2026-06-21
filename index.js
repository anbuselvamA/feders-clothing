document.addEventListener("DOMContentLoaded", (event) => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initial Setup
    gsap.set('.gs-reveal', { autoAlpha: 0 });
    gsap.set('.gs-fade-up', { autoAlpha: 0, y: 50 });

    // --- Aceternity UI Patterns ---
    
    // 1. Page Transition
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    document.body.appendChild(transitionOverlay);

    // Initial transition in
    gsap.to(transitionOverlay, { y: '-100%', duration: 1, ease: 'power4.inOut', delay: 0.1 });

    // Intercept links for transition out
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            if (link.hostname === window.location.hostname && link.target !== '_blank' && !link.hasAttribute('data-no-transition') && !link.hash) {
                e.preventDefault();
                const href = link.href;
                gsap.to(transitionOverlay, {
                    y: '0%',
                    duration: 0.8,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            }
        });
    });

    // 2. Text Reveal Splitting
    document.querySelectorAll('.reveal-text').forEach(text => {
        const words = text.innerText.split(' ');
        text.innerHTML = '';
        text.style.opacity = '1';
        text.style.transform = 'none';
        
        words.forEach(word => {
            const wrapper = document.createElement('span');
            wrapper.className = 'reveal-wrapper';
            wrapper.innerHTML = `<span class="reveal-word" style="display:inline-block; transform:translateY(100%);">${word}&nbsp;</span>`;
            text.appendChild(wrapper);
        });

        gsap.to(text.querySelectorAll('.reveal-word'), {
            scrollTrigger: {
                trigger: text,
                start: 'top 85%'
            },
            y: '0%',
            duration: 1.2,
            stagger: 0.04,
            ease: 'power4.out'
        });
    });

    // 3. Magnetic Buttons
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });


    let delayOffset = 0;
    const loader = document.querySelector('.premium-loader');
    
    if (loader) {
        if (!sessionStorage.getItem('ferdersLoaderSeen_v2')) {
            const tl = gsap.timeline();
            
            gsap.set('.loader-monogram', { opacity: 0, scale: 0.9, y: 20 });
            gsap.set('.loader-brand', { y: 20, opacity: 0 });
            gsap.set('.loader-sub', { y: -10, opacity: 0 });
            gsap.set('.loader-progress-text', { opacity: 0 });

            // Lock scroll while loading
            document.body.style.overflow = 'hidden';

            // Percentage Counter animation
            let progressObj = { value: 0 };
            tl.to(progressObj, {
                value: 100,
                duration: 2.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    const percentEl = document.getElementById('loader-percent') || document.getElementById('loader-percent-shop');
                    if (percentEl) percentEl.innerText = Math.round(progressObj.value);
                }
            }, 0);

            tl.to('.loader-monogram', { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0)
              .to('.loader-brand', { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, 0.2)
              .to('.loader-sub', { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.4)
              .to('.loader-progress-text', { opacity: 1, duration: 0.5 }, 0.6)
              .to('.premium-loader', { 
                  opacity: 0,
                  duration: 1.2, 
                  ease: "power2.inOut", 
                  delay: 0.5,
                  onComplete: () => {
                      document.body.style.overflow = '';
                      loader.style.display = 'none';
                      sessionStorage.setItem('ferdersLoaderSeen_v2', 'true');
                  }
              }, 2.5);
            
            delayOffset = 4.0; // Time until loader fades out
        } else {
            // Loader has been seen, hide it instantly
            loader.style.display = 'none';
            delayOffset = 0;
        }
    }

    // Navbar Animation
    gsap.to('.navbar.gs-reveal', {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2 + delayOffset
    });

    // Hero Section Animation (Staggered Fade Up)
    gsap.to('.hero-content.gs-fade-up', {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5 + delayOffset
    });

    // Slow zoom in on hero background image
    gsap.fromTo('.hero-img', 
        { scale: 1.1 },
        { scale: 1, duration: 4, ease: "power2.out" }
    );

    // Features Banner Reveal
    gsap.to('.features-banner.gs-reveal', {
        scrollTrigger: {
            trigger: '.features-banner',
            start: 'top 95%',
        },
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    });

    // Collections Section Animations
    gsap.to('.collections-section .collections-header.gs-fade-up', {
        scrollTrigger: {
            trigger: '.collections-section',
            start: 'top 80%',
        },
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.utils.toArray('.collection-card.gs-fade-up').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: '.collections-grid',
                start: 'top 85%',
            },
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.15
        });
    });

    // Promo Banner Animation
    gsap.to('.promo-banner .gs-fade-up', {
        scrollTrigger: {
            trigger: '.promo-banner',
            start: 'top 80%',
        },
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Best Arrivals Section Animations
    gsap.utils.toArray('.best-arrivals .gs-fade-up').forEach(element => {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
            },
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Testimonials Animations
    gsap.utils.toArray('.testimonials-section .gs-fade-up').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: '.testimonials-grid',
                start: 'top 85%',
            },
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.15
        });
    });



});

// Review Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const writeBtn = document.getElementById('write-review-btn');
    const modal = document.getElementById('review-modal');
    const closeBtn = document.getElementById('close-review-modal');
    const stars = document.querySelectorAll('.star-rating span');
    const form = document.getElementById('review-form');

    if (writeBtn && modal && closeBtn) {
        writeBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Star rating interaction
    let currentRating = 0;
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentRating = index + 1;
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.classList.add('active');
                    s.innerHTML = '&#9733;'; // solid star
                } else {
                    s.classList.remove('active');
                    s.innerHTML = '&#9734;'; // outline star
                }
            });
        });
    });

    const reviewsContainer = document.getElementById('reviews-container');
    const emptyState = document.getElementById('reviews-empty-state');

    // Load reviews on startup
    const loadReviews = () => {
        const savedReviews = JSON.parse(localStorage.getItem('vorelis_reviews') || '[]');
        if (savedReviews.length > 0) {
            emptyState.style.display = 'none';
            reviewsContainer.style.display = 'grid';
            reviewsContainer.innerHTML = savedReviews.map(r => `
                <div class="submitted-review-card">
                    <div class="submitted-review-stars">${'&#9733;'.repeat(r.rating)}${'&#9734;'.repeat(5 - r.rating)}</div>
                    <p class="submitted-review-text">"${r.text}"</p>
                    <p class="submitted-review-author">${r.name}</p>
                    <p class="submitted-review-date">${r.date}</p>
                </div>
            `).join('');
        }
    };
    if (reviewsContainer && emptyState) {
        loadReviews();
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (currentRating === 0) {
                alert('Please select a star rating.');
                return;
            }
            
            const nameInput = document.getElementById('review-name').value;
            const textInput = document.getElementById('review-text').value;
            
            const newReview = {
                name: nameInput,
                text: textInput,
                rating: currentRating,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            };

            const savedReviews = JSON.parse(localStorage.getItem('vorelis_reviews') || '[]');
            savedReviews.unshift(newReview); // add to top
            localStorage.setItem('vorelis_reviews', JSON.stringify(savedReviews));

            loadReviews(); // re-render

            form.reset();
            currentRating = 0;
            stars.forEach(s => {
                s.classList.remove('active');
                s.innerHTML = '&#9734;';
            });
            modal.classList.remove('active');
        });
    }
});
