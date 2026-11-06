/**
 * 法寶實業有限公司 - 沉浸式互動核心引擎
 * FAPO ENTERPRISE Interactive Experience & Edge-TTS Audio Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initLatticeCanvas();
    initAudioTour();
    initSpecsExplorer();
    initHardnessCalculator();
    initContactForm();
    initScrollSpy();
    initProductFilters();
});

/* ==========================================================================
   1. Interactive 3D Crystal Lattice Canvas (金屬晶格分子背景特效)
   ========================================================================== */
function initLatticeCanvas() {
    const canvas = document.getElementById('latticeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    const mouse = { x: width / 2, y: height / 2, radius: 160 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Particle nodes
    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            radius: Math.random() * 2 + 1.5,
            baseColor: i % 4 === 0 ? 'rgba(0, 240, 255, 0.8)' : 'rgba(148, 163, 184, 0.5)'
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Mouse interaction
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                p.x -= (dx / dist) * force * 1.5;
                p.y -= (dy / dist) * force * 1.5;
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.baseColor;
            ctx.fill();

            // Connect lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dxx = p.x - p2.x;
                const dyy = p.y - p2.y;
                const distance = Math.sqrt(dxx * dxx + dyy * dyy);
                if (distance < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const alpha = (1 - distance / 130) * 0.22;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. Zen Dharma Soundscape & Edge-TTS Audio Tour Engine
      (莊嚴佛韻語音導覽 · 物理建模西藏頌缽 · 清脆引磬 · 東方五聲古琴禪樂引擎)
   ========================================================================== */
const ZenSoundEngine = {
    ctx: null,
    reverbNode: null,
    bgmMaster: null,
    droneNodes: [],
    pluckTimer: null,
    isAmbientPlaying: false,
    bgmEnabled: true,
    bowlVisualEnergy: 0,

    ensureCtx() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            this.ctx = new AudioCtx();
            this.reverbNode = this._buildTempleReverb(3.6);
            this.bgmMaster = this.ctx.createGain();
            this.bgmMaster.gain.value = 0.0001;
            this.bgmMaster.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    },

    _buildTempleReverb(durationSec) {
        const ctx = this.ctx;
        const rate = ctx.sampleRate;
        const length = Math.floor(rate * durationSec);
        const impulse = ctx.createBuffer(2, length, rate);
        for (let ch = 0; ch < 2; ch++) {
            const data = impulse.getChannelData(ch);
            let last = 0;
            for (let i = 0; i < length; i++) {
                const t = i / length;
                const env = Math.pow(1 - t, 2.6);
                const white = (Math.random() * 2 - 1);
                // Warm low-pass smoothing for monastery stone/wood hall acoustics
                last = last * 0.72 + white * 0.28;
                data[i] = last * env * 0.55;
            }
        }
        const convolver = ctx.createConvolver();
        convolver.buffer = impulse;
        return convolver;
    },

    strikeSingingBowl(baseFreq = 216, volume = 0.26) {
        const ctx = this.ensureCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        this.bowlVisualEnergy = 1.0;

        const out = ctx.createGain();
        out.gain.setValueAtTime(volume, now);
        out.connect(ctx.destination);
        if (this.reverbNode) {
            const wet = ctx.createGain();
            wet.gain.value = 0.55;
            out.connect(this.reverbNode);
            this.reverbNode.connect(wet);
            wet.connect(ctx.destination);
        }

        // Authentic Tibetan bronze singing bowl modal partials + slow meditative beating
        const partials = [
            { ratio: 1.0000, amp: 0.52, decay: 7.5 },
            { ratio: 1.0052, amp: 0.40, decay: 7.2 }, // ~1.1Hz warm pulsation ("嗡～～")
            { ratio: 2.7560, amp: 0.20, decay: 4.8 },
            { ratio: 2.7625, amp: 0.13, decay: 4.5 },
            { ratio: 5.1300, amp: 0.05, decay: 2.0 }
        ];

        partials.forEach(p => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq * p.ratio, now);

            g.gain.setValueAtTime(0.0001, now);
            g.gain.linearRampToValueAtTime(p.amp, now + 0.045); // Soft wooden mallet strike
            g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

            osc.connect(g);
            g.connect(out);
            osc.start(now);
            osc.stop(now + p.decay + 0.1);
        });
    },

    strikeYinqing(baseFreq = 1056, volume = 0.13) {
        const ctx = this.ensureCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        this.bowlVisualEnergy = 0.7;

        const out = ctx.createGain();
        out.gain.setValueAtTime(volume, now);
        out.connect(ctx.destination);
        if (this.reverbNode) {
            const wet = ctx.createGain();
            wet.gain.value = 0.45;
            out.connect(this.reverbNode);
            this.reverbNode.connect(wet);
            wet.connect(ctx.destination);
        }

        // Clear Buddhist meditation Yinqing hand-bell partials
        [
            { ratio: 1.0, amp: 0.55, decay: 4.0 },
            { ratio: 1.0018, amp: 0.35, decay: 3.8 },
            { ratio: 2.92, amp: 0.16, decay: 1.9 }
        ].forEach(p => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq * p.ratio, now);
            g.gain.setValueAtTime(0.0001, now);
            g.gain.linearRampToValueAtTime(p.amp, now + 0.012);
            g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
            osc.connect(g);
            g.connect(out);
            osc.start(now);
            osc.stop(now + p.decay + 0.08);
        });
    },

    startAmbient(isSpeaking = false) {
        if (!this.bgmEnabled) return;
        const ctx = this.ensureCtx();
        if (!ctx) return;

        const targetGain = isSpeaking ? 0.16 : 0.28;
        const now = ctx.currentTime;
        this.bgmMaster.gain.cancelScheduledValues(now);
        this.bgmMaster.gain.setValueAtTime(Math.max(0.0001, this.bgmMaster.gain.value), now);
        this.bgmMaster.gain.linearRampToValueAtTime(targetGain, now + 1.5);

        if (this.isAmbientPlaying) return;
        this.isAmbientPlaying = true;

        // 1. Warm Meditative Harmonic Pad (D2 + A2 + D3 fifth drone)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 340;

        const padGain = ctx.createGain();
        padGain.gain.value = 0.18;

        // Slow 12-second breathing LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.08;
        lfoGain.gain.value = 0.05;
        lfo.connect(lfoGain);
        lfoGain.connect(padGain.gain);
        lfo.start();

        filter.connect(padGain);
        padGain.connect(this.bgmMaster);

        const droneFreqs = [73.42, 110.0, 146.83];
        this.droneNodes = [lfo];
        droneFreqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.value = f;
            const g = ctx.createGain();
            g.gain.value = idx === 0 ? 0.45 : 0.22;
            osc.connect(g);
            g.connect(filter);
            osc.start();
            this.droneNodes.push(osc);
        });

        // 2. Contemplative Oriental Pentatonic Guqin Plucks (宮商角徵羽 D Pentatonic)
        const scale = [146.83, 164.81, 185.00, 220.00, 246.94, 293.66, 329.63, 369.99, 440.00];
        let stepCount = 0;

        const scheduleNextNote = () => {
            if (!this.isAmbientPlaying) return;
            stepCount++;
            const noteFreq = scale[Math.floor(Math.random() * scale.length)];
            this._playGuqinPluck(noteFreq);

            // Softly resonate a distant low singing bowl every ~5 notes
            if (stepCount % 5 === 0) {
                this.strikeSingingBowl(stepCount % 10 === 0 ? 146.83 : 220.0, 0.09);
            }

            const nextDelay = 3000 + Math.random() * 2400;
            this.pluckTimer = setTimeout(scheduleNextNote, nextDelay);
        };
        this.pluckTimer = setTimeout(scheduleNextNote, 1400);
    },

    _playGuqinPluck(freq) {
        if (!this.ctx || !this.isAmbientPlaying) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2, now);

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(1250, now);
        lp.frequency.exponentialRampToValueAtTime(280, now + 2.6);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.22, now + 0.035);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

        const g2 = ctx.createGain();
        g2.gain.value = 0.25;

        osc1.connect(lp);
        osc2.connect(g2);
        g2.connect(lp);
        lp.connect(g);
        g.connect(this.bgmMaster);

        if (this.reverbNode) {
            const wet = ctx.createGain();
            wet.gain.value = 0.65;
            g.connect(this.reverbNode);
            this.reverbNode.connect(wet);
            wet.connect(this.bgmMaster);
        }

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 4.3);
        osc2.stop(now + 4.3);
    },

    setDucking(isSpeaking) {
        if (!this.ctx || !this.bgmMaster || !this.isAmbientPlaying) return;
        const now = this.ctx.currentTime;
        const target = isSpeaking ? 0.16 : 0.28;
        this.bgmMaster.gain.cancelScheduledValues(now);
        this.bgmMaster.gain.setValueAtTime(Math.max(0.0001, this.bgmMaster.gain.value), now);
        this.bgmMaster.gain.linearRampToValueAtTime(target, now + 0.8);
    },

    stopAmbient() {
        if (this.pluckTimer) {
            clearTimeout(this.pluckTimer);
            this.pluckTimer = null;
        }
        if (!this.isAmbientPlaying || !this.ctx) {
            this.isAmbientPlaying = false;
            return;
        }
        this.isAmbientPlaying = false;
        const now = this.ctx.currentTime;
        this.bgmMaster.gain.cancelScheduledValues(now);
        this.bgmMaster.gain.setValueAtTime(Math.max(0.0001, this.bgmMaster.gain.value), now);
        this.bgmMaster.gain.linearRampToValueAtTime(0.0001, now + 0.7);
        const nodesToStop = this.droneNodes.slice();
        this.droneNodes = [];
        setTimeout(() => {
            nodesToStop.forEach(n => {
                try { n.stop(); n.disconnect(); } catch (e) {}
            });
        }, 750);
    }
};

