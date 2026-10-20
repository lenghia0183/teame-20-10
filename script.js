/* ============================================
   INITIALIZATION - Đợi DOM và thư viện load xong
   ============================================ */

// Đợi DOM và tất cả thư viện load xong
document.addEventListener('DOMContentLoaded', function() {
    // FORCE hiển thị tất cả ngay lập tức
    forceShowAll();
    
    // Khởi tạo các canvas animations ngay lập tức
    initStars();
    initCursorTrail();
    initFallingFlowers();
    initButtons();
    initGiftBox();
    initHoverEffects();
    
    // Đợi thêm một chút để đảm bảo các thư viện đã load
    setTimeout(() => {
        initAll();
        initParallax();
        initTilt();
        initGSAPAnimations();
        initScrollReveal();
        // Force hiển thị lại sau khi init
        forceShowAll();
    }, 500);
    
    // Force hiển thị liên tục để chống lại AOS
    setInterval(forceShowAll, 100);
});

// Function để force hiển thị tất cả
function forceShowAll() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        // Chỉ force các phần tử có thể bị ẩn
        if (el.hasAttribute('data-aos') || 
            el.classList.contains('glass-card') ||
            el.classList.contains('message-card') ||
            el.classList.contains('appreciation-card') ||
            el.classList.contains('gallery-item') ||
            el.tagName === 'SECTION') {
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
        }
    });
}

function initAll() {
    // Đảm bảo tất cả nội dung hiển thị trước
    const allElements = document.querySelectorAll('[data-aos], section, .glass-card, .message-card, .appreciation-card, .gallery-item');
    allElements.forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // TẮT AOS để tránh ẩn nội dung - chỉ dùng GSAP cho animations
    // Không khởi tạo AOS nữa vì nó đang gây vấn đề
    // if (typeof AOS !== 'undefined') {
    //     AOS.init({
    //         duration: 1000,
    //         once: true,
    //         offset: 100,
    //         easing: 'ease-out-cubic',
    //         disable: true  // Tắt AOS
    //     });
    // }
    
    // Xóa tất cả data-aos attributes để tránh AOS can thiệp
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => {
        el.removeAttribute('data-aos');
        el.removeAttribute('data-aos-duration');
        el.removeAttribute('data-aos-delay');
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });

    // Khởi tạo GLightbox cho gallery - kiểm tra xem GLightbox có tồn tại không
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true
        });
    }
}

/* ============================================
   STARS BACKGROUND ANIMATION
   ============================================ */
let starsCanvas, starsCtx, stars = [];

function initStars() {
    starsCanvas = document.getElementById('stars-canvas');
    if (!starsCanvas) return;
    starsCtx = starsCanvas.getContext('2d');

    // Set canvas size
    function resizeStarsCanvas() {
        if (!starsCanvas) return;
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;
    }
    resizeStarsCanvas();
    window.addEventListener('resize', resizeStarsCanvas);

    // Tạo mảng các ngôi sao
    const starCount = 100;
    stars = [];

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * starsCanvas.width,
            y: Math.random() * starsCanvas.height,
            radius: Math.random() * 2,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }

    // Vẽ và animate các ngôi sao
    function animateStars() {
        if (!starsCanvas || !starsCtx) return;
        starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
        
        stars.forEach(star => {
            // Hiệu ứng lấp lánh
            star.opacity += star.twinkleSpeed;
            if (star.opacity > 1 || star.opacity < 0.3) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }
            
            // Vẽ ngôi sao
            starsCtx.beginPath();
            starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            starsCtx.fillStyle = `rgba(255, 205, 150, ${star.opacity})`;
            starsCtx.fill();
            
            // Thêm hiệu ứng glow
            starsCtx.shadowBlur = 10;
            starsCtx.shadowColor = 'rgba(255, 205, 150, 0.8)';
            starsCtx.fill();
            starsCtx.shadowBlur = 0;
        });
        
        requestAnimationFrame(animateStars);
    }
    animateStars();
}

/* ============================================
   CURSOR SPARKLE TRAIL
   ============================================ */
let cursorCanvas, cursorCtx;
const sparkles = [];
const maxSparkles = 20;

