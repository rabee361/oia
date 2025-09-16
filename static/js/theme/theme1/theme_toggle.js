// 🌙 Theme Toggle Functionality
(function() {
    'use strict';

    // 🎯 Theme Configuration
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };

    const STORAGE_KEY = 'ecomus-theme-preference';

    // 🔍 Get DOM elements
    let themeToggleBtn;
    let currentTheme = THEMES.LIGHT;

    // 🚀 Initialize theme system
    function initTheme() {
        // Get saved theme preference or detect system preference
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        currentTheme = savedTheme || (systemPrefersDark ? THEMES.DARK : THEMES.LIGHT);

        // Apply initial theme
        applyTheme(currentTheme);

        // Setup event listeners
        setupEventListeners();

        console.log(`🎨 Theme initialized: ${currentTheme}`);
    }

    // 🎨 Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        currentTheme = theme;

        // Save preference
        localStorage.setItem(STORAGE_KEY, theme);

        // Update button state
        updateToggleButton();

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }

    // 🔄 Toggle between themes
    function toggleTheme() {
        const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        applyTheme(newTheme);

        // Add visual feedback
        addToggleAnimation();

        console.log(`🔄 Theme switched to: ${newTheme}`);
    }

    // 🎭 Update toggle button appearance
    function updateToggleButton() {
        if (!themeToggleBtn) return;

        if (currentTheme === THEMES.DARK) {
            themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
            themeToggleBtn.title = 'Switch to light mode';
        } else {
            themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
            themeToggleBtn.title = 'Switch to dark mode';
        }
    }

    // ✨ Add toggle animation
    function addToggleAnimation() {
        if (!themeToggleBtn) return;

        themeToggleBtn.style.transform = 'scale(0.9)';

        setTimeout(() => {
            themeToggleBtn.style.transform = 'scale(1)';
        }, 150);
    }

    // 🎧 Setup event listeners
    function setupEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindEvents);
        } else {
            bindEvents();
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
            }
        });
    }

    // 🔗 Bind event handlers
    function bindEvents() {
        themeToggleBtn = document.getElementById('themeToggle');

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', toggleTheme);
            updateToggleButton();
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    // 🔄 Public API
    window.ThemeToggle = {
        getCurrentTheme: () => currentTheme,
        setTheme: applyTheme,
        toggleTheme: toggleTheme,
        isLight: () => currentTheme === THEMES.LIGHT,
        isDark: () => currentTheme === THEMES.DARK
    };

    // 🚀 Initialize when script loads
    initTheme();

})();