// Procedural cel-shaded anime fighters (Goku, Vegeta, Great Ape) + pose rig.
import * as THREE from 'three';
import { PALETTES } from './data.js';

const gradientMap = (() => {
  const t = new THREE.DataTexture(new Uint8Array([85, 175, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();

const outlineMat = new THREE.ShaderMaterial({
  uniforms: { thick: { value: 0.022 } },
  vertexShader: `uniform float thick; void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * thick, 1.0); }`,
  fragmentShader: `void main(){ gl_FragColor = vec4(0.03,0.03,0.06,1.0); }`,
  side: THREE.BackSide,
});

export function toon(color, extra = {}) {
  const m = new THREE.MeshToonMaterial({ color, gradientMap, ...extra });
  m.userData.base = new THREE.Color(color); return m;
}

function part(geo, mat, parent, pos = [0, 0, 0], rot = [0, 0, 0], scale, outline = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot); if (scale) m.scale.set(...scale);
  m.castShadow = true; parent.add(m);
  if (outline) { const o = new THREE.Mesh(geo, outlineMat); o.raycast = () => {}; m.add(o); }
  return m;
}
const g = (name, parent, pos = [0, 0, 0]) => { const o = new THREE.Group(); o.name = name; o.position.set(...pos); parent.add(o); return o; };
// tapered limb hanging down from origin
const limb = (rt, rb, len, seg = 12) => { const c = new THREE.CylinderGeometry(rt, rb, len, seg, 1); c.translate(0, -len / 2, 0); return c; };
const sph = (r, w = 16, h = 12) => new THREE.SphereGeometry(r, w, h);

// ---------- face texture ----------
function drawFace(ctx, hero, expr, skin, iris, ape) {
  const W = 256; ctx.fillStyle = skin; ctx.fillRect(0, 0, W, W);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (ape) {
    ctx.fillStyle = '#d9a07a'; ctx.fillRect(0, 60, W, 196);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 5;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(128 + s * 18, 104); ctx.lineTo(128 + s * 70, 88); ctx.lineTo(128 + s * 62, 118); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff1a1a'; ctx.beginPath(); ctx.arc(128 + s * 44, 104, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#fff';
      ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(128 + s * 10, 88); ctx.lineTo(128 + s * 78, 70); ctx.stroke(); ctx.lineWidth = 5;
    }
    return;
  }
  const sharp = hero === 'vegeta' || hero === 'piccolo' || hero === 'frieza';
  const ang = sharp || expr === 'angry' || expr === 'shout';
  const ey = 118, c = 128;
  if (hero === 'frieza') { ctx.fillStyle = '#8a3cc4'; for (const q of [-1, 1]) { ctx.beginPath(); ctx.moveTo(c + q * 70, 150); ctx.lineTo(c + q * 58, 196); ctx.lineTo(c + q * 66, 150); ctx.fill(); } }
  if (hero === 'piccolo') { ctx.fillStyle = 'rgba(20,70,10,0.35)'; ctx.fillRect(40, 60, 176, 22); }
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#111'; ctx.beginPath(); // brows (thick, anime)
    if (expr === 'hurt') { ctx.moveTo(c + s * 12, 80); ctx.lineTo(c + s * 62, 92); ctx.lineTo(c + s * 62, 102); ctx.lineTo(c + s * 12, 90); }
    else if (ang) { ctx.moveTo(c + s * 8, 104); ctx.lineTo(c + s * 66, 76); ctx.lineTo(c + s * 68, 88); ctx.lineTo(c + s * 12, 114); }
    else { ctx.moveTo(c + s * 10, 92); ctx.lineTo(c + s * 64, 82); ctx.lineTo(c + s * 66, 93); ctx.lineTo(c + s * 10, 102); }
    ctx.fill();
    const h = sharp ? 18 : 24;
    if (expr === 'hurt') { ctx.lineWidth = 7; ctx.strokeStyle = '#111'; ctx.beginPath(); ctx.moveTo(c + s * 16, ey + 4); ctx.lineTo(c + s * 60, ey - 2); ctx.stroke(); continue; }
    // sclera: sharp outer corner, flat top lash line
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 6;
    const sclera = () => { ctx.beginPath(); ctx.moveTo(c + s * 14, ey - (ang ? 8 : 2)); ctx.lineTo(c + s * 64, ey - (ang ? -2 : 6));
      ctx.quadraticCurveTo(c + s * 60, ey + h, c + s * 28, ey + h * 0.85); ctx.quadraticCurveTo(c + s * 14, ey + h * 0.5, c + s * 14, ey - (ang ? 8 : 2)); ctx.closePath(); };
    sclera(); ctx.fill(); ctx.stroke();
    // upper lash (bold)
    ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(c + s * 12, ey - (ang ? 9 : 3)); ctx.lineTo(c + s * 66, ey - (ang ? -1 : 7)); ctx.stroke();
    const ix = c + s * 36, iy = ey + h * 0.35;
    ctx.save(); sclera(); ctx.clip();
    ctx.fillStyle = iris; ctx.beginPath(); ctx.ellipse(ix, iy, 11, h * 0.62, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(ix, iy, 5.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ix + 4, iy - 4, 3.5, 0, 7); ctx.fill();
    ctx.restore();
  }
  // nose
  ctx.strokeStyle = '#8a5a3a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(131, 142); ctx.lineTo(123, 162); ctx.lineTo(132, 163); ctx.stroke();
  // mouth
  ctx.strokeStyle = '#1a0e0a'; ctx.lineWidth = 6;
  if (expr === 'shout') {
    ctx.fillStyle = '#6a1616'; ctx.beginPath(); ctx.moveTo(108, 178); ctx.quadraticCurveTo(128, 172, 148, 178); ctx.quadraticCurveTo(146, 206, 128, 208); ctx.quadraticCurveTo(110, 206, 108, 178); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillRect(112, 178, 32, 5);
  } else {
    ctx.beginPath();
    if (hero === 'frieza') { ctx.strokeStyle = '#2a1030'; ctx.lineWidth = 8; ctx.moveTo(112, 182); ctx.quadraticCurveTo(128, 188, 146, 178); }
    else if (sharp) { ctx.moveTo(112, 184); ctx.quadraticCurveTo(130, 186, 146, 176); }
    else if (expr === 'hurt') { ctx.moveTo(112, 186); ctx.quadraticCurveTo(128, 176, 144, 186); }
    else { ctx.moveTo(114, 180); ctx.quadraticCurveTo(128, 188, 142, 180); }
    ctx.stroke();
  }
  // cheek shading
  ctx.fillStyle = 'rgba(120,60,30,0.10)'; ctx.fillRect(0, 200, 256, 56);
}

// ---------- hair ----------
function spike(parent, mat, r, az, el, daz, del, len, rad, scale = [1, 1, 0.7]) {
  const geo = new THREE.ConeGeometry(rad, len, 6); geo.translate(0, len / 2, 0);
  const o = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(r * 0.78);
  const d = new THREE.Vector3(Math.sin(daz) * Math.cos(del), Math.sin(del), Math.cos(daz) * Math.cos(del)).normalize();
  const m = part(geo, mat, parent, [o.x, o.y, o.z], [0, 0, 0], scale);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); return m;
}
const D = Math.PI / 180;
function buildHair(head, hero, spiky, mat, r) {
  const grp = g('hair', head);
  // cap
  part(new THREE.SphereGeometry(r * 1.07, 22, 12, 0, Math.PI * 2, 0, Math.PI * (hero === 'vegeta' ? 0.36 : 0.40)), mat, grp, [0, 0.01, -0.01], [-0.18, 0, 0]);
  part(new THREE.SphereGeometry(r * 1.06, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.45), mat, grp, [0, 0, -0.02], [-1.25, 0, 0]);
  if (hero === 'goku' && !spiky) {
    for (const [az, el, daz, del, len, rad] of [
      [0, 55, 0, -65, 0.2, 0.06], [-24, 50, -30, -70, 0.19, 0.055], [24, 50, 30, -70, 0.19, 0.055], [-45, 40, -60, -60, 0.15, 0.05], [45, 40, 60, -60, 0.15, 0.05],
      [8, 75, 20, 40, 0.34, 0.09],
      [80, 45, 95, 20, 0.36, 0.1], [100, 20, 110, -5, 0.38, 0.1], [95, 65, 100, 45, 0.3, 0.09],
      [-80, 45, -95, 20, 0.36, 0.1], [-100, 20, -110, -5, 0.38, 0.1], [-95, 65, -100, 45, 0.3, 0.09],
      [140, 40, 150, 10, 0.4, 0.11], [-140, 40, -150, 10, 0.4, 0.11], [180, 30, 180, -10, 0.42, 0.12], [160, 65, 165, 35, 0.38, 0.1], [-160, 65, -165, 35, 0.38, 0.1],
      [120, 0, 130, -35, 0.3, 0.09], [-120, 0, -130, -35, 0.3, 0.09], [180, -10, 180, -45, 0.28, 0.09],
    ]) spike(grp, mat, r, az * D, el * D, daz * D, del * D, len, rad);
  } else if (hero === 'goku') {
    for (const [az, el, daz, del, len, rad] of [
      [8, 60, 12, -35, 0.12, 0.045],
      [0, 75, 0, 70, 0.46, 0.1], [40, 70, 45, 60, 0.46, 0.1], [-40, 70, -45, 60, 0.46, 0.1],
      [90, 55, 100, 45, 0.45, 0.1], [-90, 55, -100, 45, 0.45, 0.1], [140, 55, 150, 50, 0.46, 0.11], [-140, 55, -150, 50, 0.46, 0.11],
      [180, 45, 180, 40, 0.44, 0.11], [110, 20, 120, 25, 0.36, 0.09], [-110, 20, -120, 25, 0.36, 0.09], [170, 15, 170, 5, 0.32, 0.09],
    ]) spike(grp, mat, r, az * D, el * D, daz * D, del * D, len, rad);
  } else {
    const up = spiky ? 1.15 : 1;
    // widow's peak
    spike(grp, mat, r, 0, 38 * D, 0, -80 * D, 0.13, 0.07, [1.4, 1, 0.5]);
    for (const [az, el, daz, del, len, rad] of [
      [0, 70, 0, 82, 0.5, 0.11], [30, 65, 25, 75, 0.46, 0.1], [-30, 65, -25, 75, 0.46, 0.1], [60, 55, 50, 70, 0.42, 0.1], [-60, 55, -50, 70, 0.42, 0.1],
      [95, 45, 80, 62, 0.38, 0.1], [-95, 45, -80, 62, 0.38, 0.1], [140, 50, 150, 70, 0.44, 0.11], [-140, 50, -150, 70, 0.44, 0.11], [180, 55, 180, 75, 0.48, 0.12],
      [120, 25, 125, 55, 0.3, 0.1], [-120, 25, -125, 55, 0.3, 0.1], [180, 25, 180, 50, 0.32, 0.11],
    ]) spike(grp, mat, r, az * D, el * D, daz * D, del * D, len * up, rad);
  }
  return grp;
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function kanjiTex(ch) {
  return canvasTex(128, 128, (x) => {
    x.fillStyle = '#fff'; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill(); x.lineWidth = 5; x.strokeStyle = '#111'; x.stroke();
    x.fillStyle = '#111'; x.font = 'bold 78px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, 64, 68);
  });
}

// ---------- aura ----------
export function makeAura() {
  const geo = new THREE.SphereGeometry(1, 32, 24);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (y > 0) { const k = 1 - 0.75 * y * y; x *= k; z *= k; y *= 1.9; }
    p.setXYZ(i, x * 0.85, y, z * 0.85);
  }
  geo.computeVertexNormals();
  const mat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, color: { value: new THREE.Color(0xffffff) }, strength: { value: 0 } },
    vertexShader: `uniform float time; varying vec3 vN; varying vec3 vP; void main(){ vP = position; vN = normalize(normalMatrix*normal);
      float a = atan(position.x, position.z);
      float w = sin(time*11.0 + position.y*7.0 + a*5.0)*0.06 + sin(time*17.0 - a*9.0 + position.y*3.0)*0.04;
      vec3 p = position + normal*w*(0.6 + max(position.y,0.0));
      p.y += max(position.y,0.0)*0.25*(0.5+0.5*sin(time*9.0 + a*7.0));
      gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.); }`,
    fragmentShader: `uniform float time; uniform vec3 color; uniform float strength; varying vec3 vN; varying vec3 vP;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+1.),f.x), f.y); }
      void main(){
        float fr = 1.0 - abs(vN.z);
        float a = atan(vP.x, vP.z);
        vec2 q = vec2(a*2.5, vP.y*2.2 - time*4.5);
        float f = n(q)*0.6 + n(q*2.3 + 7.0)*0.4;
        float t2 = n(vec2(a*6.0, vP.y*5.0 - time*7.0));
        float flame = smoothstep(0.45, 1.0, fr*0.85 + (f - 0.5)*0.9 + t2*0.35 + max(vP.y,0.)*0.2);
        float bottom = smoothstep(-1.0, -0.3, vP.y);
        float rim = 1.0 - smoothstep(0.82, 1.0, fr);
        float al = flame * bottom * strength * 0.7 * (0.35 + 0.65*rim);
        gl_FragColor = vec4(mix(color, vec3(1.0), f*f*0.6) * 1.6, al);
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const m = new THREE.Mesh(geo, mat); m.renderOrder = 5; return m;
}

// ---------- humanoid ----------
export function buildFighter(def, form) {
  const hero = def.hero, pal = PALETTES[hero], look = def.look;
  const root = new THREE.Group(); const J = {}; const mats = [];
  const M = (c) => { const m = toon(c); mats.push(m); return m; };
  const skin = M(pal.skin);
  const hairMat = M(form.hair ?? 0x15161c);
  const R = 0.17;

  J.hips = g('hips', root, [0, 1.08, 0]);
  J.spine = g('spine', J.hips, [0, 0.06, 0]);
  J.neck = g('neck', J.spine, [0, 0.6, 0]);
  J.head = g('head', J.neck, [0, 0.2, 0.01]);
  J.lArm = g('lArm', J.spine, [0.3, 0.5, 0]); J.rArm = g('rArm', J.spine, [-0.3, 0.5, 0]);
  J.lFore = g('lFore', J.lArm, [0, -0.33, 0]); J.rFore = g('rFore', J.rArm, [0, -0.33, 0]);
  J.lLeg = g('lLeg', J.hips, [0.13, -0.04, 0]); J.rLeg = g('rLeg', J.hips, [-0.13, -0.04, 0]);
  J.lShin = g('lShin', J.lLeg, [0, -0.5, 0]); J.rShin = g('rShin', J.rLeg, [0, -0.5, 0]);

  // head & face
  part(sph(R, 24, 18), skin, J.head, [0, 0, 0], [0, 0, 0], [0.9, 1.08, 0.95]);
  part(sph(0.09, 12, 10), skin, J.head, [0, -0.11, 0.05], [0, 0, 0], [0.9, 0.8, 1.0], false);
  part(new THREE.CylinderGeometry(0.065, 0.075, 0.2, 10), skin, J.neck, [0, 0.07, 0]);
  const ears = [-1, 1].map((s) => part(sph(0.04, 8, 6), skin, J.head, [s * 0.155, 0, 0], [0, 0, 0], [0.5, 1, 0.8]));
  const faceCanvas = document.createElement('canvas'); faceCanvas.width = faceCanvas.height = 256;
  const faceTex = new THREE.CanvasTexture(faceCanvas); faceTex.colorSpace = THREE.SRGBColorSpace;
  const faceMat = toon(0xffffff, { map: faceTex });
  const face = new THREE.Mesh(new THREE.SphereGeometry(R * 1.004, 28, 18, Math.PI / 2 - Math.PI * 0.37, Math.PI * 0.74, Math.PI * 0.30, Math.PI * 0.48), faceMat);
  face.scale.set(0.9, 1.08, 0.95); J.head.add(face);
  const ALIEN = hero === 'piccolo' || hero === 'frieza';
  const hairs = ALIEN ? { normal: g('h', J.head), spiky: g('h2', J.head) } : { normal: buildHair(J.head, hero, false, hairMat, R), spiky: buildHair(J.head, hero, true, hairMat, R) };
  let onForm = null;
  if (ALIEN) { ears.forEach((e) => { e.visible = false; }); onForm = buildAlien(hero, J, M, skin, pal, R, root); } else {

  // torso
  const topCol = hero === 'goku' ? pal.gi : pal.suit;
  const top = M(topCol);
  part(new THREE.CylinderGeometry(0.27, 0.19, 0.58, 16), top, J.spine, [0, 0.29, 0], [0, 0, 0], [1, 1, 0.62]);
  part(sph(0.2, 14, 10), top, J.hips, [0, 0.0, 0], [0, 0, 0], [1.05, 0.6, 0.7]);
  const lower = M(hero === 'goku' ? pal.gi : pal.suit);
  if (hero === 'goku') {
    const blue = M(pal.under);
    part(new THREE.ConeGeometry(0.1, 0.2, 3), blue, J.spine, [0, 0.5, 0.115], [Math.PI, 0, 0], [1, 1, 0.3], false);
    part(new THREE.CylinderGeometry(0.21, 0.21, 0.08, 16), blue, J.hips, [0, 0.06, 0], [0, 0, 0], [1, 1, 0.72]);
    part(new THREE.BoxGeometry(0.05, 0.2, 0.02), blue, J.hips, [0.1, -0.05, 0.14], [0, 0, 0.2]);
    part(new THREE.BoxGeometry(0.05, 0.2, 0.02), blue, J.hips, [0.15, -0.05, 0.12], [0, 0, 0.35]);
    const kt = kanjiTex(look.backKanji), kf = kanjiTex(look.kanji);
    const decal = (tex, z, ry) => { const d = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), new THREE.MeshToonMaterial({ map: tex, gradientMap, transparent: true })); d.position.set(ry ? 0 : 0.1, ry ? 0.34 : 0.42, z); d.rotation.y = ry; J.spine.add(d); };
    decal(kt, -0.13, Math.PI); decal(kf, 0.125, 0);
    J.bootMat = M(pal.boot); J.trim = M(pal.bootTrim); J.band = blue;
  } else {
    const armor = M(pal.armor), pad = M(pal.pad);
    part(new THREE.CylinderGeometry(0.3, 0.22, 0.42, 16), armor, J.spine, [0, 0.36, 0], [0, 0, 0], [1, 1, 0.7]);
    part(new THREE.CylinderGeometry(0.24, 0.3, 0.06, 16), armor, J.spine, [0, 0.6, 0], [0, 0, 0], [1, 1, 0.7]);
    if (look.armor === 'saiyan') {
      for (const s of [-1, 1]) {
        part(new THREE.BoxGeometry(0.26, 0.035, 0.2), pad, J.spine, [s * 0.33, 0.62, 0], [0, 0, s * 0.3]);
      }
      for (const x of [-0.1, 0.1]) part(new THREE.BoxGeometry(0.13, 0.22, 0.03), pad, J.hips, [x, -0.05, 0.14], [0.15, 0, 0]);
    } else {
      part(new THREE.BoxGeometry(0.08, 0.3, 0.03), pad, J.spine, [0.12, 0.34, 0.16], [0.1, 0, 0]);
      part(new THREE.BoxGeometry(0.08, 0.3, 0.03), pad, J.spine, [-0.12, 0.34, 0.16], [0.1, 0, 0]);
    }
    J.bootMat = M(pal.boot); J.trim = M(pal.bootTip); J.band = M(pal.glove);
    if (look.tail) J.tailMesh = part(new THREE.TorusGeometry(0.22, 0.045, 8, 24), M(pal.tail), J.hips, [0, 0.02, 0], [Math.PI / 2, 0, 0], [1, 0.72, 1]);
    if (look.scouter) {
      const sc = new THREE.Group(); J.head.add(sc); sc.position.set(0.12, 0.02, 0.0);
      part(new THREE.BoxGeometry(0.03, 0.1, 0.06), M(0xe8e8e8), sc, [0.04, 0, 0]);
      part(new THREE.BoxGeometry(0.02, 0.02, 0.18), M(0xe8e8e8), sc, [0.04, 0.04, 0.08]);
      const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.07), new THREE.MeshBasicMaterial({ color: 0x33ff66, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
      lens.position.set(-0.04, 0.02, 0.17); lens.rotation.y = 0.35; sc.add(lens);
    }
  }
  // arms
  for (const s of ['l', 'r']) {
    const A = J[s + 'Arm'], F = J[s + 'Fore'];
    const sleeve = hero === 'goku' ? top : top;
    part(sph(0.1), sleeve, A, [0, -0.02, 0], [0, 0, 0], [1.15, 1, 1]);
    const upperMat = hero === 'goku' ? skin : top;
    part(limb(0.085, 0.07, 0.34), upperMat, A);
    if (hero === 'goku') part(limb(0.105, 0.095, 0.13), top, A, [0, -0.01, 0]);
    part(limb(0.07, 0.058, 0.32), hero === 'goku' ? skin : top, F);
    part(limb(0.068, 0.068, 0.1), J.band, F, [0, -0.2, 0]);
    J[s + 'Hand'] = part(sph(0.07, 10, 8), hero === 'goku' ? skin : J.band, F, [0, -0.35, 0.01], [0, 0, 0], [0.9, 1.1, 1]);
  }
  // legs
  for (const s of ['l', 'r']) {
    const L = J[s + 'Leg'], S = J[s + 'Shin'];
    part(limb(hero === 'goku' ? 0.14 : 0.115, hero === 'goku' ? 0.12 : 0.085, 0.52), lower, L);
    part(limb(hero === 'goku' ? 0.115 : 0.085, 0.065, 0.3), lower, S);
    part(limb(0.085, 0.085, 0.22), J.bootMat, S, [0, -0.28, 0]);
    part(new THREE.TorusGeometry(0.086, 0.022, 6, 14), J.trim, S, [0, -0.27, 0], [Math.PI / 2, 0, 0], null, false);
    part(new THREE.BoxGeometry(0.13, 0.08, 0.26), J.bootMat, S, [0, -0.48, 0.06]);
    if (hero === 'vegeta') part(new THREE.ConeGeometry(0.06, 0.1, 6), J.trim, S, [0, -0.47, 0.2], [Math.PI / 2, 0, 0], [1, 1, 0.6]);
  }

  }
  const aura = makeAura(); aura.position.y = 1.0; aura.scale.set(0.9, 1.1, 0.9); root.add(aura);
  root.traverse((o) => { if (o.isMesh) o.castShadow = true; });

  const model = {
    root, J, aura, hairs, hairMat, mats, height: 2.2, radius: 0.55, hero, ape: false,
    expr: '', iris: '#111',
    setExpression(e) {
      if (e === this.expr) return; this.expr = e;
      const skinHex = '#' + skin.color.getHexString();
      drawFace(faceCanvas.getContext('2d'), hero, e, skinHex, this.iris, false); faceTex.needsUpdate = true;
    },
    setForm(f) {
      hairMat.userData.base.set(f.hair ?? 0x15161c); hairMat.color.copy(hairMat.userData.base);
      hairs.normal.visible = !f.spiky; hairs.spiky.visible = !!f.spiky;
      this.iris = f.eyes ? '#' + f.eyes.toString(16).padStart(6, '0') : '#221a14';
      this.tint = f.tint ? new THREE.Color(f.tint) : null;
      for (const m of mats) { m.color.copy(m.userData.base); if (this.tint && m !== hairMat) m.color.lerp(this.tint, 0.35); }
      if (f.hair === 0xffe24a) { hairMat.emissive = new THREE.Color(0x6a4a00); } else hairMat.emissive = new THREE.Color(0);
      aura.material.uniforms.color.value.set(f.aura); onForm && onForm(f);
      const e = this.expr; this.expr = ''; this.setExpression(e || 'neutral');
    },
  };
  model.setForm(form);
  return model;
}

// ---------- Great Ape ----------
export function buildApe(def) {
  const root = new THREE.Group(); const J = {};
  const fur = toon(0x5c3a22), face = toon(0xd9a07a), armor = toon(0xf3f1e8), pad = toon(0xd8ae45), suit = toon(0x1c2b7a);
  J.hips = g('hips', root, [0, 0.85, 0]);
  J.spine = g('spine', J.hips, [0, 0.05, 0]);
  J.neck = g('neck', J.spine, [0, 0.92, 0.18]);
  J.head = g('head', J.neck, [0, 0.14, 0.1]);
  J.lArm = g('lArm', J.spine, [0.52, 0.6, 0]); J.rArm = g('rArm', J.spine, [-0.52, 0.6, 0]);
  J.lFore = g('lFore', J.lArm, [0, -0.5, 0]); J.rFore = g('rFore', J.rArm, [0, -0.5, 0]);
  J.lLeg = g('lLeg', J.hips, [0.25, -0.05, 0]); J.rLeg = g('rLeg', J.hips, [-0.25, -0.05, 0]);
  J.lShin = g('lShin', J.lLeg, [0, -0.4, 0]); J.rShin = g('rShin', J.rLeg, [0, -0.4, 0]);
  part(sph(0.5, 20, 16), fur, J.spine, [0, 0.4, 0], [0, 0, 0], [1.1, 0.95, 0.8]);
  part(sph(0.34, 16, 12), face, J.spine, [0, 0.3, 0.2], [0, 0, 0], [0.9, 1, 0.6]);
  part(new THREE.CylinderGeometry(0.56, 0.45, 0.4, 18), armor, J.spine, [0, 0.62, 0], [0, 0, 0], [1, 1, 0.8]);
  for (const s of [-1, 1]) part(new THREE.BoxGeometry(0.34, 0.05, 0.3), pad, J.spine, [s * 0.55, 0.8, 0], [0, 0, s * 0.25]);
  part(sph(0.42, 16, 12), suit, J.hips, [0, 0, 0], [0, 0, 0], [1.1, 0.6, 0.8]);
  // head
  part(sph(0.3, 20, 16), fur, J.head, [0, 0.05, 0], [0, 0, 0], [1.05, 1, 1]);
  for (const s of [-1, 1]) part(new THREE.ConeGeometry(0.1, 0.3, 6), fur, J.head, [s * 0.2, 0.25, -0.05], [0, 0, -s * 0.5]);
  const fc = document.createElement('canvas'); fc.width = fc.height = 256; drawFace(fc.getContext('2d'), 'ape', 'angry', '#5c3a22', '#f00', true);
  const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace;
  const fm = new THREE.Mesh(new THREE.SphereGeometry(0.302, 24, 16, Math.PI / 2 - 1.1, 2.2, 0.8, 1.2), toon(0xffffff, { map: ft })); fm.position.y = 0.05; fm.scale.set(1.05, 1, 1); J.head.add(fm);
  const eyeGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.06), new THREE.MeshBasicMaterial({ color: 0xff2020, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  eyeGlow.position.set(0, 0.1, 0.31); J.head.add(eyeGlow);
  J.jaw = g('jaw', J.head, [0, -0.13, 0.14]);
  part(sph(0.17, 16, 12), face, J.jaw, [0, -0.02, 0.1], [0, 0, 0], [1.1, 0.6, 0.85]);
  for (const s of [-1, 1]) part(new THREE.ConeGeometry(0.03, 0.09, 5), toon(0xffffff), J.jaw, [s * 0.1, 0.06, 0.26], [Math.PI, 0, 0]);
  for (const s of ['l', 'r']) {
    part(sph(0.2), fur, J[s + 'Arm'], [0, -0.02, 0]);
    part(limb(0.18, 0.15, 0.52), fur, J[s + 'Arm']);
    part(limb(0.15, 0.13, 0.5), fur, J[s + 'Fore']);
    J[s + 'Hand'] = part(sph(0.17), face, J[s + 'Fore'], [0, -0.55, 0.02], [0, 0, 0], [1, 1.1, 0.9]);
    part(limb(0.22, 0.18, 0.42), fur, J[s + 'Leg']);
    part(limb(0.18, 0.16, 0.42), fur, J[s + 'Shin']);
    part(new THREE.BoxGeometry(0.3, 0.12, 0.42), face, J[s + 'Shin'], [0, -0.44, 0.08]);
  }
  // tail — kept as separate group so it can be cut
  const tail = new THREE.Group(); J.hips.add(tail); tail.position.set(0, 0, -0.35);
  let prev = tail;
  for (let i = 0; i < 6; i++) { const seg = g('t' + i, prev, i ? [0, -0.2, 0] : [0, 0, 0]); seg.rotation.x = i ? 0.25 : 2.2; part(limb(0.08 - i * 0.008, 0.07 - i * 0.008, 0.22), fur, seg); prev = seg; }
  J.tail = tail;
  const aura = makeAura(); aura.position.y = 1.0; aura.scale.set(1.2, 1.1, 1.2); root.add(aura);
  aura.material.uniforms.color.value.set(0xff3030);
  return { root, J, aura, height: 2.2, radius: 0.9, hero: 'vegeta', ape: true, setExpression() {}, setForm() {} };
}

// ---------- poses (x,y,z per joint), characters face +Z ----------
const Z = [0, 0, 0];
export const POSES = {
  stand: { hips: Z, spine: [0.02, 0, 0], head: Z, lArm: [0.05, 0, 0.18], lFore: [-0.25, 0, 0], rArm: [0.05, 0, -0.18], rFore: [-0.25, 0, 0], lLeg: [0, 0, 0.06], lShin: [0.05, 0, 0], rLeg: [0, 0, -0.06], rShin: [0.05, 0, 0] },
  idle: { hips: [0.05, -0.2, 0], spine: [0.08, 0.3, 0], head: [0, -0.15, 0], lArm: [-0.55, 0, 0.35], lFore: [-1.75, 0, 0], rArm: [-0.25, 0, -0.45], rFore: [-1.95, 0, 0], lLeg: [-0.7, 0, 0.12], lShin: [1.1, 0, 0], rLeg: [0.15, 0, -0.1], rShin: [0.7, 0, 0] },
  fly: { hips: [1.0, 0, 0], spine: [0.15, 0, 0], head: [-0.95, 0, 0], lArm: [0.4, 0, 0.3], lFore: [-0.3, 0, 0], rArm: [0.4, 0, -0.3], rFore: [-0.3, 0, 0], lLeg: [0.15, 0, 0.05], lShin: [0.4, 0, 0], rLeg: [0.05, 0, -0.05], rShin: [0.9, 0, 0] },
  back: { hips: [-0.35, 0, 0], spine: [0.1, 0, 0], head: [0.2, 0, 0], lArm: [-0.4, 0, 0.5], lFore: [-1.2, 0, 0], rArm: [-0.4, 0, -0.5], rFore: [-1.2, 0, 0], lLeg: [-0.5, 0, 0.1], lShin: [0.8, 0, 0], rLeg: [-0.2, 0, -0.1], rShin: [0.5, 0, 0] },
  strafeL: { hips: [0.1, 0, -0.35], spine: [0, 0.2, 0.1], head: [0, 0, 0.2], lArm: [-0.3, 0, 0.8], lFore: [-1, 0, 0], rArm: [-0.4, 0, -0.3], rFore: [-1.6, 0, 0], lLeg: [-0.3, 0, 0.4], lShin: [0.7, 0, 0], rLeg: [0, 0, 0], rShin: [0.6, 0, 0] },
  strafeR: { hips: [0.1, 0, 0.35], spine: [0, -0.2, -0.1], head: [0, 0, -0.2], lArm: [-0.4, 0, 0.3], lFore: [-1.6, 0, 0], rArm: [-0.3, 0, -0.8], rFore: [-1, 0, 0], lLeg: [0, 0, 0], lShin: [0.6, 0, 0], rLeg: [-0.3, 0, -0.4], rShin: [0.7, 0, 0] },
  punchR: { hips: [0.15, 0.3, 0], spine: [0.15, 0.55, 0], head: [0, -0.5, 0], lArm: [-0.9, 0, 0.3], lFore: [-1.9, 0, 0], rArm: [-1.55, -0.5, -0.1], rFore: [-0.05, 0, 0], lLeg: [-0.5, 0, 0.1], lShin: [0.7, 0, 0], rLeg: [0.35, 0, 0], rShin: [0.3, 0, 0] },
  punchL: { hips: [0.15, -0.3, 0], spine: [0.15, -0.55, 0], head: [0, 0.5, 0], lArm: [-1.55, 0.5, 0.1], lFore: [-0.05, 0, 0], rArm: [-0.9, 0, -0.3], rFore: [-1.9, 0, 0], lLeg: [0.35, 0, 0], lShin: [0.3, 0, 0], rLeg: [-0.5, 0, -0.1], rShin: [0.7, 0, 0] },
  kick: { hips: [-0.35, 0.6, 0], spine: [-0.1, 0.3, 0], head: [0.2, -0.8, 0], lArm: [-0.6, 0, 0.6], lFore: [-1.4, 0, 0], rArm: [-0.2, 0, -0.9], rFore: [-0.8, 0, 0], lLeg: [0.3, 0, 0.1], lShin: [0.5, 0, 0], rLeg: [-1.75, 0, -0.35], rShin: [0.05, 0, 0] },
  knee: { hips: [0.2, 0, 0], spine: [0.3, 0, 0], head: [-0.2, 0, 0], lArm: [-1.2, 0, 0.2], lFore: [-1.2, 0, 0], rArm: [-1.2, 0, -0.2], rFore: [-1.2, 0, 0], lLeg: [-1.8, 0, 0], lShin: [2.2, 0, 0], rLeg: [0.3, 0, 0], rShin: [0.4, 0, 0] },
  smashA: { hips: [-0.3, 0, 0], spine: [-0.35, 0, 0], head: [0.3, 0, 0], lArm: [-3.0, 0, -0.25], lFore: [-0.6, 0, 0], rArm: [-3.0, 0, 0.25], rFore: [-0.6, 0, 0], lLeg: [-0.8, 0, 0.1], lShin: [1.3, 0, 0], rLeg: [-0.2, 0, -0.1], rShin: [1.0, 0, 0] },
  smashB: { hips: [0.6, 0, 0], spine: [0.5, 0, 0], head: [-0.4, 0, 0], lArm: [-0.8, 0, -0.35], lFore: [-0.1, 0, 0], rArm: [-0.8, 0, 0.35], rFore: [-0.1, 0, 0], lLeg: [0.1, 0, 0.1], lShin: [0.7, 0, 0], rLeg: [0.3, 0, -0.1], rShin: [0.3, 0, 0] },
  blastR: { hips: [0.05, 0.3, 0], spine: [0.05, 0.45, 0], head: [0, -0.45, 0], lArm: [-0.4, 0, 0.3], lFore: [-1.5, 0, 0], rArm: [-1.55, -0.45, 0], rFore: [0, 0, 0], lLeg: [-0.5, 0, 0.1], lShin: [0.9, 0, 0], rLeg: [0.2, 0, 0], rShin: [0.6, 0, 0] },
  blastL: { hips: [0.05, -0.3, 0], spine: [0.05, -0.45, 0], head: [0, 0.45, 0], lArm: [-1.55, 0.45, 0], lFore: [0, 0, 0], rArm: [-0.4, 0, -0.3], rFore: [-1.5, 0, 0], lLeg: [0.2, 0, 0], lShin: [0.6, 0, 0], rLeg: [-0.5, 0, -0.1], rShin: [0.9, 0, 0] },
  charge: { hips: Z, spine: [-0.35, 0, 0], head: [-0.35, 0, 0], lArm: [0.25, 0, 0.6], lFore: [-0.7, 0, 0], rArm: [0.25, 0, -0.6], rFore: [-0.7, 0, 0], lLeg: [-0.15, 0, 0.3], lShin: [0.35, 0, 0], rLeg: [-0.15, 0, -0.3], rShin: [0.35, 0, 0] },
  guard: { hips: [0.1, 0, 0], spine: [0.3, 0, 0], head: [0.25, 0, 0], lArm: [-1.25, 0, -0.25], lFore: [-1.9, 0.5, 0], rArm: [-1.15, 0, 0.25], rFore: [-1.9, -0.5, 0], lLeg: [-1.0, 0, 0.1], lShin: [1.6, 0, 0], rLeg: [-0.6, 0, -0.1], rShin: [1.4, 0, 0] },
  hurt: { hips: [-0.3, 0, 0], spine: [-0.6, 0, 0], head: [-0.5, 0, 0], lArm: [0.4, 0, 1.0], lFore: [-0.4, 0, 0], rArm: [0.4, 0, -1.0], rFore: [-0.4, 0, 0], lLeg: [0.35, 0, 0.1], lShin: [0.6, 0, 0], rLeg: [-0.3, 0, -0.1], rShin: [0.9, 0, 0] },
  tumble: { hips: [-0.6, 0, 0], spine: [-0.4, 0, 0], head: [-0.6, 0, 0], lArm: [-0.2, 0, 1.4], lFore: [-0.2, 0, 0], rArm: [-0.2, 0, -1.4], rFore: [-0.2, 0, 0], lLeg: [-0.4, 0, 0.35], lShin: [0.5, 0, 0], rLeg: [0.3, 0, -0.35], rShin: [0.9, 0, 0] },
  kame: { hips: [0, -0.5, 0], spine: [0.05, -0.8, 0], head: [0, 0.9, 0], lArm: [-0.35, 0, -0.55], lFore: [-1.5, 0, 0], rArm: [0.25, 0, -0.2], rFore: [-1.7, 0, 0], lLeg: [-0.3, 0, 0.35], lShin: [0.6, 0, 0], rLeg: [0.2, 0, -0.3], rShin: [0.4, 0, 0] },
  galick: { hips: [0, 0.5, 0], spine: [-0.1, 0.8, 0], head: [0, -0.9, 0], lArm: [-1.45, 0, 1.2], lFore: [-0.2, 0, 0], rArm: [-1.45, 0, -0.1], rFore: [-0.5, 0, 0], lLeg: [-0.3, 0, 0.35], lShin: [0.6, 0, 0], rLeg: [0.2, 0, -0.3], rShin: [0.4, 0, 0] },
  fire: { hips: Z, spine: [0.1, 0, 0], head: [0, 0, 0], lArm: [-1.5, 0, -0.14], lFore: [-0.05, 0, 0], rArm: [-1.5, 0, 0.14], rFore: [-0.05, 0, 0], lLeg: [-0.5, 0, 0.3], lShin: [0.7, 0, 0], rLeg: [0.45, 0, -0.3], rShin: [0.4, 0, 0] },
  palm: { hips: Z, spine: [-0.2, 0, 0], head: [0.1, 0, 0], lArm: [-1.3, 0, 0.8], lFore: [-0.5, 0, 0], rArm: [-1.3, 0, -0.8], rFore: [-0.5, 0, 0], lLeg: [-0.3, 0, 0.3], lShin: [0.5, 0, 0], rLeg: [0.2, 0, -0.3], rShin: [0.4, 0, 0] },
  raise: { hips: Z, spine: [-0.25, 0, 0], head: [-0.55, 0, 0], lArm: [-3.0, 0, -0.3], lFore: [0, 0, 0], rArm: [-3.0, 0, 0.3], rFore: [0, 0, 0], lLeg: [-0.1, 0, 0.2], lShin: [0.3, 0, 0], rLeg: [-0.1, 0, -0.2], rShin: [0.3, 0, 0] },
  throw: { hips: [0.3, 0, 0], spine: [0.5, 0, 0], head: [-0.2, 0, 0], lArm: [-1.3, 0, -0.2], lFore: [0, 0, 0], rArm: [-1.3, 0, 0.2], rFore: [0, 0, 0], lLeg: [0.2, 0, 0.1], lShin: [0.4, 0, 0], rLeg: [-0.3, 0, -0.1], rShin: [0.8, 0, 0] },
  roar: { hips: [-0.1, 0, 0], spine: [-0.45, 0, 0], head: [-0.6, 0, 0], lArm: [0.1, 0, 1.3], lFore: [-1.4, 0, 0], rArm: [0.1, 0, -1.3], rFore: [-1.4, 0, 0], lLeg: [-0.3, 0, 0.3], lShin: [0.5, 0, 0], rLeg: [-0.3, 0, -0.3], rShin: [0.5, 0, 0] },
  victory: { hips: Z, spine: [-0.05, 0, 0], head: [-0.15, 0, 0], lArm: [0.1, 0, 0.3], lFore: [-0.9, 0, 0], rArm: [-2.9, 0, -0.35], rFore: [-0.2, 0, 0], lLeg: [0, 0, 0.1], lShin: [0.05, 0, 0], rLeg: [0, 0, -0.1], rShin: [0.05, 0, 0] },
  crossed: { hips: Z, spine: [-0.05, 0, 0], head: [-0.2, 0.3, 0], lArm: [-0.55, 0.5, -0.3], lFore: [-1.95, 0.8, 0], rArm: [-0.55, -0.5, 0.3], rFore: [-1.95, -0.8, 0], lLeg: [0, 0, 0.1], lShin: [0.05, 0, 0], rLeg: [0, 0, -0.1], rShin: [0.05, 0, 0] },
  sbc: { hips: Z, spine: [-0.1, 0.3, 0], head: [0.05, -0.3, 0], lArm: [0.1, 0, 0.3], lFore: [-0.6, 0, 0], rArm: [-2.2, 0.3, 0.6], rFore: [-2.3, 0, 0], lLeg: [-0.3, 0, 0.3], lShin: [0.5, 0, 0], rLeg: [0.2, 0, -0.3], rShin: [0.4, 0, 0] },
  point: { hips: [0, 0.3, 0], spine: [0.05, 0.4, 0], head: [0, -0.4, 0], lArm: [0.1, 0, 0.25], lFore: [-0.5, 0, 0], rArm: [-1.55, -0.4, 0], rFore: [0, 0, 0], lLeg: [-0.4, 0, 0.2], lShin: [0.7, 0, 0], rLeg: [0.2, 0, -0.1], rShin: [0.5, 0, 0] },
  apeIdle: { hips: [0.2, 0, 0], spine: [0.3, 0, 0], head: [-0.25, 0, 0], lArm: [-0.25, 0, 0.35], lFore: [-0.5, 0, 0], rArm: [-0.25, 0, -0.35], rFore: [-0.5, 0, 0], lLeg: [-0.45, 0, 0.1], lShin: [0.6, 0, 0], rLeg: [-0.45, 0, -0.1], rShin: [0.6, 0, 0] },
  down: { hips: [-1.45, 0, 0], spine: [0.1, 0, 0], head: [0.3, 0.4, 0], lArm: [0.1, 0, 1.2], lFore: [-0.3, 0, 0], rArm: [0.1, 0, -1.3], rFore: [-0.2, 0, 0], lLeg: [0.1, 0, 0.3], lShin: [0.2, 0, 0], rLeg: [-0.4, 0, -0.2], rShin: [0.9, 0, 0] },
};

export class Rig {
  constructor(model) { this.m = model; this.pose = 'idle'; this.speed = 12; this.t = Math.random() * 10; }
  set(name, speed = 12) { this.pose = name; this.speed = speed; }
  update(dt) {
    this.t += dt; const P = POSES[this.pose] || POSES.idle; const k = 1 - Math.exp(-this.speed * dt);
    for (const j in P) {
      const o = this.m.J[j]; if (!o) continue; const r = P[j];
      o.rotation.x += (r[0] - o.rotation.x) * k; o.rotation.y += (r[1] - o.rotation.y) * k; o.rotation.z += (r[2] - o.rotation.z) * k;
    }
    const b = Math.sin(this.t * 2.2) * 0.03; this.m.J.spine.rotation.x += b * k; this.m.J.head.rotation.x -= b * 0.5 * k;
    if (this.m.J.jaw) this.m.J.jaw.rotation.x = this.pose === 'roar' ? 0.5 : 0.05;
    if (this.m.J.tail && this.m.J.tail.visible) this.m.J.tail.children[0] && (this.m.J.tail.rotation.y = Math.sin(this.t * 1.5) * 0.4);
  }
}

// ---------- Piccolo / Frieza bodies ----------
function buildAlien(hero, J, M, skin, pal, R, root) {
  if (hero === 'piccolo') {
    const gi = M(pal.gi), sash = M(pal.sash), shoe = M(pal.shoe), patch = M(pal.patch), cape = M(pal.cape);
    for (const s of [-1, 1]) part(new THREE.ConeGeometry(0.035, 0.16, 6), skin, J.head, [s * 0.17, 0.03, -0.01], [0, 0, s * -1.25], [1, 1, 0.5]);
    const ant = g('antennae', J.head);
    for (const s of [-1, 1]) { const a = part(limb(0.012, 0.012, 0.16, 6), skin, ant, [s * 0.05, 0.14, 0.1], [2.6, 0, s * -0.3]); part(sph(0.02, 6, 6), skin, a, [0, -0.16, 0]); }
    part(new THREE.CylinderGeometry(0.27, 0.2, 0.58, 16), gi, J.spine, [0, 0.29, 0], [0, 0, 0], [1, 1, 0.62]);
    part(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 16), sash, J.hips, [0, 0.06, 0], [0, 0, 0], [1, 1, 0.72]);
    part(new THREE.BoxGeometry(0.08, 0.3, 0.03), sash, J.hips, [0.05, -0.12, 0.15]);
    part(sph(0.2, 14, 10), gi, J.hips, [0, 0, 0], [0, 0, 0], [1.05, 0.6, 0.7]);
    // turban + cape (weighted clothing)
    const turban = g('turban', J.head); part(new THREE.CylinderGeometry(R * 0.98, R * 0.92, 0.16, 20), cape, turban, [0, 0.12, -0.01]);
    part(new THREE.SphereGeometry(R * 0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), gi, turban, [0, 0.19, -0.01]);
    const capeG = g('cape', J.spine);
    for (const s of [-1, 1]) part(sph(0.17, 14, 10), cape, capeG, [s * 0.3, 0.6, 0], [0, 0, s * 0.3], [1.2, 0.6, 1.1]);
    const cg = new THREE.CylinderGeometry(0.38, 0.62, 1.4, 20, 1, true, Math.PI * 0.55, Math.PI * 0.9); cg.translate(0, -0.7, 0);
    const cm = toon(pal.cape, { side: THREE.DoubleSide }); part(cg, cm, capeG, [0, 0.62, -0.02]);
    J.cape = capeG;
    for (const s of ['l', 'r']) {
      const A = J[s + 'Arm'], F = J[s + 'Fore'];
      part(sph(0.1), skin, A, [0, -0.02, 0], [0, 0, 0], [1.1, 1, 1]);
      part(limb(0.088, 0.072, 0.34), skin, A); part(sph(0.07, 10, 8), patch, A, [0, -0.16, 0.05], [0, 0, 0], [1, 1.4, 0.5], false);
      part(limb(0.074, 0.06, 0.32), skin, F); part(sph(0.06, 10, 8), patch, F, [0, -0.12, 0.05], [0, 0, 0], [1, 1.4, 0.5], false);
      part(limb(0.07, 0.07, 0.08), M(0xc0303a), F, [0, -0.25, 0]);
      J[s + 'Hand'] = part(sph(0.07, 10, 8), skin, F, [0, -0.35, 0.01], [0, 0, 0], [0.9, 1.1, 1]);
      const L = J[s + 'Leg'], S = J[s + 'Shin'];
      part(limb(0.14, 0.12, 0.52), gi, L); part(limb(0.12, 0.08, 0.36), gi, S);
      part(new THREE.BoxGeometry(0.13, 0.12, 0.28), shoe, S, [0, -0.46, 0.05]);
    }
    return (f) => { turban.visible = f.style === 'cape'; capeG.visible = f.style === 'cape'; ant.visible = f.style !== 'cape'; };
  }
  // Frieza
  const gem = M(pal.gem), horn = M(pal.horn), armor = M(pal.armor), pad = M(pal.pad), suit = M(pal.suit);
  gem.emissive = new THREE.Color(0x2a0a40);
  const dome = part(new THREE.SphereGeometry(R * 1.06, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.36), gem, J.head, [0, 0.015, -0.01], [-0.25, 0, 0]);
  const horns1 = g('horns1', J.head), horns2 = g('horns2', J.head);
  for (const s of [-1, 1]) {
    const h1 = part(new THREE.ConeGeometry(0.04, 0.22, 8), horn, horns1, [s * 0.14, 0.08, 0], [0, 0, s * -1.0]); h1.geometry.translate(0, 0.11, 0);
    const h2 = part(new THREE.ConeGeometry(0.05, 0.36, 8), horn, horns2, [s * 0.13, 0.1, -0.02], [0, 0, s * -0.35]); h2.geometry.translate(0, 0.18, 0);
  }
  part(new THREE.CylinderGeometry(0.25, 0.18, 0.58, 16), skin, J.spine, [0, 0.29, 0], [0, 0, 0], [1, 1, 0.62]);
  part(sph(0.18, 14, 10), skin, J.hips, [0, 0, 0], [0, 0, 0], [1.05, 0.6, 0.7]);
  const gems = g('gems', root);
  const chestGem = part(sph(0.1, 14, 10), gem, J.spine, [0, 0.42, 0.1], [0, 0, 0], [1.6, 1, 0.5]);
  const armorG = g('armor', J.spine);
  part(new THREE.CylinderGeometry(0.29, 0.22, 0.42, 16), armor, armorG, [0, 0.36, 0], [0, 0, 0], [1, 1, 0.7]);
  for (const s of [-1, 1]) part(new THREE.SphereGeometry(0.17, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), pad, armorG, [s * 0.32, 0.56, 0], [0, 0, s * -0.4], [1.2, 0.7, 1]);
  const shorts = part(sph(0.21, 14, 10), suit, J.hips, [0, -0.02, 0], [0, 0, 0], [1.05, 0.55, 0.72]);
  const gemParts = [chestGem];
  for (const s of ['l', 'r']) {
    const A = J[s + 'Arm'], F = J[s + 'Fore'];
    gemParts.push(part(sph(0.1), gem, A, [0, -0.02, 0], [0, 0, 0], [1.2, 1, 1.1]));
    part(limb(0.08, 0.065, 0.34), skin, A);
    part(limb(0.066, 0.055, 0.32), skin, F); gemParts.push(part(sph(0.05, 10, 8), gem, F, [0, -0.12, 0.05], [0, 0, 0], [1, 1.5, 0.6], false));
    J[s + 'Hand'] = part(sph(0.065, 10, 8), skin, F, [0, -0.34, 0.01], [0, 0, 0], [0.9, 1.1, 1]);
    const L = J[s + 'Leg'], S = J[s + 'Shin'];
    part(limb(0.11, 0.085, 0.52), skin, L); part(limb(0.085, 0.06, 0.4), skin, S);
    gemParts.push(part(sph(0.06, 10, 8), gem, S, [0, -0.1, 0.06], [0, 0, 0], [1, 1.5, 0.6], false));
    part(new THREE.BoxGeometry(0.1, 0.07, 0.24), skin, S, [0, -0.46, 0.06]);
  }
  // tail
  const tail = g('ftail', J.hips); tail.position.set(0, -0.05, -0.15); let prev = tail;
  for (let i = 0; i < 7; i++) { const seg = g('ft' + i, prev, i ? [0, -0.17, 0] : [0, 0, 0]); seg.rotation.x = i ? 0.28 : 2.3; part(limb(0.07 - i * 0.007, 0.06 - i * 0.007, 0.18), i === 6 ? gem : skin, seg); prev = seg; }
  return (f) => {
    const st = f.style;
    horns1.visible = st === 'first'; horns2.visible = st === 'second'; armorG.visible = st === 'first';
    dome.scale.setScalar(st === 'second' ? 1.12 : 1); gemParts.forEach((m) => { m.visible = st === 'final' || st === 'full'; });
    shorts.visible = st === 'first';
    root.scale.setScalar(st === 'second' ? 1.28 : 1);
    const bulk = st === 'full' ? 1.2 : st === 'second' ? 1.12 : 1;
    for (const s of ['l', 'r']) { J[s + 'Arm'].scale.set(bulk, 1, bulk); J[s + 'Leg'].scale.set(bulk, 1, bulk); }
    J.spine.scale.set(bulk, 1, bulk);
  };
}
