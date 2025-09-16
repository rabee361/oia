/**
 * 🎯 Selectable Rows JavaScript
 * Handles row selection, bulk actions, and dropdown functionality for tables
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 📋 Initialize selectable rows functionality
    initSelectableRows();
    
    // 📋 Initialize dropdown functionality
    initDropdowns();
    
    /**
     * 🔄 Initialize selectable rows functionality
     */
    function initSelectableRows() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        const bulkActions = document.getElementById('bulkActions');
        const selectedCountElement = document.getElementById('selectedCount');
        
        if (!selectAllCheckbox || !bulkActions || !selectedCountElement) {
            return; // Exit if required elements are not found
        }
        
        // 🎯 Handle "Select All" checkbox
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            
            updateBulkActions();
        });
        
        // 🎯 Handle individual row checkboxes
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateSelectAllState();
                updateBulkActions();
            });
        });
        
        /**
         * 🔄 Update the "Select All" checkbox state
         */
        function updateSelectAllState() {
            const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
            const totalBoxes = document.querySelectorAll('.row-checkbox');
            
            if (checkedBoxes.length === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedBoxes.length === totalBoxes.length) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }
        
        /**
         * 🔄 Update bulk actions visibility and count
         */
        function updateBulkActions() {
            const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
            const selectedCount = checkedBoxes.length;
            
            if (selectedCount > 0) {
                bulkActions.style.display = 'flex';
                selectedCountElement.textContent = selectedCount;
            } else {
                bulkActions.style.display = 'none';
            }
        }
        
        // 🎯 Handle bulk action buttons
        const bulkEditBtn = document.querySelector('.btn-bulk-edit');
        const bulkDeleteBtn = document.querySelector('.btn-bulk-delete');
        const bulkExportBtn = document.querySelector('.btn-bulk-export');
        
        if (bulkEditBtn) {
            bulkEditBtn.addEventListener('click', function() {
                const selectedIds = getSelectedRowIds();
                handleBulkEdit(selectedIds);
            });
        }
        
        if (bulkDeleteBtn) {
            bulkDeleteBtn.addEventListener('click', function() {
                const selectedIds = getSelectedRowIds();
                handleBulkDelete(selectedIds);
            });
        }
        
        if (bulkExportBtn) {
            bulkExportBtn.addEventListener('click', function() {
                const selectedIds = getSelectedRowIds();
                handleBulkExport(selectedIds);
            });
        }
        
        /**
         * 📋 Get selected row IDs
         * @returns {Array} Array of selected row IDs
         */
        function getSelectedRowIds() {
            const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
            return Array.from(checkedBoxes).map(checkbox => checkbox.value);
        }
        
        /**
         * ✏️ Handle bulk edit action
         * @param {Array} selectedIds - Array of selected row IDs
         */
        function handleBulkEdit(selectedIds) {
            if (selectedIds.length === 0) return;
            
            // Show confirmation dialog
            if (confirm(`هل تريد تعديل ${selectedIds.length} منتج محدد؟`)) {
                console.log('Bulk edit for IDs:', selectedIds);
                // Add your bulk edit logic here
                showNotification('تم تحديد المنتجات للتعديل', 'success');
            }
        }
        
        /**
         * 🗑️ Handle bulk delete action
         * @param {Array} selectedIds - Array of selected row IDs
         */
        function handleBulkDelete(selectedIds) {
            if (selectedIds.length === 0) return;
            
            // Show confirmation dialog
            if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} منتج؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
                console.log('Bulk delete for IDs:', selectedIds);
                // Add your bulk delete logic here
                showNotification('تم حذف المنتجات المحددة', 'success');
                
                // Remove rows from table (for demo purposes)
                selectedIds.forEach(id => {
                    const checkbox = document.querySelector(`input[value="${id}"]`);
                    if (checkbox) {
                        const row = checkbox.closest('tr');
                        if (row) {
                            row.remove();
                        }
                    }
                });
                
                // Update bulk actions
                updateBulkActions();
                updateSelectAllState();
            }
        }
        
        /**
         * 📤 Handle bulk export action
         * @param {Array} selectedIds - Array of selected row IDs
         */
        function handleBulkExport(selectedIds) {
            if (selectedIds.length === 0) return;
            
            console.log('Bulk export for IDs:', selectedIds);
            // Add your bulk export logic here
            showNotification(`تم تصدير ${selectedIds.length} منتج`, 'success');
        }
    }
    
    /**
     * 📋 Initialize dropdown functionality
     */
    function initDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    if (dropdown !== this.parentElement) {
                        dropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                this.parentElement.classList.toggle('active');
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function() {
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
        
        // Handle dropdown item clicks
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const action = this.textContent.trim();
                const row = this.closest('tr');
                const checkbox = row.querySelector('.row-checkbox');
                const productId = checkbox ? checkbox.value : null;
                
                console.log(`Action: ${action}, Product ID: ${productId}`);
                
                // Close dropdown
                this.closest('.dropdown').classList.remove('active');
                
                // Handle different actions
                if (action.includes('عرض')) {
                    handleViewProduct(productId);
                } else if (action.includes('تعديل')) {
                    handleEditProduct(productId);
                } else if (action.includes('نسخ')) {
                    handleCopyProduct(productId);
                } else if (action.includes('حذف')) {
                    handleDeleteProduct(productId, row);
                }
            });
        });
    }
    
    /**
     * 👁️ Handle view product action
     * @param {string} productId - Product ID
     */
    function handleViewProduct(productId) {
        console.log('View product:', productId);
        showNotification('عرض تفاصيل المنتج', 'info');
        // Add your view logic here
    }
    
    /**
     * ✏️ Handle edit product action
     * @param {string} productId - Product ID
     */
    function handleEditProduct(productId) {
        console.log('Edit product:', productId);
        showNotification('تحرير المنتج', 'info');
        // Add your edit logic here
    }
    
    /**
     * 📋 Handle copy product action
     * @param {string} productId - Product ID
     */
    function handleCopyProduct(productId) {
        console.log('Copy product:', productId);
        showNotification('تم نسخ المنتج', 'success');
        // Add your copy logic here
    }
    
    /**
     * 🗑️ Handle delete product action
     * @param {string} productId - Product ID
     * @param {HTMLElement} row - Table row element
     */
    function handleDeleteProduct(productId, row) {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            console.log('Delete product:', productId);
            
            // Remove row from table (for demo purposes)
            row.remove();
            
            showNotification('تم حذف المنتج', 'success');
            
            // Update bulk actions if needed
            const bulkActions = document.getElementById('bulkActions');
            if (bulkActions && bulkActions.style.display !== 'none') {
                const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
                if (checkedBoxes.length === 0) {
                    bulkActions.style.display = 'none';
                }
            }
        }
    }
    
    /**
     * 🔔 Show notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});
