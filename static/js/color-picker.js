// 🎨 Color Picker Functionality
class ColorPicker {
    constructor() {
        this.colors = {
            primary: '#6366f1',
            secondary: '#10b981',
            tertiary: '#f59e0b'
        };
        
        this.presetColors = {
            primary: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
            secondary: ['#10b981', '#06b6d4', '#8b5cf6', '#6366f1', '#f59e0b', '#ef4444'],
            tertiary: ['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981']
        };

        this.init();
    }

    init() {
        this.setupColorInputs();
        this.createPresetPalettes();
        this.setupEventListeners();
        this.updateSkeletonColors();
    }

    setupColorInputs() {
        // Primary Color
        const primaryInput = document.getElementById('primary-color');
        const primaryDisplay = document.getElementById('primary-display');
        
        if (primaryInput && primaryDisplay) {
            primaryInput.addEventListener('input', (e) => {
                this.updateColor('primary', e.target.value);
            });
        }

        // Secondary Color
        const secondaryInput = document.getElementById('secondary-color');
        const secondaryDisplay = document.getElementById('secondary-display');
        
        if (secondaryInput && secondaryDisplay) {
            secondaryInput.addEventListener('input', (e) => {
                this.updateColor('secondary', e.target.value);
            });
        }

        // Tertiary Color
        const tertiaryInput = document.getElementById('tertiary-color');
        const tertiaryDisplay = document.getElementById('tertiary-display');
        
        if (tertiaryInput && tertiaryDisplay) {
            tertiaryInput.addEventListener('input', (e) => {
                this.updateColor('tertiary', e.target.value);
            });
        }
    }

    createPresetPalettes() {
        Object.keys(this.presetColors).forEach(colorType => {
            const card = document.querySelector(`#${colorType}-color`).closest('.color-picker-card');
            if (!card) return;

            // Create presets container
            const presetsContainer = document.createElement('div');
            presetsContainer.className = 'color-presets';
            
            this.presetColors[colorType].forEach(color => {
                const presetBtn = document.createElement('div');
                presetBtn.className = 'preset-color';
                presetBtn.style.backgroundColor = color;
                presetBtn.title = color;
                
                presetBtn.addEventListener('click', () => {
                    this.updateColor(colorType, color);
                    document.getElementById(`${colorType}-color`).value = color;
                });
                
                presetsContainer.appendChild(presetBtn);
            });

            card.querySelector('.color-picker-container').appendChild(presetsContainer);
        });
    }

    updateColor(type, color) {
        this.colors[type] = color;
        
        // Update display
        const display = document.getElementById(`${type}-display`);
        if (display) {
            display.textContent = color;
            display.style.borderColor = color;
        }

        // Update CSS variables
        document.documentElement.style.setProperty(`--${type}-purple`, color);
        
        // Add updating animation
        const input = document.getElementById(`${type}-color`);
        if (input) {
            input.classList.add('updating');
            setTimeout(() => input.classList.remove('updating'), 600);
        }

        // Update skeleton preview
        this.updateSkeletonColors();
        
        // Check color contrast
        this.checkColorContrast(type, color);
        
        // Generate color harmony
        this.generateColorHarmony(type, color);
    }

    updateSkeletonColors() {
        const skeleton = document.getElementById('colors-skeleton');
        if (!skeleton) return;

        // Add updating animation
        skeleton.classList.add('skeleton-updating');
        setTimeout(() => skeleton.classList.remove('skeleton-updating'), 800);

        // Update primary elements
        const primaryElements = skeleton.querySelectorAll('.primary-bg');
        primaryElements.forEach(el => {
            el.style.backgroundColor = this.colors.primary;
        });

        // Update secondary elements
        const secondaryElements = skeleton.querySelectorAll('.secondary-bg');
        secondaryElements.forEach(el => {
            el.style.backgroundColor = this.colors.secondary;
        });

        // Update tertiary elements
        const tertiaryElements = skeleton.querySelectorAll('.tertiary-color');
        tertiaryElements.forEach(el => {
            el.style.color = this.colors.tertiary;
        });
    }

