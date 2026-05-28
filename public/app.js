document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation & Theme Toggle
  // ==========================================
  const navbar   = document.querySelector('.navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu  = document.getElementById('navMenu');
  const themeToggle = document.querySelector('.theme-toggle');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  const saved = localStorage.getItem('pptheme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', (saved === 'dark' || (!saved && prefersDark)) ? 'dark' : 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pptheme', next);
    });
  }

  // ==========================================
  // 2. Before / After Slider
  // ==========================================
  const sliderContainer = document.querySelector('.comparison-slider');
  const afterImage = document.querySelector('.image-after');
  const handle = document.querySelector('.slider-handle');

  if (sliderContainer && afterImage && handle) {
    let isDragging = false;

    const moveSlider = clientX => {
      const rect = sliderContainer.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      afterImage.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
      handle.style.left = `${pct}%`;
    };

    sliderContainer.addEventListener('mousedown', e => { isDragging = true; e.preventDefault(); moveSlider(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', e => { if (isDragging) moveSlider(e.clientX); });
    sliderContainer.addEventListener('touchstart', e => { isDragging = true; if (e.touches[0]) moveSlider(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    sliderContainer.addEventListener('touchmove', e => { if (isDragging && e.touches[0]) moveSlider(e.touches[0].clientX); }, { passive: true });
  }

  // ==========================================
  // 3. Service Advisor Quiz (Dog Training)
  // ==========================================
  const quizData = [
    {
      question: "¿Cuál es el principal problema con tu perro?",
      options: [
        { text: "Tira de la correa y no obedece órdenes básicas", score: "basico" },
        { text: "Agresividad, miedo o reactividad hacia personas/perros", score: "conducta" },
        { text: "Conductas destructivas o ansiedad en casa", score: "domicilio" },
        { text: "Quiero que aprenda desde cachorro", score: "basico" }
      ]
    },
    {
      question: "¿Cuánto tiempo lleva el problema?",
      options: [
        { text: "Es muy reciente o ni ha empezado aún (cachorro)", score: "basico" },
        { text: "Lleva unos meses", score: "basico" },
        { text: "Más de un año, se ha agravado con el tiempo", score: "conducta" },
        { text: "Siempre ha sido así, es su carácter", score: "conducta" }
      ]
    },
    {
      question: "¿Has intentado solucionarlo antes?",
      options: [
        { text: "Nunca, empezamos de cero", score: "basico" },
        { text: "Sí, en casa, pero sin resultado", score: "conducta" },
        { text: "Prefiero que vengan directamente a mi casa", score: "domicilio" },
        { text: "Me gustaría una valoración primero", score: "general" }
      ]
    },
    {
      question: "¿Cómo prefieres que empecemos?",
      options: [
        { text: "Por WhatsApp, ahora mismo", score: "basico" },
        { text: "Con una valoración presencial gratuita", score: "general" },
        { text: "Que vengan a mi casa directamente", score: "domicilio" },
        { text: "Necesito más información primero", score: "general" }
      ]
    }
  ];

  const quizResults = {
    basico: {
      title: "¡El Adiestramiento Básico es para ti!",
      desc: "Tu perro necesita aprender las órdenes esenciales y mejorar el control del paseo. Con metodología positiva y constancia, los resultados llegan rápido.",
      plan: "Adiestramiento Básico",
      waText: "Hola%2C%20el%20consultor%20de%20Pap%C3%A0%20Perruno%20me%20ha%20recomendado%20el%20adiestramiento%20b%C3%A1sico%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n."
    },
    conducta: {
      title: "¡El Control de Conducta es lo que necesitas!",
      desc: "Tu perro presenta comportamientos que requieren un diagnóstico personalizado. Trabajamos el problema desde la raíz con un plan adaptado.",
      plan: "Control de Conducta",
      waText: "Hola%2C%20el%20consultor%20me%20ha%20recomendado%20el%20control%20de%20conducta%20y%20quiero%20consultar%20disponibilidad."
    },
    domicilio: {
      title: "¡El Adiestramiento a Domicilio es ideal!",
      desc: "Trabajar en el entorno del perro acelera el aprendizaje y facilita la consolidación de los hábitos. Vamos a tu casa en Sevilla.",
      plan: "Adiestramiento a Domicilio",
      waText: "Hola%2C%20el%20consultor%20me%20ha%20recomendado%20el%20adiestramiento%20a%20domicilio%20y%20quiero%20saber%20disponibilidad."
    },
    general: {
      title: "¡Consúltanos sin compromiso!",
      desc: "Cuéntanos la situación de tu perro y te orientamos sobre el mejor servicio. La valoración inicial no compromete a nada.",
      plan: "Consulta Gratuita",
      waText: "Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20adiestramiento%20canino%20en%20Sevilla."
    }
  };

  let currentStep = 0;
  const userAnswers = [];

  const quizStep    = document.getElementById('quiz-step');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const btnPrev     = document.getElementById('btn-prev');
  const btnNext     = document.getElementById('btn-next');
  const progressFill = document.getElementById('progress-fill');
  const stepCount   = document.getElementById('step-count');
  const quizResult  = document.getElementById('quiz-result');
  const resultTitle = document.getElementById('result-title');
  const resultDesc  = document.getElementById('result-desc');
  const recTitle    = document.getElementById('rec-title');
  const recDesc     = document.getElementById('rec-desc');
  const btnRestart  = document.getElementById('btn-restart');
  const btnWaResult = document.getElementById('btn-whatsapp-result');

  function initQuiz() {
    if (!quizStep) return;
    currentStep = 0;
    userAnswers.length = 0;
    quizResult.classList.remove('active');
    quizStep.classList.add('active');
    if (btnPrev) btnPrev.style.visibility = 'hidden';
    if (btnNext) btnNext.innerText = 'Siguiente';
    showQuestion();
  }

  function showQuestion() {
    if (!quizStep) return;
    const q = quizData[currentStep];
    if (!q) return;

    quizQuestion.innerText = q.question;
    quizOptions.innerHTML = '';

    progressFill.style.width = `${(currentStep / quizData.length) * 100}%`;
    stepCount.innerText = `Paso ${currentStep + 1} de ${quizData.length}`;

    q.options.forEach((opt, idx) => {
      const el = document.createElement('div');
      el.classList.add('quiz-option');
      if (userAnswers[currentStep] === idx) el.classList.add('selected');
      el.innerHTML = `<div class="quiz-radio"></div><div class="quiz-option-text">${opt.text}</div>`;
      el.addEventListener('click', () => {
        document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        userAnswers[currentStep] = idx;
        if (btnNext) btnNext.disabled = false;
      });
      quizOptions.appendChild(el);
    });

    if (btnNext) btnNext.disabled = (userAnswers[currentStep] === undefined);
    if (btnPrev) btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    if (btnNext) btnNext.innerText = currentStep === quizData.length - 1 ? 'Ver resultado' : 'Siguiente';
  }

  function showResults() {
    if (!quizStep || !quizResult) return;
    quizStep.classList.remove('active');
    quizResult.classList.add('active');
    progressFill.style.width = '100%';
    stepCount.innerText = 'Resultado';

    const scores = { basico: 0, conducta: 0, domicilio: 0, general: 0 };
    userAnswers.forEach((ansIdx, qIdx) => {
      if (quizData[qIdx]?.options[ansIdx]) scores[quizData[qIdx].options[ansIdx].score]++;
    });

    let finalRec = 'basico', maxScore = -1;
    Object.entries(scores).forEach(([k, v]) => { if (v > maxScore) { maxScore = v; finalRec = k; } });

    const res = quizResults[finalRec];
    if (resultTitle) resultTitle.innerText = res.title;
    if (resultDesc)  resultDesc.innerText  = res.desc;
    if (recTitle) recTitle.innerHTML = `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;flex-shrink:0;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Servicio sugerido: ${res.plan}`;
    if (recDesc)  recDesc.innerText = res.desc;
    if (btnWaResult) btnWaResult.href = `https://wa.me/34640128247?text=${res.waText}`;
  }

  if (btnNext) btnNext.addEventListener('click', () => {
    if (currentStep < quizData.length - 1) { currentStep++; showQuestion(); }
    else showResults();
  });
  if (btnPrev) btnPrev.addEventListener('click', () => { if (currentStep > 0) { currentStep--; showQuestion(); } });
  if (btnRestart) btnRestart.addEventListener('click', initQuiz);
  initQuiz();

  // ==========================================
  // 4. Sessions Calculator
  // ==========================================
  const pkgBasico   = document.getElementById('pkg-basico');
  const pkgConducta = document.getElementById('pkg-conducta');
  const pkgDomicilio = document.getElementById('pkg-domicilio');
  const rangeSessions = document.getElementById('range-sessions');
  const sessionCountVal = document.getElementById('session-count-val');
  const addonEval = document.getElementById('addon-eval');

  const summaryPkgName  = document.getElementById('summary-package-name');
  const summaryPkgPrice = document.getElementById('summary-package-price');
  const summaryCount    = document.getElementById('summary-sessions-count');
  const summarySubtotal = document.getElementById('summary-sessions-price');
  const summaryAddons   = document.getElementById('summary-addons-list');
  const summaryExtras   = document.getElementById('summary-addons-price');
  const summaryTotal    = document.getElementById('summary-total-price');
  const waCalcBtn       = document.getElementById('wa-calc-btn');

  const packages = {
    basico:    { name: 'Adiestramiento Básico',    price: 60 },
    conducta:  { name: 'Control de Conducta',      price: 80 },
    domicilio: { name: 'Adiestramiento a Domicilio', price: 90 }
  };

  let activePkg = 'basico';

  function selectPkg(key) {
    activePkg = key;
    [pkgBasico, pkgConducta, pkgDomicilio].forEach(el => el?.classList.remove('selected'));
    document.getElementById(`pkg-${key}`)?.classList.add('selected');
    calculate();
  }

  function calculate() {
    if (!rangeSessions || !summaryTotal) return;
    const pkg = packages[activePkg];
    const sessions = parseInt(rangeSessions.value);
    if (sessionCountVal) sessionCountVal.innerText = sessions;

    const subtotal = pkg.price * sessions;
    let extras = 0;
    const extraNames = ['Seguimiento WhatsApp (gratis)'];

    if (addonEval?.classList.contains('selected')) {
      extras += 35;
      extraNames.push('Valoración inicial (+35€)');
    }

    const total = subtotal + extras;

    if (summaryPkgName)  summaryPkgName.innerText  = pkg.name;
    if (summaryPkgPrice) summaryPkgPrice.innerText = `${pkg.price}€ / sesión`;
    if (summaryCount)    summaryCount.innerText    = `${sessions} sesión${sessions !== 1 ? 'es' : ''}`;
    if (summarySubtotal) summarySubtotal.innerText = `${subtotal}€`;
    if (summaryAddons)   summaryAddons.innerText   = extraNames.join(', ');
    if (summaryExtras)   summaryExtras.innerText   = `+${extras}€`;

    if (summaryTotal) {
      summaryTotal.style.opacity = '0.5';
      setTimeout(() => { summaryTotal.innerText = `${total}€`; summaryTotal.style.opacity = '1'; }, 120);
    }

    if (waCalcBtn) {
      const msg = `Hola%2C%20quiero%20consultar%20disponibilidad%20para%20${encodeURIComponent(pkg.name)}%20(${sessions}%20sesi%C3%B3n${sessions !== 1 ? 'es' : ''})%2C%20total%20estimado%20${total}%E2%82%AC.`;
      waCalcBtn.href = `https://wa.me/34640128247?text=${msg}`;
    }
  }

  pkgBasico?.addEventListener('click',   () => selectPkg('basico'));
  pkgConducta?.addEventListener('click', () => selectPkg('conducta'));
  pkgDomicilio?.addEventListener('click',() => selectPkg('domicilio'));
  rangeSessions?.addEventListener('input', calculate);
  addonEval?.addEventListener('click', () => { addonEval.classList.toggle('selected'); calculate(); });

  calculate();

  // ==========================================
  // 5. FAQ Accordion
  // ==========================================
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        const body = el.querySelector('.faq-body');
        if (body) body.style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 6. Contact Form
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus  = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const msg   = document.getElementById('message')?.value.trim();
      if (!name || !email || !msg) {
        formStatus.innerText = 'Por favor, rellena los campos obligatorios (Nombre, Email y Mensaje).';
        formStatus.className = 'form-status error';
        return;
      }
      formStatus.innerText = '¡Gracias por tu mensaje! Te responderemos lo antes posible.';
      formStatus.className = 'form-status success';
      contactForm.reset();
      setTimeout(() => { formStatus.style.display = 'none'; formStatus.className = 'form-status'; }, 6000);
    });
  }

});
