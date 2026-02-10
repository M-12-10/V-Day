var strokesLeftBottom = $('#LeftBottomGroup_1_ path[id^=Stroke]').toArray().reverse();
var strokesLeftTop = $('#LeftTopGroup_1_ path[id^=Stroke]').toArray().reverse();
var strokesRightBottom = $('#RightBottomGroup_1_ path[id^=Stroke]').toArray().reverse();
var strokesRightTop = $('#RightTopGroup_1_ path[id^=Stroke]').toArray().reverse();

var stemGroup1 = ['#Stem2_1_', '#Stem3_1_', '#Stem4_1_', '#Stem5a_1_', '#Stem5b_1_', '#Stem6_1_', '#Stem7a_1_', '#Stem7b_1_', '#Stem7c_1_', '#Stem8_1_'];
var stemGroup2 = ['#Stem17_1_', '#Stem18_1_', '#Stem19_1_', '#Stem20a_1_', '#Stem20b_1_', '#Stem21_1_', '#Stem22a_1_', '#Stem22b_1_', '#Stem22c_1_', '#Stem23_1_'];
var stemGroup3 = ['#Stem10_1_', '#Stem11_1_', '#Stem12a_1_', '#Stem12b_1_'];
var stemGroup4 = ['#Stem26_1_', '#Stem27_1_', '#Stem28a_1_', '#Stem28b_1_'];
var stemGroup5 = ['#Stem13a_1_', '#Stem13b_1_', '#Stem13c_1_'];
var stemGroup6 = ['#Stem29a_1_', '#Stem29b_1_', '#Stem29c_1_'];
var stemVarsFrom = { drawSVG: "0% 0%", autoAlpha: 1 };
var stemVarsTo = { drawSVG: "0% 100%", duration:2, stagger:0.5 };

var leafGroup1 = ['#Leaf2_1_','#Leaf17_1_'];
var leafGroup2 = ['#Leaf4_1_','#Leaf5a_1_', '#Leaf5b_1_'];
var leafGroup3 = ['#Leaf19_1_','#Leaf20a_1_', '#Leaf20b_1_'];
var leafGroup4 = ['#Leaf11_1_','#Leaf12a_1_', '#Leaf12b_1_'];
var leafGroup5 = ['#Leaf27_1_','#Leaf28a_1_', '#Leaf28b_1_'];
var leafGroup6 = ['#Leaf13a_1_','#Leaf13b_1_', '#Leaf13c_1_'];
var leafGroup7 = ['#Leaf29a_1_','#Leaf29b_1_', '#Leaf29c_1_'];

var budGroup1 = ['#Bud3_1_', '#Bud6_1_'];
var budGroup2 = ['#Bud18_1_', '#Bud21_1_'];
var budGroup3 = ['#Bud7a_1_', '#Bud7b_1_', '#Bud7c_1_', '#Bud8_1_'];
var budGroup4 = ['#Bud22a_1_', '#Bud22b_1_', '#Bud22c_1_', '#Bud23_1_'];
var budGroup5 = ['#Bud10_1_', '#Bud26_1_'];

var dots = $('#Dots_1_');
var userAgent = navigator.userAgent || '';
var isTouchDevice = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
var isNarrowScreen = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
var hasLowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
var hasLowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 6;
var redmiNote14ModelCode = /\b24117rn76[gelo]\b/i.test(userAgent);
var isRedmiNote14 = /redmi note 14/i.test(userAgent) || redmiNote14ModelCode;
var isRedmiNote14_4G = redmiNote14ModelCode || (isRedmiNote14 && !/\b5g\b/i.test(userAgent));
var profileParam = new URLSearchParams(window.location.search).get('profile');

function setPerfProfile(profile) {
  var url = new URL(window.location.href);
  if (profile) {
    url.searchParams.set('profile', profile);
  } else {
    url.searchParams.delete('profile');
  }
  window.location.assign(url.toString());
}

// Console helpers:
// emulateNote14Perf()        -> enable Redmi Note 14 performance profile
// emulateNote14Perf(false)   -> disable forced profile (back to auto detection)
window.emulateNote14Perf = function (enabled) {
  if (enabled === false) {
    setPerfProfile('');
    return;
  }
  setPerfProfile('rn14');
};

var PERF_RN14 = profileParam === 'rn14' || isRedmiNote14_4G;
var PERF_LITE = PERF_RN14 || (isTouchDevice && (isNarrowScreen || hasLowMemory || hasLowCpu));

