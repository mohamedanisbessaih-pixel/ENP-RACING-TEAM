// ==================== CONFIGURATION ====================
const CONFIG = {
    loadingDuration: 2000,
    scrollOffset: 100,
    animationDelay: 200
};

// ==================== LOADING SCREEN ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, CONFIG.loadingDuration);
});

// ==================== NAVBAR SCROLL ====================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > CONFIG.scrollOffset) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==================== MOBILE MENU ====================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== COUNTDOWN ====================
function updateCountdown() {
    const rolloutDate = new Date('2026-07-15');
    const now = new Date();
    const diff = rolloutDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const daysElement = document.getElementById('days');

    if (daysElement) {
        daysElement.textContent = days;
    }
}

updateCountdown();
setInterval(updateCountdown, 86400000); // Update every 24 hours

// ==================== NEWS CAROUSEL/SLIDER - CORRIGÉ ====================
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-image');
const dots = document.querySelectorAll('.dot');
let carouselInterval = null;
let imagesLoaded = 0;
let totalImages = slides.length;

function showSlide(index) {
    if (!slides.length) return;

    // Wrap around
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

function goToSlide(index) {
    showSlide(index);
}

// Vérifier si les images sont chargées
function checkImagesLoaded() {
    slides.forEach((slide, index) => {
        const img = new Image();
        img.onload = () => {
            imagesLoaded++;
            console.log(`✅ Image ${index + 1}/${totalImages} chargée`);

            // Si toutes les images sont chargées, démarrer le carousel
            if (imagesLoaded === totalImages) {
                console.log('🎉 Toutes les images du carousel sont chargées !');
                startCarousel();
            }
        };

        img.onerror = () => {
            console.error(`❌ Erreur: Image ${index + 1} non trouvée - ${slide.src}`);
            totalImages--; // Décrémenter si image introuvable

            // Masquer cette slide
            slide.style.display = 'none';
            if (dots[index]) dots[index].style.display = 'none';

            // Si au moins une image est OK, démarrer quand même
            if (imagesLoaded > 0 && imagesLoaded >= totalImages) {
                startCarousel();
            }
        };

        img.src = slide.src;
    });
}

// Démarrer le carousel automatique
function startCarousel() {
    if (carouselInterval) return; // Déjà démarré

    if (totalImages > 1) {
        carouselInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
        console.log('🔄 Auto-slide activé (5 secondes)');
    } else {
        console.log("ℹ️ Une seule image - pas d'auto-slide");
    }
}

// Initialiser le carousel si des images existent
if (slides.length > 0) {
    console.log(`🎬 Carousel détecté avec ${slides.length} images`);
    showSlide(0);
    checkImagesLoaded();
} else {
    console.log('ℹ️ Pas de carousel détecté');
}

// ==================== TEAM FILTERS ====================
const teamFilters = document.querySelectorAll('.team-filters .filter-btn');
const memberCards = document.querySelectorAll('.member-card');

teamFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Remove active class from all filters
        teamFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const filterValue = filter.getAttribute('data-filter');

        memberCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-department') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ==================== MEDIA FILTERS ====================
const mediaFilters = document.querySelectorAll('.media-filters .filter-btn');
const mediaItems = document.querySelectorAll('.media-item');

mediaFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        // Remove active class from all filters
        mediaFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const filterValue = filter.getAttribute('data-filter');

        mediaItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ==================== LIGHTBOX ====================
let currentLightboxIndex = 0;
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImage = document.getElementById('lightboxImage');
const allImages = Array.from(document.querySelectorAll('.media-item'));

function openLightbox(index) {
    currentLightboxIndex = index;
    if (lightboxOverlay && lightboxImage && allImages[index]) {
        const imgSrc = allImages[index].getAttribute('data-src') || allImages[index].src;
        lightboxImage.src = imgSrc;
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    if (lightboxOverlay) {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    if (currentLightboxIndex < 0) {
        currentLightboxIndex = allImages.length - 1;
    } else if (currentLightboxIndex >= allImages.length) {
        currentLightboxIndex = 0;
    }

    if (lightboxImage && allImages[currentLightboxIndex]) {
        const imgSrc = allImages[currentLightboxIndex].getAttribute('data-src') || allImages[currentLightboxIndex].src;
        lightboxImage.src = imgSrc;
    }
}

// Close lightbox on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay?.classList.contains('active')) {
        closeLightbox();
    }
    if (e.key === 'ArrowLeft' && lightboxOverlay?.classList.contains('active')) {
        navigateLightbox(-1);
    }
    if (e.key === 'ArrowRight' && lightboxOverlay?.classList.contains('active')) {
        navigateLightbox(1);
    }
});

