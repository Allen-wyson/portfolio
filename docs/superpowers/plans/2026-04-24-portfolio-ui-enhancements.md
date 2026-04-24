# Portfolio UI Enhancements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dark mode, project card hover glow, scroll progress bar, back-to-top button, and project tag filter to the GitHub Pages portfolio without adding new files.

**Architecture:** All CSS goes into `css/style.css`; all JS goes into `js/main.js`; HTML changes touch `index.html` and all 10 `projects/*.html` pages. CSS custom properties under `[data-theme="dark"]` on `<html>` drive dark mode. An anti-FOUC inline `<script>` in each `<head>` applies the saved theme before CSS renders.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, `color-mix()`, media queries), Vanilla JS (localStorage, scroll events, IntersectionObserver already in place)

---

### Task 1: Dark Mode CSS — Variables and Transitions

**Files:**
- Modify: `portfolio/css/style.css`

**What to add:** A `[data-theme="dark"]` block that overrides the 10 CSS custom properties. Also add `background-color`/`color` transitions to `body` and the elements that need smooth switching. Add a navbar border fix for dark mode.

- [ ] **Step 1: Add dark mode variable overrides at the end of the Variables section**

Open `portfolio/css/style.css`. After the closing `}` of the `:root` block (currently at line 17), add:

```css
[data-theme="dark"] {
  --bg:           #1c1917;
  --rose:         #4a2e2b;
  --blue:         #253447;
  --green-light:  #263326;
  --green-mid:    #2d4a2f;
  --green-dark:   #1e3528;
  --khaki:        #35301f;
  --lavender:     #312b42;
  --text-primary: #e8e3dc;
  --text-secondary: #a09891;
  --card-shadow:       rgba(0, 0, 0, 0.35);
  --card-shadow-hover: rgba(0, 0, 0, 0.55);
}
```

- [ ] **Step 2: Add smooth color transitions to body and key elements**

In `portfolio/css/style.css`, find the `body` rule (currently around line 22) and add the color transitions:

```css
body {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.65;
  background: var(--bg);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

Then add a block after the `[data-theme="dark"]` block you just wrote, to give all card-like elements smooth transitions:

```css
/* dark mode transition targets */
.navbar,
.bento-card,
.project-card,
.edu-card,
.detail-card,
.skills-group,
.pub-card,
.nav-links,
footer {
  transition: background-color 0.3s ease, color 0.3s ease,
              border-color 0.3s ease;
}
```

- [ ] **Step 3: Fix the navbar border for dark mode**

The navbar has `border-bottom: 1px solid rgba(0,0,0,0.07)` which disappears on dark backgrounds. Add after the block above:

```css
[data-theme="dark"] .navbar {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
[data-theme="dark"] footer {
  border-top-color: rgba(255, 255, 255, 0.08);
}
```

- [ ] **Step 4: Verify visually**

Open `portfolio/index.html` in Edge. The page should look identical to before (still light mode). Open DevTools → Elements, manually add `data-theme="dark"` to `<html>`. All sections should shift to muted dark Morandi tones, text should become `#e8e3dc`. Remove the attribute to restore.

- [ ] **Step 5: Commit**

```bash
git add portfolio/css/style.css
git commit -m "feat: add dark Morandi CSS variables and smooth color transitions"
```

---

### Task 2: Dark Mode HTML — Anti-FOUC Script and Toggle Button

**Files:**
- Modify: `portfolio/index.html`
- Modify: `portfolio/projects/soft-robotic-tongue.html`
- Modify: `portfolio/projects/thr-jacket.html`
- Modify: `portfolio/projects/racing-game.html`
- Modify: `portfolio/projects/spider-web-optimization.html`
- Modify: `portfolio/projects/cruise-controller.html`
- Modify: `portfolio/projects/mobile-robotics.html`
- Modify: `portfolio/projects/chassis-analysis.html`
- Modify: `portfolio/projects/inverter-stress.html`
- Modify: `portfolio/projects/spaceframe-design.html`
- Modify: `portfolio/projects/suspension-brackets.html`

**What to add per file:**
1. Inline `<script>` in `<head>` (before CSS link) that reads `localStorage` and sets `data-theme` immediately — prevents flash of wrong theme.
2. A `.theme-toggle` button with moon + sun SVG in the navbar.

For `index.html`, wrap the existing `.hamburger` and the new `.theme-toggle` in a `.nav-controls` div so they stay grouped on mobile.

**Moon SVG** (shown in light mode — click to go dark):
```html
<svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
```

**Sun SVG** (shown in dark mode — click to go light):
```html
<svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
```

- [ ] **Step 1: Add anti-FOUC script and toggle button CSS**

In `portfolio/css/style.css`, add the theme-toggle button styles and the `.nav-controls` wrapper CSS. Append after the `.hamburger` rules (around line 159):

```css
/* ── Theme toggle button ── */
.nav-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.15s ease, background-color 0.15s ease;
}
.theme-toggle:hover {
  background: rgba(0, 0, 0, 0.06);
  color: var(--green-dark);
}
[data-theme="dark"] .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
}
.theme-toggle .icon-sun { display: none; }
[data-theme="dark"] .theme-toggle .icon-moon { display: none; }
[data-theme="dark"] .theme-toggle .icon-sun { display: block; }
```

- [ ] **Step 2: Update index.html — anti-FOUC script in `<head>`**

In `portfolio/index.html`, add the anti-FOUC script **before** the `<link rel="stylesheet"` line:

```html
  <script>
    (function () {
      var t = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
  <link rel="stylesheet" href="css/style.css" />
```

- [ ] **Step 3: Update index.html — wrap hamburger + add theme-toggle in nav-controls**

In `portfolio/index.html`, replace the current `<nav>` block:

```html
  <nav class="navbar" id="navbar">
    <div class="nav-inner container">
      <a href="#hero" class="brand">Yo-Shiun Cheng</a>
      <ul class="nav-links" id="nav-links">
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#education" class="nav-link">Education</a></li>
        <li><a href="#experience" class="nav-link">Experience</a></li>
        <li><a href="#projects" class="nav-link">Projects</a></li>
        <li><a href="#skills" class="nav-link">Skills</a></li>
        <li><a href="#publications" class="nav-link">Publications</a></li>
        <li><a href="#contact" class="nav-link">Contact</a></li>
      </ul>
      <div class="nav-controls">
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
          <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <button class="hamburger" id="hamburger" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
```

- [ ] **Step 4: Update all 10 project pages — anti-FOUC script + toggle button**

For each of the 10 files below, make two changes:

**Change A** — Add anti-FOUC script before the `<link rel="stylesheet"` line:
```html
  <script>
    (function () {
      var t = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
  <link rel="stylesheet" href="../css/style.css" />
```

**Change B** — Replace the existing `<nav>` block with one that includes the theme toggle:
```html
  <nav class="navbar" id="navbar">
    <div class="nav-inner container">
      <a href="../index.html" class="brand">Yo-Shiun Cheng</a>
      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
        <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
    </div>
  </nav>
```

Apply to these files:
- `portfolio/projects/soft-robotic-tongue.html`
- `portfolio/projects/thr-jacket.html`
- `portfolio/projects/racing-game.html`
- `portfolio/projects/spider-web-optimization.html`
- `portfolio/projects/cruise-controller.html`
- `portfolio/projects/mobile-robotics.html`
- `portfolio/projects/chassis-analysis.html`
- `portfolio/projects/inverter-stress.html`
- `portfolio/projects/spaceframe-design.html`
- `portfolio/projects/suspension-brackets.html`

- [ ] **Step 5: Verify visually**

Open `portfolio/index.html` in Edge. The navbar should show a moon icon on the right (next to the hamburger icon on mobile). On desktop, moon icon appears at the far right of the nav links. No layout shift should occur. Open any project page — moon icon should appear at the far right of the brand name.

- [ ] **Step 6: Commit**

```bash
git add portfolio/index.html portfolio/projects/
git add portfolio/css/style.css
git commit -m "feat: add dark mode toggle button and anti-FOUC script to all pages"
```

---

### Task 3: Dark Mode JavaScript

**Files:**
- Modify: `portfolio/js/main.js`

**What to add:** `initDarkMode()` function that reads the toggle button click, toggles `[data-theme]` on `<html>`, and saves to `localStorage`. Call it from the `DOMContentLoaded` handler.

- [ ] **Step 1: Add initDarkMode function and wire it in**

In `portfolio/js/main.js`, update the `DOMContentLoaded` handler and add the function:

```js
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initFadeIn();
  initScrollSpy();
  initDarkMode();
  initScrollProgress();
  initBackToTop();
  initProjectFilter();
});
```

Then add the function at the end of the file:

```js
function initDarkMode() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}
```

Note: `initScrollProgress`, `initBackToTop`, and `initProjectFilter` are stubs that will be added in Tasks 6–8. Add them as empty functions for now so the DOMContentLoaded call does not throw:

```js
function initScrollProgress() {}
function initBackToTop() {}
function initProjectFilter() {}
```

- [ ] **Step 2: Verify dark mode toggle works end-to-end**

Open `portfolio/index.html` in Edge. Click the moon icon — page should smoothly transition to dark Morandi palette. Icon should switch to a sun. Click sun — page should revert to light. Reload the page while in dark mode — it should reload in dark mode (localStorage persistence). Open a project page while in dark mode — it should also be dark (anti-FOUC script reads localStorage).

- [ ] **Step 3: Verify prefers-color-scheme fallback**

In Edge DevTools → Rendering → Emulate CSS media feature → select `prefers-color-scheme: dark`. Clear localStorage (`Application → Local Storage → clear`). Reload — page should start in dark mode. Change emulation to `light` — page should start in light mode.

- [ ] **Step 4: Commit**

```bash
git add portfolio/js/main.js
git commit -m "feat: implement dark mode toggle with localStorage persistence"
```

---

### Task 4: Project Card Hover Effect CSS

**Files:**
- Modify: `portfolio/css/style.css`

**What to add:** Replace the existing `.project-card:hover` rule with a `scale(1.02)` + `color-mix()` box-shadow glow, wrapped in `@media (prefers-reduced-motion: no-preference)`.

- [ ] **Step 1: Update .project-card base transition**

In `portfolio/css/style.css`, find the `.project-card` rule (currently around line 285). Update its `transition` property to also include `opacity` (needed for the filter feature in Task 8):

```css
.project-card {
  border-radius: var(--radius); padding: 1.75rem;
  box-shadow: 0 2px 8px var(--card-shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.2s ease;
  display: flex; flex-direction: column; gap: 0.5rem; min-height: 180px;
}
```

- [ ] **Step 2: Move card hover into a reduced-motion media query and add glow**

Remove the existing `.project-card:hover` rule:
```css
.project-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px var(--card-shadow-hover); }
```

Replace it with:

```css
@media (prefers-reduced-motion: no-preference) {
  .project-card:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 32px -4px color-mix(in srgb, var(--card-bg, #b5c4b1) 60%, transparent);
  }
}
```

- [ ] **Step 3: Verify hover effect**

Open `portfolio/index.html` in Edge. Hover over any project card. The card should subtly enlarge (scale 1.02) and cast a soft glow matching the card's color. The glow will be `#b5c4b1`-tinted (the fallback `--card-bg` value) until Task 5 sets the per-card value.

- [ ] **Step 4: Commit**

```bash
git add portfolio/css/style.css
git commit -m "feat: add project card scale + color-mix glow hover effect"
```

---

### Task 5: Add --card-bg to Each Project Card

**Files:**
- Modify: `portfolio/index.html`

**What to add:** Each `.project-card` in `index.html` needs `--card-bg: var(--color)` added to its inline `style` alongside the existing `background`. This lets the `color-mix()` in the hover rule pick up the card's actual background color.

- [ ] **Step 1: Update all 10 project card inline styles**

In `portfolio/index.html`, update each project card's `style` attribute as follows (find by current background value, replace with the full new style):

| Card | Current inline style | New inline style |
|------|---------------------|------------------|
| soft-robotic-tongue | `style="background:var(--green-mid)"` | `style="background:var(--green-mid); --card-bg:var(--green-mid)"` |
| thr-jacket | `style="background:var(--green-light)"` | `style="background:var(--green-light); --card-bg:var(--green-light)"` |
| racing-game | `style="background:var(--khaki)"` | `style="background:var(--khaki); --card-bg:var(--khaki)"` |
| spider-web | `style="background:var(--green-mid)"` | `style="background:var(--green-mid); --card-bg:var(--green-mid)"` |
| cruise-controller | `style="background:var(--blue)"` | `style="background:var(--blue); --card-bg:var(--blue)"` |
| mobile-robotics | `style="background:var(--lavender)"` | `style="background:var(--lavender); --card-bg:var(--lavender)"` |
| chassis-analysis | `style="background:var(--rose)"` | `style="background:var(--rose); --card-bg:var(--rose)"` |
| inverter-stress | `style="background:var(--khaki)"` | `style="background:var(--khaki); --card-bg:var(--khaki)"` |
| spaceframe-design | `style="background:var(--green-light)"` | `style="background:var(--green-light); --card-bg:var(--green-light)"` |
| suspension-brackets | `style="background:var(--green-mid)"` | `style="background:var(--green-mid); --card-bg:var(--green-mid)"` |

- [ ] **Step 2: Verify per-card glow**

Open `portfolio/index.html` in Edge. Hover over each project card — the glow color should match the card's background color (green glow on green cards, blue on blue, rose on rose, etc.).

- [ ] **Step 3: Commit**

```bash
git add portfolio/index.html
git commit -m "feat: add --card-bg variable to project cards for per-card hover glow"
```

---

### Task 6: Scroll Progress Bar

**Files:**
- Modify: `portfolio/index.html`
- Modify: `portfolio/css/style.css`
- Modify: `portfolio/js/main.js`

**What to add:** A 3px fixed bar at the very top of the viewport (above the navbar, z-index 101) that tracks scroll position.

- [ ] **Step 1: Add progress bar HTML to index.html**

In `portfolio/index.html`, add the progress bar element as the first child of `<body>`, before the skip link:

```html
<body>
  <div id="scroll-progress" role="progressbar" aria-label="Page scroll progress" aria-valuemin="0" aria-valuemax="100"></div>
  <a href="#about" class="skip-link">Skip to main content</a>
  <nav class="navbar" id="navbar">
```

- [ ] **Step 2: Add progress bar CSS**

In `portfolio/css/style.css`, append after the `.skip-link` rules (near the end of the file):

```css
/* ── Scroll progress bar ── */
#scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--green-dark);
  z-index: 101;
  pointer-events: none;
  transition: width 0.05s linear;
}
```

- [ ] **Step 3: Implement initScrollProgress in main.js**

In `portfolio/js/main.js`, replace the empty `function initScrollProgress() {}` stub with:

```js
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
}
```

- [ ] **Step 4: Verify scroll progress bar**

Open `portfolio/index.html` in Edge. Scroll down — a thin `--green-dark` colored bar should grow from left to right at the very top of the viewport, above the navbar. At the bottom of the page it should be 100% wide. Scrolling back up should shrink it.

- [ ] **Step 5: Commit**

```bash
git add portfolio/index.html portfolio/css/style.css portfolio/js/main.js
git commit -m "feat: add scroll progress bar to index page"
```

---

### Task 7: Back-to-Top Button

**Files:**
- Modify: `portfolio/index.html`
- Modify: `portfolio/css/style.css`
- Modify: `portfolio/js/main.js`

**What to add:** A circular fixed button at `bottom: 2rem; right: 2rem` with a chevron-up SVG. Hidden by default, fades in after 400px of scroll.

- [ ] **Step 1: Add back-to-top button HTML to index.html**

In `portfolio/index.html`, add the button just before `</body>` (after the `<script>` tag):

```html
  <script src="js/main.js"></script>
  <button id="back-to-top" class="back-to-top" aria-label="Back to top">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
  </button>
</body>
```

- [ ] **Step 2: Add back-to-top CSS**

In `portfolio/css/style.css`, append after the `#scroll-progress` rule:

```css
/* ── Back-to-top button ── */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--green-dark);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, filter 0.15s ease;
  z-index: 99;
}
.back-to-top.visible {
  opacity: 1;
  pointer-events: auto;
}
.back-to-top:hover { filter: brightness(0.88); }
```

- [ ] **Step 3: Implement initBackToTop in main.js**

In `portfolio/js/main.js`, replace the empty `function initBackToTop() {}` stub with:

```js
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
```

- [ ] **Step 4: Verify back-to-top button**

Open `portfolio/index.html` in Edge. The button should be invisible at the top. Scroll past the hero section (>400px) — a circular `--green-dark` button with a chevron should fade in at the bottom-right. Click it — the page should smoothly scroll to the top and the button should fade out.

- [ ] **Step 5: Commit**

```bash
git add portfolio/index.html portfolio/css/style.css portfolio/js/main.js
git commit -m "feat: add back-to-top button to index page"
```

---

### Task 8: Project Tag Filter

**Files:**
- Modify: `portfolio/index.html`
- Modify: `portfolio/css/style.css`
- Modify: `portfolio/js/main.js`

**What to add:** A row of filter buttons above the projects grid. Each button filters the grid to show only cards with a matching `data-tags` attribute. Default: `All` is active, all cards visible.

**Tag mapping (data-tags values are kebab-case, space-separated for multi-tag):**

| Project | data-tags value |
|---------|----------------|
| Soft Robotic Tongue for Speech | `robotics control-systems` |
| THR Jacket | `robotics control-systems` |
| Iterative Best Response Racing Game | `control-systems data-driven` |
| Spider Web Optimization | `cae-fea data-driven` |
| Cruise Controller (MPC) | `control-systems` |
| Mobile Robotics with Thymio | `robotics control-systems` |
| Chassis Structural Analysis | `cae-fea structural-design` |
| Stress Analysis on Inverter | `cae-fea` |
| NTU Racing Spaceframe Design | `cae-fea structural-design` |
| NTU Racing Suspension Brackets | `cae-fea structural-design` |

- [ ] **Step 1: Add data-tags to project cards and insert filter bar in index.html**

In `portfolio/index.html`, inside the `<!-- ── PROJECTS ── -->` section, replace the projects section HTML with:

```html
    <!-- ── PROJECTS ── -->
    <section id="projects">
      <div class="container">
        <p class="section-label">Projects</p>
        <h2>Selected Work</h2>

        <div class="filter-bar" role="group" aria-label="Filter projects by tag">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="cae-fea">CAE / FEA</button>
          <button class="filter-btn" data-filter="robotics">Robotics</button>
          <button class="filter-btn" data-filter="control-systems">Control Systems</button>
          <button class="filter-btn" data-filter="structural-design">Structural Design</button>
          <button class="filter-btn" data-filter="data-driven">Data-Driven</button>
        </div>

        <div class="projects-grid fade-in">

          <a href="projects/soft-robotic-tongue.html" class="project-card" data-tags="robotics control-systems" style="background:var(--green-mid); --card-bg:var(--green-mid)">
            <p class="section-label">2025 · CREATE Lab</p>
            <h3>Soft Robotic Tongue for Speech</h3>
            <div class="pill-row"><span class="pill">Soft Robotics</span><span class="pill">Pneumatic Actuation</span><span class="pill">SolidWorks</span></div>
          </a>

          <a href="projects/thr-jacket.html" class="project-card" data-tags="robotics control-systems" style="background:var(--green-light); --card-bg:var(--green-light)">
            <p class="section-label">2025 · EPFL</p>
            <h3>THR Jacket — Auto Temp &amp; Humidity Regulation</h3>
            <div class="pill-row"><span class="pill">PI Control</span><span class="pill">Arduino</span><span class="pill">Circuit Design</span></div>
          </a>

          <a href="projects/racing-game.html" class="project-card" data-tags="control-systems data-driven" style="background:var(--khaki); --card-bg:var(--khaki)">
            <p class="section-label">2025 · EPFL</p>
            <h3>Iterative Best Response of Zero-sum Racing Game</h3>
            <div class="pill-row"><span class="pill">Game Theory</span><span class="pill">Python</span><span class="pill">Optimization</span></div>
          </a>

          <a href="projects/spider-web-optimization.html" class="project-card" data-tags="cae-fea data-driven" style="background:var(--green-mid); --card-bg:var(--green-mid)">
            <p class="section-label">2025 · EPFL</p>
            <h3>Strength-to-Weight Optimization of Spider-web Structure</h3>
            <div class="pill-row"><span class="pill">ANSYS</span><span class="pill">MATLAB</span><span class="pill">FEA</span><span class="pill">Bayesian Optimization</span></div>
          </a>

          <a href="projects/cruise-controller.html" class="project-card" data-tags="control-systems" style="background:var(--blue); --card-bg:var(--blue)">
            <p class="section-label">2024 · EPFL</p>
            <h3>Cruise Controller for a Car on Highway</h3>
            <div class="pill-row"><span class="pill">MPC</span><span class="pill">MATLAB</span><span class="pill">Control Systems</span></div>
          </a>

          <a href="projects/mobile-robotics.html" class="project-card" data-tags="robotics control-systems" style="background:var(--lavender); --card-bg:var(--lavender)">
            <p class="section-label">2024 · EPFL</p>
            <h3>Mobile Robotics with Thymio</h3>
            <div class="pill-row"><span class="pill">Mobile Robotics</span><span class="pill">Kalman Filter</span><span class="pill">Python</span></div>
          </a>

          <a href="projects/chassis-analysis.html" class="project-card" data-tags="cae-fea structural-design" style="background:var(--rose); --card-bg:var(--rose)">
            <p class="section-label">2023 · Delta Electronics</p>
            <h3>Chassis Structural &amp; Vibration Analysis</h3>
            <div class="pill-row"><span class="pill">Abaqus</span><span class="pill">SolidWorks</span><span class="pill">Vibration Analysis</span></div>
          </a>

          <a href="projects/inverter-stress.html" class="project-card" data-tags="cae-fea" style="background:var(--khaki); --card-bg:var(--khaki)">
            <p class="section-label">2023 · Delta Electronics</p>
            <h3>Stress Analysis on Traction Inverter</h3>
            <div class="pill-row"><span class="pill">Abaqus</span><span class="pill">Stress Analysis</span><span class="pill">FEA</span></div>
          </a>

          <a href="projects/spaceframe-design.html" class="project-card" data-tags="cae-fea structural-design" style="background:var(--green-light); --card-bg:var(--green-light)">
            <p class="section-label">2022–2023 · NTU Racing</p>
            <h3>NTU Racing Team Spaceframe Design</h3>
            <div class="pill-row"><span class="pill">SolidWorks</span><span class="pill">COMSOL</span><span class="pill">FSAE</span></div>
          </a>

          <a href="projects/suspension-brackets.html" class="project-card" data-tags="cae-fea structural-design" style="background:var(--green-mid); --card-bg:var(--green-mid)">
            <p class="section-label">2021–2022 · NTU Racing</p>
            <h3>NTU Racing Suspension Brackets Design</h3>
            <div class="pill-row"><span class="pill">SolidWorks</span><span class="pill">COMSOL</span><span class="pill">Structural Analysis</span></div>
          </a>

        </div>
      </div>
    </section>
```

Note: this step also replaces Task 5's `--card-bg` additions since it rewrites the full section — no need to do Task 5 separately if this task runs first.

- [ ] **Step 2: Add filter bar and filter button CSS**

In `portfolio/css/style.css`, append after the `.back-to-top` rules:

```css
/* ── Project tag filter ── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.filter-btn {
  padding: 0.35rem 0.9rem;
  border-radius: 100px;
  border: 1.5px solid var(--green-dark);
  background: transparent;
  color: var(--green-dark);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.filter-btn:hover,
.filter-btn.active {
  background: var(--green-dark);
  color: #fff;
}
```

Also update the `@media (prefers-reduced-motion: reduce)` block in `style.css` to add `.filter-btn`:

```css
@media (prefers-reduced-motion: reduce) {
  .fade-in { opacity: 1; transform: none; transition: none; }
  .bento-card, .project-card, .edu-card, .nav-link,
  .contact-link, .pill, .btn, .filter-btn,
  .back-to-top, .theme-toggle { transition: none; }
  .bento-card:hover, .project-card:hover, .edu-card:hover { transform: none; }
}
```

- [ ] **Step 3: Implement initProjectFilter in main.js**

In `portfolio/js/main.js`, replace the empty `function initProjectFilter() {}` stub with:

```js
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const tags = (card.dataset.tags ?? '').split(' ');
        const matches = filter === 'all' || tags.includes(filter);
        card.style.opacity = matches ? '' : '0';
        card.style.transform = matches ? '' : 'scale(0.95)';
        card.style.pointerEvents = matches ? '' : 'none';
      });
    });
  });
}
```

- [ ] **Step 4: Verify project tag filter**

Open `portfolio/index.html` in Edge. The filter bar should appear between the "Selected Work" heading and the project grid. Default state: "All" button is active (filled), all 10 cards visible.

Click "CAE / FEA" — should show: Spider Web, Chassis, Inverter, Spaceframe, Suspension Brackets (5 cards). The other 5 fade out and scale down.

Click "Robotics" — should show: Soft Robotic Tongue, THR Jacket, Mobile Robotics (3 cards).

Click "Control Systems" — should show: Soft Robotic Tongue, THR Jacket, Racing Game, Cruise Controller, Mobile Robotics (5 cards).

Click "All" — all 10 cards return.

- [ ] **Step 5: Commit**

```bash
git add portfolio/index.html portfolio/css/style.css portfolio/js/main.js
git commit -m "feat: add project tag filter bar with 6 categories"
```

---

### Task 9: Final Integration Check and Deploy

**Files:** No code changes — verification and push only.

- [ ] **Step 1: Full feature walkthrough in Edge**

Open `portfolio/index.html`. Check each feature in order:
1. **Dark mode:** Click toggle → smooth palette transition → refresh → stays dark → click again → light
2. **Scroll progress bar:** Scroll down → bar grows → scroll up → bar shrinks
3. **Back-to-top:** Scroll > 400px → button appears → click → smooth scroll to top → button disappears
4. **Card hover:** Hover each project card → subtle scale + colored glow
5. **Tag filter:** Click each of the 6 buttons → correct subset visible → "All" restores all 10
6. **Project detail pages:** Navigate to any project page → dark mode toggle present and functional → theme persists from index page

- [ ] **Step 2: Check reduced-motion behavior**

In Edge DevTools → Rendering → Emulate CSS media → `prefers-reduced-motion: reduce`. Verify: card hover shows no scale or transform, filter switching shows no opacity fade animation (cards appear/disappear instantly), back-to-top button still functional.

- [ ] **Step 3: Check mobile layout**

In Edge DevTools → toggle device toolbar → iPhone 12 size. Verify: theme toggle appears alongside hamburger in `.nav-controls`, filter bar wraps to multiple lines if needed, back-to-top button does not overlap other elements.

- [ ] **Step 4: Push to GitHub Pages**

```bash
git push origin feature/portfolio
```

Then open a PR to `main` or merge directly if the branch is already set up for GitHub Pages deployment.

---

## Self-Review Notes

**Spec coverage check:**
- Dark mode (Morandi dark palette, localStorage, prefers-color-scheme fallback, 11 pages): ✅ Tasks 1–3
- Card hover (scale(1.02), color-mix glow, --card-bg, reduced-motion): ✅ Tasks 4–5 (also covered in Task 8 Step 1 which rewrites the card HTML)
- Scroll progress bar (3px, var(--green-dark), z-index above navbar): ✅ Task 6
- Back-to-top (appears after 400px, smooth scroll, opacity transition): ✅ Task 7
- Project tag filter (6 tags, data-tags attrs, fade+scale hidden cards, active button style): ✅ Task 8

**Note on Task 5 + Task 8 overlap:** Task 8 Step 1 rewrites the entire projects section including `--card-bg` on each card. If executing in order, skip Task 5 entirely — Task 8 covers it. If executing out of order, run Task 5 first.

**Potential visual issue:** `--green-dark` in dark mode is `#1e3528` (very dark green). The `.btn-primary` button, active nav links, progress bar, and back-to-top button all use this color. On the `#1c1917` background they may have low contrast. If the implementer notices this during visual checks, increase `--green-dark` in dark mode to `#3d6b45` (mid-dark green) for better button/accent visibility while keeping card backgrounds as-is.
