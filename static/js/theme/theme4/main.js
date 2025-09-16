// Theme4 Main JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme4();
});

function initializeTheme4() {
    // Initialize all navbar functionality
    initMobileSearch();
    initMobileSidebar();
    initUserDropdown();
    initScrollEffects();
    initSearchFunctionality();
    initAccessibility();
    
    // Initialize footer functionality
    initFooterFunctionality();
    
    // Initialize cart functionality if on cart page
    if (document.querySelector('.cart-page')) {
        initCartFunctionality();
    }
    
    // Initialize wishlist functionality if on wishlist page
    if (document.querySelector('.wishlist-page')) {
        initWishlistFunctionality();
    }
    
    // Initialize checkout functionality if on checkout page
    if (document.querySelector('.checkout-page')) {
        initCheckoutFunctionality();
    }
    
    // Initialize hero slider functionality
    if (document.querySelector('.hero-slider')) {
        initHeroSlider();
    }
    
    console.log('Theme4 initialized successfully');
}

// Mobile Search Functionality
function initMobileSearch() {
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const mobileSearchContainer = document.getElementById('mobileSearch');
    const mobileSearchClose = document.getElementById('mobileSearchClose');
    const mobileSearchInput = document.querySelector('.mobile-search-input');
    
    if (!mobileSearchBtn || !mobileSearchContainer || !mobileSearchClose) {
        console.warn('Mobile search elements not found');
        return;
    }
    
    // Open mobile search
    mobileSearchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        mobileSearchContainer.classList.add('active');
        setTimeout(() => {
            mobileSearchInput.focus();
        }, 300);
    });
    
    // Close mobile search
    mobileSearchClose.addEventListener('click', function(e) {
        e.preventDefault();
        mobileSearchContainer.classList.remove('active');
    });
    
    // Close on escape key
    mobileSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            mobileSearchContainer.classList.remove('active');
        }
    });
}

// Mobile Sidebar Functionality
function initMobileSidebar() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('mobileSidebarOverlay');
    
    if (!hamburgerBtn || !mobileSidebar || !sidebarClose || !sidebarOverlay) {
        console.warn('Mobile sidebar elements not found');
        return;
    }
    
    // Open sidebar
    hamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openSidebar();
    });
    
    // Close sidebar
    sidebarClose.addEventListener('click', function(e) {
        e.preventDefault();
        closeSidebar();
    });
    
    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeSidebar();
    });
    
    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    function openSidebar() {
        hamburgerBtn.classList.add('active');
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap for accessibility
        const focusableElements = mobileSidebar.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
    
    function closeSidebar() {
        hamburgerBtn.classList.remove('active');
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
        hamburgerBtn.focus();
    }
}

// User Dropdown Functionality
function initUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    const userBtn = document.querySelector('.user-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (!userMenu || !userBtn || !userDropdown) {
        console.warn('User dropdown elements not found');
        return;
    }
    
    let dropdownTimeout;
    
    // Show dropdown on hover
    userMenu.addEventListener('mouseenter', function() {
        clearTimeout(dropdownTimeout);
        userDropdown.style.opacity = '1';
        userDropdown.style.visibility = 'visible';
        userDropdown.style.transform = 'translateY(0)';
    });
    
    // Hide dropdown on mouse leave with delay
    userMenu.addEventListener('mouseleave', function() {
        dropdownTimeout = setTimeout(() => {
            userDropdown.style.opacity = '0';
            userDropdown.style.visibility = 'hidden';
            userDropdown.style.transform = 'translateY(-10px)';
        }, 150);
    });
    
    // Keyboard navigation
    userBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
        }
    });
    
    function toggleDropdown() {
        const isVisible = userDropdown.style.visibility === 'visible';
        if (isVisible) {
            userDropdown.style.opacity = '0';
            userDropdown.style.visibility = 'hidden';
            userDropdown.style.transform = 'translateY(-10px)';
        } else {
            userDropdown.style.opacity = '1';
            userDropdown.style.visibility = 'visible';
            userDropdown.style.transform = 'translateY(0)';
            
            // Focus first dropdown item
            const firstItem = userDropdown.querySelector('.dropdown-item');
            if (firstItem) {
                firstItem.focus();
            }
        }
    }
}

