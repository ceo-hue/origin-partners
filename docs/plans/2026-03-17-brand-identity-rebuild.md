# Origin Partners Brand Identity Rebuild

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 브랜드 아이덴티티 전면 리빌드 — "예비·초기 스타트업을 돕는 전문가 파트너 그룹" 킥 메시지가 첫 화면에서 3초 내 전달되는 사이트로 재구성

**Architecture:**
- 색상 시스템: 순수 블랙(#0A0A0A) → 딥 네이비(#080F1A) 기반으로 교체, 포인트 블루(#3b82f6) → 시안(#00D4FF)으로 전환
- Hero 배경: 파티클+마우스궤도 → 정적 도트 그리드(slow pulse)로 교체
- 슬라이드 구조: 6개 → 4개로 압축, 카피 전면 재작성 (철학→데이터 직설)
- 전체 border/shadow/hover 색상을 새 시안 팔레트 기준으로 업데이트

**Tech Stack:** Vanilla JS, GSAP + ScrollTrigger, CSS Custom Properties, HTML5 Canvas

---

## 스토리보드 (페이지별 핵심 메시지)

```
[Slide 00 — HERO]
배경: 40px 간격 도트 그리드, 시안 도트 느린 pulse
킥 메시지: "예비·초기 스타트업의 / 진짜 문제를 발굴하는 / 전문가 파트너 그룹."
서브: "스타트업 실패의 가장 큰 이유는 아이디어가 없어서가 아닙니다."
데이터 칩: [42% 시장 니즈 부재] [29% 자본 부족] [23% 팀 역량]
CTA: [→ 무료 상담 시작하기]

[Slide 01 — PROBLEM]
Label: Problem / 01
헤드: "스타트업 42%가 / 문제 정의에서 실패합니다."
서브: 고객의 진짜 문제를 발굴하는 것이 비즈니스 성공의 시작

[Slide 02 — SOLUTION]
Label: Solution / 02
헤드: "4가지 전문 영역으로 / 시작부터 투자까지 함께합니다."
태그: BM전략 · IP보호 · IR컨설팅 · AI워크플로우

[Slide 03 — PROCESS]
Label: Process / 03
헤드: "문제 발굴부터 투자 연결까지 / 5단계 파트너십"
스텝: 문제 발굴 → 전략 설계(AI) → 실행 지원 → 정부지원사업 → 투자·성장

[세로 스크롤]
What We Do (8 cards) → Service Journey (5 steps) → Our Partners (stats) → Contact
```

---

## 색상 시스템 설계

```css
:root {
  /* 배경 — 딥 네이비 */
  --bg-primary:    #080F1A;
  --bg-surface:    #0D1829;
  --bg-elevated:   #132035;
  --border-subtle: #1A2E4A;
  --border-mid:    #1E3D5C;

  /* 텍스트 */
  --text-primary:  #E8EDF5;
  --text-secondary:#8BA3C0;
  --text-muted:    #4A6380;

  /* 포인트 — 시안 */
  --accent:        #00D4FF;
  --accent-dim:    rgba(0, 212, 255, 0.10);
  --accent-glow:   rgba(0, 212, 255, 0.22);
  --accent-dark:   #0099CC;

  /* 하위 호환 (기존 코드 참조용) */
  --point-color:   #0099CC;
  --point-light:   #00D4FF;
  --point-dark:    #006699;
}
```

---

## Task 1: CSS 색상 시스템 전면 교체

**Files:**
- Modify: `style.css` (lines 1–15, 288–302, 437–463, 780–824, 830–837, 670–714 외 다수)

**Step 1: :root 변수 교체**

`style.css` 상단 `:root` 블록을 아래로 교체:

```css
:root {
  /* 배경 — 딥 네이비 (기존 순수 블랙 대체) */
  --bg-primary:    #080F1A;
  --bg-surface:    #0D1829;
  --bg-elevated:   #132035;
  --border-subtle: #1A2E4A;
  --border-mid:    #1E3D5C;

  /* 텍스트 */
  --text-primary:  #E8EDF5;
  --text-secondary:#8BA3C0;
  --text-muted:    #4A6380;

  /* 포인트 — 시안 */
  --accent:        #00D4FF;
  --accent-dim:    rgba(0, 212, 255, 0.10);
  --accent-glow:   rgba(0, 212, 255, 0.22);
  --accent-dark:   #0099CC;

  /* 하위 호환 */
  --point-color:   #0099CC;
  --point-light:   #00D4FF;
  --point-dark:    #006699;
}
```

**Step 2: body 배경 및 텍스트 색상 업데이트**

`body` 셀렉터 변경:
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
  line-height: 1.6;
}
```

**Step 3: p 기본 색상 업데이트**

```css
p {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: var(--text-secondary);
}
```

**Step 4: 슬라이드 배경 업데이트**

각 슬라이드의 Unsplash 이미지 + 오버레이를 딥 네이비 기반으로 교체:

```css
.slide-vision {
  background:
    linear-gradient(180deg, rgba(8,15,26,0.90) 0%, rgba(13,24,41,0.93) 100%),
    url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80') center/cover no-repeat;
}

