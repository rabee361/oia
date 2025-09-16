// 🌐 Language Switcher with HTMX
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    const currentLangSpan = document.getElementById('currentLang');
    
    // 🎯 Language configuration
    const LANGUAGES = {
        'en': { code: 'en', name: 'English', display: 'EN', dir: 'ltr' },
        'ar': { code: 'ar', name: 'Arabic', display: 'AR', dir: 'rtl' }
    };
    
    // 🔍 Get current language from localStorage or default
    let currentLang = localStorage.getItem('language') || 'en';
    
    // 🎨 Update UI with current language
    function updateLanguageDisplay() {
        const lang = LANGUAGES[currentLang];
        if (currentLangSpan && lang) {
            currentLangSpan.textContent = lang.display;
        }
        
        // Update document attributes
        document.documentElement.setAttribute('lang', lang.code);
        document.documentElement.setAttribute('dir', lang.dir);
    }
    
    // 🔄 Simple form submission approach
    function switchLanguage() {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('language', newLang);
        
        // Create and submit form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/set_language/';
        
        // Add CSRF token
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfmiddlewaretoken';
        csrfInput.value = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // Add language input
        const langInput = document.createElement('input');
        langInput.type = 'hidden';
        langInput.name = 'language';
        langInput.value = newLang;
        
        form.appendChild(csrfInput);
        form.appendChild(langInput);
        document.body.appendChild(form);
        form.submit();
    }
    
    // 🎧 Event listener
    if (languageToggle) {
        languageToggle.addEventListener('click', switchLanguage);
    }
    
    // 🚀 Initialize
    updateLanguageDisplay();
});
