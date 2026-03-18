/* ========================================
   Origin Partners - Horizontal Scroll
   Pure CSS Sticky + GSAP Animation
   ======================================== */

gsap.registerPlugin(ScrollTrigger);

// ========================================
// Dot Grid Background (파티클 대체)
// ========================================

class DotGrid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dots = [];
    this.spacing = 40;
    this.animFrame = null;

    this.resize();
    this.buildDots();
    this.animate();
    window.addEventListener('resize', () => {
      this.resize();
      this.buildDots();
    });
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  buildDots() {
    this.dots = [];
    const cols = Math.ceil(this.canvas.width  / this.spacing) + 1;
    const rows = Math.ceil(this.canvas.height / this.spacing) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.dots.push({
          x: c * this.spacing,
          y: r * this.spacing,
          baseOpacity: 0.07,
          phase:  Math.random() * Math.PI * 2,
          speed:  0.003 + Math.random() * 0.003,
          peak:   0.09 + Math.random() * 0.16,
        });
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.dots.forEach(d => {
      d.phase += d.speed;
      const opacity = d.baseOpacity + (Math.sin(d.phase) * 0.5 + 0.5) * (d.peak - d.baseOpacity);

      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 212, 255, ${opacity.toFixed(3)})`;
      this.ctx.fill();
    });

    this.animFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.animFrame);
  }
}

function initParticleBackground() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  new DotGrid(canvas);
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
