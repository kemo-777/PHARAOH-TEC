const COMPANY_EMAIL = 'kareemabdelrazek289@gmail.com';
const html = document.documentElement;
const langBtn = document.getElementById('langBtn');
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const topbar = document.getElementById('topbar');
const progress = document.getElementById('progress');
const backTop = document.getElementById('backTop');
const cursorGlow = document.getElementById('cursorGlow');

// Preloader
window.addEventListener('load', () => {
  const fill = document.getElementById('loaderFill');
  const preloader = document.getElementById('preloader');
  if (fill) fill.style.width = '100%';
  setTimeout(() => {
    if (preloader) preloader.classList.add('hide');
  }, 450);
});

// Language Toggle with localStorage
let lang = localStorage.getItem('pharaoh_lang') || 'ar';

function applyLanguage(targetLang) {
  lang = targetLang;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    el.innerHTML = el.dataset[lang];
  });
  langBtn.textContent = lang === 'ar' ? 'EN' : 'عربي';
  localStorage.setItem('pharaoh_lang', lang);
}

applyLanguage(lang);

langBtn.addEventListener('click', () => {
  applyLanguage(lang === 'ar' ? 'en' : 'ar');
});

// Mobile Menu
menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.textContent = isOpen ? '✕' : '☰';
});

nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = '☰';
  });
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll Progress, Scroll Spy & Back to Top
const sections = document.querySelectorAll('section[id]');
const navLinks = nav.querySelectorAll('a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';

  topbar.classList.toggle('scrolled', scrollY > 30);
  backTop.classList.toggle('visible', scrollY > 500);

  let currentId = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 180) {
      currentId = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Cursor Glow & 3D Tilt on Holo Core
const holoCore = document.getElementById('holoCore');
if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', e => {
    if (cursorGlow) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }
    if (holoCore && window.scrollY < 800) {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * -14;
      holoCore.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    }
  }, { passive: true });
}

// Neural Network Particle Canvas in Hero
const canvas = document.getElementById('neuralCanvas');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const count = 42;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.8
    });
  }

  function animateNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(226, 190, 115, 0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(92, 225, 230, ${(1 - dist / 130) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateNetwork);
  }
  animateNetwork();
}

// Animated KPI Counters
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target);
    const isFloat = target % 1 !== 0;
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const val = target * (1 - Math.pow(1 - progress, 3));
      el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// Reveal Animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Product Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

// Product Technical Specs Modal
const productSpecsData = {
  aura: {
    tag: 'AI PROPTECH ENGINE // v2.4',
    title: 'AURA Global AI PropAdvisor',
    descAr: 'نظام استشارات عقارية عالمي يعتمد على الذكاء الاصطناعي لتحليل الأسواق، مقارنة العوائد الاستثمارية، وتقديم توصيات مدعومة بالبيانات.',
    descEn: 'Global real-estate intelligence engine leveraging AI to evaluate property markets, forecast ROI, and guide international investors.',
    url: 'https://kemo-777.github.io/aura-global-ai-propadvisor/',
    specs: [
      { k: 'CORE ENGINE', v: 'AI Advisory & Market Analytics' },
      { k: 'DEPLOYMENT', v: 'Global Edge CDN' },
      { k: 'INTERFACE', v: 'Interactive Analytical Dashboard' },
      { k: 'STATUS', v: 'Production Live' }
    ]
  },
  talent: {
    tag: 'DISCOVERY NETWORK // v1.8',
    title: 'PHARAOH TALENT',
    descAr: 'شبكة رقمية متخصصة في اكتشاف المواهب الواعدة وعرض الملفات الإبداعية والتقنية لربطها بالفرص العالمية.',
    descEn: 'Curated talent discovery platform bridging emerging creators and technical innovators with global opportunities.',
    url: 'https://kemo-777.github.io/Pharaoh-talent/',
    specs: [
      { k: 'ARCHITECTURE', v: 'Talent Graph & Showcase' },
      { k: 'DISCOVERY', v: 'Structured Skill Indexing' },
      { k: 'ACCESSIBILITY', v: 'Responsive Cross-Platform' },
      { k: 'STATUS', v: 'Production Live' }
    ]
  },
  lifeos: {
    tag: 'PERSONAL WORKSPACE OS // v2.0',
    title: 'LifeOS',
    descAr: 'بيئة عمل رقمية متكاملة لعرض البيانات الحية والرسوم البيانية التفاعلية وتنظيم المهام اليومية بوضوح تام.',
    descEn: 'Integrated digital operating workspace featuring real-time data visualization, live charts, and structured daily execution.',
    url: 'https://kemo-777.github.io/livecharts/',
    specs: [
      { k: 'VISUALIZATION', v: 'Real-Time Interactive Charts' },
      { k: 'PERFORMANCE', v: 'Zero-Latency Client Rendering' },
      { k: 'MODULARITY', v: 'Unified Productivity Modules' },
      { k: 'STATUS', v: 'Production Live' }
    ]
  },
  matrix: {
    tag: 'STRATEGIC TIME ENGINE // PRO',
    title: 'Time Matrix Pro',
    descAr: 'أداة تخطيط تنفيذي تعتمد على مصفوفة الأولويات لتصنيف المهام الحرجة والاستراتيجية وتحقيق أقصى إنتاجية.',
    descEn: 'Executive prioritization engine structured around strategic decision matrices for high-leverage time management.',
    url: 'https://kemo-777.github.io/KMO/',
    specs: [
      { k: 'METHODOLOGY', v: '4-Quadrant Strategic Matrix' },
      { k: 'UX DESIGN', v: 'Distraction-Free Focus Mode' },
      { k: 'SPEED', v: 'Instant State Updates' },
      { k: 'STATUS', v: 'Production Live' }
    ]
  }
};

