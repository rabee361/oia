// Enhanced Navbar functionality for Theme 3
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const mobileSidebar = document.querySelector('.mobile-sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const sidebarClose = document.querySelector('.sidebar-close');
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const userDropdown = document.querySelector('.user-dropdown');
  
  // Initialize theme toggle functionality
  initializeThemeToggle();
  
  // Initialize cart functionality if on cart page
  if (document.querySelector('.cart-page')) {
    initializeCartPage();
  }
  
  // Initialize checkout functionality if on checkout page
  if (document.querySelector('.checkout-page')) {
    initializeCheckoutPage();
  }
  
  // Initialize hero slider if on homepage
  if (document.querySelector('.hero-section')) {
    initializeHeroSlider();
  }
  
  // Toggle mobile sidebar
  function toggleSidebar(show = null) {
    const isActive = mobileSidebar.classList.contains('active');
    const shouldShow = show !== null ? show : !isActive;
    
    mobileSidebar.classList.toggle('active', shouldShow);
    sidebarOverlay.classList.toggle('active', shouldShow);
    hamburger.classList.toggle('active', shouldShow);
    
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = shouldShow ? 'hidden' : '';
  }
  
  // Handle hamburger menu click
  if (hamburger) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });
  }
  
  // Handle sidebar close button
  if (sidebarClose) {
    sidebarClose.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar(false);
    });
  }
  
  // Handle overlay click to close sidebar
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function() {
      toggleSidebar(false);
    });
  }
  
  // Handle submenu toggles
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const menuItem = this.closest('.menu-item');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close other submenus
      submenuToggles.forEach(otherToggle => {
        if (otherToggle !== this) {
          otherToggle.setAttribute('aria-expanded', 'false');
          otherToggle.closest('.menu-item').classList.remove('active');
        }
      });
      
      // Toggle current submenu
      this.setAttribute('aria-expanded', !isExpanded);
      menuItem.classList.toggle('active', !isExpanded);
    });
  });
  
  // Handle dropdown toggles for info bar
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const dropdownId = this.getAttribute('data-dropdown');
      const dropdown = document.getElementById(dropdownId + '-dropdown');
      
      if (dropdown) {
        // Close other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          if (menu !== dropdown) {
            menu.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
      }
    });
  });
  
  // Handle user dropdown
  if (userDropdown) {
    const userBtn = userDropdown.querySelector('.user-btn');
    const userMenu = userDropdown.querySelector('.user-menu');
    
    if (userBtn && userMenu) {
      userBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          if (menu !== userMenu) {
            menu.classList.remove('active');
          }
        });
        
        userMenu.classList.toggle('active');
      });
    }
  }
  
  // Handle dropdown item clicks
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      const dropdown = this.closest('.dropdown-menu');
      if (dropdown) {
        dropdown.classList.remove('active');
      }
      
      // Handle currency/language selection
      if (this.hasAttribute('data-currency')) {
        const currency = this.getAttribute('data-currency');
        const currencyBtn = document.querySelector('.currency-dropdown .dropdown-toggle span');
        if (currencyBtn) {
          currencyBtn.textContent = currency;
        }
        console.log('Currency changed to:', currency);
      }
      
      if (this.hasAttribute('data-language')) {
        const language = this.getAttribute('data-language');
        const languageBtn = document.querySelector('.language-dropdown .dropdown-toggle span');
        if (languageBtn) {
          languageBtn.textContent = language;
        }
        console.log('Language changed to:', language);
      }
    });
  });
  
  // Close sidebar when clicking on regular menu links
  document.querySelectorAll('.sidebar-nav .menu-link:not(.submenu-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      toggleSidebar(false);
    });
  });
  
  // Close sidebar when clicking on submenu links
  document.querySelectorAll('.submenu-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleSidebar(false);
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.info-dropdown') && !e.target.closest('.user-dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
      });
    }
  });
  
  // Handle escape key to close sidebar and dropdowns
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (mobileSidebar.classList.contains('active')) {
        toggleSidebar(false);
      }
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
      });
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Close mobile elements when switching to desktop
      toggleSidebar(false);
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
      });
    }
  });
  
  // Update cart count function
  window.updateCartCount = function(count) {
    const cartCounts = document.querySelectorAll('.cart-btn .item-count');
    cartCounts.forEach(cartCount => {
      if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
      }
    });
  };
  
  // Update wishlist count function
  window.updateWishlistCount = function(count) {
    const wishlistCounts = document.querySelectorAll('.wishlist-btn .item-count');
    wishlistCounts.forEach(wishlistCount => {
      if (wishlistCount) {
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'flex' : 'none';
      }
    });
  };
  
  // Initialize cart and wishlist counts from local storage or API
  function initializeCounts() {
    // This could be replaced with actual API calls
    const cartCount = localStorage.getItem('cartCount') || 1; // Default to 1 for demo
    const wishlistCount = localStorage.getItem('wishlistCount') || 0;
    
    window.updateCartCount(parseInt(cartCount));
    window.updateWishlistCount(parseInt(wishlistCount));
  }
  
  // Initialize counts on page load
  initializeCounts();
  
  // Products Section Functionality
  initializeProductsSection();
  
  // Initialize search functionality
  initializeSearch();
});