if (PERF_LITE) {
  document.documentElement.classList.add('perf-lite');
  if (PERF_RN14) {
    document.documentElement.classList.add('perf-rn14');
  }
  if (window.gsap && gsap.ticker) {
    gsap.ticker.fps(PERF_RN14 ? 42 : 45);
  }
}

var SVG_NS = 'http://www.w3.org/2000/svg';

function svgNode(type, attrs) {
  var el = document.createElementNS(SVG_NS, type);
  Object.keys(attrs).forEach(function (key) {
    el.setAttribute(key, attrs[key]);
  });
  return el;
}

function addPetalRing(parent, cx, cy, count, orbit, rx, ry, offset, fill, stroke) {
  for (var i = 0; i < count; i++) {
    var angle = (Math.PI * 2 * i) / count + offset;
    var px = cx + Math.cos(angle) * orbit;
    var py = cy + Math.sin(angle) * orbit;
    var rot = (angle * 180) / Math.PI + 90;

    parent.appendChild(
      svgNode('ellipse', {
        cx: px.toFixed(2),
        cy: py.toFixed(2),
        rx: rx.toFixed(2),
        ry: ry.toFixed(2),
        fill: fill,
        stroke: stroke,
        'stroke-width': '0.6',
        transform: 'rotate(' + rot.toFixed(2) + ' ' + px.toFixed(2) + ' ' + py.toFixed(2) + ')'
      })
    );
  }
}

function addSeedPattern(parent, cx, cy, radius, totalCount) {
  var seeds = svgNode('g', { fill: '#2f1706', opacity: '0.78' });
  var total = totalCount || 150;
  var goldenAngle = 137.5 * Math.PI / 180;

  for (var i = 0; i < total; i++) {
    var dist = Math.sqrt((i + 0.5) / total) * radius * 0.92;
    var angle = i * goldenAngle;
    var x = cx + Math.cos(angle) * dist;
    var y = cy + Math.sin(angle) * dist;
    var dotSize = i % 5 === 0 ? radius * 0.055 : radius * 0.04;

    seeds.appendChild(
      svgNode('circle', {
        cx: x.toFixed(2),
        cy: y.toFixed(2),
        r: dotSize.toFixed(2)
      })
    );
  }

  parent.appendChild(seeds);
}

function addCalyx(parent, cx, cy, core) {
  // Collar that tucks under the petal ring.
  parent.appendChild(
    svgNode('ellipse', {
      cx: cx.toFixed(2),
      cy: (cy + core * 0.52).toFixed(2),
      rx: (core * 1.08).toFixed(2),
      ry: (core * 0.36).toFixed(2),
      fill: '#6aa244'
    })
  );

  // Tapered neck/receptacle so head and stem are seamlessly connected.
  parent.appendChild(
    svgNode('path', {
      d:
        'M ' + (cx - core * 0.52).toFixed(2) + ' ' + (cy + core * 0.58).toFixed(2) +
        ' C ' + (cx - core * 0.44).toFixed(2) + ' ' + (cy + core * 1.02).toFixed(2) + ', ' +
        (cx - core * 0.25).toFixed(2) + ' ' + (cy + core * 1.55).toFixed(2) + ', ' +
        cx.toFixed(2) + ' ' + (cy + core * 2.04).toFixed(2) +
        ' C ' + (cx + core * 0.25).toFixed(2) + ' ' + (cy + core * 1.55).toFixed(2) + ', ' +
        (cx + core * 0.44).toFixed(2) + ' ' + (cy + core * 1.02).toFixed(2) + ', ' +
        (cx + core * 0.52).toFixed(2) + ' ' + (cy + core * 0.58).toFixed(2) +
        ' C ' + (cx + core * 0.30).toFixed(2) + ' ' + (cy + core * 0.72).toFixed(2) + ', ' +
        (cx - core * 0.30).toFixed(2) + ' ' + (cy + core * 0.72).toFixed(2) + ', ' +
        (cx - core * 0.52).toFixed(2) + ' ' + (cy + core * 0.58).toFixed(2) + ' Z',
      fill: '#4c7d2f'
    })
  );

  var calyxBase = svgNode('ellipse', {
    cx: cx.toFixed(2),
    cy: (cy + core * 0.64).toFixed(2),
    rx: (core * 0.98).toFixed(2),
    ry: (core * 0.44).toFixed(2),
    fill: '#5b8e3b'
  });

  parent.appendChild(calyxBase);

  addPetalRing(
    parent,
    cx,
    cy + core * 0.56,
    14,
    core * 0.72,
    core * 0.16,
    core * 0.36,
    Math.PI / 12,
    '#5f9640',
    '#3f6a27'
  );

  [-0.2, 0, 0.2].forEach(function (o) {
    parent.appendChild(
      svgNode('path', {
        d:
          'M ' + (cx + core * o).toFixed(2) + ' ' + (cy + core * 0.70).toFixed(2) +
          ' C ' + (cx + core * (o * 0.7)).toFixed(2) + ' ' + (cy + core * 1.24).toFixed(2) + ', ' +
          (cx + core * (o * 0.3)).toFixed(2) + ' ' + (cy + core * 1.66).toFixed(2) + ', ' +
          (cx + core * (o * 0.08)).toFixed(2) + ' ' + (cy + core * 1.90).toFixed(2),
        fill: 'none',
        stroke: '#79b955',
        'stroke-width': (core * 0.05).toFixed(2),
        'stroke-linecap': 'round',
        opacity: '0.55'
      })
    );
  });

  parent.appendChild(
    svgNode('ellipse', {
      cx: cx.toFixed(2),
      cy: (cy + core * 0.96).toFixed(2),
      rx: (core * 0.40).toFixed(2),
      ry: (core * 0.22).toFixed(2),
      fill: '#3f6925',
      opacity: '0.95'
    })
  );
}

