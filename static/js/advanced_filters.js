// Advanced Filter Toggle Functionality
        document.getElementById('advancedFilterBtn').addEventListener('click', function() {
            const filterContent = document.getElementById('advancedFilterContent');
            const toggleArrow = this.querySelector('.toggle-arrow');
            
            if (filterContent.classList.contains('active')) {
                filterContent.classList.remove('active');
                this.classList.remove('active');
                toggleArrow.style.transform = 'rotate(0deg)';
            } else {
                filterContent.classList.add('active');
                this.classList.add('active');
                toggleArrow.style.transform = 'rotate(180deg)';
            }
        });
        
        // Filter Options Click Handler
        document.querySelectorAll('.advanced-filter-header').forEach(option => {
            option.addEventListener('click', function() {
                const filterType = this.getAttribute('data-filter');
                showFilterForm(filterType);
            });
        });
        
        // Show Filter Form as dropdown
        function showFilterForm(filterType) {
            // Hide all forms
            document.querySelectorAll('.advanced-filter-form').forEach(form => {
                form.classList.remove('active');
            });
            
            // Show selected form
            const formId = filterType + 'Form';
            const formElement = document.getElementById(formId);
            formElement.classList.add('active');
        }
        
        // Close Filter Form
        function closeFilterForm(formId) {
            document.getElementById(formId).classList.remove('active');
        }
        
        // Add Filter Tag
        function addFilterTag(filterType, value) {
            const tagsContainer = document.getElementById('filterTags');
            
            // Remove "Clear All" button temporarily
            const clearButton = tagsContainer.querySelector('.clear-all-tags');
            if (clearButton) {
                tagsContainer.removeChild(clearButton);
            }
            
            // Create tag element
            const tagElement = document.createElement('div');
            tagElement.className = 'advanced-filter-tag';
            
            // Set tag text based on filter type
            let tagText = '';
            switch(filterType) {
                case 'status':
                    tagText = 'الحالة: ' + getStatusText(value);
                    break;
                case 'date':
                    tagText = 'التاريخ: ' + value;
                    break;
                case 'amount':
                    tagText = 'المبلغ: ' + value;
                    break;
                default:
                    tagText = value;
            }
            
            tagElement.innerHTML = `
                <span>${tagText}</span>
                <button class="remove-tag" onclick="removeTag(this)">×</button>
            `;
            
            // Add tag to container
            tagsContainer.appendChild(tagElement);
            
            // Re-add "Clear All" button
            if (clearButton) {
                tagsContainer.appendChild(clearButton);
            }
        }
        
        // Get status text for display
        function getStatusText(value) {
            const statusMap = {
                'pending': 'قيد الانتظار',
                'processing': 'قيد التنفيذ',
                'shipped': 'تم الشحن',
                'delivered': 'تم التسليم',
                'cancelled': 'ملغى'
            };
            return statusMap[value] || value;
        }
        
        // Remove Tag
        function removeTag(button) {
            const tagElement = button.parentElement;
            tagElement.remove();
        }
        
        // Clear All Tags
        function clearAllTags() {
            const tagsContainer = document.getElementById('filterTags');
            const tags = tagsContainer.querySelectorAll('.advanced-filter-tag');
            tags.forEach(tag => {
                tag.remove();
            });
        }
        
        // Close all filter forms when clicking outside
        document.addEventListener('click', function(event) {
            const filterForms = document.querySelectorAll('.advanced-filter-form');
            const filterHeaders = document.querySelectorAll('.advanced-filter-header');
            
            // Check if click is outside all filter forms and headers
            let isOutside = true;
            
            filterForms.forEach(form => {
                if (form.classList.contains('active') && (form.contains(event.target) || 
                    event.target.closest('.advanced-filter-header')?.getAttribute('data-filter') + 'Form' === form.id)) {
                    isOutside = false;
                }
            });
            
            filterHeaders.forEach(header => {
                if (header.contains(event.target)) {
                    isOutside = false;
                }
            });
            
            // Close all forms if click is outside
            if (isOutside) {
                filterForms.forEach(form => {
                    form.classList.remove('active');
                });
            }
        });
        
        // Initialize form event listeners
        function initFormEventListeners() {
            // Status form
            const statusSelect = document.getElementById('statusFilter');
            if (statusSelect) {
                statusSelect.addEventListener('change', function() {
                    if (this.value) {
                        addFilterTag('status', this.value);
                        closeFilterForm('statusForm');
                    }
                });
            }
            
            // Date forms
            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');
            if (startDateInput) {
                startDateInput.addEventListener('change', function() {
                    if (this.value) {
                        addFilterTag('date', 'من: ' + this.value);
                    }
                });
            }
            if (endDateInput) {
                endDateInput.addEventListener('change', function() {
                    if (this.value) {
                        addFilterTag('date', 'إلى: ' + this.value);
                    }
                });
            }
            
            // Amount forms
            const minAmountInput = document.getElementById('minAmount');
            const maxAmountInput = document.getElementById('maxAmount');
            if (minAmountInput) {
                minAmountInput.addEventListener('change', function() {
                    if (this.value) {
                        addFilterTag('amount', 'من: ' + this.value);
                    }
                });
            }
            if (maxAmountInput) {
                maxAmountInput.addEventListener('change', function() {
                    if (this.value) {
                        addFilterTag('amount', 'إلى: ' + this.value);
                    }
                });
            }
        }
        
        // Initialize event listeners when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            initFormEventListeners();
        });