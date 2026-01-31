/* ========================================
   Origin Partners - Horizontal Scroll
   Pure CSS Sticky + GSAP Animation
   ======================================== */

gsap.registerPlugin(ScrollTrigger);

// ========================================
// Utility Functions
// ========================================

function animateSplitText(element, delay = 0) {
  const lines = element.querySelectorAll('.line');

  // 이미 애니메이션된 요소는 다시 초기화하지 않음
  if (element.classList.contains('animated')) return;

  gsap.fromTo(lines,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      delay: delay,
      ease: "power3.out"
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
  gsap.to(container, {
    x: () => -(container.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: () => "+=" + (container.scrollWidth - window.innerWidth),
      pin: true,
      scrub: 1,
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

  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 85%",
      onEnter: () => {
        gsap.to(item, { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: "power2.out" });
      },
      once: true
    });
  });

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