const specModal = document.getElementById('specModal');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.case-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = productSpecsData[btn.dataset.product];
    if (!item) return;
    document.getElementById('modalTag').textContent = item.tag;
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalDesc').textContent = lang === 'ar' ? item.descAr : item.descEn;
    document.getElementById('modalLaunch').href = item.url;
    document.getElementById('modalLaunch').textContent = lang === 'ar' ? 'فتح المنصة الآن ↗' : 'Launch Live Platform ↗';
    document.getElementById('modalSpecs').innerHTML = item.specs
      .map(s => `<div class="spec-item"><small class="mono">${s.k}</small><strong>${s.v}</strong></div>`)
      .join('');
    specModal.classList.add('open');
    specModal.setAttribute('aria-hidden', 'false');
  });
});

modalClose.addEventListener('click', () => {
  specModal.classList.remove('open');
  specModal.setAttribute('aria-hidden', 'true');
});

specModal.addEventListener('click', e => {
  if (e.target === specModal) modalClose.click();
});

// Command Palette (Ctrl+K / Cmd+K)
const cmdModal = document.getElementById('cmdModal');
const cmdBtn = document.getElementById('cmdBtn');
const cmdClose = document.getElementById('cmdClose');

function toggleCmd(show) {
  cmdModal.classList.toggle('open', show);
  cmdModal.setAttribute('aria-hidden', !show);
}

cmdBtn.addEventListener('click', () => toggleCmd(true));
cmdClose.addEventListener('click', () => toggleCmd(false));
cmdModal.addEventListener('click', e => {
  if (e.target === cmdModal) toggleCmd(false);
});
cmdModal.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleCmd(false)));

window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    toggleCmd(!cmdModal.classList.contains('open'));
  }
  if (e.key === 'Escape') {
    toggleCmd(false);
    modalClose.click();
  }
});

// Copy Official Email
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(COMPANY_EMAIL);
      copyEmailBtn.textContent = lang === 'ar' ? 'تم النسخ ✓' : 'Copied ✓';
      setTimeout(() => {
        copyEmailBtn.textContent = copyEmailBtn.dataset[lang];
      }, 2500);
    } catch {
      window.location.href = `mailto:${COMPANY_EMAIL}`;
    }
  });
}

// Contact Form Mailto & Copy
const form = document.getElementById('contactForm');
const copyMsgBtn = document.getElementById('copyMsgBtn');
const hint = document.getElementById('formHint');

function buildInquiryText() {
  const data = new FormData(form);
  const name = data.get('name') || 'Visitor';
  const contact = data.get('contact') || 'Not provided';
  const topic = data.get('topic') || 'General Inquiry';
  const message = data.get('message') || '';
  return {
    subject: `[PHARAOH TEC] ${topic} — ${name}`,
    body: `Hello PHARAOH TEC Executive Team,

Name / Organization: ${name}
Contact: ${contact}
Division / Subject: ${topic}

Project Details / Message:
${message}`
  };
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const { subject, body } = buildInquiryText();
  window.location.href = `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  hint.textContent = lang === 'ar'
    ? `تم تجهيز الرسالة لإرسالها إلى ${COMPANY_EMAIL}. يمكنك أيضاً استخدام زر "نسخ الرسالة".`
    : `Opening email client to send to ${COMPANY_EMAIL}. You can also copy the message anytime.`;
});

copyMsgBtn.addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  const { subject, body } = buildInquiryText();
  const fullText = `To: ${COMPANY_EMAIL}
Subject: ${subject}

${body}`;
  const btnSpan = copyMsgBtn.querySelector('span');

  try {
    await navigator.clipboard.writeText(fullText);
    copyMsgBtn.classList.add('copied');
    if (btnSpan) btnSpan.textContent = lang === 'ar' ? 'تم النسخ ✓' : 'Copied ✓';
    hint.textContent = lang === 'ar'
      ? `تم نسخ الرسالة وبريد الشركة (${COMPANY_EMAIL}) بنجاح.`
      : `Message and official email (${COMPANY_EMAIL}) copied to clipboard.`;

    setTimeout(() => {
      copyMsgBtn.classList.remove('copied');
      if (btnSpan) btnSpan.textContent = btnSpan.dataset[lang];
    }, 3500);
  } catch {
    hint.textContent = fullText;
  }
});
