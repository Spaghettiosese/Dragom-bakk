// Canyon wasteland arena with deformable terrain and destructible rock pillars.
import * as THREE from 'three';
import { toon } from './models.js';

const hash = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x, z) => vnoise(x, z) * 0.5 + vnoise(x * 2.1, z * 2.1) * 0.25 + vnoise(x * 4.3, z * 4.3) * 0.125;
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export const ARENA_R = 140;
const SIZE = 520, N = 260, CELL = SIZE / N;

export class Arena {
  constructor(scene) {
    this.scene = scene; this.pillars = []; this.debris = [];
    this.buildSky(); this.buildTerrain(); this.buildMesas(); this.buildProps();
  }
  baseHeight(x, z) {
    const d = Math.hypot(x, z);
    let h = Math.sin(x * 0.045 + Math.sin(z * 0.03) * 2) * 1.2 + fbm(x * 0.03, z * 0.03) * 5 - 2;
    const cd = Math.hypot(x - 8, z - 30);
    if (cd < 22) h -= 6 * (1 - (cd / 22) ** 2);
    h += 2.2 * Math.exp(-(((cd - 22) / 4) ** 2));
    const wall = sstep(ARENA_R + 10, ARENA_R + 90, d);
    h += wall * (38 + fbm(x * 0.02, z * 0.02) * 30);
    return h;
  }
  buildTerrain() {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, N, N); geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position; this.H = new Float32Array(p.count);
    const col = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) { const h = this.baseHeight(p.getX(i), p.getZ(i)); this.H[i] = h; p.setY(i, h); }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.geo = geo; this.scorch = new Float32Array(p.count);
    this.recolor(0, 0, SIZE); this.renorm(0, 0, SIZE);
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.ground = new THREE.Mesh(geo, mat); this.ground.receiveShadow = true; this.scene.add(this.ground);
  }
  idx(ix, iz) { return iz * (N + 1) + ix; }
  eachIn(x, z, r, fn) {
    const x0 = Math.max(0, Math.floor((x - r + SIZE / 2) / CELL)), x1 = Math.min(N, Math.ceil((x + r + SIZE / 2) / CELL));
    const z0 = Math.max(0, Math.floor((z - r + SIZE / 2) / CELL)), z1 = Math.min(N, Math.ceil((z + r + SIZE / 2) / CELL));
    for (let iz = z0; iz <= z1; iz++) for (let ix = x0; ix <= x1; ix++) fn(this.idx(ix, iz), ix * CELL - SIZE / 2, iz * CELL - SIZE / 2, ix, iz);
  }
  recolor(x, z, r) {
    const c = this.geo.attributes.color, tmp = new THREE.Color();
    const sand = new THREE.Color(0xe9b273), light = new THREE.Color(0xf7d49a), dark = new THREE.Color(0xc07a45), rock = new THREE.Color(0xb65a34), rock2 = new THREE.Color(0xd9884e), grass = new THREE.Color(0x7aa84c), burn = new THREE.Color(0x4a2a1a);
    this.eachIn(x, z, r, (i, px, pz) => {
      const h = this.H[i], n = fbm(px * 0.08, pz * 0.08);
      tmp.copy(sand).lerp(light, sstep(-1, 3, h) * 0.6 + n * 0.25).lerp(dark, sstep(-1, -6, h) * 0.6);
      if (h > 8) { const band = Math.sin(h * 0.9 + n * 2) > 0.2 ? rock : rock2; tmp.lerp(band, sstep(8, 14, h)); }
      if (h > 60) tmp.lerp(grass, sstep(60, 66, h) * 0.8);
      tmp.lerp(burn, Math.min(0.85, this.scorch[i]));
      c.setXYZ(i, tmp.r, tmp.g, tmp.b);
    });
    c.needsUpdate = true;
  }
  renorm(x, z, r) {
    const nrm = this.geo.attributes.normal, v = new THREE.Vector3();
    this.eachIn(x, z, r, (i, px, pz, ix, iz) => {
      const hl = this.H[this.idx(Math.max(0, ix - 1), iz)], hr = this.H[this.idx(Math.min(N, ix + 1), iz)];
      const hd = this.H[this.idx(ix, Math.max(0, iz - 1))], hu = this.H[this.idx(ix, Math.min(N, iz + 1))];
      v.set(hl - hr, 2 * CELL, hd - hu).normalize(); nrm.setXYZ(i, v.x, v.y, v.z);
    });
    nrm.needsUpdate = true;
  }
  height(x, z) {
    const gx = (x + SIZE / 2) / CELL, gz = (z + SIZE / 2) / CELL;
    const ix = Math.min(N - 1, Math.max(0, Math.floor(gx))), iz = Math.min(N - 1, Math.max(0, Math.floor(gz)));
    const fx = Math.min(1, Math.max(0, gx - ix)), fz = Math.min(1, Math.max(0, gz - iz));
    const a = this.H[this.idx(ix, iz)], b = this.H[this.idx(ix + 1, iz)], c = this.H[this.idx(ix, iz + 1)], d = this.H[this.idx(ix + 1, iz + 1)];
    return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz;
  }
  // Real terrain deformation: bowl + raised rim + scorch.
  crater(x, z, r, depth) {
    const p = this.geo.attributes.position;
    this.eachIn(x, z, r * 1.6, (i, px, pz) => {
      const d = Math.hypot(px - x, pz - z) / r;
      let dh = 0;
      if (d < 1) dh = -depth * (1 - d * d); else if (d < 1.6) dh = depth * 0.35 * Math.sin((d - 1) / 0.6 * Math.PI);
      this.H[i] += dh; p.setY(i, this.H[i]);
      if (d < 1.2) this.scorch[i] = Math.min(1, this.scorch[i] + 0.5 * (1.2 - d));
    });
    p.needsUpdate = true; this.recolor(x, z, r * 1.7); this.renorm(x, z, r * 1.7);
    this.geo.computeBoundingSphere();
  }
  buildSky() {
    const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { sun: { value: new THREE.Vector3(0.5, 0.35, -0.8).normalize() } },
      vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform vec3 sun; varying vec3 vD; void main(){ float y = max(vD.y, 0.0);
        vec3 col = mix(vec3(0.97,0.8,0.62), vec3(0.22,0.45,0.85), pow(y, 0.5));
        col = mix(col, vec3(0.93,0.72,0.55), smoothstep(0.0, -0.2, vD.y));
        float s = max(dot(vD, sun), 0.0); col += vec3(1.0,0.85,0.6) * (pow(s, 12.0)*0.35 + pow(s, 400.0)*2.0);
        gl_FragColor = vec4(col, 1.0); }`,
    }));
    this.scene.add(sky); this.sky = sky;
    const tex = (() => {
      const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d');
      for (let i = 0; i < 26; i++) {
        const cx = 40 + Math.random() * 176, cy = 64 + (Math.random() - 0.5) * 30, r = 18 + Math.random() * 26;
        const gr = x.createRadialGradient(cx, cy, 0, cx, cy, r); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr; x.fillRect(0, 0, 256, 128);
      }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    this.clouds = [];
    for (let i = 0; i < 14; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.75, depthWrite: false, fog: false }));
      const a = Math.random() * Math.PI * 2, d = 380 + Math.random() * 300;
      s.position.set(Math.cos(a) * d, 110 + Math.random() * 120, Math.sin(a) * d); s.scale.set(260, 90, 1);
      this.scene.add(s); this.clouds.push(s);
    }
  }
  rockGeo(r, h, seed, stratify = true) {
    const pts = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector2(r * (1 - t * 0.25) * (1 + (i % 3 === 0 ? 0.06 : 0)), t * h)); }
    pts.push(new THREE.Vector2(r * 0.6, h + 0.3), new THREE.Vector2(0, h + 0.4));
    const geo = new THREE.LatheGeometry(pts, 18);
    const p = geo.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
    const A = new THREE.Color(0xb8552f), B = new THREE.Color(0xd98a55), C = new THREE.Color(0x9c4428), G = new THREE.Color(0x76a64a);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(z, x);
      const n = 1 + (vnoise(a * 3 + seed, y * 0.15) - 0.5) * 0.45 + (vnoise(a * 9 + seed, y * 0.6) - 0.5) * 0.15;
      if (y < h) { p.setX(i, x * n); p.setZ(i, z * n); }
      const band = Math.floor(y * 0.55 + vnoise(a * 2, seed) * 1.5) % 3;
      c.copy(stratify ? [A, B, C][band] : B); if (y >= h - 0.1) c.copy(G);
      col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
    return geo;
  }
  buildMesas() {
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }); this.rockMat = mat;
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + Math.random() * 0.2, d = ARENA_R + 30 + Math.random() * 120;
      const x = Math.cos(a) * d, z = Math.sin(a) * d, r = 14 + Math.random() * 22, h = 40 + Math.random() * 50;
      const m = new THREE.Mesh(this.rockGeo(r, h, i * 7.1), mat); m.position.set(x, this.baseHeight(x, z) - 4, z);
      m.castShadow = true; m.receiveShadow = true; this.scene.add(m);
    }
    // destructible pillars inside arena
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * Math.PI * 2, d = 35 + Math.random() * (ARENA_R - 45);
      const x = Math.cos(a) * d, z = Math.sin(a) * d, r = 3 + Math.random() * 4, h = 10 + Math.random() * 18;
      const m = new THREE.Mesh(this.rockGeo(r, h, i * 3.3 + 50), mat); m.position.set(x, this.height(x, z) - 1.5, z);
      m.castShadow = true; m.receiveShadow = true; this.scene.add(m);
      this.pillars.push({ mesh: m, x, z, r, h, hp: 1, alive: true });
    }
  }
  buildProps() {
    const bush = toon(0x5f9a3e), bush2 = toon(0x7ab24c);
    const geo = new THREE.IcosahedronGeometry(1, 1);
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * Math.PI * 2, d = 20 + Math.random() * 200, x = Math.cos(a) * d, z = Math.sin(a) * d;
      const grp = new THREE.Group();
      for (let k = 0; k < 3; k++) { const m = new THREE.Mesh(geo, k ? bush : bush2); m.position.set((Math.random() - .5) * 1.6, 0.5 + Math.random() * 0.6, (Math.random() - .5) * 1.6); m.scale.setScalar(0.35 + Math.random() * 0.35); m.castShadow = true; grp.add(m); }
      grp.position.set(x, this.height(x, z), z); this.scene.add(grp);
    }
  }
  // Break any pillars near a point. Returns list of broken pillar positions.
  smash(pos, radius, fx) {
    const out = [];
    for (const p of this.pillars) {
      if (!p.alive) continue;
      const dx = pos.x - p.x, dz = pos.z - p.z;
      if (Math.hypot(dx, dz) < p.r + radius && pos.y < p.mesh.position.y + p.h + radius) {
        p.alive = false; this.scene.remove(p.mesh); out.push(p);
        const geo = new THREE.DodecahedronGeometry(1, 0);
        for (let i = 0; i < 22; i++) {
          const m = new THREE.Mesh(geo, this.rockMat.clone()); m.material.vertexColors = false; m.material.color.set([0xb8552f, 0xd98a55, 0x9c4428][i % 3]);
          const s = p.r * (0.25 + Math.random() * 0.35); m.scale.set(s, s * (0.6 + Math.random()), s);
          m.position.set(p.x + (Math.random() - .5) * p.r, p.mesh.position.y + Math.random() * p.h, p.z + (Math.random() - .5) * p.r);
          m.castShadow = true; this.scene.add(m);
          const v = new THREE.Vector3(m.position.x - pos.x, 4 + Math.random() * 10, m.position.z - pos.z).normalize().multiplyScalar(10 + Math.random() * 18);
          this.debris.push({ m, v, spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(6), life: 7 });
        }
        fx && fx.dust(new THREE.Vector3(p.x, p.mesh.position.y + p.h * 0.4, p.z), 40, p.r * 1.6);
      }
    }
    return out;
  }
  update(dt) {
    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i]; d.life -= dt; d.v.y -= 25 * dt;
      d.m.position.addScaledVector(d.v, dt); d.m.rotation.x += d.spin.x * dt; d.m.rotation.y += d.spin.y * dt;
      const gh = this.height(d.m.position.x, d.m.position.z);
      if (d.m.position.y < gh) { d.m.position.y = gh; d.v.multiplyScalar(0.4); d.v.y = Math.abs(d.v.y) * 0.3; d.spin.multiplyScalar(0.5); }
      if (d.life < 1) d.m.position.y -= dt * 2;
      if (d.life <= 0) { this.scene.remove(d.m); this.debris.splice(i, 1); }
    }
    for (const c of this.clouds) { c.position.x += dt * 2; if (c.position.x > 700) c.position.x = -700; }
  }
}