function createSunflowerHead(groupSelector, config) {
  var group = document.querySelector(groupSelector);
  if (!group) {
    return;
  }

  var oldGenerated = group.querySelector('.generated-sunflower');
  if (oldGenerated) {
    oldGenerated.remove();
  }

  var bbox = group.getBBox();
  var base = Math.min(bbox.width, bbox.height);
  var scale = config && config.scale ? config.scale : 1;
  var lift = config && config.lift ? config.lift : 0;
  var cx = bbox.x + bbox.width / 2;
  var cy = bbox.y + bbox.height / 2 - base * lift;
  var core = base * 0.19 * scale;
  var detailScale = PERF_RN14 ? 0.74 : (PERF_LITE ? 0.82 : 1);
  var outerCount = config && config.outerCount ? config.outerCount : 24;
  var innerCount = config && config.innerCount ? config.innerCount : 18;
  var seedCount = PERF_RN14 ? 72 : (PERF_LITE ? 96 : 150);

  outerCount = Math.max(PERF_RN14 ? 14 : 16, Math.round(outerCount * detailScale));
  innerCount = Math.max(PERF_RN14 ? 10 : 12, Math.round(innerCount * detailScale));

  // Keep generated petals fully inside the SVG viewport so they don't get clipped.
  var svg = document.getElementById('flower-frame');
  if (svg && svg.viewBox && svg.viewBox.baseVal) {
    var vb = svg.viewBox.baseVal;
    var outerRadius = core * 2.93; // orbit(1.95) + petal radial extent(0.98)
    var pad = Math.max(core * 0.14, 2);
    var maxRadiusX = Math.min(cx - vb.x, vb.x + vb.width - cx) - pad;
    var maxRadiusY = Math.min(cy - vb.y, vb.y + vb.height - cy) - pad;
    var fit = Math.min(maxRadiusX, maxRadiusY) / outerRadius;

    if (fit < 1) {
      core *= Math.max(fit, 0.72);
    }
  }

  Array.prototype.forEach.call(group.children, function (node) {
    node.setAttribute('opacity', '0');
  });

  var head = svgNode('g', { 'class': 'generated-sunflower' });

  addCalyx(head, cx, cy, core);

  // Underlay behind petals to avoid visual holes between petals/calyx.
  head.appendChild(
    svgNode('ellipse', {
      cx: cx.toFixed(2),
      cy: (cy + core * 0.06).toFixed(2),
      rx: (core * 1.24).toFixed(2),
      ry: (core * 1.14).toFixed(2),
      fill: '#f0a12d',
      opacity: '0.92'
    })
  );

  addPetalRing(head, cx, cy, outerCount, core * 1.95, core * 0.34, core * 0.98, 0, '#ffcc3b', '#d88311');
  addPetalRing(head, cx, cy, innerCount, core * 1.55, core * 0.30, core * 0.84, Math.PI / innerCount, '#ffb534', '#c96a0f');
  addPetalRing(head, cx, cy, innerCount, core * 1.22, core * 0.22, core * 0.58, 0, '#ff8f2c', '#b2550c');

  head.appendChild(
    svgNode('circle', {
      cx: cx.toFixed(2),
      cy: cy.toFixed(2),
      r: (core * 0.95).toFixed(2),
      fill: '#7a3f12'
    })
  );

  head.appendChild(
    svgNode('circle', {
      cx: cx.toFixed(2),
      cy: cy.toFixed(2),
      r: (core * 0.78).toFixed(2),
      fill: '#5c2f0f'
    })
  );

  head.appendChild(
    svgNode('circle', {
      cx: cx.toFixed(2),
      cy: cy.toFixed(2),
      r: (core * 0.62).toFixed(2),
      fill: '#412108'
    })
  );

  addSeedPattern(head, cx, cy, core * 0.8, seedCount);

  head.appendChild(
    svgNode('circle', {
      cx: (cx - core * 0.18).toFixed(2),
      cy: (cy - core * 0.20).toFixed(2),
      r: (core * 0.20).toFixed(2),
      fill: '#b36c28',
      opacity: '0.25'
    })
  );

  group.appendChild(head);
}