let audioTourState = {
    audio: new Audio(),
    cardAudio: null,
    isCardPlaying: false,
    lastCardText: '',
    lastCardBtn: null,
    chimeAdvanceTimer: null,
    isPlaying: false,
    currentChapter: 0,
    chapters: [],
    voice: 'zen-male',
    speed: 1.0,
    analyser: null,
    audioCtx: null
};

function getChapterAudioUrl(ch) {
    if (!ch || !ch.audio_file) return '';
    if (audioTourState.voice === 'zen-male' || audioTourState.voice === 'zh-TW-YunJheNeural') {
        return ch.audio_file.replace(/\.mp3$/i, '_male.mp3');
    }
    if (audioTourState.voice === 'zen-female') {
        return ch.audio_file.replace(/\.mp3$/i, '_zen_female.mp3');
    }
    return ch.audio_file;
}

function clearChimeTimer() {
    if (audioTourState.chimeAdvanceTimer) {
        clearTimeout(audioTourState.chimeAdvanceTimer);
        audioTourState.chimeAdvanceTimer = null;
    }
}

function initAudioTour() {
    const playBtn = document.getElementById('dockPlayBtn');
    const prevBtn = document.getElementById('dockPrevBtn');
    const nextBtn = document.getElementById('dockNextBtn');
    const chapterSelect = document.getElementById('dockChapterSelect');
    const voiceSelect = document.getElementById('dockVoiceSelect');
    const speedSelect = document.getElementById('dockSpeedSelect');
    const zenBgmBtn = document.getElementById('dockZenBgmBtn');
    const bowlBtn = document.getElementById('dockBowlBtn');
    
    // Read chapters from embedded data
    if (window.SITE_DATA && window.SITE_DATA.tour_chapters) {
        audioTourState.chapters = window.SITE_DATA.tour_chapters;
    }

    if (!audioTourState.chapters.length) return;

    // Sync initial dropdown states
    if (voiceSelect && voiceSelect.value) {
        audioTourState.voice = voiceSelect.value;
    }
    if (speedSelect && speedSelect.value) {
        audioTourState.speed = parseFloat(speedSelect.value) || 1.0;
    }

    // Populate chapters dropdown
    if (chapterSelect) {
        chapterSelect.innerHTML = audioTourState.chapters.map((ch, idx) => 
            `<option value="${idx}">${idx + 1}. ${ch.title}</option>`
        ).join('');
        
        chapterSelect.addEventListener('change', (e) => {
            clearChimeTimer();
            stopCardAudio();
            ZenSoundEngine.strikeYinqing(1056, 0.11);
            selectChapter(parseInt(e.target.value), true);
        });
    }

    // Zen Ambient Background Music Toggle
    if (zenBgmBtn) {
        zenBgmBtn.addEventListener('click', () => {
            ZenSoundEngine.bgmEnabled = !ZenSoundEngine.bgmEnabled;
            zenBgmBtn.classList.toggle('active', ZenSoundEngine.bgmEnabled);
            if (ZenSoundEngine.bgmEnabled) {
                ZenSoundEngine.strikeSingingBowl(216, 0.22);
                ZenSoundEngine.startAmbient(audioTourState.isPlaying || audioTourState.isCardPlaying);
                showToast("🪷 已開啟禪風古琴與頌缽靜心背景配樂");
            } else {
                ZenSoundEngine.stopAmbient();
                showToast("已關閉禪風背景配樂（保留語音導覽）");
            }
        });
    }

    // Manual Singing Bowl Chime Button
    if (bowlBtn) {
        bowlBtn.addEventListener('click', () => {
            ZenSoundEngine.strikeSingingBowl(216, 0.32);
            showToast("🔔 靜心頌缽 · 法寶初心，圓融至善");
        });
    }

    // Voice & Speed change
    if (voiceSelect) {
        voiceSelect.addEventListener('change', (e) => {
            clearChimeTimer();
            const wasTourPlaying = audioTourState.isPlaying;
            const wasCardPlaying = audioTourState.isCardPlaying;
            audioTourState.voice = e.target.value;
            showToast(`🙏 已切換法音語韻：${e.target.options[e.target.selectedIndex].text}`);

            if (wasCardPlaying && audioTourState.lastCardText) {
                stopCardAudio();
                window.readAloudText(audioTourState.lastCardText, audioTourState.lastCardBtn);
            } else {
                selectChapter(audioTourState.currentChapter, wasTourPlaying);
            }
        });
    }

    if (speedSelect) {
        speedSelect.addEventListener('change', (e) => {
            audioTourState.speed = parseFloat(e.target.value);
            audioTourState.audio.playbackRate = audioTourState.speed;
            if (audioTourState.cardAudio) {
                audioTourState.cardAudio.playbackRate = audioTourState.speed;
            }
        });
    }

    // Audio Event listeners with Temple Yinqing & Singing Bowl transitions
    audioTourState.audio.addEventListener('ended', () => {
        if (audioTourState.currentChapter < audioTourState.chapters.length - 1) {
            ZenSoundEngine.strikeYinqing(1056, 0.13);
            ZenSoundEngine.setDucking(false);
            clearChimeTimer();
            audioTourState.chimeAdvanceTimer = setTimeout(() => {
                selectChapter(audioTourState.currentChapter + 1, true);
            }, 950);
        } else {
            audioTourState.isPlaying = false;
            updatePlayButtonUI();
            ZenSoundEngine.strikeSingingBowl(174.6, 0.28);
            ZenSoundEngine.setDucking(false);
            showToast("🙏 法寶導覽圓滿，感謝您的靜心聆聽");
        }
    });

    audioTourState.audio.addEventListener('play', () => {
        audioTourState.isPlaying = true;
        updatePlayButtonUI();
        if (ZenSoundEngine.bgmEnabled) {
            ZenSoundEngine.startAmbient(true);
        }
        ZenSoundEngine.setDucking(true);
    });

    audioTourState.audio.addEventListener('pause', () => {
        audioTourState.isPlaying = false;
        updatePlayButtonUI();
        ZenSoundEngine.setDucking(false);
    });

    // Button actions
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            togglePlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (audioTourState.currentChapter > 0) {
                clearChimeTimer();
                ZenSoundEngine.strikeYinqing(1056, 0.11);
                selectChapter(audioTourState.currentChapter - 1, true);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (audioTourState.currentChapter < audioTourState.chapters.length - 1) {
                clearChimeTimer();
                ZenSoundEngine.strikeYinqing(1056, 0.11);
                selectChapter(audioTourState.currentChapter + 1, true);
            }
        });
    }

    // Floating hero trigger
    const startTourHeroBtn = document.getElementById('startTourHeroBtn');
    if (startTourHeroBtn) {
        startTourHeroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearChimeTimer();
            ZenSoundEngine.strikeSingingBowl(216, 0.28);
            if (ZenSoundEngine.bgmEnabled) {
                ZenSoundEngine.startAmbient(true);
            }
            selectChapter(0, true);
        });
    }

    // Init first chapter
    selectChapter(0, false);
    initAudioVisualizer();
}

