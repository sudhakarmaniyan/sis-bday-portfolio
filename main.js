document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading & Gift Box Flow
    const loadingScreen = document.getElementById('loading-screen');
    const loader = document.querySelector('.loader');
    const giftBoxContainer = document.getElementById('gift-box-container');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    let isPlaying = false;

    // Simulate loading time for suspense
    setTimeout(() => {
        loader.style.display = 'none';
        giftBoxContainer.classList.remove('hidden');
    }, 2000);

    giftBoxContainer.addEventListener('click', () => {
        // Hide loading screen
        loadingScreen.classList.add('hidden-complete');
        // Show main content
        mainContent.classList.add('visible');
        
        // Play music (this bypasses autoplay block because it's tied to a user click!)
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = '⏸ Pause Music';
        }).catch(e => console.log("Audio play prevented"));

        // Initial Confetti Burst
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff7eb3', '#ff758c', '#fbc2eb', '#a6c1ee'] });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff7eb3', '#ff758c', '#fbc2eb', '#a6c1ee'] });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    });

    // 2. Music Player Control (Update existing listener)
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🎵 Play Music';
        } else {
            bgMusic.play();
            musicBtn.textContent = '⏸ Pause Music';
        }
        isPlaying = !isPlaying;
    });

    // 2. Initial Confetti Burst on Load
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff7eb3', '#ff758c', '#fbc2eb', '#a6c1ee']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff7eb3', '#ff758c', '#fbc2eb', '#a6c1ee']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // 3. Scroll Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-up').forEach(element => {
        observer.observe(element);
    });

    // Special Popup Confetti
    const popupObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger massive celebration confetti
                const duration = 2500;
                const end = Date.now() + duration;

                (function frame() {
                    confetti({
                        particleCount: 10,
                        angle: 60,
                        spread: 70,
                        origin: { x: 0 },
                        colors: ['#ff0844', '#ffb199', '#ff7eb3', '#fbc2eb']
                    });
                    confetti({
                        particleCount: 10,
                        angle: 120,
                        spread: 70,
                        origin: { x: 1 },
                        colors: ['#ff0844', '#ffb199', '#ff7eb3', '#fbc2eb']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
                
                popupObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const popupSection = document.querySelector('.popup-container');
    if (popupSection) {
        popupObserver.observe(popupSection);
    }

    // 4. Countdown Timer for August 01
    // Determine the year. If current date is past Aug 1, set for next year.
    const now = new Date();
    let targetYear = now.getFullYear();
    const targetDateStr = `${targetYear}-08-01T00:00:00`;
    let birthdayDate = new Date(targetDateStr);

    if (now > birthdayDate) {
        targetYear++;
        birthdayDate = new Date(`${targetYear}-08-01T00:00:00`);
    }

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownMsgEl = document.getElementById('countdown-msg');

    function updateCountdown() {
        const currentTime = new Date();
        const diff = birthdayDate - currentTime;

        if (diff <= 0) {
            // It's her birthday!
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            countdownMsgEl.textContent = "It's your birthday! 🎉 Happy Birthday Haritha! 🎂";
            
            // Continuous Confetti
            setInterval(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }, 3000);
            return;
        }

        const d = Math.floor(diff / 1000 / 60 / 60 / 24);
        const h = Math.floor((diff / 1000 / 60 / 60) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        daysEl.textContent = d < 10 ? '0' + d : d;
        hoursEl.textContent = h < 10 ? '0' + h : h;
        minutesEl.textContent = m < 10 ? '0' + m : m;
        secondsEl.textContent = s < 10 ? '0' + s : s;
    }

    // Initial call
    updateCountdown();
    // Update every second
    setInterval(updateCountdown, 1000);

    // 5. Send Wish Logic
    const sistersPhoneNumber = '918778133094'; 

    const senderNameInput = document.getElementById('sender-name');
    const wishMessageInput = document.getElementById('wish-message');
    const whatsappBtn = document.getElementById('send-whatsapp');
    const smsBtn = document.getElementById('send-sms');

    function getFormattedMessage() {
        const name = senderNameInput.value.trim();
        const msg = wishMessageInput.value.trim();
        const websiteLink = window.location.href; // This will grab the actual website link once you host it online!

        if (!msg) {
            alert("Please type a beautiful message for your sister first! ❤️");
            return null;
        }
        return `Happy Birthday Haritha Akka! 🎉\n\n${msg}\n\n- ${name || 'Someone special'} 💖\n\nCheck out my surprise for you here: ${websiteLink}`;
    }

    if(whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const text = getFormattedMessage();
            if (text) {
                const url = `https://wa.me/${sistersPhoneNumber}?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }
        });
    }

    if(smsBtn) {
        smsBtn.addEventListener('click', () => {
            const text = getFormattedMessage();
            if (text) {
                // Determine if iOS or Android for SMS formatting
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                const separator = isIOS ? '&' : '?';
                const url = `sms:${sistersPhoneNumber}${separator}body=${encodeURIComponent(text)}`;
                window.open(url, '_self');
            }
        });
    }

    // 6. Typewriter effect
    const typewriterContainer = document.getElementById('typewriter-container');
    if (typewriterContainer) {
        const paragraphs = Array.from(typewriterContainer.querySelectorAll('.hidden-text')).map(p => p.textContent);
        typewriterContainer.innerHTML = ''; // Clear for typing
        
        let isTyping = false;
        
        const typeWriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isTyping) {
                    isTyping = true;
                    typeWriterObserver.unobserve(entry.target);
                    
                    let pIndex = 0;
                    let charIndex = 0;
                    let currentP = document.createElement('p');
                    typewriterContainer.appendChild(currentP);

                    function type() {
                        if (pIndex < paragraphs.length) {
                            if (charIndex < paragraphs[pIndex].length) {
                                currentP.textContent += paragraphs[pIndex].charAt(charIndex);
                                charIndex++;
                                setTimeout(type, 30); // Typing speed
                            } else {
                                pIndex++;
                                charIndex = 0;
                                if (pIndex < paragraphs.length) {
                                    currentP = document.createElement('p');
                                    typewriterContainer.appendChild(currentP);
                                    setTimeout(type, 500); // Pause between paragraphs
                                }
                            }
                        }
                    }
                    type();
                }
            });
        }, { threshold: 0.5 });
        
        typeWriterObserver.observe(document.querySelector('.message-section'));
    }

    // 7. Gallery Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.lightbox-close');

    if (lightbox) {
        document.querySelectorAll('.gallery-item img, .popup-image img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });

        closeLightbox.addEventListener('click', () => lightbox.classList.remove('active'));
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) lightbox.classList.remove('active');
        });
    }

    // 8. Blow out candles interactive cake
    const cakeContainer = document.getElementById('birthday-cake');
    const flames = document.querySelectorAll('.flame');
    let blownOut = false;

    if (cakeContainer) {
        cakeContainer.addEventListener('click', () => {
            if (!blownOut) {
                flames.forEach(flame => flame.classList.add('blown-out'));
                blownOut = true;
                
                // Massive celebration confetti
                const duration = 5000;
                const end = Date.now() + duration;
                (function frame() {
                    confetti({ particleCount: 15, spread: 100, origin: { y: 0.6 }});
                    if (Date.now() < end) requestAnimationFrame(frame);
                }());
            }
        });
    }
});
