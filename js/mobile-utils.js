// Pull to Refresh
class PullToRefresh {
    constructor(options) {
        this.container = options.container;
        this.onRefresh = options.onRefresh;
        this.threshold = 150;
        this.pullStartY = 0;
        this.refreshing = false;

        this.setupPullIndicator();
        this.setupEventListeners();
    }

    setupPullIndicator() {
        this.pullIndicator = document.createElement('div');
        this.pullIndicator.className = 'pull-indicator';
        this.pullIndicator.innerHTML = `
            <div class="pull-spinner">
                <i class="fas fa-sync-alt"></i>
            </div>
            <span class="pull-text">Pull to refresh</span>
        `;
        this.container.prepend(this.pullIndicator);
    }

    setupEventListeners() {
        this.container.addEventListener('touchstart', (e) => {
            if (this.container.scrollTop === 0 && !this.refreshing) {
                this.pullStartY = e.touches[0].clientY;
            }
        });

        this.container.addEventListener('touchmove', (e) => {
            if (this.pullStartY === 0 || this.refreshing) return;

            const pullDistance = e.touches[0].clientY - this.pullStartY;
            if (pullDistance > 0 && this.container.scrollTop === 0) {
                e.preventDefault();
                this.pullIndicator.style.transform = `translateY(${Math.min(pullDistance, this.threshold)}px)`;
                
                if (pullDistance > this.threshold) {
                    this.pullIndicator.querySelector('.pull-text').textContent = 'Release to refresh';
                } else {
                    this.pullIndicator.querySelector('.pull-text').textContent = 'Pull to refresh';
                }
            }
        });

        this.container.addEventListener('touchend', () => {
            if (this.pullStartY === 0) return;

            const pullDistance = parseInt(this.pullIndicator.style.transform.replace('translateY(', ''));
            if (pullDistance >= this.threshold) {
                this.startRefresh();
            } else {
                this.resetPull();
            }
            this.pullStartY = 0;
        });
    }

    startRefresh() {
        this.refreshing = true;
        this.pullIndicator.classList.add('refreshing');
        this.pullIndicator.style.transform = 'translateY(50px)';
        this.pullIndicator.querySelector('.pull-text').textContent = 'Refreshing...';

        this.onRefresh().finally(() => {
            setTimeout(() => this.endRefresh(), 500);
        });
    }

    endRefresh() {
        this.refreshing = false;
        this.pullIndicator.classList.remove('refreshing');
        this.resetPull();
    }

    resetPull() {
        this.pullIndicator.style.transform = 'translateY(0)';
        this.pullIndicator.querySelector('.pull-text').textContent = 'Pull to refresh';
    }
}

// Touch Gestures Handler
class TouchGestureHandler {
    constructor(options) {
        this.element = options.element;
        this.onSwipeLeft = options.onSwipeLeft;
        this.onSwipeRight = options.onSwipeRight;
        this.onDoubleTap = options.onDoubleTap;
        this.onLongPress = options.onLongPress;
        this.onPinch = options.onPinch;

        this.setupHammer();
    }

    setupHammer() {
        const hammer = new Hammer(this.element);
        hammer.get('pinch').set({ enable: true });
        hammer.get('doubletap').set({ enable: true });
        hammer.get('press').set({ time: 500 });

        hammer.on('swipeleft', (e) => this.onSwipeLeft?.(e));
        hammer.on('swiperight', (e) => this.onSwipeRight?.(e));
        hammer.on('doubletap', (e) => this.onDoubleTap?.(e));
        hammer.on('press', (e) => this.onLongPress?.(e));
        hammer.on('pinch', (e) => this.onPinch?.(e));
    }
}

// Mobile Navigation Handler
class MobileNavigation {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggle = document.querySelector('.mobile-nav-toggle');
        this.backdrop = this.createBackdrop();
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.currentX = 0;
        this.sidebarWidth = this.sidebar.offsetWidth;

