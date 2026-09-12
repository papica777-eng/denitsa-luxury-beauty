/* ==========================================================================
   DENITSA LUXURY STUDIO — INTERACTIVE CORE ENGINE (app.js)
   Haute Couture Lashes, Brows, Slavic Raw Hair & Head Spa
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
    }

    playChime(freq = 880, type = 'sine', duration = 0.25, gainVal = 0.05) {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio error silent fallback
      }
    }

    playLuxuryClick() {
      this.playChime(520, 'triangle', 0.12, 0.04);
    }

    playSparkle() {
      this.playChime(1046.5, 'sine', 0.35, 0.06);
      setTimeout(() => this.playChime(1318.5, 'sine', 0.35, 0.05), 80);
      setTimeout(() => this.playChime(1567.98, 'sine', 0.45, 0.05), 160);
    }

    playWaterDrop() {
      this.playChime(600, 'sine', 0.2, 0.03);
    }
  }

  const sound = new SoundEngine();

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      if (sound.enabled) {
        sound.playSparkle();
        soundIcon.setAttribute('data-lucide', 'volume-2');
      } else {
        soundIcon.setAttribute('data-lucide', 'volume-x');
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // --- CUSTOM CURSOR (Desktop) ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('button, a, input, select, .cursor-pointer').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorOutline.style.borderColor = 'rgba(250, 204, 21, 0.9)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'rgba(212, 175, 55, 0.6)';
      });
    });
  }

  // --- MOBILE MENU ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // --- HERO PARTICLES CANVAS ---
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width, height;
    let particles = [];

    function resizeHeroCanvas() {
      if (!heroCanvas.parentElement) return;
      width = heroCanvas.width = heroCanvas.parentElement.offsetWidth;
      height = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
    }
    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        color: i % 3 === 0 ? '#fde047' : (i % 3 === 1 ? '#d4af37' : '#ffffff'),
        alpha: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.15,
        pulse: Math.random() * Math.PI
      });
    }

    function renderHeroParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.03;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      requestAnimationFrame(renderHeroParticles);
    }
    renderHeroParticles();
  }

  // ==========================================================================
  // 1. SLAVIC HAIR CONFIGURATOR & PHOTO THUMBNAILS
  // ==========================================================================
  const hairConfigState = {
    origin: 'slavic',
    length: 55,
    weight: 150,
    colorHex: '#2a1d17',
    colorName: '#2 Тъмен Шоколад',
    method: 'keratin',
    basePricePerGram: {
      slavic: 2.8,
      russian: 2.2,
      brazilian: 1.6
    },
    methodFees: {
      keratin: 120,
      tapes: 100,
      wefts: 90,
      nanorings: 130
    }
  };

  // Hair Photo Thumbnail Switcher
  const hairDisplayImg = document.getElementById('hairDisplayImg');
  const hairThumbBtns = document.querySelectorAll('.hair-thumb-btn');
  hairThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hairThumbBtns.forEach(b => {
        b.classList.remove('border-2', 'border-gold-400', 'active');
        b.classList.add('border', 'border-white/10');
      });
      btn.classList.add('border-2', 'border-gold-400', 'active');
      btn.classList.remove('border-white/10');
      if (hairDisplayImg) {
        hairDisplayImg.src = btn.dataset.img;
      }
      sound.playLuxuryClick();
    });
  });

  function updateHairConfigurator() {
    // 1. Calculate Price
    const rate = hairConfigState.basePricePerGram[hairConfigState.origin];
    const lengthMultiplier = 1 + (hairConfigState.length - 40) * 0.02;
    const rawHairPrice = Math.round(hairConfigState.weight * rate * lengthMultiplier);
    const methodPrice = hairConfigState.methodFees[hairConfigState.method];
    const totalPrice = rawHairPrice + methodPrice;

    // 2. Update UI Displays
    const priceDisplay = document.getElementById('calculatedPrice');
    if (priceDisplay) priceDisplay.textContent = `${totalPrice} лв.`;

    const lengthDisplay = document.getElementById('lengthValueDisplay');
    if (lengthDisplay) lengthDisplay.textContent = `${hairConfigState.length} см (${hairConfigState.length > 60 ? 'Ханш / Бедра' : 'Талия / Гръб'})`;

    const weightDisplay = document.getElementById('weightValueDisplay');
    if (weightDisplay) weightDisplay.textContent = `${hairConfigState.weight} грама (${hairConfigState.weight >= 200 ? 'Mega Плътен Обем' : 'Стандартен Пълен Обем'})`;

    const simShadeName = document.getElementById('simShadeName');
    if (simShadeName) simShadeName.textContent = hairConfigState.colorName;

    const selectedShadeLabel = document.getElementById('selectedShadeLabel');
    if (selectedShadeLabel) selectedShadeLabel.textContent = hairConfigState.colorName;

    const simHairTitle = document.getElementById('simHairTitle');
    const originNames = {
      slavic: '100% Славянска Коса',
      russian: 'Руска Девствена Коса',
      brazilian: 'Бразилска Remy Коприна'
    };
    if (simHairTitle) {
      simHairTitle.textContent = `${originNames[hairConfigState.origin]} • ${hairConfigState.length}см`;
    }

    const originLabel = document.getElementById('originLabel');
    if (originLabel) originLabel.textContent = originNames[hairConfigState.origin];

    const simMethodName = document.getElementById('simMethodName');
    const methodDescriptions = {
      keratin: 'Кератинови микро-капсули',
      tapes: 'Безшевни Стикери (Tape-in)',
      wefts: 'Треси на клипси / Зашиване',
      nanorings: 'Нано Рингове'
    };
    if (simMethodName) simMethodName.textContent = methodDescriptions[hairConfigState.method];
  }

  // Origin Selectors
  document.querySelectorAll('#originSelector button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#originSelector button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hairConfigState.origin = btn.dataset.origin;
      sound.playLuxuryClick();
      updateHairConfigurator();
    });
  });

  // Length Slider
  const hairLengthSlider = document.getElementById('hairLengthSlider');
  if (hairLengthSlider) {
    hairLengthSlider.addEventListener('input', (e) => {
      hairConfigState.length = parseInt(e.target.value, 10);
      updateHairConfigurator();
    });
    hairLengthSlider.addEventListener('change', () => sound.playLuxuryClick());
  }

  // Weight Slider
  const hairWeightSlider = document.getElementById('hairWeightSlider');
  if (hairWeightSlider) {
    hairWeightSlider.addEventListener('input', (e) => {
      hairConfigState.weight = parseInt(e.target.value, 10);
      updateHairConfigurator();
    });
    hairWeightSlider.addEventListener('change', () => sound.playLuxuryClick());
  }

  // Color Palette Dots
  document.querySelectorAll('#colorPalette button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#colorPalette button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hairConfigState.colorHex = btn.dataset.color;
      hairConfigState.colorName = btn.dataset.name;
      sound.playSparkle();
      updateHairConfigurator();
    });
  });

  // Method Selector
  document.querySelectorAll('#methodSelector button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#methodSelector button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hairConfigState.method = btn.dataset.method;
      sound.playLuxuryClick();
      updateHairConfigurator();
    });
  });

  updateHairConfigurator();

  // ==========================================================================
  // 2. VIRTUAL LASH & BROW STUDIO VISUALIZER CANVAS
  // ==========================================================================
  const lashState = {
    style: 'russian',
    curl: 'D',
    length: 13,
    mode: 'glam',
    blinkProgress: 0,
    isBlinking: false
  };

  const eyeCanvas = document.getElementById('eyeLashCanvas');
  const eyeCtx = eyeCanvas ? eyeCanvas.getContext('2d') : null;

  if (eyeCanvas) {
    function resizeEyeCanvas() {
      if (!eyeCanvas.parentElement) return;
      eyeCanvas.width = eyeCanvas.parentElement.offsetWidth;
      eyeCanvas.height = eyeCanvas.parentElement.offsetHeight;
    }
    resizeEyeCanvas();
    window.addEventListener('resize', resizeEyeCanvas);

    function triggerBlink() {
      if (lashState.isBlinking) return;
      lashState.isBlinking = true;
      let start = performance.now();
      sound.playSparkle();

      function blinkAnim(now) {
        let elapsed = (now - start) / 1000;
        if (elapsed < 0.15) {
          lashState.blinkProgress = elapsed / 0.15;
        } else if (elapsed < 0.3) {
          lashState.blinkProgress = 1 - (elapsed - 0.15) / 0.15;
        } else {
          lashState.blinkProgress = 0;
          lashState.isBlinking = false;
          return;
        }
        requestAnimationFrame(blinkAnim);
      }
      requestAnimationFrame(blinkAnim);
    }

    const lashBlinkBtn = document.getElementById('lashBlinkBtn');
    if (lashBlinkBtn) {
      lashBlinkBtn.addEventListener('click', triggerBlink);
    }

    function renderVirtualEye() {
      if (!eyeCtx) return;
      const w = eyeCanvas.width;
      const h = eyeCanvas.height;

      eyeCtx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 + 10;
      const eyeWidth = Math.min(w * 0.7, 240);
      const eyeHeight = Math.min(h * 0.4, 90) * (1 - lashState.blinkProgress * 0.95);

      // 1. Draw Brow
      eyeCtx.save();
      const browY = cy - eyeHeight - 35;
      eyeCtx.beginPath();
      eyeCtx.moveTo(cx - eyeWidth * 0.55, browY + 6);
      eyeCtx.quadraticCurveTo(cx - eyeWidth * 0.1, browY - 14, cx + eyeWidth * 0.6, browY + 10);
      eyeCtx.lineWidth = 12;
      eyeCtx.strokeStyle = 'rgba(77, 48, 30, 0.85)';
      eyeCtx.stroke();
      eyeCtx.restore();

      // 2. Draw Eye Sclera & Iris
      eyeCtx.save();
      eyeCtx.beginPath();
      eyeCtx.ellipse(cx, cy, eyeWidth / 2, eyeHeight / 2, 0, 0, Math.PI * 2);
      eyeCtx.fillStyle = '#f7f6f5';
      eyeCtx.fill();
      eyeCtx.clip();

      if (eyeHeight > 5) {
        const irisRadius = eyeHeight * 0.85;
        const irisGrad = eyeCtx.createRadialGradient(cx, cy, 4, cx, cy, irisRadius);
        irisGrad.addColorStop(0, '#5a3d28');
        irisGrad.addColorStop(0.7, '#2f1a0e');
        irisGrad.addColorStop(1, '#110b06');

        eyeCtx.beginPath();
        eyeCtx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
        eyeCtx.fillStyle = irisGrad;
        eyeCtx.fill();

        // Pupil
        eyeCtx.beginPath();
        eyeCtx.arc(cx, cy, irisRadius * 0.45, 0, Math.PI * 2);
        eyeCtx.fillStyle = '#0a0a0a';
        eyeCtx.fill();

        // Shimmer
        eyeCtx.beginPath();
        eyeCtx.arc(cx - irisRadius * 0.35, cy - irisRadius * 0.35, irisRadius * 0.22, 0, Math.PI * 2);
        eyeCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        eyeCtx.fill();
      }
      eyeCtx.restore();

      // 3. Draw Eyelids Contour
      eyeCtx.save();
      eyeCtx.beginPath();
      eyeCtx.ellipse(cx, cy, eyeWidth / 2, eyeHeight / 2, 0, 0, Math.PI * 2);
      eyeCtx.lineWidth = 2.2;
      eyeCtx.strokeStyle = '#18120c';
      eyeCtx.stroke();
      eyeCtx.restore();

      // 4. Draw Eyelashes
      const isNatural = (lashState.mode === 'natural');
      const lashDensity = isNatural ? 25 : (lashState.style === 'russian' ? 90 : (lashState.style === 'wispy' ? 65 : (lashState.style === 'fox' ? 60 : 38)));
      const baseLength = lashState.length * 2.6;

      eyeCtx.save();
      eyeCtx.lineCap = 'round';

      for (let i = 0; i < lashDensity; i++) {
        const t = i / (lashDensity - 1);
        const lx = cx - eyeWidth / 2 + t * eyeWidth;
        const ly = cy - Math.sin(t * Math.PI) * (eyeHeight / 2) * (1 - lashState.blinkProgress);

        let curLength = baseLength * (0.6 + 0.5 * Math.sin(t * Math.PI));
        let angle = -Math.PI / 2 + (t - 0.5) * 0.85;

        if (lashState.style === 'fox' && t > 0.6) {
          curLength *= 1.45;
          angle += 0.35;
        }
        if (lashState.style === 'wispy' && (i % 6 === 0)) {
          curLength *= 1.35;
        }

        const curlFactor = lashState.curl === 'M' ? 1.4 : (lashState.curl === 'D' ? 1.2 : 1.0);
        const endX = lx + Math.cos(angle) * (curLength * curlFactor);
        const endY = ly + Math.sin(angle) * (curLength * curlFactor) - (lashState.curl === 'D' ? 10 : 5);

        eyeCtx.beginPath();
        eyeCtx.moveTo(lx, ly);
        eyeCtx.quadraticCurveTo(lx + (t - 0.5) * 12, ly - curLength * 0.4, endX, endY);

        if (isNatural) {
          eyeCtx.lineWidth = 1.0;
          eyeCtx.strokeStyle = 'rgba(20, 16, 12, 0.7)';
        } else {
          eyeCtx.lineWidth = (lashState.style === 'russian' ? 1.8 : 1.4);
          eyeCtx.strokeStyle = '#050505';
        }
        eyeCtx.stroke();
      }
      eyeCtx.restore();

      requestAnimationFrame(renderVirtualEye);
    }
    renderVirtualEye();
  }

  function updateLashUI() {
    const styleNames = {
      classic: 'Косъм по косъм',
      russian: '3D-5D Russian Velvet Volume',
      wispy: 'Kim K / Wispy Glamour Rays',
      fox: 'Fox Eye Outer Lift'
    };

    const canvasStyleName = document.getElementById('canvasStyleName');
    if (canvasStyleName) canvasStyleName.textContent = styleNames[lashState.style];

    const canvasSpecs = document.getElementById('canvasSpecs');
    if (canvasSpecs) canvasSpecs.textContent = `Извивка: ${lashState.curl} • 9-${lashState.length}mm • ${lashState.mode === 'glam' ? 'Haute Glam' : 'Natural'}`;
  }

  document.querySelectorAll('#lashStyleOptions button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#lashStyleOptions button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      lashState.style = btn.dataset.style;
      sound.playLuxuryClick();
      updateLashUI();
    });
  });

  document.querySelectorAll('#lashCurlSelector button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#lashCurlSelector button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      lashState.curl = btn.dataset.curl;
      sound.playLuxuryClick();
      updateLashUI();
    });
  });

  const lashLengthSlider = document.getElementById('lashLengthSlider');
  const lashLengthVal = document.getElementById('lashLengthVal');
  if (lashLengthSlider && lashLengthVal) {
    lashLengthSlider.addEventListener('input', (e) => {
      lashState.length = parseInt(e.target.value, 10);
      lashLengthVal.textContent = `${lashState.length} mm`;
      updateLashUI();
    });
    lashLengthSlider.addEventListener('change', () => sound.playLuxuryClick());
  }

  const toggleLashNatural = document.getElementById('toggleLashNatural');
  const toggleLashGlam = document.getElementById('toggleLashGlam');
  if (toggleLashNatural && toggleLashGlam) {
    toggleLashNatural.addEventListener('click', () => {
      lashState.mode = 'natural';
      toggleLashNatural.className = 'text-[9px] font-mono px-2.5 py-1 rounded-full bg-gold-500 text-black font-bold';
      toggleLashGlam.className = 'text-[9px] font-mono px-2.5 py-1 rounded-full text-stone-400 hover:text-white';
      sound.playLuxuryClick();
      updateLashUI();
    });
    toggleLashGlam.addEventListener('click', () => {
      lashState.mode = 'glam';
      toggleLashGlam.className = 'text-[9px] font-mono px-2.5 py-1 rounded-full bg-gold-500 text-black font-bold';
      toggleLashNatural.className = 'text-[9px] font-mono px-2.5 py-1 rounded-full text-stone-400 hover:text-white';
      sound.playSparkle();
      updateLashUI();
    });
  }

  updateLashUI();

  // ==========================================================================
  // 3. JAPANESE WATER RIPPLE CANVAS (HEAD SPA & WASHES)
  // ==========================================================================
  const waterCanvas = document.getElementById('waterRippleCanvas');
  if (waterCanvas) {
    const wctx = waterCanvas.getContext('2d');
    let ripples = [];

    function resizeWaterCanvas() {
      if (!waterCanvas.parentElement) return;
      waterCanvas.width = waterCanvas.parentElement.offsetWidth;
      waterCanvas.height = waterCanvas.parentElement.offsetHeight;
    }
    resizeWaterCanvas();
    window.addEventListener('resize', resizeWaterCanvas);

    function addRipple(x, y) {
      ripples.push({
        x: x,
        y: y,
        radius: 5,
        maxRadius: Math.random() * 100 + 60,
        alpha: 0.7,
        speed: Math.random() * 1.5 + 1.2
      });
      sound.playWaterDrop();
    }

    waterCanvas.addEventListener('click', (e) => {
      const rect = waterCanvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top);
    });

    setInterval(() => {
      if (ripples.length < 4) {
        addRipple(Math.random() * waterCanvas.width, Math.random() * waterCanvas.height);
      }
    }, 2200);

    function renderWaterRipples() {
      const w = waterCanvas.width;
      const h = waterCanvas.height;

      wctx.clearRect(0, 0, w, h);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha = Math.max(0, 1 - r.radius / r.maxRadius);

        wctx.beginPath();
        wctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        wctx.strokeStyle = `rgba(45, 212, 191, ${r.alpha * 0.7})`;
        wctx.lineWidth = 2.5;
        wctx.stroke();

        if (r.alpha <= 0.01) {
          ripples.splice(i, 1);
        }
      }

      requestAnimationFrame(renderWaterRipples);
    }
    renderWaterRipples();
  }

  // ==========================================================================
  // 4. REAL PHOTOS BEFORE & AFTER COMPARISON LENS
  // ==========================================================================
  const beforeAfterContainer = document.getElementById('beforeAfterContainer');
  const transBeforeLayer = document.getElementById('transBeforeLayer');
  const dragHandle = document.getElementById('dragHandle');
  const transBeforeImg = document.getElementById('transBeforeImg');
  const transAfterImg = document.getElementById('transAfterImg');
  let isDragging = false;

  function setSliderPosition(xRatio) {
    xRatio = Math.max(0.05, Math.min(0.95, xRatio));
    const percent = xRatio * 100;
    if (transBeforeLayer) transBeforeLayer.style.width = `${percent}%`;
    if (dragHandle) dragHandle.style.left = `${percent}%`;
  }

  if (beforeAfterContainer) {
    function handleMove(e) {
      if (!isDragging && e.type !== 'click') return;
      const rect = beforeAfterContainer.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const xRatio = (clientX - rect.left) / rect.width;
      setSliderPosition(xRatio);
    }

    beforeAfterContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleMove(e);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', handleMove);

    beforeAfterContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      handleMove(e);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', handleMove, { passive: true });
  }

  // Before & After Preset Tabs
  const transPresets = {
    'slavic-hair': {
      before: 'assets/hair_before.jpg',
      after: 'assets/hair_after.jpg',
      title: 'Трансформация: 65см Славянска Необработена Коса',
      desc: '180 грама кератинови микро-капсули • Цвят #2/4 Balayage'
    },
    'russian-lashes': {
      before: 'assets/lash_before.jpg',
      after: 'assets/lashes_macro.jpg',
      title: 'Трансформация: 4D-5D Руски Кадифен Обем',
      desc: 'D-извивка, 9-14mm Fox Eye оформяне • 7 седмици издръжливост'
    },
    'brow-lamination': {
      before: 'assets/lash_before.jpg',
      after: 'assets/brow_lamination.jpg',
      title: 'Трансформация: Ламиниране на Вежди + Keratin Botox',
      desc: 'Пълна симетрия, оптическо сгъстяване и подхранване'
    }
  };

  document.querySelectorAll('#transTabs button').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#transTabs button').forEach(t => {
        t.className = 'trans-tab-btn px-4 py-2 rounded-full border border-white/10 hover:border-gold-500/40 bg-stone-900/60 text-xs font-bold text-stone-300 transition-all';
      });
      tab.className = 'trans-tab-btn active px-4 py-2 rounded-full border border-gold-500 bg-gold-500/20 text-xs font-bold text-gold-300 transition-all';
      
      const type = tab.dataset.trans;
      const data = transPresets[type];
      if (data) {
        if (transBeforeImg) transBeforeImg.src = data.before;
        if (transAfterImg) transAfterImg.src = data.after;
        const titleEl = document.getElementById('transTitle');
        const descEl = document.getElementById('transDetails');
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
      }
      sound.playLuxuryClick();
    });
  });

  // ==========================================================================
  // 5. SHOPPING CART ENGINE
  // ==========================================================================
  let cart = [];
  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');

  function openCart() {
    if (cartModal) cartModal.classList.remove('hidden');
    sound.playLuxuryClick();
  }

  function closeCart() {
    if (cartModal) cartModal.classList.add('hidden');
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cartCount) cartCount.textContent = totalCount;
    if (cartSubtotal) cartSubtotal.textContent = `${totalPrice} лв.`;

    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="text-center py-10 text-stone-500 text-xs font-mono">
            Кошницата ви е празна.
          </div>
        `;
      } else {
        cartItemsContainer.innerHTML = cart.map((item, idx) => `
          <div class="p-3 bg-stone-900/80 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-bold text-white font-cinzel">${item.title}</div>
              <div class="text-[10px] text-gold-400 font-mono">${item.price} лв. × ${item.qty}</div>
            </div>
            <button class="remove-cart-item text-stone-500 hover:text-rose-400 p-1" data-idx="${idx}">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        `).join('');

        if (window.lucide) window.lucide.createIcons();

        document.querySelectorAll('.remove-cart-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.idx, 10);
            cart.splice(index, 1);
            updateCartUI();
          });
        });
      }
    }
  }

  function addToCart(title, price, id = Date.now().toString()) {
    const existing = cart.find(i => i.title === title);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, title, price, qty: 1 });
    }
    sound.playSparkle();
    if (window.confetti) {
      window.confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }
    updateCartUI();
    openCart();
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title;
      const price = parseInt(btn.dataset.price, 10);
      addToCart(title, price);
    });
  });

  const addCustomHairToCartBtn = document.getElementById('addCustomHairToCartBtn');
  if (addCustomHairToCartBtn) {
    addCustomHairToCartBtn.addEventListener('click', () => {
      const title = `Славянска Коса (${hairConfigState.length}см, ${hairConfigState.weight}g, ${hairConfigState.colorName})`;
      const priceText = document.getElementById('calculatedPrice').textContent;
      const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 680;
      addToCart(title, price);
    });
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Моля, добавете продукт в кошницата!');
        return;
      }
      sound.playSparkle();
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
      alert('Поръчката ви е регистрирана успешно! Наш VIP консултант ще се свърже с вас за потвърждение на адреса за доставка със Спиди / Еконт.');
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // ==========================================================================
  // 6. ONLINE BOOKING SYSTEM & CALENDAR (.ICS) GENERATOR
  // ==========================================================================
  const bookingCheckboxes = document.querySelectorAll('input[name="service"]');
  const bookingTotalPreview = document.getElementById('bookingTotalPreview');
  const submitBookingBtn = document.getElementById('submitBookingBtn');
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');
  const bookingDateInput = document.getElementById('bookingDateInput');

  if (bookingDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookingDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  function calculateBookingTotal() {
    let sum = 0;
    bookingCheckboxes.forEach(cb => {
      if (cb.checked) {
        sum += parseInt(cb.dataset.price || '0', 10);
      }
    });
    if (bookingTotalPreview) {
      bookingTotalPreview.textContent = `${sum} лв.`;
    }
  }

  bookingCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      sound.playLuxuryClick();
      calculateBookingTotal();
    });
  });

  let lastBookingData = null;

  if (submitBookingBtn) {
    submitBookingBtn.addEventListener('click', () => {
      const selectedServices = Array.from(bookingCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
      const name = document.getElementById('clientNameInput')?.value.trim();
      const phone = document.getElementById('clientPhoneInput')?.value.trim();
      const date = bookingDateInput?.value;
      const time = document.getElementById('bookingTimeSelect')?.value;

      if (selectedServices.length === 0) {
        alert('Моля, изберете поне една процедура!');
        return;
      }
      if (!name || !phone) {
        alert('Моля, въведете вашето име и телефонен номер за връзка!');
        return;
      }

      lastBookingData = { name, phone, date, time, selectedServices };

      sound.playSparkle();
      if (window.confetti) {
        window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      }

      const successText = document.getElementById('bookingSuccessText');
      if (successText) {
        successText.innerHTML = `
          Скъпа <strong>${name}</strong>, вашият VIP час за <strong>${selectedServices.join(', ')}</strong> на дата <strong>${date}</strong> от <strong>${time} ч.</strong> е регистриран успешно!
        `;
      }

      if (bookingSuccessModal) bookingSuccessModal.classList.remove('hidden');
    });
  }

  if (closeSuccessModalBtn && bookingSuccessModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      bookingSuccessModal.classList.add('hidden');
    });
  }

  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', () => {
      if (!lastBookingData) return;
      const { name, date, time, selectedServices } = lastBookingData;
      const [year, month, day] = date.split('-');
      const [hour, minute] = time.split(':');

      const dtStart = `${year}${month}${day}T${hour}${minute}00`;
      const endHour = (parseInt(hour, 10) + 2).toString().padStart(2, '0');
      const dtEnd = `${year}${month}${day}T${endHour}${minute}00`;

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Denitsa Luxury Studio//BG',
        'BEGIN:VEVENT',
        `SUMMARY:DENITSA STUDIO — ${selectedServices[0]}`,
        `DESCRIPTION:VIP Процедура при Деница: ${selectedServices.join(', ')}. Клиент: ${name}`,
        'LOCATION:Denitsa Luxury Studio, Sofia/Varna',
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `Denitsa_Studio_${date}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      sound.playSparkle();
    });
  }

});
