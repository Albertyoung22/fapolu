/**
 * 法寶實業有限公司 - 沉浸式互動核心引擎
 * FAPO ENTERPRISE Interactive Experience & Edge-TTS Audio Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initLatticeCanvas();
    initPageRouter();
    initAudioTour();
    initSpecsExplorer();
    initHardnessCalculator();
    initContactForm();
    initProductFilters();
    initAboutTabs();
    initTechTabs();
    initMobileUI();
});

function initAboutTabs() {
    const tabBar = document.getElementById('aboutTabBar');
    if (!tabBar) return;
    const buttons = tabBar.querySelectorAll('[data-about-tab]');
    const panels = document.querySelectorAll('[data-about-panel]');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.aboutTab;
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panels.forEach(p => {
                const match = target === 'all' || p.dataset.aboutPanel === target;
                p.style.display = match ? '' : 'none';
            });
        });
    });
}

function initTechTabs() {
    const tabBar = document.getElementById('techTabBar');
    if (!tabBar) return;
    const buttons = tabBar.querySelectorAll('[data-tech-tab]');
    const panels = document.querySelectorAll('[data-tech-panel]');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.techTab;
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panels.forEach(p => {
                const match = target === 'all' || p.dataset.techPanel === target;
                p.style.display = match ? '' : 'none';
            });
        });
    });
}

window.filterChemTable = function(val) {
    const query = (val || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#chemTableBody tr');
    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(query) ? '' : 'none';
    });
};

window.closeMobileMenu = function() {
    const overlay = document.getElementById('mobileNavOverlay');
    const menuBtn = document.getElementById('mobileMenuBtn');
    if (overlay) overlay.classList.remove('open');
    if (menuBtn) menuBtn.textContent = '☰';
};

function initMobileUI() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const overlay = document.getElementById('mobileNavOverlay');
    if (menuBtn && overlay) {
        menuBtn.addEventListener('click', () => {
            const isOpen = overlay.classList.toggle('open');
            menuBtn.textContent = isOpen ? '✕' : '☰';
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) window.closeMobileMenu();
        });
        overlay.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => window.closeMobileMenu());
        });
    }

    // Mobile Audio Dock Expandable Controls Toggle
    const dock = document.getElementById('audioDock');
    const moreBtn = document.getElementById('dockMoreBtn');
    if (dock && moreBtn) {
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExp = dock.classList.toggle('expanded');
            moreBtn.textContent = isExp ? '收合 ▾' : '音訊 ▴';
        });
        document.addEventListener('click', (e) => {
            if (dock.classList.contains('expanded') && !dock.contains(e.target)) {
                dock.classList.remove('expanded');
                moreBtn.textContent = '音訊 ▴';
            }
        });
    }
}

/* ==========================================================================
   1. Ink-Wash Mountain Mist & Golden Bodhi Light Canvas
      (水墨宣紙遠山雲霧 · 蓮華背光暗紋 · 飄落金色菩提微光特效)
   ========================================================================== */
