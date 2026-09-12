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
  // 1. MASTER SLAVIC HAIR CUSTOMIZER & PRODUCT SHOWCASE (DIVERSO-CRUSHING)
  // ==========================================================================
  const hairConfigState = {
    length: 55,
    lengthLabel: '55 см',
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
      totalBgn += 65;
      totalEur += 33;
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
    if (activeLenBadge) activeLenBadge.textContent = `${hairConfigState.lengthLabel} (${totalEur} €)`;

    // 3. Update Title & Specs
    const masterTitle = document.getElementById('masterProductTitle');
    if (masterTitle) {
      masterTitle.textContent = `100% Сурова Славянска Коса на Треса – Дължина ${hairConfigState.lengthLabel}, цвят ${hairConfigState.colorName}`;
    }

    const specLength = document.getElementById('specLength');
    if (specLength) specLength.textContent = `${hairConfigState.lengthLabel} (Double Drawn)`;

    const specWeight = document.getElementById('specWeight');
    if (specWeight) specWeight.textContent = `${hairConfigState.weight} грама (${hairConfigState.weight >= 200 ? 'Mega Плътен Обем' : 'Стандартен Пълен Обем'})`;

    const specColor = document.getElementById('specColor');
    if (specColor) specColor.textContent = hairConfigState.colorName;

    // 4. Update Section Labels
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

  // Length Pill Buttons
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

      const mainTitle = `Славянска Коса DS (${hairConfigState.lengthLabel}, ${hairConfigState.weight}g, ${hairConfigState.colorName}, ${hairConfigState.methodName})`;
      addToCart(mainTitle, totalBgn, `custom_hair_${Date.now()}`);

      if (hairConfigState.addBrush) {
        addToCart('Специална Четка за Екстеншъни DS Loop Brush', 35, 'upsell_brush');
      }
      if (hairConfigState.addBook) {
        addToCart('Официален Авторски Учебник (DS Manual)', 65, 'upsell_book');
      }
      if (hairConfigState.addBag) {
        addToCart('Сатенен предпазен калъф и закачалка', 25, 'upsell_bag');
      }
    });
  }

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
      alert('Благодарим ви! Вашата заявка към Hair Extensions DS е приета. Наш консултант ще се свърже с вас на посочения номер за потвърждение на адреса за доставка със Спиди / Еконт или позвънете директно на 0893 02 26 77.');
      cart = [];
      updateCartUI();
      closeCart();
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
      }

      sound.playLuxuryClick();
    });
  });
});