// ==================== DEPARTMENT POPUPS ====================
const orgDepts = document.querySelectorAll('.org-dept');
const popups = document.querySelectorAll('.popup-overlay');

orgDepts.forEach(dept => {
    dept.addEventListener('click', () => {
        const popupId = dept.getAttribute('data-popup');
        const popup = document.getElementById(`popup-${popupId}`);
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close popup buttons
document.querySelectorAll('.popup-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        popups.forEach(popup => {
            popup.classList.remove('active');
        });
        document.body.style.overflow = '';
    });
});

// Close popup on overlay click
popups.forEach(popup => {
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ==================== QUICK CARDS NAVIGATION ====================
const quickCards = document.querySelectorAll('.quick-card');

quickCards.forEach(card => {
    card.addEventListener('click', () => {
        const section = card.getAttribute('data-section');
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== LAZY LOADING IMAGES ====================
const lazyImages = document.querySelectorAll('.lazy');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ==================== SCROLL ANIMATIONS ====================
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => sectionObserver.observe(section));

// ==================== BACK TO TOP BUTTON ====================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop?.classList.add('visible');
    } else {
        backToTop?.classList.remove('visible');
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== CART FUNCTIONALITY ====================
let cart = [];
const cartPopup = document.getElementById('cartPopup');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cart-count');

function toggleCart() {
    cartPopup?.classList.toggle('active');
}

function updateCart() {
    if (!cartItems || !cartTotal || !cartCount) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        cartTotal.textContent = '0 DZD';
        cartCount.textContent = '0';
    } else {
        let html = '';
        let total = 0;

        cart.forEach((item, index) => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-img">${item.emoji}</div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} DZD</p>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">&times;</button>
                </div>
            `;
            total += parseInt(item.price);
        });

        cartItems.innerHTML = html;
        cartTotal.textContent = total + ' DZD';
        cartCount.textContent = cart.length;
    }
}

function addToCart(item) {
    cart.push(item);
    updateCart();
    showToast('Item added to cart!', 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    showToast('Item removed from cart', 'error');
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
            <p>${message}</p>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Formspree will handle the submission
        showToast('Message sent successfully!', 'success');
    });
}

// ==================== NEWSLETTER FORM ====================
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        if (email) {
            showToast('Successfully subscribed to newsletter!', 'success');
            newsletterForm.reset();
        }
    });
}

// ==================== LANGUAGE SWITCHER ====================
const translations = {
    en: {
        loading: 'Loading...',
        nav_home: 'Home',
        nav_team: 'Team',
        nav_car: 'The Car',
        nav_shop: 'Shop',
        nav_partners: 'Partners',
        nav_media: 'Media',
        nav_news: 'News',
        nav_joinus: 'Join us',
        nav_contact: 'Contact',
        hero_title: 'ENP Racing Team',
        hero_subtitle: 'First Algerian Formula Student Team – Season 2025-2026',
        countdown_label: 'Days until roll-out',
        discover_more: 'Discover More ↓',
    },
    fr: {
        loading: 'Chargement...',
        nav_home: 'Accueil',
        nav_team: 'Équipe',
        nav_car: 'La Voiture',
        nav_shop: 'Boutique',
        nav_partners: 'Partenaires',
        nav_media: 'Média',
        nav_news: 'Actualités',
        nav_joinus: 'Nous rejoindre',
        nav_contact: 'Contact',
        hero_title: 'ENP Racing Team',
        hero_subtitle: 'Première équipe algérienne de Formule Student – Saison 2025-2026',
        countdown_label: 'Jours avant le lancement',
        discover_more: 'Découvrir plus ↓',
    }
};

let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;

    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Update text content
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
}

// ==================== MOBILE BOTTOM NAV ACTIVE STATE ====================
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
});

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏎️ ENP Racing Team Website Loaded!');
    console.log('🔥 All systems ready!');

    // Initialize cart
    updateCart();
});

// ==================== PERFORMANCE MONITORING ====================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('⚡ Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
}

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => {
    console.error('Error caught:', e.message);
});

// Export functions to global scope for onclick handlers
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.switchLanguage = switchLanguage;

console.log('✅ ENP Racing Team - All scripts loaded successfully!');