.slide-philosophy {
  background:
    linear-gradient(135deg, rgba(8,15,26,0.92) 0%, rgba(19,32,53,0.90) 100%),
    url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80') center/cover no-repeat;
}

.slide-difference {
  background:
    linear-gradient(180deg, rgba(8,15,26,0.92) 0%, rgba(15,24,45,0.90) 100%),
    url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80') center/cover no-repeat;
}

.slide-network {
  background:
    linear-gradient(135deg, rgba(8,15,26,0.90) 0%, rgba(20,30,50,0.92) 100%),
    url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80') center/cover no-repeat;
}

.slide-growth {
  background:
    linear-gradient(180deg, rgba(8,15,26,0.90) 0%, rgba(13,24,41,0.93) 100%),
    url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80') center/cover no-repeat;
}
```

**Step 5: 태그 컴포넌트 시안으로 교체**

```css
.tag {
  padding: 10px 20px;
  background: var(--accent-dim);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 30px;
  font-size: 0.9rem;
  color: var(--accent);
  transition: all 0.3s;
}

.tag:hover {
  background: rgba(0, 212, 255, 0.18);
  border-color: var(--accent);
  color: #fff;
}
```

**Step 6: 서비스 카드 업데이트**

```css
.service-card {
  background: linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-primary) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(60px);
}

.service-card:hover {
  border-color: var(--accent-dark);
  transform: translateY(-10px);
  box-shadow: 0 30px 60px rgba(0, 212, 255, 0.12);
}

.card-number {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(0, 212, 255, 0.25);
  margin-bottom: 20px;
}

.card-features li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  background: var(--accent-dark);
  border-radius: 50%;
}
```

**Step 7: 섹션 배경 업데이트**

```css
/* service section */
#service-section {
  background:
    radial-gradient(circle at 1px 1px, rgba(0,212,255,0.04) 1px, transparent 0),
    linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-surface) 100%);
  background-size: 40px 40px, 100% 100%;
}

/* team section */
#team-section {
  background:
    linear-gradient(rgba(8,15,26,0.97) 1px, transparent 1px),
    linear-gradient(90deg, rgba(8,15,26,0.97) 1px, transparent 1px),
    linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-primary) 100%);
  background-size: 80px 80px, 80px 80px, 100% 100%;
  background-position: center center;
}

/* contact section */
.contact-section {
  background:
    radial-gradient(ellipse at 50% 0%, rgba(0, 80, 120, 0.25) 0%, transparent 60%),
    linear-gradient(180deg, var(--bg-primary) 0%, #030810 100%);
  text-align: center;
  position: relative;
}
```

**Step 8: Journey 카드 시안 적용**

```css
.journey-card:hover {
  transform: translateY(-8px);
  border-color: rgba(0, 212, 255, 0.2);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(0, 212, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.journey-card::before {
  background: linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.35) 50%, transparent 100%);
}

.card-badge {
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid rgba(0, 212, 255, 0.18);
}

.card-icon {
  color: var(--accent);
}

.journey-card.active {
  border-color: rgba(0, 212, 255, 0.3);
  background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,153,204,0.04) 100%);
}

