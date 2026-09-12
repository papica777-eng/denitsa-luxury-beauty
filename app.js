/* ==========================================================================
   HAIR EXTENSIONS DS — INTERACTIVE CORE ENGINE (app.js)
   100% Raw Slavic Hair, Academy, Special Brushes & Japanese Head Spa
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
        // Silent audio fallback
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

  // ==========================================================================
  // ==========================================================================
  // 1. MASTER HAIR CUSTOMIZER & PRODUCT SHOWCASE (INDIAN, VIETNAMESE, SLAVIC)
  // ==========================================================================
  const hairOriginOptions = {
    indian: {
      label: 'Индийска Коса',
      density: 'Двойна плътност (Double Drawn)',
      badge: 'Индийска • Double Drawn',
      lengths: [
        { len: 55, eur: 190, bgn: 370, label: '55 см ★', default: true },
        { len: 65, eur: 230, bgn: 450, label: '65-70 см ★' }
      ]
    },
    vietnamese: {
      label: 'Виетнамска Коса',
      density: 'Супер двойна плътност (Super DD)',
      badge: 'Виетнамска • Super DD',
      lengths: [
        { len: 60, eur: 290, bgn: 565, label: '60 см ★', default: true },
        { len: 65, eur: 320, bgn: 625, label: '65 см ★' }
      ]
    },
    slavic: {
      label: 'Славянска Коса',
      density: '100% Сурова Virgin (Double Drawn)',
      badge: 'Славянска • 100% Raw Virgin',
      lengths: [
        { len: 45, eur: 160, bgn: 310, label: '45 см' },
        { len: 55, eur: 190, bgn: 370, label: '55 см ★', default: true },
        { len: 65, eur: 230, bgn: 450, label: '65-70 см ★' },
        { len: 75, eur: 270, bgn: 530, label: '75-80 см' }
      ]
    }
  };

  const hairConfigState = {
    origin: 'indian',
    originLabel: 'Индийска Коса',
    densityLabel: 'Двойна плътност (Double Drawn)',
    length: 55,
    lengthLabel: '55 см ★',
    pricePer100gEur: 190,
    pricePer100gBgn: 370,
    weight: 100,
    method: 'raw',
    methodName: 'Сурова цяла треса',
    methodFeeBgn: 0,
    methodFeeEur: 0,
    colorName: '#2 Тъмен Шоколад',
    colorHex: '#2a1d17',
    addBrush: false,
    addBook: false,
    addBag: false
  };

  const masterProductImg = document.getElementById('masterProductImg');
  const photoCaptionTitle = document.getElementById('photoCaptionTitle');
  const productThumbs = document.querySelectorAll('.product-thumb-item');

  productThumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      productThumbs.forEach(b => {
        b.classList.remove('active', 'border-2', 'border-amber-400');
        b.classList.add('border', 'border-stone-200');
      });
      btn.classList.add('active', 'border-2', 'border-amber-400');
      btn.classList.remove('border-stone-200');

      if (masterProductImg && btn.dataset.img) {
        masterProductImg.src = btn.dataset.img;
      }
      if (photoCaptionTitle && btn.dataset.title) {
        photoCaptionTitle.textContent = btn.dataset.title;
      }
      sound.playLuxuryClick();
    });
  });

  function updateMasterCustomizer() {
    // 1. Calculate Prices with Weight Ratio and Add-ons
    const weightRatio = hairConfigState.weight / 100;
    let baseEur = Math.round(hairConfigState.pricePer100gEur * weightRatio);
    let baseBgn = Math.round(hairConfigState.pricePer100gBgn * weightRatio);

    let totalEur = baseEur + hairConfigState.methodFeeEur;
    let totalBgn = baseBgn + hairConfigState.methodFeeBgn;

    if (hairConfigState.addBrush) {
      totalBgn += 35;
      totalEur += 18;
    }
    if (hairConfigState.addBook) {
      totalBgn += 39;
      totalEur += 20;
    }
    if (hairConfigState.addBag) {
      totalBgn += 25;
      totalEur += 13;
    }

    // 2. Update Live Price Displays
    const eurDisplay = document.getElementById('masterPriceEur');
    if (eurDisplay) eurDisplay.textContent = `${totalEur},00 €`;

    const bgnDisplay = document.getElementById('masterPriceBgn');
    if (bgnDisplay) bgnDisplay.textContent = `(${totalBgn},00 лв.)`;

    const activeLenBadge = document.getElementById('activeLenBadge');
    if (activeLenBadge) activeLenBadge.textContent = `${hairConfigState.originLabel} • ${hairConfigState.lengthLabel} (${totalEur} €)`;

    // 3. Update Title & Specs
    const masterTitle = document.getElementById('masterProductTitle');
    if (masterTitle) {
      masterTitle.textContent = `${hairConfigState.originLabel} (${hairConfigState.densityLabel}) – Дължина ${hairConfigState.lengthLabel}, цвят ${hairConfigState.colorName}`;
    }

    const specLength = document.getElementById('specLength');
    if (specLength) specLength.textContent = `${hairConfigState.lengthLabel} (${hairConfigState.densityLabel})`;

    const specWeight = document.getElementById('specWeight');
    if (specWeight) specWeight.textContent = `${hairConfigState.weight} грама (${hairConfigState.weight >= 200 ? 'Mega Плътен Обем' : 'Стандартен Пълен Обем'})`;

    const specColor = document.getElementById('specColor');
    if (specColor) specColor.textContent = hairConfigState.colorName;

    // 4. Update Section Labels
    const selectedOriginBadge = document.getElementById('selectedOriginBadge');
    if (selectedOriginBadge) {
      selectedOriginBadge.textContent = `${hairConfigState.originLabel} • ${hairConfigState.densityLabel}`;
    }

    const selectedWeightLabel = document.getElementById('selectedWeightLabel');
    if (selectedWeightLabel) {
      selectedWeightLabel.textContent = `${hairConfigState.weight} грама (${hairConfigState.weight >= 200 ? 'Mega Плътен Обем' : 'Стандартен пълен обем'})`;
    }

    const selectedLengthLabel = document.getElementById('selectedLengthLabel');
    if (selectedLengthLabel) {
      selectedLengthLabel.textContent = `${hairConfigState.lengthLabel} — ${hairConfigState.pricePer100gEur}€ (${hairConfigState.pricePer100gBgn} лв.) / 100g`;
    }

    const selectedMethodLabel = document.getElementById('selectedMethodLabel');
    if (selectedMethodLabel) {
      selectedMethodLabel.textContent = hairConfigState.methodName;
    }

    const masterColorLabel = document.getElementById('masterColorLabel');
    if (masterColorLabel) {
      masterColorLabel.textContent = hairConfigState.colorName;
    }
  }

  // Bind Length Pill Click Listeners
  function bindLengthPills() {
    const lengthPills = document.querySelectorAll('#lengthPillGroup .opt-pill');
    lengthPills.forEach(btn => {
      btn.addEventListener('click', () => {
        lengthPills.forEach(b => {
          b.classList.remove('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'font-bold', 'shadow-sm');
          b.classList.add('border', 'border-stone-200', 'bg-white');
        });
        btn.classList.add('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'font-bold', 'shadow-sm');
        btn.classList.remove('border-stone-200', 'bg-white');

        hairConfigState.length = parseInt(btn.dataset.len, 10);
        hairConfigState.lengthLabel = btn.querySelector('.text-xs')?.textContent.trim() || `${btn.dataset.len} см`;
        hairConfigState.pricePer100gEur = parseInt(btn.dataset.eur, 10);
        hairConfigState.pricePer100gBgn = parseInt(btn.dataset.bgn, 10);

        sound.playLuxuryClick();
        updateMasterCustomizer();
      });
    });
  }

  // Re-render Length Pills based on Selected Origin
  function renderLengthPills(originKey) {
    const lengthPillGroup = document.getElementById('lengthPillGroup');
    if (!lengthPillGroup) return;

    const opt = hairOriginOptions[originKey];
    if (!opt) return;

    lengthPillGroup.innerHTML = opt.lengths.map(l => `
      <button data-len="${l.len}" data-eur="${l.eur}" data-bgn="${l.bgn}" class="opt-pill ${l.default ? 'active border-2 border-amber-400 bg-amber-50 font-bold shadow-sm' : 'border border-stone-200 bg-white'} p-3 rounded-xl text-center hover:border-amber-400 transition-all">
        <div class="text-xs font-bold text-stone-900">${l.label}</div>
        <div class="text-[10px] ${l.default ? 'text-amber-800 font-bold' : 'text-stone-500'} font-mono">${l.eur} € (${l.bgn} лв.)</div>
      </button>
    `).join('');

    const defaultOpt = opt.lengths.find(l => l.default) || opt.lengths[0];
    hairConfigState.length = defaultOpt.len;
    hairConfigState.lengthLabel = defaultOpt.label;
    hairConfigState.pricePer100gEur = defaultOpt.eur;
    hairConfigState.pricePer100gBgn = defaultOpt.bgn;

    bindLengthPills();
  }

  // Origin Pill Listeners (Indian, Vietnamese, Slavic)
  const originPills = document.querySelectorAll('#originPillGroup .origin-pill');
  originPills.forEach(btn => {
    btn.addEventListener('click', () => {
      originPills.forEach(b => {
        b.classList.remove('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'shadow-sm');
        b.classList.add('border', 'border-stone-200', 'bg-white');
      });
      btn.classList.add('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'shadow-sm');
      btn.classList.remove('border-stone-200', 'bg-white');

      const originKey = btn.dataset.origin;
      const opt = hairOriginOptions[originKey];
      if (opt) {
        hairConfigState.origin = originKey;
        hairConfigState.originLabel = opt.label;
        hairConfigState.densityLabel = opt.density;
        renderLengthPills(originKey);
        sound.playLuxuryClick();
        updateMasterCustomizer();
      }
    });
  });

  // Initial Length Pills Binding
  bindLengthPills();

  // Weight Pill Buttons
  const weightPills = document.querySelectorAll('#weightPillGroup .opt-pill');
  weightPills.forEach(btn => {
    btn.addEventListener('click', () => {
      weightPills.forEach(b => {
        b.classList.remove('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'font-bold', 'shadow-sm');
        b.classList.add('border', 'border-stone-200', 'bg-white');
      });
      btn.classList.add('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'font-bold', 'shadow-sm');
      btn.classList.remove('border-stone-200', 'bg-white');

      hairConfigState.weight = parseInt(btn.dataset.weight, 10);
      sound.playLuxuryClick();
      updateMasterCustomizer();
    });
  });

  // Method Pill Buttons
  const methodPills = document.querySelectorAll('#methodPillGroup .opt-pill');
  methodPills.forEach(btn => {
    btn.addEventListener('click', () => {
      methodPills.forEach(b => {
        b.classList.remove('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'font-bold', 'shadow-sm');
        b.classList.add('border', 'border-stone-200', 'bg-white');
      });
      btn.classList.add('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'font-bold', 'shadow-sm');
      btn.classList.remove('border-stone-200', 'bg-white');

      hairConfigState.method = btn.dataset.method;
      hairConfigState.methodFeeBgn = parseInt(btn.dataset.price || '0', 10);
      hairConfigState.methodFeeEur = Math.round(hairConfigState.methodFeeBgn / 1.95);
      hairConfigState.methodName = btn.querySelector('span')?.textContent.trim() || btn.textContent.trim();

      sound.playLuxuryClick();
      updateMasterCustomizer();
    });
  });

  // Color Swatches
  const colorSwatches = document.querySelectorAll('#colorSwatchGroup .opt-pill');
  colorSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      colorSwatches.forEach(b => {
        b.classList.remove('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'font-bold', 'shadow-sm');
        b.classList.add('border', 'border-stone-200', 'bg-white');
      });
      btn.classList.add('active', 'border-2', 'border-amber-400', 'bg-amber-50', 'font-bold', 'shadow-sm');
      btn.classList.remove('border-stone-200', 'bg-white');

      hairConfigState.colorName = btn.dataset.name;
      hairConfigState.colorHex = btn.dataset.color;

      if (masterProductImg && btn.dataset.img) {
        masterProductImg.src = btn.dataset.img;
      }
      if (photoCaptionTitle) {
        photoCaptionTitle.textContent = `Славянска Коса • ${hairConfigState.colorName}`;
      }

      sound.playSparkle();
      updateMasterCustomizer();
    });
  });

  // Upsell Checkboxes
  const addBrushCb = document.getElementById('addBrushCheckbox');
  if (addBrushCb) {
    addBrushCb.addEventListener('change', (e) => {
      hairConfigState.addBrush = e.target.checked;
      sound.playLuxuryClick();
      updateMasterCustomizer();
    });
  }

  const addBookCb = document.getElementById('addBookCheckbox');
  if (addBookCb) {
    addBookCb.addEventListener('change', (e) => {
      hairConfigState.addBook = e.target.checked;
      sound.playLuxuryClick();
      updateMasterCustomizer();
    });
  }

  const addBagCb = document.getElementById('addBagCheckbox');
  if (addBagCb) {
    addBagCb.addEventListener('change', (e) => {
      hairConfigState.addBag = e.target.checked;
      sound.playLuxuryClick();
      updateMasterCustomizer();
    });
  }

  // Toggle Description View More
  const toggleDescBtn = document.getElementById('toggleDescBtn');
  const moreDesc = document.getElementById('moreDesc');
  if (toggleDescBtn && moreDesc) {
    toggleDescBtn.addEventListener('click', () => {
      const isHidden = moreDesc.classList.contains('hidden');
      if (isHidden) {
        moreDesc.classList.remove('hidden');
        toggleDescBtn.textContent = '▲ Скрий';
      } else {
        moreDesc.classList.add('hidden');
        toggleDescBtn.textContent = '▼ Покажи повече';
      }
      sound.playLuxuryClick();
    });
  }

  // Product Tabs (Specs, Comparison, Care, Reviews)
  const productTabButtons = document.querySelectorAll('.product-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  productTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      productTabButtons.forEach(b => {
        b.classList.remove('active', 'text-amber-800', 'font-bold', 'border-b-2', 'border-amber-500');
        b.classList.add('text-stone-500');
      });
      btn.classList.add('active', 'text-amber-800', 'font-bold', 'border-b-2', 'border-amber-500');
      btn.classList.remove('text-stone-500');

      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.remove('hidden');
        } else {
          pane.classList.add('hidden');
        }
      });
      sound.playLuxuryClick();
    });
  });

  // Master Add To Cart Button
  const masterAddToCartBtn = document.getElementById('masterAddToCartBtn');
  if (masterAddToCartBtn) {
    masterAddToCartBtn.addEventListener('click', () => {
      const weightRatio = hairConfigState.weight / 100;
      let baseBgn = Math.round(hairConfigState.pricePer100gBgn * weightRatio);
      let totalBgn = baseBgn + hairConfigState.methodFeeBgn;

      const mainTitle = `${hairConfigState.originLabel} (${hairConfigState.densityLabel}, ${hairConfigState.lengthLabel}, ${hairConfigState.weight}g, ${hairConfigState.colorName}, ${hairConfigState.methodName})`;
      addToCart(mainTitle, totalBgn, `custom_hair_${Date.now()}`);

      if (hairConfigState.addBrush) {
        addToCart('Четка за Екстеншъни с Естествен Глигански Косъм + Гребен DS', 35, 'upsell_brush');
      }
      if (hairConfigState.addBook) {
        addToCart('Официален Авторски Учебник (Деница Ставракиева) — ПРОМО', 39, 'upsell_book');
      }
      if (hairConfigState.addBag) {
        addToCart('Сатенен предпазен калъф и закачалка за съхранение', 25, 'upsell_bag');
      }
    });
  }

  // --- BELLAMI & LUXY HAIR BEST PRACTICES: DENSITY QUIZ & LENGTH GUIDE ---
  const densityQuizToggleBtn = document.getElementById('densityQuizToggleBtn');
  const densityQuizBox = document.getElementById('densityQuizBox');
  const closeDensityQuizBtn = document.getElementById('closeDensityQuizBtn');
  const quizRecommendedResult = document.getElementById('quizRecommendedResult');
  const applyQuizGramsBtn = document.getElementById('applyQuizGramsBtn');

  let quizState = { currentHair: 'medium', goal: 'both' };

  function updateQuizRecommendation() {
    let recGrams = 150;
    let recDesc = '150 грама (Перфектен обем и хармонично преливане)';

    if (quizState.currentHair === 'short') {
      if (quizState.goal === 'volume') {
        recGrams = 100;
        recDesc = '100 грама (За дискретно сгъстяване на карето)';
      } else if (quizState.goal === 'both') {
        recGrams = 150;
        recDesc = '150 грама (Обем + удължаване без видими стъпала)';
      } else {
        recGrams = 200;
        recDesc = '200 грама (Задължителен за късо каре към дълга коса)';
      }
    } else if (quizState.currentHair === 'medium') {
      if (quizState.goal === 'volume') {
        recGrams = 100;
        recDesc = '100 грама (Пълен естествен обем)';
      } else if (quizState.goal === 'both') {
        recGrams = 150;
        recDesc = '150 грама (Най-препоръчваният златен стандарт)';
      } else {
        recGrams = 200;
        recDesc = '200 грама (Драматична холивудска гъстота)';
      }
    } else { // long
      if (quizState.goal === 'volume') {
        recGrams = 100;
        recDesc = '100 грама (Сгъстяване на изтънените краища)';
      } else if (quizState.goal === 'both') {
        recGrams = 150;
        recDesc = '150 грама (Допълнителна дължина и дебелина)';
      } else {
        recGrams = 200;
        recDesc = '200-250 грама (Ултра-богат обем на червен килим)';
      }
    }

    if (quizRecommendedResult) quizRecommendedResult.textContent = recDesc;
    if (applyQuizGramsBtn) {
      applyQuizGramsBtn.textContent = `Приложи ${recGrams}g`;
      applyQuizGramsBtn.dataset.grams = recGrams;
    }
  }

  if (densityQuizToggleBtn && densityQuizBox) {
    densityQuizToggleBtn.addEventListener('click', () => {
      densityQuizBox.classList.toggle('hidden');
      sound.playLuxuryClick();
    });
  }
  if (closeDensityQuizBtn && densityQuizBox) {
    closeDensityQuizBtn.addEventListener('click', () => {
      densityQuizBox.classList.add('hidden');
    });
  }

  document.querySelectorAll('.density-q1-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.density-q1-btn').forEach(b => {
        b.classList.remove('active', 'bg-stone-900', 'border-stone-900', 'text-white', 'font-bold', 'shadow-sm');
        b.classList.add('bg-white', 'border-stone-200', 'text-stone-800', 'font-semibold');
      });
      btn.classList.add('active', 'bg-stone-900', 'border-stone-900', 'text-white', 'font-bold', 'shadow-sm');
      btn.classList.remove('bg-white', 'border-stone-200', 'text-stone-800', 'font-semibold');
      quizState.currentHair = btn.dataset.cur;
      updateQuizRecommendation();
      sound.playLuxuryClick();
    });
  });

  document.querySelectorAll('.density-q2-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.density-q2-btn').forEach(b => {
        b.classList.remove('active', 'bg-stone-900', 'border-stone-900', 'text-white', 'font-bold', 'shadow-sm');
        b.classList.add('bg-white', 'border-stone-200', 'text-stone-800', 'font-semibold');
      });
      btn.classList.add('active', 'bg-stone-900', 'border-stone-900', 'text-white', 'font-bold', 'shadow-sm');
      btn.classList.remove('bg-white', 'border-stone-200', 'text-stone-800', 'font-semibold');
      quizState.goal = btn.dataset.goal;
      updateQuizRecommendation();
      sound.playLuxuryClick();
    });
  });

  if (applyQuizGramsBtn) {
    applyQuizGramsBtn.addEventListener('click', () => {
      const g = applyQuizGramsBtn.dataset.grams || 150;
      const targetPill = document.querySelector(`#weightPillGroup button[data-weight="${g}"]`);
      if (targetPill) {
        targetPill.click();
      }
      if (densityQuizBox) densityQuizBox.classList.add('hidden');
      sound.playSparkle();
    });
  }

  // Length Guide Box Handlers
  const lengthGuideToggleBtn = document.getElementById('lengthGuideToggleBtn');
  const lengthGuideBox = document.getElementById('lengthGuideBox');
  const closeLengthGuideBtn = document.getElementById('closeLengthGuideBtn');

  if (lengthGuideToggleBtn && lengthGuideBox) {
    lengthGuideToggleBtn.addEventListener('click', () => {
      lengthGuideBox.classList.toggle('hidden');
      sound.playLuxuryClick();
    });
  }
  if (closeLengthGuideBtn && lengthGuideBox) {
    closeLengthGuideBtn.addEventListener('click', () => {
      lengthGuideBox.classList.add('hidden');
    });
  }

  document.querySelectorAll('.guide-len-card').forEach(card => {
    card.addEventListener('click', () => {
      const len = card.dataset.len;
      document.querySelectorAll('.guide-len-card').forEach(c => {
        c.classList.remove('active', 'bg-amber-500/20', 'border-2', 'border-amber-400');
        c.classList.add('bg-stone-800/90', 'border', 'border-stone-700');
      });
      card.classList.add('active', 'bg-amber-500/20', 'border-2', 'border-amber-400');
      card.classList.remove('bg-stone-800/90', 'border-stone-700');

      const targetLenPill = document.querySelector(`#lengthPillGroup button[data-len="${len}"]`);
      if (targetLenPill) {
        targetLenPill.click();
      }
      sound.playSparkle();
    });
  });

  updateMasterCustomizer();

  // ==========================================================================
  // 2. JAPANESE WATERFALL HEAD SPA RIPPLES CANVAS
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
        maxRadius: Math.random() * 90 + 60,
        alpha: 0.75,
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
    }, 2400);

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
        wctx.strokeStyle = `rgba(212, 175, 55, ${r.alpha * 0.7})`;
        wctx.lineWidth = 2.2;
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
  // 3. BEFORE & AFTER TRANSFORMATION SLIDER
  // ==========================================================================
  const beforeAfterContainer = document.getElementById('beforeAfterContainer');
  const transBeforeLayer = document.getElementById('transBeforeLayer');
  const dragHandle = document.getElementById('dragHandle');
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

  // ==========================================================================
  // 4. SHOPPING CART ENGINE
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
    const cartRemainder = document.getElementById('cartRemainder');
    const remainder = Math.max(0, totalPrice - 39);
    if (cartRemainder) cartRemainder.textContent = `${remainder} лв.`;

    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="text-center py-10 text-stone-500 text-xs font-mono">
            Кошницата ви е празна.
          </div>
        `;
      } else {
        cartItemsContainer.innerHTML = cart.map((item, idx) => `
          <div class="p-3.5 bg-stone-50 rounded-2xl border border-gold-500/20 flex items-center justify-between gap-3 shadow-sm">
            <div>
              <div class="text-xs font-bold text-stone-900 font-cinzel">${item.title}</div>
              <div class="text-[11px] text-gold-700 font-mono font-bold">${item.price} лв. × ${item.qty}</div>
            </div>
            <button class="remove-cart-item text-stone-400 hover:text-rose-500 p-1.5 transition-colors" data-idx="${idx}">
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
      window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
    updateCartUI();
    openCart();
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title;
      const price = parseInt(btn.dataset.price, 10);
      addToCart(title, price, btn.dataset.id);
    });
  });

  const addCustomHairToCartBtn = document.getElementById('addCustomHairToCartBtn');
  if (addCustomHairToCartBtn) {
    addCustomHairToCartBtn.addEventListener('click', () => {
      const weightFactor = hairConfigState.weight / 100;
      const totalBgn = Math.round(hairConfigState.pricePer100gBgn * weightFactor);
      const totalEur = Math.round(hairConfigState.pricePer100gEur * weightFactor);
      const title = `Славянска Коса DS (${hairConfigState.lengthLabel}, ${hairConfigState.weight}g, ${hairConfigState.colorName})`;
      addToCart(title, totalBgn, `custom_hair_${Date.now()}`);
    });
  }

  // ==========================================================================
  // 4.1 HAIR ORDER & 20 EUR DEPOSIT UNIQUE CLIENT CODE SYSTEM
  // ==========================================================================
  const hairOrderCheckoutModal = document.getElementById('hairOrderCheckoutModal');
  const closeHairOrderCheckoutBtn = document.getElementById('closeHairOrderCheckoutBtn');
  const closeHairOrderModalBackdrop = document.getElementById('closeHairOrderModalBackdrop');
  const hairOrderForm = document.getElementById('hairOrderForm');
  const checkoutOrderTotalDisplay = document.getElementById('checkoutOrderTotalDisplay');
  const checkoutOrderRemainderDisplay = document.getElementById('checkoutOrderRemainderDisplay');
  const checkoutOrderItemsList = document.getElementById('checkoutOrderItemsList');

  const orderCodeReceiptModal = document.getElementById('orderCodeReceiptModal');
  const closeOrderReceiptBtn = document.getElementById('closeOrderReceiptBtn');
  const closeOrderReceiptBackdrop = document.getElementById('closeOrderReceiptBackdrop');
  const receiptUniqueCode = document.getElementById('receiptUniqueCode');
  const receiptPaymentReason = document.getElementById('receiptPaymentReason');
  const receiptRemainderBgn = document.getElementById('receiptRemainderBgn');
  const receiptWhatsAppLink = document.getElementById('receiptWhatsAppLink');
  const copyReceiptCodeBtn = document.getElementById('copyReceiptCodeBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyIbanBtn = document.getElementById('copyIbanBtn');
  const ibanCodeText = document.getElementById('ibanCodeText');

  const masterDirectOrderBtn = document.getElementById('masterDirectOrderBtn');

  const trackOrderModal = document.getElementById('trackOrderModal');
  const trackOrderTopBtn = document.getElementById('trackOrderTopBtn');
  const trackOrderHeaderBtn = document.getElementById('trackOrderHeaderBtn');
  const closeTrackOrderBtn = document.getElementById('closeTrackOrderBtn');
  const closeTrackOrderBackdrop = document.getElementById('closeTrackOrderBackdrop');
  const trackCodeInput = document.getElementById('trackCodeInput');
  const submitTrackCodeBtn = document.getElementById('submitTrackCodeBtn');
  const trackResultContainer = document.getElementById('trackResultContainer');

  let activeCheckoutContext = null;

  function openHairOrderCheckout(items, totalBgn, totalEur, source = 'direct') {
    activeCheckoutContext = { items, totalBgn, totalEur, source };
    if (checkoutOrderTotalDisplay) checkoutOrderTotalDisplay.textContent = `${totalBgn} лв. (${totalEur} €)`;
    const remainder = Math.max(0, totalBgn - 39);
    if (checkoutOrderRemainderDisplay) checkoutOrderRemainderDisplay.textContent = `${remainder} лв.`;

    if (checkoutOrderItemsList) {
      checkoutOrderItemsList.innerHTML = items.map(it => `
        <div class="flex items-center justify-between py-1 border-b border-amber-100 last:border-0">
          <span class="font-medium">${it.title}</span>
          <span class="font-mono font-bold text-amber-900">${it.price} лв. ${it.qty > 1 ? `× ${it.qty}` : ''}</span>
        </div>
      `).join('');
    }

    if (hairOrderCheckoutModal) hairOrderCheckoutModal.classList.remove('hidden');
    sound.playLuxuryClick();
  }

  function closeHairOrderCheckout() {
    if (hairOrderCheckoutModal) hairOrderCheckoutModal.classList.add('hidden');
  }

  if (closeHairOrderCheckoutBtn) closeHairOrderCheckoutBtn.addEventListener('click', closeHairOrderCheckout);
  if (closeHairOrderModalBackdrop) closeHairOrderModalBackdrop.addEventListener('click', closeHairOrderCheckout);

  function openOrderCodeReceipt(order) {
    if (receiptUniqueCode) receiptUniqueCode.textContent = order.code;
    if (receiptPaymentReason) receiptPaymentReason.textContent = `${order.code} - ${order.name}`;
    if (receiptRemainderBgn) receiptRemainderBgn.textContent = `${order.remainderBgn} лв.`;

    const itemsSummary = order.items.map(i => i.title).join(', ');
    const waMsg = `Здравейте Деница! Направих 20 евро (39 лв.) капаро за поръчка с уникален код: ${order.code}.\nИме: ${order.name}\nТелефон: ${order.phone}\nДоставка: ${order.address}\nПоръчана коса: ${itemsSummary}\nОстатък при куриера: ${order.remainderBgn} лв.\nПрикачвам платежното за потвърждение и изпращане!`;
    if (receiptWhatsAppLink) {
      receiptWhatsAppLink.href = `https://wa.me/359893022677?text=${encodeURIComponent(waMsg)}`;
    }

    if (orderCodeReceiptModal) orderCodeReceiptModal.classList.remove('hidden');
    sound.playSparkle();
    if (window.confetti) {
      window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }
  }

  function closeOrderCodeReceipt() {
    if (orderCodeReceiptModal) orderCodeReceiptModal.classList.add('hidden');
  }

  if (closeOrderReceiptBtn) closeOrderReceiptBtn.addEventListener('click', closeOrderCodeReceipt);
  if (closeOrderReceiptBackdrop) closeOrderReceiptBackdrop.addEventListener('click', closeOrderCodeReceipt);

  if (copyReceiptCodeBtn) {
    copyReceiptCodeBtn.addEventListener('click', () => {
      const code = receiptUniqueCode?.textContent?.trim() || '';
      if (code) {
        navigator.clipboard.writeText(code);
        if (copyBtnText) copyBtnText.textContent = '✅ Копиран!';
        sound.playLuxuryClick();
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Копирай Кода';
        }, 2500);
      }
    });
  }

  if (copyIbanBtn && ibanCodeText) {
    copyIbanBtn.addEventListener('click', () => {
      const iban = ibanCodeText.textContent.trim();
      navigator.clipboard.writeText(iban);
      copyIbanBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i>';
      sound.playLuxuryClick();
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        copyIbanBtn.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i>';
        if (window.lucide) window.lucide.createIcons();
      }, 2500);
    });
  }

  // Master Direct Order button from hair configurator
  if (masterDirectOrderBtn) {
    masterDirectOrderBtn.addEventListener('click', () => {
      const weightRatio = hairConfigState.weight / 100;
      let baseEur = Math.round(hairConfigState.pricePer100gEur * weightRatio);
      let baseBgn = Math.round(hairConfigState.pricePer100gBgn * weightRatio);
      let totalEur = baseEur + hairConfigState.methodFeeEur;
      let totalBgn = baseBgn + hairConfigState.methodFeeBgn;

      const items = [{
        title: `${hairConfigState.originLabel} (${hairConfigState.densityLabel}, ${hairConfigState.lengthLabel}, ${hairConfigState.weight}g, ${hairConfigState.colorName}, ${hairConfigState.methodName})`,
        price: baseBgn + hairConfigState.methodFeeBgn,
        qty: 1
      }];

      if (hairConfigState.addBrush) {
        items.push({ title: 'Специална Четка за Екстеншъни DS с Глигански Косъм', price: 35, qty: 1 });
        totalBgn += 35;
        totalEur += 18;
      }
      if (hairConfigState.addBook) {
        items.push({ title: 'Официален Авторски Учебник (Деница Ставракиева) — ПРОМО', price: 39, qty: 1 });
        totalBgn += 39;
        totalEur += 20;
      }
      if (hairConfigState.addBag) {
        items.push({ title: 'Луксозен предпазен сатенен калъф и закачалка', price: 25, qty: 1 });
        totalBgn += 25;
        totalEur += 13;
      }

      openHairOrderCheckout(items, totalBgn, totalEur, 'direct');
    });
  }

  // Checkout button in cart drawer
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Моля, добавете продукт в кошницата!');
        return;
      }
      const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const totalEur = Math.round(totalPrice / 1.95583);
      closeCart();
      openHairOrderCheckout(cart, totalPrice, totalEur, 'cart');
    });
  }

  // Form submission: Generate Unique Code & Record Order
  if (hairOrderForm) {
    hairOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('orderInputName')?.value.trim();
      const phone = document.getElementById('orderInputPhone')?.value.trim();
      const address = document.getElementById('orderInputAddress')?.value.trim();
      const notes = document.getElementById('orderInputNotes')?.value.trim() || '';

      if (!name || !phone || !address) {
        alert('Моля, попълнете всички задължителни полета за доставка!');
        return;
      }

      const uniqueNum = Math.floor(100000 + Math.random() * 900000);
      const orderCode = `DS-${uniqueNum}`;

      const totalBgn = activeCheckoutContext?.totalBgn || 0;
      const totalEur = activeCheckoutContext?.totalEur || 0;
      const remainderBgn = Math.max(0, totalBgn - 39);

      const orderData = {
        code: orderCode,
        name,
        phone,
        address,
        notes,
        items: activeCheckoutContext?.items || [],
        totalBgn,
        totalEur,
        depositEur: 20,
        depositBgn: 39,
        remainderBgn,
        status: 'pending_deposit',
        createdAt: new Date().toISOString()
      };

      try {
        const savedOrders = JSON.parse(localStorage.getItem('ds_hair_orders') || '[]');
        savedOrders.unshift(orderData);
        localStorage.setItem('ds_hair_orders', JSON.stringify(savedOrders));
      } catch (err) {
        console.error('Storage error:', err);
      }

      if (activeCheckoutContext?.source === 'cart') {
        cart = [];
        updateCartUI();
      }

      closeHairOrderCheckout();
      hairOrderForm.reset();
      openOrderCodeReceipt(orderData);
    });
  }

  // Track Order By Code Logic
  function openTrackOrderModal() {
    if (trackOrderModal) trackOrderModal.classList.remove('hidden');
    sound.playLuxuryClick();
  }

  function closeTrackOrderModal() {
    if (trackOrderModal) trackOrderModal.classList.add('hidden');
  }

  if (trackOrderTopBtn) trackOrderTopBtn.addEventListener('click', openTrackOrderModal);
  if (trackOrderHeaderBtn) trackOrderHeaderBtn.addEventListener('click', openTrackOrderModal);
  if (closeTrackOrderBtn) closeTrackOrderBtn.addEventListener('click', closeTrackOrderModal);
  if (closeTrackOrderBackdrop) closeTrackOrderBackdrop.addEventListener('click', closeTrackOrderModal);

  if (submitTrackCodeBtn) {
    submitTrackCodeBtn.addEventListener('click', () => {
      const enteredCode = trackCodeInput?.value?.trim().toUpperCase();
      if (!enteredCode) {
        alert('Моля, въведете клиентски код (напр. DS-123456)!');
        return;
      }

      let found = null;
      try {
        const savedOrders = JSON.parse(localStorage.getItem('ds_hair_orders') || '[]');
        found = savedOrders.find(o => o.code === enteredCode);
      } catch (err) {}

      if (trackResultContainer) {
        trackResultContainer.classList.remove('hidden');
        if (found) {
          trackResultContainer.innerHTML = `
            <div class="flex items-center justify-between border-b border-stone-200 pb-2">
              <span class="font-bold text-stone-900 font-cinzel">Код: ${found.code}</span>
              <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">Очаква верификация на капарото</span>
            </div>
            <div class="space-y-1 text-[11px] text-stone-600">
              <div><strong>Клиент:</strong> ${found.name} (${found.phone})</div>
              <div><strong>Адрес за доставка:</strong> ${found.address}</div>
              <div><strong>Обща стойност:</strong> ${found.totalBgn} лв.</div>
              <div><strong>Капаро:</strong> 20 € (39 лв.) | <strong>Остатък при куриера:</strong> ${found.remainderBgn} лв.</div>
            </div>
            <div class="pt-2 border-t border-stone-200">
              <a href="https://wa.me/359893022677?text=${encodeURIComponent(`Здравейте Деница! Проверявам статус на поръчка с код ${found.code}. Изпращам доказателство за преведено капаро.`)}" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                <i data-lucide="message-circle" class="w-4 h-4"></i>
                <span>Докажи плащането в WhatsApp</span>
              </a>
            </div>
          `;
        } else {
          trackResultContainer.innerHTML = `
            <div class="text-stone-700 leading-relaxed">
              Код <strong>${enteredCode}</strong> е въведен. За директно финализиране и проверка на плащането, свържете се с Деница:
            </div>
            <div class="pt-2">
              <a href="https://wa.me/359893022677?text=${encodeURIComponent(`Здравейте Деница! Направих капаро по поръчка с код ${enteredCode}. Изпращам платежно за потвърждение и изпращане на косата.`)}" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                <i data-lucide="message-circle" class="w-4 h-4"></i>
                <span>Изпрати доказателство в WhatsApp</span>
              </a>
            </div>
          `;
        }
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // ==========================================================================
  // 5. ONLINE BOOKING SYSTEM & CALENDAR (.ICS)
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
        alert('Моля, изберете поне една услуга или коса!');
        return;
      }
      if (!name || !phone) {
        alert('Моля, въведете вашето име и телефонен номер за контакт!');
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
          Скъпа <strong>${name}</strong>, вашият час за <strong>${selectedServices.join(', ')}</strong> на дата <strong>${date}</strong> от <strong>${time} ч.</strong> е регистриран успешно! Деница ще се свърже с вас за финално потвърждение.
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
        'PRODID:-//Hair Extensions DS//BG',
        'BEGIN:VEVENT',
        `SUMMARY:HAIR EXTENSIONS DS — ${selectedServices[0]}`,
        `DESCRIPTION:Процедура/Консултация при Деница: ${selectedServices.join(', ')}. Клиент: ${name}. Телефон: +359893022677`,
        'LOCATION:Hair Extensions DS Studio, Sofia / Varna',
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `Hair_Extensions_DS_${date}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      sound.playSparkle();
    });
  }

  // --- STYLIST GREETING WIDGET (MILA SAVAGE STYLE) ---
  const stylistGreetingBtn = document.getElementById('stylistGreetingBtn');
  const stylistGreetingPopup = document.getElementById('stylistGreetingPopup');
  if (stylistGreetingBtn && stylistGreetingPopup) {
    stylistGreetingBtn.addEventListener('click', () => {
      stylistGreetingPopup.classList.toggle('hidden');
      sound.playLuxuryClick();
    });
  }

  // --- PROCEDURE CARDS MULTI-CITY & VIP BOOKING HANDLER ---
  document.querySelectorAll('a[href="#booking"]').forEach(link => {
    link.addEventListener('click', () => {
      const targetCity = link.dataset.city;
      const isVip = link.dataset.vip;
      const targetService = link.dataset.service;

      if (targetCity === 'София') {
        const r = document.getElementById('cityRadioSofia');
        if (r) r.checked = true;
      } else if (targetCity === 'Варна') {
        const r = document.getElementById('cityRadioVarna');
        if (r) r.checked = true;
      } else if (isVip) {
        const r = document.getElementById('cityRadioVIP');
        if (r) r.checked = true;
      }

      if (targetService) {
        const checkboxes = document.querySelectorAll('input[name="service"]');
        checkboxes.forEach(cb => {
          if (cb.value.includes(targetService) || targetService.includes(cb.value)) {
            cb.checked = true;
          }
        });
        calculateBookingTotal();
      }

      sound.playLuxuryClick();
    });
  });

  // --- OFFICIAL TEXTBOOK SHOWCASE & LIGHTBOX PREVIEW (COVER & TOC ONLY) ---
  const bookTabCover = document.getElementById('bookTabCover');
  const bookTabContents = document.getElementById('bookTabContents');
  const bookMainPreviewImg = document.getElementById('bookMainPreviewImg');
  const bookPreviewBadge = document.getElementById('bookPreviewBadge');
  const bookImageContainer = document.getElementById('bookImageContainer');

  const bookLightboxModal = document.getElementById('bookLightboxModal');
  const bookLightboxBackdrop = document.getElementById('bookLightboxBackdrop');
  const closeBookLightboxBtn = document.getElementById('closeBookLightboxBtn');
  const bookLightboxOpenBtn = document.getElementById('bookLightboxOpenBtn');
  const modalBookImg = document.getElementById('modalBookImg');
  const modalBookCoverTab = document.getElementById('modalBookCoverTab');
  const modalBookTocTab = document.getElementById('modalBookTocTab');

  function setBookPreview(type) {
    if (type === 'contents') {
      if (bookMainPreviewImg) bookMainPreviewImg.src = 'assets/book_contents_page.jpg';
      if (modalBookImg) modalBookImg.src = 'assets/book_contents_page.jpg';
      
      if (bookTabContents) {
        bookTabContents.classList.add('active', 'bg-white', 'text-stone-900', 'shadow-sm', 'border', 'border-stone-200', 'font-bold');
        bookTabContents.classList.remove('text-stone-600');
      }
      if (bookTabCover) {
        bookTabCover.classList.remove('active', 'bg-white', 'text-stone-900', 'shadow-sm', 'border', 'border-stone-200', 'font-bold');
        bookTabCover.classList.add('text-stone-600');
      }
      if (modalBookTocTab) {
        modalBookTocTab.className = 'px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300';
      }
      if (modalBookCoverTab) {
        modalBookCoverTab.className = 'px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-stone-100 text-stone-700 hover:bg-amber-50';
      }
    } else {
      if (bookMainPreviewImg) bookMainPreviewImg.src = 'assets/book_cover_front.jpg';
      if (modalBookImg) modalBookImg.src = 'assets/book_cover_front.jpg';

      if (bookTabCover) {
        bookTabCover.classList.add('active', 'bg-white', 'text-stone-900', 'shadow-sm', 'border', 'border-stone-200', 'font-bold');
        bookTabCover.classList.remove('text-stone-600');
      }
      if (bookTabContents) {
        bookTabContents.classList.remove('active', 'bg-white', 'text-stone-900', 'shadow-sm', 'border', 'border-stone-200', 'font-bold');
        bookTabContents.classList.add('text-stone-600');
      }
      if (modalBookCoverTab) {
        modalBookCoverTab.className = 'px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300';
      }
      if (modalBookTocTab) {
        modalBookTocTab.className = 'px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-stone-100 text-stone-700 hover:bg-amber-50';
      }
    }
  }

  if (bookTabCover) {
    bookTabCover.addEventListener('click', () => {
      setBookPreview('cover');
      sound.playLuxuryClick();
    });
  }
  if (bookTabContents) {
    bookTabContents.addEventListener('click', () => {
      setBookPreview('contents');
      sound.playLuxuryClick();
    });
  }

  function openBookLightbox() {
    if (bookLightboxModal) {
      bookLightboxModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      sound.playSparkle();
    }
  }
  function closeBookLightbox() {
    if (bookLightboxModal) {
      bookLightboxModal.classList.add('hidden');
      document.body.style.overflow = '';
      sound.playLuxuryClick();
    }
  }

  if (bookImageContainer) bookImageContainer.addEventListener('click', openBookLightbox);
  if (bookLightboxOpenBtn) bookLightboxOpenBtn.addEventListener('click', openBookLightbox);
  if (closeBookLightboxBtn) closeBookLightboxBtn.addEventListener('click', closeBookLightbox);
  if (bookLightboxBackdrop) bookLightboxBackdrop.addEventListener('click', closeBookLightbox);

  if (modalBookCoverTab) {
    modalBookCoverTab.addEventListener('click', () => {
      setBookPreview('cover');
      sound.playLuxuryClick();
    });
  }
  if (modalBookTocTab) {
    modalBookTocTab.addEventListener('click', () => {
      setBookPreview('contents');
      sound.playLuxuryClick();
    });
  }
});

