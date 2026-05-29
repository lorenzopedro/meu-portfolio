document.addEventListener('DOMContentLoaded', () => {
                // --- Continuous Marquee Carousel Logic ---
                const track = document.getElementById('carouselTrack');
                const carouselWrapper = document.getElementById('carouselWrapper');
                if (!track) return;

                // Duplica os cards para o loop infinito
                const originalCards = Array.from(track.children);
                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.setAttribute('aria-hidden', 'true'); // Acessibilidade
                    track.appendChild(clone);
                });

                let position = 0;
                let isPaused = false;
                let animationFrameId;

                function getSetWidth() {
                    let width = 0;
                    originalCards.forEach(card => {
                        width += card.offsetWidth + 32; // card width + gap-8 (32px)
                    });
                    return width;
                }

                function animate() {
                    if (!isPaused) {
                        position -= 0.6; // Velocidade "trem devagar"
                        const setWidth = getSetWidth();

                        // Reseta a posição quando um set completo passar
                        if (Math.abs(position) >= setWidth) {
                            position += setWidth;
                        }

                        track.style.transform = `translateX(${position}px)`;
                    }
                    animationFrameId = requestAnimationFrame(animate);
                }

                animate();

                if (carouselWrapper) {
                    carouselWrapper.addEventListener('mouseenter', () => isPaused = true);
                    carouselWrapper.addEventListener('mouseleave', () => isPaused = false);

                    // Suporte a touch no mobile para pausar
                    carouselWrapper.addEventListener('touchstart', () => isPaused = true, { passive: true });
                    carouselWrapper.addEventListener('touchend', () => isPaused = false);
                }

                // --- 3D Hover Tilt Logic ---
                const tiltCards = document.querySelectorAll('.tilt-card');

                tiltCards.forEach(card => {
                    const innerCard = card.querySelector('.tilt-inner');

                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        card.style.setProperty('--mouse-x', `${x}px`);
                        card.style.setProperty('--mouse-y', `${y}px`);

                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        const rotateX = ((y - centerY) / centerY) * -10;
                        const rotateY = ((x - centerX) / centerX) * 10;

                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;

                        const shadowX = (centerX - x) / 10;
                        const shadowY = (centerY - y) / 10;
                        innerCard.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.12)`;
                    });

                    card.addEventListener('mouseleave', () => {
                        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                        innerCard.style.boxShadow = `0 8px 30px rgba(0,0,0,0.04)`;
                    });

                    card.addEventListener('mouseenter', () => {
                        card.style.transition = 'transform 0.1s ease-out';
                    });
                });
            });

document.addEventListener('DOMContentLoaded', () => {
            const ctaSection = document.getElementById('contato');
            const customCursor = document.getElementById('custom-cursor');
            const magneticWrap = document.querySelector('.magnetic-wrap');
            const magneticBtn = document.getElementById('magnetic-btn');

            if (!ctaSection) return;

            // --- Liquid Blob Mouse Tracking ---
            const blob = document.querySelector('.blob');
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let cursorX = mouseX;
            let cursorY = mouseY;
            let blobX = 0;
            let blobY = 0;
            let isHoveringCta = false;

            // --- Custom Cursor & Blob Logic ---
            if (window.matchMedia("(min-width: 768px)").matches) {
                ctaSection.addEventListener('mouseenter', () => {
                    isHoveringCta = true;
                    if(customCursor) customCursor.style.opacity = '1';
                    ctaSection.style.cursor = 'none';
                });

                ctaSection.addEventListener('mouseleave', () => {
                    isHoveringCta = false;
                    if(customCursor) customCursor.style.opacity = '0';
                    ctaSection.style.cursor = 'auto';
                });

                ctaSection.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });

                function animateCursorAndBlob() {
                    if (isHoveringCta) {
                        // Smooth cursor
                        cursorX += (mouseX - cursorX) * 0.15;
                        cursorY += (mouseY - cursorY) * 0.15;
                        if(customCursor) customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
                        
                        // Blob Parallax
                        if (blob) {
                            const targetBlobX = (mouseX - window.innerWidth / 2) * -0.08;
                            const targetBlobY = (mouseY - window.innerHeight / 2) * -0.08;
                            blobX += (targetBlobX - blobX) * 0.05;
                            blobY += (targetBlobY - blobY) * 0.05;
                            blob.style.transform = `translate(calc(-50% + ${blobX}px), calc(-50% + ${blobY}px))`;
                        }
                    }
                    requestAnimationFrame(animateCursorAndBlob);
                }
                animateCursorAndBlob();
            } else {
                ctaSection.style.cursor = 'auto';
                if(customCursor) customCursor.style.display = 'none';
            }

            // --- Magnetic Button Logic ---
            if (magneticWrap && magneticBtn) {
                magneticWrap.addEventListener('mousemove', (e) => {
                    const rect = magneticWrap.getBoundingClientRect();
                    const h = rect.width / 2;
                    const v = rect.height / 2;
                    const x = e.clientX - rect.left - h;
                    const y = e.clientY - rect.top - v;

                    const pullX = x / 2;
                    const pullY = y / 2;

                    magneticBtn.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.05)`;
                    
                    if (customCursor) {
                        customCursor.style.width = '64px';
                        customCursor.style.height = '64px';
                        customCursor.style.borderColor = 'rgba(255,255,255,0.8)';
                    }
                });

                magneticWrap.addEventListener('mouseleave', () => {
                    magneticBtn.style.transform = `translate(0px, 0px) scale(1)`;
                    if (customCursor) {
                        customCursor.style.width = '32px';
                        customCursor.style.height = '32px';
                        customCursor.style.borderColor = 'rgba(255,255,255,0.4)';
                    }
                });
            }

            // --- Modal Full-Screen Logic ---
            const contactModal = document.getElementById('contact-modal');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const modalItems = document.querySelectorAll('.modal-item');
            
            if(magneticBtn && contactModal) {
                magneticBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const rect = magneticBtn.getBoundingClientRect();
                    const clickX = rect.left + rect.width / 2;
                    const clickY = rect.top + rect.height / 2;
                    
                    // Set initial state
                    contactModal.style.transition = 'none';
                    contactModal.style.clipPath = `circle(0px at ${clickX}px ${clickY}px)`;
                    contactModal.classList.remove('pointer-events-none');
                    
                    // Force reflow
                    void contactModal.offsetWidth;
                    
                    // Expand
                    contactModal.style.transition = 'clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
                    const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.5;
                    contactModal.style.clipPath = `circle(${maxRadius}px at ${clickX}px ${clickY}px)`;
                    
                    // Stagger content in
                    modalItems.forEach(item => {
                        item.classList.remove('opacity-0', 'translate-y-10');
                        item.classList.add('opacity-100', 'translate-y-0');
                    });
                });

                function closeModal() {
                    // Stagger content out
                    modalItems.forEach(item => {
                        item.classList.add('opacity-0', 'translate-y-10');
                        item.classList.remove('opacity-100', 'translate-y-0');
                    });

                    // Retract mask
                    const rect = magneticBtn.getBoundingClientRect();
                    const clickX = rect.left + rect.width / 2;
                    const clickY = rect.top + rect.height / 2;
                    contactModal.style.clipPath = `circle(0px at ${clickX}px ${clickY}px)`;
                    
                    setTimeout(() => {
                        contactModal.classList.add('pointer-events-none');
                    }, 800);
                }

                closeModalBtn.addEventListener('click', closeModal);
                
                // Cursor support inside the modal
                contactModal.addEventListener('mouseenter', () => {
                    if (!contactModal.classList.contains('pointer-events-none')) {
                        isHoveringCta = true;
                        if(customCursor) customCursor.style.opacity = '1';
                        contactModal.style.cursor = 'none';
                    }
                });
                contactModal.addEventListener('mouseleave', () => {
                    isHoveringCta = false;
                    if(customCursor) customCursor.style.opacity = '0';
                    contactModal.style.cursor = 'auto';
                });
                contactModal.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });

                // Click on backdrop to close and custom cursor 'X'
                const backdrop = contactModal.querySelector('.modal-backdrop');
                if(backdrop) {
                    backdrop.addEventListener('click', closeModal);
                    
                    backdrop.addEventListener('mouseenter', () => {
                        if (customCursor && !contactModal.classList.contains('pointer-events-none')) {
                            customCursor.style.width = '64px';
                            customCursor.style.height = '64px';
                            customCursor.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            customCursor.style.borderColor = 'rgba(255,255,255,0.1)';
                            customCursor.innerHTML = '<i data-lucide="x" class="w-8 h-8 text-white/70"></i>';
                            customCursor.style.display = 'flex';
                            customCursor.style.alignItems = 'center';
                            customCursor.style.justifyContent = 'center';
                            lucide.createIcons();
                        }
                    });

                    backdrop.addEventListener('mouseleave', () => {
                        if (customCursor) {
                            customCursor.style.width = '32px';
                            customCursor.style.height = '32px';
                            customCursor.style.backgroundColor = 'transparent';
                            customCursor.style.borderColor = 'rgba(255,255,255,0.4)';
                            customCursor.innerHTML = '';
                            customCursor.style.display = 'block';
                        }
                    });
                }
                
                // Esc key to close
                window.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !contactModal.classList.contains('pointer-events-none')) {
                        closeModal();
                    }
                });
            }

            // --- Copy Email Toast ---
            const copyEmailBtn = document.getElementById('copy-email-btn');
            const copyToast = document.getElementById('copy-toast');
            if (copyEmailBtn && copyToast) {
                copyEmailBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText('lorenzopedro.freitas@gmail.com').then(() => {
                        copyToast.classList.remove('opacity-0');
                        copyToast.classList.add('opacity-100');
                        setTimeout(() => {
                            copyToast.classList.remove('opacity-100');
                            copyToast.classList.add('opacity-0');
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                });
            }

            // --- Intersection Observer for Hero Text Stagger (now handled by GSAP) ---
            // Legacy code removed - GSAP ScrollTrigger handles CTA stagger.
        });

