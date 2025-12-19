// Локално съхранение на снимки
let photos = JSON.parse(localStorage.getItem('fisheryPhotos')) || [];

// Зареждане на галерията при стартиране
document.addEventListener('DOMContentLoaded', function() {
    // Проверка дали сме на страницата с галерията
    if (document.getElementById('galleryGrid')) {
        loadGallery();
        setupUploadHandler();
        setupAdminLogin();
    }
    // Функция за админ достъп до качване
    function setupAdminLogin() {
        const uploadContainer = document.getElementById('uploadContainer');
        const adminLogin = document.getElementById('adminLogin');
        const loginBtn = document.getElementById('loginBtn');
        const adminPassword = document.getElementById('adminPassword');
        const loginMsg = document.getElementById('loginMsg');

        // Скриваме формата за качване по подразбиране
        uploadContainer.style.display = 'none';
        adminLogin.style.display = 'block';

        loginBtn.addEventListener('click', function() {
            if (adminPassword.value === 'ribarski2025') {
                uploadContainer.style.display = 'block';
                adminLogin.style.display = 'none';
            } else {
                loginMsg.textContent = 'ribarski2025';
                adminPassword.value = '';
            }
        });
    }
    
    // Проверка дали сме на страницата с контакти
    if (document.getElementById('contactForm')) {
        setupContactForm();
    }
    
    // Setup modal за снимки
    setupImageModal();
});

// Функция за качване на снимки
function setupUploadHandler() {
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    
    uploadBtn.addEventListener('click', function() {
        const files = fileInput.files;
        
        if (files.length === 0) {
            alert('Моля, изберете поне една снимка!');
            return;
        }
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const photoData = {
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        name: file.name,
                        date: new Date().toLocaleDateString('bg-BG')
                    };
                    
                    photos.push(photoData);
                    localStorage.setItem('fisheryPhotos', JSON.stringify(photos));
                    loadGallery();
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        fileInput.value = '';
        alert('Снимките са качени успешно!');
    });
}

// Функция за зареждане на галерията
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!galleryGrid) return;
    
    if (photos.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">Все още няма качени снимки. Качете първата си снимка!</p>';
        return;
    }
    
    galleryGrid.innerHTML = '';
    
    photos.forEach(photo => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        galleryItem.innerHTML = `
            <img src="${photo.src}" alt="${photo.name}" data-id="${photo.id}">
            <button class="delete-btn" data-id="${photo.id}">🗑️ Изтрий</button>
        `;
        
        // Клик за показване на пълния размер
        galleryItem.querySelector('img').addEventListener('click', function() {
            showImageModal(photo.src, photo.name);
        });
        
        // Клик за изтриване
        galleryItem.querySelector('.delete-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            deletePhoto(photo.id);
        });
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Функция за изтриване на снимка
function deletePhoto(photoId) {
    if (confirm('Сигурни ли сте, че искате да изтриете тази снимка?')) {

        photos = photos.filter(photo => photo.id !== photoId);
