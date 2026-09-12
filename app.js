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
  // 1. HAIR EXTENSIONS DS CONFIGURATOR & PRICE CALCULATOR
  // Official Prices by Denitsa:
  // - 45 cm: 160€ (310 лв.) / 100g
  // - 55 cm: 190€ (370 лв.) / 100g
  // - 65-70 cm: 230€ (450 лв.) / 100g
  // - 75-80 cm: 270€ (530 лв.) / 100g
  // ==========================================================================
  const hairConfigState = {
    length: 55,
    lengthLabel: '55 см',
    pricePer100gEur: 190,
    pricePer100gBgn: 370,
    weight: 100,
    colorHex: '#2a1d17',
    colorName: '#2 Тъмен Шоколад',
    method: 'keratin',
    methodName: 'Кератинови микро-капсули'
  };

  const hairDisplayImg = document.getElementById('hairDisplayImg');
  const hairThumbBtns = document.querySelectorAll('.hair-thumb-btn');
  hairThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hairThumbBtns.forEach(b => {
        b.classList.remove('border-2', 'border-gold-500', 'active');
        b.classList.add('border', 'border-stone-300');
      });
      btn.classList.add('border-2', 'border-gold-500', 'active');
      btn.classList.remove('border-stone-300');
      if (hairDisplayImg && btn.dataset.img) {
        hairDisplayImg.src = btn.dataset.img;
      }
      sound.playLuxuryClick();
    });
  });

  function updateHairConfigurator() {
    // 1. Calculate Price based on weight ratio (weight / 100)
    const weightFactor = hairConfigState.weight / 100;
    const totalEur = Math.round(hairConfigState.pricePer100gEur * weightFactor);
    const totalBgn = Math.round(hairConfigState.pricePer100gBgn * weightFactor);

    // 2. Update Live Price Displays
    const eurDisplay = document.getElementById('calculatedPriceEur');
    if (eurDisplay) eurDisplay.textContent = `${totalEur} €`;

    const bgnDisplay = document.getElementById('calculatedPriceBgn');
    if (bgnDisplay) bgnDisplay.textContent = `(${totalBgn} лв.)`;

    // 3. Update Labels
    const lenDisplay = document.getElementById('lengthValueDisplay');
    if (lenDisplay) {
      lenDisplay.textContent = `${hairConfigState.lengthLabel} — ${hairConfigState.pricePer100gEur}€ (${hairConfigState.pricePer100gBgn} лв.) / 100g`;
    }

    const weightDisplay = document.getElementById('weightValueDisplay');
    if (weightDisplay) {
      const volDesc = hairConfigState.weight <= 50 ? 'Сгъстяване' : (hairConfigState.weight <= 100 ? 'Стандартен Пълен Обем' : 'Mega Плътен Обем');
      weightDisplay.textContent = `${hairConfigState.weight} грама (${volDesc})`;
    }

    const simHairTitle = document.getElementById('simHairTitle');
    if (simHairTitle) {
      simHairTitle.textContent = `Славянска Коса • ${hairConfigState.lengthLabel} (${totalEur}€)`;
    }

    const simShadeName = document.getElementById('simShadeName');
    if (simShadeName) simShadeName.textContent = hairConfigState.colorName;

    const selectedShadeLabel = document.getElementById('selectedShadeLabel');
    if (selectedShadeLabel) selectedShadeLabel.textContent = hairConfigState.colorName;

    const simMethodName = document.getElementById('simMethodName');
    if (simMethodName) simMethodName.textContent = hairConfigState.methodName;
  }

  // Length Buttons
  const lengthButtons = document.querySelectorAll('.len-btn');
  lengthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lengthButtons.forEach(b => {
        b.classList.remove('active', 'border-2', 'border-gold-500', 'bg-gold-500/15');
        b.classList.add('border', 'border-stone-300', 'bg-white');
      });
      btn.classList.add('active', 'border-2', 'border-gold-500', 'bg-gold-500/15');
      btn.classList.remove('border-stone-300', 'bg-white');

      hairConfigState.length = parseInt(btn.dataset.len, 10);
      hairConfigState.lengthLabel = btn.querySelector('.text-xs')?.textContent.trim() || `${btn.dataset.len} см`;
      hairConfigState.pricePer100gEur = parseInt(btn.dataset.eur, 10);
      hairConfigState.pricePer100gBgn = parseInt(btn.dataset.bgn, 10);

      sound.playLuxuryClick();
      updateHairConfigurator();
    });
  });

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
  const colorDots = document.querySelectorAll('#colorPalette .color-dot');
  colorDots.forEach(btn => {
    btn.addEventListener('click', () => {
      colorDots.forEach(b => {
        b.classList.remove('active', 'border-gold-500');
        b.classList.add('border-stone-300');
      });
      btn.classList.add('active', 'border-gold-500');
      btn.classList.remove('border-stone-300');

      hairConfigState.colorHex = btn.dataset.color;
      hairConfigState.colorName = btn.dataset.name;

      sound.playSparkle();
      updateHairConfigurator();
    });
  });

  // Method Selector
  const methodButtons = document.querySelectorAll('#methodSelector .method-btn');
  methodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      methodButtons.forEach(b => {
        b.classList.remove('active', 'border-gold-500', 'bg-gold-500/15');
        b.classList.add('border-stone-300', 'bg-white');
      });
      btn.classList.add('active', 'border-gold-500', 'bg-gold-500/15');
      btn.classList.remove('border-stone-300', 'bg-white');

      hairConfigState.method = btn.dataset.method;
      hairConfigState.methodName = btn.textContent.trim();

      sound.playLuxuryClick();
      updateHairConfigurator();
    });
  });

  updateHairConfigurator();

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
});