window.addEventListener('load', () => {
            // Register ScrollTrigger plugin
            gsap.registerPlugin(ScrollTrigger);

            // ========================
            // 1. HERO SECTION (load)
            // ========================
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            heroTl
                .fromTo('#hero-badge',   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0.2)
                .fromTo('#hero-sub',     { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0.4)
                .fromTo('#hero-title',   { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 }, 0.5)
                .fromTo('#hero-body',    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0.75)
                .fromTo('#hero-buttons', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0.9)
                .fromTo('#hero-avatar',  { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.4);

            // Continuous float on avatar
            gsap.to('#hero-avatar', {
                y: -12,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 1.5
            });

            // ========================
            // 2. SOBRE MIM (scroll)
            // ========================
            // Label + Title slide in from left
            gsap.fromTo('#sobre-label', { opacity: 0, x: -50 }, {
                opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '#sobre-label', start: 'top 85%', end: 'bottom 20%', toggleActions: 'play reverse play reverse' }
            });
            gsap.fromTo('#sobre-title', { opacity: 0, x: -60 }, {
                opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: '#sobre-title', start: 'top 85%', end: 'bottom 20%', toggleActions: 'play reverse play reverse' }
            });

            // Timeline line draw (scaleY)
            gsap.fromTo('#timeline-line', { scaleY: 0 }, {
                scaleY: 1, duration: 1.2, ease: 'power2.out', transformOrigin: 'top',
                scrollTrigger: { trigger: '#timeline-line', start: 'top 80%', end: 'bottom 30%', toggleActions: 'play reverse play reverse' }
            });

            // Timeline items stagger
            gsap.fromTo('.timeline-item', { opacity: 0, y: 50 }, {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.25, ease: 'power3.out',
                scrollTrigger: { trigger: '#timeline-line', start: 'top 75%', end: 'bottom 20%', toggleActions: 'play reverse play reverse' }
            });

            // Skills tags pop/scale stagger
            gsap.fromTo('.skill-tag', { opacity: 0, scale: 0.6 }, {
                opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)',
                scrollTrigger: { trigger: '#skills-container', start: 'top 85%', end: 'bottom 20%', toggleActions: 'play reverse play reverse' }
            });

            // ========================
            // 3. PROJETOS (scroll)
            // ========================
            gsap.fromTo('.projetos-heading', { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '#projetos', start: 'top 80%', end: 'bottom 20%', toggleActions: 'play reverse play reverse' }
            });

            // Fade-out the carousel on leave
            gsap.to('#carouselWrapper', {
                opacity: 0.4,
                scrollTrigger: {
                    trigger: '#projetos',
                    start: 'bottom 20%',
                    end: 'bottom top',
                    scrub: true
                }
            });
            // Restore on enter
            gsap.to('#carouselWrapper', {
                opacity: 1,
                scrollTrigger: {
                    trigger: '#projetos',
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: true
                }
            });

            // ========================
            // 4. DEPOIMENTOS (scroll)
            // ========================
            // Review rows stagger fade in
            gsap.fromTo('.review-row', { opacity: 0, x: -40 }, {
                opacity: 1, x: 0, duration: 0.9, stagger: 0.25, ease: 'power3.out',
                scrollTrigger: { trigger: '#reviews', start: 'top 80%', end: 'bottom 30%', toggleActions: 'play reverse play reverse' }
            });

            // 3D Atom parallax on scroll
            if (document.getElementById('reviews-3d-atom')) {
                gsap.to('#reviews-3d-atom', {
                    y: -60,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#reviews',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                });
            }

            // ========================
            // 5. CTA FINAL — animations now handled by curtain timeline (#8)
            // ========================
            // Words, blob, and subtitle are all controlled by the curtain scrub
            // so we just need the subtitle/button fade as a fallback:

            // CTA subtitle and button fade up — triggered after curtain opens
            gsap.fromTo('#contato p, #contato .magnetic-wrap', { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
                scrollTrigger: { trigger: '#contato', start: 'top 60%', end: 'bottom 20%', toggleActions: 'play reverse play reverse' }
            });

            // ========================
            // 8. CURTAIN REVEAL: Reviews → CTA
            // ========================
            // The #reviews section has clip-path that starts fully visible
            // (inset 0%) and rises to inset(100%) as the user scrolls,
            // exposing the sticky #contato (CTA) section below.
            //
            // The clipping uses a tall inset so the organic wave SVG edge
            // (#reviews-bottom-edge) can ride along the clip boundary.

            const reviewsEl      = document.getElementById('reviews');
            const reviewsEdgeSvg = document.getElementById('reviews-bottom-edge');
            const ctaWordInners  = document.querySelectorAll('.cta-word-inner');

            if (reviewsEl && reviewsEdgeSvg) {

                // ── Layout: set Reviews position so it sits ON TOP of CTA ──
                // #contato is already sticky via CSS. We need #reviews to
                // scroll normally above it.
                reviewsEl.style.marginBottom = '0';

                // Position the SVG edge relative to #reviews so it tracks the curtain
                // We keep it as absolute positioned child of #reviews via JS:
                reviewsEl.style.position    = 'relative';
                reviewsEl.style.overflow    = 'visible'; // let edge SVG bleed below
                reviewsEl.appendChild(reviewsEdgeSvg);

                // ── Curtain scroll zone: pin Reviews bottom while CTA peeks ──
                // We create a pinned scroll section using GSAP pin.
                // Reviews is pinned for an extra 80vh of scroll distance,
                // during which the clip-path rises.

                // Initial state: clip-path covers everything (full curtain down)
                // inset(top right bottom left)
                // bottom=0 means nothing clipped, bottom=100% means fully clipped from bottom
                gsap.set(reviewsEl, { clipPath: 'inset(0% 0% 0% 0%)' });

                // Also set the edge SVG to match: starts at the visual bottom of Reviews
                gsap.set(reviewsEdgeSvg, { y: 0, opacity: 1 });

                // ── Curtain timeline ──
                // As progress goes 0→1:
                //   - clip-path bottom rises from 0% to 100% (curtain rises UP)
                //   - edge SVG tracks the rising clip boundary
                //   - CTA words appear word-by-word
                //   - blob scales in

                const curtainTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: reviewsEl,
                        start: 'bottom 85%',   // curtain starts opening when Reviews bottom nears view
                        end:   'bottom -15%',  // fully open after Reviews leaves screen
                        scrub: 1.8,
                        pin: false
                    }
                });

                // Step 1 (0→1): clip-path BOTTOM rises from 0% to 100%
                // Reviews shrinks from the bottom upward — classic curtain-raise effect
                curtainTl.to(reviewsEl, {
                    clipPath: 'inset(0% 0% 100% 0%)',
                    ease: 'power1.inOut',
                    duration: 1
                }, 0);

                // Step 2 (0→1): Edge SVG tracks the bottom clip boundary
                // As the clip rises (bottom inset grows), the SVG edge also rises.
                // The SVG starts at the visual bottom of #reviews.
                // We translate it upward by reviewsEl.offsetHeight to track 100% clip.
                curtainTl.to(reviewsEdgeSvg, {
                    y: () => -reviewsEl.offsetHeight,
                    ease: 'power1.inOut',
                    duration: 1
                }, 0);

                // Step 3 (0.2→1): CTA words burst up word-by-word
                if (ctaWordInners.length > 0) {
                    curtainTl.to(ctaWordInners, {
                        y: '0%',
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.12,
                        ease: 'power3.out'
                    }, 0.15); // start slightly after curtain begins
                }

            }

            // ========================
            // 6. BG COLOR CROSSFADE (scroll-driven, extended range)
            // ========================
            // Starts as #projetos bottom approaches viewport center,
            // completes midway through #reviews — gives a very wide,
            // imperceptible gradient that spans multiple viewport heights.
            const mainWrapper = document.getElementById('main-wrapper');
            const siteHeader  = document.getElementById('site-header');
            if (mainWrapper) {
                // Phase 1: projetos bottom → reviews top (light → mid-dark)
                ScrollTrigger.create({
                    trigger: '#projetos',
                    start: 'bottom 90%',   // begins when projects bottom nears view
                    end:   'bottom -20%',  // finishes well after projects leaves
                    scrub: 2,
                    onUpdate: (self) => {
                        const p = self.progress;
                        // #F3F3F1 (243,243,241) → #1A1A1A (26,26,26) — softer midpoint
                        const r = Math.round(243 - 217 * p);
                        const g = Math.round(243 - 217 * p);
                        const b = Math.round(241 - 215 * p);
                        mainWrapper.style.backgroundColor = `rgb(${r},${g},${b})`;
                    },
                    onEnter: () => {
                        if (siteHeader) siteHeader.classList.add('dark-mode');
                    },
                    onLeaveBack: () => {
                        if (siteHeader) siteHeader.classList.remove('dark-mode');
                        mainWrapper.style.backgroundColor = '#F3F3F1';
                    }
                });

                // Phase 2: mid-dark → fully dark #0A0A0A through reviews section
                ScrollTrigger.create({
                    trigger: '#reviews',
                    start: 'top 60%',
                    end:   'top -30%',
                    scrub: 2,
                    onUpdate: (self) => {
                        const p = self.progress;
                        // #1A1A1A (26,26,26) → #0A0A0A (10,10,10)
                        const v = Math.round(26 - 16 * p);
                        mainWrapper.style.backgroundColor = `rgb(${v},${v},${v})`;
                    }
                });
            }

            // ========================
            // 7. PARALLAX CURTAIN — project section slides up to reveal dark panel
            // ========================
            // We push #projetos upward as we scroll, so it appears to slide away
            // and uncover the dark section underneath (the sticky panel).
            // The scrub value gives a smooth, natural feel.
            gsap.to('#projetos', {
                y: '-8vh',
                ease: 'none',
                scrollTrigger: {
                    trigger: '#parallax-transition-zone',
                    start: 'bottom 95%',
                    end:   'bottom 20%',
                    scrub: 1.5
                }
            });
        });

lucide.createIcons();
