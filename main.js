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
// Z-Tunnel Scroll (Spatial Depth 방식)
// ========================================

function initZTunnel() {
  const section  = document.querySelector('.tunnel-section');
  const layers   = document.querySelectorAll('.tunnel-layer');
  if (!section || layers.length === 0) return;

  const Z_SPACING = 700; // 레이어 간 Z 간격 (px)

  function updateTunnel() {
    const sectionTop    = section.getBoundingClientRect().top + window.scrollY;
    const scrollInSec   = Math.max(0, window.scrollY - sectionTop);
    const progress      = scrollInSec / window.innerHeight; // 0 ~ (layers.length-1)

    layers.forEach((layer, i) => {
      const z = (progress - i) * Z_SPACING;

      // 현재 전면(z≈0) 에서만 보이도록 — 겹침 방지
      let opacity;
      if (z > 120) {
        opacity = 0;                              // 카메라 뒤로 지남 → 즉시 숨김
      } else if (z > 0) {
        opacity = Math.max(0, 1 - z / 120);      // 0→120 : 빠르게 fade-out
      } else if (z > -280) {
        opacity = Math.max(0, (z + 280) / 280);  // -280→0 : fade-in 구간만
      } else {
        opacity = 0;                              // 아직 멀리 있는 레이어 → 숨김
      }

      layer.style.transform     = `translateZ(${z}px)`;
      layer.style.opacity       = opacity;
      layer.style.pointerEvents = (z > 80 || z < -300) ? 'none' : 'auto';

      // 현재 전면 레이어의 split-text 애니메이션
      if (Math.abs(z) < 100 && !layer.classList.contains('animated')) {
        layer.classList.add('animated');
        layer.querySelectorAll('.split-text').forEach((t, idx) => animateSplitText(t, idx * 0.15));
      }
    });
  }

  // 첫 슬라이드 즉시 표시
  layers[0].style.transform = 'translateZ(0px)';
  layers[0].style.opacity   = '1';
  layers[0].querySelectorAll('.split-text').forEach((t, i) => animateSplitText(t, 0.3 + i * 0.15));
  layers[0].classList.add('animated');

  window.addEventListener('scroll', updateTunnel, { passive: true });
  updateTunnel();
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
// Slide 01 — 실패 원인 바 차트 애니메이션
// ========================================

function initSlide01() {
  const bar1 = document.getElementById('s1Bar1');
  const bar2 = document.getElementById('s1Bar2');
  const bar3 = document.getElementById('s1Bar3');
  if (!bar1) return null;

  let triggered = false;
  return function triggerBars() {
    if (triggered) return;
    triggered = true;
    setTimeout(() => {
      bar1.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1)';
      bar2.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1) 0.12s';
      bar3.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1) 0.24s';
      bar1.style.width = '42%';
      bar2.style.width = '29%';
      bar3.style.width = '23%';
    }, 400);
  };
}

// ========================================
// Slide 02 — 6개 서비스 인터랙티브 플로우
// ========================================

function initSlide02() {
  // 좌측 이미지만 서비스별로 전환 (우측은 마케팅 생존 스토리로 고정)
  const s2Data = [
    { img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
      tag: 'SOLUTION 02 · BM 전략',      loc: '📋 비즈니스 모델 캔버스 · 수익 구조 설계' },
    { img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80',
      tag: 'SOLUTION 02 · IP 보호',      loc: '🔒 특허·상표·디자인권 · 변리사 파트너' },
    { img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80',
      tag: 'SOLUTION 02 · IR 컨설팅',    loc: '💼 투자자 덱 · 피칭 전략 · 밸류에이션' },
    { img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
      tag: 'SOLUTION 02 · AI 워크플로우', loc: '🤖 GPT 연동 · 자동화 · 실행 속도 3배' },
    { img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
      tag: 'SOLUTION 02 · 사업계획서',   loc: '📄 P.S.S.T 프레임워크 · 정부지원사업' },
    { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      tag: 'SOLUTION 02 · 마케팅 전략',  loc: '🎯 쐐기처럼 · 데이터처럼 · AI처럼' },
  ];

  const s2Steps    = document.querySelectorAll('.s2-hstep');
  const s2ImgPanel = document.getElementById('s2ImgPanel');
  if (!s2ImgPanel) return;

  const s2ImgTag = document.getElementById('s2ImgTag');
  const s2ImgLoc = document.getElementById('s2ImgLoc');

  function s2Switch(idx) {
    const d = s2Data[idx];
    // 네비게이터 활성 상태
    s2Steps.forEach((s, i) => s.classList.toggle('s2-active', i === idx));
    // 왼쪽 이미지 크로스페이드
    s2ImgPanel.style.opacity = '0';
    setTimeout(() => {
      s2ImgPanel.style.backgroundImage = `url('${d.img}')`;
      s2ImgTag.textContent = d.tag;
      s2ImgLoc.textContent = d.loc;
      s2ImgPanel.style.opacity = '1';
    }, 280);
  }

  s2Steps.forEach((step, idx) => {
    step.addEventListener('click', () => s2Switch(idx));
  });

  // 마케팅 전략(6번째)을 기본으로 활성화
  s2Switch(5);
  return s2Switch;
}

