(() => {
  const video = document.getElementById('td-simulation');
  const toggle = document.getElementById('td-motion-toggle');
  if (video && toggle) {
    const update = () => {
      toggle.textContent = video.paused ? 'Play simulation ▷' : 'Pause simulation Ⅱ';
      toggle.setAttribute('aria-label', video.paused ? 'Play molecular simulation' : 'Pause molecular simulation');
    };
    toggle.addEventListener('click', () => {
      if (video.paused) video.play().catch(update);
      else video.pause();
    });
    video.addEventListener('play', update);
    video.addEventListener('pause', update);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!motion.matches) video.play().catch(update);
    motion.addEventListener('change', event => { if (event.matches) video.pause(); });
    update();
  }
  const tabs = [...document.querySelectorAll('.td-data-tabs [role="tab"]')];
  const select = tab => {
    tabs.forEach(t => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowRight') index = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') index = (i - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      if (index === undefined) return;
      event.preventDefault(); select(tabs[index]); tabs[index].focus();
    });
  });
})();
