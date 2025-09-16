// 🎨 Theme Preview Slider Functionality

document.addEventListener('DOMContentLoaded', function() {
    // 📱 Mobile Slider Elements
    const mainMobileImage = document.getElementById('mainMobileImage');
    const mobileThumbnails = document.getElementById('mobileThumbnails');
    const thumbnailItems = document.querySelectorAll('.mobile-thumbnail');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentIndex = 0;
    let isAnimating = false;
    
    // 🎯 Initialize slider
    function initializeSlider() {
        if (thumbnailItems.length === 0) return;
        
        // Set first thumbnail as active
        updateActiveStates(0);
        
        // Add click listeners to thumbnails
        thumbnailItems.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                if (!isAnimating && index !== currentIndex) {
                    switchToSlide(index);
                }
            });
        });
        
        // Add navigation button listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!isAnimating) {
                    const newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnailItems.length - 1;
                    switchToSlide(newIndex);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!isAnimating) {
                    const newIndex = currentIndex < thumbnailItems.length - 1 ? currentIndex + 1 : 0;
                    switchToSlide(newIndex);
                }
            });
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Add touch/swipe support for mobile
        addTouchSupport();
        
        // Auto-center the active thumbnail
        centerActiveThumbnail();
    }
    
    // 🔄 Switch to specific slide
    function switchToSlide(index) {
        if (isAnimating || index === currentIndex || index < 0 || index >= thumbnailItems.length) {
            return;
        }
        
        isAnimating = true;
        
        // Update main image with fade effect
        mainMobileImage.style.opacity = '0';
        
        setTimeout(() => {
            const newImageSrc = thumbnailItems[index].getAttribute('data-image');
            mainMobileImage.src = newImageSrc;
            mainMobileImage.style.opacity = '1';
            
            // Update active states
            updateActiveStates(index);
            currentIndex = index;
            
            // Center the active thumbnail
            centerActiveThumbnail();
            
            // Add subtle animation effect
            addSlideAnimation();
            
            setTimeout(() => {
                isAnimating = false;
            }, 100);
        }, 200);
    }
    
    // ✨ Update active states
    function updateActiveStates(index) {
        thumbnailItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // 🎯 Center active thumbnail in view
    function centerActiveThumbnail() {
        if (!mobileThumbnails || currentIndex < 0 || currentIndex >= thumbnailItems.length) {
            return;
        }
        
        const container = mobileThumbnails.parentElement;
        const activeThumbnail = thumbnailItems[currentIndex];
        
        if (container && activeThumbnail) {
            const containerWidth = container.offsetWidth;
            const thumbnailLeft = activeThumbnail.offsetLeft;
            const thumbnailWidth = activeThumbnail.offsetWidth;
            
            const scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
            
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }
    
    // ⌨️ Keyboard navigation
    function handleKeyboardNavigation(event) {
        if (isAnimating) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : thumbnailItems.length - 1;
                switchToSlide(prevIndex);
                break;
            case 'ArrowRight':
                event.preventDefault();
                const nextIndex = currentIndex < thumbnailItems.length - 1 ? currentIndex + 1 : 0;
                switchToSlide(nextIndex);
                break;
            case 'Home':
                event.preventDefault();
                switchToSlide(0);
                break;
            case 'End':
                event.preventDefault();
                switchToSlide(thumbnailItems.length - 1);
                break;
        }
    }
    
    // 📱 Touch/Swipe support
    function addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const thumbnailsContainer = document.querySelector('.mobile-thumbnails-container');
        
        if (thumbnailsContainer) {
            thumbnailsContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            thumbnailsContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                
                // Only trigger swipe if horizontal movement is greater than vertical
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        // Swipe right - go to previous
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : thumbnailItems.length - 1;
                        switchToSlide(prevIndex);
                    } else {
                        // Swipe left - go to next
                        const nextIndex = currentIndex < thumbnailItems.length - 1 ? currentIndex + 1 : 0;
                        switchToSlide(nextIndex);
                    }
                }
            }, { passive: true });
        }
    }
    
    // ✨ Add slide animation effect
    function addSlideAnimation() {
        const mobileFrame = document.querySelector('.mobile-frame');
        if (mobileFrame) {
            mobileFrame.style.transform = 'translateY(-8px) scale(1.02)';
            setTimeout(() => {
                mobileFrame.style.transform = '';
            }, 300);
        }
    }
    
    // 🎮 Public API for external control
    window.ThemePreviewSlider = {
        goToSlide: switchToSlide,
        next: () => {
            const nextIndex = currentIndex < thumbnailItems.length - 1 ? currentIndex + 1 : 0;
            switchToSlide(nextIndex);
        },
        prev: () => {
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : thumbnailItems.length - 1;
            switchToSlide(prevIndex);
        },
        getCurrentIndex: () => currentIndex,
        getTotalSlides: () => thumbnailItems.length
    };
    
    // 🚀 Initialize the slider
    initializeSlider();
    
    // 👁️ Handle visibility change to pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isAnimating = false;
        }
    });
    
    // 🔧 Handle window resize
    window.addEventListener('resize', () => {
        setTimeout(centerActiveThumbnail, 100);
    });
    
    // 🎯 Intersection Observer for performance optimization
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Slider is visible, enable interactions
                entry.target.style.pointerEvents = 'auto';
            } else {
                // Slider is not visible, disable interactions for performance
                entry.target.style.pointerEvents = 'none';
            }
        });
    }, observerOptions);
    
    const sliderContainer = document.querySelector('.mobile-slider-container');
    if (sliderContainer) {
        observer.observe(sliderContainer);
    }
});

// 🎨 Add some visual feedback for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state for images
    const images = document.querySelectorAll('.desktop-image, .main-mobile-image, .thumbnail-frame img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'صورة غير متوفرة';
        });
    });
    
    console.log('🎨 Theme preview slider initialized successfully!');
});