function initLatticeCanvas() {
    const canvas = document.getElementById('latticeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const mouse = { x: width * 0.5, y: height * 0.4, radius: 140 };
    const ripples = [];
    let lastRippleTime = 0;

    function addRipple(x, y) {
        const now = performance.now();
        if (now - lastRippleTime > 260) {
            lastRippleTime = now;
            ripples.push({ x, y, r: 4, alpha: 0.24 });
            if (ripples.length > 8) ripples.shift();
        }
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        addRipple(e.clientX, e.clientY);
    });

    window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
            addRipple(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    // Drifting mountain mist clouds
    const mists = Array.from({ length: 5 }, (_, i) => ({
        x: Math.random() * width,
        y: height * (0.58 + i * 0.08),
        rx: width * (0.28 + Math.random() * 0.22),
        ry: 48 + Math.random() * 42,
        vx: (i % 2 === 0 ? 1 : -1) * (0.14 + Math.random() * 0.12)
    }));

    // Floating Golden Bodhi Light Motes & Ink Dust
    const moteCount = Math.min(54, Math.floor((width * height) / 22000));
    const motes = Array.from({ length: moteCount }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: -0.15 - Math.random() * 0.28,
        radius: Math.random() * 2.4 + 1.2,
        phase: Math.random() * Math.PI * 2,
        isGold: i % 5 !== 0
    }));

    let lotusAngle = 0;
    let timeTick = 0;

    function drawSacredLotusWatermark(cx, cy, maxR) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(lotusAngle);

        // Subtle concentric Dharma rings
        ctx.strokeStyle = 'rgba(168, 120, 38, 0.07)';
        ctx.lineWidth = 1;
        [maxR * 0.36, maxR * 0.68, maxR * 0.96].forEach(r => {
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
        });

        // 12-petal Sacred Lotus geometry
        const petals = 12;
        ctx.strokeStyle = 'rgba(168, 118, 34, 0.085)';
        ctx.lineWidth = 1.15;
        for (let i = 0; i < petals; i++) {
            ctx.save();
            ctx.rotate((Math.PI * 2 * i) / petals);
            ctx.beginPath();
            ctx.moveTo(0, maxR * 0.16);
            ctx.quadraticCurveTo(maxR * 0.28, maxR * 0.54, 0, maxR * 0.92);
            ctx.quadraticCurveTo(-maxR * 0.28, maxR * 0.54, 0, maxR * 0.16);
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
    }

    function drawInkMountainLayer(baseYRatio, amp, freq1, freq2, speedOffset, inkRgba) {
        const baseY = height * baseYRatio;
        const grad = ctx.createLinearGradient(0, baseY - amp * 1.4, 0, height);
        grad.addColorStop(0, inkRgba);
        grad.addColorStop(0.65, 'rgba(232, 224, 206, 0.18)');
        grad.addColorStop(1, 'rgba(244, 238, 225, 0.02)');

        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width + 24; x += 24) {
            const y = baseY
                - Math.sin(x * freq1 + speedOffset) * amp * 0.62
                - Math.cos(x * freq2 - speedOffset * 0.6) * amp * 0.38
                - Math.sin(x * freq1 * 2.3 + 1.4) * (amp * 0.16);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        timeTick += 0.004;
        lotusAngle += 0.0008;

        // 1. Subtle Sacred Lotus halo watermark
        drawSacredLotusWatermark(width * 0.5, Math.min(height * 0.44, 420), Math.min(width, height) * 0.36);

        // 2. Three layered ink-wash distant mountain silhouettes (遠山淡墨三疊)
        drawInkMountainLayer(0.73, 68, 0.0019, 0.0033, timeTick * 0.35, 'rgba(96, 92, 82, 0.075)');
        drawInkMountainLayer(0.82, 54, 0.0026, 0.0044, -timeTick * 0.45 + 2.1, 'rgba(74, 68, 58, 0.095)');
        drawInkMountainLayer(0.90, 40, 0.0034, 0.0056, timeTick * 0.55 + 4.0, 'rgba(54, 48, 40, 0.115)');

        // 3. Drifting valley mist clouds (山嵐雲氣)
        for (let i = 0; i < mists.length; i++) {
            const m = mists[i];
            m.x += m.vx;
            if (m.x - m.rx > width) m.x = -m.rx;
            if (m.x + m.rx < 0) m.x = width + m.rx;

            const g = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.rx);
            g.addColorStop(0, 'rgba(253, 250, 243, 0.55)');
            g.addColorStop(1, 'rgba(253, 250, 243, 0)');
            ctx.save();
            ctx.translate(m.x, m.y);
            ctx.scale(1, m.ry / m.rx);
            ctx.translate(-m.x, -m.y);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.rx, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 4. Cursor Zen water ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            const rp = ripples[i];
            rp.r += 0.9;
            rp.alpha *= 0.965;
            if (rp.alpha < 0.01) {
                ripples.splice(i, 1);
                continue;
            }
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(180, 128, 40, ${rp.alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 5. Floating Golden Bodhi Light Motes (金色菩提微光與淡墨微塵)
        for (let i = 0; i < motes.length; i++) {
            const p = motes[i];
            p.phase += 0.025;
            p.x += p.vx + Math.sin(p.phase) * 0.18;
            p.y += p.vy;

            if (p.y < -12) { p.y = height + 12; p.x = Math.random() * width; }
            if (p.x < -12) p.x = width + 12;
            if (p.x > width + 12) p.x = -12;

            // Gentle breeze away from cursor
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius && dist > 1) {
                const force = (mouse.radius - dist) / mouse.radius;
                p.x -= (dx / dist) * force * 0.9;
                p.y -= (dy / dist) * force * 0.9;
            }

            const shimmer = 0.35 + (Math.sin(p.phase) + 1) * 0.25;
            if (p.isGold) {
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.8);
                glow.addColorStop(0, `rgba(208, 152, 42, ${shimmer * 0.85})`);
                glow.addColorStop(0.5, `rgba(218, 168, 62, ${shimmer * 0.3})`);
                glow.addColorStop(1, 'rgba(218, 168, 62, 0)');
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 3.8, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 0.85, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(92, 82, 68, ${shimmer * 0.32})`;
                ctx.fill();
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. Studio Acoustic BGM & Edge-TTS Audio Tour Engine
      (真人錄音室實錄背景輕音樂：貝森朵夫平台鋼琴 / 古典木吉他 / 傳統古琴 + 智慧語音避讓)
   ========================================================================== */
const BGM_TRACKS = {
    piano: {
        url: '/static/audio/bgm_piano.mp3',
        label: '🎹 典雅鋼琴 · 巴哈 C 大調前奏曲'
    },
    guitar: {
        url: '/static/audio/bgm_guitar.mp3',
        label: '🎸 溫潤木吉他 · 薩提《吉姆諾佩蒂》'
    },
    guqin: {
        url: '/static/audio/bgm_guqin.mp3',
        label: '🍵 東方古琴 · 《陽關三疊》'
    }
};

const StudioBgmEngine = {
    audio: null,
    fadeTimer: null,
    outroTimer: null,
    currentTrack: 'piano',
    bgmEnabled: true,
    standaloneMode: false,
    isAmbientPlaying: false,
    isInFinaleOutro: false,
    bowlVisualEnergy: 0,

    _clearTimers() {
        this.isInFinaleOutro = false;
        if (this.fadeTimer) {
            clearInterval(this.fadeTimer);
            this.fadeTimer = null;
        }
        if (this.outroTimer) {
            clearTimeout(this.outroTimer);
            this.outroTimer = null;
        }
    },

    ensureAudio() {
        if (!this.audio) {
            this.audio = new Audio();
            this.audio.loop = true;
            this.audio.preload = 'none';
            this.audio.volume = 0;
            this.audio.src = BGM_TRACKS[this.currentTrack].url;
        }
        return this.audio;
    },

    _fadeTo(targetVol, durationMs = 550, onDone = null) {
        const a = this.ensureAudio();
        if (this.fadeTimer) {
            clearInterval(this.fadeTimer);
            this.fadeTimer = null;
        }
        const startVol = a.volume;
        const steps = 16;
        const stepMs = Math.max(20, Math.floor(durationMs / steps));
        let count = 0;

        this.fadeTimer = setInterval(() => {
            count++;
            const ratio = Math.min(1, count / steps);
            a.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * ratio));
            if (count >= steps) {
                clearInterval(this.fadeTimer);
                this.fadeTimer = null;
                if (onDone) onDone();
            }
        }, stepMs);
    },

    startAmbient(isSpeaking = false) {
        if (!this.bgmEnabled || this.currentTrack === 'off' || !BGM_TRACKS[this.currentTrack]) return;
        this._clearTimers();
        const a = this.ensureAudio();
        const expectedUrl = BGM_TRACKS[this.currentTrack].url;
        if (!a.src || !a.src.endsWith(expectedUrl)) {
            a.src = expectedUrl;
        }
        const targetVol = isSpeaking ? 0.16 : 0.38;
        if (a.paused) {
            a.volume = 0.01;
            a.play().then(() => {
                this.isAmbientPlaying = true;
                this._fadeTo(targetVol, 700);
            }).catch(() => {});
        } else {
            this.isAmbientPlaying = true;
            this._fadeTo(targetVol, 500);
        }
    },

    setDucking(isSpeaking) {
        if (!this.audio || !this.isAmbientPlaying) return;
        if (isSpeaking) {
            this.isInFinaleOutro = false;
            this._fadeTo(0.16, 450);
        } else if (this.isInFinaleOutro) {
            return;
        } else if (this.standaloneMode && this.bgmEnabled && this.currentTrack !== 'off') {
            this._fadeTo(0.38, 600);
        } else {
            this.stopAmbient();
        }
    },

    playFinaleOutro() {
        if (!this.audio || !this.isAmbientPlaying || this.standaloneMode) return;
        this._clearTimers();
        this.isInFinaleOutro = true;
        // Gently swell music for a warm 2.6s closing cadence, then smoothly fade out to silence
        this._fadeTo(0.28, 700, () => {
            this.outroTimer = setTimeout(() => {
                this.isAmbientPlaying = false;
                this.isInFinaleOutro = false;
                this._fadeTo(0.0, 2200, () => {
                    if (!this.isAmbientPlaying && this.audio) {
                        this.audio.pause();
                    }
                });
            }, 2600);
        });
    },

    setTrack(trackKey, isVoiceActive = false) {
        if (trackKey === 'off') {
            this.currentTrack = 'off';
            this.bgmEnabled = false;
            this.standaloneMode = false;
            this.stopAmbient();
            return;
        }
        if (!BGM_TRACKS[trackKey]) return;
        this.currentTrack = trackKey;
        this.bgmEnabled = true;
        const a = this.ensureAudio();
        const wasPlaying = this.isAmbientPlaying && !a.paused;
        a.pause();
        a.src = BGM_TRACKS[trackKey].url;
        a.currentTime = 0;
        if (wasPlaying || isVoiceActive || this.standaloneMode) {
            this.startAmbient(isVoiceActive);
        }
    },

    stopAmbient() {
        this.isAmbientPlaying = false;
        if (!this.audio || this.audio.paused) return;
        this._fadeTo(0.0, 420, () => {
            if (!this.isAmbientPlaying && this.audio) {
                this.audio.pause();
            }
        });
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
    const bgmSelect = document.getElementById('dockBgmSelect');
    const voiceSelect = document.getElementById('dockVoiceSelect');
    const speedSelect = document.getElementById('dockSpeedSelect');
    const zenBgmBtn = document.getElementById('dockZenBgmBtn');
    
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
            selectChapter(parseInt(e.target.value), true);
        });
    }

    // Studio Acoustic Background Music Toggle & Selector
    if (zenBgmBtn) {
        zenBgmBtn.addEventListener('click', () => {
            const isVoiceSpeaking = audioTourState.isPlaying || audioTourState.isCardPlaying;
            if (StudioBgmEngine.isAmbientPlaying) {
                StudioBgmEngine.bgmEnabled = false;
                StudioBgmEngine.standaloneMode = false;
                StudioBgmEngine.stopAmbient();
                zenBgmBtn.classList.remove('active');
                if (bgmSelect) bgmSelect.value = 'off';
                showToast("🔇 已關閉背景輕音樂（保留純淨人聲導覽）");
            } else {
                if (StudioBgmEngine.currentTrack === 'off') {
                    StudioBgmEngine.currentTrack = 'piano';
                }
                StudioBgmEngine.bgmEnabled = true;
                StudioBgmEngine.standaloneMode = !isVoiceSpeaking;
                zenBgmBtn.classList.add('active');
                if (bgmSelect) bgmSelect.value = StudioBgmEngine.currentTrack;
                StudioBgmEngine.startAmbient(isVoiceSpeaking);
                showToast(`🎵 正在播放：${BGM_TRACKS[StudioBgmEngine.currentTrack].label}`);
            }
        });
    }

    if (bgmSelect) {
        bgmSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            const isVoiceSpeaking = audioTourState.isPlaying || audioTourState.isCardPlaying;
            if (val === 'off') {
                StudioBgmEngine.setTrack('off', isVoiceSpeaking);
                if (zenBgmBtn) zenBgmBtn.classList.remove('active');
                showToast("🔇 已關閉背景配樂");
            } else {
                if (!isVoiceSpeaking) {
                    StudioBgmEngine.standaloneMode = true;
                }
                StudioBgmEngine.setTrack(val, isVoiceSpeaking);
                if (zenBgmBtn) zenBgmBtn.classList.add('active');
                showToast(`🎵 已切換曲目：${BGM_TRACKS[val].label}`);
            }
        });
    }

    // Voice & Speed change
    if (voiceSelect) {
        voiceSelect.addEventListener('change', (e) => {
            clearChimeTimer();
            const wasTourPlaying = audioTourState.isPlaying;
            const wasCardPlaying = audioTourState.isCardPlaying;
            audioTourState.voice = e.target.value;
            showToast(`🎙️ 已切換導覽人聲：${e.target.options[e.target.selectedIndex].text}`);

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

    // Audio Event listeners
    audioTourState.audio.addEventListener('ended', () => {
        if (audioTourState.currentChapter < audioTourState.chapters.length - 1) {
            clearChimeTimer();
            audioTourState.chimeAdvanceTimer = setTimeout(() => {
                selectChapter(audioTourState.currentChapter + 1, true);
            }, 650);
        } else {
            audioTourState.isPlaying = false;
            StudioBgmEngine.playFinaleOutro();
            selectChapter(0, false);
            showToast("✨ 感謝聆聽法寶實業企業導覽 · 歡迎隨時線上諮詢估價！");
        }
    });

    audioTourState.audio.addEventListener('play', () => {
        audioTourState.isPlaying = true;
        updatePlayButtonUI();
        if (StudioBgmEngine.bgmEnabled && StudioBgmEngine.currentTrack !== 'off') {
            StudioBgmEngine.startAmbient(true);
        }
    });

    audioTourState.audio.addEventListener('pause', () => {
        if (!audioTourState.audio.ended) {
            audioTourState.isPlaying = false;
            updatePlayButtonUI();
            StudioBgmEngine.setDucking(false);
        }
    });

    // If a voice-specific chapter file fails, fall back to the base file, then browser TTS
    audioTourState.audio.addEventListener('error', () => {
        const ch = audioTourState.chapters[audioTourState.currentChapter];
        if (!ch) return;
        const cur = audioTourState.audio.src || '';
        if (ch.audio_file && !cur.endsWith(ch.audio_file)) {
            audioTourState.audio.src = ch.audio_file;
            audioTourState.audio.play().catch(() => {});
        } else if (ch.text || ch.script) {
            audioTourState.isPlaying = false;
            updatePlayButtonUI();
            speakWithBrowserTTS(ch.text || ch.script);
        }
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
                selectChapter(audioTourState.currentChapter - 1, true);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (audioTourState.currentChapter < audioTourState.chapters.length - 1) {
                clearChimeTimer();
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
            if (StudioBgmEngine.bgmEnabled) {
                StudioBgmEngine.startAmbient(true);
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
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
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
        StudioBgmEngine.standaloneMode = false;
        audioTourState.audio.pause();
    } else {
        if (StudioBgmEngine.bgmEnabled && StudioBgmEngine.currentTrack !== 'off') {
            StudioBgmEngine.startAmbient(true);
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
        playBtn.style.boxShadow = '0 0 22px rgba(180, 130, 45, 0.55)';
    } else {
        playBtn.innerHTML = '▶';
        playBtn.title = '啟動語音導覽';
        playBtn.style.boxShadow = '0 4px 16px rgba(166, 44, 34, 0.3)';
    }
}

function highlightAndScrollToSection(sectionId) {
    if (!sectionId) return;
    if (window.navigateToPage) {
        window.navigateToPage(sectionId, { fromTour: true });
    }
    const el = document.getElementById(sectionId);
    if (!el) return;
    
    // Temporary glow highlight
    el.classList.add('active-tour-section');
    setTimeout(() => {
        el.classList.remove('active-tour-section');
    }, 4500);
}

// Waveform visualizer
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
        
        if (StudioBgmEngine.bowlVisualEnergy > 0.01) {
            StudioBgmEngine.bowlVisualEnergy *= 0.965;
        } else {
            StudioBgmEngine.bowlVisualEnergy = 0;
        }

        const isSpeaking = audioTourState.isPlaying || audioTourState.isCardPlaying;
        const isAmbient = StudioBgmEngine.isAmbientPlaying;
        const bowlBoost = StudioBgmEngine.bowlVisualEnergy * 11;

        ctx.beginPath();
        ctx.moveTo(0, mid);
        
        const amplitude = (isSpeaking ? 9 : (isAmbient ? 4.5 : 1.8)) + bowlBoost;
        const speed = isSpeaking ? 0.11 : (isAmbient ? 0.05 : 0.025);
        waveOffset += speed;

        for (let x = 0; x < width; x++) {
            const y = mid + Math.sin(x * 0.045 + waveOffset) * amplitude * Math.sin((x / width) * Math.PI);
            ctx.lineTo(x, y);
        }
        
        const strokeColor = isSpeaking ? '#a62c22' : (isAmbient ? '#b07418' : 'rgba(120, 96, 58, 0.35)');
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.shadowColor = (isSpeaking || isAmbient) ? 'rgba(180, 128, 36, 0.45)' : 'transparent';
        ctx.shadowBlur = (isSpeaking || isAmbient) ? 7 : 0;
        ctx.stroke();
        
        requestAnimationFrame(drawWave);
    }
    drawWave();
}

// Browser-native speech fallback (used when the neural TTS server is unreachable)
function speakWithBrowserTTS(text, onDone) {
    if (!('speechSynthesis' in window)) {
        showToast("語音合成服務暫時無法使用，請稍後重試");
        if (onDone) onDone();
        return false;
    }
    try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(String(text).slice(0, 1200));
        utter.lang = 'zh-TW';
        utter.rate = Math.min(1.6, Math.max(0.6, (audioTourState.speed || 1.0) * 0.95));
        const voices = window.speechSynthesis.getVoices() || [];
        const preferFemale = audioTourState.voice !== 'zen-male';
        const zhVoices = voices.filter(v => /zh[-_](TW|HK|CN)/i.test(v.lang) || /Chinese|中文|國語/i.test(v.name));
        const tw = zhVoices.filter(v => /TW/i.test(v.lang));
        const pool = tw.length ? tw : zhVoices;
        let pick = pool.find(v => preferFemale ? /female|Hsiao|Yating|Hanhan|女/i.test(v.name) : /male|Yun|Zhiwei|男/i.test(v.name));
        if (!pick && pool.length) pick = pool[0];
        if (pick) utter.voice = pick;

        utter.onstart = () => { audioTourState.isCardPlaying = true; StudioBgmEngine.setDucking(true); };
        const finish = () => {
            audioTourState.isCardPlaying = false;
            StudioBgmEngine.setDucking(false);
            if (onDone) onDone();
        };
        utter.onend = finish;
        utter.onerror = finish;
        window.speechSynthesis.speak(utter);
        showToast("🎙️ 正在為您朗讀內容（瀏覽器語音）...");
        return true;
    } catch (e) {
        console.error(e);
        if (onDone) onDone();
        return false;
    }
}
if ('speechSynthesis' in window) {
    // Warm up voice list (Chrome loads asynchronously)
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// On-demand dynamic TTS read-aloud for cards
window.readAloudText = function(text, btnElement) {
    if (!text) return;
    
    clearChimeTimer();
    stopCardAudio();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    audioTourState.lastCardText = text;
    audioTourState.lastCardBtn = btnElement || null;

    const voiceSelect = document.getElementById('dockVoiceSelect');
    if (voiceSelect && voiceSelect.value) {
        audioTourState.voice = voiceSelect.value;
    }

    if (StudioBgmEngine.bgmEnabled && StudioBgmEngine.currentTrack !== 'off') {
        StudioBgmEngine.startAmbient(true);
    }

    const originalText = btnElement ? btnElement.innerHTML : '';
    const restoreBtn = () => {
        if (btnElement) {
            btnElement.innerHTML = originalText;
            btnElement.disabled = false;
        }
    };
    if (btnElement) {
        btnElement.innerHTML = '⏳ 語音載入中...';
        btnElement.disabled = true;
    }

    if (audioTourState.isPlaying) {
        audioTourState.audio.pause();
    }
    
    const voice = audioTourState.voice || 'zen-male';
    const url = `/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`;

    const controller = ('AbortController' in window) ? new AbortController() : null;
    const timeoutId = setTimeout(() => { if (controller) controller.abort(); }, 25000);
    
    fetch(url, controller ? { signal: controller.signal } : {})
        .then(res => res.json().catch(() => ({})).then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            clearTimeout(timeoutId);
            restoreBtn();
            if (!ok || !data.url) {
                speakWithBrowserTTS(text);
                return;
            }
            const speechAudio = new Audio(data.url);
            speechAudio.playbackRate = audioTourState.speed || 1.0;
            audioTourState.cardAudio = speechAudio;
            speechAudio.addEventListener('play', () => {
                audioTourState.isCardPlaying = true;
                StudioBgmEngine.setDucking(true);
            });
            speechAudio.addEventListener('ended', () => {
                audioTourState.isCardPlaying = false;
                StudioBgmEngine.setDucking(false);
            });
            speechAudio.addEventListener('pause', () => {
                audioTourState.isCardPlaying = false;
                StudioBgmEngine.setDucking(false);
            });
            speechAudio.addEventListener('error', () => {
                audioTourState.cardAudio = null;
                speakWithBrowserTTS(text);
            });
            const p = speechAudio.play();
            if (p && typeof p.then === 'function') {
                p.then(() => showToast("🎙️ 正在為您朗讀內容..."))
                 .catch(err => {
                     console.warn('Audio play rejected:', err);
                     audioTourState.cardAudio = null;
                     speakWithBrowserTTS(text);
                 });
            }
        })
        .catch(err => {
            clearTimeout(timeoutId);
            console.error(err);
            restoreBtn();
            speakWithBrowserTTS(text);
        });
};

/* ==========================================================================
   3. Stock Specs Explorer (現貨規格即時篩選查詢)
   ========================================================================== */
function initSpecsExplorer() {
    const searchInput = document.getElementById('specsSearchInput');
    const catSelect = document.getElementById('specsCatSelect');
    const groupTabs = document.getElementById('specsGroupTabs');
    const tableBody = document.getElementById('specsTableBody');
    const totalCountEl = document.getElementById('specsTotalCount');
    const pageNumEl = document.getElementById('specsPageNum');
    const prevPageBtn = document.getElementById('specsPrevBtn');
    const nextPageBtn = document.getElementById('specsNextBtn');
    
    if (!tableBody) return;

    let currentPage = 1;
    let totalPages = 1;
    let currentGroup = 'all';
    let debounceTimer;

    function syncGroupTabUI(grp) {
        currentGroup = grp;
        if (groupTabs) {
            groupTabs.querySelectorAll('[data-spec-group]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.specGroup === grp);
            });
        }
    }

    function fetchSpecs(page = 1) {
        currentPage = page;
        const q = searchInput ? searchInput.value.trim() : '';
        const category = catSelect ? catSelect.value : '';

        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: #94a3b8;">🔍 正在檢索官網同步規格資料庫...</td></tr>`;

        fetch(`/api/specs?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&group=${encodeURIComponent(currentGroup)}&page=${page}&per_page=25`)
            .then(res => res.json())
            .then(data => {
                totalPages = data.total_pages || 1;
                if (totalCountEl) totalCountEl.textContent = data.total;
                if (pageNumEl) pageNumEl.textContent = `${data.page} / ${totalPages}`;
                
                if (prevPageBtn) prevPageBtn.disabled = data.page <= 1;
                if (nextPageBtn) nextPageBtn.disabled = data.page >= totalPages;

                if (!data.items || data.items.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: #94a3b8;">找不到符合條件的規格，建議切換上方「全部規格」或輸入厚度、外徑、合金型號（如 5052、6061、7075、FT001、PW5168）。</td></tr>`;
                    return;
                }

                tableBody.innerHTML = data.items.map((item, idx) => {
                    const rowNo = item.no || ((data.page - 1) * 25 + idx + 1);
                    const safeSpec = `${item.category} ${item.material} ${item.dimension} ${item.size}`.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    const badgeStyle = item.group === 'mold'
                        ? 'background:rgba(53,89,122,0.12); color:#2b4c6b; border-color:rgba(53,89,122,0.3);'
                        : '';
                    return `
                    <tr class="spec-row-item">
                        <td data-label="編號" style="color: var(--accent-cinnabar); font-weight:700;">#${rowNo}</td>
                        <td data-label="類別"><span style="font-weight:700; color:var(--text-main);">${item.category}</span></td>
                        <td data-label="材質"><span class="chip" style="color:var(--accent-amber); font-weight:700;">${item.material}</span></td>
                        <td data-label="規格" style="font-weight:600; color:var(--text-main);">${item.dimension || '-'}</td>
                        <td data-label="尺寸">${item.size || '-'}</td>
                        <td data-label="狀態" class="spec-action-cell">
                            <span class="badge-stock" style="${badgeStyle}">${item.note || '現貨庫存'}</span>
                            <button class="btn-outline spec-quote-btn" style="padding:4px 12px; font-size:0.78rem; margin-left:8px; border-radius:6px;" onclick="addSpecToQuote('${safeSpec}')">加入詢價</button>
                        </td>
                    </tr>`;
                }).join('');
            })
            .catch(err => {
                console.error(err);
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color:#ef4444;">資料庫讀取失敗</td></tr>`;
            });
    }

    if (groupTabs) {
        groupTabs.querySelectorAll('[data-spec-group]').forEach(btn => {
            btn.addEventListener('click', () => {
                syncGroupTabUI(btn.dataset.specGroup);
                if (catSelect) catSelect.value = '全部';
                fetchSpecs(1);
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => fetchSpecs(1), 260);
        });
    }

    if (catSelect) {
        catSelect.addEventListener('change', () => {
            const val = catSelect.value;
            if (val !== '全部') {
                syncGroupTabUI(val.startsWith('現有模具') ? 'mold' : 'stock');
            }
            fetchSpecs(1);
        });
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

    window._setSpecsGroupUI = syncGroupTabUI;
    fetchSpecs(1);
}

window.addSpecToQuote = function(specText) {
    const inquiryMaterial = document.getElementById('inquiryMaterial');
    const inquiryMessage = document.getElementById('inquiryMessage');
    
    if (inquiryMaterial) inquiryMaterial.value = specText;
    if (inquiryMessage) inquiryMessage.value = `您好，我需要詢問以下現貨規格的報價與交期：\n【規格】${specText}\n【預計採購數量】\n【加工需求】`;
    
    if (window.navigateToPage) {
        window.navigateToPage('contact', { scrollTarget: 'quoteFormCard' });
    }
    showToast(`📋 已切換至詢價分頁並帶入規格「${specText}」`);
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
   5. Product Filter Tabs & Image Lightbox
   ========================================================================== */
function initProductFilters() {
    const filterBtns = document.querySelectorAll('#products .filter-btn[data-filter]');
    const productCards = document.querySelectorAll('#products .product-card');
    const embossedPanel = document.getElementById('embossedGalleryPanel');

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

            if (embossedPanel) {
                embossedPanel.style.display = (filter === 'all' || filter === '鋁合金板材') ? '' : 'none';
            }
        });
    });
}