function initCursorTrail() {
    cursorCanvas = document.getElementById('cursor-trail');
    if (!cursorCanvas) return;
    cursorCtx = cursorCanvas.getContext('2d');

    // Set canvas size
    function resizeCursorCanvas() {
        if (!cursorCanvas) return;
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    }
    resizeCursorCanvas();
    window.addEventListener('resize', resizeCursorCanvas);

    // Tạo sparkle khi di chuyển chuột
    document.addEventListener('mousemove', (e) => {
        // Giới hạn số lượng sparkles
        if (sparkles.length > maxSparkles) {
            sparkles.shift();
        }
        
        // Tạo sparkle mới
        for (let i = 0; i < 3; i++) {
            sparkles.push({
                x: e.clientX + (Math.random() - 0.5) * 20,
                y: e.clientY + (Math.random() - 0.5) * 20,
                size: Math.random() * 4 + 2,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                color: `hsl(${Math.random() * 60 + 300}, 70%, 70%)` // Màu hồng/tím
            });
        }
    });

    // Animate sparkles
    function animateSparkles() {
        if (!cursorCanvas || !cursorCtx) return;
        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const sparkle = sparkles[i];
            
            // Giảm life
            sparkle.life -= sparkle.decay;
            
            if (sparkle.life <= 0) {
                sparkles.splice(i, 1);
                continue;
            }
            
            // Vẽ sparkle
            cursorCtx.beginPath();
            cursorCtx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
            cursorCtx.fillStyle = sparkle.color;
            cursorCtx.globalAlpha = sparkle.life;
            cursorCtx.fill();
            
            // Thêm hiệu ứng glow
            cursorCtx.shadowBlur = 15;
            cursorCtx.shadowColor = sparkle.color;
            cursorCtx.fill();
            cursorCtx.shadowBlur = 0;
            cursorCtx.globalAlpha = 1;
        }
        
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();
}

/* ============================================
   FALLING FLOWERS / SAKURA
   ============================================ */
function initFallingFlowers() {
    const fallingFlowersContainer = document.getElementById('falling-flowers');
    if (!fallingFlowersContainer) return;
    
    const flowerEmojis = ['🌸', '💮', '🌺', '🌻', '🌷', '🌹', '🌼'];

    function createFallingFlower() {
        const flower = document.createElement('div');
        flower.className = 'falling-flower';
        flower.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        flower.style.left = Math.random() * 100 + '%';
        flower.style.animationDuration = (Math.random() * 3 + 5) + 's';
        flower.style.animationDelay = Math.random() * 2 + 's';
        flower.style.fontSize = (Math.random() * 15 + 15) + 'px';
        
        fallingFlowersContainer.appendChild(flower);
        
        // Xóa flower sau khi rơi xong
        setTimeout(() => {
            if (flower.parentNode) {
                flower.parentNode.removeChild(flower);
            }
        }, 10000);
    }

    // Tạo flower mới mỗi 500ms
    setInterval(createFallingFlower, 500);

    // Tạo một số flower ban đầu
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createFallingFlower(), i * 200);
    }
}

/* ============================================
   PARALLAX SCROLL EFFECT
   ============================================ */