.journey-card.active .card-badge {
  background: var(--accent-dark);
  border-color: var(--accent);
  color: #fff;
}
```

**Step 9: Journey connector SVG 색상 교체**

`index.html`의 SVG gradient 색상 교체:
```html
<stop offset="0%" style="stop-color:#006699;stop-opacity:0.3" />
<stop offset="50%" style="stop-color:#00D4FF;stop-opacity:0.6" />
<stop offset="100%" style="stop-color:#006699;stop-opacity:0.3" />
```

**Step 10: stat-number 그라디언트 업데이트**

```css
.stat-number {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  background: linear-gradient(135deg, #E8EDF5 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
```

**Step 11: scroll-line 색상 교체**

```css
.scroll-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, var(--accent), transparent);
  animation: scrollPulse 2s infinite;
}
```

**Step 12: vision slide h2 그라디언트 텍스트 업데이트**

```css
.slide-vision h2 {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**검증:** 브라우저에서 사이트 열기 → 배경이 딥 네이비(#080F1A)이고, 포인트 색상이 시안(#00D4FF)으로 보이는지 확인

---

## Task 2: Hero 배경 — 파티클 → 도트 그리드 교체

**Files:**
- Modify: `main.js` (전체 Particle 클래스 및 파티클 초기화 로직 제거, DotGrid 클래스로 교체)

**교체 대상 코드 범위 (main.js):**
- `class Particle { ... }` 전체
- `class ParticleSystem { ... }` 전체 (또는 동등한 초기화 코드)
- `particleCanvas` 관련 초기화 코드

**Step 1: main.js 상단에서 파티클 시스템 전체 제거 후 DotGrid 클래스로 교체**

`main.js`에서 `class Particle` 시작부터 파티클 애니메이션 루프 끝까지 삭제하고 아래 코드로 교체:

```javascript
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
          baseOpacity: 0.08,
          opacity:     0.08,
          // 각 도트마다 독립 pulse 타이밍
          phase:  Math.random() * Math.PI * 2,
          speed:  0.004 + Math.random() * 0.003,  // 매우 느린 펄스
          peak:   0.10 + Math.random() * 0.18,    // 최대 불투명도 0.10~0.28
        });
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.dots.forEach(d => {
      d.phase += d.speed;
      // sin 파형으로 부드럽게 pulse
      d.opacity = d.baseOpacity + (Math.sin(d.phase) * 0.5 + 0.5) * (d.peak - d.baseOpacity);

      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 212, 255, ${d.opacity.toFixed(3)})`;
      this.ctx.fill();
    });

    this.animFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.animFrame);
  }
}

// 초기화
const dotCanvas = document.getElementById('particleCanvas');
if (dotCanvas) {
  new DotGrid(dotCanvas);
}
```

**검증:** 브라우저에서 Hero 배경 → 조용한 시안 도트 그리드가 천천히 숨쉬듯 pulse하는지 확인. 마우스 움직여도 반응 없어야 함.

---

## Task 3: Hero 슬라이드 카피 전면 재작성

**Files:**
- Modify: `index.html` (lines 18–38, slide-hero 섹션)

**Step 1: Hero 슬라이드 HTML 교체**

기존 `<!-- 슬라이드 00: 메인 타이틀 (Hero) -->` 블록 전체를 아래로 교체:

```html
<!-- 슬라이드 00: Hero — 킥 메시지 -->
<div class="h-slide slide-hero">
  <div class="content">
    <!-- 브랜드 칩 -->
    <div class="hero-chip split-text">
      <span class="line">ORIGIN PARTNERS</span>
    </div>

    <!-- 킥 메시지 (핵심) -->
    <h1 class="split-text">
      <span class="line">예비·초기 스타트업의</span>
      <span class="line">진짜 문제를 발굴하는</span>
      <span class="line"><span class="point-color">전문가 파트너 그룹</span>.</span>
    </h1>

    <!-- 서브 카피 -->
    <p class="hero-slogan split-text">
      <span class="line">스타트업 실패의 가장 큰 이유는 아이디어가 없어서가 아닙니다.</span>
      <span class="line">진짜 문제를 발굴하지 못했기 때문입니다.</span>
    </p>

    <!-- 데이터 칩 3개 -->
    <div class="hero-data-chips split-text">
      <span class="line">
        <span class="data-chip"><span class="data-num">42%</span> 시장 니즈 부재</span>
        <span class="data-chip"><span class="data-num">29%</span> 자본 부족</span>
        <span class="data-chip"><span class="data-num">23%</span> 팀 역량 한계</span>
      </span>
    </div>

    <!-- CTA -->
    <div class="hero-cta split-text">
      <span class="line">
        <a href="mailto:oscar421@naver.com" class="cta-primary">→ 무료 상담 시작하기</a>
      </span>
    </div>
  </div>

  <div class="scroll-indicator">
    <span>Scroll</span>
    <div class="scroll-line"></div>
  </div>
