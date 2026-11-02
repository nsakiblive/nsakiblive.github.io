/* Image inspection with native dialog focus management and working no-JS links. */
(() => {
  const dialog = document.getElementById('cr-lightbox');
  const image = document.getElementById('cr-lightbox-image');
  const title = document.getElementById('cr-lightbox-title');
  const caption = document.getElementById('cr-lightbox-caption');
  const original = document.getElementById('cr-lightbox-original');
  let opener;
  let previousOverflow = '';
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-lightbox]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        const source = link.querySelector('img');
        const figureCaption = link.closest('figure')?.querySelector('figcaption');
        image.src = link.href;
        image.alt = source?.alt || '';
        title.textContent = link.getAttribute('aria-label')?.replace(/^Enlarge\s+(the\s+)?/i, '') || 'Image detail';
        caption.textContent = (figureCaption ? [...figureCaption.childNodes].map(node => node.textContent.trim()).filter(Boolean).join(' ').replace(/Open to inspect ↗/g, '').trim() : '') || image.alt;
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
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  }
  const links = [...document.querySelectorAll('.cr-chapters a[href^="#"]')].filter(link => link.hash !== '#main');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        }
      }
    }, {rootMargin: '-15% 0px -55% 0px', threshold: 0});
    links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
  }
})();