createSunflowerHead('#PinkFlowerGroup1_1_', { outerCount: 26, innerCount: 20, scale: 0.98, lift: -0.01 });
createSunflowerHead('#PinkFlowerGroup9_1_', { outerCount: 24, innerCount: 18, scale: 0.98, lift: -0.02 });
createSunflowerHead('#PinkFlowerGroup16_1_', { outerCount: 26, innerCount: 20, scale: 0.98, lift: -0.01 });
createSunflowerHead('#PinkFlowerGroup25_1_', { outerCount: 24, innerCount: 18, scale: 0.98, lift: -0.02 });

function prepareTypewriterText(selector) {
  var el = document.querySelector(selector);
  if (!el) {
    return;
  }

  var rawText = el.textContent || '';
  el.textContent = '';

  for (var i = 0; i < rawText.length; i++) {
    var span = document.createElement('span');
    span.className = 'mobile-caption__char';
    span.textContent = rawText.charAt(i) === ' ' ? '\u00A0' : rawText.charAt(i);
    el.appendChild(span);
  }
}

prepareTypewriterText('.mobile-caption--top');
prepareTypewriterText('.mobile-caption--bottom');

var photoWrapRevealFrom = PERF_LITE
  ? (PERF_RN14 ? { autoAlpha: 0, scale: 0.82, y: 18 } : { autoAlpha: 0, scale: 0.78, y: 20 })
  : { autoAlpha: 0, scale: 0.72, y: 20, filter: 'blur(10px)' };

