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
        console.warn('Audio note error', e);
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

  // --- CUSTOM CURSOR ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Interactive Hover Effects for Cursor
  document.querySelectorAll('button, a, input, select, .cursor-pointer').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorOutline) {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorOutline.style.borderColor = 'rgba(250, 204, 21, 0.9)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cursorOutline) {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'rgba(212, 175, 55, 0.6)';
      }
    });
  });

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

  // --- HERO BACKGROUND PARTICLES CANVAS ---
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width, height;
    let particles = [];

    function resizeHeroCanvas() {
      width = heroCanvas.width = heroCanvas.parentElement.offsetWidth;
      height = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
    }
    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);

    for (let i = 0; i < 65; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        color: i % 3 === 0 ? '#fde047' : (i % 3 === 1 ? '#d4af37' : '#ffffff'),
        alpha: Math.random() * 0.7 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2,
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
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      requestAnimationFrame(renderHeroParticles);
    }
    renderHeroParticles();
  }

  // ==========================================================================
  // 1. 3D SLAVIC RAW HAIR CONFIGURATOR & DYNAMIC PHYSICS STRAND CANVAS
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

  const hairStrandCanvas = document.getElementById('hairStrandCanvas');
  let hairCtx = hairStrandCanvas ? hairStrandCanvas.getContext('2d') : null;
  let hairMouse = { x: 0, y: 0, active: false };

  if (hairStrandCanvas) {
    function resizeHairCanvas() {
      hairStrandCanvas.width = hairStrandCanvas.parentElement.offsetWidth;
      hairStrandCanvas.height = hairStrandCanvas.parentElement.offsetHeight;
    }
    resizeHairCanvas();
    window.addEventListener('resize', resizeHairCanvas);

    hairStrandCanvas.addEventListener('mousemove', (e) => {
      const rect = hairStrandCanvas.getBoundingClientRect();
      hairMouse.x = e.clientX - rect.left;
      hairMouse.y = e.clientY - rect.top;
      hairMouse.active = true;
    });

    hairStrandCanvas.addEventListener('mouseleave', () => {
      hairMouse.active = false;
    });

    let strandTime = 0;

    function renderHairStrands() {
      if (!hairCtx) return;
      const w = hairStrandCanvas.width;
      const h = hairStrandCanvas.height;

      hairCtx.clearRect(0, 0, w, h);
      strandTime += 0.02;

      // Draw Hair Head Base / Origin
      const headCenterX = w / 2;
      const headStartY = 30;

      // Number of rendered curves proportional to weight
      const strandCount = Math.floor(hairConfigState.weight * 0.9);
      const hairLengthPx = (hairConfigState.length / 80) * (h - 80);

      hairCtx.lineWidth = 1.4;
      hairCtx.lineCap = 'round';

      // Parse color
      const hex = hairConfigState.colorHex;

      for (let i = 0; i < strandCount; i++) {
        const spread = (i - strandCount / 2) * 1.2;
        const startX = headCenterX + spread * 0.45;
        const startY = headStartY + Math.abs(spread) * 0.15;

        // Wave dynamics
        const waveFreq = 0.03 + (i % 5) * 0.005;
        const waveAmp = (hairConfigState.origin === 'slavic' ? 6 : 14);
        const mouseDist = hairMouse.active ? Math.hypot(hairMouse.x - startX, hairMouse.y - (headStartY + hairLengthPx * 0.5)) : 999;
        const mouseOffset = mouseDist < 120 ? (120 - mouseDist) * 0.25 * (hairMouse.x > startX ? -1 : 1) : 0;

        hairCtx.beginPath();
        hairCtx.moveTo(startX, startY);

        const controlX1 = startX + Math.sin(strandTime + i * 0.1) * waveAmp + mouseOffset;
        const controlY1 = startY + hairLengthPx * 0.45;

        const controlX2 = startX + Math.cos(strandTime + i * 0.15) * (waveAmp * 1.2) + mouseOffset * 0.6;
        const controlY2 = startY + hairLengthPx * 0.8;

        const endX = startX + Math.sin(strandTime * 0.8 + i * 0.2) * (waveAmp * 0.8);
        const endY = startY + hairLengthPx;

        hairCtx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);

        // Silk Shine Highlight on strands
        const isHighlight = (i % 7 === 0);
        if (isHighlight) {
          hairCtx.strokeStyle = '#fde047';
          hairCtx.globalAlpha = 0.35;
        } else {
          hairCtx.strokeStyle = hex;
          hairCtx.globalAlpha = 0.55;
        }

        hairCtx.stroke();
      }

      hairCtx.globalAlpha = 1.0;
      requestAnimationFrame(renderHairStrands);
    }
    renderHairStrands();
  }

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

    const simWeightDisplay = document.getElementById('simWeightDisplay');
    if (simWeightDisplay) simWeightDisplay.textContent = `Плътност: ${hairConfigState.weight} грама • ${totalPrice} лв.`;

    const simShadeName = document.getElementById('simShadeName');
    if (simShadeName) simShadeName.textContent = hairConfigState.colorName;

    const selectedShadeLabel = document.getElementById('selectedShadeLabel');
    if (selectedShadeLabel) selectedShadeLabel.textContent = hairConfigState.colorName;

    const simHairTitle = document.getElementById('simHairTitle');
    const originNames = {
      slavic: '100% Сурова Славянска Коса',
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
      keratin: 'Метод: Италиански Кератинови Микро-Капсули',
      tapes: 'Метод: Безшевни Стикери (Tape-in)',
      wefts: 'Метод: Луксозни Треси на Клипси / Зашиване',
      nanorings: 'Метод: Ултра-фини Нано Рингове'
    };
    if (simMethodName) simMethodName.textContent = methodDescriptions[hairConfigState.method];

    // Update glow effect
    const hairGlowEffect = document.getElementById('hairGlowEffect');
    if (hairGlowEffect) {
      hairGlowEffect.style.background = `radial-gradient(circle, ${hairConfigState.colorHex} 0%, transparent 70%)`;
    }
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
    style: 'russian', // classic, russian, wispy, fox
    curl: 'D', // C, D, L, M
    length: 13, // 9 to 16
    brow: 'lamination', // lamination, tint, none
    mode: 'glam', // glam or natural
    blinkProgress: 0,
    isBlinking: false
  };

  const eyeCanvas = document.getElementById('eyeLashCanvas');
  const eyeCtx = eyeCanvas ? eyeCanvas.getContext('2d') : null;

  if (eyeCanvas) {
    function resizeEyeCanvas() {
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
          lashState.blinkProgress = elapsed / 0.15; // closing
        } else if (elapsed < 0.3) {
          lashState.blinkProgress = 1 - (elapsed - 0.15) / 0.15; // opening
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
      const cy = h / 2 + 15;
      const eyeWidth = Math.min(w * 0.65, 240);
      const eyeHeight = Math.min(h * 0.38, 95) * (1 - lashState.blinkProgress * 0.95);

      // 1. Draw Brow
      eyeCtx.save();
      const browY = cy - eyeHeight - 45;
      eyeCtx.beginPath();
      eyeCtx.moveTo(cx - eyeWidth * 0.6, browY + 8);
      eyeCtx.quadraticCurveTo(cx - eyeWidth * 0.1, browY - 18, cx + eyeWidth * 0.65, browY + 12);

      if (lashState.brow === 'lamination') {
        eyeCtx.lineWidth = 14;
        eyeCtx.strokeStyle = 'rgba(77, 48, 30, 0.85)';
        eyeCtx.stroke();

        // Brow Hair Strands Upward
        for (let b = -eyeWidth * 0.55; b < eyeWidth * 0.6; b += 7) {
          eyeCtx.beginPath();
          const bx = cx + b;
          const by = browY + (Math.abs(b) * 0.08);
          eyeCtx.moveTo(bx, by + 4);
          eyeCtx.lineTo(bx + 4, by - 10);
          eyeCtx.lineWidth = 1.5;
          eyeCtx.strokeStyle = '#2a1d17';
          eyeCtx.stroke();
        }
      } else if (lashState.brow === 'tint') {
        eyeCtx.lineWidth = 10;
        eyeCtx.strokeStyle = 'rgba(55, 35, 22, 0.7)';
        eyeCtx.stroke();
      }
      eyeCtx.restore();

      // 2. Draw Sclera (Eye White)
      eyeCtx.save();
      eyeCtx.beginPath();
      eyeCtx.ellipse(cx, cy, eyeWidth / 2, eyeHeight / 2, 0, 0, Math.PI * 2);
      eyeCtx.fillStyle = '#f7f6f5';
      eyeCtx.fill();
      eyeCtx.clip();

      // 3. Draw Iris & Pupil
      if (eyeHeight > 5) {
        const irisRadius = eyeHeight * 0.85;
        const irisGrad = eyeCtx.createRadialGradient(cx, cy, 5, cx, cy, irisRadius);
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

        // Luxury Eye Light Reflection
        eyeCtx.beginPath();
        eyeCtx.arc(cx - irisRadius * 0.35, cy - irisRadius * 0.35, irisRadius * 0.22, 0, Math.PI * 2);
        eyeCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        eyeCtx.fill();
      }

      eyeCtx.restore();

      // 4. Draw Eyelids Contours
      eyeCtx.save();
      eyeCtx.beginPath();
      eyeCtx.ellipse(cx, cy, eyeWidth / 2, eyeHeight / 2, 0, 0, Math.PI * 2);
      eyeCtx.lineWidth = 2.5;
      eyeCtx.strokeStyle = '#18120c';
      eyeCtx.stroke();
      eyeCtx.restore();

      // 5. Draw Haute Couture Eyelashes
      const isNatural = (lashState.mode === 'natural');
      const lashDensity = isNatural ? 25 : (lashState.style === 'russian' ? 95 : (lashState.style === 'wispy' ? 70 : (lashState.style === 'fox' ? 65 : 40)));
      const baseLength = lashState.length * 2.8;

      eyeCtx.save();
      eyeCtx.lineCap = 'round';

      for (let i = 0; i < lashDensity; i++) {
        const t = i / (lashDensity - 1); // 0 to 1 along eyelid
        const lx = cx - eyeWidth / 2 + t * eyeWidth;
        // Upper eyelid curvature
        const ly = cy - Math.sin(t * Math.PI) * (eyeHeight / 2) * (1 - lashState.blinkProgress);

        let curLength = baseLength * (0.6 + 0.5 * Math.sin(t * Math.PI));
        let angle = -Math.PI / 2 + (t - 0.5) * 0.9;

        // Fox Eye Lift effect
        if (lashState.style === 'fox' && t > 0.6) {
          curLength *= 1.45;
          angle += 0.35;
        }

        // Wispy effect spikes
        if (lashState.style === 'wispy' && (i % 6 === 0)) {
          curLength *= 1.35;
        }

        // Curl factor
        const curlFactor = lashState.curl === 'M' ? 1.4 : (lashState.curl === 'D' ? 1.2 : 1.0);

        const endX = lx + Math.cos(angle) * (curLength * curlFactor);
        const endY = ly + Math.sin(angle) * (curLength * curlFactor) - (lashState.curl === 'D' ? 12 : 6);

        eyeCtx.beginPath();
        eyeCtx.moveTo(lx, ly);
        eyeCtx.quadraticCurveTo(lx + (t - 0.5) * 15, ly - curLength * 0.4, endX, endY);

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
      classic: 'Косъм по косъм (Natural Silk)',
      russian: '3D-5D Russian Velvet Volume',
      wispy: 'Kim K / Wispy Glamour Rays',
      fox: 'Fox Eye Luxury Outer Lift'
    };

    const prices = { classic: 60, russian: 75, wispy: 85, fox: 80 };
    const durations = { classic: '75 - 90 мин.', russian: '90 - 110 мин.', wispy: '110 - 120 мин.', fox: '95 - 105 мин.' };

    const canvasStyleName = document.getElementById('canvasStyleName');
    if (canvasStyleName) canvasStyleName.textContent = styleNames[lashState.style];

    const canvasSpecs = document.getElementById('canvasSpecs');
    if (canvasSpecs) canvasSpecs.textContent = `Извивка: ${lashState.curl} • Дължина: 9-${lashState.length}mm • ${lashState.mode === 'glam' ? 'Haute Glam' : 'Natural'}`;

    const browNames = {
      lamination: 'Ламиниране & Кератинов Botox',
      tint: 'Хибридно Оцветяване & Архитектура',
      none: 'Естествена Форма'
    };
    const canvasBrowName = document.getElementById('canvasBrowName');
    if (canvasBrowName) canvasBrowName.textContent = browNames[lashState.brow];

    const lashDuration = document.getElementById('lashDuration');
    if (lashDuration) lashDuration.textContent = durations[lashState.style];

    const lashPrice = document.getElementById('lashPrice');
    if (lashPrice) lashPrice.textContent = `${prices[lashState.style]} лв.`;
  }

  // Lash Style Options
  document.querySelectorAll('#lashStyleOptions button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#lashStyleOptions button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      lashState.style = btn.dataset.style;
      sound.playLuxuryClick();
      updateLashUI();
    });
  });

  // Lash Curl Options
  document.querySelectorAll('#lashCurlSelector button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#lashCurlSelector button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      lashState.curl = btn.dataset.curl;
      sound.playLuxuryClick();
      updateLashUI();
    });
  });

  // Lash Length Slider
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

  // Brow Options
  document.querySelectorAll('#browOptions button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#browOptions button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      lashState.brow = btn.dataset.brow;
      sound.playLuxuryClick();
      updateLashUI();
    });
  });

  // Natural vs Glam Toggles
  const toggleLashNatural = document.getElementById('toggleLashNatural');
  const toggleLashGlam = document.getElementById('toggleLashGlam');
  if (toggleLashNatural && toggleLashGlam) {
    toggleLashNatural.addEventListener('click', () => {
      lashState.mode = 'natural';
      toggleLashNatural.className = 'text-[10px] font-mono px-3 py-1 rounded-full bg-gold-500 text-black font-bold transition-all';
      toggleLashGlam.className = 'text-[10px] font-mono px-3 py-1 rounded-full text-stone-400 hover:text-white transition-all';
      sound.playLuxuryClick();
      updateLashUI();
    });
    toggleLashGlam.addEventListener('click', () => {
      lashState.mode = 'glam';
      toggleLashGlam.className = 'text-[10px] font-mono px-3 py-1 rounded-full bg-gold-500 text-black font-bold transition-all';
      toggleLashNatural.className = 'text-[10px] font-mono px-3 py-1 rounded-full text-stone-400 hover:text-white transition-all';
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
        maxRadius: Math.random() * 120 + 80,
        alpha: 0.8,
        speed: Math.random() * 1.5 + 1.2
      });
      sound.playWaterDrop();
    }

    waterCanvas.addEventListener('click', (e) => {
      const rect = waterCanvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top);
    });

    waterCanvas.addEventListener('mousemove', (e) => {
      if (Math.random() < 0.08) {
        const rect = waterCanvas.getBoundingClientRect();
        addRipple(e.clientX - rect.left, e.clientY - rect.top);
      }
    });

    // Spawn automatic calming water ripples
    setInterval(() => {
      if (ripples.length < 6) {
        addRipple(Math.random() * waterCanvas.width, Math.random() * waterCanvas.height);
      }
    }, 1800);

    function renderWaterRipples() {
      const w = waterCanvas.width;
      const h = waterCanvas.height;

      // Dark teal and obsidian water gradient
      const bgGrad = wctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#061a1b');
      bgGrad.addColorStop(0.5, '#040d10');
      bgGrad.addColorStop(1, '#020506');
      wctx.fillStyle = bgGrad;
      wctx.fillRect(0, 0, w, h);

      // Render ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha = Math.max(0, 1 - r.radius / r.maxRadius);

        wctx.beginPath();
        wctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        wctx.strokeStyle = `rgba(45, 212, 191, ${r.alpha * 0.6})`;
        wctx.lineWidth = 2;
        wctx.stroke();

        // Secondary inner ripple
        if (r.radius > 20) {
          wctx.beginPath();
          wctx.arc(r.x, r.y, r.radius - 15, 0, Math.PI * 2);
          wctx.strokeStyle = `rgba(212, 175, 55, ${r.alpha * 0.3})`;
          wctx.lineWidth = 1;
          wctx.stroke();
        }

        if (r.alpha <= 0.01) {
          ripples.splice(i, 1);
        }
      }

      requestAnimationFrame(renderWaterRipples);
    }
    renderWaterRipples();
  }

  // ==========================================================================
  // 4. BEFORE & AFTER INTERACTIVE TRANSFORMATION COMPARISON LENS
  // ==========================================================================
  const beforeAfterContainer = document.getElementById('beforeAfterContainer');
  const transBeforeLayer = document.getElementById('transBeforeLayer');
  const dragHandle = document.getElementById('dragHandle');
  const beforeCanvas = document.getElementById('beforeCanvas');
  const afterCanvas = document.getElementById('afterCanvas');
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

  // Render Before / After Canvas Art
  let activeTransType = 'slavic-hair';

  function drawTransformationArt() {
    if (!beforeCanvas || !afterCanvas) return;
    const bw = beforeCanvas.width = beforeCanvas.parentElement.offsetWidth || 700;
    const bh = beforeCanvas.height = beforeCanvas.parentElement.offsetHeight || 500;
    const aw = afterCanvas.width = afterCanvas.parentElement.offsetWidth || 700;
    const ah = afterCanvas.height = afterCanvas.parentElement.offsetHeight || 500;

    const bctx = beforeCanvas.getContext('2d');
    const actx = afterCanvas.getContext('2d');

    // Clear
    bctx.fillStyle = '#141217';
    bctx.fillRect(0, 0, bw, bh);
    actx.fillStyle = '#161019';
    actx.fillRect(0, 0, aw, ah);

    if (activeTransType === 'slavic-hair') {
      // BEFORE: Thin, short hair strands
      bctx.strokeStyle = '#614d3b';
      bctx.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        bctx.beginPath();
        const sx = bw / 2 + (i - 20) * 4;
        bctx.moveTo(sx, 50);
        bctx.quadraticCurveTo(sx + (i % 2 === 0 ? 10 : -10), 180, sx, 250);
        bctx.stroke();
      }

      // AFTER: Ultra thick, long cascading Slavic hair 60cm with champagne gloss
      actx.lineWidth = 2.0;
      for (let i = 0; i < 220; i++) {
        actx.beginPath();
        const sx = aw / 2 + (i - 110) * 1.8;
        actx.moveTo(sx, 40);
        actx.bezierCurveTo(sx + Math.sin(i * 0.1) * 20, 180, sx + Math.cos(i * 0.1) * 25, 340, sx, ah - 20);
        actx.strokeStyle = (i % 8 === 0) ? '#fde047' : '#3d2516';
        actx.globalAlpha = 0.8;
        actx.stroke();
      }
      actx.globalAlpha = 1.0;
    } else if (activeTransType === 'russian-lashes') {
      // BEFORE: Sparse natural lashes
      bctx.strokeStyle = '#333';
      bctx.lineWidth = 1.2;
      for (let i = 0; i < 20; i++) {
        bctx.beginPath();
        bctx.moveTo(bw / 2 - 80 + i * 8, bh / 2);
        bctx.lineTo(bw / 2 - 80 + i * 8 + (i - 10) * 1.5, bh / 2 - 25);
        bctx.stroke();
      }

      // AFTER: 4D Russian Volume Fans
      actx.strokeStyle = '#050505';
      for (let i = 0; i < 90; i++) {
        actx.beginPath();
        const startX = aw / 2 - 120 + i * 2.7;
        actx.moveTo(startX, ah / 2);
        actx.quadraticCurveTo(startX + (i - 45) * 1.8, ah / 2 - 60, startX + (i - 45) * 2.5, ah / 2 - 80);
        actx.lineWidth = 2.2;
        actx.stroke();
      }
    } else if (activeTransType === 'brow-lamination') {
      // BEFORE: Wild unshaped brows
      bctx.strokeStyle = '#4a3b32';
      bctx.lineWidth = 2;
      for (let i = 0; i < 30; i++) {
        bctx.beginPath();
        bctx.moveTo(bw / 2 - 90 + i * 6, bh / 2 + (i % 3) * 5);
        bctx.lineTo(bw / 2 - 90 + i * 6 + (i % 2 ? 8 : -8), bh / 2 - 15);
        bctx.stroke();
      }

      // AFTER: Laminated, perfectly combed lifted brows
      actx.strokeStyle = '#291d16';
      actx.lineWidth = 2.5;
      for (let i = 0; i < 60; i++) {
        actx.beginPath();
        const bx = aw / 2 - 110 + i * 3.7;
        actx.moveTo(bx, ah / 2 + 5);
        actx.quadraticCurveTo(bx + 5, ah / 2 - 15, bx + 8, ah / 2 - 35);
        actx.stroke();
      }
    } else {
      // Head Spa Repair
      bctx.fillStyle = '#3a201c';
      bctx.fillRect(bw / 4, bh / 4, bw / 2, bh / 2);
      actx.fillStyle = '#1c3a32';
      actx.fillRect(aw / 4, ah / 4, aw / 2, ah / 2);
    }
  }

  drawTransformationArt();

  // Tab switching for transformations
  const transTabs = document.querySelectorAll('#transTabs button');
  transTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      transTabs.forEach(t => {
        t.className = 'trans-tab-btn px-5 py-2.5 rounded-full border border-white/10 hover:border-gold-500/40 bg-stone-900/60 text-xs font-bold text-stone-300 transition-all';
      });
      tab.className = 'trans-tab-btn active px-5 py-2.5 rounded-full border border-gold-500 bg-gold-500/20 text-xs font-bold text-gold-300 transition-all';
      activeTransType = tab.dataset.trans;

      const transTitles = {
        'slavic-hair': { title: 'Трансформация: 60см Славянска Необработена Коса', desc: '180 грама кератинови микро-капсули • Цвят #2/4 Balayage' },
        'russian-lashes': { title: 'Трансформация: 4D-5D Руски Кадифен Обем', desc: 'D-извивка, 9-14mm Fox Eye оформяне • 7 седмици издръжливост' },
        'brow-lamination': { title: 'Трансформация: Ламиниране на Вежди + Keratin Botox', desc: 'Пълна симетрия, оптическо сгъстяване и подхранване' },
        'head-spa-repair': { title: 'Трансформация: Japanese Waterfall Head Spa Ритуал', desc: 'Дълбоко възстановяване на изтощена коса и детокс на скалпа' }
      };

      const titleEl = document.getElementById('transTitle');
      const descEl = document.getElementById('transDetails');
      if (titleEl) titleEl.textContent = transTitles[activeTransType].title;
      if (descEl) descEl.textContent = transTitles[activeTransType].desc;

      sound.playLuxuryClick();
      drawTransformationArt();
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
          <div class="text-center py-12 text-stone-500 text-sm font-mono">
            Кошницата ви е празна. Изберете славянска коса или продукт от бутика!
          </div>
        `;
      } else {
        cartItemsContainer.innerHTML = cart.map((item, idx) => `
          <div class="p-3 bg-stone-900/80 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-bold text-white font-cinzel">${item.title}</div>
              <div class="text-[11px] text-gold-400 font-mono">${item.price} лв. × ${item.qty}</div>
            </div>
            <div class="flex items-center gap-2">
              <button class="remove-cart-item text-stone-500 hover:text-rose-400 p-1" data-idx="${idx}">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join('');

        if (window.lucide) window.lucide.createIcons();

        // Bind delete buttons
        document.querySelectorAll('.remove-cart-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
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

  // Shop item add buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title;
      const price = parseInt(btn.dataset.price, 10);
      addToCart(title, price);
    });
  });

  // Custom hair configurator add to cart button
  const addCustomHairToCartBtn = document.getElementById('addCustomHairToCartBtn');
  if (addCustomHairToCartBtn) {
    addCustomHairToCartBtn.addEventListener('click', () => {
      const title = `Персонализирана Славянска Коса (${hairConfigState.length}см, ${hairConfigState.weight}g, ${hairConfigState.colorName})`;
      const priceText = document.getElementById('calculatedPrice').textContent;
      const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 680;
      addToCart(title, price);
    });
  }

  // Checkout Button
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

  // Set default date to tomorrow
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
      const notes = document.getElementById('clientNotesInput')?.value.trim();

      if (selectedServices.length === 0) {
        alert('Моля, изберете поне една процедура!');
        return;
      }
      if (!name || !phone) {
        alert('Моля, въведете вашето име и телефонен номер за връзка!');
        return;
      }

      lastBookingData = { name, phone, date, time, selectedServices, notes };

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

  // Generate .ICS Calendar File
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
