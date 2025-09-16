// 📊 Reports Management System
document.addEventListener('DOMContentLoaded', function() {
    
    // 🎯 Get DOM elements
    const reportTabs = document.querySelectorAll('.report-tab');
    const timeTabs = document.querySelectorAll('.time-tab');
    const reportsContent = document.getElementById('reportsContent');
    
    let currentReportType = 'products';
    let currentTimePeriod = 'daily';
    
    // 🔄 Handle report type changes
    reportTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            reportTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update current report type
            currentReportType = this.getAttribute('data-report');
            
            // Update HTMX attributes for time period tabs
            updateTimePeriodTabs();
            
            console.log(`📊 Switched to report: ${currentReportType}`);
        });
    });
    
    // ⏰ Handle time period changes
    timeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            timeTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update current time period
            currentTimePeriod = this.getAttribute('data-period');
            
            // Load new content with updated time period
            loadReportContent();
            
            console.log(`⏰ Switched to period: ${currentTimePeriod}`);
        });
    });
    
    // 🔄 Update time period tabs HTMX attributes
    function updateTimePeriodTabs() {
        timeTabs.forEach(tab => {
            const period = tab.getAttribute('data-period');
            const url = `/merchant/analytics/reports/content/?type=${currentReportType}&period=${period}`;
            
            // Update HTMX attributes
            tab.setAttribute('hx-get', url);
            tab.setAttribute('hx-target', '#reportsContent');
            tab.setAttribute('hx-swap', 'innerHTML');
        });
        
        // Re-process HTMX for updated elements
        htmx.process(document.querySelector('.time-period-tabs'));
    }
    
    // 📊 Load report content via HTMX
    function loadReportContent() {
        // Show loading state
        reportsContent.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                جاري تحميل التقرير...
            </div>
        `;
        
        // Trigger HTMX request
        const url = `/merchant/analytics/reports/content/?type=${currentReportType}&period=${currentTimePeriod}`;
        
        htmx.ajax('GET', url, {
            target: '#reportsContent',
            swap: 'innerHTML'
        });
    }
    
    // 🎯 Initialize time period tabs with HTMX
    updateTimePeriodTabs();
    
    // 📡 Listen for HTMX events
    document.body.addEventListener('htmx:beforeRequest', function(evt) {
        console.log('🔄 HTMX request starting...');
        
        // Show loading spinner
        if (evt.detail.target.id === 'reportsContent') {
            evt.detail.target.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    جاري تحميل التقرير...
                </div>
            `;
        }
    });
    
    document.body.addEventListener('htmx:afterRequest', function(evt) {
        console.log('✅ HTMX request completed');
    });
    
    document.body.addEventListener('htmx:responseError', function(evt) {
        console.error('❌ HTMX request failed:', evt.detail);
        
        if (evt.detail.target.id === 'reportsContent') {
            evt.detail.target.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 2rem; color: var(--danger-color);">
                    <i class="fas fa-exclamation-triangle"></i>
                    حدث خطأ في تحميل التقرير. يرجى المحاولة مرة أخرى.
                </div>
            `;
        }
    });
    
    console.log('📊 Reports system initialized successfully! ✨');
});