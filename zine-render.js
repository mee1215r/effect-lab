/* ZINEのページに貼るもの(写真・ステッカー・文字・ペンの線)を描く。index.html と edit.html で共通。
   位置と大きさは、ページの横幅を100とした割合。縦は 133.3 まで(3:4のページ)。 */
(function(){
  var NS = 'http://www.w3.org/2000/svg';
  var svg = function(s){ return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'; };
  var css = document.createElement('style');
  css.textContent = [
    '.pg img.stk{position:absolute;inset:auto;height:auto;object-fit:fill;filter:drop-shadow(0 .7cqw 1.1cqw rgba(0,0,0,.28));-webkit-user-drag:none;user-select:none;pointer-events:none}',
    '.pg img.stk.pic{border:2.4cqw solid #fff;box-sizing:content-box;filter:drop-shadow(0 .6cqw 1cqw rgba(0,0,0,.3))}',
    '.pg .txt{position:absolute;margin:0;font-family:"Klee One","Zen Kaku Gothic New","Hiragino Maru Gothic ProN",sans-serif;font-weight:600;line-height:1.35;white-space:pre;pointer-events:none;user-select:none}',
    '.pg .tape{position:absolute;margin:0;opacity:.88;pointer-events:none;clip-path:polygon(0 8%,2% 0,4% 8%,6% 0,8% 8%,10% 0,100% 0,100% 100%,10% 100%,8% 92%,6% 100%,4% 92%,2% 100%,0 92%);mix-blend-mode:multiply;box-shadow:0 .3cqw .6cqw rgba(0,0,0,.18)}',
    '.pg svg.pen{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible}',
    '.pg.paper{background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--lp,4.17%) - .15%),rgba(110,140,190,.42) calc(var(--lp,4.17%) - .15%),rgba(110,140,190,.42) var(--lp,4.17%))}',
    '.pg .tex{position:absolute;inset:0;pointer-events:none;mix-blend-mode:multiply;z-index:0}',
    '.pg .tex-grain{background-image:' + svg("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .32 0 0 0 0 .26 0 0 0 0 .2 1.6 0 0 0 -.62'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>") + ';background-size:45cqw 45cqw}',
    '.pg .tex-fiber{background-image:' + svg("<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.05 .3' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .55 0 0 0 0 .45 0 0 0 0 .32 1.3 0 0 0 -.5'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>") + ';background-size:90cqw 90cqw}',
    '.pg .tex-crumple{background-image:' + svg("<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.011 .016' numOctaves='4' seed='7'/><feDiffuseLighting lighting-color='white' surfaceScale='5'><feDistantLight azimuth='225' elevation='55'/></feDiffuseLighting></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>") + ';background-size:100% 100%}'
  ].join('\n');
  document.head.appendChild(css);

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
    if (t.tape){
      n = document.createElement('div'); n.className = 'tape';
      var c = t.c || '#F4A6B8', pat = t.pat || 'stripe';
      n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.width = t.w + '%'; n.style.height = (t.w * .2) + 'cqw';
      if (pat === 'stripe') n.style.background = 'repeating-linear-gradient(135deg,' + c + ' 0,' + c + ' 1.4cqw,rgba(255,255,255,.7) 1.4cqw,rgba(255,255,255,.7) 2.8cqw)';
      else if (pat === 'dot') n.style.background = 'radial-gradient(rgba(255,255,255,.85) 22%,transparent 24%) 0 0/2.6cqw 2.6cqw,' + c;
      else n.style.background = c;
      if (t.r) n.style.transform = 'rotate(' + t.r + 'deg)';
      return n;
    }
    if (t.txt != null){
      n = document.createElement('div'); n.className = 'txt'; n.textContent = t.txt;
      n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.fontSize = (t.size || 6) + 'cqw'; n.style.color = t.ink || '#2a2a2a';
      if (t.r) n.style.transform = 'rotate(' + t.r + 'deg)';
      return n;
    }
    n = document.createElement('img'); n.className = 'stk' + (t.pic ? ' pic' : '');
    n.src = t.src; n.alt = t.alt || ''; n.draggable = false;
    n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.width = t.w + '%';
    if (t.r) n.style.transform = 'rotate(' + t.r + 'deg)';
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
      t.style.opacity = ((d.texA || 60) / 100).toFixed(2);
      el.insertBefore(t, el.firstChild);
    }
  }
  window.ZR = { item: item, addItems: addItems, lines: lines, paper: paper };
})();
