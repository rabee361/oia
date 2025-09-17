// 🚀 Main JavaScript for Theme1
document.addEventListener('DOMContentLoaded', function() {

    // 🌐 Language Toggle Functionality
    initializeLanguageToggle();

    // 🛒 Cart Functionality
    initializeCartFunctionality();

    // 🛒 Checkout Functionality
    initializeCheckoutFunctionality();

    // ⬆️ Scroll to Top Button Functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        function toggleScrollButton() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        // Smooth scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Event listeners
        window.addEventListener('scroll', toggleScrollButton);
        scrollToTopBtn.addEventListener('click', scrollToTop);

        // Initial check
        toggleScrollButton();
    }

    // 📧 Newsletter Form Functionality
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');

    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = newsletterEmail.value.trim();

            if (email && isValidEmail(email)) {
                // Show success message
                showNotification('✅ Thank you for subscribing!', 'success');
                newsletterEmail.value = '';
            } else {
                // Show error message
                showNotification('❌ Please enter a valid email address.', 'error');
            }
        });
    }

    // 🔍 Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 🔔 Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'
        });

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 🎨 Footer Link Animations
    const footerLinks = document.querySelectorAll('.footer-link');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // 🌐 Social Media Link Analytics (Optional)
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.getAttribute('aria-label');
            console.log(`Social media click: ${platform}`);

            // Add your analytics tracking here
            // Example: gtag('event', 'social_click', { platform: platform });
        });
    });

    // 📱 Mobile Footer Accordion (Optional Enhancement)
    function initMobileFooterAccordion() {
        if (window.innerWidth <= 768) {
            const footerTitles = document.querySelectorAll('.footer-title');

            footerTitles.forEach(title => {
                if (!title.classList.contains('accordion-initialized')) {
                    title.classList.add('accordion-initialized');
                    title.style.cursor = 'pointer';

                    title.addEventListener('click', function() {
                        const column = this.parentElement;
                        const links = column.querySelector('.footer-links, .newsletter-form, .social-media');

                        if (links) {
                            const isOpen = links.style.display !== 'none';

                            // Close all other sections
                            document.querySelectorAll('.footer-column').forEach(col => {
                                const otherLinks = col.querySelector('.footer-links, .newsletter-form, .social-media');
                                if (otherLinks && otherLinks !== links) {
                                    otherLinks.style.display = 'none';
                                    col.querySelector('.footer-title').classList.remove('active');
                                }
                            });

                            // Toggle current section
                            links.style.display = isOpen ? 'none' : 'flex';
                            this.classList.toggle('active', !isOpen);
                        }
                    });

                    // Initially hide all sections except the first one
                    const column = title.parentElement;
                    const links = column.querySelector('.footer-links, .newsletter-form, .social-media');
                    if (links && !column.classList.contains('footer-brand')) {
                        links.style.display = 'none';
                    }
                }
            });
        }
    }

    // Initialize mobile accordion
    initMobileFooterAccordion();

    // Re-initialize on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset all footer sections to visible on desktop
            document.querySelectorAll('.footer-links, .newsletter-form, .social-media').forEach(element => {
                element.style.display = '';
            });
            document.querySelectorAll('.footer-title').forEach(title => {
                title.classList.remove('active');
            });
        } else {
            initMobileFooterAccordion();
        }
    });

    // 🎯 Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 🌟 Reviews Section Navigation
    const reviewsPrev = document.getElementById('reviewsPrev');
    const reviewsNext = document.getElementById('reviewsNext');
    const reviewsGrid = document.getElementById('reviewsGrid');

    if (reviewsPrev && reviewsNext && reviewsGrid) {
        let currentReviewIndex = 0;
        const reviewCards = reviewsGrid.querySelectorAll('.review-card');
        const totalReviews = reviewCards.length;
        const reviewsPerPage = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

        function updateReviewsDisplay() {
            reviewCards.forEach((card, index) => {
                if (index >= currentReviewIndex && index < currentReviewIndex + reviewsPerPage) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Update navigation buttons
            reviewsPrev.disabled = currentReviewIndex === 0;
            reviewsNext.disabled = currentReviewIndex + reviewsPerPage >= totalReviews;
        }

        reviewsPrev.addEventListener('click', () => {
            if (currentReviewIndex > 0) {
                currentReviewIndex = Math.max(0, currentReviewIndex - reviewsPerPage);
                updateReviewsDisplay();
            }
        });

        reviewsNext.addEventListener('click', () => {
            if (currentReviewIndex + reviewsPerPage < totalReviews) {
                currentReviewIndex = Math.min(totalReviews - reviewsPerPage, currentReviewIndex + reviewsPerPage);
                updateReviewsDisplay();
            }
        });

        // Initialize display
        updateReviewsDisplay();

        // Update on window resize
        window.addEventListener('resize', () => {
            const newReviewsPerPage = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
            if (newReviewsPerPage !== reviewsPerPage) {
                currentReviewIndex = 0;
                updateReviewsDisplay();
            }
        });
    }

    // ⭐ Star Rating Interaction (Optional Enhancement)
    const starRatings = document.querySelectorAll('.review-rating');

    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');

        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.style.transform = 'scale(1.2)';
                        s.style.color = 'var(--accent-orange)';
                    } else {
                        s.style.transform = 'scale(1)';
                        s.style.color = '#e5e5e5';
                    }
                });
            });
        });

        rating.addEventListener('mouseleave', () => {
            stars.forEach(star => {
                star.style.transform = 'scale(1)';
                if (star.classList.contains('filled')) {
                    star.style.color = 'var(--accent-orange)';
                } else {
                    star.style.color = '#e5e5e5';
                }
            });
        });
    });

    // 🍔 Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    console.log('🎉 Theme1 JavaScript initialized successfully!');
});

