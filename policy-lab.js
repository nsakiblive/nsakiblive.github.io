(() => {
  const dialog = document.getElementById('pl-viewer');
  const image = document.getElementById('pl-viewer-image');
  const title = document.getElementById('pl-viewer-title');
  const caption = document.getElementById('pl-viewer-caption');
  const original = document.getElementById('pl-viewer-original');
  let opener;
  let previousOverflow = '';
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-policy-image]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        image.src = link.href;
        image.alt = link.querySelector('img')?.alt || '';
        const figureCaption = link.closest('figure')?.querySelector('figcaption');
        caption.textContent = figureCaption ? [...figureCaption.childNodes].map(n => n.textContent.trim()).filter(Boolean).join(' ') : image.alt;
        title.textContent = link.getAttribute('aria-label')?.replace(/^Enlarge\s+(the\s+)?/i, '') || 'Image detail';
        original.href = link.href;
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
      });
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      image.removeAttribute('src');
      opener?.focus({preventScroll: true});
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  }
  const links = [...document.querySelectorAll('.pl-chapters a')].filter(link => link.hash && link.hash !== '#policy-main');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-15% 0px -55% 0px'});
    links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
  }
})();
