function openExportPopup() {
    document.getElementById('exportPopup').style.display = 'flex';
}

function closeExportPopup() {
    document.getElementById('exportPopup').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.popup-close');
    const cancelBtn = document.querySelector('.popup-cancel');

    closeBtn.addEventListener('click', closeExportPopup);
    cancelBtn.addEventListener('click', closeExportPopup);
});