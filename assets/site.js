/* Navigation par ancres : défilement fiable vers chaque section (pli) */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var id = a.getAttribute('href').slice(1);
  var el = id ? document.getElementById(id) : document.body;
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  try { history.replaceState(null, '', '#' + id); } catch (err) {}
});

/* Menu burger */
(function () {
  var b = document.querySelector('.burger');
  if (!b) return;
  function set(open) { document.body.classList.toggle('menu-open', open); b.setAttribute('aria-expanded', open); }
  b.addEventListener('click', function () { set(!document.body.classList.contains('menu-open')); });
  document.querySelectorAll('#menu a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();