</div>
```

**Step 2: Hero 칩·데이터·CTA CSS 추가**

`style.css`의 `/* Scroll Indicator */` 앞에 추가:

```css
/* Hero Chip */
.hero-chip {
  margin-bottom: 2rem;
}

.hero-chip .line {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid rgba(0, 212, 255, 0.3);
  padding: 6px 16px;
  border-radius: 20px;
  background: var(--accent-dim);
}

/* Hero Slogan */
.slide-hero .hero-slogan {
  font-size: clamp(1rem, 1.8vw, 1.3rem);
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  margin-top: 1.5rem;
}

/* Hero Data Chips */
.hero-data-chips {
  margin-bottom: 2.5rem;
}

.hero-data-chips .line {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.data-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.data-num {
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

/* Hero CTA */
.hero-cta {
  margin-top: 0.5rem;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: var(--accent);
  color: #080F1A;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: all 0.25s ease;
}

.cta-primary:hover {
  background: #33DDFF;
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.35);
}
```

**Step 3: h1 크기 조정 (칩+데이터 공간 확보)**

```css
h1 {
  font-size: clamp(2.5rem, 7vw, 6.5rem);
  line-height: 1.1;
}
```

**검증:** Hero 슬라이드 첫 화면에서 "예비·초기 스타트업의 / 진짜 문제를 발굴하는 / 전문가 파트너 그룹." 가 크게 표시되고, 3개 데이터 칩과 시안 CTA 버튼이 아래에 보이는지 확인

---

## Task 4: 슬라이드 01~03 카피 재작성 (6→4슬라이드)

**Files:**
- Modify: `index.html` (lines 40–183, slides 01~05)

**구조 변경:**
- 기존: Vision(01) / Mission(02) / Experts(03) / Network(04) / Journey(05) = 5슬라이드
- 변경: Problem(01) / Solution(02) / Process(03) = 3슬라이드 (슬라이드 2개 통합/제거)

**Step 1: Slide 01 — Problem (기존 Vision 교체)**

```html
<!-- 슬라이드 01: Problem — 왜 우리가 필요한가 -->
<div class="h-slide slide-vision">
  <div class="content">
    <div class="slide-label">
      <span class="label-title">Problem</span>
      <span class="label-number">01</span>
    </div>
    <h2 class="split-text">
      <span class="line">스타트업 <span class="point-color">42%</span>가</span>
      <span class="line">문제 정의에서 실패합니다.</span>
    </h2>
    <div class="vision-text split-text">
      <span class="line">아이디어는 많습니다.</span>
      <span class="line">하지만 고객이 실제로 겪는 '진짜 문제'를 찾는 것이</span>
      <span class="line">비즈니스 성공의 시작입니다.</span>
      <span class="line">오리진 파트너스는 바로 그 지점에서 함께합니다.</span>
    </div>
  </div>
</div>
```

**Step 2: Slide 02 — Solution (기존 Mission 교체)**

```html
<!-- 슬라이드 02: Solution — 우리가 하는 일 -->
<div class="h-slide slide-philosophy">
  <div class="content">
    <div class="slide-label">
      <span class="label-title">Solution</span>
      <span class="label-number">02</span>
    </div>
    <h2 class="split-text">
      <span class="line">4가지 전문 영역으로</span>
      <span class="line"><span class="point-color">시작부터 투자까지</span> 함께합니다.</span>
    </h2>
    <div class="philosophy-desc split-text">
      <span class="line">예비·초기 스타트업에게 필요한 모든 전문성을 한 팀에서.</span>
      <span class="line">각 분야 시니어급 전문가들이 직접 함께합니다.</span>
    </div>
    <div class="capability-tags">
      <span class="tag">BM 전략 설계</span>
      <span class="tag">IP 보호 전략</span>
      <span class="tag">IR 컨설팅</span>
      <span class="tag">AI 워크플로우</span>
      <span class="tag">사업계획서</span>
      <span class="tag">마케팅 전략</span>
    </div>
  </div>
</div>
```

**Step 3: Slide 03 — Process (기존 Experts+Network 통합, Journey 활용)**

```html
<!-- 슬라이드 03: Process — 어떻게 함께하는가 -->
<div class="h-slide slide-difference">
  <div class="content">
    <div class="slide-label">
      <span class="label-title">Process</span>
      <span class="label-number">03</span>
    </div>
    <h2 class="split-text">
      <span class="line">문제 발굴부터</span>
      <span class="line"><span class="point-color">투자 연결</span>까지, 5단계 파트너십.</span>
    </h2>
    <div class="philosophy-desc split-text">
      <span class="line">아이디어 단계부터 함께 시작합니다.</span>
      <span class="line">각 단계마다 검증된 전문가와 AI 워크플로우가 실행 속도를 높입니다.</span>
    </div>
    <div class="journey-steps">
      <div class="journey-step">
        <div class="step-dot"></div>
        <span>문제 발굴</span>
      </div>
      <div class="journey-line"></div>
      <div class="journey-step">
        <div class="step-dot"></div>
        <span>전략 설계(AI)</span>
      </div>
      <div class="journey-line"></div>
      <div class="journey-step">
        <div class="step-dot"></div>
        <span>실행 지원</span>
      </div>
      <div class="journey-line"></div>
      <div class="journey-step">
        <div class="step-dot"></div>
        <span>정부지원사업</span>
      </div>
      <div class="journey-line"></div>
      <div class="journey-step active">
        <div class="step-dot"></div>
        <span>투자·성장</span>
      </div>
    </div>
  </div>
</div>
```

**Step 4: 기존 슬라이드 04(Network), 05(Journey) 제거**

`<!-- 슬라이드 04: 파트너 네트워크 -->` 부터 `</div> <!-- /horizontal-container -->` 직전까지의 두 슬라이드 블록 삭제.

**Step 5: journey-step 도트 색상 시안으로 업데이트**

```css
.step-dot {
  width: 14px;
  height: 14px;
  background: var(--bg-elevated);
  border-radius: 50%;
  border: 2px solid var(--border-mid);
  transition: all 0.3s;
}

.journey-step.active .step-dot {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 16px rgba(0, 212, 255, 0.5);
}

.journey-step.active span {
  color: var(--accent);
  font-weight: 600;
}

.journey-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border-subtle), var(--border-mid));
  min-width: 40px;
  max-width: 80px;
}
```

**검증:** 가로 스크롤 총 4개 슬라이드(Hero+Problem+Solution+Process)만 존재하는지 확인

---

## Task 5: Contact 섹션 CTA 리라이팅

**Files:**
- Modify: `index.html` (lines 430–462, contact-section)

**Step 1: Contact 섹션 카피 교체**

```html
<!-- 컨택트 섹션 -->
<section class="vertical-section contact-section" id="contact-section">
  <div class="content">
    <h2 class="split-text">
      <span class="line">지금 어떤 단계에 계신가요?</span>
    </h2>
    <p class="contact-desc split-text">
      <span class="line">아이디어만 있어도, 팀이 없어도 괜찮습니다.</span>
      <span class="line">예비·초기 스타트업이라면 누구든 <span class="point-color">무료 상담</span>으로 시작하세요.</span>
      <span class="line">오리진 파트너스가 진짜 문제를 함께 발굴합니다.</span>
    </p>
    <div class="partnership-cta">
      <div class="cta-line"></div>
      <span class="cta-text">무료 상담 신청</span>
      <div class="cta-line"></div>
    </div>
    <div class="contact-buttons">
      <a href="mailto:oscar421@naver.com" class="contact-btn">
        <span class="btn-icon">✉</span>
        <span class="btn-text">oscar421@naver.com</span>
      </a>
      <a href="오리진파트너스-회사소개서.pdf" download class="contact-btn">
        <span class="btn-icon">↓</span>
        <span class="btn-text">회사소개서 다운로드</span>
      </a>
    </div>
    <p class="contact-phone" style="margin-top: 1.5rem; font-size: 1rem; color: var(--text-muted);">
      📍 경기도 성남시 분당구 판교 &nbsp;|&nbsp; 📞 010-9132-2870
    </p>
  </div>
  <footer class="footer">
    <p>&copy; 2026 오리진 파트너스. All rights reserved.</p>
  </footer>