function stopCardAudio() {
    if (audioTourState.cardAudio) {
        audioTourState.cardAudio.pause();
        audioTourState.cardAudio.currentTime = 0;
        audioTourState.cardAudio = null;
    }
    audioTourState.isCardPlaying = false;
}

function selectChapter(index, autoPlay = false) {
    if (index < 0 || index >= audioTourState.chapters.length) return;
    stopCardAudio();
    audioTourState.currentChapter = index;
    const ch = audioTourState.chapters[index];
    
    // Update UI title
    const trackTitle = document.getElementById('dockTrackTitle');
    if (trackTitle) trackTitle.textContent = ch.title;
    
    const chapterSelect = document.getElementById('dockChapterSelect');
    if (chapterSelect) chapterSelect.value = index;

    // Load voice-specific audio file (Zen male / Zen female / Standard)
    const targetSrc = getChapterAudioUrl(ch);
    audioTourState.audio.pause();
    audioTourState.audio.src = targetSrc;
    audioTourState.audio.playbackRate = audioTourState.speed;

    if (autoPlay) {
        audioTourState.audio.play().then(() => {
            audioTourState.isPlaying = true;
            audioTourState.audio.playbackRate = audioTourState.speed;
            updatePlayButtonUI();
            highlightAndScrollToSection(ch.section_id);
        }).catch(err => {
            console.warn("Auto-play prevented:", err);
        });
    } else {
        audioTourState.isPlaying = false;
        updatePlayButtonUI();
    }
}

