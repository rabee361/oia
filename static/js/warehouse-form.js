// 🏪 Warehouse Form Management
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // 🏪 Warehouse Management
    function initWarehouseManagement() {
        const warehouseSection = document.getElementById('warehouseSection');
        const addWarehouseBtn = document.getElementById('addWarehouseBtn');
        
        // Check if elements exist (only run on pages with warehouse section)
        if (!warehouseSection || !addWarehouseBtn) {
            return;
        }

        let warehouseCount = 1;

        addWarehouseBtn.addEventListener('click', function() {
            warehouseCount++;
            const warehouseItem = createWarehouseItem();
            warehouseSection.appendChild(warehouseItem);
            updateRemoveButtons();
        });

        function createWarehouseItem() {
            const div = document.createElement('div');
            div.className = 'warehouse-item';
            div.innerHTML = `
                <div class="warehouse-row">
                    <div class="warehouse-select-group">
                        <select class="form-select warehouse-select" name="warehouse[]" required>
                            <option value="">اختر المخزن</option>
                            <option value="main">المخزن الرئيسي</option>
                            <option value="branch1">فرع 1</option>
                            <option value="branch2">فرع 2</option>
                            <option value="online">المتجر الإلكتروني</option>
                        </select>
                    </div>
                    <div class="quantity-group">
                        <input type="number" class="form-input quantity-input" name="quantity[]" placeholder="الكمية" min="0" required>
                    </div>
                    <button type="button" class="remove-warehouse-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            return div;
        }

        function updateRemoveButtons() {
            const removeButtons = warehouseSection.querySelectorAll('.remove-warehouse-btn');
            removeButtons.forEach((btn, index) => {
                if (index === 0) {
                    btn.style.display = removeButtons.length > 1 ? 'flex' : 'none';
                } else {
                    btn.style.display = 'flex';
                }
            });
        }

        // Remove warehouse functionality
        warehouseSection.addEventListener('click', function(e) {
            if (e.target.closest('.remove-warehouse-btn')) {
                const warehouseItem = e.target.closest('.warehouse-item');
                if (warehouseSection.children.length > 1) {
                    warehouseItem.remove();
                    warehouseCount--;
                    updateRemoveButtons();
                }
            }
        });

        // Initialize remove buttons on page load
        updateRemoveButtons();

        console.log('🏪 Warehouse management initialized successfully!');
    }

    // 🚀 Initialize warehouse management
    initWarehouseManagement();
});
