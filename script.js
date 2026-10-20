const WISHES = [
    { emoji: '🌹', text: 'Chúc chị em luôn rạng rỡ như đóa hồng nhung, được yêu thương mỗi ngày.' },
    { emoji: '🌸', text: 'Mãi trẻ trung, xinh đẹp và giữ nụ cười thật tươi trên môi.' },
    { emoji: '💪', text: 'Dồi dào sức khỏe, bình an và vững vàng trước mọi thử thách.' },
    { emoji: '🚀', text: 'Công việc thuận lợi, dự án nào cũng thành công, deadline nào cũng nhẹ nhàng.' },
    { emoji: '🏡', text: 'Gia đình êm ấm, hạnh phúc trọn vẹn bên những người thân yêu.' },
    { emoji: '💰', text: 'Lương thưởng ngập tràn, ví lúc nào cũng đầy và tinh thần lúc nào cũng vui.' },
    { emoji: '✨', text: 'Mỗi ngày đều là một ngày đáng nhớ, không chỉ riêng 20/10.' },
    { emoji: '💖', text: 'Cảm ơn chị em đã là một phần tuyệt vời của Team E. Team E thương lắm!' },
]

const PETAL_COLORS = ['#c2334d', '#e05069', '#f3a6b4', '#d9b26a', '#f3dca6']

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ============================================
   REVEAL ON SCROLL
   ============================================ */
function setupRevealOnScroll() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
        })
    }, { threshold: 0.15 })

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))
}

/* ============================================
   FALLING PETALS
   ============================================ */
function createPetal(canvasWidth, canvasHeight, startAboveScreen) {
    return {
        x: Math.random() * canvasWidth,
        y: startAboveScreen ? -20 - Math.random() * canvasHeight : Math.random() * canvasHeight,
        radius: 5 + Math.random() * 7,
        fallSpeed: 0.4 + Math.random() * 0.9,
        swayPhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    }
}

function drawPetal(context, petal) {
    context.save()
    context.translate(petal.x, petal.y)
    context.rotate(petal.rotation)
    context.globalAlpha = 0.75
    context.fillStyle = petal.color
    context.beginPath()
    context.moveTo(0, -petal.radius)
    context.bezierCurveTo(petal.radius, -petal.radius, petal.radius, petal.radius * 0.6, 0, petal.radius)
    context.bezierCurveTo(-petal.radius, petal.radius * 0.6, -petal.radius, -petal.radius, 0, -petal.radius)
    context.fill()
    context.restore()
}

function startFallingPetals() {
    const canvas = document.getElementById('petals-canvas')
    const context = canvas.getContext('2d')
    const petalCount = window.innerWidth < 720 ? 18 : 32
    let petals = []

    function resizeCanvas() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    function animatePetals() {
        context.clearRect(0, 0, canvas.width, canvas.height)

        petals.forEach((petal, petalIndex) => {
            petal.swayPhase += 0.015
            petal.x += Math.sin(petal.swayPhase) * 0.6
            petal.y += petal.fallSpeed
            petal.rotation += petal.rotationSpeed

            if (petal.y > canvas.height + 20) {
                petals[petalIndex] = createPetal(canvas.width, canvas.height, true)
            }

            drawPetal(context, petal)
        })

        requestAnimationFrame(animatePetals)
    }

    resizeCanvas()
    petals = Array.from({ length: petalCount }, () => createPetal(canvas.width, canvas.height, false))
    window.addEventListener('resize', resizeCanvas)
    animatePetals()
}

/* ============================================
   CELEBRATION BURST
   ============================================ */
function celebrate() {
    if (typeof window.confetti !== 'function') return

    window.confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: PETAL_COLORS,
        scalar: 1.1,
    })
}

/* ============================================
   ENVELOPE
   ============================================ */
function setupEnvelope() {
    const envelope = document.getElementById('envelope')
    const envelopeSeal = document.getElementById('envelopeSeal')
    const envelopeHint = document.getElementById('envelopeHint')
    const letterPaper = document.getElementById('letterPaper')

    envelopeSeal.addEventListener('click', () => {
        // Rise by the letter's full height so it sits entirely above the envelope.
        letterPaper.style.height = 'auto'
        const letterRisePx = letterPaper.offsetHeight + 24
        letterPaper.style.height = ''

        envelope.style.setProperty('--letter-rise', `${letterRisePx}px`)
        envelope.classList.add('is-open')
        envelopeHint.textContent = 'Team E gửi trọn yêu thương ❤'
        celebrate()
    })
}

/* ============================================
   WISH CARD
   ============================================ */
function setupWishCard() {
    const wishCard = document.getElementById('wishCard')
    const wishEmoji = document.getElementById('wishEmoji')
    const wishText = document.getElementById('wishText')
    const drawWishButton = document.getElementById('drawWishButton')
    let previousWishIndex = -1

    function pickNextWishIndex() {
        const candidateIndex = Math.floor(Math.random() * (WISHES.length - 1))
        return candidateIndex >= previousWishIndex ? candidateIndex + 1 : candidateIndex
    }

    function showWish() {
        previousWishIndex = pickNextWishIndex()
        const selectedWish = WISHES[previousWishIndex]
        wishEmoji.textContent = selectedWish.emoji
        wishText.textContent = selectedWish.text
        wishCard.classList.add('is-flipped')
        drawWishButton.textContent = 'Rút lời chúc khác'
        celebrate()
    }

    drawWishButton.addEventListener('click', () => {
        if (!wishCard.classList.contains('is-flipped')) {
            showWish()
            return
        }

        // Flip back first, then reveal the next wish once the card faces down.
        wishCard.classList.remove('is-flipped')
        setTimeout(showWish, prefersReducedMotion ? 0 : 600)
    })
}

/* ============================================
   LIGHTBOX
   ============================================ */
function setupLightbox() {
    const lightbox = document.getElementById('lightbox')
    const lightboxImage = document.getElementById('lightboxImage')
    const lightboxClose = document.getElementById('lightboxClose')

    function openLightbox(sourceImage) {
        lightboxImage.src = sourceImage.src
        lightboxImage.alt = sourceImage.alt
        lightbox.hidden = false
        document.body.style.overflow = 'hidden'
        lightboxClose.focus()
    }

    function closeLightbox() {
        lightbox.hidden = true
        document.body.style.overflow = ''
    }

    document.querySelectorAll('.polaroid').forEach((polaroid) => {
        const polaroidImage = polaroid.querySelector('img')
        if (!polaroidImage) return

        polaroid.addEventListener('click', () => openLightbox(polaroidImage))
        polaroid.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') openLightbox(polaroidImage)
        })
    })

    lightboxClose.addEventListener('click', closeLightbox)
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox()
    })
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !lightbox.hidden) closeLightbox()
    })
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    setupRevealOnScroll()
    setupEnvelope()
    setupWishCard()
    setupLightbox()

    if (!prefersReducedMotion) startFallingPetals()
})
