// OTP input auto-focus functionality
document.addEventListener('DOMContentLoaded', function() {
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index) => {
        // Handle input changes (typing)
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Handle backspace key
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        // Handle paste event
        input.addEventListener('paste', function(e) {
            // Prevent default paste behavior
            e.preventDefault();
            
            // Get pasted data
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            
            // Remove any non-digit characters and limit to 6 digits
            const digits = pastedData.replace(/\D/g, '').substring(0, 6).split('');
            
            // Fill the OTP inputs with pasted digits
            digits.forEach((digit, i) => {
                if (i < otpInputs.length) {
                    otpInputs[i].value = digit;
                }
            });
            
            // Focus on the next empty input or the last input
            const nextIndex = Math.min(digits.length, otpInputs.length - 1);
            otpInputs[nextIndex].focus();
        });
    });
    
    // Timer functionality
    const timerElement = document.getElementById('timer');
    const resendButton = document.getElementById('resend-btn');
    
    if (timerElement && resendButton) {
        let seconds = 20;
        
        const updateTimer = () => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            if (seconds <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = '00:00';
                resendButton.disabled = false;
            }
            
            seconds--;
        };
        
        // Initial update
        updateTimer();
        
        // Update timer every second
        const timerInterval = setInterval(updateTimer, 1000);
    }
});