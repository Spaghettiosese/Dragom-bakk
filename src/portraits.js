// Procedural anime-style SVG portraits.
const hex = (n) => '#' + n.toString(16).padStart(6, '0');

function eyes(kind, expr, iris) {
  const ang = expr === 'angry' || expr === 'shout';
  const hurt = expr === 'hurt';
  const brow = kind === 'vegeta' || ang
    ? `<path d="M33,52 L47,57 L46,59 L33,55Z M67,52 L53,57 L54,59 L67,55Z" fill="#111"/>`
    : hurt
      ? `<path d="M34,56 L46,53 L46,55 L34,58Z M66,56 L54,53 L54,55 L66,58Z" fill="#111"/>`
      : `<path d="M34,54 L47,55 L47,57 L34,57Z M66,54 L53,55 L53,57 L66,57Z" fill="#111"/>`;
  const h = kind === 'vegeta' ? 3.2 : 4.4;
  const lid = hurt ? `<path d="M36,60 L47,61" stroke="#111" stroke-width="1.6"/><path d="M64,60 L53,61" stroke="#111" stroke-width="1.6"/>` : `
    <path d="M36,59 L47,60 L46,${60 + h} Q41,${61 + h} 37,${59 + h * 0.6}Z" fill="#fff" stroke="#111" stroke-width="1.3"/>
    <path d="M64,59 L53,60 L54,${60 + h} Q59,${61 + h} 63,${59 + h * 0.6}Z" fill="#fff" stroke="#111" stroke-width="1.3"/>
    <circle cx="44" cy="${61.2 + h * 0.3}" r="${h * 0.48}" fill="${iris}"/><circle cx="56" cy="${61.2 + h * 0.3}" r="${h * 0.48}" fill="${iris}"/>
    <circle cx="44.6" cy="${60.6 + h * 0.3}" r="0.7" fill="#fff"/><circle cx="56.6" cy="${60.6 + h * 0.3}" r="0.7" fill="#fff"/>`;
  return brow + lid;
}

function mouth(expr, kind) {
  if (expr === 'shout') return `<path d="M44,73 Q50,71 56,73 Q55,81 50,81 Q45,81 44,73Z" fill="#5a1414" stroke="#111" stroke-width="1"/><path d="M45,73.5 L55,73.5 L54.5,75 L45.5,75Z" fill="#fff"/>`;
  if (expr === 'smirk' || kind === 'vegeta') return `<path d="M45,75 Q51,75 56,72" stroke="#111" stroke-width="1.4" fill="none"/>`;
  if (expr === 'hurt') return `<path d="M45,76 Q50,73 55,76" stroke="#111" stroke-width="1.4" fill="none"/>`;
  return `<path d="M45,74 Q50,76 55,74" stroke="#111" stroke-width="1.4" fill="none"/>`;
}

const FACE = `<ellipse cx="30.5" cy="61" rx="3" ry="5" fill="SKIN" stroke="#111" stroke-width="1.2"/><ellipse cx="69.5" cy="61" rx="3" ry="5" fill="SKIN" stroke="#111" stroke-width="1.2"/>
<path d="M31,50 Q30,70 41,80 L50,86 L59,80 Q70,70 69,50 Q50,42 31,50Z" fill="SKIN" stroke="#111" stroke-width="1.5"/>
<path d="M60,66 Q64,76 58,80 L50,86 L55,78Z" fill="#000" opacity=".12"/><path d="M50,64 L48.5,69 L51,69" stroke="#8a5a3a" stroke-width="1" fill="none"/>`;