// Scroll Effects
function initScrollEffects() {
    const navbar = document.querySelector('.theme4-navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Add shadow when scrolled
        if (currentScrollY > 10) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
            navbar.style.backdropFilter = 'blur(25px)';
        } else {
            navbar.style.boxShadow = 'var(--theme4-navbar-shadow)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        // Hide/show navbar on scroll (optional)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Search Functionality
function initSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.search-input, .mobile-search-input');
    const searchButtons = document.querySelectorAll('.search-btn');
    
    // Handle search input
    searchInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
        
        // Real-time search suggestions (placeholder)
        input.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                // Here you would implement search suggestions
                console.log('Search query:', query);
            }
        });
    });
    
    // Handle search button clicks
    searchButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.parentElement.querySelector('input');
            if (input) {
                performSearch(input.value);
            }
        });
    });
    
    function performSearch(query) {
        if (!query.trim()) return;
        
        console.log('Performing search for:', query);
        // Here you would implement the actual search functionality
        // Example: window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
}

// Accessibility Enhancements
function initAccessibility() {
    // Add skip link for keyboard navigation
    addSkipLink();
    
    // Enhance focus management
    enhanceFocusManagement();
    
    // Add ARIA labels and descriptions
    addAriaLabels();
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -100px;
        left: 20px;
        background: var(--theme4-primary-yellow);
        color: var(--theme4-text-primary);
        padding: 8px 16px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 600;
        z-index: 9999;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '20px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-100px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceFocusManagement() {
    // Add visible focus indicators
    const style = document.createElement('style');
    style.textContent = `
        .theme4-navbar *:focus {
            outline: 2px solid var(--theme4-primary-yellow);
            outline-offset: 2px;
        }
        
        .theme4-navbar button:focus,
        .theme4-navbar a:focus {
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Trap focus in mobile sidebar when open
    const mobileSidebar = document.getElementById('mobileSidebar');
    if (mobileSidebar) {
        mobileSidebar.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && this.classList.contains('active')) {
                trapFocus(e, this);
            }
        });
    }
}

function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

function addAriaLabels() {
    // Add ARIA labels to buttons without text
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    if (mobileSearchBtn) {
        mobileSearchBtn.setAttribute('aria-label', 'Open mobile search');
    }
    
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    
    const sidebarClose = document.getElementById('sidebarClose');
    if (sidebarClose) {
        sidebarClose.setAttribute('aria-label', 'Close navigation menu');
    }
    
    // Update aria-expanded when sidebar opens/closes
    const mobileSidebar = document.getElementById('mobileSidebar');
    if (mobileSidebar && hamburgerBtn) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const isOpen = mobileSidebar.classList.contains('active');
                    hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
                }
            });
        });
        
        observer.observe(mobileSidebar, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Close mobile elements when resizing to desktop
    if (window.innerWidth > 768) {
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileSearch = document.getElementById('mobileSearch');
        const overlay = document.getElementById('mobileSidebarOverlay');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        
        if (mobileSidebar) mobileSidebar.classList.remove('active');
        if (mobileSearch) mobileSearch.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        
        document.body.style.overflow = '';
    }
}, 250));

// Preload critical resources
function preloadResources() {
    // Preload user avatar if not already loaded
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar && userAvatar.src) {
        const img = new Image();
        img.src = userAvatar.src;
    }
    
    // Preload logo if not already loaded
    const logo = document.querySelector('.logo-img');
    if (logo && logo.src) {
        const img = new Image();
        img.src = logo.src;
    }
}

// Initialize preloading
preloadResources();

// Export functions for external use
window.Theme4 = {
    init: initializeTheme4,
    openSidebar: function() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        if (hamburgerBtn) hamburgerBtn.click();
    },
    closeSidebar: function() {
        const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) sidebarClose.click();
    },
    openMobileSearch: function() {
        const mobileSearchBtn = document.getElementById('mobileSearchBtn');
        if (mobileSearchBtn) mobileSearchBtn.click();
    },
    cart: {
        updateQuantity: updateQuantity,
        removeItem: removeCartItem,
        saveForLater: saveForLater,
        clearAll: clearAllItems,
        updateSummary: updateCartSummary
    },
    wishlist: {
        addToCart: addToCartFromWishlist,
        removeItem: removeWishlistItem,
        clearAll: clearAllWishlistItems,
        selectAll: selectAllWishlistItems,
        addSelectedToCart: addSelectedToCart
    },
    checkout: {
        toggleBillingAddress: toggleBillingAddress,
        applyPromoCode: applyPromoCode,
        updateShipping: updateShippingCost,
        validateForm: validateCheckoutForm,
        submitForm: submitCheckoutForm
    }
};

console.log('Theme4 JavaScript loaded successfully');

// Cart Functionality
function initCartFunctionality() {
    initQuantityControls();
    initCartItemActions();
    initCartSummary();
    console.log('Cart functionality initialized');
}

// Quantity Controls
function initQuantityControls() {
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    
    quantitySelectors.forEach(selector => {
        const decreaseBtn = selector.querySelector('.qty-decrease');
        const increaseBtn = selector.querySelector('.qty-increase');
        const input = selector.querySelector('.qty-input');
        const cartItem = selector.closest('.cart-item');
        
        if (decreaseBtn && increaseBtn && input) {
            decreaseBtn.addEventListener('click', () => {
                updateQuantity(cartItem, -1);
            });
            
            increaseBtn.addEventListener('click', () => {
                updateQuantity(cartItem, 1);
            });
        }
    });
}

// Update Quantity Function
function updateQuantity(cartItem, change) {
    const input = cartItem.querySelector('.qty-input');
    const currentQty = parseInt(input.value);
    const newQty = Math.max(1, Math.min(10, currentQty + change));
    
    input.value = newQty;
    
    // Update item total price
    updateItemTotal(cartItem);
    
    // Update cart summary
    updateCartSummary();
    
    // Add visual feedback
    cartItem.style.transform = 'scale(1.02)';
    setTimeout(() => {
        cartItem.style.transform = '';
    }, 200);
}

// Update Item Total
function updateItemTotal(cartItem) {
    const quantity = parseInt(cartItem.querySelector('.qty-input').value);
    const unitPriceText = cartItem.querySelector('.unit-price').textContent;
    const unitPrice = parseFloat(unitPriceText.replace(/[^\d.]/g, ''));
    const totalPrice = (unitPrice * quantity).toFixed(2);
    
    cartItem.querySelector('.total-price').textContent = `$${totalPrice}`;
}

// Cart Item Actions
function initCartItemActions() {
    // Remove item buttons
    const removeButtons = document.querySelectorAll('.remove-btn, .quick-remove-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            removeCartItem(btn.closest('.cart-item'));
        });
    });
    
    // Save for later buttons
    const saveButtons = document.querySelectorAll('.save-later-btn');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            saveForLater(btn.closest('.cart-item'));
        });
    });
    
    // Clear all button
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearAllItems();
        });
    }
}

// Remove Cart Item
function removeCartItem(cartItem) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        cartItem.style.transform = 'translateX(-100%)';
        cartItem.style.opacity = '0';
        
        setTimeout(() => {
            cartItem.remove();
            updateCartSummary();
            updateCartItemCount();
            checkEmptyCart();
        }, 300);
    }
}

// Save for Later
function saveForLater(cartItem) {
    const itemName = cartItem.querySelector('.item-title').textContent;
    
    cartItem.style.transform = 'translateY(-20px)';
    cartItem.style.opacity = '0.5';
    
    setTimeout(() => {
        cartItem.remove();
        updateCartSummary();
        updateCartItemCount();
        checkEmptyCart();
        
        // Show success message
        showNotification(`${itemName} saved to your wishlist!`, 'success');
    }, 300);
}

// Clear All Items
function clearAllItems() {
    if (confirm('Are you sure you want to clear all items from your cart?')) {
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(-100%)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    item.remove();
                    if (index === cartItems.length - 1) {
                        updateCartSummary();
                        updateCartItemCount();
                        checkEmptyCart();
                    }
                }, 300);
            }, index * 100);
        });
    }
}

// Cart Summary Functions
function initCartSummary() {
    updateCartSummary();
    updateCartItemCount();
}

function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const totalPriceText = item.querySelector('.total-price').textContent;
        const price = parseFloat(totalPriceText.replace(/[^\d.]/g, ''));
        subtotal += price;
    });
    
    const shipping = 12.99;
    const taxRate = 0.085;
    const discount = 25.00;
    
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax - discount;
    
    // Update summary display
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('totalAmount');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function updateCartItemCount() {
    const cartItems = document.querySelectorAll('.cart-item');
    const totalQuantity = Array.from(cartItems).reduce((total, item) => {
        const qty = parseInt(item.querySelector('.qty-input').value);
        return total + qty;
    }, 0);
    
    const countElements = document.querySelectorAll('#cart-item-count, #summary-item-count');
    countElements.forEach(el => {
        if (el) el.textContent = cartItems.length;
    });
    
    // Update navbar cart badge if exists
    const navCartBadge = document.querySelector('.cart-btn .badge');
    if (navCartBadge) {
        navCartBadge.textContent = totalQuantity;
    }
}

function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const emptyCartEl = document.getElementById('emptyCart');
    const cartContentGrid = document.querySelector('.cart-content-grid');
    
    if (cartItems.length === 0) {
        if (emptyCartEl) emptyCartEl.style.display = 'block';
        if (cartContentGrid) cartContentGrid.style.display = 'none';
    }
}

// Utility function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--theme4-primary-yellow);
        color: var(--theme4-text-primary);
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Wishlist Functionality
function initWishlistFunctionality() {
    initWishlistTableActions();
    initWishlistCheckboxes();
    initWishlistItemActions();
    updateWishlistItemCount();
    console.log('Wishlist functionality initialized');
}

// Initialize Wishlist Table Actions
function initWishlistTableActions() {
    // Clear all wishlist button
    const clearWishlistBtn = document.getElementById('clearWishlistBtn');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearAllWishlistItems();
        });
    }
    
    // Add all to cart button
    const addAllToCartBtn = document.getElementById('addAllToCartBtn');
    if (addAllToCartBtn) {
        addAllToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addSelectedToCart(true); // true means add all items
        });
    }
}

// Initialize Wishlist Checkboxes
function initWishlistCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    
    // Select all functionality
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            selectAllWishlistItems(this.checked);
        });
    }
    
    // Individual checkbox functionality
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllState();
            updateBulkActionButtons();
        });
    });
    
    updateBulkActionButtons();
}

// Initialize Wishlist Item Actions
function initWishlistItemActions() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!btn.disabled) {
                addToCartFromWishlist(btn.closest('.wishlist-item'));
            }
        });
    });
    
    // Remove from wishlist buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            removeWishlistItem(btn.closest('.wishlist-item'));
        });
    });
}

// Select All Wishlist Items
function selectAllWishlistItems(selectAll) {
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAll;
    });
    updateBulkActionButtons();
}

// Update Select All State
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
    
    if (selectAllCheckbox) {
        if (checkedBoxes.length === 0) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else if (checkedBoxes.length === itemCheckboxes.length) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.indeterminate = true;
            selectAllCheckbox.checked = false;
        }
    }
}

// Update Bulk Action Buttons
function updateBulkActionButtons() {
    const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
    const addAllToCartBtn = document.getElementById('addAllToCartBtn');
    
    if (addAllToCartBtn) {
        if (checkedBoxes.length > 0) {
            addAllToCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Add Selected to Cart (${checkedBoxes.length})`;
        } else {
            addAllToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add All to Cart';
        }
    }
}

