// 🚀 Auth Form Enhancement
document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggles
    initPasswordToggles();

    // Initialize form enhancements
    initFormEnhancements();
});

// Password Visibility Toggle
function initPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const eyeIcon = this.querySelector('.eye-icon');

            if (passwordInput) {
                if (passwordInput.type === 'password') {
                    // Show password
                    passwordInput.type = 'text';
                    eyeIcon.className = 'fas fa-eye-slash eye-icon';
                    this.setAttribute('aria-label', 'إخفاء كلمة المرور');
                } else {
                    // Hide password
                    passwordInput.type = 'password';
                    eyeIcon.className = 'fas fa-eye eye-icon';
                    this.setAttribute('aria-label', 'إظهار كلمة المرور');
                }
            }
        });

        // Set initial aria-label
        toggle.setAttribute('aria-label', 'إظهار كلمة المرور');
    });
}

// 🚀 Form Enhancement Functions
function initFormEnhancements() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const submitBtn = form.querySelector('.auth-button');
        const inputs = form.querySelectorAll('.auth-input');

        // Add loading state on form submit
        if (submitBtn) {
            form.addEventListener('submit', function() {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                if (form.id === 'loginForm') {
                    submitBtn.innerHTML = '⏳ جاري تسجيل الدخول...';
                } else if (form.id === 'signupForm') {
                    submitBtn.innerHTML = '⏳ جاري إنشاء الحساب...';
                }
            });
        }

        // Remove error state on input focus and add success state
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                const inputGroup = this.closest('.input-group');
                inputGroup.classList.remove('error');
                this.classList.remove('error');
            });

            // Add success state on valid input
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.classList.remove('error');
                    if (this.type === 'email' && this.validity.valid) {
                        this.classList.add('success');
                    } else if (this.type === 'password' && this.value.length >= 6) {
                        this.classList.add('success');
                    }
                } else {
                    this.classList.remove('success');
                }
            });
        });

        // Auto-focus first input with error
        const firstErrorInput = form.querySelector('.input-group.error .auth-input');
        if (firstErrorInput) {
            firstErrorInput.focus();
        }
    });
}
