document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const infoBar = document.querySelector('.info-bar');
    const infoHamburger = document.querySelector('.info-hamburger');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');
    
    // Hide info bar on scroll
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide info bar
            infoBar.classList.add('hidden');
        } else {
            // Scrolling up - show info bar
            infoBar.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Handle hamburger menu toggle
    if (infoHamburger) {
        infoHamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.body.style.overflow = mobileSidebar.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Handle sidebar close
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            infoHamburger.classList.remove('active');
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close sidebar when clicking on overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            infoHamburger.classList.remove('active');
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});