// Add to Cart from Wishlist
function addToCartFromWishlist(wishlistItem) {
    const productName = wishlistItem.querySelector('.product-name').textContent;
    const addToCartBtn = wishlistItem.querySelector('.add-to-cart-btn');
    
    // Add loading state
    addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    addToCartBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Restore button
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        addToCartBtn.disabled = false;
        
        // Show success notification
        showNotification(`${productName} added to cart!`, 'success');
        
        // Add visual feedback
        wishlistItem.style.transform = 'scale(1.02)';
        wishlistItem.style.backgroundColor = 'var(--theme4-primary-yellow)';
        wishlistItem.style.opacity = '0.8';
        
        setTimeout(() => {
            wishlistItem.style.transform = '';
            wishlistItem.style.backgroundColor = '';
            wishlistItem.style.opacity = '';
        }, 500);
    }, 1000);
}

// Remove Wishlist Item
function removeWishlistItem(wishlistItem) {
    const productName = wishlistItem.querySelector('.product-name').textContent;
    
    if (confirm(`Are you sure you want to remove "${productName}" from your wishlist?`)) {
        wishlistItem.style.transform = 'translateX(-100%)';
        wishlistItem.style.opacity = '0';
        
        setTimeout(() => {
            wishlistItem.remove();
            updateWishlistItemCount();
            updateSelectAllState();
            updateBulkActionButtons();
            checkEmptyWishlist();
            
            showNotification(`${productName} removed from wishlist`, 'info');
        }, 300);
    }
}