    checkColorContrast(type, color) {
        const card = document.querySelector(`#${type}-color`).closest('.color-picker-card');
        if (!card) return;

        const contrast = this.calculateContrast(color, '#ffffff');
        
        // Remove existing validation
        card.removeAttribute('data-contrast');
        const existingValidation = card.querySelector('.color-validation');
        if (existingValidation) {
            existingValidation.remove();
        }

        // Add validation message
        const validation = document.createElement('div');
        validation.className = 'color-validation';
        
        if (contrast >= 4.5) {
            validation.innerHTML = '<span class="validation-good">✅ تباين جيد</span>';
        } else if (contrast >= 3) {
            validation.innerHTML = '<span class="validation-warning">⚠️ تباين متوسط</span>';
            card.setAttribute('data-contrast', 'medium');
        } else {
            validation.innerHTML = '<span class="validation-error">❌ تباين ضعيف</span>';
            card.setAttribute('data-contrast', 'low');
        }
        
        card.querySelector('.color-picker-container').appendChild(validation);
    }

    calculateContrast(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        const l1 = this.getLuminance(rgb1);
        const l2 = this.getLuminance(rgb2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    getLuminance(rgb) {
        const { r, g, b } = rgb;
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    generateColorHarmony(type, color) {
        const card = document.querySelector(`#${type}-color`).closest('.color-picker-card');
        if (!card) return;

        // Remove existing harmony
        const existingHarmony = card.querySelector('.color-harmony');
        if (existingHarmony) {
            existingHarmony.remove();
        }

        const harmony = document.createElement('div');
        harmony.className = 'color-harmony';
        
        const title = document.createElement('div');
        title.className = 'harmony-title';
        title.textContent = 'ألوان متناسقة';
        
        const colorsContainer = document.createElement('div');
        colorsContainer.className = 'harmony-colors';
        
        const harmonies = this.getColorHarmonies(color);
        harmonies.forEach(harmonyColor => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'harmony-color';
            colorDiv.style.backgroundColor = harmonyColor;
            colorDiv.title = harmonyColor;
            
            colorDiv.addEventListener('click', () => {
                this.updateColor(type, harmonyColor);
                document.getElementById(`${type}-color`).value = harmonyColor;
            });
            
            colorsContainer.appendChild(colorDiv);
        });
        
        harmony.appendChild(title);
        harmony.appendChild(colorsContainer);
        card.appendChild(harmony);
    }

    getColorHarmonies(hex) {
        const hsl = this.hexToHsl(hex);
        const harmonies = [];
        
        // Complementary
        harmonies.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        
        // Triadic
        harmonies.push(this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
        harmonies.push(this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
        
        // Analogous
        harmonies.push(this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
        harmonies.push(this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
        
        return harmonies;
    }

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    setupEventListeners() {
        // Reset theme button
        const resetBtn = document.getElementById('reset-theme');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }

        // Save theme button
        const saveBtn = document.getElementById('save-theme');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveTheme();
            });
        }
    }

    resetToDefaults() {
        const defaults = {
            primary: '#6366f1',
            secondary: '#10b981',
            tertiary: '#f59e0b'
        };

        Object.keys(defaults).forEach(type => {
            const input = document.getElementById(`${type}-color`);
            if (input) {
                input.value = defaults[type];
                this.updateColor(type, defaults[type]);
            }
        });
    }

    saveTheme() {
        const themeData = {
            colors: this.colors,
            timestamp: new Date().toISOString()
        };

        // Here you would typically send to Django backend
        console.log('💾 Saving theme:', themeData);
        
        // Show success message
        this.showSaveMessage();
    }

    showSaveMessage() {
        const message = document.createElement('div');
        message.className = 'save-message';
        message.innerHTML = '✅ تم حفظ المظهر بنجاح!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ColorPicker();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