function togglePlay() {
    clearChimeTimer();
    stopCardAudio();
    if (audioTourState.isPlaying) {
        audioTourState.audio.pause();
    } else {
        ZenSoundEngine.strikeSingingBowl(216, 0.26);
        if (ZenSoundEngine.bgmEnabled) {
            ZenSoundEngine.startAmbient(true);
        }
        const ch = audioTourState.chapters[audioTourState.currentChapter];
        const expectedUrl = getChapterAudioUrl(ch);
        if (!audioTourState.audio.src || !audioTourState.audio.src.endsWith(expectedUrl)) {
            audioTourState.audio.src = expectedUrl;
        }
        audioTourState.audio.playbackRate = audioTourState.speed;
        audioTourState.audio.play().then(() => {
            audioTourState.audio.playbackRate = audioTourState.speed;
            highlightAndScrollToSection(ch.section_id);
        }).catch(err => console.error(err));
    }
}

function updatePlayButtonUI() {
    const playBtn = document.getElementById('dockPlayBtn');
    if (!playBtn) return;
    if (audioTourState.isPlaying) {
        playBtn.innerHTML = '⏸';
        playBtn.title = '暫停導覽';
        playBtn.style.boxShadow = '0 0 25px #fbbf24';
    } else {
        playBtn.innerHTML = '▶';
        playBtn.title = '啟動禪韻語音導覽';
        playBtn.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.4)';
    }
}

