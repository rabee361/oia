// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Toggle between dark and light themes
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            if (themeIcon) {
                themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            }
        });
    }
    
    // Initialize navbar functionality
    initializeNavbar();
    
    // Product search functionality
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                const productDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Initialize product page functionality
    initializeProductPage();
    
    // Add animation to review cards on scroll
    const reviewCards = document.querySelectorAll('.review-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    reviewCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// Navbar functionality
function initializeNavbar() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileClose = document.getElementById('mobile-close');
    
    if (mobileMenuToggle && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileClose && mobileMenuOverlay) {
        mobileClose.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close mobile menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Search overlay functionality
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input-nav');
    const searchSubmit = document.getElementById('search-submit');
    
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Focus on search input after animation
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 300);
        });
    }
    
    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close search overlay when clicking outside
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Search form submission
    if (searchSubmit && searchInput) {
        searchSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });
    }
    
    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchOverlay && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            // Add scrolled class for styling
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Cart and wishlist badge animation
    animateBadges();
}

// Search functionality
function performSearch(query) {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    
    // Close search overlay
    const searchOverlay = document.getElementById('search-overlay');
    if (searchOverlay) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // In a real application, this would redirect to search results
    // For now, we'll simulate a search
    showSearchNotification(query);
}

// Show search notification
function showSearchNotification(query) {
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    notification.innerHTML = `
        <i class="fas fa-search"></i>
        <span>Searching for "${query}"...</span>
    `;
    
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
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Animate cart and wishlist badges
function animateBadges() {
    const badges = document.querySelectorAll('.navbar-badge');
    
    badges.forEach(badge => {
        // Add pulse animation on value change
        const observer = new MutationObserver(() => {
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = 'pulse 0.6s ease-in-out';
            }, 10);
        });
        
        observer.observe(badge, {
            childList: true,
            characterData: true,
            subtree: true
        });
    });
}

// Update cart/wishlist counts
function updateCartCount(count) {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = count;
        if (count > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

function updateWishlistCount(count) {
    const wishlistBadge = document.querySelector('.wishlist-badge');
    if (wishlistBadge) {
        wishlistBadge.textContent = count;
        if (count > 0) {
            wishlistBadge.style.display = 'flex';
        } else {
            wishlistBadge.style.display = 'none';
        }
    }
}

// Product page functionality
let currentImageIndex = 0;
let productImages = [];

// Initialize product images
function initializeProductImages() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    productImages = Array.from(thumbnails).map(thumb => thumb.dataset.image);
}

// Image navigation functions
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    updateMainImage();
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    updateMainImage();
}

function updateMainImage() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && productImages[currentImageIndex]) {
        mainImage.src = productImages[currentImageIndex];
        
        // Update active thumbnail
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentImageIndex);
        });
    }
}

// Thumbnail click handlers
function initializeThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage();
        });
    });
}

// Quantity selector functionality
function initializeQuantitySelector() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.qty-input');
    
    if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(qtyInput.value);
            qtyInput.value = currentValue + 1;
        });
        
        qtyInput.addEventListener('input', () => {
            const value = parseInt(qtyInput.value);
            if (isNaN(value) || value < 1) {
                qtyInput.value = 1;
            }
        });
    }
}

// Tab functionality
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all tabs and panes
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            btn.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Star rating functionality for review form
function initializeStarRating() {
    const stars = document.querySelectorAll('.star-rating-input i');
    let selectedRating = 0;
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStarDisplay();
        });
        
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });
    });
    
    const starContainer = document.querySelector('.star-rating-input');
    if (starContainer) {
        starContainer.addEventListener('mouseleave', () => {
            updateStarDisplay();
        });
    }
    
    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }
    
    function updateStarDisplay() {
        highlightStars(selectedRating);
    }
}

// Related products scroll functionality
function scrollRelatedProducts(direction) {
    const container = document.querySelector('.related-products-container');
    if (!container) return;
    
    const scrollAmount = 300;
    const currentScroll = container.scrollLeft;
    
    if (direction === 'left') {
        container.scrollTo({
            left: currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    } else {
        container.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Wishlist functionality
function initializeWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = wishlistBtn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> ADDED TO WISHLIST';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                wishlistBtn.innerHTML = '<i class="far fa-heart"></i> ADD TO WISHLIST';
            }
        });
    }
}

// Add to cart functionality
function initializeAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const quantity = document.querySelector('.qty-input').value;
            
            // Add visual feedback
            const originalText = addToCartBtn.innerHTML;
            addToCartBtn.innerHTML = '<i class="fas fa-check"></i> ADDED TO CART';
            addToCartBtn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                addToCartBtn.innerHTML = originalText;
                addToCartBtn.style.backgroundColor = '';
            }, 2000);
            
            console.log(`Added ${quantity} item(s) to cart`);
        });
    }
}

// Review form submission
function initializeReviewForm() {
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const reviewText = document.getElementById('review-text').value;
            const rating = document.querySelectorAll('.star-rating-input .fas').length;
            
            if (!reviewText.trim()) {
                alert('Please write a review.');
                return;
            }
            
            if (rating === 0) {
                alert('Please select a rating.');
                return;
            }
            
            console.log('Review submitted:', { rating, reviewText });
            alert('Thank you for your review!');
            
            // Reset form
            reviewForm.reset();
            const stars = document.querySelectorAll('.star-rating-input i');
            stars.forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
        });
    }
}

// Initialize product page functionality
function initializeProductPage() {
    if (document.querySelector('.product-page')) {
        initializeProductImages();
        initializeThumbnails();
        initializeQuantitySelector();
        initializeTabs();
        initializeStarRating();
        initializeWishlist();
        initializeAddToCart();
        initializeReviewForm();
    }
}