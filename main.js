/* ========================================
   Origin Partners - Horizontal Scroll
   Pure CSS Sticky + GSAP Animation
   ======================================== */

gsap.registerPlugin(ScrollTrigger);

// ========================================
// Particle Background Effect
// ========================================

class Particle {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * (this.config.particle.size.max - this.config.particle.size.min) + this.config.particle.size.min;
    this.color = this.config.particle.color[Math.floor(Math.random() * this.config.particle.color.length)];
    this.vx = (Math.random() - 0.5) * this.config.motion.speed;
    this.vy = (Math.random() - 0.5) * this.config.motion.speed;
  }

  update(mouse) {
    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 250 && dist > 15) {
        // 원자 궤도 회전 운동 (강화됨)
        const angle = Math.atan2(dy, dx);
        const orbitSpeed = 0.08 * (1 - dist / 250); // 회전 속도 3배 증가

        // 회전력 (접선 방향) - 더 강하게
        const tangentX = -Math.sin(angle) * orbitSpeed * 18;
        const tangentY = Math.cos(angle) * orbitSpeed * 18;

        // 구심력 (중심으로 당김) - 더 강하게
        const pullStrength = 0.025;
        const pullX = -dx * pullStrength * (1 - dist / 250);
        const pullY = -dy * pullStrength * (1 - dist / 250);

        this.vx += tangentX + pullX;
        this.vy += tangentY + pullY;
      } else if (dist <= 15) {
        // 너무 가까우면 밀어냄
        const pushForce = 0.8;
        this.vx += (dx / dist) * pushForce;
        this.vy += (dy / dist) * pushForce;
      }
    }

    this.vx *= 0.97; // 마찰력
    this.vy *= 0.97;

    this.x += this.vx;
    this.y += this.vy;

    // 화면 경계 처리
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

    this.x = Math.max(0, Math.min(this.canvas.width, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height, this.y));
  }

  draw() {
    // 심플한 파티클 (글로우 효과 없음)
    this.ctx.beginPath();
    this.ctx.globalAlpha = this.config.particle.opacity;
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

function initParticleBackground() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animationId = null;

  // Origin Partners Deep Blue 테마
  const config = {
    particle: {
      count: isMobile() ? 80 : 150,
      color: ['#3b82f6', '#1e40af', '#60a5fa', '#1e3a8a', '#93c5fd'],
      size: { min: 1, max: 3 },
      shape: 'circle',
      opacity: 0.7
    },
    motion: { speed: 0.6, interaction: 'attract' },
    lines: { enabled: true, distance: 130, color: 'rgba(59, 130, 246, 0.1)' }
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < config.particle.count; i++) {
      particles.push(new Particle(canvas, config));
    }
  }

  function drawLines() {
    if (!config.lines.enabled || config.lines.distance <= 0) return;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.lines.distance) {
          ctx.beginPath();
          ctx.strokeStyle = config.lines.color;
          ctx.globalAlpha = (1 - dist / config.lines.distance) * 0.4;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update(mouse);
      p.draw();
    });
    drawLines();
    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(animate);
  }

  // Event listeners
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  // window 전체에서 마우스 이벤트 감지 (콘텐츠 위에서도 작동)
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Initialize
  resize();
  initParticles();
  animate();
}

// ========================================
// Utility Functions
// ========================================

function animateSplitText(element, delay = 0) {
  const lines = element.querySelectorAll('.line');

  // 이미 애니메이션된 요소는 다시 초기화하지 않음
  if (element.classList.contains('animated')) return;

  // 애니메이션 완료 후 인라인 스타일 고정
  const tween = gsap.fromTo(lines,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      delay: delay,
      ease: "power3.out",
      onComplete: () => {
        // 애니메이션 완료 후 GSAP 제어 해제 + 스타일 고정
        lines.forEach(line => {
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        });
        tween.kill(); // GSAP가 더 이상 이 요소를 제어하지 않도록 해제
        element.classList.add('animated');
      }
    }
  );
}

function isMobile() {
  return window.innerWidth <= 1024;
}

// 모바일에서 모든 요소 즉시 표시 (애니메이션 비활성화)
function showAllElementsOnMobile() {
  if (!isMobile()) return;

  // 서비스 카드 표시
  document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'none';
  });

  // 포트폴리오 아이템 표시
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.opacity = '1';
    item.style.transform = 'none';
  });

  // 통계 아이템 표시
  document.querySelectorAll('.stat-item').forEach(item => {
    item.style.opacity = '1';
    item.style.transform = 'none';
  });

  // 스플릿 텍스트 라인 표시
  document.querySelectorAll('.split-text .line').forEach(line => {
    line.style.opacity = '1';
    line.style.transform = 'none';
  });

  // 추가 요소들 표시
  document.querySelectorAll('.capability-tags, .network-stats, .journey-steps').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  // Service Journey Map 카드 표시 (Stripe/Linear 스타일)
  document.querySelectorAll('.journey-card').forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'none';
  });

  // 연결선 표시
  const journeyConnector = document.querySelector('.journey-connector');
  if (journeyConnector) {
    journeyConnector.classList.add('animate');
  }
}

// ========================================
// Horizontal Scroll (CSS Sticky 방식)
// ========================================

