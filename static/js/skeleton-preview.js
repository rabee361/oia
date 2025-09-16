// 👁️ Skeleton Preview Functionality
class SkeletonPreview {
    constructor() {
        this.images = {
            logo: null,
            favicon: null,
            hero: null
        };
        
        this.init();
    }

    init() {
        this.setupImageUploads();
        this.setupEventListeners();
    }

    setupImageUploads() {
        // Logo Upload
        this.setupImageUpload('logo', (imageUrl) => {
            this.updateSkeletonLogo(imageUrl);
        });

        // Favicon Upload
        this.setupImageUpload('favicon', (imageUrl) => {
            this.updateSkeletonFavicon(imageUrl);
        });

        // Hero Background Upload
        this.setupImageUpload('hero', (imageUrl) => {
            this.updateSkeletonHero(imageUrl);
        });
    }

    setupImageUpload(type, callback) {
        const uploadArea = document.getElementById(`${type}-upload`);
        const input = document.getElementById(`${type}-input`);
        const preview = document.getElementById(`${type}-preview`);
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        const img = document.getElementById(`${type}-img`);
        const removeBtn = document.getElementById(`remove-${type}`);

        if (!uploadArea || !input) return;

        // Click to upload
        uploadArea.addEventListener('click', () => {
            input.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0], type, callback);
            }
        });

        // File input change
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file, type, callback);
            }
        });

        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeImage(type);
            });
        }
    }

    handleFileUpload(file, type, callback) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('يرجى اختيار ملف صورة صحيح');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('حجم الملف كبير جداً (الحد الأقصى 5MB)');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.images[type] = imageUrl;
            
            // Update preview
            this.updateImagePreview(type, imageUrl);
            
            // Update skeleton
            callback(imageUrl);
            
            // Show success animation
            this.showUploadSuccess(type);
        };

        reader.readAsDataURL(file);
    }

    updateImagePreview(type, imageUrl) {
        const preview = document.getElementById(`${type}-preview`);
        const placeholder = document.querySelector(`#${type}-upload .upload-placeholder`);
        const img = document.getElementById(`${type}-img`);

        if (preview && placeholder && img) {
            img.src = imageUrl;
            placeholder.style.display = 'none';
            preview.style.display = 'block';
        }
    }

    updateSkeletonLogo(imageUrl) {
        const skeletonLogo = document.getElementById('skeleton-logo');
        if (!skeletonLogo) return;

        // Add update animation
        skeletonLogo.classList.add('skeleton-updating');
        setTimeout(() => skeletonLogo.classList.remove('skeleton-updating'), 800);

        // Update logo
        const existingImg = skeletonLogo.querySelector('img');
        if (existingImg) {
            existingImg.src = imageUrl;
        } else {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Logo';
            
            const placeholder = skeletonLogo.querySelector('.logo-placeholder');
            if (placeholder) {
                skeletonLogo.insertBefore(img, placeholder);
                placeholder.style.display = 'none';
            }
        }
    }

    updateSkeletonFavicon(imageUrl) {
        const skeletonFavicon = document.getElementById('skeleton-favicon');
        if (!skeletonFavicon) return;

        // Add update animation
        skeletonFavicon.classList.add('skeleton-updating');
        setTimeout(() => skeletonFavicon.classList.remove('skeleton-updating'), 800);

        // Update favicon
        skeletonFavicon.style.backgroundImage = `url(${imageUrl})`;
        skeletonFavicon.style.backgroundSize = 'cover';
        skeletonFavicon.style.backgroundPosition = 'center';
        skeletonFavicon.textContent = '';
    }

    updateSkeletonHero(imageUrl) {
        const skeletonHero = document.getElementById('skeleton-hero');
        if (!skeletonHero) return;

        // Add update animation
        skeletonHero.classList.add('skeleton-updating');
        setTimeout(() => skeletonHero.classList.remove('skeleton-updating'), 800);

        // Update hero background
        skeletonHero.style.backgroundImage = `url(${imageUrl})`;
        skeletonHero.style.backgroundSize = 'cover';
        skeletonHero.style.backgroundPosition = 'center';
    }

    removeImage(type) {
        this.images[type] = null;
        
        // Reset preview
        const preview = document.getElementById(`${type}-preview`);
        const placeholder = document.querySelector(`#${type}-upload .upload-placeholder`);
        const input = document.getElementById(`${type}-input`);

        if (preview && placeholder && input) {
            preview.style.display = 'none';
            placeholder.style.display = 'flex';
            input.value = '';
        }

        // Reset skeleton
        this.resetSkeletonImage(type);
    }

    resetSkeletonImage(type) {
        switch (type) {
            case 'logo':
                const skeletonLogo = document.getElementById('skeleton-logo');
                if (skeletonLogo) {
                    const img = skeletonLogo.querySelector('img');
                    const placeholder = skeletonLogo.querySelector('.logo-placeholder');
                    if (img) img.remove();
                    if (placeholder) placeholder.style.display = 'block';
                }
                break;

            case 'favicon':
                const skeletonFavicon = document.getElementById('skeleton-favicon');
                if (skeletonFavicon) {
                    skeletonFavicon.style.backgroundImage = '';
                    skeletonFavicon.textContent = '🔖';
                }
                break;

            case 'hero':
                const skeletonHero = document.getElementById('skeleton-hero');
                if (skeletonHero) {
                    skeletonHero.style.backgroundImage = '';
                }
                break;
        }
    }

    showUploadSuccess(type) {
        const uploadCard = document.querySelector(`#${type}-upload`).closest('.upload-card');
        if (!uploadCard) return;

        // Add success animation
        uploadCard.classList.add('upload-success');
        
        // Create success indicator
        const successIndicator = document.createElement('div');
        successIndicator.className = 'upload-success-indicator';
        successIndicator.innerHTML = '✅';
        successIndicator.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: #10b981;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            animation: successPop 0.5s ease;
            z-index: 10;
        `;

        uploadCard.style.position = 'relative';
        uploadCard.appendChild(successIndicator);

        // Remove after animation
        setTimeout(() => {
            uploadCard.classList.remove('upload-success');
            successIndicator.remove();
        }, 2000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'upload-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    setupEventListeners() {
        // Add drag over styles
        const style = document.createElement('style');
        style.textContent = `
            .upload-area.drag-over {
                border-color: var(--primary-purple);
                background: var(--bg-light);
                transform: scale(1.02);
            }
            
            .upload-success {
                border-color: #10b981 !important;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.3) !important;
            }
            
            @keyframes successPop {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Public method to get all images
    getImages() {
        return this.images;
    }

    // Public method to reset all images
    resetAll() {
        Object.keys(this.images).forEach(type => {
            this.removeImage(type);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skeletonPreview = new SkeletonPreview();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkeletonPreview;
}
