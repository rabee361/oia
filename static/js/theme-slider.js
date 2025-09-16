// 🎨 Theme Slider Functionality - Minimal Implementation

document.addEventListener('DOMContentLoaded', function() {
    
    // 🎯 Initialize theme sliders
    const sliders = document.querySelectorAll('.themes-slider');
    
    sliders.forEach(slider => {
        // ⚡ Add smooth scrolling with mouse wheel
        slider.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            }
        });
        
        // 📱 Touch/swipe support for mobile
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', function(e) {
            isDown = true;
            startX = e.pageX - this.offsetLeft;
            scrollLeft = this.scrollLeft;
            this.style.cursor = 'grabbing';
        });
        
        slider.addEventListener('mouseleave', function() {
            isDown = false;
            this.style.cursor = 'grab';
        });
        
        slider.addEventListener('mouseup', function() {
            isDown = false;
            this.style.cursor = 'grab';
        });
        
        slider.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.offsetLeft;
            const walk = (x - startX) * 2;
            this.scrollLeft = scrollLeft - walk;
        });
    });
    
    
    // ⌨️ Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        const focusedSlider = document.querySelector('.themes-slider:focus-within');
        if (!focusedSlider) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusedSlider.scrollLeft -= 340; // Card width + gap
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusedSlider.scrollLeft += 340; // Card width + gap
        }
    });
    
    // 🎭 Add grab cursor to sliders and scroll indicators
    sliders.forEach(slider => {
        slider.style.cursor = 'grab';

        // 👁️ Add visual feedback for scrollability
        const container = slider.parentElement;

        // Check if content is scrollable and update gradient indicators
        function updateScrollIndicators() {
            const isScrollable = slider.scrollWidth > slider.clientWidth;
            const isAtStart = slider.scrollLeft <= 10;
            const isAtEnd = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 10;

            if (isScrollable) {
                container.style.setProperty('--show-left-gradient', isAtStart ? '0' : '1');
                container.style.setProperty('--show-right-gradient', isAtEnd ? '0' : '1');
            } else {
                container.style.setProperty('--show-left-gradient', '0');
                container.style.setProperty('--show-right-gradient', '0');
            }
        }

        // Update indicators on scroll
        slider.addEventListener('scroll', updateScrollIndicators);

        // Initial check
        updateScrollIndicators();

        // Update on window resize
        window.addEventListener('resize', updateScrollIndicators);
    });

    console.log('🎨 Theme slider initialized successfully!');
});
