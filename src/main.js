import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { inject } from '@vercel/analytics'

inject()

const lenis = new Lenis({
  autoRaf: true,       // automatic animation frame updates
  smoothWheel: true,   // smooth scrolling with mouse
  smoothTouch: false,  // disabled to prevent nested scroll on mobile
  wheelMultiplier: .7, // faster scroll
})

// Smooth scroll for anchor links (using event delegation for dynamically loaded content)
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]')
  if (!anchor) return

  const href = anchor.getAttribute('href')
  if (href === '#') return

  const target = document.querySelector(href)
  if (target) {
    e.preventDefault()
    lenis.scrollTo(target)
  }
})

// Navigation overlay toggle
const hamburger = document.querySelector('.navbar__hamburger')
const navOverlay = document.getElementById('nav-overlay')

function toggleMenu() {
  const isActive = hamburger.classList.toggle('is-active')
  navOverlay.classList.toggle('active')
  hamburger.setAttribute('aria-expanded', isActive)
  document.documentElement.style.overflow = isActive ? 'hidden' : ''
  document.body.style.overflow = isActive ? 'hidden' : ''
}

hamburger?.addEventListener('click', toggleMenu)

// Close overlay when clicking a nav link
navOverlay?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navOverlay.classList.contains('active')) {
      toggleMenu()
    }
  })
})

// Scroll-fill effect for .about-intro__title-line (word by word)
const scrollFillContainers = document.querySelectorAll('.about-intro__title')
scrollFillContainers.forEach(scrollFillContainer => {
  const titleLines = scrollFillContainer.querySelectorAll('.about-intro__title-line')
  titleLines.forEach(line => {
    const words = line.textContent.trim().split(/\s+/)
    line.innerHTML = words.map(w => `<span class="scroll-word">${w}</span>`).join(' ')
  })
  const wordSpans = scrollFillContainer.querySelectorAll('.scroll-word')

  function updateScrollFill() {
    const rect = scrollFillContainer.getBoundingClientRect()
    const start = window.innerHeight
    const end = 0
    const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1)

    const total = wordSpans.length
    wordSpans.forEach((span, i) => {
      const wordStart = i / total
      const wordEnd = (i + 1) / total
      const wordProgress = Math.min(Math.max((progress - wordStart) / (wordEnd - wordStart), 0), 1)
      span.style.setProperty('--scroll-fill', `${wordProgress * 100}%`)
    })
  }

  window.addEventListener('scroll', updateScrollFill, { passive: true })
  updateScrollFill()
})














































class AnimationSystem {
    constructor() {
        // Professional threshold: 25% visibility triggers animation
        this.threshold = 0.25;

        // Configure intersection observer options
        this.observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: this.threshold
        };

        // Breakpoints for responsive animations
        this.breakpoints = {
            mobile: 767,
            tablet: 1023,
            desktop: 1247,
            widescreen: 1248
        };

        // Initialize observers
        this.initializeObservers();