// Clear All Wishlist Items
function clearAllWishlistItems() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    
    if (wishlistItems.length === 0) {
        showNotification('Your wishlist is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all items from your wishlist?')) {
        wishlistItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(-100%)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    item.remove();
                    if (index === wishlistItems.length - 1) {
                        updateWishlistItemCount();
                        updateSelectAllState();
                        updateBulkActionButtons();
                        checkEmptyWishlist();
                        showNotification('Wishlist cleared', 'info');
                    }
                }, 300);
            }, index * 100);
        });
    }
}

// Add Selected Items to Cart
function addSelectedToCart(addAll = false) {
    let itemsToAdd;
    
    if (addAll) {
        itemsToAdd = document.querySelectorAll('.wishlist-item');
    } else {
        const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
        itemsToAdd = Array.from(checkedBoxes).map(checkbox => checkbox.closest('.wishlist-item'));
    }
    
    if (itemsToAdd.length === 0) {
        showNotification('Please select items to add to cart', 'warning');
        return;
    }
    
    // Filter out out-of-stock items
    const availableItems = Array.from(itemsToAdd).filter(item => {
        const availability = item.querySelector('.availability-badge');
        return !availability.classList.contains('out-of-stock');
    });
    
    if (availableItems.length === 0) {
        showNotification('Selected items are not available', 'warning');
        return;
    }
    
    // Add items to cart one by one
    availableItems.forEach((item, index) => {
        setTimeout(() => {
            const addToCartBtn = item.querySelector('.add-to-cart-btn');
            if (addToCartBtn && !addToCartBtn.disabled) {
                addToCartFromWishlist(item);
            }
        }, index * 200);
    });
    
    // Show summary notification
    setTimeout(() => {
        showNotification(`${availableItems.length} items added to cart!`, 'success');
    }, availableItems.length * 200 + 1200);
}

