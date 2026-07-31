document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // 1. Initialize tsParticles (Starry Background)
    // --------------------------------------------------------
    tsParticles.load("tsparticles", {
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 }
            }
        },
        particles: {
            color: { value: ["#ffffff", "#f9d423", "#a6c1ee"] },
            links: { enable: false },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                random: true,
                speed: 0.5,
                straight: false
            },
            number: { density: { enable: true, area: 800 }, value: 150 },
            opacity: {
                animation: { enable: true, speed: 1, minimumValue: 0.1 },
                value: { min: 0.1, max: 0.8 }
            },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } }
        },
        detectRetina: true
    });

    // --------------------------------------------------------
    // 2. Cinematic Intro Sequence
    // --------------------------------------------------------
    const introLines = [
        document.getElementById('intro-line-1'),
        document.getElementById('intro-line-2'),
        document.getElementById('intro-line-3'),
        document.getElementById('intro-line-4')
    ];
    const startBtn = document.getElementById('start-journey-btn');
    const cinematicIntro = document.getElementById('cinematic-intro');
    const lockedGiftScreen = document.getElementById('locked-gift-screen');

    let delay = 1;
    introLines.forEach((line, index) => {
        gsap.to(line, {
            opacity: 1,
            duration: 2,
            delay: delay,
            onComplete: () => {
                if (index < introLines.length - 1) {
                    gsap.to(line, { opacity: 0, duration: 1, delay: 1 });
                } else {
                    // Last line stays, show button
                    gsap.to(startBtn, { display: 'block', opacity: 1, duration: 1, delay: 1 });
                    startBtn.classList.remove('hidden');
                }
            }
        });
        delay += 3; // Time between lines
    });

    startBtn.addEventListener('click', () => {
        gsap.to(cinematicIntro, {
            opacity: 0, duration: 1, onComplete: () => {
                cinematicIntro.classList.add('hidden');
                lockedGiftScreen.classList.remove('hidden');
                gsap.fromTo(lockedGiftScreen, { opacity: 0 }, { opacity: 1, duration: 1 });
            }
        });
    });

    // --------------------------------------------------------
    // 3. Unlock Gift Box
    // --------------------------------------------------------
    const unlockBtn = document.getElementById('unlock-gift-btn');
    const mainGiftBox = document.getElementById('main-gift-box');
    const mainContent = document.getElementById('main-content');
    const floatingControls = document.getElementById('floating-controls');
    const bgMusic = document.getElementById('bg-music');
    let isMusicPlaying = false;

    unlockBtn.addEventListener('click', () => {
        // Shake animation manually trigger if needed, but it's handled by hover usually.
        // Let's add a massive confetti blast!
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5, angle: 60, spread: 55, origin: { x: 0 },
                colors: ['#ff7eb3', '#ff758c', '#fbc2eb', '#f9d423']
            });
            confetti({
                particleCount: 5, angle: 120, spread: 55, origin: { x: 1 },
                colors: ['#ff7eb3', '#ff758c', '#fbc2eb', '#f9d423']
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());

        // Play music
        bgMusic.loop = true;
        bgMusic.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        });
        
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            document.getElementById('play-pause-btn').textContent = '⏸';
        }).catch(e => console.log("Audio play blocked by browser."));

        // Transition to Main Content
        gsap.to(lockedGiftScreen, {
            scale: 1.5, opacity: 0, duration: 1.5, ease: "power2.in",
            onComplete: () => {
                lockedGiftScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                floatingControls.classList.remove('hidden');
                
                gsap.fromTo(mainContent, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
                
                // Initialize ScrollTrigger animations AFTER main content is visible
                initScrollAnimations();
            }
        });
    });

    // --------------------------------------------------------
    // 4. Music Player & Voice Greeting
    // --------------------------------------------------------
    const playPauseBtn = document.getElementById('play-pause-btn');
    const voiceBtn = document.getElementById('voice-greeting-btn');
    const voiceAudio = document.getElementById('voice-greeting');

    playPauseBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            playPauseBtn.textContent = '▶';
        } else {
            bgMusic.play();
            playPauseBtn.textContent = '⏸';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    voiceBtn.addEventListener('click', () => {
        // Pause bg music temporarily
        if(isMusicPlaying) bgMusic.pause();
        
        voiceAudio.play();
        alert("Playing AI Voice Greeting... (Mocked using BGM)");
        
        voiceAudio.onended = () => {
            if(isMusicPlaying) bgMusic.play();
        };
    });

    // --------------------------------------------------------
    // 5. GSAP Scroll Animations
    // --------------------------------------------------------
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Timeline nodes
        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach((node, i) => {
            gsap.fromTo(node, 
                { opacity: 0, x: node.classList.contains('left') ? -50 : 50 },
                {
                    opacity: 1, x: 0, duration: 1,
                    scrollTrigger: {
                        trigger: node,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // General section titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.fromTo(title,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: title, start: "top 85%" } }
            );
        });

        // Floating Quotes
        gsap.utils.toArray('.floating-quote').forEach(quote => {
            gsap.fromTo(quote,
                { opacity: 0, scale: 0.8, y: 50 },
                { 
                    opacity: 1, scale: 1, y: 0, 
                    duration: 1.5, 
                    ease: "back.out(1.7)", 
                    scrollTrigger: { 
                        trigger: quote, 
                        start: "top 80%",
                        toggleActions: "play none none none"
                    } 
                }
            );
        });
    }

    // --------------------------------------------------------
    // 6. Memory Bubbles
    // --------------------------------------------------------
    const bubblesContainer = document.getElementById('bubbles-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Using existing images
    const bubbleImages = [
        'new1.jpeg', 'new2.jpeg', 'new3.jpeg', 'new4.jpeg',
        'gallery1.jpeg', 'gallery2.jpeg', 'gallery3.jpeg', 'gallery4.jpeg', 'gallery5.jpeg',
        'gallery6.jpeg', 'gallery7.jpeg', 'gallery8.jpeg', 'gallery9.jpeg', 'gallery10.jpeg',
        'timeline-2.jpeg', 'surprise1.jpeg', 'surprise2.jpeg'
    ];
    
    // Create exactly one bubble per image in a random order
    const shuffledImages = [...bubbleImages].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < shuffledImages.length; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 60 + 60; // 60px to 120px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 90}%`;
        bubble.style.top = `${Math.random() * 90}%`;
        
        // Random image without repetition
        const img = shuffledImages[i];
        bubble.style.backgroundImage = `url('images/${img}')`;

        // Floating animation
        gsap.to(bubble, {
            y: `-${Math.random() * 100 + 50}`,
            x: `${(Math.random() - 0.5) * 50}`,
            duration: Math.random() * 5 + 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        bubble.addEventListener('click', () => {
            // Pop effect
            confetti({ particleCount: 15, spread: 40, origin: { x: bubble.getBoundingClientRect().left / window.innerWidth, y: bubble.getBoundingClientRect().top / window.innerHeight } });
            
            // Open lightbox
            lightboxImg.src = `images/${img}`;
            lightbox.classList.remove('hidden');
        });

        bubblesContainer.appendChild(bubble);
    }

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });

    // --------------------------------------------------------
    // 7. Interactive Birthday Cake
    // --------------------------------------------------------
    const flames = document.querySelectorAll('.flame');
    let blownOut = 0;
    
    flames.forEach(flame => {
        flame.parentElement.addEventListener('click', () => {
            if (flame.style.opacity !== '0') {
                flame.style.opacity = '0';
                blownOut++;
                
                // Smoke effect
                confetti({
                    particleCount: 10, startVelocity: 15, spread: 30, ticks: 60, origin: { x: 0.5, y: 0.6 },
                    colors: ['#cccccc', '#dddddd']
                });

                if (blownOut === flames.length) {
                    setTimeout(() => {
                        document.getElementById('cake-wish-message').classList.remove('hidden');
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                    }, 500);
                }
            }
        });
    });

    // --------------------------------------------------------
    // 8. Mini Game (Catch Memories)
    // --------------------------------------------------------
    const gameArea = document.getElementById('game-area');
    const startGameBtn = document.getElementById('start-game-btn');
    const gameReward = document.getElementById('game-reward');
    let memoriesCaught = 0;
    const totalMemories = 5;

    let gameInterval;
    startGameBtn.addEventListener('click', () => {
        startGameBtn.classList.add('hidden');
        spawnMemory();
        gameInterval = setInterval(() => {
            if (memoriesCaught < totalMemories) {
                spawnMemory();
            } else {
                clearInterval(gameInterval);
            }
        }, 800);
    });

    function spawnMemory() {
        const memory = document.createElement('div');
        memory.className = 'game-memory';
        const img = bubbleImages[Math.floor(Math.random() * bubbleImages.length)];
        memory.style.backgroundImage = `url('images/${img}')`;
        memory.style.left = `${Math.random() * 80 + 10}%`;
        memory.style.bottom = '-100px';

        gameArea.appendChild(memory);

        // Animate upwards
        gsap.to(memory, {
            y: -600,
            duration: Math.random() * 2 + 3,
            ease: "none",
            onComplete: () => {
                if (memory.parentElement) memory.remove();
            }
        });

        memory.addEventListener('mousedown', () => {
            if (!memory.classList.contains('popped')) {
                memory.classList.add('popped');
                
                // Special Confetti theme
                const x = memory.getBoundingClientRect().left / window.innerWidth;
                const y = memory.getBoundingClientRect().top / window.innerHeight;
                
                confetti({
                    particleCount: 25,
                    spread: 60,
                    origin: { x, y },
                    colors: ['#ff7eb3', '#ff758c', '#f9d423', '#ffffff'],
                    scalar: 1.2
                });

                memoriesCaught++;
                
                if (memoriesCaught === totalMemories) {
                    clearInterval(gameInterval);
                    gameArea.innerHTML = ''; // Clear game
                    gameReward.classList.remove('hidden');
                    gsap.from(gameReward, { scale: 0, rotation: 360, duration: 1 });
                    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                }
            }
        });
    }

    // --------------------------------------------------------
    // 9. Swiper.js Initialization
    // --------------------------------------------------------
    const swiper = new Swiper('.memory-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true,
        },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        autoplay: { delay: 3000, disableOnInteraction: false }
    });

    // --------------------------------------------------------
    // 10. Magic Mirror Redesign
    // --------------------------------------------------------
    const mirrorGlass = document.getElementById('mirror-glass');
    const mirrorPrompt = document.getElementById('mirror-prompt');
    const mirrorQuoteBox = document.getElementById('mirror-quote-box');
    const mirrorText = document.getElementById('mirror-text');
    const mirrorPrev = document.getElementById('mirror-prev');
    const mirrorNext = document.getElementById('mirror-next');
    const mirrorPagination = document.getElementById('mirror-pagination');
    
    const mirrorData = [
        { img: 'mm1.jpeg', text: "You are not just amazing, you are rare, precious and irreplaceable." },
        { img: 'mm2.jpeg', text: "A sister is a gift to the heart, a friend to the spirit, a golden thread to the meaning of life. God bless you always." },
        { img: 'mm3.jpeg', text: "Born of the same blood, bound by a love that outlasts time. You are my truest paasamalar." },
        { img: 'mm4.jpeg', text: "Through every phase of life, my greatest pride is calling you my sister. May the heavens shower you with infinite blessings." },
        { img: 'mm5.jpeg', text: "A sibling is a piece of childhood that can never be lost. You are my forever confidante and guide." },
        { img: 'mm6.jpeg', text: "More than family, you are my strength. The unspoken bond of brotherhood and sisterhood we share is my greatest treasure." },
        { img: 'mm7.jpeg', text: "May God's divine grace protect you and fill your life with the same boundless joy you bring to ours. Happy Birthday!" }
    ];

    let currentMirrorIndex = 0;
    let mirrorRevealed = false;

    if (mirrorPagination) {
        // Create pagination dots
        mirrorData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'mirror-dot';
            if(index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if(mirrorRevealed) {
                    currentMirrorIndex = index;
                    updateMirror();
                }
            });
            mirrorPagination.appendChild(dot);
        });
    }

    function updateMirror() {
        // Update Image
        mirrorGlass.style.backgroundImage = `url('images/${mirrorData[currentMirrorIndex].img}')`;
        
        // Update Text
        mirrorText.innerHTML = mirrorData[currentMirrorIndex].text;
        
        // Re-trigger animation
        mirrorQuoteBox.style.animation = 'none';
        mirrorQuoteBox.offsetHeight; // reflow
        mirrorQuoteBox.style.animation = null;
        
        // Update Dots
        document.querySelectorAll('.mirror-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentMirrorIndex);
        });
        
        // Magical sparkles
        const rect = mirrorGlass.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
            particleCount: 30,
            spread: 60,
            origin: { x, y },
            colors: ['#ffffff', '#f9d423', '#a6c1ee'],
            shapes: ['star'],
            zIndex: 100
        });
    }

    if (mirrorGlass) {
        mirrorGlass.addEventListener('click', () => {
            if(!mirrorRevealed) {
                mirrorRevealed = true;
                mirrorPrompt.classList.add('hidden');
                mirrorQuoteBox.classList.remove('hidden');
                updateMirror();
            } else {
                currentMirrorIndex = (currentMirrorIndex + 1) % mirrorData.length;
                updateMirror();
            }
        });

        mirrorNext.addEventListener('click', () => {
            if(!mirrorRevealed) {
                mirrorRevealed = true;
                mirrorPrompt.classList.add('hidden');
                mirrorQuoteBox.classList.remove('hidden');
            } else {
                currentMirrorIndex = (currentMirrorIndex + 1) % mirrorData.length;
            }
            updateMirror();
        });

        mirrorPrev.addEventListener('click', () => {
            if(!mirrorRevealed) return;
            currentMirrorIndex = (currentMirrorIndex - 1 + mirrorData.length) % mirrorData.length;
            updateMirror();
        });
    }

    // --------------------------------------------------------
    // 11. Hidden Letters
    // --------------------------------------------------------
    document.querySelectorAll('.envelope').forEach(env => {
        env.addEventListener('click', () => {
            const front = env.querySelector('.front');
            const letter = env.querySelector('.letter');
            front.classList.toggle('hidden');
            letter.classList.toggle('hidden');
        });
    });

    // --------------------------------------------------------
    // 11. Finale Typewriter & Fireworks
    // --------------------------------------------------------
    const typewriterText = "Dear Haritha Akka,\nThank you for being the most amazing sister. May your birthday be filled with endless joy, laughter, and everything your heart desires. I promise to always be by your side. Have the best birthday ever! ❤️";
    const typeWriterEl = document.getElementById('typewriter-text');
    let typed = false;

    // Trigger typewriter when finale section is reached
    ScrollTrigger.create({
        trigger: ".finale-section",
        start: "top 70%",
        onEnter: () => {
            if (!typed) {
                typed = true;
                let i = 0;
                function type() {
                    if (i < typewriterText.length) {
                        typeWriterEl.textContent += typewriterText.charAt(i);
                        i++;
                        setTimeout(type, 50); // Speed
                    }
                }
                type();
            }
        }
    });

    document.getElementById('fireworks-btn').addEventListener('click', () => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    });

});
