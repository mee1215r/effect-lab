/* ZINEのページに貼るもの(写真・ステッカー・文字・ペンの線)を描く。index.html と edit.html で共通。
   位置と大きさは、ページの横幅を100とした割合。縦は 133.3 まで(3:4のページ)。 */
(function(){
  var NS = 'http://www.w3.org/2000/svg';
  var css = document.createElement('style');
  css.textContent = [
    '.pg img.stk{position:absolute;inset:auto;height:auto;object-fit:fill;filter:drop-shadow(0 .7cqw 1.1cqw rgba(0,0,0,.28));-webkit-user-drag:none;user-select:none;pointer-events:none}',
    '.pg img.stk.pic{border:2.4cqw solid #fff;box-sizing:content-box;filter:drop-shadow(0 .6cqw 1cqw rgba(0,0,0,.3))}',
    '.pg .txt{position:absolute;margin:0;font-family:"Klee One","Zen Kaku Gothic New","Hiragino Maru Gothic ProN",sans-serif;font-weight:600;line-height:1.35;white-space:pre;pointer-events:none;user-select:none}',
    '.pg .tape{position:absolute;margin:0;opacity:.88;pointer-events:none;clip-path:polygon(0 8%,2% 0,4% 8%,6% 0,8% 8%,10% 0,100% 0,100% 100%,10% 100%,8% 92%,6% 100%,4% 92%,2% 100%,0 92%);mix-blend-mode:multiply;box-shadow:0 .3cqw .6cqw rgba(0,0,0,.18)}',
    '.pg .shp{position:absolute;aspect-ratio:1;filter:drop-shadow(0 .5cqw .9cqw rgba(0,0,0,.22))}',
    '.pg .shp svg{display:block;width:100%;height:100%;overflow:visible}',
    '.pg svg.pen{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible}',
    '.pg.paper{background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--lp,4.17%) - .15%),rgba(110,140,190,.42) calc(var(--lp,4.17%) - .15%),rgba(110,140,190,.42) var(--lp,4.17%))}',
    '.pg .tex{position:absolute;inset:0;pointer-events:none;z-index:0}',
    '.pg .tex{background-size:100% 100%;mix-blend-mode:soft-light}',
    '.pg .tex-grain{background-image:url(tex-grain.jpg)}',
    '.pg .tex-cold{background-image:url(tex-cold.jpg)}',
    '.pg .tex-fiber{background-image:url(tex-fiber.jpg)}',
    '.pg .tex-crumple{background-image:url(tex-crumple.jpg)}'
  ].join('\n');
  document.head.appendChild(css);


  var FONTS = { yomogi:'"Yomogi","Klee One",sans-serif', gothic:'"Zen Kaku Gothic New","Hiragino Sans",sans-serif', mincho:'"Shippori Mincho","Hiragino Mincho ProN",serif', dela:'"Dela Gothic One","Zen Kaku Gothic New",sans-serif' };
  function tf(t){ var s = ''; if (t.r) s += 'rotate(' + t.r + 'deg)'; if (t.f) s += (s ? ' ' : '') + 'scaleX(-1)'; return s; }
  function applyTf(n, t){ var s = tf(t); if (s) n.style.transform = s; if (t.o != null && t.o < 1) n.style.opacity = t.o; }
  function burst(){ var p = []; for (var i = 0; i < 28; i++){ var r = i % 2 ? 36 : 48, a = i * Math.PI / 14 - Math.PI / 2; p.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1)); } return p.join(' '); }
  var SHAPES = {
    star: function(a){ return '<polygon ' + a + ' points="50,5 62,37 96,38 69,59 79,92 50,73 21,92 31,59 4,38 38,37"/>'; },
    heart: function(a){ return '<path ' + a + ' d="M50 90C10 62 6 36 24 22C37 13 47 21 50 31C53 21 63 13 76 22C94 36 90 62 50 90Z"/>'; },
    circle: function(a){ return '<circle ' + a + ' cx="50" cy="50" r="45"/>'; },
    square: function(a){ return '<rect ' + a + ' x="6" y="6" width="88" height="88" rx="14"/>'; },
    triangle: function(a){ return '<polygon ' + a + ' stroke-linejoin="round" points="50,8 94,88 6,88"/>'; },
    flower: function(a, c){ var s = ''; for (var i = 0; i < 6; i++){ var g = i * Math.PI / 3; s += '<circle ' + a + ' cx="' + (50 + 27 * Math.cos(g)).toFixed(1) + '" cy="' + (50 + 27 * Math.sin(g)).toFixed(1) + '" r="19"/>'; } return s + '<circle cx="50" cy="50" r="15" fill="#FFE08A"/>'; },
    sparkle: function(a){ return '<path ' + a + ' d="M50 3C54 33 67 46 97 50C67 54 54 67 50 97C46 67 33 54 3 50C33 46 46 33 50 3Z"/>'; },
    burst: function(a){ return '<polygon ' + a + ' points="' + burst() + '"/>'; },
    cloud: function(a){ return '<g ' + a + '><circle cx="30" cy="58" r="20"/><circle cx="52" cy="44" r="26"/><circle cx="74" cy="58" r="20"/><rect x="30" y="58" width="44" height="20"/></g>'; },
    bubble: function(a){ return '<path ' + a + ' d="M14 12H86Q96 12 96 22V60Q96 70 86 70H50L30 90L34 70H14Q4 70 4 60V22Q4 12 14 12Z"/>'; },
    moon: function(a){ return '<path ' + a + ' d="M62 7A44 44 0 1 0 93 66A36 36 0 1 1 62 7Z"/>'; },
    arrow: function(a){ return '<polygon ' + a + ' stroke-linejoin="round" points="5,38 56,38 56,17 95,50 56,83 56,62 5,62"/>'; },
    banner: function(a){ return '<polygon ' + a + ' points="2,24 98,24 90,50 98,76 2,76 10,50"/>'; },
    leaf: function(a){ return '<path ' + a + ' d="M8 92C8 40 40 8 92 8C92 60 60 92 8 92Z"/>'; },
    ring: function(a, c){ return '<circle fill="none" stroke="' + c + '" stroke-width="8" cx="50" cy="50" r="42"/>'; },
    frame: function(a, c){ return '<rect fill="none" stroke="' + c + '" stroke-width="7" x="8" y="8" width="84" height="84" rx="4"/>'; }
  };
  function shapeEl(t){
    var n = document.createElement('div'); n.className = 'shp stk';
    var c = t.c || '#F4A6B8', a = 'fill="' + c + '"' + (t.sk ? ' stroke="' + t.sk + '" stroke-width="3.5" stroke-linejoin="round"' : '');
    var f = SHAPES[t.shape] || SHAPES.circle;
    n.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">' + f(a, c) + '</svg>';
    n.setAttribute('role', 'img'); n.setAttribute('aria-label', t.alt || 'かたち');
    n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.width = t.w + '%';
    applyTf(n, t);
    return n;
  }

  function pathD(p){
    if (!p.length) return '';
    if (p.length === 1) return 'M' + p[0][0] + ' ' + p[0][1] + 'l.01 0';
    var d = 'M' + p[0][0] + ' ' + p[0][1];
    for (var i = 1; i < p.length - 1; i++){
      var mx = (p[i][0] + p[i+1][0]) / 2, my = (p[i][1] + p[i+1][1]) / 2;
      d += 'Q' + p[i][0] + ' ' + p[i][1] + ' ' + mx.toFixed(2) + ' ' + my.toFixed(2);
    }
    var l = p[p.length - 1];
    return d + 'L' + l[0] + ' ' + l[1];
  }

  function item(t, hit){
    var n;
    if (t.pen){
      n = document.createElementNS(NS, 'svg');
      n.setAttribute('class', 'pen'); n.setAttribute('viewBox', '0 0 100 133.333'); n.setAttribute('preserveAspectRatio', 'none');
      n.setAttribute('aria-hidden', 'true');
      var d = pathD(t.pen);
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', t.c || '#222');
      p.setAttribute('stroke-width', t.wd || .8); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
      n.appendChild(p);
      if (hit){
        var h = document.createElementNS(NS, 'path');
        h.setAttribute('d', d); h.setAttribute('class', 'hit'); h.setAttribute('fill', 'none'); h.setAttribute('stroke', 'transparent');
        h.setAttribute('stroke-width', Math.max(t.wd || .8, 3)); h.setAttribute('stroke-linecap', 'round'); h.setAttribute('stroke-linejoin', 'round');
        n.appendChild(h);
      }
      return n;
    }
    if (t.shape) return shapeEl(t);
    if (t.tape){
      n = document.createElement('div'); n.className = 'tape';
      var c = t.c || '#F4A6B8', pat = t.pat || 'stripe';
      n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.width = t.w + '%'; n.style.height = (t.w * .2) + 'cqw';
      if (pat === 'stripe') n.style.background = 'repeating-linear-gradient(135deg,' + c + ' 0,' + c + ' 1.4cqw,rgba(255,255,255,.7) 1.4cqw,rgba(255,255,255,.7) 2.8cqw)';
      else if (pat === 'check') n.style.background = 'repeating-conic-gradient(' + c + ' 0 25%,rgba(255,255,255,.7) 0 50%) 0 0/3.6cqw 3.6cqw';
      else if (pat === 'vstripe') n.style.background = 'repeating-linear-gradient(90deg,' + c + ' 0,' + c + ' 1.6cqw,rgba(255,255,255,.7) 1.6cqw,rgba(255,255,255,.7) 3.2cqw)';
      else if (pat === 'dot') n.style.background = 'radial-gradient(rgba(255,255,255,.85) 22%,transparent 24%) 0 0/2.6cqw 2.6cqw,' + c;
      else n.style.background = c;
      applyTf(n, t);
      return n;
    }
    if (t.txt != null){
      n = document.createElement('div'); n.className = 'txt'; n.textContent = t.txt;
      n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.fontSize = (t.size || 6) + 'cqw'; n.style.color = t.ink || '#2a2a2a'; if (t.fn && FONTS[t.fn]) n.style.fontFamily = FONTS[t.fn];
      applyTf(n, t);
      return n;
    }
    n = document.createElement('img'); n.className = 'stk' + (t.pic ? ' pic' : '');
    n.src = t.src; n.alt = t.alt || ''; n.draggable = false;
    n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.width = t.w + '%';
    applyTf(n, t);
    return n;
  }
  function addItems(pg, items, hit){
    var out = [];
    (items || []).forEach(function(t, i){ var n = item(t, hit); n.dataset.i = i; pg.appendChild(n); out.push(n); });
    return out;
  }
  function lines(el, d){ el.style.setProperty('--lp', (100 / ((d && d.lines) || 24)).toFixed(3) + '%'); }
  /* 紙の色・罫線・質感をまとめて決める。d: { paper(罫線), bg(色), lines(線の数), tex(質感), texA(濃さ 10-100) } */
  function paper(el, d, def){
    d = d || {};
    el.classList.toggle('paper', !!d.paper);
    el.style.background = '';
    el.style.backgroundColor = d.bg || def || '#FBF8EE';
    if (d.paper) lines(el, d);
    var old = el.querySelector(':scope > .tex'); if (old) old.remove();
    if (d.tex && d.tex !== 'none'){
      var t = document.createElement('div'); t.className = 'tex tex-' + d.tex; t.setAttribute('aria-hidden', 'true');
      t.style.opacity = ((d.texA || 70) / 100).toFixed(2);
      el.insertBefore(t, el.firstChild);
    }
  }
  window.ZR = { tf: tf, item: item, addItems: addItems, lines: lines, paper: paper };
})();