// Update Wishlist Item Count
function updateWishlistItemCount() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    const countElement = document.getElementById('wishlist-item-count');
    
    if (countElement) {
        countElement.textContent = wishlistItems.length;
    }
    
    // Update navbar wishlist badge if exists
    const navWishlistBadge = document.querySelector('.wishlist-btn .badge');
    if (navWishlistBadge) {
        navWishlistBadge.textContent = wishlistItems.length;
    }
}

// Check Empty Wishlist
function checkEmptyWishlist() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    const emptyWishlistEl = document.getElementById('emptyWishlist');
    const wishlistContent = document.querySelector('.wishlist-content');
    
    if (wishlistItems.length === 0) {
        if (emptyWishlistEl) emptyWishlistEl.style.display = 'block';
        if (wishlistContent) wishlistContent.style.display = 'none';
    } else {
        if (emptyWishlistEl) emptyWishlistEl.style.display = 'none';
        if (wishlistContent) wishlistContent.style.display = 'block';
    }
}

// Checkout Functionality
function initCheckoutFunctionality() {
    initCheckoutForm();
    initBillingAddressToggle();
    initPromoCodeSection();
    initShippingOptions();
    initFormValidation();
    updateOrderSummary();
    console.log('Checkout functionality initialized');
}

// Initialize Checkout Form
function initCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateCheckoutForm()) {
                submitCheckoutForm();
            }
        });
    }
    
    // Real-time validation for key fields
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', clearFieldError);
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', validatePhone);
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    const zipCodeInput = document.getElementById('zipCode');
    if (zipCodeInput) {
        zipCodeInput.addEventListener('input', validateZipCode);
    }
    
    // Auto-fill city/state based on ZIP code (placeholder)
    zipCodeInput?.addEventListener('blur', function() {
        if (this.value.length === 5) {
            // Here you would implement ZIP code lookup
            console.log('ZIP code lookup for:', this.value);
        }
    });
}