function highlightAndScrollToSection(sectionId) {
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (!el) return;
    
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Temporary glow highlight
    el.classList.add('active-tour-section');
    setTimeout(() => {
        el.classList.remove('active-tour-section');
    }, 4500);
}

// Waveform visualizer (supports Golden Lotus glow on Singing Bowl & Zen BGM)
function initAudioVisualizer() {
    const canvas = document.getElementById('audioWaveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let waveOffset = 0;
    
    function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const width = canvas.width;
        const height = canvas.height;
        const mid = height / 2;
        
        if (ZenSoundEngine.bowlVisualEnergy > 0.01) {
            ZenSoundEngine.bowlVisualEnergy *= 0.965;
        } else {
            ZenSoundEngine.bowlVisualEnergy = 0;
        }

        const isSpeaking = audioTourState.isPlaying || audioTourState.isCardPlaying;
        const isAmbient = ZenSoundEngine.isAmbientPlaying;
        const bowlBoost = ZenSoundEngine.bowlVisualEnergy * 11;

        ctx.beginPath();
        ctx.moveTo(0, mid);
        
        const amplitude = (isSpeaking ? 9 : (isAmbient ? 4.5 : 1.8)) + bowlBoost;
        const speed = isSpeaking ? 0.11 : (isAmbient ? 0.05 : 0.025);
        waveOffset += speed;

        for (let x = 0; x < width; x++) {
            const y = mid + Math.sin(x * 0.045 + waveOffset) * amplitude * Math.sin((x / width) * Math.PI);
            ctx.lineTo(x, y);
        }
        
        const isZenGolden = ZenSoundEngine.bowlVisualEnergy > 0.15 || (isAmbient && audioTourState.voice.startsWith('zen'));
        const strokeColor = isZenGolden ? '#fbbf24' : (isSpeaking ? '#00f0ff' : 'rgba(255, 255, 255, 0.22)');
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.shadowColor = (isSpeaking || isAmbient || bowlBoost > 1) ? strokeColor : 'transparent';
        ctx.shadowBlur = (isSpeaking || isAmbient || bowlBoost > 1) ? 9 : 0;
        ctx.stroke();
        
        requestAnimationFrame(drawWave);
    }
    drawWave();
}