window.openImageLightbox = function(src, caption) {
    const modal = document.getElementById('imageLightboxModal');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');
    if (!modal || !img) return;
    img.src = src;
    if (cap) cap.textContent = caption || '';
    modal.classList.add('open');
};

window.closeImageLightbox = function() {
    const modal = document.getElementById('imageLightboxModal');
    if (modal) modal.classList.remove('open');
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.closeImageLightbox();
    }
});

window.quickFilterExtrusion = function(filterCat) {
    const catSelect = document.getElementById('specsCatSelect');
    const searchInput = document.getElementById('specsSearchInput');
    const explorerCard = document.getElementById('specsExplorerCard');
    if (filterCat && catSelect) {
        if (searchInput) searchInput.value = '';
        catSelect.value = filterCat;
        catSelect.dispatchEvent(new Event('change'));
        if (explorerCard) {
            explorerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        showToast(`📐 已切換至「${filterCat}」規格表`);
    }
};

/* ==========================================================================
   6. Contact Form & Quotation Workflow (附圖面拖曳上傳與估價單)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    // Drawing drag & drop setup
    const dropzone = document.getElementById('drawingDropzone');
    const fileInput = document.getElementById('drawingFileInput');
    const badge = document.getElementById('fileSelectedBadge');
    const fileNameEl = document.getElementById('fileSelectedName');
    const fileSizeEl = document.getElementById('fileSelectedSize');
    const removeBtn = document.getElementById('fileRemoveBtn');

    function updateFileDisplay(file) {
        if (!file) {
            if (badge) badge.style.display = 'none';
            if (fileInput) fileInput.value = '';
            return;
        }
        if (badge) badge.style.display = 'flex';
        if (fileNameEl) fileNameEl.textContent = file.name;
        if (fileSizeEl) {
            const kb = (file.size / 1024).toFixed(1);
            fileSizeEl.textContent = file.size > 1048576 ? `(${(file.size / 1048576).toFixed(2)} MB)` : `(${kb} KB)`;
        }
    }

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) {
                updateFileDisplay(fileInput.files[0]);
            }
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateFileDisplay(null);
        });
    }

    if (dropzone) {
        ['dragenter', 'dragover'].forEach(evt => {
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('dragover');
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('dragover');
            });
        });
        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
                fileInput.files = e.dataTransfer.files;
                updateFileDisplay(e.dataTransfer.files[0]);
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '送出中...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        fetch('/api/contact', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            if (data.success) {
                showSuccessModal(data.ticket_id, data.message);
                form.reset();
                updateFileDisplay(null);
            } else {
                showToast("送出失敗：" + (data.error || '未預期錯誤'));
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
    const pdfBtn = document.getElementById('modalPrintPdfBtn');
    if (modal) {
        if (modalMsg) modalMsg.textContent = message;
        if (modalTicket) modalTicket.textContent = `諮詢單號：${ticketId}`;
        if (pdfBtn) {
            pdfBtn.href = `/quotation/${encodeURIComponent(ticketId)}`;
        }
        modal.classList.add('open');
    }
}

window.closeModal = function() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('open');
};

/* ==========================================================================
   7. Seamless Multi-Page SPA Router (無縫分頁切換與獨立網址引擎)
   ========================================================================== */
const PORTAL_PAGES = [
    { id: 'hero', path: '/', short: '首頁總覽', label: '首頁總覽' },
    { id: 'about', path: '/about', short: '關於我們', label: '關於我們 · 成立概要與願景' },
    { id: 'network', path: '/network', short: '服務網絡', label: '全台北中南服務網絡' },
    { id: 'products', path: '/products', short: '旗艦材料', label: '精選旗艦材料與壓花板圖鑑' },
    { id: 'specs', path: '/specs', short: '現貨規格', label: '現貨規格與現有模具檢索' },
    { id: 'machining', path: '/machining', short: '精密加工', label: '高階精密加工與實品圖鑑' },
    { id: 'cases', path: '/cases', short: '代表實績', label: '半導體與航太代表實績' },
    { id: 'tech', path: '/tech', short: '技術硬度', label: '國際硬度換算與熱處理辭典' },
    { id: 'contact', path: '/contact', short: '聯絡諮詢', label: '即時諮詢與線上圖面估價' }
];

function initPageRouter() {
    function resolveFromUrl() {
        const hashId = (window.location.hash || '').replace(/^#/, '').trim();
        if (hashId && PORTAL_PAGES.some(p => p.id === hashId)) {
            return { pageId: hashId, replaceUrl: true };
        }
        const cleanPath = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
        const matched = PORTAL_PAGES.find(p => p.path === cleanPath);
        if (matched) {
            return { pageId: matched.id, replaceUrl: false };
        }
        return { pageId: window.INITIAL_PAGE || 'hero', replaceUrl: false };
    }

    window.navigateToPage = function(targetId, opts = {}) {
        const idx = PORTAL_PAGES.findIndex(p => p.id === targetId);
        const safeIdx = idx >= 0 ? idx : 0;
        const page = PORTAL_PAGES[safeIdx];
        const pageId = page.id;

        // 1. Toggle active page view cleanly
        document.querySelectorAll('.page-view').forEach(sec => {
            const isMatch = sec.getAttribute('data-page-view') === pageId;
            sec.classList.toggle('active-page', isMatch);
        });

        // 2. Sync active state across navbar, mobile drawer, and subpage pill strip
        document.querySelectorAll('.nav-item[data-nav-page], .mobile-nav-link[data-nav-page], .subpage-pill[data-nav-page]').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-nav-page') === pageId);
        });

        // 3. Center active pill horizontally inside subpage strip without affecting vertical scroll
        const strip = document.getElementById('subpagePillStrip');
        const activePill = strip ? strip.querySelector(`.subpage-pill[data-nav-page="${pageId}"]`) : null;
        if (strip && activePill) {
            const targetLeft = activePill.offsetLeft - (strip.clientWidth / 2) + (activePill.offsetWidth / 2);
            strip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
        }

        // 4. Update subpage breadcrumb & sequential bottom pager
        const isSubpage = pageId !== 'hero';
        const topBar = document.getElementById('subpageTopBar');
        const pagerBar = document.getElementById('subpagePagerBar');
        const crumbLabel = document.getElementById('subpageCrumbLabel');
        const prevBtn = document.getElementById('pagerPrevBtn');
        const nextBtn = document.getElementById('pagerNextBtn');

        if (topBar) topBar.classList.toggle('visible', isSubpage);
        if (pagerBar) pagerBar.classList.toggle('visible', isSubpage);

        const metaObj = (window.ALL_PAGES_META && window.ALL_PAGES_META[pageId]) || null;
        if (crumbLabel) {
            crumbLabel.textContent = (metaObj && metaObj.label) ? metaObj.label : page.label;
        }
        if (metaObj && metaObj.title) {
            document.title = metaObj.title;
        }

        if (isSubpage && prevBtn && nextBtn) {
            const prevPage = PORTAL_PAGES[safeIdx - 1] || PORTAL_PAGES[0];
            const nextPage = PORTAL_PAGES[safeIdx + 1] || PORTAL_PAGES[3]; // Wrap after contact to products
            prevBtn.href = prevPage.path;
            prevBtn.setAttribute('data-nav-page', prevPage.id);
            prevBtn.textContent = prevPage.id === 'hero'
                ? '← 返回首頁總覽'
                : `← 上一頁：${prevPage.short}`;

            nextBtn.href = nextPage.path;
            nextBtn.setAttribute('data-nav-page', nextPage.id);
            nextBtn.textContent = `下一頁：${nextPage.short} →`;
        }

        // 5. Push or replace clean URL in browser history
        if (!opts.skipHistory) {
            const currentClean = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
            if (opts.replace) {
                window.history.replaceState({ pageId }, document.title, page.path);
            } else if (currentClean !== page.path || window.location.hash) {
                window.history.pushState({ pageId }, document.title, page.path);
            }
        }

        // 6. Close mobile drawer if open
        if (window.closeMobileMenu) {
            window.closeMobileMenu();
        }

        // 7. Scroll to top or specific target element
        if (opts.scrollTarget) {
            requestAnimationFrame(() => {
                const targetEl = document.getElementById(opts.scrollTarget);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                }
            });
        } else if (!opts.preserveScroll) {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    };

    // Intercept internal [data-nav-page] clicks for 0ms SPA transition
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-nav-page]');
        if (!link) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (typeof e.button === 'number' && e.button !== 0)) {
            return;
        }
        e.preventDefault();
        const targetId = link.getAttribute('data-nav-page');
        window.navigateToPage(targetId);
    });

    // Support browser Back / Forward buttons seamlessly
    window.addEventListener('popstate', (e) => {
        const stateId = e.state && e.state.pageId;
        const resolved = stateId || resolveFromUrl().pageId;
        window.navigateToPage(resolved, { skipHistory: true });
    });

    // Initial hydration (handles direct URLs AND legacy #hash links)
    const initial = resolveFromUrl();
    window.navigateToPage(initial.pageId, {
        replace: initial.replaceUrl,
        skipHistory: !initial.replaceUrl,
        preserveScroll: !initial.replaceUrl
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


/* ==========================================================================
   FAPO AI Customer Service & Google OR-Tools CP-SAT Interactive Client
   ========================================================================== */

window.toggleAiChatWidget = function() {
    const widget = document.getElementById('aiChatWidget');
    if (!widget) return;
    widget.classList.toggle('open');
    if (widget.classList.contains('open')) {
        const inp = document.getElementById('aiChatInput');
        if (inp) setTimeout(() => inp.focus(), 120);
    }
};

window.switchAiMode = function(mode) {
    const btnChat = document.getElementById('aiTabBtnChat');
    const btnCpsat = document.getElementById('aiTabBtnCpsat');
    const panelChat = document.getElementById('aiPanelChat');
    const panelCpsat = document.getElementById('aiPanelCpsat');
    if (!panelChat || !panelCpsat) return;

    if (mode === 'cpsat') {
        btnChat.classList.remove('active');
        btnCpsat.classList.add('active');
        panelChat.style.display = 'none';
        panelCpsat.style.display = 'flex';
    } else {
        btnCpsat.classList.remove('active');
        btnChat.classList.add('active');
        panelCpsat.style.display = 'none';
        panelChat.style.display = 'flex';
    }
};

function formatAiMarkdown(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code style="background:rgba(182,59,46,0.1);color:var(--accent-cinnabar);padding:1px 5px;border-radius:4px;font-weight:700;">$1</code>')
        .replace(/\n/g, '<br>');
}

window.sendAiQuickPrompt = function(promptText) {
    const inp = document.getElementById('aiChatInput');
    if (inp) {
        inp.value = promptText;
        sendAiChatMessage();
    }
};

window.sendAiChatMessage = function() {
    const inp = document.getElementById('aiChatInput');
    const box = document.getElementById('aiChatMessages');
    if (!inp || !box) return;

    const text = inp.value.trim();
    if (!text) return;
    inp.value = '';

    // Append user bubble
    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg ai-msg-user';
    userDiv.innerHTML = `<div class="ai-msg-bubble">${formatAiMarkdown(text)}</div>`;
    box.appendChild(userDiv);
    box.scrollTop = box.scrollHeight;

    // Append loading bubble
    const botDiv = document.createElement('div');
    botDiv.className = 'ai-msg ai-msg-bot';
    botDiv.innerHTML = `<div class="ai-msg-bubble">⏳ 正在智慧檢索規格與計算最佳方案...</div>`;
    box.appendChild(botDiv);
    box.scrollTop = box.scrollHeight;

    fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
    .then(r => r.json())
    .then(data => {
        let html = `<div class="ai-msg-bubble">${formatAiMarkdown(data.reply || '')}`;

        if (data.specs && data.specs.length > 0) {
            html += `<div class="ai-spec-cards">`;
            data.specs.forEach(s => {
                const safeSpec = `${s.category} ${s.material} ${s.dimension || ''} ${s.size || ''}`.replace(/'/g, "\'");
                html += `
                    <div class="ai-spec-mini-card">
                        <div class="ai-spec-mini-info">
                            <strong>${s.material} · ${s.dimension || '-'}</strong>
                            <span>${s.category} (${s.size || '常備規格'})</span>
                        </div>
                        <button type="button" class="ai-spec-mini-btn" onclick="addSpecToQuote('${safeSpec}')">＋詢價</button>
                    </div>
                `;
            });
            html += `</div>`;
        }

        if (data.cutting_plan && data.cutting_plan.success) {
            const p = data.cutting_plan;
            const quoteSummary = `[最佳化裁切需求] 母材 ${p.stock_length_mm}mm 共需 ${p.total_bars_used} 支 (利用率 ${p.overall_utilization_pct}%): ` +
                p.bars_plan.map(b => `第${b.bar_no}支(${b.cuts_summary})`).join('；');
            const safeQuote = quoteSummary.replace(/'/g, "\'");
            html += `
                <div style="margin-top:10px;">
                    <button type="button" class="ai-spec-mini-btn" style="width:100%;padding:7px;" onclick="addSpecToQuote('${safeQuote}')">
                        📋 將此最佳裁切方案加入詢價單
                    </button>
                </div>
            `;
        }

        const voiceText = data.voice_script || (data.reply || '').replace(/[*`#|•📍✅📦🧮📋💡☎️]/g, '').replace(/\[.*?\]\(.*?\)/g, '').trim().substring(0, 300);
        const safeVoiceText = voiceText.replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, ' ');
        html += `
            <div style="margin-top:8px;">
                <button type="button" class="ai-bubble-audio-btn" onclick="readAloudText('${safeVoiceText}', this)" title="播放擬人化語音解說">
                    🔊 聽取 AI 語音解說
                </button>
            </div>
        `;

        html += `</div>`;
        botDiv.innerHTML = html;
        box.scrollTop = box.scrollHeight;
    })
    .catch(() => {
        botDiv.innerHTML = `<div class="ai-msg-bubble">⚠️ 連線發生異常，請稍後再試。</div>`;
    });
};

window.addCpsatDemandRow = function() {
    const list = document.getElementById('cpsatDemandList');
    if (!list) return;
    const row = document.createElement('div');
    row.className = 'cpsat-demand-row';
    row.innerHTML = `
        <input type="number" class="cpsat-len-input" value="500" placeholder="長度 mm" min="10">
        <span>×</span>
        <input type="number" class="cpsat-qty-input" value="2" placeholder="支數" min="1">
        <button type="button" class="cpsat-del-btn" onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(row);
};

window.runInteractiveCpsatSolver = function() {
    const stockLen = parseInt(document.getElementById('cpsatStockLen')?.value || '3000', 10);
    const kerf = parseInt(document.getElementById('cpsatKerf')?.value || '3', 10);
    const rows = document.querySelectorAll('#cpsatDemandList .cpsat-demand-row');
    const resBox = document.getElementById('cpsatResultBox');
    const solveBtn = document.getElementById('cpsatSolveBtn');

    if (!resBox) return;

    const demands = [];
    rows.forEach(r => {
        const l = parseInt(r.querySelector('.cpsat-len-input')?.value || '0', 10);
        const q = parseInt(r.querySelector('.cpsat-qty-input')?.value || '0', 10);
        if (l > 0 && q > 0) demands.push({ length: l, qty: q });
    });

    resBox.style.display = 'block';
    resBox.innerHTML = `⏳ 正在執行最佳化下料運算...`;
    if (solveBtn) solveBtn.disabled = true;

    fetch('/api/ai/cutting-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            stock_length_mm: stockLen,
            kerf_mm: kerf,
            demands: demands
        })
    })
    .then(r => r.json())
    .then(plan => {
        if (solveBtn) solveBtn.disabled = false;
        if (!plan.success) {
            resBox.innerHTML = `<div style="color:#b91c1c;font-weight:700;">❌ ${plan.error || '求解失敗'}</div>`;
            return;
        }

        let barsHtml = '';
        const colorPalette = ['#b83b26', '#1d4ed8', '#059669', '#d97706', '#7c3aed', '#0891b2', '#c026d3'];

        plan.bars_plan.forEach(b => {
            const stockL = plan.stock_length_mm;
            let svgElements = '';
            
            // Background track representing the mother standard bar
            svgElements += `<rect x="0" y="2" width="1000" height="38" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />`;

            if (b.segments && b.segments.length > 0) {
                b.segments.forEach(seg => {
                    const x = (seg.start_mm / stockL) * 1000;
                    const w = Math.max(1.2, (seg.length_mm / stockL) * 1000);
                    if (seg.type === 'piece') {
                        const col = colorPalette[Math.abs(seg.length_mm * 11 + seg.index) % colorPalette.length];
                        svgElements += `
                            <g class="cpsat-svg-piece">
                                <rect x="${x.toFixed(1)}" y="4" width="${w.toFixed(1)}" height="34" rx="2" fill="${col}">
                                    <title>工件 #${seg.index}：長度 ${seg.length_mm} mm (位置 ${seg.start_mm} ~ ${seg.end_mm} mm)</title>
                                </rect>
                                ${w > 36 ? `<text x="${(x + w/2).toFixed(1)}" y="25" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle" pointer-events="none">${seg.length_mm}</text>` : ''}
                            </g>
                        `;
                    } else if (seg.type === 'kerf') {
                        const kw = Math.max(1.8, w);
                        svgElements += `
                            <rect x="${x.toFixed(1)}" y="2" width="${kw.toFixed(1)}" height="38" fill="#ef4444">
                                <title>鋸縫損耗：${seg.length_mm} mm</title>
                            </rect>
                        `;
                    } else if (seg.type === 'remnant') {
                        svgElements += `
                            <g class="cpsat-svg-remnant">
                                <rect x="${x.toFixed(1)}" y="4" width="${w.toFixed(1)}" height="34" rx="2" fill="rgba(148,163,184,0.2)" stroke="#94a3b8" stroke-dasharray="3,2">
                                    <title>可用餘料：${seg.length_mm} mm (${((seg.length_mm / stockL) * 100).toFixed(1)}%)</title>
                                </rect>
                                ${w > 45 ? `<text x="${(x + w/2).toFixed(1)}" y="25" fill="#475569" font-size="10" font-weight="700" text-anchor="middle" pointer-events="none">餘 ${seg.length_mm}mm</text>` : ''}
                            </g>
                        `;
                    }
                });
            } else {
                let segsHtml = '';
                b.cuts.forEach((c, idx) => {
                    const pct = Math.max(8, Math.round(((c.length * c.count) / plan.stock_length_mm) * 100));
                    const bgColors = ['#a83327', '#b87b28', '#2b5b84', '#3d7a5a'];
                    const bg = bgColors[idx % bgColors.length];
                    segsHtml += `<div class="cpsat-seg" style="width:${pct}%;background:${bg};" title="${c.label}">${c.length}×${c.count}</div>`;
                });
                if (b.remnant_mm > 0) {
                    const remPct = Math.max(6, Math.round((b.remnant_mm / plan.stock_length_mm) * 100));
                    segsHtml += `<div class="cpsat-seg-rem" style="width:${remPct}%;" title="餘料 ${b.remnant_mm}mm">餘${b.remnant_mm}</div>`;
                }
                svgElements = segsHtml;
            }

            barsHtml += `
                <div style="margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:0.78rem;margin-bottom:3px;">
                        <span>母材 #${b.bar_no}：${b.cuts_summary}</span>
                        <span style="color:var(--accent-cinnabar);background:rgba(182,59,46,0.08);padding:2px 6px;border-radius:4px;">利用率 ${b.utilization_pct}% (餘 ${b.remnant_mm}mm)</span>
                    </div>
                    <div class="cpsat-svg-wrap">
                        <svg class="cpsat-svg-bar" viewBox="0 0 1000 44" preserveAspectRatio="none">
                            ${svgElements}
                        </svg>
                        <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;font-family:monospace;margin-top:2px;padding:0 2px;">
                            <span>0 mm</span>
                            <span style="color:#ef4444;">紅線: 鋸縫 ${plan.kerf_mm}mm</span>
                            <span>${stockL} mm (滿料)</span>
                        </div>
                    </div>
                </div>
            `;
        });

        const quoteSummary = `[最佳化裁切需求] 母材 ${plan.stock_length_mm}mm 共需 ${plan.total_bars_used} 支 (利用率 ${plan.overall_utilization_pct}%): ` +
            plan.bars_plan.map(b => `第${b.bar_no}支(${b.cuts_summary})`).join('；');
        const safeQuote = quoteSummary.replace(/'/g, "\'");

        const speechComm = plan.speech_commentary || `母材 ${plan.stock_length_mm}mm 最少需用 ${plan.total_bars_used} 支，材料利用率達 ${plan.overall_utilization_pct}%。`;
        const safeCommentary = speechComm.replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, ' ');

        resBox.innerHTML = `
            <div style="margin-bottom:10px;border-bottom:1px solid rgba(180,160,120,0.35);padding-bottom:8px;">
                <div style="font-weight:800;color:var(--accent-cinnabar);font-size:0.86rem;">
                    ✅ ${plan.solver_status}（耗時 ${plan.solve_time_ms} ms）
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">
                    <div>最少需用母材：<strong>${plan.total_bars_used} 支</strong></div>
                    <div>總材料利用率：<strong>${plan.overall_utilization_pct}%</strong></div>
                    <div>總裁切段數：<strong>${plan.total_pieces_cut} 支</strong></div>
                    <div>總餘料長度：<strong>${plan.total_remnant_mm} mm</strong></div>
                </div>
            </div>
            <button type="button" class="ai-bubble-audio-btn" style="width:100%;justify-content:center;padding:8px;background:var(--accent-cinnabar);color:#ffffff;border-color:var(--accent-cinnabar);font-size:0.8rem;margin-bottom:10px;" onclick="readAloudText('${safeCommentary}', this)">
                🔊 聽取 AI 工程師解說排版方案
            </button>
            ${barsHtml}
            <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
                <button type="button" class="ai-spec-mini-btn" style="width:100%;padding:8px;" onclick="addSpecToQuote('${safeQuote}')">
                    📋 將此最佳裁切明細帶入詢價單
                </button>
                <button type="button" class="ai-spec-mini-btn" style="width:100%;padding:8px;background:#1e293b;color:#ffffff;" onclick="window.open('/quotation/preview?material=' + encodeURIComponent('母材 ${plan.stock_length_mm}mm 定寸最佳化裁切方案 (${plan.total_bars_used} 支)') + '&message=' + encodeURIComponent('${safeQuote}') + '&qty=${plan.total_bars_used}', '_blank')">
                    📄 匯出此裁切工單 (PDF / 列印)
                </button>
            </div>
        `;
    })
    .catch(() => {
        if (solveBtn) solveBtn.disabled = false;
        resBox.innerHTML = `<div style="color:#b91c1c;">⚠️ 求解器連線異常</div>`;
    });
};

/* ==========================================================================
   AI Voice Speech Recognition (語音輸入與對話模式)
   ========================================================================== */
let aiSpeechRecognition = null;
let isAiListening = false;

window.toggleAiVoiceRecognition = function() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const btn = document.getElementById('aiVoiceInputBtn');
    const input = document.getElementById('aiChatInput');

    if (!SpeechRec) {
        showToast("您的瀏覽器暫未支援語音辨識，請使用文字鍵盤輸入。");
        return;
    }

    if (isAiListening && aiSpeechRecognition) {
        aiSpeechRecognition.stop();
        return;
    }

    try {
        aiSpeechRecognition = new SpeechRec();
        aiSpeechRecognition.lang = 'zh-TW';
        aiSpeechRecognition.continuous = false;
        aiSpeechRecognition.interimResults = true;

        aiSpeechRecognition.onstart = function() {
            isAiListening = true;
            if (btn) btn.classList.add('listening');
            if (input) input.placeholder = '🎙️ 正在聆聽，請說出規格或裁切尺寸...';
        };

        aiSpeechRecognition.onresult = function(e) {
            let transcript = '';
            for (let i = e.resultIndex; i < e.results.length; ++i) {
                transcript += e.results[i][0].transcript;
            }
            if (input) input.value = transcript;
        };

        aiSpeechRecognition.onerror = function(e) {
            console.warn('Speech rec error:', e);
            if (btn) btn.classList.remove('listening');
            isAiListening = false;
            if (input) input.placeholder = '輸入或以語音說出規格需求、裁切尺寸...';
        };

        aiSpeechRecognition.onend = function() {
            isAiListening = false;
            if (btn) btn.classList.remove('listening');
            if (input) {
                input.placeholder = '輸入或以語音說出規格需求、裁切尺寸...';
                if (input.value.trim().length > 0) {
                    sendAiChatMessage();
                }
            }
        };

        aiSpeechRecognition.start();
    } catch (err) {
        console.error('Failed to start speech rec:', err);
        if (btn) btn.classList.remove('listening');
        isAiListening = false;
        showToast("啟動麥克風失敗，請確認已授權瀏覽器麥克風權限");
    }
};


/* ==========================================================================
   Industrial Metal Weight & Volume Calculator
   ========================================================================== */

window.updateWeightShapeInputs = function() {
    const shape = document.getElementById('wtShapeSelect')?.value || 'plate';
    const d1Wrap = document.getElementById('wtDim1Wrap');
    const d2Wrap = document.getElementById('wtDim2Wrap');
    const d3Wrap = document.getElementById('wtDim3Wrap');
    const d1Label = document.getElementById('wtDim1Label');
    const d2Label = document.getElementById('wtDim2Label');
    const d3Label = document.getElementById('wtDim3Label');
    const d1Input = document.getElementById('wtDim1');
    const d2Input = document.getElementById('wtDim2');
    const d3Input = document.getElementById('wtDim3');
    const lenInput = document.getElementById('wtLength');
    const presetRow = document.getElementById('wtPresetRow');
    const formulaDesc = document.getElementById('wtFormulaDesc');

    if (!d1Wrap || !d2Wrap || !d3Wrap) return;

    if (shape === 'plate') {
        d1Label.textContent = '厚度 T (mm)：';
        d2Wrap.style.display = '';
        d2Label.textContent = '寬度 W (mm)：';
        d3Wrap.style.display = 'none';
        if (presetRow) presetRow.style.display = 'flex';
        if (formulaDesc) formulaDesc.textContent = '計算公式：厚(mm) × 寬(mm) × 長(mm) × 比重 ÷ 1,000,000';
    } else if (shape === 'round_bar') {
        d1Label.textContent = '外徑 D (mm)：';
        d1Input.value = '50';
        lenInput.value = '3000';
        d2Wrap.style.display = 'none';
        d3Wrap.style.display = 'none';
        if (presetRow) presetRow.style.display = 'none';
        if (formulaDesc) formulaDesc.textContent = '計算公式：π × (外徑/2)² × 長(mm) × 比重 ÷ 1,000,000';
    } else if (shape === 'round_tube') {
        d1Label.textContent = '外徑 OD (mm)：';
        d1Input.value = '60';
        d2Wrap.style.display = 'none';
        d3Wrap.style.display = '';
        d3Label.textContent = '管壁厚 t (mm)：';
        d3Input.value = '5';
        lenInput.value = '3000';
        if (presetRow) presetRow.style.display = 'none';
        if (formulaDesc) formulaDesc.textContent = '計算公式：π × ((外徑/2)² - (內徑/2)²) × 長(mm) × 比重 ÷ 1,000,000';
    } else if (shape === 'square_bar') {
        d1Label.textContent = '四方邊寬 W (mm)：';
        d1Input.value = '40';
        lenInput.value = '3000';
        d2Wrap.style.display = 'none';
        d3Wrap.style.display = 'none';
        if (presetRow) presetRow.style.display = 'none';
        if (formulaDesc) formulaDesc.textContent = '計算公式：邊寬² × 長(mm) × 比重 ÷ 1,000,000';
    } else if (shape === 'hex_bar') {
        d1Label.textContent = '六角對邊 D (mm)：';
        d1Input.value = '30';
        lenInput.value = '3000';
        d2Wrap.style.display = 'none';
        d3Wrap.style.display = 'none';
        if (presetRow) presetRow.style.display = 'none';
        if (formulaDesc) formulaDesc.textContent = '計算公式：0.866025 × 對邊² × 長(mm) × 比重 ÷ 1,000,000';
    } else if (shape === 'rect_tube') {
        d1Label.textContent = '管寬 W (mm)：';
        d1Input.value = '60';
        d2Wrap.style.display = '';
        d2Label.textContent = '管高 H (mm)：';
        d2Input.value = '40';
        d3Wrap.style.display = '';
        d3Label.textContent = '管壁厚 t (mm)：';
        d3Input.value = '3';
        lenInput.value = '3000';
        if (presetRow) presetRow.style.display = 'none';
        if (formulaDesc) formulaDesc.textContent = '計算公式：(W×H - (W-2t)×(H-2t)) × 長(mm) × 比重 ÷ 1,000,000';
    }
    calculateMetalWeight();
};

window.applyPlatePreset = function(w, l) {
    const d2 = document.getElementById('wtDim2');
    const len = document.getElementById('wtLength');
    if (d2) d2.value = w;
    if (len) len.value = l;
    calculateMetalWeight();
};

window.calculateMetalWeight = function() {
    const alloyRaw = document.getElementById('wtAlloySelect')?.value || '2.70|6061';
    const density = parseFloat(alloyRaw.split('|')[0]) || 2.70;
    const shape = document.getElementById('wtShapeSelect')?.value || 'plate';
    const d1 = Math.max(0, parseFloat(document.getElementById('wtDim1')?.value || '0'));
    const d2 = Math.max(0, parseFloat(document.getElementById('wtDim2')?.value || '0'));
    const d3 = Math.max(0, parseFloat(document.getElementById('wtDim3')?.value || '0'));
    const length = Math.max(0, parseFloat(document.getElementById('wtLength')?.value || '0'));
    const qty = Math.max(1, parseInt(document.getElementById('wtQty')?.value || '1', 10));

    let areaMm2 = 0;
    if (shape === 'plate') {
        areaMm2 = d1 * d2;
    } else if (shape === 'round_bar') {
        areaMm2 = Math.PI * Math.pow(d1 / 2, 2);
    } else if (shape === 'round_tube') {
        const od = d1;
        const id = Math.max(0, od - 2 * d3);
        areaMm2 = Math.PI * (Math.pow(od / 2, 2) - Math.pow(id / 2, 2));
    } else if (shape === 'square_bar') {
        areaMm2 = d1 * d1;
    } else if (shape === 'hex_bar') {
        areaMm2 = (Math.sqrt(3) / 2) * d1 * d1;
    } else if (shape === 'rect_tube') {
        const innerW = Math.max(0, d1 - 2 * d3);
        const innerH = Math.max(0, d2 - 2 * d3);
        areaMm2 = (d1 * d2) - (innerW * innerH);
    }

    const volumeCm3 = (areaMm2 * length) / 1000.0;
    const singleKg = (areaMm2 * length * density) / 1000000.0;
    const perMeterKg = (areaMm2 * 1000.0 * density) / 1000000.0;
    const totalKg = singleKg * qty;

    const elSingle = document.getElementById('wtSingleKg');
    const elMeter = document.getElementById('wtPerMeterKg');
    const elVol = document.getElementById('wtVolumeCm3');
    const elTotal = document.getElementById('wtTotalKg');

    if (elSingle) elSingle.textContent = `${singleKg.toFixed(2)} kg`;
    if (elMeter) elMeter.textContent = `${perMeterKg.toFixed(2)} kg/m`;
    if (elVol) elVol.textContent = `${Math.round(volumeCm3).toLocaleString()} cm³`;
    if (elTotal) elTotal.textContent = `${totalKg.toFixed(2)} kg`;
};

window.addCalculatedWeightToQuote = function() {
    const alloyRaw = document.getElementById('wtAlloySelect')?.value || '2.70|6061 鋁合金';
    const alloyName = alloyRaw.split('|')[1] || '6061 鋁合金';
    const shape = document.getElementById('wtShapeSelect')?.value || 'plate';
    const d1 = document.getElementById('wtDim1')?.value || '0';
    const d2 = document.getElementById('wtDim2')?.value || '0';
    const d3 = document.getElementById('wtDim3')?.value || '0';
    const length = document.getElementById('wtLength')?.value || '0';
    const qty = document.getElementById('wtQty')?.value || '1';
    const totalTxt = document.getElementById('wtTotalKg')?.textContent || '';

    let dimStr = '';
    if (shape === 'plate') dimStr = `鋁板/扁條 厚${d1} × 寬${d2} × 長${length}mm`;
    else if (shape === 'round_bar') dimStr = `圓棒 φ${d1} × 長${length}mm`;
    else if (shape === 'round_tube') dimStr = `圓管 OD${d1} × 壁厚${d3} × 長${length}mm`;
    else if (shape === 'square_bar') dimStr = `四方條 ${d1}×${d1} × 長${length}mm`;
    else if (shape === 'hex_bar') dimStr = `六角條 對邊${d1} × 長${length}mm`;
    else if (shape === 'rect_tube') dimStr = `方矩管 ${d1}×${d2}×壁厚${d3} × 長${length}mm`;

    const summary = `[算料詢價] ${alloyName} · ${dimStr} × ${qty}件 (預估總重 ${totalTxt})`;
    if (typeof window.addSpecToQuote === 'function') {
        window.addSpecToQuote(summary);
    }
};

window.exportCalculatedWeightToPdf = function() {
    const alloyRaw = document.getElementById('wtAlloySelect')?.value || '2.70|6061 鋁合金';
    const alloyName = alloyRaw.split('|')[1] || '6061 鋁合金';
    const shape = document.getElementById('wtShapeSelect')?.value || 'plate';
    const d1 = document.getElementById('wtDim1')?.value || '0';
    const d2 = document.getElementById('wtDim2')?.value || '0';
    const d3 = document.getElementById('wtDim3')?.value || '0';
    const length = document.getElementById('wtLength')?.value || '0';
    const qty = document.getElementById('wtQty')?.value || '1';
    const singleTxt = document.getElementById('wtSingleKg')?.textContent || '—';
    const totalTxt = document.getElementById('wtTotalKg')?.textContent || '—';

    let dimStr = '';
    if (shape === 'plate') dimStr = `厚 ${d1}mm × 寬 ${d2}mm × 長 ${length}mm`;
    else if (shape === 'round_bar') dimStr = `圓棒 φ${d1}mm × 長 ${length}mm`;
    else if (shape === 'round_tube') dimStr = `圓管 外徑φ${d1}mm × 壁厚${d3}mm × 長 ${length}mm`;
    else if (shape === 'square_bar') dimStr = `四方條 ${d1}×${d1}mm × 長 ${length}mm`;
    else if (shape === 'hex_bar') dimStr = `六角條 對邊${d1}mm × 長 ${length}mm`;
    else if (shape === 'rect_tube') dimStr = `方矩管 ${d1}×${d2}mm × 壁厚${d3}mm × 長 ${length}mm`;

    const mat = `${alloyName} · ${dimStr}`;
    const msg = `需求數量 ${qty} 件，單件重量約 ${singleTxt}，整批預估總重約 ${totalTxt}。`;
    const url = `/quotation/preview?material=${encodeURIComponent(mat)}&message=${encodeURIComponent(msg)}&qty=${encodeURIComponent(qty)}&weight=${encodeURIComponent(totalTxt)}&alloy=${encodeURIComponent(alloyName)}`;
    window.open(url, '_blank');
};