// Billing Address Toggle
function initBillingAddressToggle() {
    const sameAsShippingCheckbox = document.getElementById('sameAsShipping');
    const billingFields = document.getElementById('billingAddressFields');
    
    if (sameAsShippingCheckbox && billingFields) {
        sameAsShippingCheckbox.addEventListener('change', function() {
            toggleBillingAddress(this.checked);
        });
    }
}

function toggleBillingAddress(sameAsShipping) {
    const billingFields = document.getElementById('billingAddressFields');
    const billingInputs = billingFields.querySelectorAll('input, select');
    
    if (sameAsShipping) {
        billingFields.style.display = 'none';
        billingInputs.forEach(input => {
            input.removeAttribute('required');
            input.value = '';
        });
    } else {
        billingFields.style.display = 'block';
        // Copy shipping address to billing
        copyShippingToBilling();
        // Set required attributes
        const requiredFields = ['billingFirstName', 'billingLastName', 'billingAddress1', 'billingCity', 'billingState', 'billingZipCode'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.setAttribute('required', 'required');
        });
    }
}

function copyShippingToBilling() {
    const shippingToBillingMap = {
        'firstName': 'billingFirstName',
        'lastName': 'billingLastName',
        'address1': 'billingAddress1',
        'city': 'billingCity',
        'state': 'billingState',
        'zipCode': 'billingZipCode'
    };
    
    Object.entries(shippingToBillingMap).forEach(([shipping, billing]) => {
        const shippingField = document.getElementById(shipping);
        const billingField = document.getElementById(billing);
        if (shippingField && billingField && shippingField.value) {
            billingField.value = shippingField.value;
        }
    });
}

// Promo Code Section
function initPromoCodeSection() {
    const applyPromoBtn = document.getElementById('applyPromo');
    const promoInput = document.getElementById('promoCode');
    
    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener('click', function() {
            applyPromoCode(promoInput.value.trim());
        });
        
        promoInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode(this.value.trim());
            }
        });
    }
    
    // Remove promo code functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-promo')) {
            e.preventDefault();
            removePromoCode();
        }
    });
}

function applyPromoCode(code) {
    if (!code) {
        showNotification('Please enter a promo code', 'warning');
        return;
    }
    
    const applyBtn = document.getElementById('applyPromo');
    const originalText = applyBtn.textContent;
    
    // Show loading state
    applyBtn.disabled = true;
    applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
    
    // Simulate API call
    setTimeout(() => {
        const validCodes = ['SAVE20', 'WELCOME10', 'FREESHIP'];
        
        if (validCodes.includes(code.toUpperCase())) {
            // Apply discount
            const discount = code.toUpperCase() === 'SAVE20' ? 25.00 : 10.00;
            displayAppliedPromo(code.toUpperCase(), discount);
            updateOrderSummary(discount);
            showNotification(`Promo code ${code.toUpperCase()} applied! You saved $${discount.toFixed(2)}`, 'success');
            document.getElementById('promoCode').value = '';
        } else {
            showNotification('Invalid promo code. Please try again.', 'error');
        }
        
        // Restore button
        applyBtn.disabled = false;
        applyBtn.textContent = originalText;
    }, 1500);
}