</section>
```

**Step 2: contact-btn 색상 업데이트**

`style.css`에서 `.contact-btn` 관련 색상을 시안 기반으로 확인 후 필요시 업데이트:

```css
.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 10px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.contact-btn:hover {
  border-color: var(--accent);
  background: var(--accent-dim);
  color: var(--accent);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.15);
}
```

**검증:** Contact 섹션에서 "지금 어떤 단계에 계신가요?" 헤드라인과 "무료 상담 신청" CTA가 표시되는지 확인

---

## Task 6: What We Do 섹션 헤더 카피 업데이트

**Files:**
- Modify: `index.html` (lines 187–197, service-section header)

**Step 1: 서비스 섹션 헤더 교체**

```html
<section class="vertical-section" id="service-section">
  <div class="section-header">
    <h2 class="split-text">
      <span class="line">What We Do</span>
    </h2>
    <p class="section-desc split-text">
      <span class="line">예비·초기 스타트업에게 필요한 8가지 전문 서비스.</span>
      <span class="line">아이디어 검증부터 투자 유치까지 한 팀이 함께합니다.</span>
    </p>
  </div>
```

**Step 2: section-desc 색상 업데이트**

```css
.section-desc .line {
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: var(--text-secondary);
}
```

---

## Task 7: Our Partners 섹션 헤더 업데이트

**Files:**
- Modify: `index.html` (lines 399–407, team-section header)

**Step 1: Our Partners 헤더 교체**

```html
<div class="section-header">
  <h2 class="split-text">
    <span class="line">Our Partners</span>
  </h2>
  <p class="section-desc split-text">
    <span class="line">각 분야 전문가 그룹이</span>
    <span class="line">예비·초기 스타트업의 성공을 직접 함께합니다.</span>
  </p>