// ========================================
// Slide 03 — 5단계 인터랙티브 플로우
// ========================================

function initSlide03() {
  const s3Data = [
    {
      img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80',
      tag: 'STEP 01 · 문제 발굴', loc: '👥 고객 인터뷰 · 문제 정의 · 가설 검증',
      step: 'STEP 01 · 문제 발굴',
      desc: '표면적 증상이 아닌 고객의 근본 문제를 발굴합니다. 인터뷰 설계부터 가설 검증까지, 실제 시장 데이터를 기반으로 "풀어야 할 진짜 문제"를 정의합니다.',
      s1l:'인터뷰', s1v:'42건', s2l:'가설 검증', s2v:'12개', s3l:'정확도', s3v:'89%',
      card:'문제 발굴 성과', badge:'STEP 01',
      m1v:'89', m1u:'%', m1l:'문제 정의 정확도',
      m2v:'94', m2u:'%', m2l:'고객 공감 지수',
      m3v:'76', m3u:'%', m3l:'시장 검증률',
      bl1:'문제 정의 정확도', bp1:'89%', bw1:'89%',
      bl2:'고객 공감 지수',   bp2:'94%', bw2:'94%',
      bl3:'시장 검증률',      bp3:'76%', bw3:'76%',
    },
    {
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
      tag: 'STEP 02 · 전략 설계', loc: '📋 BM 캔버스 · AI 워크플로우 · 수익 구조',
      step: 'STEP 02 · 전략 설계',
      desc: '비즈니스 모델 캔버스와 AI 워크플로우로 수익 구조를 설계합니다. 린 스타트업 방법론과 GPT 자동화로 팀의 실행 속도를 3배 이상 끌어올립니다.',
      s1l:'실행 속도', s1v:'3배', s2l:'AI 도구', s2v:'14개', s3l:'BM 완성도', s3v:'92%',
      card:'전략 설계 성과', badge:'STEP 02',
      m1v:'92', m1u:'%', m1l:'BM 설계 완성도',
      m2v:'88', m2u:'%', m2l:'AI 적용률',
      m3v:'95', m3u:'%', m3l:'전략 실행력',
      bl1:'BM 설계 완성도', bp1:'92%', bw1:'92%',
      bl2:'AI 적용률',      bp2:'88%', bw2:'88%',
      bl3:'전략 실행력',    bp3:'95%', bw3:'95%',
    },
    {
      img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
      tag: 'STEP 03 · 실행 지원', loc: '📄 사업계획서 · GTM 전략 · 마케팅 실행',
      step: 'STEP 03 · 실행 지원',
      desc: 'P.S.S.T 프레임워크로 심사위원이 선택하는 사업계획서를 완성합니다. GTM 전략과 그로스 해킹으로 최소 비용에 최대 시장 침투를 실현합니다.',
      s1l:'서류 통과율', s1v:'94%', s2l:'마케팅 ROI', s2v:'3.2배', s3l:'지원 채널', s3v:'28개',
      card:'실행 지원 성과', badge:'STEP 03',
      m1v:'94', m1u:'%', m1l:'사업계획서 통과율',
      m2v:'82', m2u:'%', m2l:'GTM 목표 달성률',
      m3v:'90', m3u:'%', m3l:'고객 획득률',
      bl1:'사업계획서 통과율', bp1:'94%', bw1:'94%',
      bl2:'GTM 목표 달성률',   bp2:'82%', bw2:'82%',
      bl3:'고객 획득률',       bp3:'90%', bw3:'90%',
    },
    {
      img: 'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=1200&q=80',
      tag: 'STEP 04 · 정부지원', loc: '🏛️ 정부사업 매칭 · IR 준비 · 자금 연결',
      step: 'STEP 04 · 정부지원',
      desc: '중기부·창업진흥원 등 340+ 정부지원 프로그램 데이터베이스로 최적 사업을 매칭합니다. IR 자료 준비부터 심사 대응까지 전 과정을 함께합니다.',
      s1l:'연결 자금', s1v:'62억+', s2l:'매칭 성공률', s2v:'89%', s3l:'프로그램', s3v:'340+',
      card:'정부지원 성과', badge:'STEP 04',
      m1v:'89', m1u:'%', m1l:'정부사업 합격률',
      m2v:'96', m2u:'%', m2l:'IR 준비 완성도',
      m3v:'84', m3u:'%', m3l:'자금 연결률',
      bl1:'정부사업 합격률', bp1:'89%', bw1:'89%',
      bl2:'IR 준비 완성도', bp2:'96%', bw2:'96%',
      bl3:'자금 연결률',    bp3:'84%', bw3:'84%',
    },
    {
      img: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80',
      tag: 'STEP 05 · 투자·성장', loc: '🚀 VC 네트워크 · 시리즈A · 스케일업',
      step: 'STEP 05 · 투자·성장',
      desc: '28개 VC 파트너 네트워크를 통해 시드부터 시리즈A까지 투자를 연결합니다. 투자 유치 이후 스케일업 전략과 피봇 지원까지 함께 만들어갑니다.',
      s1l:'투자 연결', s1v:'62억+', s2l:'VC 파트너', s2v:'28개', s3l:'재계약률', s3v:'94%',
      card:'투자·성장 성과', badge:'STEP 05',
      m1v:'78', m1u:'%', m1l:'투자 유치 성공률',
      m2v:'94', m2u:'%', m2l:'재계약률',
      m3v:'96', m3u:'%', m3l:'고객 만족도',
      bl1:'투자 유치 성공률', bp1:'78%', bw1:'78%',
      bl2:'재계약률',        bp2:'94%', bw2:'94%',
      bl3:'고객 만족도',     bp3:'96%', bw3:'96%',
    },
  ];

  const hSteps   = document.querySelectorAll('.s3-hstep');
  const imgPanel = document.getElementById('s3ImgPanel');
  if (!imgPanel) return;

  const imgTag   = document.getElementById('s3ImgTag');
  const imgLoc   = document.getElementById('s3ImgLoc');
  const stepLbl  = document.getElementById('s3StepLabel');
  const descEl   = document.getElementById('s3Desc');
  const s1l = document.getElementById('s3Stat1L'), s1v = document.getElementById('s3Stat1V');
  const s2l = document.getElementById('s3Stat2L'), s2v = document.getElementById('s3Stat2V');
  const s3l = document.getElementById('s3Stat3L'), s3v = document.getElementById('s3Stat3V');
  const cardLbl  = document.getElementById('s3CardLabel');
  const cardBadge= document.getElementById('s3CardBadge');
  const m1v = document.getElementById('s3M1V'), m1u = document.getElementById('s3M1U'), m1l = document.getElementById('s3M1L');
  const m2v = document.getElementById('s3M2V'), m2u = document.getElementById('s3M2U'), m2l = document.getElementById('s3M2L');
  const m3v = document.getElementById('s3M3V'), m3u = document.getElementById('s3M3U'), m3l = document.getElementById('s3M3L');
  const bl1 = document.getElementById('s3BL1'), bp1 = document.getElementById('s3BP1'), bf1 = document.getElementById('s3BF1');
  const bl2 = document.getElementById('s3BL2'), bp2 = document.getElementById('s3BP2'), bf2 = document.getElementById('s3BF2');
  const bl3 = document.getElementById('s3BL3'), bp3 = document.getElementById('s3BP3'), bf3 = document.getElementById('s3BF3');

  function s3Switch(idx) {
    const d = s3Data[idx];

    hSteps.forEach((s, i) => {
      s.classList.remove('s3-active', 'done');
      if (i < idx)  s.classList.add('done');
      if (i === idx) s.classList.add('s3-active');
    });

    imgPanel.style.opacity = '0';
    setTimeout(() => {
      imgPanel.style.backgroundImage = `url('${d.img}')`;
      imgTag.textContent = d.tag;
      imgLoc.textContent = d.loc;
      imgPanel.style.opacity = '1';
    }, 280);

    descEl.classList.add('s3-desc-out');
    setTimeout(() => {
      stepLbl.textContent = d.step;
      descEl.textContent  = d.desc;
      s1l.textContent = d.s1l; s1v.textContent = d.s1v;
      s2l.textContent = d.s2l; s2v.textContent = d.s2v;
      s3l.textContent = d.s3l; s3v.textContent = d.s3v;
      descEl.classList.remove('s3-desc-out');
      descEl.classList.add('s3-desc-in');
      setTimeout(() => descEl.classList.remove('s3-desc-in'), 350);
    }, 200);

    cardLbl.textContent   = d.card;
    cardBadge.textContent = d.badge;
    m1v.childNodes[0].textContent = d.m1v; m1u.textContent = d.m1u; m1l.textContent = d.m1l;
    m2v.childNodes[0].textContent = d.m2v; m2u.textContent = d.m2u; m2l.textContent = d.m2l;
    m3v.childNodes[0].textContent = d.m3v; m3u.textContent = d.m3u; m3l.textContent = d.m3l;

    [bf1, bf2, bf3].forEach(b => { b.style.transition = 'none'; b.style.width = '0%'; });
    bl1.textContent = d.bl1; bp1.textContent = d.bp1;
    bl2.textContent = d.bl2; bp2.textContent = d.bp2;
    bl3.textContent = d.bl3; bp3.textContent = d.bp3;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bf1.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1)';
      bf2.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1) 0.1s';
      bf3.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s';
      bf1.style.width = d.bw1;
      bf2.style.width = d.bw2;
      bf3.style.width = d.bw3;
    }));
  }

  hSteps.forEach((step, idx) => {
    step.addEventListener('click', () => s3Switch(idx));
  });

  return s3Switch;
}