// 🛒 Cart Functionality
function initializeCartFunctionality() {
    // Initialize quantity change listeners
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            const newQuantity = parseInt(this.value);
            
            if (newQuantity < 1) {
                this.value = 1;
                return;
            }
            
            updateCartQuantity(productId, newQuantity);
        });
    });

    // Initialize cart calculation
    calculateCartTotals();
}

// 🔢 Update Quantity Function
function updateQuantity(productId, action) {
    const quantityInput = document.querySelector(`input[data-product-id="${productId}"]`);
    if (!quantityInput) return;

    let currentValue = parseInt(quantityInput.value);
    const maxValue = parseInt(quantityInput.max);
    const minValue = parseInt(quantityInput.min) || 1;

    if (action === 'increase' && currentValue < maxValue) {
        currentValue++;
    } else if (action === 'decrease' && currentValue > minValue) {
        currentValue--;
    }

    quantityInput.value = currentValue;
    updateCartQuantity(productId, currentValue);
}

// 🔄 Update Cart Quantity
function updateCartQuantity(productId, quantity) {
    // Show loading state
    showLoadingToast('Updating cart...');

    // Simulate API call (replace with actual AJAX call)
    setTimeout(() => {
        // Update the cart display
        calculateCartTotals();
        showSuccessToast('Cart updated successfully!');
        
        // Here you would normally make an AJAX call to update the backend
        // Example:
        // fetch('/cart/update/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': getCookie('csrftoken')
        //     },
        //     body: JSON.stringify({
        //         product_id: productId,
        //         quantity: quantity
        //     })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         calculateCartTotals();
        //         showSuccessToast('Cart updated successfully!');
        //     } else {
        //         showErrorToast('Failed to update cart');
        //     }
        // })
        // .catch(error => {
        //     showErrorToast('Network error occurred');
        // });
    }, 500);
}

// 🗑️ Remove Item from Cart
function removeFromCart(productId) {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
        return;
    }

    showLoadingToast('Removing item...');

    // Find and remove the cart item
    const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
    if (cartItem) {
        cartItem.style.opacity = '0.5';
        cartItem.style.pointerEvents = 'none';
        
        setTimeout(() => {
            cartItem.remove();
            calculateCartTotals();
            showSuccessToast('Item removed from cart');
            
            // Check if cart is empty
            const remainingItems = document.querySelectorAll('.cart-item');
            if (remainingItems.length === 0) {
                showEmptyCartState();
            }
        }, 300);
    }

    // Here you would normally make an AJAX call to remove from backend
    // fetch('/cart/remove/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': getCookie('csrftoken')
    //     },
    //     body: JSON.stringify({ product_id: productId })
    // })
}

// 💗 Save for Later
function saveForLater(productId) {
    showLoadingToast('Saving for later...');
    
    setTimeout(() => {
        showSuccessToast('Item saved for later!');
        // Here you would implement the save for later functionality
    }, 500);
}

// 🗑️ Clear Entire Cart
function clearCart() {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
        return;
    }

    showLoadingToast('Clearing cart...');
    
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100%)';
        }, index * 100);
    });

    setTimeout(() => {
        showEmptyCartState();
        showSuccessToast('Cart cleared successfully');
    }, cartItems.length * 100 + 300);
}

