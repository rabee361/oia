// 📦 Collapsible Containers (no accordion effect)
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // 🎯 Initialize collapsible containers
    function initCollapsibleContainers() {
        const containers = document.querySelectorAll('.collapsible-container');
        
        containers.forEach(container => {
            const header = container.querySelector('.collapsible-header');
            const toggle = container.querySelector('.collapsible-toggle');
            const content = container.querySelector('.collapsible-content');
            const icon = toggle.querySelector('i');
            
            // Set initial state
            const isCollapsed = container.getAttribute('data-collapsed') === 'true';
            updateContainerState(container, content, icon, isCollapsed);
            
            // Add click event listener
            header.addEventListener('click', () => {
                const currentState = container.getAttribute('data-collapsed') === 'true';
                const newState = !currentState;
                
                container.setAttribute('data-collapsed', newState.toString());
                updateContainerState(container, content, icon, newState);
            });
        });
    }

    // 🔄 Update container state (non-animated)
    function updateContainerState(container, content, icon, isCollapsed) {
        if (isCollapsed) {
            content.style.display = 'none';
            icon.className = 'fas fa-chevron-down';
            container.setAttribute('aria-expanded', 'false');
        } else {
            content.style.display = 'block';
            icon.className = 'fas fa-chevron-up';
            container.setAttribute('aria-expanded', 'true');
        }
    }

    // Placeholder for future non-animated update function

    // 🎯 Keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('collapsible-header')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        }
    });

    // 🚀 Initialize collapsible containers
    initCollapsibleContainers();
    
    console.log('📦 Collapsible containers initialized!');
});
