document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarThemeToggle = document.getElementById('sidebarThemeToggle');
    const navbarThemeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Toggle sidebar visibility on mobile
    function toggleSidebar() {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');

            // Update hamburger icon
            const icon = hamburgerMenu.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }

    // Close sidebar when clicking overlay
    function closeSidebar() {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');

            // Reset hamburger icon
            const icon = hamburgerMenu.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    // Sync theme toggle buttons
    function syncThemeToggles() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const isDark = currentTheme === 'dark';

        // Update both theme toggle buttons
        if (navbarThemeToggle) {
            updateThemeToggleIcon(navbarThemeToggle, isDark);
        }
        if (sidebarThemeToggle) {
            updateThemeToggleIcon(sidebarThemeToggle, isDark);
        }
    }

    // Update theme toggle icon
    function updateThemeToggleIcon(button, isDark) {
        const icon = button.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Handle theme toggle from sidebar
    function handleSidebarThemeToggle() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);

        // Sync both toggle buttons
        syncThemeToggles();

        // Close sidebar on mobile after theme change
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    }

    // Event listeners
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    if (sidebarThemeToggle) {
        sidebarThemeToggle.addEventListener('click', handleSidebarThemeToggle);
    }

    // Close sidebar when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // Handle escape key to close sidebar
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // Initialize theme sync
    syncThemeToggles();

    // Listen for theme changes from navbar toggle
    if (navbarThemeToggle) {
        navbarThemeToggle.addEventListener('click', function() {
            // Small delay to ensure theme has been updated
            setTimeout(syncThemeToggles, 50);
        });
    }
});