// On-demand dynamic TTS read-aloud for cards
window.readAloudText = function(text, btnElement) {
    if (!text) return;
    
    clearChimeTimer();
    stopCardAudio();
    audioTourState.lastCardText = text;
    audioTourState.lastCardBtn = btnElement || null;

    const voiceSelect = document.getElementById('dockVoiceSelect');
    if (voiceSelect && voiceSelect.value) {
        audioTourState.voice = voiceSelect.value;
    }

    ZenSoundEngine.strikeYinqing(1056, 0.11);
    if (ZenSoundEngine.bgmEnabled) {
        ZenSoundEngine.startAmbient(true);
    }

    const originalText = btnElement ? btnElement.innerHTML : '';
    if (btnElement) {
        btnElement.innerHTML = '⏳ 法音生成中...';
        btnElement.disabled = true;
    }
    
    const voice = audioTourState.voice || 'zen-male';
    const url = `/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (btnElement) {
                btnElement.innerHTML = originalText;
                btnElement.disabled = false;
            }
            if (data.url) {
                if (audioTourState.isPlaying) {
                    audioTourState.audio.pause();
                }
                const speechAudio = new Audio(data.url);
                speechAudio.playbackRate = audioTourState.speed || 1.0;
                audioTourState.cardAudio = speechAudio;
                speechAudio.addEventListener('play', () => {
                    audioTourState.isCardPlaying = true;
                    ZenSoundEngine.setDucking(true);
                });
                speechAudio.addEventListener('ended', () => {
                    audioTourState.isCardPlaying = false;
                    ZenSoundEngine.setDucking(false);
                });
                speechAudio.addEventListener('pause', () => {
                    audioTourState.isCardPlaying = false;
                    ZenSoundEngine.setDucking(false);
                });
                speechAudio.play();
                showToast("🪷 正在為您靜心朗讀內容...");
            } else {
                showToast("語音合成失敗，請稍後重試");
            }
        })
        .catch(err => {
            console.error(err);
            if (btnElement) {
                btnElement.innerHTML = originalText;
                btnElement.disabled = false;
            }
            showToast("連線至語音引擎超時");
        });
};

/* ==========================================================================
   3. Stock Specs Explorer (現貨規格即時篩選查詢)
   ========================================================================== */
function initSpecsExplorer() {
    const searchInput = document.getElementById('specsSearchInput');
    const catSelect = document.getElementById('specsCatSelect');
    const tableBody = document.getElementById('specsTableBody');
    const totalCountEl = document.getElementById('specsTotalCount');
    const pageNumEl = document.getElementById('specsPageNum');
    const prevPageBtn = document.getElementById('specsPrevBtn');
    const nextPageBtn = document.getElementById('specsNextBtn');
    
    if (!tableBody) return;

    let currentPage = 1;
    let totalPages = 1;
    let debounceTimer;

    function fetchSpecs(page = 1) {
        currentPage = page;
        const q = searchInput ? searchInput.value.trim() : '';
        const category = catSelect ? catSelect.value : '';

        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: #94a3b8;">🔍 正在檢索庫存現貨規格資料庫...</td></tr>`;

        fetch(`/api/specs?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&page=${page}&per_page=20`)
            .then(res => res.json())
            .then(data => {
                totalPages = data.total_pages || 1;
                if (totalCountEl) totalCountEl.textContent = data.total;
                if (pageNumEl) pageNumEl.textContent = `${data.page} / ${totalPages}`;
                
                if (prevPageBtn) prevPageBtn.disabled = data.page <= 1;
                if (nextPageBtn) nextPageBtn.disabled = data.page >= totalPages;

                if (!data.items || data.items.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: #94a3b8;">找不到符合條件的現貨規格，建議輸入厚度、直徑或合金型號（如 5052、6061、7075）。</td></tr>`;
                    return;
                }

                tableBody.innerHTML = data.items.map((item, idx) => `
                    <tr>
                        <td style="color: var(--accent-cyan); font-weight:700;">#${(data.page - 1) * 20 + idx + 1}</td>
                        <td><span style="font-weight:700; color:#fff;">${item.category}</span></td>
                        <td><span class="chip" style="color:var(--accent-amber); font-weight:600;">${item.material}</span></td>
                        <td style="font-weight:600;">${item.dimension || '-'}</td>
                        <td>${item.size || '-'}</td>
                        <td>
                            ${item.note ? `<span class="badge-stock">${item.note}</span>` : '<span class="badge-stock">現貨庫存</span>'}
                            <button class="btn-outline" style="padding:2px 8px; font-size:0.75rem; margin-left:8px;" onclick="addSpecToQuote('${item.material} ${item.dimension} ${item.size}')">詢價</button>
                        </td>
                    </tr>
                `).join('');
            })
            .catch(err => {
                console.error(err);
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color:#ef4444;">資料庫讀取失敗</td></tr>`;
            });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fetchSpecs(1), 300);
        });
    }

    if (catSelect) {
        catSelect.addEventListener('change', () => fetchSpecs(1));
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) fetchSpecs(currentPage - 1);
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) fetchSpecs(currentPage + 1);
        });
    }

    fetchSpecs(1);
}

