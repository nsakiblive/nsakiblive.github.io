(() => {
  const toggle = document.getElementById('nl-demand-toggle');
  const rows = [...document.querySelectorAll('.nl-demand li')];
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? 'Show the top six programmes ↑' : 'Show all 23 programmes ↓';
    rows.forEach((row, i) => { row.hidden = !expanded && i >= 6; });
  });
})();
