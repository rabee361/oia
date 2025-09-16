// 🖼️ Image Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // 🖼️ Image Upload and Slider
    function initImageUpload() {
        const imageSlider = document.getElementById('imageSlider');
        const imageIndicators = document.getElementById('imageIndicators');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        // Check if elements exist (only run on pages with image slider)
        if (!imageSlider || !imageIndicators || !prevBtn || !nextBtn) {
            return;
        }

        let currentSlide = 0;
        let images = [];

        // Handle file input change
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('image-input')) {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            addImageSlide(e.target.result, file.name);
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        });

        function addImageSlide(src, name) {
            images.push({ src, name });
            updateSlider();
        }

        function updateSlider() {
            // Clear existing slides except placeholder
            const slides = imageSlider.querySelectorAll('.image-slide:not(:first-child)');
            slides.forEach(slide => slide.remove());

            // Add image slides
            images.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.className = 'image-slide';
                slide.innerHTML = `
                    <img src="${image.src}" alt="${image.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    <button type="button" class="remove-image-btn" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imageSlider.appendChild(slide);
            });

            // Update indicators
            updateIndicators();
            
            // Show first image if available
            if (images.length > 0) {
                currentSlide = 1; // Skip placeholder
                showSlide(currentSlide);
            } else {
                currentSlide = 0;
                showSlide(0);
            }
        }

        function updateIndicators() {
            imageIndicators.innerHTML = '';
            
            // Placeholder indicator
            const placeholderIndicator = document.createElement('span');
            placeholderIndicator.className = 'indicator';
            if (currentSlide === 0) placeholderIndicator.classList.add('active');
            placeholderIndicator.addEventListener('click', () => showSlide(0));
            imageIndicators.appendChild(placeholderIndicator);

            // Image indicators
            images.forEach((_, index) => {
                const indicator = document.createElement('span');
                indicator.className = 'indicator';
                if (currentSlide === index + 1) indicator.classList.add('active');
                indicator.addEventListener('click', () => showSlide(index + 1));
                imageIndicators.appendChild(indicator);
            });
        }

        function showSlide(index) {
            const slides = imageSlider.querySelectorAll('.image-slide');
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            const indicators = imageIndicators.querySelectorAll('.indicator');
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });

            currentSlide = index;
            
            // Update navigation buttons
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === slides.length - 1;
        }

        // Navigation buttons
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
            }
        });

        nextBtn.addEventListener('click', () => {
            const totalSlides = imageSlider.querySelectorAll('.image-slide').length;
            if (currentSlide < totalSlides - 1) {
                showSlide(currentSlide + 1);
            }
        });

        // Remove image functionality
        imageSlider.addEventListener('click', function(e) {
            if (e.target.closest('.remove-image-btn')) {
                const index = parseInt(e.target.closest('.remove-image-btn').dataset.index);
                images.splice(index, 1);
                updateSlider();
            }
        });

        console.log('🖼️ Image slider initialized successfully!');
    }

    // 🚀 Initialize image slider
    initImageUpload();
});