function initHorizontalScroll() {
  const wrapper = document.querySelector('.horizontal-wrapper');
  const container = document.querySelector('.horizontal-container');
  const slides = document.querySelectorAll('.h-slide');

  if (!wrapper || !container || slides.length === 0) return;

  // 모바일: 세로 스크롤
  if (isMobile()) {
    slides.forEach((slide) => {
      const splitTexts = slide.querySelectorAll('.split-text');
      const extraElements = slide.querySelectorAll('.capability-tags, .network-stats, .journey-steps');

      ScrollTrigger.create({
        trigger: slide,
        start: "top 80%",
        onEnter: () => {
          splitTexts.forEach((text, i) => animateSplitText(text, i * 0.2));
          extraElements.forEach((el, i) => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: 0.5 + i * 0.2, ease: "power3.out" });
          });
        },
        once: true
      });
    });
    return;
  }

  // PC: 가로 스크롤
  const totalSlides = slides.length;

  // 스크롤에 따라 container를 가로로 이동 (pin 사용)
  // 슬라이드당 스크롤 거리를 줄여서 휠 몇 번으로 페이지 전환
  const scrollPerSlide = window.innerHeight * 0.5; // 슬라이드당 50vh 스크롤
  const totalScrollDistance = scrollPerSlide * (totalSlides - 1);

  gsap.to(container, {
    x: () => -(container.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: () => "+=" + totalScrollDistance,
      pin: true,
      scrub: 0.3,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const slideIndex = Math.min(Math.floor(progress * totalSlides), totalSlides - 1);

        if (slides[slideIndex]) {
          const splitTexts = slides[slideIndex].querySelectorAll('.split-text');
          splitTexts.forEach((text) => {
            if (!text.classList.contains('animated')) {
              text.classList.add('animated');
              animateSplitText(text, 0);
            }
          });

          const extraElements = slides[slideIndex].querySelectorAll('.capability-tags, .network-stats, .journey-steps');
          extraElements.forEach((el) => {
            if (!el.classList.contains('animated')) {
              el.classList.add('animated');
              gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });
            }
          });
        }
      }
    }
  });

  // 첫 슬라이드 애니메이션
  const firstSlide = slides[0];
  if (firstSlide) {
    const firstSplitTexts = firstSlide.querySelectorAll('.split-text');
    firstSplitTexts.forEach((text, i) => animateSplitText(text, 0.5 + i * 0.2));
    firstSplitTexts.forEach(text => text.classList.add('animated'));
  }
}

// ========================================
// Vertical Sections Animations
// ========================================

function initVerticalAnimations() {
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      onEnter: () => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: "power3.out" });
      },
      once: true
    });
  });

  // Service Journey Map 애니메이션 (Stripe/Linear 스타일)
  const journeyCards = document.querySelectorAll('.journey-card');
  const journeyConnector = document.querySelector('.journey-connector');

  if (journeyCards.length > 0) {
    ScrollTrigger.create({
      trigger: '.journey-map-section',
      start: "top 70%",
      onEnter: () => {
        // 카드 순차 애니메이션
        journeyCards.forEach((card, index) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: index * 0.12,
            ease: "power3.out"
          });
        });
        // 연결선 페이드인
        if (journeyConnector) {
          journeyConnector.classList.add('animate');
        }
      },
      once: true
    });
  }

  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach((item, index) => {
    const numberEl = item.querySelector('.stat-number');
    const targetCount = parseInt(numberEl.dataset.count);

    ScrollTrigger.create({
      trigger: item,
      start: "top 85%",
      onEnter: () => {
        gsap.to(item, { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: "power2.out" });
        gsap.to({ count: 0 }, {
          count: targetCount,
          duration: 2,
          delay: index * 0.1,
          ease: "power2.out",
          onUpdate: function() {
            numberEl.textContent = Math.round(this.targets()[0].count);
          }
        });
      },
      once: true
    });
  });

  const sectionHeaders = document.querySelectorAll('.vertical-section .section-header, .contact-section .content');
  sectionHeaders.forEach((header) => {
    const splitTexts = header.querySelectorAll('.split-text');
    ScrollTrigger.create({
      trigger: header,
      start: "top 80%",
      onEnter: () => {
        splitTexts.forEach((text, i) => animateSplitText(text, i * 0.15));
      },
      once: true
    });
  });
}

// ========================================
// Initialize
// ========================================

function init() {
  document.fonts.ready.then(() => {
    // 파티클 배경 초기화 (PC, Mobile 모두)
    initParticleBackground();

    // 모바일: 모든 요소 즉시 표시
    if (isMobile()) {
      showAllElementsOnMobile();
      // 통계 숫자 카운트 애니메이션만 실행
      initStatCounters();
      return;
    }

    // PC: 전체 애니메이션 실행
    initHorizontalScroll();
    initVerticalAnimations();
  });
}

// 모바일용 통계 카운터 (애니메이션 없이)
function initStatCounters() {
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach((item) => {
    const numberEl = item.querySelector('.stat-number');
    const targetCount = parseInt(numberEl.dataset.count);
    if (!isNaN(targetCount)) {
      numberEl.textContent = targetCount;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('resize', () => {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
});

window.addEventListener('load', () => ScrollTrigger.refresh());
