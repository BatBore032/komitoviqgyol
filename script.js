// Локално съхранение на снимки
let photos = JSON.parse(localStorage.getItem('fisheryPhotos')) || [];

// Зареждане на галерията при стартиране
document.addEventListener('DOMContentLoaded', function() {
    // Проверка дали сме на страницата с галерията
    if (document.getElementById('galleryGrid')) {
        loadGallery();
        setupUploadHandler();
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
        localStorage.setItem('fisheryPhotos', JSON.stringify(photos));
        loadGallery();
    }
}

// Функция за показване на снимка в modal
function setupImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function showImageModal(src, name) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('caption');
    
    if (modal && modalImg) {
        modal.style.display = 'block';
        modalImg.src = src;
        if (caption) caption.innerHTML = name;
    }
}

// Функция за контактна форма
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Симулация на изпращане на формата
        alert(`Благодарим Ви, ${name}!\n\nВашето съобщение е получено. Ще се свържем с Вас скоро на ${email}.`);
        
        // Изчистване на формата
        contactForm.reset();
        
        // В реална среда тук би се изпращала информацията към сървър
        console.log({name, email, phone, message});
    });
}

// Добавяне на демо снимки при първо зареждане (по желание)
if (photos.length === 0 && document.getElementById('galleryGrid')) {
    // Можете да добавите примерни placeholder снимки тук
    const demoPhotos = [
        {
            id: 1,
            src: 'https://via.placeholder.com/400x300/4a9fd8/ffffff?text=Рибарник+1',
            name: 'Изглед на рибарника',
            date: new Date().toLocaleDateString('bg-BG')
        },
        {
            id: 2,
            src: 'https://via.placeholder.com/400x300/2c5f8d/ffffff?text=Рибарник+2',
            name: 'Залез край водата',
            date: new Date().toLocaleDateString('bg-BG')
        },
        {
            id: 3,
            src: 'https://via.placeholder.com/400x300/f39c12/ffffff?text=Рибарник+3',
            name: 'Къмпинг зона',
            date: new Date().toLocaleDateString('bg-BG')
        }
    ];
    
    // Можете да разкоментирате следващите редове, за да добавите демо снимки
    // photos = demoPhotos;
    // localStorage.setItem('fisheryPhotos', JSON.stringify(photos));
    // loadGallery();
}