function displayAppliedPromo(code, discount) {
    const appliedPromos = document.getElementById('appliedPromos');
    const discountRow = document.getElementById('discountRow');
    
    if (appliedPromos && discountRow) {
        appliedPromos.style.display = 'block';
        appliedPromos.innerHTML = `
            <div class="applied-promo">
                <span class="promo-code">${code}</span>
                <span class="promo-discount">-$${discount.toFixed(2)}</span>
                <button class="remove-promo" aria-label="Remove promo">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        discountRow.style.display = 'flex';
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
    }
}

function removePromoCode() {
    const appliedPromos = document.getElementById('appliedPromos');
    const discountRow = document.getElementById('discountRow');
    
    if (appliedPromos && discountRow) {
        appliedPromos.style.display = 'none';
        discountRow.style.display = 'none';
        updateOrderSummary(0);
        showNotification('Promo code removed', 'info');
    }
}

// Shipping Options
function initShippingOptions() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                updateShippingCost(this.value);
            }
        });
    });
}

function updateShippingCost(shippingType) {
    const shippingCosts = {
        'standard': 12.99,
        'express': 24.99,
        'overnight': 39.99
    };
    
    const newShippingCost = shippingCosts[shippingType] || 12.99;
    const shippingElement = document.getElementById('shipping');
    
    if (shippingElement) {
        shippingElement.textContent = `$${newShippingCost.toFixed(2)}`;
        updateOrderSummary();
    }
}

// Form Validation
function initFormValidation() {
    // Add real-time validation to all required fields
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Specific validation based on field type
    if (value && field.type === 'email') {
        isValid = validateEmailFormat(value);
        errorMessage = isValid ? '' : 'Please enter a valid email address';
    }
    
    if (value && field.type === 'tel') {
        isValid = validatePhoneFormat(value);
        errorMessage = isValid ? '' : 'Please enter a valid phone number';
    }
    
    // Display error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function validateCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        return validateField(emailInput);
    }
    return false;
}

function validatePhone() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        return validateField(phoneInput);
    }
    return false;
}

function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhoneFormat(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

function validateZipCode() {
    const zipInput = document.getElementById('zipCode');
    if (zipInput) {
        const zipValue = zipInput.value.replace(/\D/g, '');
        if (zipValue.length <= 5) {
            zipInput.value = zipValue;
        }
    }
}

function formatPhoneNumber() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        let value = phoneInput.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d+)/, '($1) $2');
        }
        phoneInput.value = value;
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
    `;
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    if (typeof field === 'object') {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

// Order Summary Updates
function updateOrderSummary(discount = 0) {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const finalTotalElement = document.getElementById('finalTotal');
    
    if (!subtotalElement || !shippingElement || !taxElement || !finalTotalElement) {
        return;
    }
    
    const subtotal = parseFloat(subtotalElement.textContent.replace(/[^\d.]/g, ''));
    const shipping = parseFloat(shippingElement.textContent.replace(/[^\d.]/g, ''));
    const taxRate = 0.085; // 8.5% tax rate
    
    const tax = (subtotal * taxRate);
    const total = subtotal + shipping + tax - discount;
    
    taxElement.textContent = `$${tax.toFixed(2)}`;
    finalTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Submit Checkout Form
function submitCheckoutForm() {
    const continueBtn = document.getElementById('continueToPayment');
    const originalText = continueBtn.innerHTML;
    
    // Show loading state
    continueBtn.disabled = true;
    continueBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Collect form data
    const formData = new FormData(document.getElementById('checkoutForm'));
    const orderData = Object.fromEntries(formData);
    
    console.log('Order data:', orderData);
    
    // Simulate API submission
    setTimeout(() => {
        // Restore button
        continueBtn.disabled = false;
        continueBtn.innerHTML = originalText;
        
        // Show success and redirect
        showNotification('Information saved! Redirecting to payment...', 'success');
        
        setTimeout(() => {
            // Here you would redirect to the payment page
            console.log('Redirecting to payment page...');
            // window.location.href = '/checkout/payment';
        }, 2000);
    }, 2000);
}

// Hero Slider Functionality
let currentSlideIndex = 1;
let slideInterval;

function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) {
        console.warn('No slides found for hero slider');
        return;
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Pause auto-play on hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    console.log('Hero slider initialized with', slides.length, 'slides');
}

function showSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Ensure slide number is within bounds
    if (slideNumber > slides.length) {
        currentSlideIndex = 1;
    }
    if (slideNumber < 1) {
        currentSlideIndex = slides.length;
    }
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show current slide
    if (slides[currentSlideIndex - 1]) {
        slides[currentSlideIndex - 1].classList.add('active');
    }
    
    // Activate current indicator
    if (indicators[currentSlideIndex - 1]) {
        indicators[currentSlideIndex - 1].classList.add('active');
    }
}

function nextSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
    resetAutoPlay();
}

function prevSlide() {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
    resetAutoPlay();
}

function currentSlide(slideNumber) {
    currentSlideIndex = slideNumber;
    showSlide(currentSlideIndex);
    resetAutoPlay();
}

function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Add touch/swipe support for mobile
function addTouchSupport() {
    const slider = document.querySelector('.slider-wrapper');
    if (!slider) return;
    
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50; // Minimum swipe distance
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left - next slide
                nextSlide();
            } else {
                // Swiped right - previous slide
                prevSlide();
            }
        }
    }
}

// Initialize touch support when slider is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.hero-slider')) {
        setTimeout(addTouchSupport, 100);
    }
});
