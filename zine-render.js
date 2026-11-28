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
    '.pg .dia{position:absolute;aspect-ratio:.72;background:#fbfaf6;border:1px solid rgba(0,0,0,.1);box-shadow:0 .6cqw 1.6cqw rgba(0,0,0,.28);container-type:inline-size;display:flex;flex-direction:column;padding:4cqi 4cqi 3cqi;gap:3cqi;font-family:"Klee One","Zen Kaku Gothic New",sans-serif;color:#2a2a2a;overflow:hidden}',
    '.pg .dia .dp{flex:0 0 49%;background:#e7e5df;border:1px solid rgba(0,0,0,.12);overflow:hidden;display:flex;align-items:center;justify-content:center;color:#a8a69e;font-size:6cqi}',
    '.pg .dia .dp img{position:static;inset:auto;width:100%;height:100%;object-fit:cover;display:block}',
    '.pg .dia .dm{flex:1;min-height:0;overflow:hidden;font-size:6cqi;line-height:9.2cqi;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(9.2cqi - 1px),rgba(110,140,190,.5) calc(9.2cqi - 1px),rgba(110,140,190,.5) 9.2cqi)}',
    '.pg .dia .dh{color:#6b6a63;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.pg .dia .dh b{color:#2a2a2a;font-weight:600}',
    '.pg .dia .db{white-space:pre-wrap;overflow-wrap:anywhere}',
    '.pg .shp{position:absolute;filter:drop-shadow(0 .5cqw .9cqw rgba(0,0,0,.22))}',
    '.pg .shp.ln{filter:none}',
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


  var FONTS = { yomogi:'"Yomogi","Klee One",sans-serif', gothic:'"Zen Kaku Gothic New","Hiragino Sans",sans-serif', mincho:'"Shippori Mincho","Hiragino Mincho ProN",serif', dela:'"Dela Gothic One","Zen Kaku Gothic New",sans-serif', cor:'"Cormorant Garamond","Shippori Mincho",serif' };
  function tf(t){ var s = ''; if (t.r) s += 'rotate(' + t.r + 'deg)'; if (t.f) s += (s ? ' ' : '') + 'scaleX(-1)'; return s; }
  function applyTf(n, t){ var s = tf(t); if (s) n.style.transform = s; if (t.o != null && t.o < 1) n.style.opacity = t.o; }
  function burstOld(){ var p = []; for (var i = 0; i < 28; i++){ var r = i % 2 ? 36 : 48, a = i * Math.PI / 14 - Math.PI / 2; p.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1)); } return p.join(' '); }
  /* ---- 素材のカタログ。 kind: s=ベタ塗りのかたち / l=線のらくがき / p=紙もの(ふちや台紙) ---- */
  var T = Math.PI * 2;
  function poly(pts){ return pts.map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function ngon(n, r, rot, cx, cy){ var o = []; for (var i = 0; i < n; i++){ var a = T * i / n + (rot || 0) - Math.PI / 2; o.push([(cx == null ? 50 : cx) + r * Math.cos(a), (cy == null ? 50 : cy) + r * Math.sin(a)]); } return o; }
  function spiral(){ var d = ''; for (var i = 0; i <= 120; i++){ var a = i * .17, r = 3 + i * .36; d += (i ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1); } return d; }
  function scribble(){ var d = 'M10 14'; for (var i = 0; i < 9; i++){ d += 'L' + (i % 2 ? 12 : 90) + ' ' + (14 + i * 9 + 4) + 'L' + (i % 2 ? 90 : 12) + ' ' + (14 + i * 9 + 7); } return d; }
  function scallop(w, h, n, r){
    var d = 'M0 0', i, sx = w / n, sy = h / Math.round(h / sx);
    for (i = 0; i < n; i++) d += 'L' + (i * sx + sx / 2 - r) + ' 0A' + r + ' ' + r + ' 0 0 0 ' + (i * sx + sx / 2 + r) + ' 0';
    d += 'L' + w + ' 0'; var m = Math.round(h / sx);
    for (i = 0; i < m; i++) d += 'L' + w + ' ' + (i * sy + sy / 2 - r) + 'A' + r + ' ' + r + ' 0 0 0 ' + w + ' ' + (i * sy + sy / 2 + r);
    d += 'L' + w + ' ' + h;
    for (i = n - 1; i >= 0; i--) d += 'L' + (i * sx + sx / 2 + r) + ' ' + h + 'A' + r + ' ' + r + ' 0 0 0 ' + (i * sx + sx / 2 - r) + ' ' + h;
    d += 'L0 ' + h;
    for (i = m - 1; i >= 0; i--) d += 'L0 ' + (i * sy + sy / 2 + r) + 'A' + r + ' ' + r + ' 0 0 0 0 ' + (i * sy + sy / 2 - r);
    return d + 'Z';
  }
  function zig(w, y, n, amp, down){ var p = []; for (var i = 0; i <= n; i++) p.push([w * i / n, y + (i % 2 ? amp : 0) * (down ? 1 : -1) + ((i * 37) % 5 - 2) * .35]); return p; }
  function seal(){ var p = []; for (var i = 0; i < 40; i++){ var a = T * i / 40, r = i % 2 ? 44 : 49; p.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]); } return poly(p); }
  var Z0 = 'fill="none" stroke-linecap="round" stroke-linejoin="round"';

  /* かたち(c=色) */
  var SHAPES = {
    star: function(a){ return '<polygon ' + a + ' points="50,5 62,37 96,38 69,59 79,92 50,73 21,92 31,59 4,38 38,37"/>'; },
    heart: function(a){ return '<path ' + a + ' d="M50 90C10 62 6 36 24 22C37 13 47 21 50 31C53 21 63 13 76 22C94 36 90 62 50 90Z"/>'; },
    circle: function(a){ return '<circle ' + a + ' cx="50" cy="50" r="45"/>'; },
    square: function(a){ return '<rect ' + a + ' x="6" y="6" width="88" height="88" rx="14"/>'; },
    triangle: function(a){ return '<polygon ' + a + ' stroke-linejoin="round" points="50,8 94,88 6,88"/>'; },
    diamond: function(a){ return '<polygon ' + a + ' points="50,4 92,50 50,96 8,50"/>'; },
    hexagon: function(a){ return '<polygon ' + a + ' points="' + poly(ngon(6, 46, Math.PI / 6)) + '"/>'; },
    pentagon: function(a){ return '<polygon ' + a + ' points="' + poly(ngon(5, 47, 0, 50, 54)) + '"/>'; },
    flower: function(a){ var s = ''; for (var i = 0; i < 6; i++){ var g = i * Math.PI / 3; s += '<circle ' + a + ' cx="' + (50 + 27 * Math.cos(g)).toFixed(1) + '" cy="' + (50 + 27 * Math.sin(g)).toFixed(1) + '" r="19"/>'; } return s + '<circle cx="50" cy="50" r="15" fill="#FFE08A"/>'; },
    clover: function(a){ return '<g ' + a + '><circle cx="34" cy="34" r="22"/><circle cx="66" cy="34" r="22"/><circle cx="34" cy="66" r="22"/><circle cx="66" cy="66" r="22"/></g><path d="M50 52L50 94" stroke="' + '#6b8f5e' + '" stroke-width="5" stroke-linecap="round"/>'; },
    sparkle: function(a){ return '<path ' + a + ' d="M50 3C54 33 67 46 97 50C67 54 54 67 50 97C46 67 33 54 3 50C33 46 46 33 50 3Z"/>'; },
    burst: function(a){ var p = []; for (var i = 0; i < 28; i++){ var r = i % 2 ? 36 : 48, g = i * Math.PI / 14 - Math.PI / 2; p.push([50 + r * Math.cos(g), 50 + r * Math.sin(g)]); } return '<polygon ' + a + ' points="' + poly(p) + '"/>'; },
    sun: function(a){ var s = ''; for (var i = 0; i < 10; i++){ var g = i * T / 10; s += '<line x1="' + (50 + 33 * Math.cos(g)).toFixed(1) + '" y1="' + (50 + 33 * Math.sin(g)).toFixed(1) + '" x2="' + (50 + 46 * Math.cos(g)).toFixed(1) + '" y2="' + (50 + 46 * Math.sin(g)).toFixed(1) + '" stroke-width="6" stroke-linecap="round" stroke="' + (a.match(/fill="([^"]+)"/) || [0, '#f1d56a'])[1] + '"/>'; } return s + '<circle ' + a + ' cx="50" cy="50" r="24"/>'; },
    cloud: function(a){ return '<g ' + a + '><circle cx="30" cy="58" r="20"/><circle cx="52" cy="44" r="26"/><circle cx="74" cy="58" r="20"/><rect x="30" y="58" width="44" height="20"/></g>'; },
    bubble: function(a){ return '<path ' + a + ' d="M14 12H86Q96 12 96 22V60Q96 70 86 70H50L30 90L34 70H14Q4 70 4 60V22Q4 12 14 12Z"/>'; },
    moon: function(a){ return '<path ' + a + ' d="M62 7A44 44 0 1 0 93 66A36 36 0 1 1 62 7Z"/>'; },
    drop: function(a){ return '<path ' + a + ' d="M50 6C50 6 22 40 22 62A28 28 0 0 0 78 62C78 40 50 6 50 6Z"/>'; },
    bolt: function(a){ return '<polygon ' + a + ' points="58,4 20,56 46,56 38,96 80,40 54,40"/>'; },
    plus: function(a){ return '<path ' + a + ' d="M38 8H62V38H92V62H62V92H38V62H8V38H38Z"/>'; },
    crown: function(a){ return '<path ' + a + ' d="M10 78L6 28L30 50L50 16L70 50L94 28L90 78Z"/>'; },
    bow: function(a){ return '<path ' + a + ' d="M50 50L12 24C4 22 4 78 12 76L50 50L88 24C96 22 96 78 88 76Z"/><circle ' + a + ' cx="50" cy="50" r="10"/>'; },
    arrow: function(a){ return '<polygon ' + a + ' stroke-linejoin="round" points="5,38 56,38 56,17 95,50 56,83 56,62 5,62"/>'; },
    banner: function(a){ return '<polygon ' + a + ' points="2,24 98,24 90,50 98,76 2,76 10,50"/>'; },
    leaf: function(a){ return '<path ' + a + ' d="M8 92C8 40 40 8 92 8C92 60 60 92 8 92Z"/>'; },
    ring: function(a, c){ return '<circle fill="none" stroke="' + c + '" stroke-width="8" cx="50" cy="50" r="42"/>'; },
    frame: function(a, c){ return '<rect fill="none" stroke="' + c + '" stroke-width="7" x="8" y="8" width="84" height="84" rx="4"/>'; }
  };
  var SHAPE_LIST = [['star','ほし'],['heart','ハート'],['circle','まる'],['square','しかく'],['triangle','さんかく'],['diamond','ひしがた'],['hexagon','六角形'],['pentagon','五角形'],['flower','おはな'],['clover','クローバー'],['sparkle','きらきら'],['burst','ギザギザ'],['sun','たいよう'],['cloud','くも'],['bubble','ふきだし'],['moon','つき'],['drop','しずく'],['bolt','いなずま'],['plus','プラス'],['crown','おうかん'],['bow','リボン結び'],['arrow','やじるし'],['banner','リボン'],['leaf','は'],['ring','わっか'],['frame','わく']];

  /* らくがき(線。ar=横÷縦) */
  var LINES = {
    underline: { ar: 5, n: 'したせん', d: function(){ return '<path d="M4 11C30 7 60 14 96 9"/>'; } },
    wave: { ar: 5, n: 'なみせん', d: function(){ return '<path d="M3 10Q11 2 19 10T35 10T51 10T67 10T83 10T97 10"/>'; } },
    double: { ar: 5, n: 'にじゅうせん', d: function(){ return '<path d="M4 6C30 3 60 8 96 5M5 15C32 12 62 18 95 14"/>'; } },
    zigzag: { ar: 5, n: 'ぎざぎざ', d: function(){ return '<path d="M3 15L15 5L27 15L39 5L51 15L63 5L75 15L87 5L97 13"/>'; } },
    dashline: { ar: 6, n: 'てんせん', d: function(){ return '<path stroke-dasharray="5 8" d="M3 8H97"/>'; } },
    arrowL: { ar: 2, n: 'やじるし', d: function(){ return '<path d="M5 28C30 20 55 34 90 26M76 12L92 26L77 40"/>'; } },
    curve: { ar: 1.3, n: 'まがる矢印', d: function(){ return '<path d="M10 70C8 30 42 10 80 24M66 8L82 25L64 38"/>'; } },
    loop: { ar: 2, n: 'くるっと', d: function(){ return '<path d="M4 38C24 6 46 6 46 26C46 46 26 40 36 22C46 8 70 12 90 32M79 20L92 33L76 40"/>'; } },
    spiral: { ar: 1, n: 'うずまき', d: function(){ return '<path d="' + spiral() + '"/>'; } },
    hcircle: { ar: 1.3, n: '手書きまる', d: function(){ return '<path d="M52 8C22 6 5 28 10 50C15 70 45 74 70 66C92 58 96 30 78 16C66 8 50 10 38 14"/>'; } },
    xmark: { ar: 1, n: 'バツ', d: function(){ return '<path d="M20 22L80 80M80 18L22 78"/>'; } },
    check: { ar: 1, n: 'チェック', d: function(){ return '<path d="M14 56L38 80L88 20"/>'; } },
    brace: { ar: .4, n: 'かっこ', d: function(){ return '<path d="M70 4Q34 4 34 26V38Q34 50 18 50Q34 50 34 62V74Q34 96 70 96" transform="scale(1)"/>'; } },
    ostar: { ar: 1, n: 'ほし(線)', d: function(){ return '<polygon points="50,6 62,38 95,39 69,60 79,92 50,73 21,92 31,60 5,39 38,38"/>'; } },
    oheart: { ar: 1, n: 'ハート(線)', d: function(){ return '<path d="M50 90C10 62 6 36 24 22C37 13 47 21 50 31C53 21 63 13 76 22C94 36 90 62 50 90Z"/>'; } },
    odrop: { ar: 1, n: 'しずく(線)', d: function(){ return '<path d="M50 6C50 6 22 40 22 62A28 28 0 0 0 78 62C78 40 50 6 50 6Z"/>'; } },
    obolt: { ar: 1, n: 'いなずま(線)', d: function(){ return '<polygon points="58,4 20,56 46,56 38,96 80,40 54,40"/>'; } },
    sunl: { ar: 1, n: 'おひさま', d: function(){ var s = '<circle cx="50" cy="50" r="17"/>'; for (var i = 0; i < 8; i++){ var g = i * T / 8; s += '<path d="M' + (50 + 28 * Math.cos(g)).toFixed(1) + ' ' + (50 + 28 * Math.sin(g)).toFixed(1) + 'L' + (50 + 42 * Math.cos(g)).toFixed(1) + ' ' + (50 + 42 * Math.sin(g)).toFixed(1) + '"/>'; } return s; } },
    sparkles: { ar: 1, n: 'きらきら(線)', d: function(){ return '<path d="M38 20C40 38 46 44 64 46C46 48 40 54 38 72C36 54 30 48 12 46C30 44 36 38 38 20Z"/><path d="M74 54C75 66 79 70 90 71C79 72 75 76 74 88C73 76 69 72 58 71C69 70 73 66 74 54Z"/><path d="M76 8C77 16 80 19 88 20C80 21 77 24 76 32C75 24 72 21 64 20C72 19 75 16 76 8Z"/>'; } },
    music: { ar: 1, n: 'おんぷ', d: function(){ return '<path d="M42 74V22L78 14V62M42 38L78 30"/><ellipse cx="32" cy="74" rx="11" ry="8"/><ellipse cx="68" cy="62" rx="11" ry="8"/>'; } },
    smile: { ar: 1, n: 'にこにこ', d: function(){ return '<circle cx="50" cy="50" r="42"/><path d="M30 60Q50 80 70 60"/><path d="M36 38V42M64 38V42" stroke-width="6"/>'; } },
    dcircle: { ar: 1, n: 'てんせんまる', d: function(){ return '<circle stroke-dasharray="2 7" cx="50" cy="50" r="42"/>'; } },
    scribble: { ar: 1, n: 'ぐりぐり', d: function(){ return '<path d="' + scribble() + '"/>'; } },
    dots3: { ar: 3, n: 'てんてんてん', d: function(){ return '<circle cx="16" cy="17" r="5" fill="currentColor"/><circle cx="50" cy="17" r="5" fill="currentColor"/><circle cx="84" cy="17" r="5" fill="currentColor"/>'; } }
  };

  /* 紙もの(c=紙の色。 台紙・ふち。写真の「うしろへ」を使うと写真をふちにはめられる) */
  var PAPERS = {
    note: { ar: .85, c: '#FFF7C9', n: 'メモ', d: function(c, H){
      var t = zig(100, 6, 24, 3.2, true), p = t.map(function(q){ return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L');
      var l = ''; for (var y = 26; y < H - 6; y += 9) l += '<path d="M6 ' + y + 'H94" stroke="rgba(90,120,170,.38)" stroke-width=".7"/>';
      return '<path fill="' + c + '" d="M0 ' + H + 'V6L' + p + 'L100 ' + H + 'Z"/>' + l + '<path d="M14 12V' + (H - 4) + '" stroke="rgba(214,80,80,.45)" stroke-width=".7"/>'; } },
    postit: { ar: 1, c: '#FFE66D', n: 'ふせん', d: function(c){ return '<path fill="' + c + '" d="M0 0H100V74L74 100H0Z"/><path fill="rgba(0,0,0,.13)" d="M100 74L74 100V74Z"/><path fill="rgba(255,255,255,.35)" d="M0 0H100V10H0Z"/>'; } },
    tag: { ar: .6, c: '#E8D5B0', n: 'タグ', d: function(c){ return '<path fill="' + c + '" fill-rule="evenodd" d="M28 3H72L95 24V160H5V24Z M50 20m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"/><path d="M50 20" fill="none"/><path d="M20 140H80" stroke="rgba(0,0,0,.2)" stroke-width=".8"/>'; } },
    ticket: { ar: 2.2, c: '#F6E7B4', n: 'チケット', d: function(c, H){ var m = H / 2; return '<path fill="' + c + '" d="M0 0H100V' + (m - 6) + 'A6 6 0 0 0 100 ' + (m + 6) + 'V' + H + 'H0V' + (m + 6) + 'A6 6 0 0 0 0 ' + (m - 6) + 'Z"/><path d="M72 3V' + (H - 3) + '" stroke="rgba(0,0,0,.35)" stroke-width=".8" stroke-dasharray="2 2.4"/><path d="M8 ' + (H / 2 - 4) + 'H58M8 ' + (H / 2 + 3) + 'H46" stroke="rgba(0,0,0,.28)" stroke-width="1.4" stroke-linecap="round"/>'; } },
    label: { ar: 2.5, c: '#FFFFFF', n: 'ラベル', d: function(c, H){ return '<rect fill="' + c + '" width="100" height="' + H + '" rx="5"/><rect x="3" y="3" width="94" height="' + (H - 6) + '" rx="3" fill="none" stroke="rgba(0,0,0,.4)" stroke-width=".8" stroke-dasharray="3 2"/>'; } },
    torn: { ar: 3.5, c: '#FBF3E2', n: 'やぶれ紙', d: function(c, H){
      var a = zig(100, 4, 26, 3, false), b = zig(100, H - 4, 26, 3, true).reverse();
      return '<polygon fill="' + c + '" points="' + poly(a.concat(b)) + '"/>'; } },
    film: { ar: 2.4, c: '#2b2b2b', n: 'フィルム', d: function(c, H){
      var h = '', i; for (i = 0; i < 13; i++) h += ' M' + (3 + i * 7.6) + ' 3h4v3.4h-4Z M' + (3 + i * 7.6) + ' ' + (H - 6.4) + 'h4v3.4h-4Z';
      var f = ''; for (i = 0; i < 3; i++) f += ' M' + (4 + i * 32) + ' 10h29v' + (H - 20) + 'h-29Z';
      return '<path fill="' + c + '" fill-rule="evenodd" d="M0 0H100V' + H + 'H0Z' + h + f + '"/>'; } },
    stamp: { ar: .8, c: '#FFFFFF', n: '切手', d: function(c, H){ return '<path fill="' + c + '" fill-rule="evenodd" d="' + scallop(100, H, 10, 2.6) + ' M10 10H90V' + (H - 10) + 'H10Z"/>'; } },
    polaroid: { ar: .84, c: '#FFFFFF', n: 'ポラロイド', d: function(c, H){ return '<path fill="' + c + '" fill-rule="evenodd" d="M0 0H100V' + H + 'H0Z M7 7H93V' + (H - 24) + 'H7Z"/>'; } },
    seal: { ar: 1, c: '#D8322A', n: 'シール', d: function(c){ return '<polygon fill="' + c + '" points="' + seal() + '"/><circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.4" stroke-dasharray="1.5 3"/>'; } },
    envelope: { ar: 1.5, c: '#D9B98C', n: 'ふうとう', d: function(c, H){ return '<rect fill="' + c + '" width="100" height="' + H + '" rx="2"/><path d="M0 0L50 ' + (H * .58) + 'L100 0M0 ' + H + 'L38 ' + (H * .44) + 'M100 ' + H + 'L62 ' + (H * .44) + '" fill="none" stroke="rgba(0,0,0,.22)" stroke-width=".9"/>'; } },
    card: { ar: 1.5, c: '#FFFFFF', n: 'カード', d: function(c, H){ var l = ''; for (var y = 22; y < H - 4; y += 8) l += '<path d="M4 ' + y + 'H96" stroke="rgba(90,120,170,.4)" stroke-width=".7"/>'; return '<rect fill="' + c + '" width="100" height="' + H + '" rx="2"/><path d="M0 12H100" stroke="rgba(214,80,80,.55)" stroke-width=".9"/>' + l; } },
    graph: { ar: 1, c: '#FFFFFF', n: '方眼紙', d: function(c){ var l = ''; for (var i = 5; i < 100; i += 5) l += 'M' + i + ' 0V100M0 ' + i + 'H100'; return '<rect fill="' + c + '" width="100" height="100"/><path d="' + l + '" stroke="rgba(110,150,110,.4)" stroke-width=".5"/>'; } },
    corners: { ar: 1.2, c: '#C9B3E6', n: 'フォトコーナー', d: function(c, H){ var s = 16; return '<path fill="' + c + '" d="M0 0H' + s + 'L0 ' + s + 'ZM100 0H' + (100 - s) + 'L100 ' + s + 'ZM0 ' + H + 'H' + s + 'L0 ' + (H - s) + 'ZM100 ' + H + 'H' + (100 - s) + 'L100 ' + (H - s) + 'Z"/>'; } }
  };
  var PAPER_LIST = ['note','postit','tag','ticket','label','torn','film','stamp','polaroid','seal','envelope','card','graph','corners'];
  var LINE_LIST = Object.keys(LINES);
  function arOf(k){ return LINES[k] ? LINES[k].ar : PAPERS[k] ? PAPERS[k].ar : 1; }
  function defColor(k){ return PAPERS[k] ? PAPERS[k].c : LINES[k] ? '#2a2a2a' : '#F4A6B8'; }
  function shapeEl(t){
    var n = document.createElement('div'), k = t.shape, ar = arOf(k), H = 100 / ar, c = t.c || defColor(k), body;
    n.className = 'shp stk' + (LINES[k] ? ' ln' : '');
    if (LINES[k]){
      var sw = t.sw || 3.2;
      body = '<g color="' + c + '" stroke="' + c + '" stroke-width="' + sw + '" ' + Z0 + (t.rg === 0 ? '' : ' filter="url(#zr-rough)"') + '>' + LINES[k].d(c, H) + '</g>';
    } else if (PAPERS[k]) {
      body = PAPERS[k].d(c, H);
    } else {
      var a = 'fill="' + c + '"' + (t.sk ? ' stroke="' + t.sk + '" stroke-width="3.5" stroke-linejoin="round"' : '');
      body = (SHAPES[k] || SHAPES.circle)(a, c);
    }
    n.innerHTML = '<svg viewBox="0 0 100 ' + H.toFixed(2) + '" aria-hidden="true" preserveAspectRatio="xMidYMid meet">' + body + '</svg>';
    n.setAttribute('role', 'img'); n.setAttribute('aria-label', t.alt || '飾り');
    n.style.aspectRatio = String(ar);
    n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.width = t.w + '%';
    applyTf(n, t);
    return n;
  }
  /* 手書き風のゆらぎ(らくがき用)のフィルタを1回だけ作る */
  function ensureFilters(){
    if (document.getElementById('zr-defs')) return;
    var d = document.createElementNS(NS, 'svg'); d.id = 'zr-defs'; d.setAttribute('width', '0'); d.setAttribute('height', '0'); d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<defs><filter id="zr-rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/></filter></defs>';
    (document.body || document.documentElement).appendChild(d);
  }
  if (document.body) ensureFilters(); else document.addEventListener('DOMContentLoaded', ensureFilters);


  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function diaryEl(t){
    var D = t.diary || {}, n = document.createElement('div');
    n.className = 'dia stk';
    n.innerHTML = '<div class="dp">' + (D.src ? '<img src="' + esc(D.src) + '" alt="' + esc(D.alt || D.t || '料理の写真') + '" draggable="false">' : '<span>写真</span>') + '</div>' +
      '<div class="dm"><div class="dh">' + esc(D.d) + (D.t ? '　<b>' + esc(D.t) + '</b>' : '') + '</div><div class="db">' + esc(D.m) + '</div></div>';
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

  function item(t, hit){ var n = itemRaw(t, hit); if (t.hd) n.style.display = 'none'; if (t.lk) n.dataset.lk = '1'; return n; }
  function itemRaw(t, hit){
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
    if (t.diary) return diaryEl(t);
    if (t.shape) return shapeEl(t);
    if (t.tape){
      n = document.createElement('div'); n.className = 'tape';
      var c = t.c || '#F4A6B8', pat = t.pat || 'stripe';
      n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.width = t.w + '%'; n.style.height = (t.w * .2) + 'cqw';
      if (pat === 'stripe') n.style.background = 'repeating-linear-gradient(135deg,' + c + ' 0,' + c + ' 1.4cqw,rgba(255,255,255,.7) 1.4cqw,rgba(255,255,255,.7) 2.8cqw)';
      else if (pat === 'gingham') n.style.background = 'repeating-linear-gradient(0deg,rgba(255,255,255,.45) 0 1.4cqw,transparent 1.4cqw 2.8cqw),repeating-linear-gradient(90deg,rgba(255,255,255,.45) 0 1.4cqw,transparent 1.4cqw 2.8cqw),' + c;
      else if (pat === 'lines') n.style.background = 'repeating-linear-gradient(0deg,rgba(255,255,255,.75) 0 .45cqw,transparent .45cqw 1.5cqw),' + c;
      else if (pat === 'dot2') n.style.background = 'radial-gradient(rgba(255,255,255,.9) 30%,transparent 32%) 0 0/4.4cqw 4.4cqw,' + c;
      else if (pat === 'zig') n.style.background = 'linear-gradient(135deg,rgba(255,255,255,.6) 25%,transparent 25%) -1.5cqw 0/3cqw 3cqw,linear-gradient(225deg,rgba(255,255,255,.6) 25%,transparent 25%) -1.5cqw 0/3cqw 3cqw,' + c;
      else if (pat === 'check') n.style.background = 'repeating-conic-gradient(' + c + ' 0 25%,rgba(255,255,255,.7) 0 50%) 0 0/3.6cqw 3.6cqw';
      else if (pat === 'vstripe') n.style.background = 'repeating-linear-gradient(90deg,' + c + ' 0,' + c + ' 1.6cqw,rgba(255,255,255,.7) 1.6cqw,rgba(255,255,255,.7) 3.2cqw)';
      else if (pat === 'dot') n.style.background = 'radial-gradient(rgba(255,255,255,.85) 22%,transparent 24%) 0 0/2.6cqw 2.6cqw,' + c;
      else n.style.background = c;
      applyTf(n, t);
      return n;
    }
    if (t.txt != null){
      n = document.createElement('div'); n.className = 'txt'; n.textContent = t.txt;
      n.style.left = t.x + '%'; n.style.top = t.y + '%'; n.style.fontSize = (t.size || 6) + 'cqw'; n.style.color = t.ink || '#2a2a2a'; if (t.fn && FONTS[t.fn]) n.style.fontFamily = FONTS[t.fn]; if (t.fn === 'cor') n.style.fontStyle = 'italic'; if (t.b) n.style.fontWeight = '800'; if (t.ls) n.style.letterSpacing = t.ls + 'em'; if (t.hl) { n.style.backgroundImage = 'linear-gradient(transparent 58%,' + t.hl + ' 58%)'; n.style.padding = '0 .15em'; }
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
    if (d.bgImg){ el.style.backgroundImage = 'url("' + d.bgImg + '")'; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
    if (d.paper) lines(el, d);
    var old = el.querySelector(':scope > .tex'); if (old) old.remove();
    if (d.tex && d.tex !== 'none'){
      var t = document.createElement('div'); t.className = 'tex tex-' + d.tex; t.setAttribute('aria-hidden', 'true');
      t.style.opacity = ((d.texA || 70) / 100).toFixed(2);
      el.insertBefore(t, el.firstChild);
    }
  }
  window.ZR = { diaryTpl: function(){ return { diary: { d: '', t: '', m: '' } }; }, cat: { shapes: SHAPE_LIST, lines: LINE_LIST.map(function(k){ return [k, LINES[k].n]; }), papers: PAPER_LIST.map(function(k){ return [k, PAPERS[k].n]; }) }, defColor: defColor, arOf: arOf, tf: tf, item: item, addItems: addItems, lines: lines, paper: paper };
})();