function gokuHair(c, ssj, long) {
  if (long) return `<path d="M28,64 L6,100 L20,70 L2,80 L18,50 L6,30 L28,32 L30,12 L44,24 L50,8 L56,24 L70,12 L72,32 L94,30 L82,50 L98,80 L80,70 L94,100 L72,64Z" fill="${c}" stroke="#000" stroke-width="1.5"/><path d="M31,54 Q34,38 50,36 Q66,38 69,54 L58,44 L52,58 L48,42 L40,50Z" fill="${c}" stroke="#000" stroke-width="1.3"/>`;
  const back = ssj
    ? 'M26,62 L10,44 L24,44 L8,24 L28,30 L20,4 L40,22 L48,0 L56,20 L72,2 L68,26 L90,18 L78,40 L94,44 L74,60 Z'
    : 'M26,62 L8,50 L22,44 L10,30 L28,30 L22,10 L40,22 L50,4 L56,22 L74,8 L70,28 L90,24 L78,40 L94,48 L74,60 Z';
  const bangs = ssj
    ? 'M31,54 Q34,38 44,34 L46,50 L50,36 L54,50 L56,34 Q66,38 69,54 L62,44 L58,54 L50,42 L42,54 L38,44 Z'
    : 'M31,54 Q33,38 50,34 Q67,38 69,54 L64,46 L60,56 L55,44 L50,56 L45,44 L40,56 L36,46 Z';
  return `<path d="${back}" fill="${c}" stroke="#000" stroke-width="1.5"/><path d="${bangs}" fill="${c}" stroke="#000" stroke-width="1.3"/>
  <path d="M40,20 L46,28 M60,14 L56,26 M26,34 L34,38" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`;
}
function vegetaHair(c, ssj) {
  const d = ssj
    ? 'M31,54 L26,32 L16,8 L34,22 L36,0 L44,16 L50,-4 L56,16 L64,0 L66,22 L84,8 L74,32 L69,54 L62,42 L50,50 L38,42 Z'
    : 'M31,54 L28,34 L20,12 L34,24 L38,4 L45,18 L50,0 L55,18 L62,4 L66,24 L80,12 L72,34 L69,54 L62,42 L50,50 L38,42 Z';
  return `<path d="${d}" fill="${c}" stroke="#000" stroke-width="1.5"/><path d="M44,16 L47,30 M56,16 L53,30" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`;
}

function piccoloHead(f) {
  if (f.look === 'cape') return `<path d="M29,52 Q30,34 50,32 Q70,34 71,52Z" fill="#f4f4f0" stroke="#111" stroke-width="1.5"/><path d="M36,36 Q50,18 64,36Z" fill="#5b2c8c" stroke="#111" stroke-width="1.3"/>`;
  return `<path d="M31,52 Q32,38 50,37 Q68,38 69,52Z" fill="#71b84a" stroke="#111" stroke-width="1.3"/><path d="M45,40 Q40,26 36,22 M55,40 Q60,26 64,22" stroke="#3a6a24" stroke-width="2.4" fill="none"/><circle cx="36" cy="22" r="2" fill="#71b84a"/><circle cx="64" cy="22" r="2" fill="#71b84a"/>`;
}
function friezaHead(f) {
  const horns = f.look === 'first' ? '<path d="M32,46 Q16,40 16,28 Q24,38 36,42Z M68,46 Q84,40 84,28 Q76,38 64,42Z" fill="#3a2a44"/>'
    : f.look === 'second' ? '<path d="M34,44 Q22,24 26,6 Q30,26 40,40Z M66,44 Q78,24 74,6 Q70,26 60,40Z" fill="#3a2a44"/>' : '';
  return `${horns}<path d="M30,52 Q30,32 50,30 Q70,32 70,52 Q50,46 30,52Z" fill="#8a3cc4" stroke="#111" stroke-width="1.5"/><path d="M40,36 Q48,32 56,34" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>`;
}
function body(hero, look) {
  if (hero === 'piccolo') return `<path d="M20,100 Q24,86 40,84 L50,90 L60,84 Q76,86 80,100Z" fill="#5b2c8c" stroke="#111" stroke-width="1.4"/>`;
  if (hero === 'frieza') return `<path d="M24,100 Q28,86 42,84 L50,88 L58,84 Q72,86 76,100Z" fill="#f6f2f6" stroke="#111" stroke-width="1.4"/><ellipse cx="50" cy="96" rx="8" ry="4" fill="#8a3cc4"/>`;
  if (hero === 'goku') return `<path d="M20,100 Q24,86 40,84 L50,92 L60,84 Q76,86 80,100Z" fill="#ff7a18" stroke="#111" stroke-width="1.4"/><path d="M42,84 L50,95 L58,84 L55,84 L50,90 L45,84Z" fill="#1f3d9c"/>`;
  const pads = look.armor === 'saiyan' ? `<path d="M10,100 Q10,86 26,84 L34,92 L28,100Z M90,100 Q90,86 74,84 L66,92 L72,100Z" fill="#d8ae45" stroke="#111" stroke-width="1.2"/>` : '';
  return `<path d="M22,100 Q26,86 42,84 L50,88 L58,84 Q74,86 78,100Z" fill="#f3f1e8" stroke="#111" stroke-width="1.4"/><path d="M42,82 L50,90 L58,82 L58,86 L50,92 L42,86Z" fill="#1c2b7a"/>${pads}`;
}

