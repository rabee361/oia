class CardsAnimation {
    constructor() {
        this.currentCard = 1;
        this.totalCards = 4;
        this.cards = document.querySelectorAll('.register-card');
        this.nextButtons = document.querySelectorAll('.next-btn');
        this.submitButton = document.querySelector('.submit-btn');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupValidation();
        this.showCard(1);
    }

    setupEventListeners() {
        // Next button click handlers
        this.nextButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (this.validateCurrentCard()) {
                    this.nextCard();
                }
            });
        });

        // Submit button handler
        if (this.submitButton) {
            this.submitButton.addEventListener('click', () => {
                if (this.validateCurrentCard()) {
                    this.submitForm();
                }
            });
        }

        // Input validation listeners
        this.setupInputValidation();
    }

    setupInputValidation() {
        const inputs = document.querySelectorAll('[data-validation="required"]');

        inputs.forEach(input => {
            const events = input.type === 'checkbox' ? ['change'] : ['input', 'change'];

            events.forEach(event => {
                input.addEventListener(event, () => {
                    this.validateInput(input);
                    this.updateButtonState();
                });
            });
        });
    }

    validateInput(input) {
        let isValid = false;

        if (input.type === 'checkbox') {
            isValid = input.checked;
        } else if (input.tagName === 'SELECT') {
            isValid = input.value !== '';
        } else {
            isValid = input.value.trim() !== '';
        }

        // Visual feedback
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
        }

        return isValid;
    }

    validateCurrentCard() {
        const currentCardElement = document.querySelector(`[data-card="${this.currentCard}"]`);
        const requiredInputs = currentCardElement.querySelectorAll('[data-validation="required"]');

        let allValid = true;

        requiredInputs.forEach(input => {
            if (!this.validateInput(input)) {
                allValid = false;
            }
        });

        return allValid;
    }

    updateButtonState() {
        const currentCardElement = document.querySelector(`[data-card="${this.currentCard}"]`);
        const button = currentCardElement.querySelector('.next-btn, .submit-btn');

        if (button) {
            const isValid = this.validateCurrentCard();
            button.disabled = !isValid;

            if (isValid) {
                button.classList.add('enabled');
            } else {
                button.classList.remove('enabled');
            }
        }
    }

    showCard(cardNumber) {
        this.cards.forEach((card, index) => {
            const cardNum = index + 1;

            // Remove all classes first
            card.classList.remove('active', 'behind-1', 'behind-2', 'behind-3', 'slide-out');

            if (cardNum === cardNumber) {
                // Current active card (front)
                card.classList.add('active');
            } else if (cardNum < cardNumber) {
                // Cards that have been completed - slide out
                card.classList.add('slide-out');
            } else {
                // Cards behind the current one - stack them
                const behindLevel = cardNum - cardNumber;
                if (behindLevel <= 3) {
                    card.classList.add(`behind-${behindLevel}`);
                }
            }
        });

        this.currentCard = cardNumber;
        this.updateButtonState();
    }

    nextCard() {
        if (this.currentCard < this.totalCards) {
            // Immediately update to next card - the CSS transitions will handle the animation
            this.showCard(this.currentCard + 1);
        }
    }

    submitForm() {
        // Collect all form data
        const formData = this.collectFormData();

        // Here you would typically send the data to your Django backend
        console.log('Form Data:', formData);

        // Show success message or redirect
        this.showSuccessMessage();
    }

    collectFormData() {
        const data = {};
        const inputs = document.querySelectorAll('input, select');

        inputs.forEach(input => {
            if (input.name) {
                if (input.type === 'checkbox') {
                    data[input.name] = input.checked;
                } else {
                    data[input.name] = input.value;
                }
            }
        });

        return data;
    }

    showSuccessMessage() {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-message">
                <div class="success-icon">✓</div>
                <h2>تم إنشاء المتجر بنجاح!</h2>
                <p>سيتم توجيهك إلى لوحة التحكم...</p>
            </div>
        `;

        document.body.appendChild(overlay);

        // Redirect after 2 seconds
        setTimeout(() => {
            // Replace with your actual redirect URL
            window.location.href = '/dashboard/';
        }, 2000);
    }

    setupValidation() {
        // Add CSS classes for validation states
        const style = document.createElement('style');
        style.textContent = `
            .auth-input.error, .auth-select.error {
                border-color: #ef4444;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }

            .auth-input.valid, .auth-select.valid {
                border-color: #10b981;
            }

            .auth-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .auth-button.enabled {
                opacity: 1;
                cursor: pointer;
            }

            .success-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }

            .success-message {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                animation: slideUp 0.5s ease;
            }

            .success-icon {
                width: 60px;
                height: 60px;
                background: #10b981;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                margin: 0 auto 20px;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the cards animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CardsAnimation();
});