        this.setupEventListeners();
        this.setupGestureHandling();
    }

    createBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-nav-backdrop';
        document.body.appendChild(backdrop);
        return backdrop;
    }

    setupEventListeners() {
        // Toggle button click
        this.toggle.addEventListener('click', () => this.toggleSidebar());

        // Backdrop click
        this.backdrop.addEventListener('click', () => this.closeSidebar());

        // Handle route changes for bottom navigation
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Close sidebar on window resize if open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeSidebar();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });
    }

    setupGestureHandling() {
        // Touch events for swipe gestures
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', () => this.handleTouchEnd());

        // Hammer.js for additional gestures
        if (typeof Hammer !== 'undefined') {
            const hammer = new Hammer(document.body);
            hammer.on('swiperight', (e) => {
                if (e.center.x < 50 && !this.isOpen) {
                    this.openSidebar();
                }
            });

            hammer.on('swipeleft', () => {
                if (this.isOpen) {
                    this.closeSidebar();
                }
            });
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.currentX = this.touchStartX;
    }

    handleTouchMove(e) {
        if (!this.touchStartX) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchX - this.touchStartX;
        const deltaY = touchY - this.touchStartY;

        // Check if scrolling vertically
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;

        // Prevent default only when handling horizontal swipe
        if (
            (this.isOpen && deltaX < 0) || // Swiping left while open
            (!this.isOpen && deltaX > 0 && this.touchStartX < 50) // Swiping right from edge while closed
        ) {
            e.preventDefault();
        }

        this.currentX = touchX;

        if (this.isOpen) {
            const translateX = Math.min(0, deltaX);
            this.sidebar.style.transform = `translateX(calc(100% + ${translateX}px))`;
        } else if (this.touchStartX < 50) {
            const translateX = Math.max(0, deltaX);
            this.sidebar.style.transform = `translateX(${translateX}px)`;
            this.sidebar.classList.add('swiping');
        }
    }

    handleTouchEnd() {
        if (!this.touchStartX) return;

        const deltaX = this.currentX - this.touchStartX;
        const threshold = this.sidebarWidth * 0.3;

        if (this.isOpen && deltaX < -threshold) {
            this.closeSidebar();
        } else if (!this.isOpen && deltaX > threshold && this.touchStartX < 50) {
            this.openSidebar();
        } else {
            this.sidebar.style.transform = this.isOpen ? 'translateX(100%)' : 'translateX(0)';
        }

        this.touchStartX = 0;
        this.currentX = 0;
        this.sidebar.classList.remove('swiping');
    }

    openSidebar() {
        this.isOpen = true;
        this.sidebar.classList.add('show');
        this.backdrop.classList.add('show');
        this.toggle.classList.add('active');
        document.body.classList.add('sidebar-open');
        this.sidebar.style.transform = 'translateX(100%)';
    }

    closeSidebar() {
        this.isOpen = false;
        this.sidebar.classList.remove('show');
        this.backdrop.classList.remove('show');
        this.toggle.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        this.sidebar.style.transform = 'translateX(0)';
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
}

// Breadcrumb Handler
class BreadcrumbHandler {
    constructor() {
        this.breadcrumb = document.querySelector('.breadcrumb');
        this.setupMobileBreadcrumb();
    }

    setupMobileBreadcrumb() {
        if (!this.breadcrumb) return;

        // Create mobile breadcrumb
        const mobileBreadcrumb = document.createElement('div');
        mobileBreadcrumb.className = 'breadcrumb show-on-mobile';
        mobileBreadcrumb.innerHTML = this.breadcrumb.innerHTML;

        // Insert after top bar
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            topBar.parentNode.insertBefore(mobileBreadcrumb, topBar.nextSibling);
        }
    }
}

// Mobile-specific Animations
const mobileAnimations = {
    fadeIn: (element, delay = 0) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.transitionDelay = `${delay}s`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    },

    slideIn: (element, direction = 'left', delay = 0) => {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)'
        };

        element.style.transform = transforms[direction];
        element.style.transition = 'transform 0.3s ease';
        element.style.transitionDelay = `${delay}s`;

        requestAnimationFrame(() => {
            element.style.transform = 'translate(0)';
        });
    },

    scaleIn: (element, delay = 0) => {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.9)';
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.transitionDelay = `${delay}s`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
};

// Export utilities
export { PullToRefresh, TouchGestureHandler, MobileNavigation, mobileAnimations };

// Initialize mobile features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
    new BreadcrumbHandler();
}); 