        // Initialize responsive animation system
        this.initializeResponsiveAnimations();
    }

    /* ==========================================
       OBSERVER INITIALIZATION
       ========================================== */

    /**
     * Initialize all animation observers
     */
    initializeObservers() {
        // Observer for one-time animations (.animate)
        this.animateObserver = new IntersectionObserver(
            (entries) => this.handleAnimateEntries(entries),
            this.observerOptions
        );

        // Observer for repeating animations (.animate-repeat)
        this.animateRepeatObserver = new IntersectionObserver(
            (entries) => this.handleAnimateRepeatEntries(entries),
            this.observerOptions
        );

        // Observer for line animations (one-time)
        this.lineObserver = new IntersectionObserver(
            (entries) => this.handleLineEntries(entries),
            this.observerOptions
        );

        // Observer for repeating line animations
        this.lineRepeatObserver = new IntersectionObserver(
            (entries) => this.handleLineRepeatEntries(entries),
            this.observerOptions
        );

        // Start observing elements
        this.observeElements();
    }

    /**
     * Find and observe all animation elements
     */
    observeElements() {
        // Observe .animate elements (one-time)
        const animateElements = document.querySelectorAll('.animate');
        animateElements.forEach(element => {
            this.animateObserver.observe(element);
        });

        // Observe .animate-repeat elements
        const animateRepeatElements = document.querySelectorAll('.animate-repeat');
        animateRepeatElements.forEach(element => {
            this.animateRepeatObserver.observe(element);
        });

        // Observe line animation elements (one-time)
        const lineElements = document.querySelectorAll('.line-animate, .line-horizontal, .line-vertical');
        lineElements.forEach(element => {
            this.lineObserver.observe(element);
        });

        // Observe repeating line animation elements
        const lineRepeatElements = document.querySelectorAll('.line-animate-repeat');
        lineRepeatElements.forEach(element => {
            this.lineRepeatObserver.observe(element);
        });

        // Fallback: ensure elements already in the viewport get 'in-view' immediately
        this.applyInitialInView(animateElements, animateRepeatElements, lineElements, lineRepeatElements);
    }

    /* ==========================================
       INITIAL VIEWPORT CHECK
       ========================================== */

    /**
     * Add 'in-view' to elements already visible on page load as a fallback.
     * For one-time animations we also unobserve afterward to preserve original behavior.
     */
    applyInitialInView(animateElements, animateRepeatElements, lineElements, lineRepeatElements) {
        const isVisible = (el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
        };

        const isMobile = () => window.innerWidth <= this.breakpoints.mobile;

        // One-time animations (.animate)
        animateElements.forEach(el => {
            if (el.classList.contains('animate-mobile-only') && !isMobile()) {
                return;
            }
            if (el.classList.contains('animate-disable-mobile') && isMobile()) {
                return;
            }
            if (isVisible(el)) {
                el.classList.add('in-view');
                try { this.animateObserver.unobserve(el); } catch (e) {}
            }
        });

        // Repeating animations (.animate-repeat)
        animateRepeatElements.forEach(el => {
            if (el.classList.contains('animate-mobile-only') && !isMobile()) {
                return;
            }
            if (el.classList.contains('animate-disable-mobile') && isMobile()) {
                return;
            }
            if (isVisible(el)) {
                el.classList.add('in-view');
            }
        });

        // Line animations (one-time)
        lineElements.forEach(el => {
            if (el.classList.contains('animate-mobile-only') && !isMobile()) {
                return;
            }
            if (el.classList.contains('animate-disable-mobile') && isMobile()) {
                return;
            }
            if (isVisible(el)) {
                el.classList.add('in-view');
                try { this.lineObserver.unobserve(el); } catch (e) {}
            }
        });

        // Repeating line animations
        lineRepeatElements.forEach(el => {
            if (el.classList.contains('animate-mobile-only') && !isMobile()) {
                return;
            }
            if (el.classList.contains('animate-disable-mobile') && isMobile()) {
                return;
            }
            if (isVisible(el)) {
                el.classList.add('in-view');
            }
        });
    }

    /* ==========================================
       INTERSECTION OBSERVER HANDLERS
       ========================================== */

    /**
     * Handle one-time animation entries (.animate)
     */
    handleAnimateEntries(entries) {
        const isMobile = window.innerWidth <= this.breakpoints.mobile;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Skip mobile-only elements on desktop
                if (entry.target.classList.contains('animate-mobile-only') && !isMobile) {
                    return;
                }

                // Skip disable-mobile elements on mobile
                if (entry.target.classList.contains('animate-disable-mobile') && isMobile) {
                    return;
                }

                // Add 'in-view' class to trigger animation
                entry.target.classList.add('in-view');

                // Unobserve after animating (one-time only)
                this.animateObserver.unobserve(entry.target);
            }
        });
    }

    /**
     * Handle repeating animation entries (.animate-repeat)
     */
    handleAnimateRepeatEntries(entries) {
        const isMobile = window.innerWidth <= this.breakpoints.mobile;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Skip mobile-only elements on desktop
                if (entry.target.classList.contains('animate-mobile-only') && !isMobile) {
                    return;
                }

                // Skip disable-mobile elements on mobile
                if (entry.target.classList.contains('animate-disable-mobile') && isMobile) {
                    return;
                }

                // Add 'in-view' class to trigger animation
                entry.target.classList.add('in-view');
            } else {
                // Remove 'in-view' class when out of viewport
                // This allows the animation to reset and replay
                entry.target.classList.remove('in-view');
            }
        });
    }

    /**
     * Handle line animation entries (one-time)
     */
    handleLineEntries(entries) {
        const isMobile = window.innerWidth <= this.breakpoints.mobile;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Skip mobile-only elements on desktop
                if (entry.target.classList.contains('animate-mobile-only') && !isMobile) {
                    return;
                }

                // Skip disable-mobile elements on mobile
                if (entry.target.classList.contains('animate-disable-mobile') && isMobile) {
                    return;
                }

                // Add 'in-view' class to trigger line animation
                entry.target.classList.add('in-view');

                // Line animations are one-time, so unobserve
                this.lineObserver.unobserve(entry.target);
            }
        });
    }

    /**
     * Handle repeating line animation entries (.line-animate-repeat)
     */
    handleLineRepeatEntries(entries) {
        const isMobile = window.innerWidth <= this.breakpoints.mobile;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Skip mobile-only elements on desktop
                if (entry.target.classList.contains('animate-mobile-only') && !isMobile) {
                    return;
                }

                // Skip disable-mobile elements on mobile
                if (entry.target.classList.contains('animate-disable-mobile') && isMobile) {
                    return;
                }

                // Add 'in-view' class to trigger line animation
                entry.target.classList.add('in-view');
            } else {
                // Remove 'in-view' class when out of viewport
                // This allows the animation to reset and replay
                entry.target.classList.remove('in-view');
            }
        });
    }

    /* ==========================================
       RESPONSIVE ANIMATIONS
       ========================================== */

    /**
     * Initialize responsive animation system
     * Allows different animations on mobile vs desktop
     */
    initializeResponsiveAnimations() {
        // Store current breakpoint to detect changes
        this.currentBreakpoint = this.getCurrentBreakpoint();

        // Find all elements with responsive animation data attributes
        this.updateResponsiveElements();

        // Apply initial animations based on current viewport
        this.applyResponsiveAnimations();

        // Listen for window resize with debouncing
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newBreakpoint = this.getCurrentBreakpoint();

                // Only reapply if breakpoint actually changed
                if (newBreakpoint !== this.currentBreakpoint) {
                    this.currentBreakpoint = newBreakpoint;
                    this.applyResponsiveAnimations();
                }
            }, 150);
        });
    }

    /**
     * Get current breakpoint
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width <= this.breakpoints.mobile) {
            return 'mobile';
        } else if (width <= this.breakpoints.tablet) {
            return 'tablet';
        } else if (width <= this.breakpoints.desktop) {
            return 'desktop';
        } else {
            return 'widescreen';
        }
    }

    /**
     * Update list of responsive elements
     */
    updateResponsiveElements() {
        this.responsiveElements = document.querySelectorAll('[data-mobile-animation], [data-tablet-animation], [data-desktop-animation], [data-widescreen-animation], [data-mobile-delay], [data-tablet-delay], [data-desktop-delay], [data-widescreen-delay], [data-mobile-line-top-delay], [data-tablet-line-top-delay], [data-desktop-line-top-delay], [data-widescreen-line-top-delay], [data-mobile-line-bottom-delay], [data-tablet-line-bottom-delay], [data-desktop-line-bottom-delay], [data-widescreen-line-bottom-delay], [data-mobile-line-left-delay], [data-tablet-line-left-delay], [data-desktop-line-left-delay], [data-widescreen-line-left-delay], [data-mobile-line-right-delay], [data-tablet-line-right-delay], [data-desktop-line-right-delay], [data-widescreen-line-right-delay], [data-mobile-line], [data-tablet-line], [data-desktop-line], [data-widescreen-line]');
    }

    /**
     * Apply appropriate animations based on current viewport size
     */
    applyResponsiveAnimations() {
        const breakpoint = this.getCurrentBreakpoint();

        // Apply animations for each responsive element
        this.responsiveElements.forEach(element => {
            this.updateElementAnimation(element, breakpoint);
        });
    }

    /**
     * Update animation classes for a single element based on breakpoint
     */
    updateElementAnimation(element, breakpoint) {
        const mobileAnimation = element.dataset.mobileAnimation;
        const tabletAnimation = element.dataset.tabletAnimation;
        const desktopAnimation = element.dataset.desktopAnimation;
        const widescreenAnimation = element.dataset.widescreenAnimation;

        const mobileDelay = element.dataset.mobileDelay;
        const tabletDelay = element.dataset.tabletDelay;
        const desktopDelay = element.dataset.desktopDelay;
        const widescreenDelay = element.dataset.widescreenDelay;

        // Line direction delays
        const mobileLineTopDelay = element.dataset.mobileLineTopDelay;
        const tabletLineTopDelay = element.dataset.tabletLineTopDelay;
        const desktopLineTopDelay = element.dataset.desktopLineTopDelay;
        const widescreenLineTopDelay = element.dataset.widescreenLineTopDelay;

        const mobileLineBottomDelay = element.dataset.mobileLineBottomDelay;
        const tabletLineBottomDelay = element.dataset.tabletLineBottomDelay;
        const desktopLineBottomDelay = element.dataset.desktopLineBottomDelay;
        const widescreenLineBottomDelay = element.dataset.widescreenLineBottomDelay;

        const mobileLineLeftDelay = element.dataset.mobileLineLeftDelay;
        const tabletLineLeftDelay = element.dataset.tabletLineLeftDelay;
        const desktopLineLeftDelay = element.dataset.desktopLineLeftDelay;
        const widescreenLineLeftDelay = element.dataset.widescreenLineLeftDelay;

        const mobileLineRightDelay = element.dataset.mobileLineRightDelay;
        const tabletLineRightDelay = element.dataset.tabletLineRightDelay;
        const desktopLineRightDelay = element.dataset.desktopLineRightDelay;
        const widescreenLineRightDelay = element.dataset.widescreenLineRightDelay;

        // List of all possible animation classes to remove
        const allAnimationClasses = [
            // Fade animations
            'fade-in', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'fade-all',
            // Slide animations
            'slide-up', 'slide-down', 'slide-left', 'slide-right',
            // Fill animations
            'fill', 'fill-left', 'fill-right', 'fill-up', 'fill-down',
            // Wipe animations
            'wipe-right', 'wipe-left', 'wipe-down', 'wipe-up',
            // Scale animations
            'scale-up', 'zoom-in', 'zoom-out',
            // Flip animations
            'flip-x', 'flip-y',
            // Combined animations
            'slide-up-scale', 'slide-down-scale', 'slide-left-scale', 'slide-right-scale'
        ];

        // Remove 'in-view' class to reset animation
        const wasInView = element.classList.contains('in-view');
        element.classList.remove('in-view');

        // Remove all existing animation classes
        allAnimationClasses.forEach(className => {
            element.classList.remove(className);
        });

        // Add the appropriate animation class based on breakpoint
        let newAnimation = null;
        let newDelay = null;

        if (breakpoint === 'mobile' && mobileAnimation) {
            newAnimation = mobileAnimation;
            newDelay = mobileDelay;
        } else if (breakpoint === 'tablet') {
            // Use tablet animation if available, otherwise fall back to mobile or desktop
            newAnimation = tabletAnimation || mobileAnimation || desktopAnimation;
            newDelay = tabletDelay || mobileDelay || desktopDelay;
        } else if (breakpoint === 'desktop') {
            // Use desktop animation if available, otherwise fall back to tablet or mobile
            newAnimation = desktopAnimation || tabletAnimation || mobileAnimation;
            newDelay = desktopDelay || tabletDelay || mobileDelay;
        } else if (breakpoint === 'widescreen') {
            // Use widescreen animation if available, otherwise fall back to desktop, tablet, or mobile
            newAnimation = widescreenAnimation || desktopAnimation || tabletAnimation || mobileAnimation;
            newDelay = widescreenDelay || desktopDelay || tabletDelay || mobileDelay;
        }

        // Apply the new animation class
        if (newAnimation) {
            element.classList.add(newAnimation);
        }

        // Apply the new delay via CSS custom property
        if (newDelay) {
            element.style.setProperty('--delay', newDelay);
        } else {
            // Keep existing delay from inline style if no responsive delay is specified
            // Only remove --delay if it was set by responsive system before
            if (element.dataset.hasResponsiveDelay === 'true') {
                element.style.removeProperty('--delay');
            }
        }

        // Mark that this element has responsive delay
        if (mobileDelay || tabletDelay || desktopDelay) {
            element.dataset.hasResponsiveDelay = 'true';
        }

        // Apply line-top delay
        let newLineTopDelay = null;
        if (breakpoint === 'mobile') {
            newLineTopDelay = mobileLineTopDelay;
        } else if (breakpoint === 'tablet') {
            newLineTopDelay = tabletLineTopDelay || mobileLineTopDelay || desktopLineTopDelay;
        } else if (breakpoint === 'desktop') {
            newLineTopDelay = desktopLineTopDelay || tabletLineTopDelay || mobileLineTopDelay;
        } else if (breakpoint === 'widescreen') {
            newLineTopDelay = widescreenLineTopDelay || desktopLineTopDelay || tabletLineTopDelay || mobileLineTopDelay;
        }

        if (newLineTopDelay) {
            element.style.setProperty('--line-top-delay', newLineTopDelay);
        } else if (element.dataset.hasResponsiveLineDelays === 'true') {
            element.style.removeProperty('--line-top-delay');
        }

        // Apply line-bottom delay
        let newLineBottomDelay = null;
        if (breakpoint === 'mobile') {
            newLineBottomDelay = mobileLineBottomDelay;
        } else if (breakpoint === 'tablet') {
            newLineBottomDelay = tabletLineBottomDelay || mobileLineBottomDelay || desktopLineBottomDelay;
        } else if (breakpoint === 'desktop') {
            newLineBottomDelay = desktopLineBottomDelay || tabletLineBottomDelay || mobileLineBottomDelay;
        } else if (breakpoint === 'widescreen') {
            newLineBottomDelay = widescreenLineBottomDelay || desktopLineBottomDelay || tabletLineBottomDelay || mobileLineBottomDelay;
        }

        if (newLineBottomDelay) {
            element.style.setProperty('--line-bottom-delay', newLineBottomDelay);
        } else if (element.dataset.hasResponsiveLineDelays === 'true') {
            element.style.removeProperty('--line-bottom-delay');
        }

        // Apply line-left delay
        let newLineLeftDelay = null;
        if (breakpoint === 'mobile') {
            newLineLeftDelay = mobileLineLeftDelay;
        } else if (breakpoint === 'tablet') {
            newLineLeftDelay = tabletLineLeftDelay || mobileLineLeftDelay || desktopLineLeftDelay;
        } else if (breakpoint === 'desktop') {
            newLineLeftDelay = desktopLineLeftDelay || tabletLineLeftDelay || mobileLineLeftDelay;
        } else if (breakpoint === 'widescreen') {
            newLineLeftDelay = widescreenLineLeftDelay || desktopLineLeftDelay || tabletLineLeftDelay || mobileLineLeftDelay;
        }

        if (newLineLeftDelay) {
            element.style.setProperty('--line-left-delay', newLineLeftDelay);
        } else if (element.dataset.hasResponsiveLineDelays === 'true') {
            element.style.removeProperty('--line-left-delay');
        }

        // Apply line-right delay
        let newLineRightDelay = null;
        if (breakpoint === 'mobile') {
            newLineRightDelay = mobileLineRightDelay;
        } else if (breakpoint === 'tablet') {
            newLineRightDelay = tabletLineRightDelay || mobileLineRightDelay || desktopLineRightDelay;
        } else if (breakpoint === 'desktop') {
            newLineRightDelay = desktopLineRightDelay || tabletLineRightDelay || mobileLineRightDelay;
        } else if (breakpoint === 'widescreen') {
            newLineRightDelay = widescreenLineRightDelay || desktopLineRightDelay || tabletLineRightDelay || mobileLineRightDelay;
        }

        if (newLineRightDelay) {
            element.style.setProperty('--line-right-delay', newLineRightDelay);
        } else if (element.dataset.hasResponsiveLineDelays === 'true') {
            element.style.removeProperty('--line-right-delay');
        }

        // Mark that this element has responsive line delays
        if (mobileLineTopDelay || tabletLineTopDelay || desktopLineTopDelay || widescreenLineTopDelay ||
            mobileLineBottomDelay || tabletLineBottomDelay || desktopLineBottomDelay || widescreenLineBottomDelay ||
            mobileLineLeftDelay || tabletLineLeftDelay || desktopLineLeftDelay || widescreenLineLeftDelay ||
            mobileLineRightDelay || tabletLineRightDelay || desktopLineRightDelay || widescreenLineRightDelay) {
            element.dataset.hasResponsiveLineDelays = 'true';
        }

        // Handle responsive line directions (data-mobile-line, data-tablet-line, data-desktop-line, data-widescreen-line)
        const mobileLine = element.dataset.mobileLine;
        const tabletLine = element.dataset.tabletLine;
        const desktopLine = element.dataset.desktopLine;
        const widescreenLine = element.dataset.widescreenLine;

        // Only process if element has responsive line direction attributes
        if (mobileLine || tabletLine || desktopLine || widescreenLine) {
            // Store original line classes on first run
            if (!element.dataset.originalLineClasses) {
                const originalClasses = [];
                if (element.classList.contains('line-top')) originalClasses.push('line-top');
                if (element.classList.contains('line-bottom')) originalClasses.push('line-bottom');
                if (element.classList.contains('line-left')) originalClasses.push('line-left');
                if (element.classList.contains('line-right')) originalClasses.push('line-right');
                element.dataset.originalLineClasses = originalClasses.join(' ') || 'none';
            }

            // Line direction classes to manage
            const lineDirectionClasses = ['line-top', 'line-bottom', 'line-left', 'line-right'];

            // Remove all current line direction classes
            lineDirectionClasses.forEach(cls => element.classList.remove(cls));

            // Determine which line direction to apply based on breakpoint
            let newLineDirection = null;
            if (breakpoint === 'mobile') {
                newLineDirection = mobileLine;
            } else if (breakpoint === 'tablet') {
                newLineDirection = tabletLine || mobileLine || desktopLine;
            } else if (breakpoint === 'desktop') {
                newLineDirection = desktopLine || tabletLine || mobileLine;
            } else if (breakpoint === 'widescreen') {
                newLineDirection = widescreenLine || desktopLine || tabletLine || mobileLine;
            }

            // Fall back to original classes if no responsive value for this breakpoint
            if (!newLineDirection && element.dataset.originalLineClasses !== 'none') {
                newLineDirection = element.dataset.originalLineClasses;
            }

            // Apply the line direction class(es)
            if (newLineDirection) {
                // Support multiple classes (e.g., "line-top line-left")
                newLineDirection.split(' ').forEach(cls => {
                    if (cls && lineDirectionClasses.includes(cls)) {
                        element.classList.add(cls);
                    }
                });
            }
        }

        // Re-trigger animation if element was already in view
        if (wasInView) {
            // Small delay to ensure CSS transition works
            requestAnimationFrame(() => {
                element.classList.add('in-view');
            });
        }
    }

    /* ==========================================
       PUBLIC API
       ========================================== */

    /**
     * Refresh observers (useful when dynamically adding elements)
     */
    refresh() {
        // Disconnect existing observers
        this.animateObserver.disconnect();
        this.animateRepeatObserver.disconnect();
        this.lineObserver.disconnect();
        this.lineRepeatObserver.disconnect();

        // Re-observe all elements
        this.observeElements();

        // Update responsive elements
        this.updateResponsiveElements();
        this.applyResponsiveAnimations();
    }

    /**
     * Destroy all observers
     */
    destroy() {
        this.animateObserver.disconnect();
        this.animateRepeatObserver.disconnect();
        this.lineObserver.disconnect();
        this.lineRepeatObserver.disconnect();
    }
}

/* ==========================================
   INITIALIZE ANIMATION SYSTEM
   ========================================== */

// Initialize animation system when DOM is ready
// Attached to window for global access and debugging
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.animationSystem = new AnimationSystem();
    });
} else {
    // DOM already loaded
    window.animationSystem = new AnimationSystem();
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationSystem;
}