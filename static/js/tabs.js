document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    function switchTab(targetTab) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const activePane = document.getElementById(targetTab);
        
        if (activeButton && activePane) {
            activeButton.classList.add('active');
            activePane.classList.add('active');
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
            const totalCount = rowCheckboxes.length;
            
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = checkedCount === totalCount;
                selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalCount;
            }
        });
    });
    
    const addButtons = document.querySelectorAll('.btn-add-to-category');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Add product to category');
        });
    });
    
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            if (productCard && confirm('هل أنت متأكد من إزالة هذا المنتج من الفئة؟')) {
                productCard.remove();
            }
        });
    });
    
    const bulkAddButton = document.querySelector('.btn-bulk-add');
    if (bulkAddButton) {
        bulkAddButton.addEventListener('click', function() {
            const checkedProducts = document.querySelectorAll('.row-checkbox:checked');
            if (checkedProducts.length === 0) {
                alert('يرجى اختيار منتج واحد على الأقل');
                return;
            }
            
            if (confirm(`هل تريد إضافة ${checkedProducts.length} منتج إلى هذه الفئة؟`)) {
                console.log(`Adding ${checkedProducts.length} products to category`);
            }
        });
    }
});