// Search functionality
function initializeSearch() {
  const searchForms = document.querySelectorAll('.search-form');
  
  searchForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = this.querySelector('.search-input').value.trim();
      const category = this.querySelector('.search-category-select')?.value || '';
      
      if (query) {
        console.log('Search query:', query, 'Category:', category);
        // Here you would typically redirect to search results or make an API call
        // window.location.href = `/search/?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
      }
    });
  });
}

// Products Section Functions
function initializeProductsSection() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCategories = document.querySelectorAll('.product-category');
  const carouselTrack = document.getElementById('carousel-track');
  const carouselIndicators = document.getElementById('carousel-indicators');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  let currentSlide = 0;
  let currentFilter = 'featured';
  let products = [];
  
  // Initialize products data
  function initializeProducts() {
    products = {
      'featured': [
        {
          image: 'https://via.placeholder.com/250x200/ff6b6b/fff?text=Headphones',
          badge: { text: 'Sale', class: 'sale' },
          categories: 'Accessories, Headphones',
          title: 'Purple Solo 2 Wireless',
          currentPrice: '$248.00',
          originalPrice: null
        },
        {
          image: 'https://via.placeholder.com/250x200/4ecdc4/fff?text=Tablet',
          badge: { text: 'Featured', class: 'featured' },
          categories: 'Laptops, Laptops & Computers',
          title: 'Tablet Red EliteBook Revolve 810 G2',
          currentPrice: '$2,100.00',
          originalPrice: '$2,299.00'
        },
        {
          image: 'https://via.placeholder.com/250x200/95e1d3/fff?text=Headphones',
          badge: null,
          categories: 'Accessories, Headphones',
          title: 'White Solo 2 Wireless',
          currentPrice: '$248.99',
          originalPrice: null
        },
        {
          image: 'https://via.placeholder.com/250x200/feca57/fff?text=Smartphone',
          badge: { text: 'Hot', class: 'hot' },
          categories: 'Smart Phones & Tablets, Smartphones',
          title: 'Smartphone 6S 32GB LTE',
          currentPrice: '$1,100.00',
          originalPrice: '$1,215.00'
        }
      ],
      'on-sale': [
        {
          image: 'https://via.placeholder.com/250x200/ff9ff3/fff?text=Gaming+Mouse',
          badge: { text: '-30%', class: 'sale' },
          categories: 'Accessories, Gaming',
          title: 'Gaming Mouse Pro RGB',
          currentPrice: '$49.99',
          originalPrice: '$69.99'
        },
        {
          image: 'https://via.placeholder.com/250x200/54a0ff/fff?text=Keyboard',
          badge: { text: '-25%', class: 'sale' },
          categories: 'Accessories, Gaming',
          title: 'Mechanical Keyboard RGB',
          currentPrice: '$89.99',
          originalPrice: '$119.99'
        },
        {
          image: 'https://via.placeholder.com/250x200/ff6348/fff?text=Monitor',
          badge: { text: '-20%', class: 'sale' },
          categories: 'Monitors, Display',
          title: '4K Ultra HD Monitor 27"',
          currentPrice: '$399.99',
          originalPrice: '$499.99'
        },
        {
          image: 'https://via.placeholder.com/250x200/2ed573/fff?text=Speaker',
          badge: { text: '-40%', class: 'sale' },
          categories: 'Audio, Speakers',
          title: 'Portable Bluetooth Speaker',
          currentPrice: '$59.99',
          originalPrice: '$99.99'
        }
      ],
      'top-rated': [
        {
          image: 'https://via.placeholder.com/250x200/a55eea/fff?text=Laptop',
          badge: { text: '⭐ 5.0', class: 'top-rated' },
          categories: 'Laptops, Premium',
          title: 'Premium Laptop Pro 16"',
          currentPrice: '$2,499.99',
          originalPrice: null
        },
        {
          image: 'https://via.placeholder.com/250x200/26de81/fff?text=Camera',
          badge: { text: '⭐ 4.9', class: 'top-rated' },
          categories: 'Cameras, Photography',
          title: 'Professional DSLR Camera',
          currentPrice: '$1,899.99',
          originalPrice: null
        },
        {
          image: 'https://via.placeholder.com/250x200/fd79a8/fff?text=Smartwatch',
          badge: { text: '⭐ 4.8', class: 'top-rated' },
          categories: 'Wearables, Smart Devices',
          title: 'Smart Watch Pro Series',
          currentPrice: '$399.99',
          originalPrice: null
        },
        {
          image: 'https://via.placeholder.com/250x200/fdcb6e/fff?text=Drone',
          badge: { text: '⭐ 4.7', class: 'top-rated' },
          categories: 'Drones, Photography',
          title: 'Professional Drone 4K',
          currentPrice: '$899.99',
          originalPrice: null
        }
      ]
    };
  }
  
  // Create product card HTML
  function createProductCard(product) {
    const badgeHtml = product.badge ? 
      `<div class="product-badge ${product.badge.class}">${product.badge.text}</div>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
      `<span class="original-price">${product.originalPrice}</span>` : '';
    
    return `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}">
          ${badgeHtml}
        </div>
        <div class="product-info">
          <div class="product-categories">${product.categories}</div>
          <h3 class="product-title">${product.title}</h3>
          <div class="product-price">
            <span class="current-price">${product.currentPrice}</span>
            ${originalPriceHtml}
          </div>
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    `;
  }
  
  // Update mobile carousel
  function updateMobileCarousel(filterType) {
    if (!carouselTrack || !carouselIndicators) return;
    
    const currentProducts = products[filterType] || [];
    
    // Clear carousel
    carouselTrack.innerHTML = '';
    carouselIndicators.innerHTML = '';
    
    // Add products to carousel
    currentProducts.forEach((product, index) => {
      carouselTrack.innerHTML += createProductCard(product);
      
      // Add indicator
      const indicator = document.createElement('div');
      indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
      indicator.addEventListener('click', () => goToSlide(index));
      carouselIndicators.appendChild(indicator);
    });
    
    // Reset to first slide
    currentSlide = 0;
    updateCarouselPosition();
    updateCarouselControls();
  }
  
  // Update carousel position
  function updateCarouselPosition() {
    if (!carouselTrack) return;
    
    const translateX = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }
  
  // Update carousel control buttons
  function updateCarouselControls() {
    if (!prevBtn || !nextBtn) return;
    
    const maxSlides = products[currentFilter] ? products[currentFilter].length : 0;
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === maxSlides - 1;
  }
  
  // Go to specific slide
  function goToSlide(slideIndex) {
    const maxSlides = products[currentFilter] ? products[currentFilter].length : 0;
    currentSlide = Math.max(0, Math.min(slideIndex, maxSlides - 1));
    updateCarouselPosition();
    updateCarouselControls();
  }
  
  // Next slide
  function nextSlide() {
    const maxSlides = products[currentFilter] ? products[currentFilter].length : 0;
    if (currentSlide < maxSlides - 1) {
      currentSlide++;
      updateCarouselPosition();
      updateCarouselControls();
    }
  }
  
  // Previous slide
  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateCarouselPosition();
      updateCarouselControls();
    }
  }
  
  // Filter products
  function filterProducts(filterType) {
    currentFilter = filterType;
    
    // Update desktop grid
    productCategories.forEach(category => {
      const categoryType = category.getAttribute('data-category');
      category.style.display = categoryType === filterType ? 'contents' : 'none';
    });
    
    // Update mobile carousel
    updateMobileCarousel(filterType);
    
    // Update filter button states
    filterBtns.forEach(btn => {
      const btnFilter = btn.getAttribute('data-filter');
      btn.classList.toggle('active', btnFilter === filterType);
    });
  }
  
  // Event listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterType = btn.getAttribute('data-filter');
      filterProducts(filterType);
    });
  });
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }
  
  // Touch/swipe support for mobile carousel
  let startX = 0;
  let isDragging = false;
  
  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    
    carouselTrack.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      
      isDragging = false;
    });
  }
  
  // Initialize
  initializeProducts();
  updateMobileCarousel(currentFilter);
}

// Product Page Functions
function initializeProductPage() {
  initializeImageCarousel();
  initializeProductOptions();
  initializeQuantityControls();
  initializeProductTabs();
  initializeAddToCart();
}

// Product Image Carousel
function initializeImageCarousel() {
  const mainImage = document.getElementById('mainProductImage');
  const thumbnails = document.querySelectorAll('.thumbnail-item');
  const prevBtn = document.getElementById('prevThumbnail');
  const nextBtn = document.getElementById('nextThumbnail');
  
  let currentImageIndex = 0;
  let images = [];
  
  // Collect all available images
  thumbnails.forEach((thumbnail, index) => {
    const imageUrl = thumbnail.getAttribute('data-image');
    if (imageUrl) {
      images.push(imageUrl);
    }
    
    // Handle thumbnail click
    thumbnail.addEventListener('click', () => {
      setActiveImage(index);
    });
  });
  
  // Set active image
  function setActiveImage(index) {
    if (index >= 0 && index < images.length) {
      currentImageIndex = index;
      
      // Update main image
      if (mainImage) {
        mainImage.src = images[index];
      }
      
      // Update thumbnail states
      thumbnails.forEach((thumbnail, i) => {
        thumbnail.classList.toggle('active', i === index);
      });
      
      // Update navigation buttons
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === images.length - 1;
    }
  }
  
  // Previous image
  function prevImage() {
    if (currentImageIndex > 0) {
      setActiveImage(currentImageIndex - 1);
    }
  }
  
  // Next image
  function nextImage() {
    if (currentImageIndex < images.length - 1) {
      setActiveImage(currentImageIndex + 1);
    }
  }
  
  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', prevImage);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextImage);
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (document.querySelector('.product-page')) {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    }
  });
  
  // Initialize first image
  if (images.length > 0) {
    setActiveImage(0);
  }
}

// Product Options
function initializeProductOptions() {
  const optionBtns = document.querySelectorAll('.option-btn');
  
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const optionName = btn.getAttribute('data-option');
      const optionValue = btn.getAttribute('data-value');
      
      // Remove active class from other options in the same group
      const sameGroupBtns = document.querySelectorAll(`[data-option="${optionName}"]`);
      sameGroupBtns.forEach(groupBtn => {
        groupBtn.classList.remove('active');
      });
      
      // Add active class to clicked option
      btn.classList.add('active');
      
      // Store selected option (you can use this for cart functionality)
      btn.closest('.option-group').setAttribute('data-selected', optionValue);
    });
  });
}

// Quantity Controls
function initializeQuantityControls() {
  const quantityInput = document.getElementById('quantity');
  const decreaseBtn = document.querySelector('[data-action="decrease"]');
  const increaseBtn = document.querySelector('[data-action="increase"]');
  
  if (!quantityInput) return;
  
  const maxQuantity = parseInt(quantityInput.getAttribute('max')) || 999;
  const minQuantity = parseInt(quantityInput.getAttribute('min')) || 1;
  
  function updateQuantity(newValue) {
    const quantity = Math.max(minQuantity, Math.min(maxQuantity, newValue));
    quantityInput.value = quantity;
    
    // Update button states
    if (decreaseBtn) decreaseBtn.disabled = quantity <= minQuantity;
    if (increaseBtn) increaseBtn.disabled = quantity >= maxQuantity;
    
    return quantity;
  }
  
  // Decrease quantity
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || minQuantity;
      updateQuantity(currentValue - 1);
    });
  }
  
  // Increase quantity
  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || minQuantity;
      updateQuantity(currentValue + 1);
    });
  }
  
  // Handle direct input
  quantityInput.addEventListener('input', () => {
    const value = parseInt(quantityInput.value) || minQuantity;
    updateQuantity(value);
  });
  
  // Initialize
  updateQuantity(parseInt(quantityInput.value) || minQuantity);
}

// Product Tabs
function initializeProductTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Remove active class from all tabs and panes
      tabBtns.forEach(b => b.classList.remove('active'));
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

// Add to Cart Functionality
function initializeAddToCart() {
  const addToCartBtn = document.querySelector('.add-to-cart-btn.primary');
  const wishlistBtn = document.querySelector('.wishlist-btn');
  const shareBtn = document.querySelector('.share-btn');
  const relatedAddToCartBtns = document.querySelectorAll('.related-add-to-cart-btn');
  
  // Main add to cart button
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const quantity = document.getElementById('quantity')?.value || 1;
      const selectedOptions = getSelectedOptions();
      
      // Add loading state
      addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
      addToCartBtn.disabled = true;
      
      // Simulate API call (replace with actual implementation)
      setTimeout(() => {
        // Reset button
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        addToCartBtn.disabled = false;
        
        // Show success message (you can customize this)
        showNotification('Product added to cart successfully!', 'success');
        
        // Update cart count
        const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
        const newCount = currentCount + parseInt(quantity);
        localStorage.setItem('cartCount', newCount.toString());
        if (window.updateCartCount) {
          window.updateCartCount(newCount);
        }
      }, 1000);
    });
  }
  
  // Wishlist button
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const icon = wishlistBtn.querySelector('i');
      const isInWishlist = icon.classList.contains('fas');
      
      if (isInWishlist) {
        // Remove from wishlist
        icon.className = 'far fa-heart';
        showNotification('Removed from wishlist', 'info');
        
        // Update wishlist count
        const currentCount = Math.max(0, parseInt(localStorage.getItem('wishlistCount') || '0') - 1);
        localStorage.setItem('wishlistCount', currentCount.toString());
        if (window.updateWishlistCount) {
          window.updateWishlistCount(currentCount);
        }
      } else {
        // Add to wishlist
        icon.className = 'fas fa-heart';
        showNotification('Added to wishlist!', 'success');
        
        // Update wishlist count
        const currentCount = parseInt(localStorage.getItem('wishlistCount') || '0') + 1;
        localStorage.setItem('wishlistCount', currentCount.toString());
        if (window.updateWishlistCount) {
          window.updateWishlistCount(currentCount);
        }
      }
    });
  }
  
  // Share button
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: document.querySelector('.product-title')?.textContent || 'Check out this product',
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          showNotification('Product link copied to clipboard!', 'info');
        });
      }
    });
  }
  
  // Related products add to cart
  relatedAddToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Add loading state
      const originalText = btn.textContent;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        showNotification('Product added to cart!', 'success');
        
        // Update cart count
        const currentCount = parseInt(localStorage.getItem('cartCount') || '0') + 1;
        localStorage.setItem('cartCount', currentCount.toString());
        if (window.updateCartCount) {
          window.updateCartCount(currentCount);
        }
      }, 800);
    });
  });
}

// Get selected product options
function getSelectedOptions() {
  const options = {};
  const optionGroups = document.querySelectorAll('.option-group');
  
  optionGroups.forEach(group => {
    const optionName = group.querySelector('.option-label')?.textContent.replace(':', '') || '';
    const selectedValue = group.getAttribute('data-selected');
    
    if (optionName && selectedValue) {
      options[optionName] = selectedValue;
    }
  });
  
  return options;
}

// Show notification function
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles (you might want to add these to your CSS)
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 350px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });
}

// Remove notification
function removeNotification(notification) {
  notification.style.opacity = '0';
  notification.style.transform = 'translateX(100%)';
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Add the hero slider functionality at the end of the file
// Hero Slider Functions
function initializeHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  let slideInterval;
  
  // Show a specific slide
  function showSlide(index) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Add active class to current slide
    if (slides[index]) {
      slides[index].classList.add('active');
    }
  }
  
  // Next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  
  // Previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }
  
  // Start automatic sliding
  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }
  
  // Stop automatic sliding
  function stopSlider() {
    clearInterval(slideInterval);
  }
  
  // Initialize the slider
  if (slides.length > 0) {
    showSlide(currentSlide);
    startSlider();
    
    // Pause slider when hovering over it
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
      heroSlider.addEventListener('mouseenter', stopSlider);
      heroSlider.addEventListener('mouseleave', startSlider);
    }
  }

  // Initialize cart page functionality
  function initializeCartPage() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    const removeItemBtns = document.querySelectorAll('.remove-item-btn');
    const promoInput = document.querySelector('.promo-input');
    const applyPromoBtn = document.querySelector('.apply-promo-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Handle quantity changes
    quantityInputs.forEach(input => {
      input.addEventListener('change', function() {
        updateCartItem(this);
      });
      
      input.addEventListener('input', function() {
        // Ensure minimum quantity is 1
        if (parseInt(this.value) < 1) {
          this.value = 1;
        }
        updateCartItem(this);
      });
    });
    
    // Handle quantity button clicks
    quantityBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        const quantityInput = this.parentElement.querySelector('.quantity-input');
        let currentValue = parseInt(quantityInput.value);
        
        if (action === 'increase') {
          quantityInput.value = currentValue + 1;
        } else if (action === 'decrease' && currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
        
        updateCartItem(quantityInput);
      });
    });
    
    // Handle item removal
    removeItemBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const cartItem = this.closest('.cart-item');
        removeCartItem(cartItem);
      });
    });
    
    // Handle promo code application
    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', function() {
        applyPromoCode(promoInput.value);
      });
      
      promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          applyPromoCode(this.value);
        }
      });
    }
    
    // Handle checkout button
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        // Add loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        this.disabled = true;
        
        // Simulate checkout process (replace with actual implementation)
        setTimeout(() => {
          window.location.href = '/checkout'; // Replace with actual checkout URL
        }, 1000);
      });
    }
    
    // Update cart item and recalculate totals
    function updateCartItem(quantityInput) {
      const cartItem = quantityInput.closest('.cart-item');
      const quantity = parseInt(quantityInput.value);
      
      // Add visual feedback
      cartItem.style.opacity = '0.7';
      
      // Simulate API call to update cart item
      setTimeout(() => {
        cartItem.style.opacity = '1';
        updateCartSummary();
        
        // Show success message
        showCartMessage('Item updated successfully', 'success');
      }, 300);
    }
    
    // Remove cart item with animation
    function removeCartItem(cartItem) {
      if (confirm('Are you sure you want to remove this item from your cart?')) {
        // Add removal animation
        cartItem.style.transform = 'translateX(-100%)';
        cartItem.style.opacity = '0';
        cartItem.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          cartItem.remove();
          updateCartSummary();
          updateItemsCount();
          showCartMessage('Item removed from cart', 'info');
        }, 300);
      }
    }
    
    // Apply promo code
    function applyPromoCode(code) {
      if (!code.trim()) {
        showCartMessage('Please enter a promo code', 'error');
        return;
      }
      
      // Add loading state to button
      applyPromoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
      applyPromoBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        applyPromoBtn.innerHTML = 'Apply';
        applyPromoBtn.disabled = false;
        
        // Simulate promo code validation
        const validCodes = ['SAVE10', 'WELCOME20', 'SUMMER15'];
        if (validCodes.includes(code.toUpperCase())) {
          showCartMessage('Promo code applied successfully!', 'success');
          updateCartSummary();
          promoInput.value = '';
        } else {
          showCartMessage('Invalid promo code', 'error');
        }
      }, 1000);
    }
    
    // Update cart summary totals
    function updateCartSummary() {
      const cartItems = document.querySelectorAll('.cart-item');
      let subtotal = 0;
      let totalItems = 0;
      
      cartItems.forEach(item => {
        const quantityInput = item.querySelector('.quantity-input');
        const priceElement = item.querySelector('.current-price');
        
        if (quantityInput && priceElement) {
          const quantity = parseInt(quantityInput.value);
          const price = parseFloat(priceElement.textContent.replace('$', '').replace(',', ''));
          
          subtotal += (quantity * price);
          totalItems += quantity;
        }
      });
      
      // Update summary values
      const subtotalElement = document.querySelector('.summary-item:first-child .summary-value');
      const totalElement = document.querySelector('.total-value');
      const itemsCountElement = document.querySelector('.items-count');
      
      if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      }
      
      // Calculate tax and total (simplified calculation)
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 50 ? 0 : 25; // Free shipping over $50
      const total = subtotal + tax + shipping;
      
      if (totalElement) {
        totalElement.textContent = `$${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      }
      
      if (itemsCountElement) {
        itemsCountElement.textContent = `(${totalItems})`;
      }
    }
    
    // Update items count in header
    function updateItemsCount() {
      const cartItems = document.querySelectorAll('.cart-item');
      let totalItems = 0;
      
      cartItems.forEach(item => {
        const quantityInput = item.querySelector('.quantity-input');
        if (quantityInput) {
          totalItems += parseInt(quantityInput.value);
        }
      });
      
      const itemsCountElement = document.querySelector('.items-count');
      if (itemsCountElement) {
        itemsCountElement.textContent = `(${totalItems})`;
      }
      
      // Update cart title if no items
      if (totalItems === 0) {
        const cartItemsSection = document.querySelector('.cart-items-section');
        cartItemsSection.innerHTML = `
          <div class="empty-cart">
            <div class="empty-cart-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <h3>Your cart is empty</h3>
            <p>Add some items to get started!</p>
            <a href="#" class="continue-btn">
              <i class="fas fa-arrow-left"></i>
              Continue Shopping
            </a>
          </div>
        `;
      }
    }
    
    // Show cart messages
    function showCartMessage(message, type = 'info') {
      // Remove existing messages
      const existingMessage = document.querySelector('.cart-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `cart-message cart-message-${type}`;
      messageElement.innerHTML = `
        <i class="fas ${getMessageIcon(type)}"></i>
        <span>${message}</span>
      `;
      
      // Add styles
      Object.assign(messageElement.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: getMessageColor(type),
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
      });
      
      document.body.appendChild(messageElement);
      
      // Animate in
      setTimeout(() => {
        messageElement.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        messageElement.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.remove();
          }
        }, 300);
      }, 3000);
    }
    
    function getMessageIcon(type) {
      switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
      }
    }
    
    function getMessageColor(type) {
      switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'info': return '#3b82f6';
        default: return '#6b7280';
      }
    }
  }
  
  // Initialize checkout page functionality
  function initializeCheckoutPage() {
    const checkoutForm = document.getElementById('checkoutForm');
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const creditCardForm = document.getElementById('creditCardForm');
    const sameAsShippingCheckbox = document.getElementById('sameAsShipping');
    const promoInput = document.querySelector('.promo-input');
    const applyPromoBtn = document.querySelector('.apply-promo-btn');
    const completeOrderBtn = document.querySelector('.complete-order-btn');
    const phoneInput = document.getElementById('phone');
    const zipCodeInput = document.getElementById('zipCode');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    // Form validation patterns
    const patterns = {
      phone: /^[\+]?[1-9][\d]{0,15}$/,
      zipCode: /^\d{5}(-\d{4})?$/,
      cardNumber: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
      expiryDate: /^(0[1-9]|1[0-2])\/\d{2}$/,
      cvv: /^\d{3,4}$/
    };
    
    // Initialize shipping cost calculation
    updateShippingCost();
    
    // Handle shipping method changes
    shippingRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        updateShippingCost();
        showCheckoutMessage('Shipping method updated', 'info');
      });
    });
    
    // Handle payment method changes
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        toggleCreditCardForm();
      });
    });
    
    // Handle billing address toggle
    if (sameAsShippingCheckbox) {
      sameAsShippingCheckbox.addEventListener('change', function() {
        // This would typically show/hide billing address form
        if (this.checked) {
          showCheckoutMessage('Billing address will be same as shipping', 'info');
        } else {
          showCheckoutMessage('Please enter billing address', 'info');
        }
      });
    }
    
    // Handle promo code application
    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', function() {
        applyPromoCode(promoInput.value);
      });
      
      promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyPromoCode(this.value);
        }
      });
    }
    
    // Handle phone number formatting
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
      });
      
      phoneInput.addEventListener('blur', function() {
        validateField(this, patterns.phone, 'Please enter a valid phone number');
      });
    }
    
    // Handle ZIP code validation
    if (zipCodeInput) {
      zipCodeInput.addEventListener('blur', function() {
        validateField(this, patterns.zipCode, 'Please enter a valid ZIP code (12345 or 12345-6789)');
      });
    }
    
    // Handle card number formatting
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', function() {
        formatCardNumber(this);
      });
      
      cardNumberInput.addEventListener('blur', function() {
        validateField(this, patterns.cardNumber, 'Please enter a valid card number');
      });
    }
    
    // Handle expiry date formatting
    if (expiryDateInput) {
      expiryDateInput.addEventListener('input', function() {
        formatExpiryDate(this);
      });
      
      expiryDateInput.addEventListener('blur', function() {
        validateField(this, patterns.expiryDate, 'Please enter a valid expiry date (MM/YY)');
      });
    }
    
    // Handle CVV validation
    if (cvvInput) {
      cvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 4);
      });
      
      cvvInput.addEventListener('blur', function() {
        validateField(this, patterns.cvv, 'Please enter a valid CVV');
      });
    }
    
    // Handle form submission
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
      });
    }
    
    // Update shipping cost based on selected method
    function updateShippingCost() {
      const selectedShipping = document.querySelector('input[name="shipping"]:checked');
      const shippingCostElement = document.querySelector('.shipping-cost');
      const finalTotalElement = document.querySelector('.final-total');
      
      if (selectedShipping && shippingCostElement && finalTotalElement) {
        let shippingCost = 0;
        switch (selectedShipping.value) {
          case 'standard':
            shippingCost = 5.00;
            break;
          case 'express':
            shippingCost = 15.00;
            break;
          case 'overnight':
            shippingCost = 25.00;
            break;
        }
        
        shippingCostElement.textContent = `$${shippingCost.toFixed(2)}`;
        
        // Update total (simplified calculation)
        const subtotal = 4548.00;
        const tax = 363.84;
        const total = subtotal + shippingCost + tax;
        finalTotalElement.textContent = `$${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      }
    }
    
    // Toggle credit card form visibility
    function toggleCreditCardForm() {
      const selectedPayment = document.querySelector('input[name="payment"]:checked');
      if (selectedPayment && creditCardForm) {
        if (selectedPayment.value === 'credit-card') {
          creditCardForm.style.display = 'block';
          creditCardForm.classList.remove('hidden');
        } else {
          creditCardForm.style.display = 'none';
          creditCardForm.classList.add('hidden');
        }
      }
    }
    
    // Apply promo code
    function applyPromoCode(code) {
      if (!code.trim()) {
        showCheckoutMessage('Please enter a promo code', 'error');
        return;
      }
      
      // Add loading state to button
      applyPromoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
      applyPromoBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        applyPromoBtn.innerHTML = 'Apply';
        applyPromoBtn.disabled = false;
        
        // Simulate promo code validation
        const validCodes = ['SAVE10', 'WELCOME20', 'SUMMER15'];
        if (validCodes.includes(code.toUpperCase())) {
          showCheckoutMessage('Promo code applied successfully!', 'success');
          // Add discount row to totals
          addDiscountRow(code.toUpperCase());
          promoInput.value = '';
        } else {
          showCheckoutMessage('Invalid promo code', 'error');
        }
      }, 1000);
    }
    
    // Add discount row to order totals
    function addDiscountRow(code) {
      const orderTotals = document.querySelector('.order-totals');
      const existingDiscount = orderTotals.querySelector('.discount-row');
      
      // Remove existing discount if any
      if (existingDiscount) {
        existingDiscount.remove();
      }
      
      // Create new discount row
      const discountRow = document.createElement('div');
      discountRow.className = 'total-row discount-row';
      discountRow.innerHTML = `
        <span class="total-label">Discount (${code})</span>
        <span class="total-value" style="color: #10b981;">-$50.00</span>
      `;
      
      // Insert before the final total
      const finalTotalRow = orderTotals.querySelector('.total-final');
      orderTotals.insertBefore(discountRow, finalTotalRow);
      
      // Update final total
      updateFinalTotal();
    }
    
    // Update final total calculation
    function updateFinalTotal() {
      const subtotal = 4548.00;
      const shippingCost = parseFloat(document.querySelector('.shipping-cost').textContent.replace('$', ''));
      const tax = 363.84;
      const discount = document.querySelector('.discount-row') ? 50.00 : 0;
      const total = subtotal + shippingCost + tax - discount;
      
      document.querySelector('.final-total').textContent = `$${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    }
    
    // Format phone number
    function formatPhoneNumber(input) {
      let value = input.value.replace(/\D/g, '');
      if (value.length >= 6) {
        value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
      } else if (value.length >= 3) {
        value = value.substring(0, 3) + '-' + value.substring(3);
      }
      input.value = value;
    }
    
    // Format card number
    function formatCardNumber(input) {
      let value = input.value.replace(/\D/g, '');
      value = value.substring(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      input.value = value;
    }
    
    // Format expiry date
    function formatExpiryDate(input) {
      let value = input.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      input.value = value;
    }
    
    // Validate field with pattern
    function validateField(input, pattern, errorMessage) {
      const isValid = pattern.test(input.value);
      
      if (input.value && !isValid) {
        input.style.borderColor = '#ff4757';
        showCheckoutMessage(errorMessage, 'error');
      } else {
        input.style.borderColor = '#dee2e6';
      }
      
      return isValid;
    }
    
    // Process order submission
    function processOrder() {
      // Validate required fields
      const requiredFields = checkoutForm.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#ff4757';
          isValid = false;
        } else {
          field.style.borderColor = '#dee2e6';
        }
      });
      
      if (!isValid) {
        showCheckoutMessage('Please fill in all required fields', 'error');
        return;
      }
      
      // Show processing state
      completeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Order...';
      completeOrderBtn.disabled = true;
      
      // Simulate order processing
      setTimeout(() => {
        showCheckoutMessage('Order placed successfully! Redirecting...', 'success');
        
        setTimeout(() => {
          // Redirect to success page or order confirmation
          window.location.href = '/order-success'; // Replace with actual success URL
        }, 2000);
      }, 3000);
    }
    
    // Show checkout messages
    function showCheckoutMessage(message, type = 'info') {
      // Remove existing messages
      const existingMessage = document.querySelector('.checkout-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `checkout-message checkout-message-${type}`;
      messageElement.innerHTML = `
        <i class="fas ${getMessageIcon(type)}"></i>
        <span>${message}</span>
      `;
      
      // Add styles
      Object.assign(messageElement.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: getMessageColor(type),
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
      });
      
      document.body.appendChild(messageElement);
      
      // Animate in
      setTimeout(() => {
        messageElement.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove after 4 seconds
      setTimeout(() => {
        messageElement.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.remove();
          }
        }, 300);
      }, 4000);
    }
    
    function getMessageIcon(type) {
      switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
      }
    }
    
    function getMessageColor(type) {
      switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'info': return '#3b82f6';
        default: return '#6b7280';
      }
    }
    
    // Initialize form state
    toggleCreditCardForm();
  }
}
