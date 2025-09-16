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
  
  // Initialize product page functionality if on product page
  if (document.querySelector('.product-page')) {
    initializeProductPage();
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
}