export function portraitSVG(hero, form = {}, look = {}, expr = 'neutral') {
  const aura = hex(form.aura ?? 0xffffff);
  if (form.ape) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g"><stop offset="0" stop-color="#ffb070"/><stop offset="1" stop-color="#6a1010"/></radialGradient></defs>
    <circle cx="50" cy="50" r="50" fill="url(#g)"/>
    <path d="M14,70 L8,40 L20,46 L18,22 L32,32 L40,10 L50,24 L60,10 L68,32 L82,22 L80,46 L92,40 L86,70 Q80,96 50,98 Q20,96 14,70Z" fill="#5c3a22" stroke="#111" stroke-width="1.6"/>
    <path d="M28,58 Q50,48 72,58 Q76,70 70,78 Q50,96 30,78 Q24,70 28,58Z" fill="#d9a07a" stroke="#111" stroke-width="1.2"/>
    <path d="M30,50 L46,56 L45,60 L31,56Z M70,50 L54,56 L55,60 L69,56Z" fill="#fff" stroke="#111"/><circle cx="41" cy="57" r="2" fill="#e01010"/><circle cx="59" cy="57" r="2" fill="#e01010"/>
    <path d="M26,46 L46,52 M74,46 L54,52" stroke="#111" stroke-width="3"/>
    <path d="M36,76 Q50,70 64,76 Q58,90 50,90 Q42,90 36,76Z" fill="#4a0a0a" stroke="#111"/><path d="M38,76 L42,82 L44,75 M62,76 L58,82 L56,75" fill="#fff"/>
    <ellipse cx="46" cy="68" rx="2" ry="1.4" fill="#222"/><ellipse cx="54" cy="68" rx="2" ry="1.4" fill="#222"/></svg>`;
  }
  let skin = { goku: '#ffd3ab', vegeta: '#f6c9a0', piccolo: '#71b84a', frieza: '#f6f2f6' }[hero];
  if (form.tint) skin = '#ffab94';
  const iris = form.eyes ? hex(form.eyes) : '#111';
  const hair = hex(form.hair ?? 0x15161c);
  const hairSvg = hero === 'goku' ? gokuHair(hair, form.spiky, form.long) : hero === 'vegeta' ? vegetaHair(hair, form.spiky) : hero === 'piccolo' ? piccoloHead(form) : friezaHead(form);
  if (form.tint && hero === 'piccolo') skin = '#4f9a38';
  const scouter = look.scouter ? `<path d="M52,56 L68,55 L68,65 L53,64Z" fill="#33ff66" fill-opacity=".45" stroke="#1a6" stroke-width="1"/><rect x="67" y="54" width="5" height="12" fill="#e6e6e6" stroke="#111"/>` : '';
  const aExpr = hero !== 'goku' && expr === 'neutral' ? 'smirk' : expr;
  const ears = hero === 'piccolo' ? `<path d="M31,58 L14,48 L32,66Z M69,58 L86,48 L68,66Z" fill="${skin}" stroke="#111" stroke-width="1.3"/>` : '';
  const cheek = hero === 'frieza' ? '<path d="M33,66 L37,78 L35,66Z M67,66 L63,78 L65,66Z" fill="#8a3cc4"/>' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="${aura}"/><stop offset="1" stop-color="#0a1030"/></radialGradient></defs>
  <circle cx="50" cy="50" r="50" fill="url(#g)"/>${body(hero, look)}<rect x="44" y="76" width="12" height="12" fill="${skin}"/>
  ${ears}${FACE.replaceAll('SKIN', skin)}${cheek}${eyes(hero === 'goku' ? 'goku' : 'vegeta', aExpr, iris)}${mouth(aExpr, hero === 'goku' ? 'goku' : 'vegeta')}${hairSvg}${scouter}${form.majin ? '<path d="M44,52 L46,44 L50,49 L54,44 L56,52" stroke="#c0101a" stroke-width="1.8" fill="none"/>' : ''}</svg>`;
}

export function portraitURL(...a) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(portraitSVG(...a)); }