// 💰 Calculate Cart Totals
function calculateCartTotals() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    let subtotal = 0;
    let totalItems = 0;

    quantityInputs.forEach(input => {
        const quantity = parseInt(input.value);
        const cartItem = input.closest('.cart-item');
        const priceElement = cartItem.querySelector('.current-price');
        
        if (priceElement) {
            const price = parseFloat(priceElement.textContent.replace('$', ''));
            subtotal += price * quantity;
            totalItems += quantity;
        }
    });

    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = 0; // You can calculate tax based on your business rules
    const total = subtotal + shipping + tax;

    // Update display
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    // Update cart header count
    const cartHeaderCount = document.querySelector('.section-title');
    if (cartHeaderCount) {
        cartHeaderCount.textContent = `Cart Items (${totalItems})`;
    }
}

// 🎯 Apply Promo Code
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    if (!promoInput) return;

    const promoCode = promoInput.value.trim().toLowerCase();
    
    if (!promoCode) {
        showErrorToast('Please enter a promo code');
        return;
    }

    showLoadingToast('Applying promo code...');

    // Check if we're on checkout page or cart page
    const isCheckoutPage = document.querySelector('.checkout-page') !== null;
    
    if (isCheckoutPage) {
        // Handle checkout-specific promo code logic
        setTimeout(() => {
            const validCodes = {
                'save10': { discount: 10, type: 'percentage' },
                'welcome': { discount: 15, type: 'fixed' },
                'freeship': { discount: 0, type: 'free_shipping' },
                'discount20': { discount: 20, type: 'percentage' }
            };
            
            if (validCodes[promoCode]) {
                const discount = validCodes[promoCode];
                showSuccessToast('Promo code applied successfully!');
                promoInput.value = '';
                
                // Apply discount to checkout
                applyCheckoutDiscount(promoCode, discount);
            } else {
                showErrorToast('Invalid promo code');
            }
        }, 1000);
        return;
    }

    // Simulate promo code validation for cart page
    setTimeout(() => {
        const validCodes = ['save10', 'welcome', 'firstorder', 'discount20'];
        
        if (validCodes.includes(promoCode)) {
            showSuccessToast('Promo code applied successfully!');
            promoInput.value = '';
            
            // Add discount row to summary
            addDiscountToSummary(promoCode);
            calculateCartTotals();
        } else {
            showErrorToast('Invalid promo code');
        }
    }, 1000);
}

// 🎡 Add Discount to Summary
function addDiscountToSummary(promoCode) {
    const summaryDetails = document.querySelector('.summary-details');
    const existingDiscount = summaryDetails.querySelector('.discount-row');
    
    // Remove existing discount if any
    if (existingDiscount) {
        existingDiscount.remove();
    }

    // Add new discount row
    const discountRow = document.createElement('div');
    discountRow.className = 'summary-row discount-row';
    discountRow.innerHTML = `
        <span class="summary-label">Discount (${promoCode.toUpperCase()}):</span>
        <span class="summary-value" style="color: #10b981;">-$10.00</span>
    `;

    const divider = summaryDetails.querySelector('.summary-divider');
    summaryDetails.insertBefore(discountRow, divider);
}

// 🚀 Proceed to Checkout
function proceedToCheckout() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartItems.length === 0) {
        showErrorToast('Your cart is empty');
        return;
    }

    // Validate stock availability
    let hasOutOfStock = false;
    cartItems.forEach(item => {
        const stockElement = item.querySelector('.stock-unavailable');
        if (stockElement) {
            hasOutOfStock = true;
        }
    });

    if (hasOutOfStock) {
        showErrorToast('Some items are out of stock. Please remove them before checkout.');
        return;
    }

    showLoadingToast('Redirecting to checkout...');
    
    setTimeout(() => {
        // Redirect to checkout page
        window.location.href = '/checkout/';
    }, 1000);
}