</div>
```

---

## Task 8: Service Journey 섹션 카피 업데이트

**Files:**
- Modify: `index.html` (lines 291–300, journey-map-section header)

**Step 1: Journey Map 헤더 교체**

```html
<div class="section-header">
  <h2 class="split-text">
    <span class="line">Service Journey</span>
  </h2>
  <p class="section-desc split-text">
    <span class="line">첫 상담부터 투자 연결까지,</span>
    <span class="line">각 단계에서 전문가가 직접 실행합니다.</span>
  </p>
</div>
```

---

## 검증 체크리스트

각 Task 완료 후 브라우저(Live Server 또는 파일 직접 오픈)에서 확인:

- [ ] 배경색이 딥 네이비(#080F1A)로 변경됨 — 기존 순수 블랙보다 덜 칙칙함
- [ ] 포인트 컬러가 전체적으로 시안(#00D4FF)으로 표시됨
- [ ] Hero 배경에 파티클 없이 조용한 도트 그리드만 보임
- [ ] Hero 첫 화면에서 "예비·초기 스타트업의 / 진짜 문제를 발굴하는 / 전문가 파트너 그룹." 표시됨
- [ ] 데이터 칩 [42%] [29%] [23%] 3개가 Hero에 표시됨
- [ ] "→ 무료 상담 시작하기" CTA 버튼이 시안으로 표시됨
- [ ] 가로 스크롤이 4개 슬라이드(Hero/Problem/Solution/Process)로 줄어듦
- [ ] 태그, 카드 hover, journey 카드가 모두 시안 테마로 통일됨
- [ ] Contact 섹션 CTA가 "무료 상담 신청"으로 변경됨
- [ ] 모바일(375px)에서 Hero 카피가 깨지지 않음
