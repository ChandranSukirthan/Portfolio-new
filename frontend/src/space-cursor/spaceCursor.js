import './spaceCursor.css';

(function initSpaceCursor() {
  if (typeof window === 'undefined') return;
  if (window.__spaceCursorInitialized) return;
  window.__spaceCursorInitialized = true;

  const HOVER_SELECTOR =
    'a, button, [role="button"], input, select, textarea, label[for], .btn-primary, .btn-secondary, .filter-tag, .solar-legend-btn, .solar-admin-btn, .solar-back-btn, .dash-nav-item, .nav-hamburger';

  const LERP_RING = 0.11;
  const LERP_AURA = 0.06;
  const TILT_FACTOR = 0.018;
  const MAX_TILT = 18;
  const PARTICLE_MIN_DIST = 6;
  const MAX_PARTICLES = 24;

  let dot = null;
  let ring = null;
  let aura = null;
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let auraX = -100;
  let auraY = -100;
  let velX = 0;
  let velY = 0;
  let tiltX = 0;
  let tiltY = 0;
  let lastParticleX = -100;
  let lastParticleY = -100;
  let isHovering = false;
  let isClicking = false;
  let rafId = null;
  let activeParticles = 0;
  let teardown = null;

  function isTouchDevice() {
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  }

  function createElements() {
    aura = document.createElement('div');
    aura.className = 'space-cursor-aura';
    aura.setAttribute('aria-hidden', 'true');

    ring = document.createElement('div');
    ring.className = 'space-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    dot = document.createElement('div');
    dot.className = 'space-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    document.body.append(aura, ring, dot);
  }

  function setDotPosition(x, y) {
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }

  function setLayerPosition(el, x, y, scale = 1, rotateX = 0, rotateY = 0) {
    el.style.transform =
      `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) ` +
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  }

  function spawnParticle(x, y) {
    if (activeParticles >= MAX_PARTICLES) return;

    const particle = document.createElement('div');
    const isStar = Math.random() > 0.45;
    particle.className = `space-cursor-particle ${isStar ? 'space-cursor-particle--star' : 'space-cursor-particle--dot'}`;

    const angle = Math.random() * Math.PI * 2;
    const drift = 8 + Math.random() * 14;
    const startOffsetX = (Math.random() - 0.5) * 6;
    const startOffsetY = (Math.random() - 0.5) * 6;
    const endX = Math.cos(angle) * drift;
    const endY = Math.sin(angle) * drift;

    particle.style.setProperty('--sx', `${startOffsetX}px`);
    particle.style.setProperty('--sy', `${startOffsetY}px`);
    particle.style.setProperty('--ex', `${endX}px`);
    particle.style.setProperty('--ey', `${endY}px`);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(particle);
    activeParticles += 1;

    particle.addEventListener(
      'animationend',
      () => {
        particle.remove();
        activeParticles -= 1;
      },
      { once: true }
    );
  }

  function maybeSpawnParticles(x, y) {
    const dx = x - lastParticleX;
    const dy = y - lastParticleY;
    const dist = Math.hypot(dx, dy);

    if (dist < PARTICLE_MIN_DIST) return;

    lastParticleX = x;
    lastParticleY = y;

    const trailX = ringX + (mouseX - ringX) * 0.35;
    const trailY = ringY + (mouseY - ringY) * 0.35;
    spawnParticle(trailX, trailY);

    if (dist > 14 && Math.random() > 0.55) {
      spawnParticle(trailX + (Math.random() - 0.5) * 8, trailY + (Math.random() - 0.5) * 8);
    }
  }

  function updateHoverState(target) {
    const interactive = target && target.closest ? target.closest(HOVER_SELECTOR) : null;
    const nextHover = Boolean(interactive);

    if (nextHover === isHovering) return;
    isHovering = nextHover;

    ring.classList.toggle('is-hover', isHovering);
    dot.classList.toggle('is-hover', isHovering);
    aura.classList.toggle('is-hover', isHovering);
  }

  function onMouseMove(e) {
    const prevX = mouseX;
    const prevY = mouseY;

    mouseX = e.clientX;
    mouseY = e.clientY;

    velX = mouseX - prevX;
    velY = mouseY - prevY;

    setDotPosition(mouseX, mouseY);
    maybeSpawnParticles(mouseX, mouseY);
    updateHoverState(e.target);
  }

  function onMouseOver(e) {
    updateHoverState(e.target);
  }

  function onMouseDown() {
    isClicking = true;
    dot.classList.add('is-click');
  }

  function onMouseUp() {
    isClicking = false;
    dot.classList.remove('is-click');
  }

  function animate() {
    ringX += (mouseX - ringX) * LERP_RING;
    ringY += (mouseY - ringY) * LERP_RING;
    auraX += (mouseX - auraX) * LERP_AURA;
    auraY += (mouseY - auraY) * LERP_AURA;

    tiltX += (velY * TILT_FACTOR - tiltX) * 0.12;
    tiltY += (-velX * TILT_FACTOR - tiltY) * 0.12;
    tiltX = Math.max(-MAX_TILT, Math.min(MAX_TILT, tiltX));
    tiltY = Math.max(-MAX_TILT, Math.min(MAX_TILT, tiltY));

    const scale = isClicking ? 0.88 : 1;

    setLayerPosition(aura, auraX, auraY, isHovering ? 1.08 : 1);
    setLayerPosition(ring, ringX, ringY, scale, tiltX, tiltY);

    velX *= 0.82;
    velY *= 0.82;

    rafId = requestAnimationFrame(animate);
  }

  function enable() {
    if (isTouchDevice()) return;

    document.documentElement.classList.add('space-cursor-active');
    createElements();
    setDotPosition(mouseX, mouseY);
    setLayerPosition(aura, auraX, auraY);
    setLayerPosition(ring, ringX, ringY);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('mouseup', onMouseUp, { passive: true });
    animate();

    teardown = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
      aura?.remove();
      ring?.remove();
      dot?.remove();
      document.querySelectorAll('.space-cursor-particle').forEach((el) => el.remove());
      document.documentElement.classList.remove('space-cursor-active');
      window.__spaceCursorInitialized = false;
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enable, { once: true });
  } else {
    enable();
  }

  window.__spaceCursorTeardown = () => {
    teardown?.();
  };
})();