function initParallax() {
    // Kiểm tra xem GSAP và ScrollTrigger có tồn tại không
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP hoặc ScrollTrigger chưa load');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);

    // Parallax cho các sections
    gsap.utils.toArray('.hero, .message-section, .gallery-section, .appreciation-section, .gift-section').forEach((section, i) => {
        gsap.to(section, {
            y: (i + 1) * 50,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Parallax cho floating icons
    gsap.utils.toArray('.floating-icons i').forEach((icon, index) => {
        gsap.to(icon, {
            y: (index + 1) * 30,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
    });
}

/* ============================================
   SMOOTH SCROLL TO SECTION
   ============================================ */
function initButtons() {
    const btnPrimary = document.querySelector('.btn-primary');
    if (btnPrimary) {
        btnPrimary.addEventListener('click', () => {
            const messageSection = document.getElementById('message');
            if (messageSection) {
                messageSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/* ============================================
   3D TILT EFFECT (Vanilla Tilt)
   ============================================ */
function initTilt() {
    if (typeof VanillaTilt === 'undefined') {
        console.warn('VanillaTilt chưa load');
        return;
    }
    
    const tiltElements = document.querySelectorAll('.glass-card, .gallery-item, .appreciation-card');
    tiltElements.forEach(element => {
        try {
            VanillaTilt.init(element, {
                max: 15,
                speed: 1000,
                glare: true,
                'max-glare': 0.3,
                gyroscope: false
            });
        } catch (e) {
            console.warn('Lỗi khi init VanillaTilt:', e);
        }
    });
}

/* ============================================
   GIFT BOX ANIMATION
   ============================================ */
function initGiftBox() {
    const giftBox = document.getElementById('giftBox');
    const openGiftBtn = document.getElementById('openGiftBtn');
    const giftModal = document.getElementById('giftModal');
    const closeModal = document.getElementById('closeModal');

    let giftOpened = false;

    if (openGiftBtn && giftBox) {
        openGiftBtn.addEventListener('click', () => {
            if (giftOpened) return;
            
            giftOpened = true;
            openGiftBtn.disabled = true;
            
            // Animation mở hộp quà
            giftBox.classList.add('opened');
            
            // Đợi animation mở hộp xong rồi mới bắn confetti
            setTimeout(() => {
                // Kiểm tra xem confetti có tồn tại không
                if (typeof confetti !== 'undefined') {
                    // Bắn confetti
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#d7263d', '#9e1b32', '#e09f1f', '#f4a7a3', '#ffd98e']
                    });
                    
                    // Bắn confetti thêm lần nữa sau 300ms
                    setTimeout(() => {
                        confetti({
                            particleCount: 150,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: ['#d7263d', '#9e1b32', '#e09f1f', '#f4a7a3', '#ffd98e']
                        });
                        
                        confetti({
                            particleCount: 150,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: ['#d7263d', '#9e1b32', '#e09f1f', '#f4a7a3', '#ffd98e']
                        });
                    }, 300);
                }
                
                // Hiển thị modal sau khi confetti
                if (giftModal) {
                    setTimeout(() => {
                        giftModal.classList.add('active');
                    }, 500);
                }
            }, 800);
        });
    }

    // Đóng modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (giftModal) {
                giftModal.classList.remove('active');
            }
        });
    }

    // Đóng modal khi click bên ngoài
    if (giftModal) {
        giftModal.addEventListener('click', (e) => {
            if (e.target === giftModal) {
                giftModal.classList.remove('active');
            }
        });
    }
}

/* ============================================
   GSAP TEXT ANIMATIONS
   ============================================ */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP chưa load');
        return;
    }
    
    // Animation cho hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const lines = heroTitle.querySelectorAll('.line');
        lines.forEach((line, index) => {
            gsap.from(line, {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: index * 0.2,
                ease: 'power3.out'
            });
        });
    }

    // Animation cho hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        gsap.from(heroSubtitle, {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.6,
            ease: 'power3.out'
        });
    }

    // Animation cho button
    const btnPrimaryAnim = document.querySelector('.btn-primary');
    if (btnPrimaryAnim) {
        gsap.from(btnPrimaryAnim, {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            delay: 1,
            ease: 'back.out(1.7)'
        });
    }
    
    // Animation cho scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                gsap.to(scrollIndicator, {
                    opacity: 0,
                    duration: 0.3
                });
            } else {
                gsap.to(scrollIndicator, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    }
}

/* ============================================
   SCROLL REVEAL ANIMATIONS (GSAP)
   ============================================ */
function initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }
    
    // Animation cho các cards khi scroll
    gsap.utils.toArray('.glass-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            delay: index * 0.1
        });
    });

    // Animation cho gallery items
    gsap.utils.toArray('.gallery-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            delay: index * 0.1
        });
    });
}

/* ============================================
   HOVER GLOW EFFECTS
   ============================================ */
function initHoverEffects() {
    // Thêm glow effect khi hover vào các elements
    const glowElements = document.querySelectorAll('.btn-primary, .btn-gift, .appreciation-card, .gallery-item');

    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.filter = 'drop-shadow(0 0 20px rgba(215, 38, 61, 0.6))';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
        });
    });
}

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */
// Throttle function để tối ưu performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Tối ưu resize events
window.addEventListener('resize', throttle(() => {
    // Resize sẽ được xử lý bởi các function riêng
}, 250));

/* ============================================
   CONSOLE MESSAGE
   ============================================ */
console.log('%c🌸 Chúc mừng Ngày Phụ nữ Việt Nam 20/10! 🌸', 'color: #d7263d; font-size: 20px; font-weight: bold;');
console.log('%cTrang web được tạo với ❤️ bởi team developers', 'color: #e09f1f; font-size: 14px;');
