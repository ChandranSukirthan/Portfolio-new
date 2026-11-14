// Vanilla JS 3D tilt utility — attach to any element
export function applyTilt(el, options = {}) {
  const max = options.max || 12;
  const scale = options.scale || 1.03;
  const glare = options.glare !== false;

  function onMove(e) {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale3d(${scale},${scale},${scale})`;
    if (glare) {
      el.style.setProperty('--tilt-glare-x', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--tilt-glare-y', `${(y + 0.5) * 100}%`);
      el.classList.add('tilt-glare-active');
    }
  }
  function onLeave() {
    el.style.transform = '';
    el.classList.remove('tilt-glare-active');
  }
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
  return () => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  };
}
