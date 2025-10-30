// Scroll Navbar Functionality for Theme 3
// This script handles the navbar position changes when scrolling

class ScrollNavbar {
    constructor() {
        this.navbar = null;
        this.infoBar = null;
        this.middleSection = null;
        this.scrollThreshold = 40;
        this.isScrolled = false;
        this.lastScrollTop = 0;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Get navbar elements
        this.navbar = document.querySelector('.navbar');
        this.infoBar = document.querySelector('.info-bar');
        this.middleSection = document.querySelector('.middle-section');
        
        if (!this.navbar || !this.infoBar || !this.middleSection) {
            console.warn('Scroll navbar: Required elements not found');
            return;
        }
        
        // Add CSS classes for scroll behavior
        this.addScrollStyles();
        
        // Bind scroll event
        this.bindEvents();
    }
    
    addScrollStyles() {
        // Create style element for scroll behavior
        const style = document.createElement('style');
        style.textContent = `
            .navbar-scrolled {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                border-radius: 0 !important;
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
                transform: translateY(-50px);
                animation: slideDown 0.3s ease forwards;
                z-index: 1000 !important;
            }
            
            @keyframes slideDown {
                from {
                    transform: translateY(-50px);
                }
                to {
                    transform: translateY(0);
                }
            }
            
            .info-bar-hidden {
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }
            
            .middle-section-hidden {
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }
            
            /* Ensure smooth transitions */
            .info-bar, .middle-section {
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    bindEvents() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Handle resize to recalculate positions
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    onScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
        
        if (scrollTop > this.scrollThreshold && !this.isScrolled) {
            this.showScrolledNavbar();
        } else if (scrollTop <= this.scrollThreshold && this.isScrolled) {
            this.hideScrolledNavbar();
        }
        
        this.lastScrollTop = scrollTop;
    }
    
    showScrolledNavbar() {
        this.isScrolled = true;
        
        // Hide info bar and middle section
        this.infoBar.classList.add('info-bar-hidden');
        this.middleSection.classList.add('middle-section-hidden');
        
        // Show scrolled navbar
        setTimeout(() => {
            this.navbar.classList.add('navbar-scrolled');
        }, 150); // Small delay for smooth transition
    }
    
    hideScrolledNavbar() {
        this.isScrolled = false;
        
        // Hide scrolled navbar
        this.navbar.classList.remove('navbar-scrolled');
        
        // Show info bar and middle section
        setTimeout(() => {
            this.infoBar.classList.remove('info-bar-hidden');
            this.middleSection.classList.remove('middle-section-hidden');
        }, 150); // Small delay for smooth transition
    }
    
    handleResize() {
        // Recalculate on resize if needed
        if (window.innerWidth <= 768) {
            // On mobile, disable scroll behavior
            this.hideScrolledNavbar();
        }
    }
}

// Initialize the scroll navbar when the script loads
const scrollNavbar = new ScrollNavbar();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollNavbar;
}