
document.addEventListener('DOMContentLoaded', function() {
    const banners = document.querySelectorAll('.banner-item');
    const indicators = document.querySelectorAll('.indicator');
    let currentBanner = 0;

    function showBanner(index) {
        // Hide all banners
        banners.forEach(banner => banner.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Show current banner
        banners[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    function nextBanner() {
        currentBanner = (currentBanner + 1) % banners.length;
        showBanner(currentBanner);
    }

    // Auto-rotate every 5 seconds
    setInterval(nextBanner, 5000);

    // Manual indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentBanner = index;
            showBanner(currentBanner);
        });
    });
});