// 😔 Show Empty Cart State
function showEmptyCartState() {
    const cartContent = document.querySelector('.cart-content');
    if (cartContent) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h2 class="empty-cart-title">Your cart is empty</h2>
                <p class="empty-cart-message">Looks like you haven't added any items to your cart yet.</p>
                <a href="/products/" class="start-shopping-btn">
                    <i class="fas fa-shopping-bag"></i>
                    Start Shopping
                </a>
            </div>
        `;
    }
}

// 🔔 Toast Notification System
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'loading' ? 'fa-spinner fa-spin' :
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after duration (except for loading toasts)
    if (type !== 'loading') {
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    return toast;
}

function showSuccessToast(message) {
    // Remove any existing loading toasts
    document.querySelectorAll('.toast.loading').forEach(toast => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
    
    showToast(message, 'success');
}

function showErrorToast(message) {
    // Remove any existing loading toasts
    document.querySelectorAll('.toast.loading').forEach(toast => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
    
    showToast(message, 'error');
}

function showLoadingToast(message) {
    return showToast(message, 'loading', 0);
}

// 🍪 Get CSRF Token Helper
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// 🔍 Search Toggle
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');

if (searchToggle && searchOverlay && searchInput) {
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.toggle('active');
        if (searchOverlay.classList.contains('active')) {
            searchInput.focus();
        }
    });
}

// 🧭 Navbar Scroll Effect
const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 🎨 Color Option Selection
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove active class from siblings
        this.parentNode.querySelectorAll('.color-option').forEach(sibling => {
            sibling.classList.remove('active');
        });
        // Add active class to clicked option
        this.classList.add('active');
    });
});

// 🔧 Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// 🎯 View Toggle
document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// 🛒 CHECKOUT FUNCTIONALITY

// 🚀 Initialize Checkout Functionality
function initializeCheckoutFunctionality() {
    // ✅ Billing Address Toggle
    const sameAsShippingCheckbox = document.getElementById('same_as_shipping');
    const billingFields = document.getElementById('billing_fields');
    
    if (sameAsShippingCheckbox && billingFields) {
        sameAsShippingCheckbox.addEventListener('change', function() {
            if (this.checked) {
                billingFields.style.display = 'none';
                // Clear billing fields when hidden
                billingFields.querySelectorAll('input, select').forEach(field => {
                    field.removeAttribute('required');
                });
            } else {
                billingFields.style.display = 'block';
                // Add required attributes back when shown
                billingFields.querySelectorAll('input[id*="billing_"], select[id*="billing_"]').forEach(field => {
                    if (!field.id.includes('company')) {
                        field.setAttribute('required', 'required');
                    }
                });
            }
        });
    }
    
    // 💳 Payment Method Toggle
    const paymentOptions = document.querySelectorAll('input[name="payment_method"]');
    const cardFields = document.getElementById('card_fields');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (cardFields) {
                if (this.value === 'card') {
                    cardFields.style.display = 'block';
                    cardFields.querySelectorAll('input').forEach(field => {
                        field.setAttribute('required', 'required');
                    });
                } else {
                    cardFields.style.display = 'none';
                    cardFields.querySelectorAll('input').forEach(field => {
                        field.removeAttribute('required');
                    });
                }
            }
        });
    });
    
    // 🚚 Shipping Method Change
    const shippingOptions = document.querySelectorAll('input[name="shipping_method"]');
    const shippingElement = document.getElementById('shipping');
    
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateShippingCost(this.value);
        });
    });
    
    // 💳 Card Number Formatting
    const cardNumberInput = document.getElementById('card_number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            // Remove all non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add spaces every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            // Limit to 19 characters (16 digits + 3 spaces)
            if (value.length > 19) {
                value = value.substring(0, 19);
            }
            
            this.value = value;
        });
    }
    
    // 📅 Expiry Date Formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            this.value = value;
        });
    }
    
    // 🔢 CVV Input Restriction
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }
    
    // 📞 Phone Number Formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{1})(\d{3})/, '+$1 ($2)');
            }
            
            this.value = value;
        });
    });
    
    // 💼 ZIP Code Formatting
    const zipInputs = document.querySelectorAll('input[id*="zip"]');
    zipInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 5);
        });
    });
    
    // 🗃 Form Submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processCheckout();
        });
    }
    
    // Initialize shipping cost calculation
    calculateCheckoutTotals();
}

// 🚚 Update Shipping Cost
function updateShippingCost(shippingMethod) {
    const shippingElement = document.getElementById('shipping');
    if (!shippingElement) return;
    
    let shippingCost = 0;
    
    switch (shippingMethod) {
        case 'standard':
            shippingCost = 5.99;
            break;
        case 'express':
            shippingCost = 12.99;
            break;
        case 'overnight':
            shippingCost = 24.99;
            break;
        default:
            shippingCost = 5.99;
    }
    
    shippingElement.textContent = `$${shippingCost.toFixed(2)}`;
    calculateCheckoutTotals();
}

// 💰 Calculate Checkout Totals
function calculateCheckoutTotals() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return;
    
    const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
    const shipping = parseFloat(shippingElement.textContent.replace('$', ''));
    const taxRate = 0.08; // 8% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// 🚀 Process Checkout
function processCheckout() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ef4444';
            field.addEventListener('input', function() {
                this.style.borderColor = '';
            }, { once: true });
        }
    });
    
    if (!isValid) {
        showErrorToast('Please fill in all required fields');
        return;
    }
    
    // Validate email
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        showErrorToast('Please enter a valid email address');
        return;
    }
    
    // Validate card number if paying with card
    const paymentMethod = formData.get('payment_method');
    if (paymentMethod === 'card') {
        const cardNumber = formData.get('card_number');
        if (cardNumber && !isValidCardNumber(cardNumber)) {
            showErrorToast('Please enter a valid card number');
            return;
        }
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.place-order-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Order...';
    submitBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message and redirect
        showSuccessToast('Order placed successfully! Redirecting to confirmation...');
        
        setTimeout(() => {
            // Redirect to order confirmation page
            window.location.href = '/order-confirmation/';
        }, 2000);
        
        // Here you would normally submit to your backend
        // fetch('/checkout/process/', {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         'X-CSRFToken': getCookie('csrftoken')
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         window.location.href = data.redirect_url;
        //     } else {
        //         showErrorToast(data.error || 'Order processing failed');
        //     }
        // })
        // .catch(error => {
        //     showErrorToast('Network error occurred');
        // })
        // .finally(() => {
        //     submitBtn.innerHTML = originalText;
        //     submitBtn.disabled = false;
        // });
    }, 2000);
}

// 💳 Validate Card Number
function isValidCardNumber(cardNumber) {
    // Remove spaces and check if it's all digits
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
}

// 🎡 Apply Checkout Discount
function applyCheckoutDiscount(promoCode, discount) {
    const orderTotals = document.querySelector('.order-totals');
    const existingDiscount = orderTotals.querySelector('.discount-row');
    
    // Remove existing discount if any
    if (existingDiscount) {
        existingDiscount.remove();
    }
    
    // Calculate discount amount
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
    const currentShipping = parseFloat(shippingElement.textContent.replace('$', ''));
    
    let discountAmount = 0;
    
    if (discount.type === 'percentage') {
        discountAmount = subtotal * (discount.discount / 100);
    } else if (discount.type === 'fixed') {
        discountAmount = discount.discount;
    } else if (discount.type === 'free_shipping') {
        // Apply free shipping
        shippingElement.textContent = '$0.00';
        discountAmount = currentShipping;
    }
    
    if (discountAmount > 0) {
        // Add discount row
        const discountRow = document.createElement('div');
        discountRow.className = 'total-row discount-row';
        discountRow.innerHTML = `
            <span class="total-label">Discount (${promoCode.toUpperCase()}):</span>
            <span class="total-value" style="color: #10b981;">-$${discountAmount.toFixed(2)}</span>
        `;
        
        const divider = orderTotals.querySelector('.total-divider');
        orderTotals.insertBefore(discountRow, divider);
    }
    
    // Recalculate totals
    calculateCheckoutTotals();
}

// 🌐 Language Toggle Functionality
function initializeLanguageToggle() {
    const languageToggle = document.getElementById('languageToggle');
    const enText = languageToggle?.querySelector('.en-text');
    const arText = languageToggle?.querySelector('.ar-text');
    
    // 🎨 Language configuration
    const LANGUAGES = {
        'en': { code: 'en', name: 'English', display: 'EN', dir: 'ltr' },
        'ar': { code: 'ar', name: 'Arabic', display: 'AR', dir: 'rtl' }
    };
    
    // 🔍 Get current language from localStorage or default
    let currentLang = localStorage.getItem('language') || 'en';
    
    // 🎨 Update UI with current language
    function updateLanguageDisplay() {
        const lang = LANGUAGES[currentLang];
        if (languageToggle && lang) {
            languageToggle.setAttribute('data-lang', lang.code);
        }
        
        // Update document attributes
        document.documentElement.setAttribute('lang', lang.code);
        document.documentElement.setAttribute('dir', lang.dir);
        
        // Update body class for RTL/LTR styling
        document.body.classList.toggle('rtl', lang.dir === 'rtl');
        document.body.classList.toggle('ltr', lang.dir === 'ltr');
    }
    
    // 🔄 Switch language function
    function switchLanguage() {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        
        // Add switching animation
        languageToggle.classList.add('switching');
        
        setTimeout(() => {
            currentLang = newLang;
            localStorage.setItem('language', newLang);
            updateLanguageDisplay();
            
            // Create and submit form to backend
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
            
            form.appendChild(langInput);
            document.body.appendChild(form);
            form.submit();
            
            languageToggle.classList.remove('switching');
        }, 200);
    }
    
    // 🎧 Event listener
    if (languageToggle) {
        languageToggle.addEventListener('click', switchLanguage);
        
        // Prevent default button behavior
        languageToggle.addEventListener('click', function(e) {
            e.preventDefault();
        });
    }
    
    // 🚀 Initialize
    updateLanguageDisplay();
}