// ========================================
// Glass Carousel — 3D 틸트 버튼 네비게이션
// ========================================

function initGlassCarousel() {
  const slides   = document.querySelectorAll('.gc-slide');
  const bgs      = document.querySelectorAll('.gc-bg');
  const dots     = document.querySelectorAll('.gc-dot');
  const prevBtn  = document.getElementById('gcPrev');
  const nextBtn  = document.getElementById('gcNext');
  const curEl    = document.getElementById('gcCurrent');
  if (!slides.length) return;

  const total = slides.length;
  let current = 0;

  // 슬라이드별 초기화 함수 설정
  const triggerBars = initSlide01();   // slide 0: 바 차트 애니메이션
  const s2SwitchFn  = initSlide02();   // slide 1: 서비스 플로우
  const s3SwitchFn  = initSlide03();   // slide 2: 프로세스 플로우
  let s2Inited = false;
  let s3Inited = false;

  function getClass(idx) {
    const diff = ((idx - current) + total) % total;
    if (diff === 0)         return 'is-active';
    if (diff === 1)         return 'is-next';
    if (diff === total - 1) return 'is-prev';
    return 'is-hidden';
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;

    slides.forEach((s, i) => { s.className = 'gc-slide ' + getClass(i); });
    bgs.forEach((b, i)    => { b.classList.toggle('is-active', i === current); });
    dots.forEach((d, i)   => { d.classList.toggle('is-active', i === current); });
    if (curEl) curEl.textContent = String(current + 1).padStart(2, '0');

    // 슬라이드별 진입 애니메이션
    if (current === 0 && triggerBars) triggerBars();
    if (current === 1 && s2SwitchFn && !s2Inited) { s2Inited = true; s2SwitchFn(0); }
    if (current === 2 && s3SwitchFn && !s3Inited) { s3Inited = true; setTimeout(() => s3SwitchFn(0), 150); }
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // 키보드 방향키 (캐러셀이 화면에 있을 때만)
  document.addEventListener('keydown', e => {
    const sec = document.getElementById('carousel-section');
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  // 터치 스와이프
  let touchStartX = 0;
  const stage = document.getElementById('gcStage');
  stage?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  stage?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  // 초기 상태 설정
  goTo(0);
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
    initVerticalAnimations();
    initGlassCarousel();
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
