/* Toujours ouvrir le site en haut de l'accueil (sauf lien direct vers une section) */
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
if (!location.hash) {
  window.scrollTo(0, 0);
  window.addEventListener('load', function () { window.scrollTo(0, 0); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) window.scrollTo(0, 0); });
}
/* Navigation par ancres : défilement fiable vers chaque section (pli) */
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var id = a.getAttribute('href').slice(1);
  var el = id ? document.getElementById(id) : document.body;
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

/* Partage : copier le lien, partage natif sur mobile (aucun script tiers) */
document.querySelectorAll('.share').forEach(function (box) {
  var url = box.dataset.url, title = box.dataset.title;
  var copy = box.querySelector('.copy'), nat = box.querySelector('.native');
  if (copy) copy.addEventListener('click', function () {
    var done = function () { copy.classList.add('ok'); setTimeout(function () { copy.classList.remove('ok'); }, 1800); };
    try { navigator.clipboard.writeText(box.dataset.url).then(done, done); } catch (e) { done(); }
  });
  if (nat && navigator.share) {
    nat.hidden = false;
    nat.addEventListener('click', function () { navigator.share({ title: title, url: box.dataset.url }).catch(function () {}); });
  }
});

/* Lune : mode sombre on/off, choix mémorisé dans ce navigateur seulement */
(function () {
  var root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
  function apply(light) {
    if (light) root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    if (meta) meta.setAttribute('content', light ? '#FFFFFF' : '#08090A');
    document.querySelectorAll('.theme-toggle').forEach(function (b) { b.setAttribute('aria-pressed', light ? 'false' : 'true'); });
  }
  /* L'adresse suit le mode : ?theme=clair en clair, adresse simple en sombre (le défaut) */
  function syncUrl(light) {
    var base = location.origin + location.pathname, url = base + (light ? '?theme=clair' : '');
    try { history.replaceState(null, '', url + location.hash); } catch (e) {}
    var enc = encodeURIComponent(url);
    document.querySelectorAll('.share').forEach(function (box) {
      box.dataset.url = url;
      box.querySelectorAll('a.sh').forEach(function (a) {
        a.href = a.href.replace(/(url=|u=|body=)[^&]*/, '$1' + enc);
      });
    });
  }
  apply(root.getAttribute('data-theme') === 'light');
  syncUrl(root.getAttribute('data-theme') === 'light');
  document.querySelectorAll('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var light = root.getAttribute('data-theme') !== 'light';
      apply(light);
      try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
      syncUrl(light);
    });
  });
})();