window.addSpecToQuote = function(specText) {
    const inquiryMaterial = document.getElementById('inquiryMaterial');
    const inquiryMessage = document.getElementById('inquiryMessage');
    const contactSection = document.getElementById('contact');
    
    if (inquiryMaterial) inquiryMaterial.value = specText;
    if (inquiryMessage) inquiryMessage.value = `您好，我需要詢問以下現貨規格的報價與交期：\n【規格】${specText}\n【預計採購數量】\n【加工需求】`;
    
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`已將規格「${specText}」帶入諮詢表單`);
};

/* ==========================================================================
   4. Hardness Converter (國際標準金屬硬度對照計算器)
   ========================================================================== */
function initHardnessCalculator() {
    const hbInput = document.getElementById('calcHbInput');
    const hrcVal = document.getElementById('calcHrcVal');
    const hrbVal = document.getElementById('calcHrbVal');
    const hvVal = document.getElementById('calcHvVal');
    const shoreVal = document.getElementById('calcShoreVal');
    const tensileVal = document.getElementById('calcTensileVal');

    if (!hbInput || !window.SITE_DATA || !window.SITE_DATA.hardness_data) return;

    const data = window.SITE_DATA.hardness_data;

    function convertHardness(hb) {
        if (isNaN(hb) || hb <= 0) return;

        // Find closest point or interpolate
        let closest = data[0];
        let minDiff = Math.abs(data[0].HB - hb);

        for (let i = 1; i < data.length; i++) {
            const diff = Math.abs(data[i].HB - hb);
            if (diff < minDiff) {
                minDiff = diff;
                closest = data[i];
            }
        }

        if (hrcVal) hrcVal.textContent = closest.HRC !== '-' ? `${closest.HRC} HRC` : '—';
        if (hrbVal) hrbVal.textContent = closest.HRB !== '-' ? `${closest.HRB} HRB` : '—';
        if (hvVal) hvVal.textContent = `${closest.HV} HV`;
        if (shoreVal) shoreVal.textContent = `${closest.shore} HS`;
        if (tensileVal) tensileVal.textContent = `≈ ${closest.tensile_approx} MPa`;
    }

    hbInput.addEventListener('input', (e) => {
        convertHardness(parseFloat(e.target.value));
    });

    convertHardness(parseFloat(hbInput.value) || 229);
}

