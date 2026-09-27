// Particles, ki orbs, beams, shockwaves, impact flashes.
import * as THREE from 'three';

function radialTex(stops) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(([o, col]) => g.addColorStop(o, col));
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}
export const GLOW = radialTex([[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(255,255,255,0.8)'], [1, 'rgba(255,255,255,0)']]);
const STAR = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.translate(128, 128);
  x.fillStyle = '#fff';
  for (let i = 0; i < 12; i++) { x.rotate(Math.PI / 6); const L = i % 2 ? 70 : 125; x.beginPath(); x.moveTo(-6, 0); x.lineTo(0, -L); x.lineTo(6, 0); x.fill(); }
  const g = x.createRadialGradient(0, 0, 0, 0, 0, 60); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(-128, -128, 256, 256);
  return new THREE.CanvasTexture(c);
})();

class Pool {
  constructor(scene, max, additive) {
    this.max = max; this.n = 0;
    this.pos = new Float32Array(max * 3); this.col = new Float32Array(max * 3); this.size = new Float32Array(max); this.alpha = new Float32Array(max);
    this.vel = new Float32Array(max * 3); this.life = new Float32Array(max); this.maxLife = new Float32Array(max); this.s0 = new Float32Array(max); this.s1 = new Float32Array(max); this.grav = new Float32Array(max); this.drag = new Float32Array(max);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(this.size, 1)); geo.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: GLOW }, scale: { value: window.innerHeight } },
      vertexShader: `attribute float size; attribute float alpha; attribute vec3 color; varying vec3 vC; varying float vA; uniform float scale;
        void main(){ vC = color; vA = alpha; vec4 mv = modelViewMatrix*vec4(position,1.); gl_PointSize = size * scale / -mv.z; gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform sampler2D map; varying vec3 vC; varying float vA; void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC, t.a*vA); }`,
      transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(geo, mat); this.points.frustumCulled = false; this.mat = mat; scene.add(this.points);
  }
  emit(p, v, color, s0, s1, life, grav = 0, drag = 1) {
    if (this.n >= this.max) return; const i = this.n++;
    this.pos.set([p.x, p.y, p.z], i * 3); this.vel.set([v.x, v.y, v.z], i * 3); this.col.set([color.r, color.g, color.b], i * 3);
    this.s0[i] = s0; this.s1[i] = s1; this.life[i] = this.maxLife[i] = life; this.grav[i] = grav; this.drag[i] = drag;
  }
  update(dt) {
    for (let i = 0; i < this.n; i++) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) { // swap-remove
        const j = --this.n;
        for (const a of [this.pos, this.vel, this.col]) { a[i * 3] = a[j * 3]; a[i * 3 + 1] = a[j * 3 + 1]; a[i * 3 + 2] = a[j * 3 + 2]; }
        for (const a of [this.life, this.maxLife, this.s0, this.s1, this.grav, this.drag]) a[i] = a[j];
        i--; continue;
      }
      const k = Math.pow(this.drag[i], dt * 60);
      this.vel[i * 3] *= k; this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * k - this.grav[i] * dt; this.vel[i * 3 + 2] *= k;
      this.pos[i * 3] += this.vel[i * 3] * dt; this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt; this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      const t = 1 - this.life[i] / this.maxLife[i];
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t; this.alpha[i] = Math.min(1, (1 - t) * 2);
    }
    const g = this.points.geometry; g.setDrawRange(0, this.n);
    for (const k of ['position', 'color', 'size', 'alpha']) g.attributes[k].needsUpdate = true;
    this.mat.uniforms.scale.value = window.innerHeight;
  }
}

const V = new THREE.Vector3(), C = new THREE.Color();
const rnd = (s) => V.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(s * (0.3 + Math.random() * 0.7));

