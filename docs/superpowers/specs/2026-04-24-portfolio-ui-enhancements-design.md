# Portfolio UI Enhancements — Design Spec
**Date:** 2026-04-24
**Scope:** Visual & functional improvements to Yo-Shiun Cheng's GitHub Pages portfolio

---

## Overview

Five enhancements to the existing portfolio site, all built on top of the current `css/style.css` and `js/main.js` without adding new files. Changes affect `index.html` and all 11 HTML pages where relevant.

---

## 1. Dark Mode

### Trigger & Persistence
- A 🌙 / ☀️ toggle button added to the right side of the navbar (same row as the hamburger menu).
- On click: toggle `data-theme="dark"` on `<html>`, save to `localStorage`.
- On page load: read `localStorage` first; fall back to `prefers-color-scheme: dark` if no saved preference.

### Dark Morandi Palette
All color overrides applied under `[data-theme="dark"]` in CSS:

| Variable         | Light            | Dark             |
|------------------|------------------|------------------|
| `--bg`           | `#f5f0eb`        | `#1c1917`        |
| `--rose`         | `#e8c4c0`        | `#4a2e2b`        |
| `--blue`         | `#c5d5e8`        | `#253447`        |
| `--green-light`  | `#c8d8c8`        | `#263326`        |
| `--green-mid`    | `#8fad91`        | `#2d4a2f`        |
| `--green-dark`   | `#4a7c59`        | `#1e3528`        |
| `--khaki`        | `#d4c9a8`        | `#35301f`        |
| `--lavender`     | `#c9c0d8`        | `#312b42`        |
| `--text`         | `#2c2c2c`        | `#e8e3dc`        |

### Transition
All color/background switches use `transition: background 0.3s ease, color 0.3s ease` on `:root` to prevent flash.

### Scope
Applied to all 11 HTML pages (index + 10 project detail pages).

---

## 2. Project Card Hover Effect

Applied to `.project-card` elements in `index.html`.

### Effect
- `transform: scale(1.02)` — subtle card enlarge
- `box-shadow` glow using the card's own background color at 60% opacity via `color-mix()`

### CSS
```css
.project-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.project-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 32px -4px color-mix(in srgb, var(--card-bg, #8fad91) 60%, transparent);
}
```

Each project card's inline `style` attribute is updated to also declare `--card-bg` alongside the existing `background`, e.g.:
```html
<a style="background:var(--green-mid); --card-bg: var(--green-mid)" ...>
```
This lets the CSS `color-mix()` pick up the card's color for the glow. The fallback `#8fad91` (green-mid) applies if `--card-bg` is not set.

### Accessibility
Wrapped in `@media (prefers-reduced-motion: no-preference)` — users with reduced motion preference see no animation.

---

## 3. Scroll Progress Bar

Only on `index.html` (long single-page scroll).

### Appearance
- Fixed `position: fixed; top: 0; left: 0` — sits above the navbar
- Height: `3px`
- Color: `var(--green-dark)` (adapts automatically in dark mode)
- `z-index` above navbar

### Behaviour
JS `scroll` event listener calculates:
```js
const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
progressBar.style.width = pct + '%';
```

---

## 4. Back-to-Top Button

Only on `index.html`.

### Appearance
- Fixed `bottom: 2rem; right: 2rem`
- Circular button, background `var(--green-dark)`, white SVG up-arrow icon
- Hover: slightly darker background

### Behaviour
- Hidden by default (`opacity: 0; pointer-events: none`)
- Fades in when `window.scrollY > 400`
- Click: `window.scrollTo({ top: 0, behavior: 'smooth' })`
- Transition: `opacity 0.3s ease`

---

## 5. Project Tag Filter

Only on `index.html`, above the projects grid.

### Tags
`All` · `CAE / FEA` · `Robotics` · `Control Systems` · `Structural Design` · `Data-Driven`

### Tag Assignment per Project

| Project                             | Tags                                  |
|-------------------------------------|---------------------------------------|
| Soft Robotic Tongue for Speech      | Robotics, Control Systems             |
| THR Jacket                          | Robotics, Control Systems             |
| Iterative Best Response Racing Game | Control Systems, Data-Driven          |
| Spider Web Optimization             | CAE / FEA, Data-Driven                |
| Cruise Controller (MPC)             | Control Systems                       |
| Mobile Robotics with Thymio         | Robotics, Control Systems             |
| Chassis Structural Analysis         | CAE / FEA, Structural Design          |
| Stress Analysis on Inverter         | CAE / FEA                             |
| NTU Racing Spaceframe Design        | CAE / FEA, Structural Design          |
| NTU Racing Suspension Brackets      | CAE / FEA, Structural Design          |

### HTML
Each `.project-card` gets a `data-tags` attribute:
```html
<a data-tags="robotics control-systems" class="project-card" ...>
```

### Filter Bar
Rendered above the grid as a row of `<button>` elements. Active filter styled with `var(--green-dark)` background + white text.

### Interaction Logic
- Default active: `All`
- On click: hide non-matching cards with `opacity: 0; transform: scale(0.95)` (transition 0.2s), show matching cards
- Cards use `pointer-events: none` when hidden to prevent accidental clicks

---

## Files Changed

| File | Changes |
|------|---------|
| `css/style.css` | Dark mode variables, hover effects, progress bar, back-to-top, filter button styles |
| `js/main.js` | Dark mode toggle + persistence, scroll progress bar, back-to-top show/hide, project filter logic |
| `index.html` | Dark mode toggle button in navbar, progress bar element, back-to-top button, filter bar, `data-tags` on each project card |
| `projects/*.html` (×10) | Dark mode toggle button in navbar |

---

## Out of Scope
- 3MF / 3D model viewer (decided against)
- Contact form
- "Now" page section
- Any changes to project detail page content
