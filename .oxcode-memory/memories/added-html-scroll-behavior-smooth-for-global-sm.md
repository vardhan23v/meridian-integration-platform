---
title: Added `html { scroll-behavior: smooth; }` for global sm
slug: added-html-scroll-behavior-smooth-for-global-sm
tags: 
scope: project
updated_at: 2026-07-18T18:30:35.920Z
source: live
hook: Added `html { scroll-behavior: smooth; }` for global smooth scrolling
---

• Added `html { scroll-behavior: smooth; }` for global smooth scrolling
• Defined `@keyframes fade-in-up` and `slide-in-right` for reusable animations
• Applied `transition-colors` and `transition-transform` to interactive elements (`a`, `button`, `input`, `select`, `textarea`)
• Ensured skeleton loaders use `animate-pulse` for perceived smoothness
• Updated `apps/web/src/app/globals.css` with above styles and transitions
- Added CSS custom properties for glass opacity, blur radius, border luminance, and glow colors in `globals.css`
- Defined reusable `@layer utilities` classes: `.glass`, `.glass-strong`, `.glass-border`, `.glow`
- Enhanced keyframes with `fade-in-up`, `slide-in-right`, `scale-in`, `shimmer`, `glow-pulse-strong`, `border-shimmer`
- Maintained existing `scroll-behavior` and `transition` rules
- Implemented dark mode variants for all glass and glow tokens
- Preserved legacy aliases for backward compatibility
- Composed liquid-glass effects using Tailwind utility classes
- Set 4-tier glass opacity tokens: light (0.45), medium (0.55), strong (0.72), subtle (0.28)
- Set 4-tier blur radius tokens: sm (8px), md (16px), lg (24px), xl (40px)
- Defined 3-tier border luminance tokens: default, strong, subtle
- Defined 6 glow color tokens: accent, accent-strong, success, warning, danger, white
- Defined 3 shadow tokens: standard, strong, elevated
- Used `rgba()` with opacity tokens for surface background compositions
- Added animation utility classes for keyframe effects
- Included staggered animation delay helpers (`.delay-{100..500}`)
