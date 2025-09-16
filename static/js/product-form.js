// 📦 Product Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    'use strict';





    // 📝 Form Validation
    function initFormValidation() {
        const form = document.getElementById('productForm');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--danger-color)';
                    isValid = false;
                } else {
                    field.style.borderColor = 'var(--border-light)';
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('تم حفظ المنتج بنجاح!', 'success');
                
                // Here you would normally submit the form data
                console.log('Form submitted successfully');
            } else {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            }
        });
    }

    // 🔔 Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 🚀 Initialize all functionality
    function initProductForm() {
        initFormValidation();

        console.log('📦 Product form initialized successfully!');
    }

    // Start initialization
    initProductForm();
});