/* ==========================================================================
   5. Product Filter Tabs
   ========================================================================== */
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            productCards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   6. Contact Form Submission
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '送出中...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const jsonBody = {};
        formData.forEach((val, key) => jsonBody[key] = val);

        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonBody)
        })
        .then(res => res.json())
        .then(data => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            if (data.success) {
                showSuccessModal(data.ticket_id, data.message);
                form.reset();
            } else {
                showToast("送出失敗：" + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showToast("網路錯誤，請稍後再試或致電各廠區");
        });
    });
}

function showSuccessModal(ticketId, message) {
    const modal = document.getElementById('successModal');
    const modalMsg = document.getElementById('modalMessage');
    const modalTicket = document.getElementById('modalTicket');
    if (modal) {
        if (modalMsg) modalMsg.textContent = message;
        if (modalTicket) modalTicket.textContent = `諮詢單號：${ticketId}`;
        modal.classList.add('open');
    }
}

window.closeModal = function() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('open');
};

/* ==========================================================================
   7. Scroll Spy & Toast Utility
   ========================================================================== */
function initScrollSpy() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            if (window.pageYOffset >= secTop) {
                current = sec.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   8. Cloudflare Tunnel Management
   ========================================================================== */
window.openTunnelModal = function() {
    const modal = document.getElementById('tunnelModal');
    if (modal) modal.classList.add('open');
    checkTunnelStatus();
};

window.closeTunnelModal = function() {
    const modal = document.getElementById('tunnelModal');
    if (modal) modal.classList.remove('open');
};

function checkTunnelStatus() {
    const input = document.getElementById('tunnelUrlInput');
    const openLink = document.getElementById('tunnelOpenLink');
    if (!input) return;

    input.value = "連線狀態檢測中...";

    fetch('/api/tunnel-status')
        .then(res => res.json())
        .then(data => {
            if (data.running && data.url) {
                input.value = data.url;
                if (openLink) {
                    openLink.href = data.url;
                    openLink.style.display = 'inline-flex';
                }
            } else {
                input.value = "尚未建立穿透，請點擊下方按鈕建立";
                if (openLink) openLink.style.display = 'none';
            }
        })
        .catch(() => {
            input.value = "無法取得 Tunnel 狀態";
        });
}

window.toggleTunnelAction = function() {
    const input = document.getElementById('tunnelUrlInput');
    const btn = document.getElementById('btnToggleTunnel');
    const openLink = document.getElementById('tunnelOpenLink');

    if (input) input.value = "正在自動調用 cloudflared 穿透中...";
    if (btn) {
        btn.innerHTML = "⏳ 正在與 Cloudflare 連線中...";
        btn.disabled = true;
    }

    fetch('/api/tunnel/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port: 5000 })
    })
    .then(res => res.json())
    .then(data => {
        if (btn) {
            btn.innerHTML = "⚡ 重新取得外網網址";
            btn.disabled = false;
        }
        if (data.success && data.url) {
            if (input) input.value = data.url;
            if (openLink) {
                openLink.href = data.url;
                openLink.style.display = 'inline-flex';
            }
            showToast("🌐 Cloudflare Tunnel 已就緒！");
        } else {
            if (input) input.value = "建立失敗：" + (data.error || '請檢查網路連線');
            showToast("穿透建立失敗");
        }
    })
    .catch(err => {
        if (btn) {
            btn.innerHTML = "⚡ 建立 / 重新取得外網網址";
            btn.disabled = false;
        }
        if (input) input.value = "網路請求失敗";
        showToast("伺服器請求超時");
    });
};

window.copyTunnelUrl = function() {
    const input = document.getElementById('tunnelUrlInput');
    if (!input || !input.value.startsWith('http')) {
        showToast("尚無有效的公開網址可供複製");
        return;
    }
    navigator.clipboard.writeText(input.value).then(() => {
        showToast("📋 已複製 Cloudflare 公開網址到剪貼簿！");
    }).catch(() => {
        input.select();
        document.execCommand('copy');
        showToast("📋 已複製！");
    });
};

function showToast(msg) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3500);
}