var photoWrapRevealTo = PERF_LITE
  ? (PERF_RN14 ? { duration: 1.65, autoAlpha: 1, scale: 1, y: 0, ease: 'power3.out' } : { duration: 1.85, autoAlpha: 1, scale: 1, y: 0, ease: 'power3.out' })
  : { duration: 2, autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', ease: 'power3.out' };

var dotsFadeDuration = PERF_RN14 ? 2.8 : 6;
var dotsScaleDuration = PERF_RN14 ? 2.6 : 5;

var tl = gsap.timeline({ paused: true })
.set('#Footer_group_1_', {autoAlpha: 1})
.fromTo( ['#Stem16_1_','#Stem1_1_'], {drawSVG: "0% 0%" }, {duration:1.5, drawSVG: "0% 100%" }, 'start')
.fromTo('#BaseGroup16_1_ path', {autoAlpha: 1, scale: 0, transformOrigin: '-10% 130%'}, {duration:1, scale:1}, 1.2, 'flower1')
.fromTo('#PinkFlowerGroup16_1_', {autoAlpha: 1, scale: 0, transformOrigin: '35% 110%'}, {duration:2, scale:1}, 'flower1-=0.55')
.fromTo('#BaseGroup1_1_ path', {autoAlpha: 1, scale: 0, transformOrigin: '90% 130%'}, {duration:1, scale:1}, 1.2, 'flower1')
.fromTo('#PinkFlowerGroup1_1_', {autoAlpha: 1, scale: 0, transformOrigin: '65% 110%'}, {duration:2, scale:1}, 'flower1-=0.55')
.fromTo( ['#Stem9_1_','#Stem25_1_'], {drawSVG: "0% 0%",  autoAlpha: 1 }, {duration:2, drawSVG: "0% 100%" }, 'flower1+=0.5')
.fromTo('#BaseGroup9_1_ path', {autoAlpha: 1, scale: 0, transformOrigin: '-10% 130%'}, {duration:1, scale:1}, 'flower2-=0.5')
.fromTo('#PinkFlowerGroup9_1_', {autoAlpha: 1, scale: 0, transformOrigin: '5% 110%'}, {duration:2, scale:1}, 'flower2')
.fromTo('#BaseGroup25_1_ path', {autoAlpha: 1, scale: 0, transformOrigin: '105% 130%'}, {duration:1, scale:1}, 'flower2-=0.5')
.fromTo('#PinkFlowerGroup25_1_', {autoAlpha: 1, scale: 0, transformOrigin: '95% 110%'}, {duration:2, scale:1}, 'flower2')

//stems
.fromTo(stemGroup1, stemVarsFrom, stemVarsTo, 'start+=0.1')
.fromTo(stemGroup2, stemVarsFrom, stemVarsTo, 'start+=0.1')
.fromTo(stemGroup3, stemVarsFrom, stemVarsTo, 'flower2-=1.5')
.fromTo(stemGroup4, stemVarsFrom, stemVarsTo, 'flower2-=1.5')
.fromTo(stemGroup5, stemVarsFrom, stemVarsTo, 'flower3-=1')
.fromTo(stemGroup6, stemVarsFrom, stemVarsTo, 'flower3-=1')

//leaves
.fromTo(leafGroup1, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(["80% 45%", "20% 45%"]) }, {duration:2, scale:1}, 'flower1-=1')
.fromTo(leafGroup2, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(["80% 25%", "60% 35%", "70% 75%"]) }, {duration:2, stagger:0.5, scale:1}, 'flower1')
.fromTo(leafGroup3, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(["20% 25%", "40% 35%", "30% 75%"]) }, {duration:2, stagger:0.5, scale:1}, 'flower1')
.fromTo(leafGroup4, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(["90% 70%", "100% 100%", "0% 90%"]) }, {duration:2, stagger:0.5, scale:1}, 'flower2')
.fromTo(leafGroup5, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(["10% 70%", "0% 100%", "100% 90%"]) }, {duration:2, stagger:0.5, scale:1}, 'flower2')
.fromTo(leafGroup6, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(["0% 90%", "10% 50%", "70% 60%"]) }, {duration:2, stagger:0.5, scale:1}, 'flower3')
.fromTo(leafGroup7, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(["100% 90%", "90% 50%", "30% 60%"]) }, {duration:2, stagger:0.5, scale:1}, 'flower3')

//buds
.fromTo(budGroup1, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(['220% -10%', '55% 100%']) }, {duration:2, scale:1, stagger:2.75}, 'flower1-=0.75')
.fromTo(budGroup2, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(['-120% -10%', '45% 100%']) }, {duration:2, scale:1, stagger:2.75}, 'flower1-=0.75')
.fromTo(budGroup3, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(['10% 110%', '0% 100%', '0% 100%', '80% 100%']) }, {duration:2, scale:1, stagger:0.5},  'flower2')
.fromTo(budGroup4, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(['90% 110%', '100% 100%', '100% 100%', '20% 100%']) }, {duration:2, scale:1, stagger:0.5}, 'flower2')
.fromTo(budGroup5, {autoAlpha: 1, scale: 0, transformOrigin:gsap.utils.wrap(['-50% 120%', '150% 120%']) }, {duration:2, scale:1},  'flower2-=0.5');

