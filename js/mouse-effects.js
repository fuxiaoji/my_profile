/**
 * Kirameku-inspired pointer effects for the static site.
 * Desktop-only by default, with an instant toolbar toggle.
 */
(function () {
  const STORAGE_KEY = 'site-mouse-effects';
  const MAX_TRAIL = 180;
  const MAX_BURST = 140;
  const MAX_SPARKLES = 28;
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let canvas = null;
  let ctx = null;
  let rafId = 0;
  let enabled = false;
  let dpr = 1;
  let lastMoveAt = 0;
  let lastClickAt = 0;
  let trailParticles = [];
  let burstParticles = [];
  let sparkles = [];

  const burstPalette = ['#38bdf8', '#818cf8', '#a78bfa', '#f0abfc', '#f9a8d4', '#facc15'];

  function canRun() {
    const connection = typeof navigator !== 'undefined'
      ? (navigator.connection || navigator.mozConnection || navigator.webkitConnection)
      : null;
    return !mobileQuery.matches && !reduceQuery.matches && !(connection && connection.saveData);
  }

  function storedPreference() {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function savePreference(value) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // Storage can be unavailable in strict privacy modes.
    }
  }

  function shouldEnableByDefault() {
    const preference = storedPreference();
    if (preference === 'off') return false;
    if (preference === 'on') return canRun();
    return canRun();
  }

  function notify() {
    const detail = { enabled, available: canRun() };
    let event;
    if (typeof CustomEvent === 'function') {
      event = new CustomEvent('mouseeffectschange', { detail });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent('mouseeffectschange', false, false, detail);
    }
    window.dispatchEvent(event);
  }

  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d', { alpha: true });
    resizeCanvas();
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function prune(list, max) {
    if (list.length > max) list.splice(0, list.length - max);
  }

  function isTypingTarget(target) {
    if (!target || target === document) return false;
    return Boolean(target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]'));
  }

  function onPointerMove(event) {
    if (!enabled || event.pointerType === 'touch') return;
    const now = performance.now();
    if (now - lastMoveAt < 12) return;
    lastMoveAt = now;

    const count = Math.random() > 0.55 ? 2 : 1;
    for (let i = 0; i < count; i += 1) {
      trailParticles.push({
        x: event.clientX + randomBetween(-3, 3),
        y: event.clientY + randomBetween(-3, 3),
        vx: randomBetween(-0.45, 0.45),
        vy: randomBetween(-0.45, 0.45),
        radius: randomBetween(1.4, 3.4),
        hue: randomBetween(185, 248),
        age: 0,
        life: randomBetween(22, 48)
      });
    }
    prune(trailParticles, MAX_TRAIL);
    ensureLoop();
  }

  function onClick(event) {
    if (!enabled || isTypingTarget(event.target)) return;
    const now = performance.now();
    if (now - lastClickAt < 90) return;
    lastClickAt = now;

    const count = Math.floor(randomBetween(8, 15));
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + randomBetween(-0.24, 0.24);
      const speed = randomBetween(2.0, 4.8);
      burstParticles.push({
        x: event.clientX,
        y: event.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: randomBetween(2.0, 4.6),
        color: burstPalette[Math.floor(Math.random() * burstPalette.length)],
        age: 0,
        life: randomBetween(34, 56)
      });
    }
    prune(burstParticles, MAX_BURST);
    ensureLoop();
  }

  function getSelectionRects() {
    const selection = window.getSelection && window.getSelection();
    if (!selection || selection.isCollapsed || String(selection).trim().length === 0) return [];

    const rects = [];
    for (let i = 0; i < selection.rangeCount; i += 1) {
      const range = selection.getRangeAt(i);
      Array.from(range.getClientRects()).forEach((rect) => {
        if (rect.width > 0 && rect.height > 0) rects.push(rect);
      });
    }
    return rects;
  }

  function spawnSparkle(x, y, scale) {
    sparkles.push({
      x,
      y,
      scale,
      rotation: randomBetween(0, Math.PI),
      hue: randomBetween(190, 305),
      age: 0,
      life: randomBetween(24, 36)
    });
  }

  function onSelectionEnd() {
    if (!enabled) return;
    window.setTimeout(() => {
      const rects = getSelectionRects();
      if (!rects.length) return;

      const left = Math.min(...rects.map((rect) => rect.left));
      const right = Math.max(...rects.map((rect) => rect.right));
      const top = Math.min(...rects.map((rect) => rect.top));
      const bottom = Math.max(...rects.map((rect) => rect.bottom));
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      spawnSparkle(centerX, centerY, 1.05);
      if (right - left > 70) {
        spawnSparkle(left + 8, centerY, 0.76);
        spawnSparkle(right - 8, centerY, 0.76);
      }
      if (bottom - top > 46) spawnSparkle(centerX, top + 8, 0.68);
      prune(sparkles, MAX_SPARKLES);
      ensureLoop();
    }, 20);
  }

  function drawTrail(particle) {
    particle.age += 1;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.985;
    particle.vy *= 0.985;

    const progress = particle.age / particle.life;
    const alpha = (1 - progress) * (isDark() ? 0.78 : 0.46);
    const radius = particle.radius * (1 + progress * 0.9);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowBlur = isDark() ? 12 : 7;
    ctx.shadowColor = `hsla(${particle.hue}, 88%, ${isDark() ? 68 : 52}%, ${alpha})`;
    ctx.fillStyle = `hsla(${particle.hue}, 90%, ${isDark() ? 72 : 48}%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBurst(particle) {
    particle.age += 1;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.075;
    particle.vx *= 0.985;
    particle.vy *= 0.985;

    const progress = particle.age / particle.life;
    const alpha = (1 - progress) * (isDark() ? 0.88 : 0.62);
    ctx.save();
    ctx.globalAlpha = Math.max(alpha, 0);
    ctx.shadowBlur = isDark() ? 14 : 8;
    ctx.shadowColor = particle.color;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * (1 - progress * 0.2), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(sparkle) {
    sparkle.age += 1;
    const progress = sparkle.age / sparkle.life;
    const alpha = (1 - progress) * (isDark() ? 0.92 : 0.66);
    const pulse = Math.sin(progress * Math.PI);
    const size = sparkle.scale * (8 + pulse * 13);

    ctx.save();
    ctx.translate(sparkle.x, sparkle.y);
    ctx.rotate(sparkle.rotation + progress * 0.7);
    ctx.globalAlpha = Math.max(alpha, 0);
    ctx.shadowBlur = isDark() ? 16 : 10;
    ctx.shadowColor = `hsla(${sparkle.hue}, 95%, 68%, ${alpha})`;
    ctx.fillStyle = `hsla(${sparkle.hue}, 95%, ${isDark() ? 76 : 56}%, ${alpha})`;
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      const length = i % 2 === 0 ? size : size * 0.28;
      const x = Math.cos(angle) * length;
      const y = Math.sin(angle) * length;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawFrame() {
    rafId = 0;
    if (!enabled || !ctx || document.hidden) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    trailParticles = trailParticles.filter((particle) => particle.age < particle.life);
    burstParticles = burstParticles.filter((particle) => particle.age < particle.life);
    sparkles = sparkles.filter((sparkle) => sparkle.age < sparkle.life);

    trailParticles.forEach(drawTrail);
    burstParticles.forEach(drawBurst);
    sparkles.forEach(drawSparkle);

    if (trailParticles.length || burstParticles.length || sparkles.length) {
      rafId = requestAnimationFrame(drawFrame);
    }
  }

  function ensureLoop() {
    if (!rafId && enabled && !document.hidden) {
      rafId = requestAnimationFrame(drawFrame);
    }
  }

  function addListeners() {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('mouseup', onSelectionEnd, { passive: true });
    window.addEventListener('touchend', onSelectionEnd, { passive: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  function removeListeners() {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('click', onClick);
    window.removeEventListener('mouseup', onSelectionEnd);
    window.removeEventListener('touchend', onSelectionEnd);
    window.removeEventListener('resize', resizeCanvas);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    } else {
      ensureLoop();
    }
  }

  function enable(options = {}) {
    if (!canRun()) {
      enabled = false;
      if (options.persist) savePreference('off');
      notify();
      return false;
    }
    if (enabled) {
      notify();
      return true;
    }

    createCanvas();
    enabled = true;
    addListeners();
    ensureLoop();
    if (options.persist) savePreference('on');
    notify();
    return true;
  }

  function disable(options = {}) {
    if (!enabled && !canvas) {
      if (options.persist) savePreference('off');
      notify();
      return;
    }
    enabled = false;
    removeListeners();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    trailParticles = [];
    burstParticles = [];
    sparkles = [];
    if (canvas) canvas.remove();
    canvas = null;
    ctx = null;
    if (options.persist) savePreference('off');
    notify();
  }

  function toggle() {
    if (enabled) {
      disable({ persist: true });
      return false;
    }
    return enable({ persist: true });
  }

  function refresh() {
    const preference = storedPreference();
    if (!canRun()) {
      disable();
      return;
    }
    if (preference !== 'off') enable();
  }

  function init() {
    if (shouldEnableByDefault()) enable();
    else notify();
  }

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', refresh);
    reduceQuery.addEventListener('change', refresh);
  } else {
    mobileQuery.addListener(refresh);
    reduceQuery.addListener(refresh);
  }

  window.MouseEffects = {
    enable: () => enable({ persist: true }),
    disable: () => disable({ persist: true }),
    toggle,
    isEnabled: () => enabled,
    isAvailable: canRun,
    refresh
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
