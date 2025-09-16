// Language Switcher Functionality
class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('selectedLanguage') || 'en';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCurrentLanguage();
        this.loadLanguageContent();
    }

    bindEvents() {
        // Language toggle button
        const languageToggle = document.getElementById('language-toggle');
        const languageDropdown = document.getElementById('language-dropdown');
        
        if (languageToggle && languageDropdown) {
            languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });

            // Language option selection
            const languageOptions = document.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = option.dataset.lang;
                    this.selectLanguage(lang);
                });
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
                    this.closeDropdown();
                }
            });

            // Close dropdown on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeDropdown();
                }
            });
        }
    }

    toggleDropdown() {
        const dropdown = document.getElementById('language-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    closeDropdown() {
        const dropdown = document.getElementById('language-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    selectLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        this.updateCurrentLanguage();
        this.loadLanguageContent();
        this.closeDropdown();

        // Show language change notification
        this.showLanguageNotification(lang);
    }

    updateCurrentLanguage() {
        const currentLangElement = document.querySelector('.current-lang');
        const languageMap = {
            'en': 'EN',
            'es': 'ES', 
            'fr': 'FR',
            'ar': 'AR'
        };

        if (currentLangElement) {
            currentLangElement.textContent = languageMap[this.currentLang] || 'EN';
        }

        // Update active state in dropdown
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === this.currentLang) {
                option.classList.add('active');
            }
        });
    }

    loadLanguageContent() {
        // This method can be extended to load actual language content
        // For now, it updates the document direction for RTL languages
        const rtlLanguages = ['ar'];
        const isRTL = rtlLanguages.includes(this.currentLang);
        
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;

        // Update any text content based on language
        this.updateTextContent();
    }

    updateTextContent() {
        // Language content map - in a real application, this would come from a translation service
        const translations = {
            'en': {
                'search-placeholder': 'Search products...',
                'cart-text': 'Cart',
                'wishlist-text': 'Wishlist'
            },
            'es': {
                'search-placeholder': 'Buscar productos...',
                'cart-text': 'Carrito', 
                'wishlist-text': 'Lista de deseos'
            },
            'fr': {
                'search-placeholder': 'Rechercher des produits...',
                'cart-text': 'Panier',
                'wishlist-text': 'Liste de souhaits'
            },
            'ar': {
                'search-placeholder': 'ابحث عن المنتجات...',
                'cart-text': 'عربة التسوق',
                'wishlist-text': 'قائمة الأمنيات'
            }
        };

        const currentTranslations = translations[this.currentLang] || translations['en'];
        
        // Update search placeholder
        const searchInput = document.getElementById('search-input-nav');
        if (searchInput && currentTranslations['search-placeholder']) {
            searchInput.placeholder = currentTranslations['search-placeholder'];
        }

        // Update other translatable elements
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.dataset.translate;
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            }
        });
    }

    showLanguageNotification(lang) {
        const languageNames = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'ar': 'العربية'
        };

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.innerHTML = `
            <i class="fas fa-globe"></i>
            <span>Language changed to ${languageNames[lang]}</span>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: var(--accent-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 2001;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    setLanguage(lang) {
        this.selectLanguage(lang);
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
}