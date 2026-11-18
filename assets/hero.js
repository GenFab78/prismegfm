/* Prisme GFM — animation du logo (premier écran)
   Points qui scintillent, signaux qui relient les nœuds, constellation autour.
   S'arrête hors écran et respecte « réduire les animations ». */
document.querySelectorAll('.logo-stage').forEach(function (stage) {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  // Nœuds repérés sur le logo (coordonnées de l'image 750 × 498)
  var C = '#32BEC1', O = '#FF8A00', J = '#FFD100', R = '#FF3D4A', W = '#EAF6F7';
  var nodes = [
    [367, 68, W], [290, 185, C], [333, 192, C], [372, 159, C], [416, 177, C], [405, 193, C],
    [225, 209, J], [265, 221, O], [318, 243, O], [345, 221, O], [373, 202, J], [405, 224, O],
    [435, 224, O], [454, 238, J], [453, 199, J], [505, 164, J],
    [288, 269, R], [340, 289, R], [372, 265, R], [407, 287, R], [453, 274, R], [413, 244, R],
    [516, 296, W], [218, 297, W], [494, 258, W]
  ];
  // Chemins parcourus par les « signaux »
  var paths = [
    { c: C, p: [[290, 185], [333, 192], [372, 159], [416, 177], [405, 193]] },
    { c: O, p: [[225, 209], [265, 221], [318, 243], [345, 221], [373, 202], [405, 224], [435, 224], [454, 238]] },
    { c: J, p: [[373, 202], [453, 199], [505, 164]] },
    { c: R, p: [[288, 269], [340, 289], [372, 265], [407, 287], [453, 274]] },
    { c: R, p: [[318, 243], [372, 265], [413, 244], [454, 238]] }
  ];

  var svg = document.createElementNS(NS, 'svg');
  var vh = +(stage.dataset.h || 498);
  svg.setAttribute('viewBox', '0 0 750 ' + vh);
  svg.setAttribute('class', 'logo-fx');
  svg.setAttribute('aria-hidden', 'true');
  var gid = 'glow' + Math.random().toString(36).slice(2, 7);
  svg.innerHTML = '<defs><filter id="' + gid + '" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>';

  paths.forEach(function (d, i) {
    var pts = d.p.map(function (q) { return q.join(','); }).join(' ');
    var pl = document.createElementNS(NS, 'polyline');
    pl.setAttribute('points', pts);
    pl.setAttribute('class', 'signal');
    pl.setAttribute('pathLength', '100');
    pl.style.stroke = d.c; pl.style.color = d.c;
    pl.style.animationDelay = (i * 1.3) + 's';
    svg.appendChild(pl);
  });

  nodes.forEach(function (n) {
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'spark');
    g.style.transformOrigin = n[0] + 'px ' + n[1] + 'px';
    g.style.animationDelay = (Math.random() * 6).toFixed(2) + 's';
    g.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + 's';
    g.innerHTML = '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="7" fill="' + n[2] + '" filter="url(#' + gid + ')"/>' +
                  '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="2.2" fill="#fff"/>';
    svg.appendChild(g);
  });
  stage.appendChild(svg);

  if (reduce) { stage.classList.add('still'); return; }

  // Constellation : points qui dérivent et se relient quand ils se rapprochent
  var cv = document.createElement('canvas');
  cv.className = 'constellation';
  cv.setAttribute('aria-hidden', 'true');
  stage.insertBefore(cv, stage.firstChild);
  var ctx = cv.getContext('2d');
  var cols = [C, O, J, R, W];
  var pts = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), running = false, raf;

  function size() {
    var r = stage.getBoundingClientRect();
    w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(46, w / 14));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({ x: Math.random() * w, y: Math.random() * h * (vh < 498 ? 1 : 0.78),
                 vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
                 c: cols[i % cols.length], t: Math.random() * 6.28 });
    }
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    var max = w * 0.16;
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i];
      a.x += a.vx; a.y += a.vy; a.t += 0.03;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h * (vh < 498 ? 1 : 0.8)) a.vy *= -1;
      for (var j = i + 1; j < pts.length; j++) {
        var b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < max) {
          ctx.globalAlpha = (1 - d / max) * 0.35;
          ctx.strokeStyle = a.c; ctx.lineWidth = 0.7;
          ctx.setLineDash([2, 3]);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 0.45 + 0.45 * Math.sin(a.t);
      ctx.fillStyle = a.c;
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.4, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  size();
  var lastW = 0;
  window.addEventListener('resize', function () { var nw = stage.getBoundingClientRect().width; if (Math.abs(nw - lastW) > 2) { lastW = nw; size(); } });
  lastW = stage.getBoundingClientRect().width;
  var visible = false;
  // Boucle infinie : ne s'arrête que si l'onglet est caché
  start();
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
});