if (PERF_RN14) {
  tl
  // Strokes are expensive with drawSVG on this GPU; use a soft staggered reveal.
  .fromTo(strokesLeftBottom, { autoAlpha: 0 }, { duration: 0.8, autoAlpha: 1, stagger: 0.08, ease: 'power1.out' }, 1.05)
  .fromTo(strokesRightBottom, { autoAlpha: 0 }, { duration: 0.8, autoAlpha: 1, stagger: 0.08, ease: 'power1.out' }, 1.05)
  .fromTo(strokesLeftTop, { autoAlpha: 0 }, { duration: 0.8, autoAlpha: 1, stagger: 0.08, ease: 'power1.out' }, 'flower1+=0.55')
  .fromTo(strokesRightTop, { autoAlpha: 0 }, { duration: 0.8, autoAlpha: 1, stagger: 0.08, ease: 'power1.out' }, 'flower1+=0.55');
} else {
  tl
  //strokes
  .fromTo(strokesLeftBottom, stemVarsFrom, { drawSVG: "0% 100%", duration:2, stagger:1 }, 1)
  .fromTo(strokesRightBottom, stemVarsFrom, { drawSVG: "0% 100%", duration:2, stagger:1 }, 1)
  .fromTo(strokesLeftTop, stemVarsFrom, { drawSVG: "0% 100%", duration:2, stagger:1 }, 'flower1+=0.5')
  .fromTo(strokesRightTop, stemVarsFrom, { drawSVG: "0% 100%", duration:2, stagger:1 }, 'flower1+=0.5');
}

tl
//dots
.fromTo(dots, dotsFadeDuration, {autoAlpha: 0}, {autoAlpha: 1, ease: Expo.easeOut}, 'flower3+=1')
.fromTo(dots, dotsScaleDuration, {scale: 0, transformOrigin: '50% 50%' }, {scale: 1, ease: Expo.easeOut}, 'flower3')

//center reveal sequence
.add('centerSequence', '-=1.7')
.fromTo(
  '.center-sequence__line--one',
  { autoAlpha: 0, y: 18, scale: 0.96 },
  { duration: 1.35, autoAlpha: 1, y: 0, scale: 1, ease: 'power3.out' },
  'centerSequence'
)
.to(
  '.center-sequence__line--one',
  { duration: 0.95, autoAlpha: 0, y: -16, scale: 1.03, ease: 'power2.inOut' },
  'centerSequence+=2.9'
)
.fromTo(
  '.center-sequence__line--two',
  { autoAlpha: 0, y: 14, scale: 0.94 },
  { duration: 1.15, autoAlpha: 1, y: 0, scale: 1, ease: 'back.out(1.6)' },
  'centerSequence+=3.2'
)
.to(
  '.center-sequence__line--two',
  { duration: 0.9, autoAlpha: 0, y: -20, scale: 1.08, ease: 'power2.in' },
  'centerSequence+=5.45'
)
.fromTo(
  '.center-sequence__photo-wrap',
  photoWrapRevealFrom,
  photoWrapRevealTo,
  'centerSequence+=6.45'
)
.fromTo(
  '.center-sequence__photo',
  { autoAlpha: 0, scale: 1.1 },
  { duration: 1.75, autoAlpha: 1, scale: 1.02, ease: 'power2.out' },
  'centerSequence+=6.6'
)
//mobile captions typewriter (after "YOU ARE!")
.to(
  '.mobile-caption--top .mobile-caption__char',
  { duration: 0.02, autoAlpha: 1, stagger: 0.12, ease: 'none' },
  'centerSequence+=6.9'
)
.to(
  '.mobile-caption--bottom .mobile-caption__char',
  { duration: 0.02, autoAlpha: 1, stagger: 0.14, ease: 'none' },
  '>+0.2'
)
.to(
  '.center-sequence__photo-wrap',
  { duration: PERF_RN14 ? 2.2 : 2.6, y: -4, repeat: 1, yoyo: true, ease: 'sine.inOut' },
  'centerSequence+=8.9'
);

var intro = document.getElementById('valentine-intro');
var flowerScene = document.getElementById('flower-scene');
var forYouButton = document.getElementById('for-you-btn');
var centerPhoto = document.querySelector('.center-sequence__photo');

if (centerPhoto && typeof centerPhoto.decode === 'function') {
  centerPhoto.decode().catch(function () {});
}

function showFlowerScene() {
  if (document.body.classList.contains('is-showing-flower')) {
    return;
  }

  document.body.classList.add('is-showing-flower');

  if (intro) {
    intro.setAttribute('aria-hidden', 'true');
  }

  if (flowerScene) {
    flowerScene.setAttribute('aria-hidden', 'false');
  }

  if (intro && PERF_LITE) {
    window.setTimeout(function () {
      intro.style.display = 'none';
    }, 700);
  }

  window.setTimeout(function () {
    tl.restart(true);
  }, PERF_RN14 ? 260 : (PERF_LITE ? 220 : 0));
}

if (forYouButton) {
  forYouButton.addEventListener('click', showFlowerScene);
} else {
  showFlowerScene();
}