export class FX {
  constructor(scene) {
    this.scene = scene; this.glow = new Pool(scene, 5000, true); this.smoke = new Pool(scene, 2500, false); this.items = [];
  }
  burst(p, color, n = 20, speed = 10, size = 0.5, life = 0.5) {
    C.set(color); for (let i = 0; i < n; i++) this.glow.emit(p, rnd(speed), C, size, 0, life * (0.6 + Math.random() * 0.6), 0, 0.93);
  }
  sparks(p, color, n = 14, speed = 22) {
    C.set(color); for (let i = 0; i < n; i++) this.glow.emit(p, rnd(speed), C, 0.25, 0.05, 0.35, 10, 0.9);
  }
  dust(p, n = 20, spread = 3, color = 0xd9b48a) {
    for (let i = 0; i < n; i++) {
      C.set(color).offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
      const v = rnd(spread * 2.5); v.y = Math.abs(v.y) * 0.8 + 1;
      const q = p.clone().add(new THREE.Vector3((Math.random() - .5) * spread, Math.random() * spread * 0.3, (Math.random() - .5) * spread));
      this.smoke.emit(q, v, C, spread * 0.5, spread * 1.4, 1.2 + Math.random() * 1.2, -0.5, 0.96);
    }
  }
  trail(p, color, size = 0.6, life = 0.25) { C.set(color); this.glow.emit(p, rnd(0.8), C, size, 0, life, 0, 1); }
  auraMotes(p, color, r = 0.8) {
    C.set(color); const q = p.clone().add(new THREE.Vector3((Math.random() - .5) * r * 2, Math.random() * 0.5, (Math.random() - .5) * r * 2));
    this.glow.emit(q, V.set(0, 4 + Math.random() * 4, 0), C, 0.25, 0.02, 0.6, 0, 1);
  }
  flash(p, color = 0xffffff, size = 3, life = 0.18) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: STAR, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, depthTest: false }));
    s.position.copy(p); s.material.rotation = Math.random() * 6; this.scene.add(s);
    this.items.push({ o: s, t: 0, life, upd: (k) => { s.scale.setScalar(size * (0.5 + k)); s.material.opacity = 1 - k; } });
  }
  shockwave(p, color = 0xffffff, size = 8, life = 0.5, flat = true) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.7, 1, 48), new THREE.MeshBasicMaterial({ color, transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
    m.position.copy(p); if (flat) m.rotation.x = -Math.PI / 2; else m.lookAt(this.cam.position); this.scene.add(m);
    this.items.push({ o: m, t: 0, life, upd: (k) => { m.scale.setScalar(0.5 + size * Math.sqrt(k)); m.material.opacity = (1 - k) * 0.9; } });
  }
  explosion(p, color, size = 6, life = 0.7) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    const core = new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.add(core); core.scale.setScalar(0.7); m.position.copy(p); this.scene.add(m);
    this.items.push({ o: m, t: 0, life, upd: (k) => { m.scale.setScalar(size * (0.3 + Math.sqrt(k))); m.material.opacity = (1 - k) * 0.8; core.material.opacity = Math.max(0, 1 - k * 2); } });
    this.burst(p, color, 60, size * 5, size * 0.2, 0.8); this.dust(p, 12, Math.min(size * 0.6, 6), 0xd8b894);
    this.shockwave(p, color, size * 2.2, life * 0.8, true);
  }
  // Speed-line burst from a point (anime impact lines)
  lines(p, color = 0xffffff, n = 10, len = 6) {
    const pts = []; for (let i = 0; i < n; i++) { const d = rnd(1).normalize(); pts.push(d.clone().multiplyScalar(0.6), d.multiplyScalar(len * (0.6 + Math.random() * 0.6))); }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const l = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    l.position.copy(p); this.scene.add(l);
    this.items.push({ o: l, t: 0, life: 0.2, upd: (k) => { l.scale.setScalar(0.6 + k); l.material.opacity = 1 - k; } });
  }
  orb(color, size) {
    const grp = new THREE.Group();
    const core = new THREE.Mesh(new THREE.SphereGeometry(size * 0.55, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    glow.scale.setScalar(size * 3.2); grp.add(core, glow); this.scene.add(grp); return grp;
  }
  beam(color, width) {
    const grp = new THREE.Group();
    const geo = new THREE.CylinderGeometry(1, 1, 1, 24, 1, true); geo.translate(0, 0.5, 0); geo.rotateX(Math.PI / 2); // along +Z, length 1
    const outer = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(color) }, time: { value: 0 }, op: { value: 1 } },
      vertexShader: `varying vec3 vN; varying vec2 vU; void main(){ vU = uv; vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 color; uniform float time, op; varying vec3 vN; varying vec2 vU;
        void main(){ float f = abs(vN.z); float s = 0.75 + 0.25*sin(vU.y*80.0 - time*40.0 + vU.x*12.0);
          vec3 c = mix(color, vec3(1.), pow(f, 3.0)); gl_FragColor = vec4(c*1.4, (0.25 + f*0.75)*s*op); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }));
    const inner = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
    inner.scale.set(0.45, 0.45, 1);
    const head = this.orb(color, width * 1.6); this.scene.remove(head);
    const base = this.orb(color, width * 1.2); this.scene.remove(base);
    grp.add(outer, inner, head, base); this.scene.add(grp);
    return { grp, outer, inner, head, width, set(from, to, t) {
      grp.position.copy(from); grp.lookAt(to); const L = from.distanceTo(to);
      const w = width * (1 + 0.08 * Math.sin(t * 50)); outer.scale.set(w, w, L); inner.scale.set(w * 0.45, w * 0.45, L);
      head.position.set(0, 0, L); head.scale.setScalar(1 + 0.15 * Math.sin(t * 37)); outer.material.uniforms.time.value = t;
    } };
  }
  add(o, life, upd) { this.scene.add(o); this.items.push({ o, t: 0, life, upd }); }
  update(dt) {
    this.glow.update(dt); this.smoke.update(dt);
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i]; it.t += dt; const k = Math.min(1, it.t / it.life); it.upd(k, dt);
      if (k >= 1) { this.scene.remove(it.o); it.o.traverse?.((o) => { if (!o.isSprite) o.geometry?.dispose(); }); this.items.splice(i, 1); }
    }
  }
}
