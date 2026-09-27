import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ROSTER, SUPERS, BARKS, introFor, pick } from './data.js';
import { buildFighter, buildApe, Rig } from './models.js';
import { Arena, ARENA_R } from './arena.js';
import { FX, GLOW } from './fx.js';
import { portraitURL } from './portraits.js';
import { initAudio, sfx } from './audio.js';

const SS = { getItem: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } }, setItem: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} }, removeItem: (k) => { try { sessionStorage.removeItem(k); } catch {} } };
const $ = (id) => document.getElementById(id);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const rand = (a, b) => a + Math.random() * (b - a);
const flatDir = (a, b) => { const d = V3(b.x - a.x, 0, b.z - a.z); return d.lengthSq() < 1e-6 ? V3(0, 0, 1) : d.normalize(); };
const angLerp = (a, b, k) => { let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI; if (d < -Math.PI) d += Math.PI * 2; return a + d * k; };

// ---------------- renderer ----------------
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
$('game').appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xf0cfa4, 180, 720);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 2500);
scene.add(new THREE.HemisphereLight(0xcfe3ff, 0xd8955a, 1.25));
const sun = new THREE.DirectionalLight(0xfff0d8, 2.6); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50, near: 1, far: 400 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; scene.add(sun, sun.target);
const SUN_DIR = V3(0.5, 0.75, -0.6).normalize();
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.5, 0.45, 0.93); composer.addPass(bloom);
composer.addPass(new OutputPass());
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); });

const arena = new Arena(scene);
const fx = new FX(scene); fx.cam = camera; window.CAM = camera;

// ---------------- game state ----------------
const G = window.G = { state: 'title', time: 0, fighters: [], proj: [], hitstop: 0, timeScale: 1, shake: 0, cine: null, clash: null, freeze: null, diff: 1, combo: 0, comboT: 0, moon: null, dlgT: 0, intro: null };

// ---------------- input ----------------
const keys = new Set(), pressed = new Set();
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase(); if (!keys.has(k)) pressed.add(k); keys.add(k);
  if ([' ', 'arrowup', 'arrowdown'].includes(k)) e.preventDefault();
  if (k === 'escape') togglePause();
});
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());
addEventListener('mousedown', (e) => { if (G.state === 'fight') pressed.add(e.button === 2 ? 'k' : 'j'); });
addEventListener('contextmenu', (e) => e.preventDefault());

const blankIntent = () => ({ fwd: 0, side: 0, up: 0, boost: false, melee: false, blast: false, guard: false, charge: false, vanish: false, super: -1, transform: false, revert: false, recover: false, mash: false });

// ---------------- UI helpers ----------------
function say(f, text, dur = 3, expr = 'shout') {
  if (!f) return;
  $('dlg').classList.remove('hidden'); $('dlgName').textContent = f.def.name; $('dlgText').textContent = text;
  $('dlgPic').src = portraitURL(f.hero, f.isApe ? { ape: true } : f.form, f.def.look, expr === 'shout' ? 'angry' : expr);
  G.dlgT = dur; f.exprT = Math.min(dur, 1.6); f.m.setExpression(expr);
}
function bark(f, key, chance = 1) { const b = BARKS[f.hero][key]; if (b && Math.random() < chance) say(f, pick(b), 2.8); }
function banner(t) { const b = $('banner'); b.textContent = t; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }
function superName(t, c) { const b = $('superName'); b.textContent = t; b.style.setProperty('--c', '#' + new THREE.Color(c).getHexString()); b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }
function flash(a = 0.7) { $('flash').style.transition = 'none'; $('flash').style.opacity = a; requestAnimationFrame(() => { $('flash').style.transition = 'opacity .35s'; $('flash').style.opacity = 0; }); }
function dmgNum(p, txt, cls = '') {
  const v = p.clone().project(camera); if (v.z > 1) return;
  const d = document.createElement('div'); d.className = 'dmg ' + cls; d.textContent = txt;
  d.style.left = ((v.x + 1) / 2 * innerWidth + rand(-20, 20)) + 'px'; d.style.top = ((1 - v.y) / 2 * innerHeight - 30) + 'px';
  $('dmgLayer').appendChild(d); setTimeout(() => d.remove(), 900);
}
const shake = (a) => { G.shake = Math.max(G.shake, a); };
const hitstop = (t) => { G.hitstop = Math.max(G.hitstop, t); };

// ---------------- melee tables ----------------
const STEPS = [
  { pose: 'punchR', dur: 0.24, at: 0.45, dmg: 210 },
  { pose: 'punchL', dur: 0.24, at: 0.45, dmg: 210 },
  { pose: 'kick', dur: 0.3, at: 0.45, dmg: 270 },
  { pose: 'knee', dur: 0.28, at: 0.45, dmg: 250 },
  { pose: 'smashA', pose2: 'smashB', dur: 0.5, at: 0.6, dmg: 480, knock: true },
];
const APE_STEPS = [
  { pose: 'punchR', dur: 0.45, at: 0.5, dmg: 480 },
  { pose: 'punchL', dur: 0.45, at: 0.5, dmg: 480 },
  { pose: 'smashA', pose2: 'smashB', dur: 0.75, at: 0.62, dmg: 900, knock: true },
];
const BLAST_COL = { goku: 0xfff08a, vegeta: 0xd9a0ff, piccolo: 0xfff27a, frieza: 0xff6ad8 };

// ---------------- Fighter ----------------
class Fighter {
  constructor(def, isPlayer) {
    this.def = def; this.hero = def.hero; this.isPlayer = isPlayer;
    this.formIdx = 0; this.form = def.forms[0];
    this.human = buildFighter(def, this.form); this.rigH = new Rig(this.human);
    this.m = this.human; this.rig = this.rigH; this.ape = null;
    this.obj = new THREE.Group(); this.obj.add(this.human.root); scene.add(this.obj);
    this.pos = this.obj.position; this.vel = V3();
    this.maxHp = 10000; this.hp = this.maxHp; this.ki = 40; this.stun = 0; this.lastHitT = -9;
    this.act = null; this.inv = 0; this.guardT = -9; this.blastCd = 0; this.hand = 0; this.poseO = null;
    this.powBonus = 1; this.zenkai = false; this.apeT = 0; this.tailCut = false; this.exprT = 0; this.auraS = 0;
    this.intent = blankIntent(); this.ai = isPlayer ? null : { t: 0, plan: null, planT: 0, react: 0, hold: null, holdT: 0 };
  }
  get foe() { return G.fighters[this.isPlayer ? 1 : 0]; }
  get isApe() { return this.m.ape; }
  get S() { return this.obj.scale.x; }
  get hitR() { return this.isApe ? 4.2 : 0.75; }
  get reach() { return this.isApe ? 6 : 1.6; }
  get pow() { return this.form.pow * this.powBonus; }
  get supers() { return this.isApe ? this.def.apeSupers : this.def.supers; }
  center(v = V3()) { return v.set(this.pos.x, this.pos.y + 1.15 * this.S, this.pos.z); }
  fwd() { return V3(Math.sin(this.obj.rotation.y), 0, Math.cos(this.obj.rotation.y)); }
  ground() { return arena.height(this.pos.x, this.pos.z); }
  handPos(v = V3()) {
    if (this.isApe) { this.m.J.jaw.getWorldPosition(v); return v.addScaledVector(this.fwd(), 2); }
    const a = V3(), b = V3(); this.m.J.lHand.getWorldPosition(a); this.m.J.rHand.getWorldPosition(b);
    if (this.act?.S?.firePose === 'point') return v.copy(b).addScaledVector(this.fwd(), 0.15);
    return v.addVectors(a, b).multiplyScalar(0.5);
  }
  pose(name, sp) { this.rig.set(name, sp); }
  endAct() { if (this.act?.cleanup) this.act.cleanup(); this.act = null; this.m.root.rotation.set(0, 0, 0); this.obj.visible = true; }

  setForm(i, silent) {
    const f = this.def.forms[i]; if (!f || f.ape) return;
    this.formIdx = i; this.form = f; this.human.setForm(f);
    if (!silent) { fx.burst(this.center(), f.aura, 80, 20, 0.7, 0.8); fx.shockwave(this.center(), f.aura, 10, 0.6, false); }
  }
  // ---------- per-frame ----------
  update(dt) {
    const foe = this.foe;
    this.inv -= dt; this.blastCd -= dt; if (this.poseO) { this.poseO.t -= dt; if (this.poseO.t <= 0) this.poseO = null; }
    if (this.exprT > 0) { this.exprT -= dt; if (this.exprT <= 0) this.m.setExpression('neutral'); }
    const fighting = G.state === 'fight';
    if (fighting) {
      this.ki = Math.min(100, this.ki + dt * (this.act?.type === 'charge' ? 32 : 2.2));
      if (G.time - this.lastHitT > 2) this.stun = Math.max(0, this.stun - 14 * dt);
      if (this.form.drain) { this.hp -= this.form.drain * dt; if (this.hp < this.maxHp * 0.12) { this.hp = Math.max(this.hp, 1); this.setForm(0); say(this, this.hero === 'frieza' ? 'Ngh... I can\'t... sustain full power...' : 'Argh... my body can\'t take the Kaio-ken anymore!', 2.5, 'hurt'); } }
      if (this.isApe) { this.apeT -= dt; if (this.apeT <= 0 && !this.act) this.revertApe('timeout'); }
    }
    if (this.act) { this.act.t += dt; this.run(this.act, dt, foe); }
    if (!this.act) this.free(dt, foe);
    // physics (knock handles its own)
    if (this.act?.type !== 'knock') {
      if (this.isApe) this.vel.y -= 45 * dt;
      this.pos.addScaledVector(this.vel, dt);
    }
    const gh = this.ground();
    if (this.pos.y < gh) { this.pos.y = gh; if (this.vel.y < 0) this.vel.y = 0; }
    this.pos.y = Math.min(this.pos.y, 110);
    const r = Math.hypot(this.pos.x, this.pos.z); if (r > ARENA_R) { this.pos.x *= ARENA_R / r; this.pos.z *= ARENA_R / r; }
    // facing
    if (this.act?.type !== 'knock' && this.act?.type !== 'down' && this.act?.type !== 'ko' && foe) {
      const d = flatDir(this.pos, foe.pos); this.obj.rotation.y = angLerp(this.obj.rotation.y, Math.atan2(d.x, d.z), Math.min(1, 12 * dt));
    }
    // aura
    const want = this.act?.type === 'charge' || this.act?.type === 'transform' || (this.act?.type === 'super' && this.act.phase === 'charge') ? 1.1
      : this.isApe ? 0.2 : this.formIdx > 0 ? 0.55 : (this.intent.boost && !this.act ? 0.35 : 0);
    this.auraS += (want - this.auraS) * Math.min(1, dt * 6);
    const au = this.m.aura.material.uniforms; au.strength.value = this.auraS; au.time.value = G.time;
    this.m.aura.visible = this.auraS > 0.02;
    if (this.auraS > 0.3 && Math.random() < this.auraS * 0.8) fx.auraMotes(this.pos.clone().setY(this.pos.y + 0.2 * this.S), this.isApe ? 0xff4040 : this.form.aura, 0.8 * this.S);
    if (this.form.spiky && Math.random() < 0.08) this.spark();
    this.rig.update(dt);
  }
  spark() { // SSJ lightning
    const c = this.center(), pts = []; let p = c.clone().add(V3(rand(-.6, .6), rand(-1, 1), rand(-.6, .6)));
    for (let i = 0; i < 5; i++) { pts.push(p.clone()); p = p.clone().add(V3(rand(-.35, .35), rand(-.35, .35), rand(-.35, .35))); pts.push(p.clone()); }
    const l = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xbfe8ff, transparent: true, blending: THREE.AdditiveBlending }));
    fx.add(l, 0.1, (k) => { l.material.opacity = 1 - k; });
  }
  // ---------- free movement / action start ----------
  free(dt, foe) {
    const I = this.intent;
    if (G.state !== 'fight') { this.vel.multiplyScalar(0.9); this.pose(this.isApe ? 'apeIdle' : 'idle'); return; }
    if (I.transform) { if (this.startTransform()) return; }
    if (I.revert && (this.formIdx > 0 || this.isApe)) { if (this.isApe) this.revertApe('manual'); else this.setForm(0); return; }
    if (I.super >= 0 && this.startSuper(I.super)) return;
    if (I.vanish && this.ki >= 10) return this.startVanish();
    if (I.melee) return this.startMelee();
    if (I.guard) { this.act = { type: 'guard', t: 0 }; this.guardT = G.time; return; }
    if (I.charge && this.ki < 100) { this.act = { type: 'charge', t: 0, snd: 0 }; sfx.charge(); return; }
    if (I.blast && this.blastCd <= 0 && this.ki >= 1.5) this.fireBlast();
    const f = flatDir(this.pos, foe.pos), right = V3(-f.z, 0, f.x);
    const wish = f.multiplyScalar(I.fwd).add(right.multiplyScalar(I.side));
    if (wish.lengthSq() > 1) wish.normalize();
    const speed = (this.isApe ? 15 : I.boost ? 36 : 16) * (this.isApe ? 1 : this.form.spd);
    const tv = wish.multiplyScalar(speed);
    const k = Math.min(1, dt * (this.isApe ? 5 : 7));
    this.vel.x += (tv.x - this.vel.x) * k; this.vel.z += (tv.z - this.vel.z) * k;
    if (this.isApe) { if (I.up > 0 && this.pos.y - this.ground() < 0.3) { this.vel.y = 28; sfx.whoosh(); } }
    else this.vel.y += (I.up * speed * 0.7 - this.vel.y) * k;
    // pose
    if (this.poseO) this.pose(this.poseO.name, 30);
    else if (this.isApe) this.pose('apeIdle', 6);
    else if (I.fwd > 0.3 && (I.boost || I.fwd > 0.8) && this.vel.length() > 12) this.pose('fly', 8);
    else if (I.fwd < -0.3) this.pose('back', 8);
    else if (I.side < -0.3) this.pose('strafeL', 8);
    else if (I.side > 0.3) this.pose('strafeR', 8);
    else if (this.pos.y - this.ground() < 0.25) this.pose('stand', 8);
    else this.pose('idle', 8);
    if (this.isApe && wish.lengthSq() > 0.01 && this.pos.y - this.ground() < 0.3) { // footsteps
      this.step = (this.step || 0) + dt; if (this.step > 0.45) { this.step = 0; shake(0.25); fx.dust(this.pos.clone(), 6, 3); }
    }
    if (I.boost && wish.lengthSq() > 0.01 && !this.isApe) fx.trail(this.center(), this.form.aura, 0.9, 0.2);
  }
  // ---------- actions ----------
  startMelee() {
    const d = this.center().distanceTo(this.foe.center());
    if (d > this.reach + this.foe.hitR + 0.8 && d < (this.isApe ? 30 : 45) && !this.isApe) { this.act = { type: 'rush', t: 0 }; sfx.whoosh(); return; }
    this.meleeStep(0);
  }
  meleeStep(i) {
    const s = (this.isApe ? APE_STEPS : STEPS)[i];
    this.act = { type: 'melee', i, s, t: 0, hit: false, queued: false }; this.pose(s.pose, 24); sfx.whoosh();
  }
  fireBlast() {
    this.ki -= 1.5; this.blastCd = this.isApe ? 0.35 : 0.13; this.hand ^= 1;
    this.poseO = { name: this.hand ? 'blastR' : 'blastL', t: 0.16 };
    const from = V3(); (this.hand ? this.m.J.rHand : this.m.J.lHand).getWorldPosition(from);
    if (this.isApe) this.handPos(from);
    const dir = this.foe.center().sub(from).normalize();
    spawnProj(this, from, dir, { speed: 58, dmg: (this.isApe ? 140 : 65) * this.pow, r: this.isApe ? 1.4 : 0.35, color: this.isApe ? 0xff90b0 : BLAST_COL[this.hero], homing: 2.2, kind: 'blast' });
    sfx.ki();
  }
  startVanish() {
    this.ki -= 10; this.inv = 0.4; sfx.vanish(); fx.lines(this.center(), 0xffffff, 12, 3);
    const foe = this.foe, I = this.intent;
    let to;
    const f = flatDir(this.pos, foe.pos), right = V3(-f.z, 0, f.x);
    if (Math.abs(I.side) > 0.1 || Math.abs(I.fwd) > 0.1) to = this.pos.clone().addScaledVector(f, I.fwd * 9).addScaledVector(right, I.side * 9);
    else { const a = (Math.random() < 0.5 ? 1 : -1) * 1.3, off = this.pos.clone().sub(foe.pos); off.applyAxisAngle(V3(0, 1, 0), a); to = foe.pos.clone().add(off); }
    to.y += rand(0, 2);
    this.act = { type: 'vanish', t: 0, to }; this.obj.visible = false;
  }
  startTransform() {
    const nx = this.formIdx + 1, f = this.def.forms[nx];
    if (this.isApe || !f) return false;
    if (f.ape) { const i = this.def.supers.indexOf('powerBall'); return i >= 0 && !this.tailCut && this.startSuper(i); }
    if (this.ki < f.cost) { this.noKi(); return false; }
    this.ki -= f.cost; this.inv = 2.4;
    this.act = { type: 'transform', t: 0, to: nx, done: false }; this.m.aura.material.uniforms.color.value.set(f.aura);
    G.cine = { f: this, t: 0, dur: 2.3, mode: 'orbit' }; G.freeze = this;
    bark(this, 'transform_' + f.id); sfx.powerup(); this.m.setExpression('shout'); this.exprT = 2.3;
    return true;
  }
  noKi() { if (this.isPlayer) dmgNum(this.center(), 'Not enough Ki', 'blk'); }
  startSuper(i) {
    const id = this.supers[i], S = SUPERS[id]; if (!S) return false;
    if (this.ki < S.cost) { this.noKi(); return false; }
    if (S.type === 'transform' && (this.isApe || this.tailCut)) return false;
    if (S.type === 'aoe' && id === 'stompQuake' && this.pos.y - this.ground() > 1) return false;
    this.ki -= S.cost; superName(S.name, S.color);
    const bk = BARKS[this.hero][id]; if (bk) say(this, pick(bk), 2.4);
    this.act = { type: 'super', id, S, t: 0, phase: S.type === 'rush' ? 'dash' : 'charge', n: 0, tick: 0 };
    if (S.type === 'transform') { G.cine = { f: this, t: 0, dur: 6.2, mode: 'ape' }; G.freeze = this; this.inv = 7; }
    if (S.type === 'ball') this.inv = 0; // vulnerable while gathering energy
    return true;
  }

  run(a, dt, foe) {
    const I = this.intent;
    switch (a.type) {
      case 'rush': {
        this.pose('fly', 14);
        const d = this.foe.center().sub(this.center()); const L = d.length();
        this.vel.copy(d.normalize().multiplyScalar(52 * this.form.spd)); fx.trail(this.center(), this.form.aura, 1.0, 0.25);
        if (L < this.reach + foe.hitR + 0.4) { this.vel.multiplyScalar(0.1); this.meleeStep(0); }
        else if (a.t > 0.8) this.endAct();
        break;
      }
      case 'melee': {
        const s = a.s, dur = s.dur / (this.isApe ? 1 : Math.sqrt(this.form.spd)), k = a.t / dur;
        if (I.melee && a.t > dur * 0.2) a.queued = true;
        const d = foe.center().sub(this.center()), L = d.length();
        const want = this.reach + foe.hitR - 0.3;
        if (L > want && L < want + 5 && k < s.at) this.vel.copy(d.normalize().multiplyScalar(this.isApe ? 10 : 20)); else this.vel.multiplyScalar(0.8);
        if (s.pose2 && k > 0.5) this.pose(s.pose2, 30);
        if (!a.hit && k >= s.at) {
          a.hit = true;
          if (L < this.reach + foe.hitR + 0.5) this.strike(foe, s);
          else if (this.isApe && s.knock) { this.stompFx(); }
        }
        if (k >= 1) { const steps = this.isApe ? APE_STEPS : STEPS; if (a.queued && a.i + 1 < steps.length) this.meleeStep(a.i + 1); else this.endAct(); }
        break;
      }
      case 'guard':
        this.pose('guard', 20); this.vel.multiplyScalar(0.85);
        if (!I.guard) this.endAct();
        break;
      case 'charge':
        this.pose('charge', 10); this.vel.multiplyScalar(0.85); a.snd -= dt;
        if (a.snd <= 0) { a.snd = 0.55; sfx.charge(); }
        if (Math.random() < 0.5) { const p = this.center().add(V3(rand(-3, 3), rand(-2, 3), rand(-3, 3))); fx.glow.emit(p, this.center().sub(p).multiplyScalar(3), new THREE.Color(this.form.aura), 0.3, 0.05, 0.33); }
        if (this.pos.y - this.ground() < 2 && Math.random() < 0.15) fx.dust(this.pos.clone().setY(this.ground()), 2, 3);
        if (!I.charge || this.ki >= 100) this.endAct();
        break;
      case 'vanish':
        if (a.t > 0.14) { this.pos.copy(a.to); this.vel.set(0, 0, 0); this.obj.visible = true; fx.lines(this.center(), 0xffffff, 10, 3); this.act = null; }
        break;
      case 'hurt':
        this.pose('hurt', 25); this.vel.multiplyScalar(0.9); if (a.t > a.dur) this.endAct();
        break;
      case 'stunned':
        this.pose('hurt', 6); this.vel.multiplyScalar(0.9); this.m.J.head.rotation.z = Math.sin(G.time * 6) * 0.3;
        if (Math.random() < 0.3) fx.glow.emit(this.center().add(V3(Math.cos(G.time * 8) * 0.6 * this.S, 0.9 * this.S, Math.sin(G.time * 8) * 0.6 * this.S)), V3(), new THREE.Color(0xffee55), 0.35, 0.1, 0.3);
        if (a.t > a.dur) this.endAct();
        break;
      case 'knock': {
        this.pose('tumble', 20);
        a.v.y -= 18 * dt; a.v.multiplyScalar(Math.pow(0.35, dt));
        this.pos.addScaledVector(a.v, dt); this.m.root.rotation.x -= dt * 14;
        const sp = a.v.length();
        if (sp > 12) fx.trail(this.center(), 0xffffff, 0.5, 0.3);
        const gh = this.ground();
        if (this.pos.y <= gh + 0.15 && a.v.y < 0) {
          this.pos.y = gh; const r = clamp(2 + sp * 0.07, 2, 7);
          if (sp > 10) {
            arena.crater(this.pos.x, this.pos.z, r, clamp(sp * 0.04, 0.6, 3));
            fx.dust(this.pos.clone(), 26, r); fx.shockwave(this.pos.clone().setY(gh + 0.3), 0xffe6c0, r * 1.6, 0.5); fx.sparks(this.pos, 0xffd9a0, 18, 18);
            shake(Math.min(1.5, sp * 0.04)); sfx.boom(sp > 30);
          }
          arena.smash(this.pos, r, fx);
          this.m.root.rotation.set(0, 0, 0); this.act = { type: 'down', t: 0, dur: 1.0 }; this.vel.set(0, 0, 0); break;
        }
        if (arena.smash(this.center(), this.hitR + 0.5, fx).length) { a.v.multiplyScalar(0.45); shake(0.8); sfx.boom(false); hitstop(0.06); }
        if (a.t > 0.35 && I.recover) { this.endAct(); this.inv = 0.4; fx.lines(this.center(), 0xffffff, 10, 3); sfx.vanish(); this.vel.set(0, 0, 0); break; }
        if (a.t > 1.3) { this.endAct(); this.vel.set(0, 0, 0); }
        break;
      }
      case 'down':
        this.pose('down', 14); this.m.root.position.y = 0.25; this.inv = 0.2;
        if (a.t > a.dur || (a.t > 0.3 && I.recover)) { this.m.root.position.y = 0; this.endAct(); this.vel.y = 6; this.inv = 0.5; }
        break;
      case 'ko':
        this.pose(this.pos.y - this.ground() < 0.5 ? 'down' : 'tumble', 8);
        this.vel.multiplyScalar(0.95); if (!this.isApe) this.vel.y -= 20 * dt;
        if (this.pos.y - this.ground() < 0.3) this.m.root.position.y = 0.25;
        break;
      case 'victory': this.pose(this.hero === 'goku' ? 'victory' : this.hero === 'frieza' ? 'point' : 'crossed', 5); this.vel.multiplyScalar(0.9); break;
      case 'transform': {
        this.pose(a.t < 1.2 ? 'charge' : 'charge', 8); this.vel.multiplyScalar(0.8);
        if (Math.random() < 0.9) { const p = this.center().add(V3(rand(-4, 4), rand(-3, 4), rand(-4, 4))); fx.glow.emit(p, this.center().sub(p).multiplyScalar(2.5), new THREE.Color(this.def.forms[a.to].aura), 0.4, 0.05, 0.4); }
        shake(0.15);
        if (this.pos.y - this.ground() < 4 && Math.random() < 0.08) fx.dust(this.pos.clone().setY(this.ground()), 2, 3);
        if (!a.done && a.t > 1.3) {
          a.done = true; this.setForm(a.to); flash(0.8); shake(1.2); sfx.boom(true);
          fx.explosion(this.center(), this.form.aura, 3, 0.6);
          if (this.pos.y - this.ground() < 5) arena.crater(this.pos.x, this.pos.z, 5, 1.2);
          if (this.form.spiky) for (let i = 0; i < 8; i++) this.spark();
        }
        if (a.t > 2.3) { this.endAct(); G.freeze = null; }
        break;
      }
      case 'super': this.runSuper(a, dt, foe); break;
    }
  }
  strike(foe, s) {
    const dir = flatDir(this.pos, foe.pos);
    let kdir = null;
    if (s.knock) { kdir = dir.clone(); kdir.y = foe.pos.y - foe.ground() > 4 ? -1.1 : 0.45; kdir.normalize(); }
    foe.takeHit(this, { dmg: s.dmg * this.pow, kind: s.knock ? 'knock' : 'melee', stun: s.knock ? 14 : 8, dir, kdir, force: this.isApe ? 60 : 52, heavy: !!s.knock });
    if (this.isApe && s.knock) this.stompFx();
  }
  stompFx() {
    const p = this.center().addScaledVector(this.fwd(), 5); p.y = arena.height(p.x, p.z);
    if (this.pos.y - this.ground() < 1) { arena.crater(p.x, p.z, 5, 1.5); fx.dust(p, 20, 6); fx.shockwave(p.clone().setY(p.y + 0.5), 0xffe0b0, 14, 0.5); shake(1); sfx.boom(false); arena.smash(p, 5, fx); }
  }
  takeHit(att, h) {
    if (this.inv > 0 || G.state !== 'fight' || this.act?.type === 'ko' || this.act?.type === 'transform') return false;
    const toAtt = flatDir(this.pos, att.pos), facing = this.fwd().dot(toAtt) > 0.1;
    const p = this.center().lerp(att.center(), this.isApe ? 0.25 : 0.4);
    if (h.kind === 'blast' || h.kind === 'beam' || h.kind === 'aoe') p.copy(h.at || this.center());
    if (this.act?.type === 'guard' && facing && h.kind !== 'rush') {
      if ((h.kind === 'melee' || h.kind === 'knock') && G.time - this.guardT < 0.25 && !att.isApe) { this.perfectCounter(att); return false; }
      const dm = h.dmg * (h.kind === 'beam' || h.kind === 'aoe' ? 0.3 : 0.12); this.hp = Math.max(1, this.hp - dm); this.ki = Math.max(0, this.ki - 2);
      fx.sparks(p, 0x9fd8ff, 10); fx.flash(p, 0x9fd8ff, 1.5); sfx.block(); this.vel.addScaledVector(toAtt, -5);
      if (att.isPlayer || this.isPlayer) dmgNum(p, Math.round(dm), 'blk');
      return 'blocked';
    }
    let dmg = h.dmg * (this.act?.type === 'stunned' ? 1.3 : 1) * rand(0.92, 1.08);
    if (this.isApe) dmg *= 0.75;
    this.hp -= dmg; this.lastHitT = G.time; att.ki = Math.min(100, att.ki + 1.5); this.ki = Math.min(100, this.ki + 0.8);
    if (att.isPlayer) { G.combo = G.comboT > 0 ? G.combo + 1 : 1; G.comboT = 1.6; }
    const heavy = h.heavy || dmg > 600;
    fx.flash(p, heavy ? 0xfff0a0 : 0xffffff, heavy ? 4 : 1.8); fx.sparks(p, 0xffe6a0, heavy ? 24 : 10); if (heavy) { fx.lines(p, 0xffffff, 14, 5); flash(0.25); }
    if (h.kind !== 'beam') sfx.hit(heavy);
    hitstop(heavy ? 0.1 : h.kind === 'melee' ? 0.045 : 0); shake(heavy ? 0.7 : 0.18);
    dmgNum(p, Math.round(dmg), heavy ? 'big' : '');
    this.m.setExpression('hurt'); this.exprT = 0.5;
    // interrupt
    if (this.act?.type === 'super' && !this.isApe && this.act.phase !== 'fire' && this.act.S.type !== 'transform') this.endAct();
    if (this.hp <= 0) { if (G.mode === 'training') { this.hp = this.maxHp; dmgNum(this.center(), 'HP RESET', 'info'); } else { this.hp = 0; this.ko(att, h); return true; } }
    if (!this.zenkai && this.hp < this.maxHp * 0.3) {
      this.zenkai = true; setTimeout(() => G.state === 'fight' && bark(this, 'zenkai'), 400);
      if (this.hero === 'piccolo') { this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.25); fx.burst(this.center(), 0x9dff6a, 60, 14, 0.6, 0.8); dmgNum(this.center(), 'REGENERATION!', 'info'); }
      else if (this.hero === 'frieza') { this.powBonus = 1.12; this.ki = Math.min(100, this.ki + 50); fx.burst(this.center(), 0xff4de0, 60, 18, 0.6, 0.8); dmgNum(this.center(), 'EMPEROR\'S RAGE!', 'info'); }
      else { this.powBonus = 1.15; this.ki = 100; fx.burst(this.center(), 0xffe080, 60, 18, 0.6, 0.8); dmgNum(this.center(), 'ZENKAI BOOST!', 'info'); }
    }
    if (this.hp < this.maxHp * 0.5 && Math.random() < 0.08) bark(this, 'hurt');
    this.stun += h.stun || 0;
    if (this.isApe) { // super armor
      if (heavy && (!this.act || this.act.type === 'guard')) { this.endAct(); this.act = { type: 'hurt', t: 0, dur: 0.3 }; }
      return true;
    }
    if (this.act?.type === 'super' && this.act.phase === 'fire' && h.kind !== 'knock') return true; // beam users tank light hits
    if (this.stun >= 100 && h.kind !== 'knock') { this.stun = 0; this.endAct(); this.act = { type: 'stunned', t: 0, dur: 2.2 }; bark(this, 'stunned', 0.7); dmgNum(this.center(), 'STUNNED!', 'info'); return true; }
    this.endAct();
    if (h.kind === 'knock') { this.act = { type: 'knock', t: 0, v: h.kdir.clone().multiplyScalar(h.force) }; }
    else { this.act = { type: 'hurt', t: 0, dur: h.kind === 'blast' ? 0.18 : h.kind === 'rush' ? 0.5 : 0.36 }; this.vel.copy((h.dir || toAtt.clone().negate()).clone().multiplyScalar(h.kind === 'blast' ? 2 : 4)); }
    return true;
  }
  perfectCounter(att) {
    sfx.vanish(); this.endAct(); fx.lines(this.center(), 0x9fd8ff, 14, 4);
    const behind = att.pos.clone().addScaledVector(att.fwd(), -1.8); behind.y = att.pos.y;
    this.pos.copy(behind); this.inv = 0.5; this.obj.rotation.y = Math.atan2(att.pos.x - behind.x, att.pos.z - behind.z);
    dmgNum(this.center(), 'PERFECT COUNTER!', 'info'); bark(this, 'counter', 0.7);
    this.act = { type: 'melee', i: 4, s: STEPS[4], t: 0.2, hit: true, queued: false }; this.pose('smashB', 30);
    att.endAct(); att.act = null;
    att.takeHit(this, { dmg: 420 * this.pow, kind: 'knock', stun: 25, dir: flatDir(this.pos, att.pos), kdir: flatDir(this.pos, att.pos).setY(0.3).normalize(), force: 45, heavy: true });
  }
  ko(att) {
    this.endAct(); this.act = { type: 'ko', t: 0 }; this.vel.copy(flatDir(att.pos, this.pos).multiplyScalar(25)).setY(8);
    if (this.isApe) { this.revertApe('ko'); this.act = { type: 'ko', t: 0 }; }
    G.state = 'ko'; G.koT = 0; G.timeScale = 0.25; flash(1); shake(1.5); sfx.boom(true);
    fx.explosion(this.center(), 0xffffff, 4, 0.8); G.clash = null; $('clash').classList.remove('on');
    banner('K.O.!');
    setTimeout(() => { bark(this, 'defeat'); }, 900);
    setTimeout(() => { att.endAct(); att.act = { type: 'victory', t: 0 }; bark(att, 'victory'); G.cine = { f: att, t: 0, dur: 99, mode: 'front' }; }, 2600);
    setTimeout(() => showResult(att.isPlayer, att), 6200);
  }
  // ---------- Great Ape ----------
  becomeApe() {
    if (!this.ape) { this.ape = buildApe(this.def); this.rigA = new Rig(this.ape); }
    this.obj.remove(this.human.root); this.obj.add(this.ape.root); this.m = this.ape; this.rig = this.rigA;
    this.ape.J.tail.visible = true;
    this.formIdx = this.def.forms.findIndex((f) => f.ape); this.form = this.def.forms[this.formIdx]; this.apeT = 45;
  }
  revertApe(reason) {
    if (!this.isApe) return;
    this.obj.remove(this.ape.root); this.obj.add(this.human.root); this.m = this.human; this.rig = this.rigH;
    this.obj.scale.setScalar(1); this.setForm(0, true);
    fx.explosion(this.center(), 0xffc080, 4, 0.6); flash(0.5);
    if (G.moon) { const m = G.moon; G.moon = null; fx.add(m, 1.5, (k) => { m.material.opacity = 1 - k; }); scene.remove(m); }
    if (reason === 'tail') {
      this.tailCut = true; if (this.human.J.tailMesh) this.human.J.tailMesh.visible = false;
      bark(this, 'tailLost'); this.act = { type: 'stunned', t: 0, dur: 2 }; this.hp -= 800; dmgNum(this.center(), 'TAIL CUT!', 'info');
    } else if (reason === 'timeout') bark(this, 'apeTimeout');
  }

  // ---------- supers ----------
  runSuper(a, dt, foe) {
    const S = a.S, col = new THREE.Color(S.color);
    const cleanup = () => { a.orb && scene.remove(a.orb); a.beam && scene.remove(a.beam.grp); if (G.clash && (G.clash.a === this || G.clash.b === this)) endClash(); };
    a.cleanup = cleanup;
    this.vel.multiplyScalar(0.85);
    switch (S.type) {
      case 'beam': {
        if (a.phase === 'charge') {
          this.pose(this.isApe ? 'roar' : S.pose, 10);
          if (!a.orb) a.orb = fx.orb(S.color, 0.3 * (this.isApe ? 4 : 1));
          const hp = this.isApe ? this.handPos() : this.handPos().add(this.fwd().multiplyScalar(0.1));
          a.orb.position.copy(hp); a.orb.scale.setScalar(0.5 + a.t / S.charge * 1.5);
          const p = hp.clone().add(V3(rand(-2, 2), rand(-2, 2), rand(-2, 2)).multiplyScalar(this.S * 0.6));
          fx.glow.emit(p, hp.clone().sub(p).multiplyScalar(4), col, 0.25, 0.05, 0.25);
          if (a.t >= S.charge) {
            a.phase = 'fire'; a.t = 0; scene.remove(a.orb); a.orb = null; this.pose(this.isApe ? 'roar' : S.firePose || 'fire', 30);
            a.dir = foe.center().sub(this.handPos()).normalize(); a.len = 0; a.beam = fx.beam(S.color, S.width * (this.isApe ? 2.2 : 1));
            sfx.beam(1.6); shake(0.6); flash(0.3);
          }
        } else if (a.phase === 'fire') {
          const from = this.handPos();
          if (G.clash && (G.clash.a === this || G.clash.b === this)) { a.beam.set(from, G.clash.point, G.time); a.t = Math.min(a.t, 0.5); break; }
          const tgt = foe.center().sub(from).normalize();
          a.dir.lerp(tgt, Math.min(1, dt * 0.9)).normalize();
          a.len = Math.min(a.len + 150 * dt, 170);
          // collisions
          const fc = foe.center(), rel = fc.clone().sub(from), proj = clamp(rel.dot(a.dir), 0, a.len);
          const closest = from.clone().addScaledVector(a.dir, proj);
          let end = from.clone().addScaledVector(a.dir, a.len);
          if (closest.distanceTo(fc) < foe.hitR + S.width * (this.isApe ? 1.6 : 0.8) && proj < a.len) {
            const fa = foe.act;
            if (fa?.type === 'super' && fa.S.type === 'beam' && !G.clash && foe.fwd().dot(a.dir) < -0.3) { startClash(this, foe); break; }
            a.len = proj; end = closest; a.hitting = true;
            a.tick -= dt;
            if (a.tick <= 0) { a.tick = 0.1; foe.takeHit(this, { dmg: S.dmg * this.pow / 15, kind: 'beam', stun: 3, at: closest, dir: a.dir.clone() }); fx.sparks(closest, S.color, 8, 16); }
          } else {
            for (let s = 4; s < a.len; s += 3) {
              const q = from.clone().addScaledVector(a.dir, s);
              if (q.y < arena.height(q.x, q.z)) { a.len = s; end = q; a.ground = true; break; }
            }
          }
          a.boomT = (a.boomT || 0) - dt;
          if (a.boomT <= 0) {
            a.boomT = 0.22; arena.smash(end, S.width * 2, fx);
            if (a.ground || a.len >= 170) { fx.explosion(end, S.color, 2 + S.width, 0.5); if (a.ground) arena.crater(end.x, end.z, 3 + S.width * 2, 1.4); sfx.boom(false); }
            for (let s = 6; s < a.len; s += 12) arena.smash(from.clone().addScaledVector(a.dir, s), S.width, fx);
          }
          a.beam.set(from, end, G.time); shake(0.25);
          if (Math.random() < 0.6) fx.trail(from.clone().addScaledVector(a.dir, Math.random() * a.len), S.color, S.width * 1.2, 0.3);
          if (a.t > 1.5) {
            fx.explosion(end, S.color, 3 + S.width * 2, 0.8); shake(1); sfx.boom(true);
            if (a.hitting && closestHit(foe, end, 4 + S.width * 2) && foe.act?.type !== 'ko') foe.takeHit(this, { dmg: S.dmg * this.pow * 0.3, kind: 'knock', stun: 20, kdir: a.dir.clone().setY(Math.max(a.dir.y, 0.2)).normalize(), force: 45, heavy: true, at: end });
            if (a.ground) arena.crater(end.x, end.z, 5 + S.width * 3, 3);
            this.endAct();
          }
        }
        break;
      }
      case 'rush': {
        if (a.phase === 'dash') {
          this.pose('fly', 16);
          const d = foe.center().sub(this.center()), L = d.length();
          this.vel.copy(d.normalize().multiplyScalar(80)); fx.trail(this.center(), S.color, 1.4, 0.3);
          if (L < this.reach + foe.hitR + 0.6) {
            this.vel.set(0, 0, 0);
            if (foe.act?.type === 'guard' || foe.inv > 0) { foe.takeHit(this, { dmg: 200, kind: 'melee', stun: 5 }); this.endAct(); break; }
            a.phase = 'hits'; a.t = 0; a.n = 0; foe.endAct(); foe.act = { type: 'hurt', t: 0, dur: 99 };
          } else if (a.t > 0.9) this.endAct();
        } else if (a.phase === 'hits') {
          foe.vel.set(0, 0, 0);
          if (a.t > a.n * 0.12) {
            a.n++;
            if (a.n <= S.hits) {
              const ang = rand(0, Math.PI * 2), R = this.reach + foe.hitR - 0.3;
              if (!this.isApe) { this.pos.copy(foe.pos).add(V3(Math.cos(ang) * R, rand(-0.6, 0.8), Math.sin(ang) * R)); fx.lines(this.center(), S.color, 6, 3); }
              const d = flatDir(this.pos, foe.pos); this.obj.rotation.y = Math.atan2(d.x, d.z);
              this.pose(['punchR', 'kick', 'punchL', 'knee'][a.n % 4], 40);
              foe.act = null; foe.takeHit(this, { dmg: S.dmg * this.pow * 0.6 / S.hits, kind: 'rush', stun: 4 }); if (foe.act) foe.act.dur = 99; else break;
              sfx.whoosh();
            } else if (a.n === S.hits + 1) { this.pose('smashA', 30); }
            else {
              this.pose('smashB', 30); foe.act = null;
              const kd = flatDir(this.pos, foe.pos); kd.y = foe.pos.y - foe.ground() > 3 ? -1.2 : 0.6; kd.normalize();
              foe.takeHit(this, { dmg: S.dmg * this.pow * 0.4, kind: 'knock', stun: 20, kdir: kd, force: 70, heavy: true });
              fx.explosion(foe.center(), S.color, 2, 0.4); this.endAct();
            }
          }
          if (a.t > 3) { if (foe.act?.type === 'hurt') foe.endAct(); this.endAct(); }
        }
        break;
      }
      case 'aoe': {
        const ape = this.isApe;
        this.pose(a.t < 0.5 ? (ape ? 'smashA' : 'charge') : (ape ? 'smashB' : 'palm'), 14);
        if (a.t < 0.5 && Math.random() < 0.7) fx.auraMotes(this.pos.clone(), S.color, this.S);
        if (!a.done && a.t >= 0.5) {
          a.done = true; const c = ape ? this.pos.clone().setY(this.ground() + 1) : this.center();
          const R = S.radius;
          fx.explosion(c, S.color, ape ? 3 : R * 0.55, 0.8); flash(0.4); shake(1.3); sfx.boom(true);
          for (let i = 0; i < 3; i++) setTimeout(() => fx.shockwave(c.clone().setY(c.y + 0.3), S.color, R * 1.4, 0.6), i * 120);
          if (this.pos.y - this.ground() < R) arena.crater(this.pos.x, this.pos.z, R * 0.6, ape ? 2.5 : 3);
          arena.smash(c, R, fx);
          const fcn = foe.center(), d = fcn.distanceTo(c);
          const grounded = foe.pos.y - foe.ground() < 6;
          if (d < R + foe.hitR && (!ape || grounded)) foe.takeHit(this, { dmg: S.dmg * this.pow, kind: 'knock', stun: 20, kdir: fcn.clone().sub(c).setY(1).normalize(), force: 48, heavy: true, at: fcn });
          if (ape) fx.dust(c, 50, 14);
        }
        if (a.t > 1.1) this.endAct();
        break;
      }
      case 'barrage': {
        if (a.t < 0.25) { this.pose('charge', 16); break; }
        a.tick -= dt;
        if (a.tick <= 0 && a.n < S.count) {
          a.tick = 0.065; a.n++; this.hand ^= 1; this.pose(this.hand ? 'blastR' : 'blastL', 40);
          const from = V3(); (this.hand ? this.m.J.rHand : this.m.J.lHand).getWorldPosition(from);
          const t = foe.center().add(V3(rand(-3, 3), rand(-2, 3), rand(-3, 3)));
          spawnProj(this, from, t.sub(from).normalize(), { speed: 70, dmg: S.dmg * this.pow / S.count, r: 0.45, color: S.color, homing: 1.2, kind: 'blast', boom: true });
          sfx.ki();
        }
        if (a.n >= S.count && a.t > 2.3) this.endAct();
        break;
      }
      case 'disc': {
        if (a.phase === 'charge') {
          this.pose('raise', 12);
          if (!a.orb) { a.orb = discMesh(S.color); scene.add(a.orb); }
          const p = this.center().add(V3(0, 1.8, 0)); a.orb.position.copy(p); a.orb.rotation.y += dt * 30; a.orb.scale.setScalar(Math.min(1, a.t / 0.6) * 1.1);
          if (a.t > 0.8) {
            a.phase = 'throw'; a.t = 0; this.pose('throw', 30); const disc = a.orb; a.orb = null; scene.remove(disc);
            spawnProj(this, p, foe.center().sub(p).normalize(), { speed: 42, dmg: S.dmg * this.pow, r: 1.1, color: S.color, homing: 3.2, kind: 'disc', mesh: disc, life: 4 });
            sfx.whoosh();
          }
        } else if (a.t > 0.35) this.endAct();
        break;
      }
      case 'ball': {
        if (a.phase === 'charge') {
          this.pose('raise', 8);
          if (!a.orb) a.orb = fx.orb(S.color, 1);
          const k = Math.min(1, a.t / S.charge), size = 0.3 + k * S.size;
          const p = this.center().add(V3(0, 2 + size, 0)); a.orb.position.copy(p); a.orb.scale.setScalar(size);
          for (let i = 0; i < 3; i++) { const q = p.clone().add(V3(rand(-40, 40), rand(-10, 40), rand(-40, 40))); fx.glow.emit(q, p.clone().sub(q).multiplyScalar(1.3), col, 0.6, 0.2, 0.75); }
          if (a.t > S.charge) {
            a.phase = 'throw'; a.t = 0; this.pose('throw', 20); const orb = a.orb; a.orb = null;
            spawnProj(this, p, foe.center().sub(p).normalize(), { speed: S.speed || 24, dmg: S.dmg * this.pow, r: size * 0.7, color: S.color, homing: 0.9, kind: 'ball', mesh: orb, life: 8 });
            sfx.whoosh(); shake(0.5);
          }
        } else if (a.t > 0.6) this.endAct();
        break;
      }
      case 'roar': {
        this.pose('roar', 12);
        if (!a.done && a.t > 0.35) {
          a.done = true; sfx.roar(); shake(1.6); flash(0.2);
          for (let i = 0; i < 5; i++) setTimeout(() => this.act === a && fx.shockwave(this.handPos(), S.color, 30, 0.7, false), i * 150);
          const d = foe.center().distanceTo(this.center());
          if (d < S.radius && foe.act?.type !== 'guard' && foe.inv <= 0) {
            foe.takeHit(this, { dmg: S.dmg, kind: 'melee', stun: 0 }); foe.endAct(); foe.act = { type: 'stunned', t: 0, dur: 1.8 }; dmgNum(foe.center(), 'TERRIFIED!', 'info');
          }
        }
        if (a.t > 1.4) this.endAct();
        break;
      }
      case 'transform': { // Power Ball -> Great Ape
        if (a.phase === 'charge') {
          this.pose('raise', 10);
          if (!a.orb) a.orb = fx.orb(0xfff4c0, 0.4);
          a.orb.position.copy(this.center().add(V3(0, 1.6, 0))); a.orb.scale.setScalar(Math.min(1, a.t) * 1.5);
          if (a.t > 1.0) { a.phase = 'rise'; a.t = 0; this.pose('throw', 20); sfx.whoosh(); }
        } else if (a.phase === 'rise') {
          const k = Math.min(1, a.t / 1.0); a.orb.position.lerp(this.pos.clone().add(V3(-30, 70, -30)), k * 0.08); a.orb.scale.setScalar(1.5 + k * 10);
          if (a.t > 1.0) {
            a.phase = 'stare'; a.t = 0; flash(0.8);
            const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xfff6d0, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false }));
            moon.position.copy(a.orb.position); moon.scale.setScalar(60); scene.add(moon); scene.remove(a.orb); a.orb = null;
            if (G.moon) scene.remove(G.moon); G.moon = moon;
            say(this, pick(BARKS.vegeta.transform_ape), 3);
          }
        } else if (a.phase === 'stare') {
          this.pose('charge', 6); this.m.J.head.rotation.x = -0.6;
          if (a.t > 1.3) { a.phase = 'grow'; a.t = 0; this.becomeApe(); this.obj.scale.setScalar(1.5); sfx.powerup(); if (foe) setTimeout(() => bark(foe, 'rageApe'), 2200); }
        } else if (a.phase === 'grow') {
          const k = Math.min(1, a.t / 2.2); this.obj.scale.setScalar(1.5 + k * 5.5); this.pose('roar', 5); shake(0.5);
          if (Math.random() < 0.5) fx.dust(this.pos.clone().setY(this.ground()), 4, 6 * k + 2);
          if (a.t > 2.2) { this.obj.scale.setScalar(7); sfx.roar(); shake(1.5); fx.shockwave(this.pos.clone().setY(this.ground() + 1), 0xff8080, 40, 1); arena.crater(this.pos.x, this.pos.z, 10, 2); G.freeze = null; this.endAct(); }
        }
        break;
      }
    }
  }
}
const closestHit = (f, p, r) => f.center().distanceTo(p) < r + f.hitR;

function discMesh(color) {
  const grp = new THREE.Group();
  const d = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.06, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }));
  const r = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.08, 6, 32), new THREE.MeshBasicMaterial({ color, blending: THREE.AdditiveBlending, transparent: true })); r.rotation.x = Math.PI / 2;
  const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })); g.scale.set(3.4, 1.2, 1);
  grp.add(d, r, g); return grp;
}

// ---------------- projectiles ----------------
function spawnProj(owner, from, dir, o) {
  const mesh = o.mesh || fx.orb(o.color, o.r); if (o.mesh) scene.add(mesh);
  mesh.position.copy(from);
  G.proj.push({ owner, mesh, pos: mesh.position, vel: dir.clone().multiplyScalar(o.speed), life: o.life || 2.2, ...o });
}
function updateProj(dt) {
  for (let i = G.proj.length - 1; i >= 0; i--) {
    const p = G.proj[i], foe = p.owner.foe; p.life -= dt;
    const want = foe.center().sub(p.pos).normalize().multiplyScalar(p.speed);
    p.vel.lerp(want, Math.min(1, p.homing * dt * (p.kind === 'blast' ? 0.6 : 1)));
    p.pos.addScaledVector(p.vel, dt);
    if (p.kind === 'disc') p.mesh.rotation.y += dt * 30;
    fx.trail(p.pos, p.color, p.r * (p.kind === 'ball' ? 2 : 1.6), 0.18);
    let hit = false, boom = false;
    if (foe.center().distanceTo(p.pos) < foe.hitR + p.r) {
      hit = true;
      if (p.kind === 'disc' && foe.isApe && !foe.tailCut) { foe.revertApe('tail'); bark(p.owner, 'tailcut'); fx.sparks(p.pos, p.color, 30); }
      else {
        const big = p.kind === 'ball';
        foe.takeHit(p.owner, { dmg: p.dmg, kind: big ? 'knock' : p.kind === 'disc' ? 'melee' : 'blast', stun: big ? 30 : p.kind === 'disc' ? 12 : 3, heavy: big || p.kind === 'disc', at: p.pos.clone(), dir: p.vel.clone().normalize(), kdir: p.vel.clone().normalize().setY(-0.5).normalize(), force: 50 });
        boom = true;
      }
    } else if (p.pos.y < arena.height(p.pos.x, p.pos.z)) { hit = true; boom = true; }
    else if (p.kind !== 'blast') { const br = arena.smash(p.pos, p.r, fx); if (br.length && p.kind !== 'disc') { hit = true; boom = true; } }
    else if (arena.smash(p.pos, 0.1, null).length) { hit = true; boom = true; }
    if (hit || p.life <= 0) {
      if (boom || p.life <= 0) {
        if (p.kind === 'ball') { fx.explosion(p.pos, p.color, 16, 1.4); arena.crater(p.pos.x, p.pos.z, 16, 6); arena.smash(p.pos, 16, fx); shake(2); flash(0.9); sfx.boom(true); const f2 = foe; if (f2.center().distanceTo(p.pos) < 16 && !hit) f2.takeHit(p.owner, { dmg: p.dmg * 0.5, kind: 'knock', heavy: true, kdir: V3(0, 1, 0), force: 30, at: f2.center() }); }
        else if (p.kind === 'disc') { fx.sparks(p.pos, p.color, 16); }
        else { fx.burst(p.pos, p.color, 10, 8, 0.6, 0.35); fx.flash(p.pos, p.color, p.r * 5, 0.15); if (p.boom || p.owner.isApe) { fx.dust(p.pos, 3, 2); } if (p.pos.y - arena.height(p.pos.x, p.pos.z) < 1 && (p.owner.isApe || Math.random() < 0.3)) arena.crater(p.pos.x, p.pos.z, p.owner.isApe ? 3 : 1.4, p.owner.isApe ? 1 : 0.3); }
      }
      scene.remove(p.mesh); G.proj.splice(i, 1);
    }
  }
}

// ---------------- beam clash ----------------
function startClash(a, b) {
  G.clash = { a, b, bal: 0, t: 0, point: V3() }; b.act.phase === 'charge' && forceFire(b);
  $('clash').classList.add('on'); banner('CLASH!'); sfx.boom(true); flash(0.5);
  bark(a, 'clash'); setTimeout(() => G.clash && bark(b, 'clash'), 1300);
}
function forceFire(f) { const a = f.act; a.t = a.S.charge; f.runSuper(a, 0, f.foe); }
function endClash() { G.clash = null; $('clash').classList.remove('on'); }
function updateClash(dt) {
  const c = G.clash; if (!c) return;
  if (c.a.act?.type !== 'super' || c.b.act?.type !== 'super') { endClash(); return; }
  c.t += dt;
  const pl = c.a.isPlayer ? c.a : c.b.isPlayer ? c.b : null;
  const push = (f) => (f === pl ? (pressed.has('j') || pressed.has('k') ? 0.055 : 0) : dt * [0.28, 0.42, 0.55][G.diff]) * (f.pow / 1.3);
  c.bal += push(c.a) - push(c.b);
  const pa = c.a.handPos(), pb = c.b.handPos();
  c.point.copy(pa).lerp(pb, clamp(0.5 + c.bal * 0.45, 0.05, 0.95));
  if (Math.random() < 0.8) { fx.sparks(c.point, c.a.act.S.color, 6, 20); fx.sparks(c.point, c.b.act.S.color, 6, 20); }
  if (Math.random() < 0.15) fx.flash(c.point, 0xffffff, 6, 0.15);
  shake(0.4);
  const fillPct = pl === c.a ? (0.5 + c.bal * 0.5) : (0.5 - c.bal * 0.5);
  $('clashFill').style.width = clamp(fillPct * 100, 0, 100) + '%';
  if (Math.abs(c.bal) >= 1 || c.t > 7) {
    const win = c.t > 7 ? null : c.bal > 0 ? c.a : c.b, lose = win === c.a ? c.b : c.a;
    const P = c.point.clone(); endClash();
    fx.explosion(P, 0xffffff, 10, 1.2); arena.crater(P.x, P.z, 10, 3); shake(2); flash(1); sfx.boom(true);
    c.a.endAct(); c.b.endAct();
    if (win) { lose.takeHit(win, { dmg: 2200 * win.pow, kind: 'knock', heavy: true, stun: 40, kdir: flatDir(win.pos, lose.pos).setY(0.4).normalize(), force: 60 }); banner(win.isPlayer ? 'CLASH WON!' : 'OVERPOWERED!'); }
    else for (const f of [c.a, c.b]) f.takeHit(f.foe, { dmg: 900, kind: 'knock', heavy: true, kdir: flatDir(f.foe.pos, f.pos).setY(0.4).normalize(), force: 40 });
  }
}

// ---------------- AI ----------------
function aiThink(f, dt) {
  const ai = f.ai, foe = f.foe, I = f.intent, D = G.diff;
  Object.assign(I, blankIntent());
  if (G.state !== 'fight' || G.freeze) return;
  if (G.mode === 'training' && !f.isPlayer) {
    const m = TRAIN_MODES[G.train.dummy];
    if (m === 'Stand') return;
    if (m === 'Guard') { I.guard = true; return; }
    if (m === 'Blast') { I.blast = Math.random() < 0.5; I.side = Math.sin(G.time * 0.7); I.up = clamp((foe.pos.y - f.pos.y) * 0.25, -1, 1); return; }
  }
  const d = f.center().distanceTo(foe.center());
  ai.react -= dt; ai.t -= dt; ai.holdT -= dt;
  const threatProj = G.proj.some((p) => p.owner === foe && p.pos.distanceTo(f.center()) < 10);
  const fa = foe.act;
  const threat = threatProj || (fa && ((fa.type === 'melee' && d < 5) || fa.type === 'rush' || (fa.type === 'super' && (fa.phase === 'fire' || fa.phase === 'dash' || fa.phase === 'throw'))));
  // continue hold
  if (ai.hold && ai.holdT > 0) { Object.assign(I, ai.hold); if (f.act?.type === 'melee') I.melee = Math.random() < [0.6, 0.8, 0.95][D]; return; }
  ai.hold = null;
  if (f.act) {
    if (f.act.type === 'melee') I.melee = Math.random() < [0.55, 0.8, 0.95][D];
    if (f.act.type === 'knock' && Math.random() < [0.01, 0.03, 0.08][D]) I.recover = true;
    if (f.act.type === 'down' && Math.random() < 0.02 * (D + 1)) I.recover = true;
    return;
  }
  // defense reaction
  if (threat && ai.react <= 0 && !f.isApe) {
    ai.react = [0.5, 0.3, 0.18][D];
    const r = Math.random();
    const beamIdx = f.supers.findIndex((id) => SUPERS[id].type === 'beam' && f.ki >= SUPERS[id].cost);
    if (fa?.type === 'super' && fa.S.type === 'beam' && beamIdx >= 0 && r < 0.55) { I.super = beamIdx; return; }
    if (r < [0.3, 0.45, 0.55][D]) { ai.hold = { guard: true }; ai.holdT = fa?.type === 'super' ? 1.6 : 0.5; I.guard = true; return; }
    if (r < [0.45, 0.65, 0.85][D] && f.ki >= 10) { I.vanish = true; I.side = Math.random() < 0.5 ? 1 : -1; return; }
  }
  if (ai.t > 0 && ai.plan) { Object.assign(I, ai.plan); I.up = clamp((foe.pos.y - f.pos.y) * 0.25, -1, 1) + (ai.plan.up || 0); if (ai.plan.melee) I.melee = true; return; }
  ai.t = rand(0.25, 0.7) - D * 0.08; ai.plan = null;
  const hpP = f.hp / f.maxHp;
  // transform
  const nx = f.def.forms[f.formIdx + 1];
  if (nx && !f.isApe && f.ki >= nx.cost && !(nx.ape && f.tailCut) && (hpP < 0.85 - f.formIdx * 0.3 || G.time - G.fightStart > 25 + f.formIdx * 30) && Math.random() < 0.5) { I.transform = true; return; }
  // super
  const opts = f.supers.map((id, i) => ({ id, i, S: SUPERS[id] })).filter((o) => o.S.cost <= f.ki && o.S.type !== 'transform'
    && !(o.S.type === 'aoe' && d > o.S.radius) && !(o.S.type === 'beam' && d < 5) && !(o.S.type === 'rush' && d > 35) && !(o.S.type === 'roar' && d > o.S.radius)
    && !(o.S.type === 'disc' && !foe.isApe && Math.random() < 0.6) && !(o.S.type === 'ball' && d < 15));
  const discI = f.supers.findIndex((id) => SUPERS[id].type === 'disc');
  if (!f.isApe && foe.isApe && discI >= 0 && f.ki >= 30 && Math.random() < 0.3) { I.super = discI; return; }
  if (opts.length && Math.random() < [0.18, 0.28, 0.38][D] + (f.ki > 80 ? 0.2 : 0)) { I.super = pick(opts).i; return; }
  if (f.ki < 25 && d > 20 && Math.random() < 0.6) { ai.plan = { charge: true }; ai.t = rand(0.8, 1.6); I.charge = true; return; }
  // offense / movement
  const r = Math.random();
  if (f.isApe) {
    if (d < f.reach + foe.hitR + 1) { I.melee = true; return; }
    if (r < 0.35) { ai.plan = { blast: true, fwd: 0.3 }; ai.t = 0.8; return; }
    ai.plan = { fwd: 1, up: foe.pos.y - f.pos.y > 8 && Math.random() < 0.3 ? 1 : 0 }; return;
  }
  if (d < 3.5) { if (r < 0.75) I.melee = true; else ai.plan = { fwd: -1, side: rand(-1, 1) }; return; }
  if (d < 40 && r < 0.5) { I.melee = true; return; }
  if (r < 0.75) { ai.plan = { blast: true, side: Math.random() < 0.5 ? 1 : -1, fwd: rand(-0.3, 0.5) }; ai.t = rand(0.5, 1.1); return; }
  ai.plan = { fwd: d > 12 ? 1 : 0, side: rand(-1, 1), boost: d > 30 };
}

function playerIntent(f) {
  const I = f.intent; Object.assign(I, blankIntent());
  if (G.state !== 'fight' || G.freeze) return;
  I.fwd = (keys.has('w') ? 1 : 0) - (keys.has('s') ? 1 : 0);
  I.side = (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0);
  I.up = (keys.has(' ') ? 1 : 0) - (keys.has('c') || keys.has('control') ? 1 : 0);
  I.boost = keys.has('shift');
  I.melee = pressed.has('j'); I.blast = keys.has('k'); I.guard = keys.has('l'); I.charge = keys.has('i');
  I.vanish = pressed.has('q'); I.transform = pressed.has('t'); I.revert = pressed.has('r'); I.recover = pressed.has(' ');
  for (const n of ['1', '2', '3', '4']) if (pressed.has(n)) I.super = +n - 1;
  if (G.clash) { I.melee = false; I.blast = false; }
}

// ---------------- camera ----------------
const camPos = V3(0, 10, -20), camLook = V3();
function updateCamera(dt) {
  const [p, e] = G.fighters; if (!p) return;
  let wantPos, wantLook;
  if (G.cine) {
    const c = G.cine, f = c.f; c.t += dt;
    const ctr = f.center(), fw = f.fwd();
    if (c.mode === 'orbit') {
      const ang = f.obj.rotation.y + 0.9 + c.t * 0.5, R = 4.2;
      wantPos = ctr.clone().add(V3(Math.sin(ang) * R, 0.4 - c.t * 0.2, Math.cos(ang) * R)); wantLook = ctr.clone().add(V3(0, 0.3, 0));
    } else if (c.mode === 'ape') {
      const R = 6 + f.S * 3.2; const ang = f.obj.rotation.y + 0.6;
      wantPos = f.pos.clone().add(V3(Math.sin(ang) * R, 1.5 + f.S * 0.7, Math.cos(ang) * R)); wantLook = f.pos.clone().add(V3(0, 1.3 * f.S, 0));
      if (f.act?.phase === 'stare' || f.act?.phase === 'rise') { wantLook = G.moon ? G.moon.position.clone() : ctr.clone().add(V3(0, 20, 0)); wantPos = ctr.clone().addScaledVector(fw, 3).add(V3(0, -0.5, 0)); }
    } else { // front close-up
      wantPos = ctr.clone().addScaledVector(fw, 3.4 * f.S).add(V3(-0.8 * f.S, 0.5 * f.S, 0).applyAxisAngle(V3(0, 1, 0), f.obj.rotation.y)); wantLook = ctr.clone().add(V3(0, 0.55 * f.S, 0));
    }
    if (c.t > c.dur) G.cine = null;
  } else {
    const pc = p.center(), ec = e.center();
    const back = flatDir(ec, pc), right = V3(-back.z, 0, back.x);
    const big = Math.max(p.S, e.S), dist = 6.5 + (p.S - 1) * 3.6 + (e.S > 1 ? 4 : 0);
    const sep = pc.distanceTo(ec);
    wantPos = pc.clone().addScaledVector(back, dist).addScaledVector(right, -1.6 * p.S).add(V3(0, 1.4 + p.S * 0.9 + (e.S > 1 ? 3 : 0) + Math.max(0, (ec.y - pc.y) * -0.3), 0));
    wantLook = pc.clone().lerp(ec, sep > 40 ? 0.35 : 0.55).add(V3(0, big > 1 ? 1.5 : 0.3, 0));
  }
  const k = G.cine && G.cine.t <= dt * 1.01 ? 1 : Math.min(1, dt * (G.cine ? 3 : 6));
  camPos.lerp(wantPos, k); camLook.lerp(wantLook, k === 1 ? 1 : Math.min(1, dt * 10));
  const gh = arena.height(camPos.x, camPos.z) + 1.2; if (camPos.y < gh) camPos.y = gh;
  camera.position.copy(camPos);
  if (G.shake > 0) { camera.position.add(V3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).multiplyScalar(G.shake * 0.35)); G.shake = Math.max(0, G.shake - dt * 3); }
  camera.lookAt(camLook);
  sun.position.copy(p.pos).addScaledVector(SUN_DIR, 150); sun.target.position.copy(p.pos);
  const sc = Math.max(p.S, e.S) > 1 ? 90 : 50; if (sun.shadow.camera.right !== sc) { Object.assign(sun.shadow.camera, { left: -sc, right: sc, top: sc, bottom: -sc }); sun.shadow.camera.updateProjectionMatrix(); }
  document.body.classList.toggle('cine', !!G.cine || G.state === 'intro');
}

// ---------------- HUD ----------------
function setPic(img, f) {
  const key = f.isApe ? 'ape' : f.form.id + (f.hp < f.maxHp * 0.3 ? 'h' : '');
  if (img.dataset.k !== key) { img.dataset.k = key; img.src = portraitURL(f.hero, f.isApe ? { ape: true } : f.form, f.def.look, f.hp < f.maxHp * 0.3 ? 'hurt' : 'neutral'); }
}
let cmdKey = '';
function updateHUD(dt) {
  const [p, e] = G.fighters; if (!p) return;
  const pct = (f) => Math.max(0, f.hp / f.maxHp * 100) + '%';
  $('pHp').style.width = pct(p); $('pHpLag').style.width = pct(p); $('pHpNum').textContent = Math.ceil(p.hp);
  $('pKi').style.width = p.ki + '%'; $('pKiNum').textContent = Math.floor(p.ki);
  // enemy bar shows layered segments like Kakarot
  const seg = e.maxHp / 3, layers = Math.max(0, Math.ceil(e.hp / seg)), inSeg = e.hp - (layers - 1) * seg;
  $('eHp').style.width = (layers ? inSeg / seg * 100 : 0) + '%'; $('eHpLag').style.width = $('eHp').style.width;
  $('eLayers').textContent = 'x' + layers; $('eKi').style.width = e.ki + '%'; $('eStun').style.width = Math.min(100, e.stun) + '%';
  setPic($('pPic'), p); setPic($('ePic'), e);
  $('formTag').textContent = p.isApe ? `GREAT APE ${Math.ceil(p.apeT)}s` : p.form.name.toUpperCase();
  $('eFormTag').textContent = e.isApe ? `GREAT APE ${Math.ceil(e.apeT)}s` : e.form.name.toUpperCase();
  const nx = p.def.forms[p.formIdx + 1];
  const k = p.supers.join() + '|' + p.formIdx + '|' + Math.floor(p.ki / 5) + p.isApe + p.tailCut;
  if (k !== cmdKey) {
    cmdKey = k;
    let h = p.supers.map((id, i) => { const S = SUPERS[id]; return `<div class="cmd-item ${p.ki < S.cost || (S.type === 'transform' && p.tailCut) ? 'off' : ''}"><kbd>${i + 1}</kbd>${S.name}<span class="cost">${S.cost} KI</span></div>`; }).join('');
    if (nx && !p.isApe && !(nx.ape && p.tailCut)) h += `<div class="cmd-item trans ${p.ki < nx.cost ? 'off' : ''}"><kbd>T</kbd>${nx.name}<span class="cost">${nx.cost} KI</span></div>`;
    if (p.formIdx > 0) h += `<div class="cmd-item trans"><kbd>R</kbd>Revert to Base</div>`;
    $('cmdList').innerHTML = h;
  }
  G.comboT -= dt; $('combo').style.opacity = G.comboT > 0 && G.combo > 1 ? 1 : 0; $('comboN').textContent = G.combo;
  if (G.dlgT > 0) { G.dlgT -= dt; if (G.dlgT <= 0 && G.state !== 'intro') $('dlg').classList.add('hidden'); }
  $('speed').style.opacity = (p.intent.boost && !p.act && (p.intent.fwd || p.intent.side)) || p.act?.type === 'rush' || (p.act?.type === 'super' && p.act.phase === 'dash') ? 0.8 : 0;
}

// ---------------- flow ----------------
function buildCards(step) {
  const cards = $('cards'); cards.innerHTML = '';
  $('selTitle').textContent = step === 0 ? (G.mode === 'training' ? 'TRAINING — CHOOSE YOUR FIGHTER' : 'CHOOSE YOUR FIGHTER') : (G.mode === 'training' ? 'CHOOSE A SPARRING PARTNER' : 'CHOOSE YOUR RIVAL');
  for (const def of Object.values(ROSTER)) {
    const c = document.createElement('div'); c.className = 'card';
    const forms = def.forms.map((f) => f.name).join(' → ');
    c.innerHTML = `<img src="${portraitURL(def.hero, def.forms[0], def.look, 'neutral')}"><div class="ct"><b>${def.name}</b><span>${def.saga} · Lv ${def.level}</span><small>${forms}</small></div>`;
    c.onclick = () => { sfx.ui(); if (step === 0) { G.pick = def.id; buildCards(1); } else startMatch(G.pick, def.id, +$('diff').value); };
    cards.appendChild(c);
  }
}
function startMatch(pid, eid, diff, mode = G.mode || 'versus') {
  SS.setItem('match', JSON.stringify({ pid, eid, diff, mode }));
  if (G.fighters.length) { location.reload(); return; }
  G.diff = diff; G.mode = mode;
  for (const s of ['title', 'select', 'result', 'pause']) $(s).classList.add('hidden');
  const p = new Fighter(ROSTER[pid], true), e = new Fighter(ROSTER[eid], false);
  G.fighters = [p, e];
  p.pos.set(0, arena.height(0, 6) + 1.5, 6); e.pos.set(8, arena.height(8, 30) + 3, 30);
  p.obj.rotation.y = Math.atan2(e.pos.x - p.pos.x, e.pos.z - p.pos.z); e.obj.rotation.y = p.obj.rotation.y + Math.PI;
  $('pName').textContent = p.def.name; $('eName').textContent = e.def.name; $('pLvl').textContent = p.def.level; $('eLvl').textContent = e.def.level;
  camPos.copy(p.center()).add(V3(-4, 3, -8)); camLook.copy(e.center());
  $('hud').classList.remove('hidden');
  if (mode === 'training') {
    G.diff = 0; $('train').classList.remove('hidden'); updateTrainPanel();
    G.state = 'fight'; G.fightStart = G.time; banner('TRAINING'); return;
  }
  const lines = introFor(p.def, e.def);
  G.intro = { lines: lines.map(([who, text], i) => ({ f: p.hero === e.hero ? (i % 2 ? e : p) : who === p.hero ? p : e, text })), i: -1, t: 0 };
  G.state = 'intro'; nextLine();
}
function nextLine() {
  const I = G.intro; I.i++; I.t = 0; G.lineAt = performance.now();
  if (I.i >= I.lines.length) { beginFight(); return; }
  const L = I.lines[I.i]; say(L.f, L.text, 99, I.i % 2 ? 'angry' : 'neutral'); L.f.exprT = 2;
  G.cine = { f: L.f, t: 0, dur: 99, mode: 'front' };
}
function beginFight() {
  G.intro = null; G.cine = null; G.state = 'fight'; G.fightStart = G.time; $('dlg').classList.add('hidden');
  banner('FIGHT!'); sfx.boom(false);
}
function showResult(won, winner) {
  G.state = 'result'; G.timeScale = 1;
  $('resTitle').textContent = won ? 'VICTORY' : 'DEFEAT';
  $('resLine').textContent = `${winner.def.name} (${winner.def.saga}) wins. “${$('dlgText').textContent}”`;
  $('result').classList.remove('hidden');
}
function togglePause() {
  if (G.state === 'fight') { G.state = 'paused'; $('pause').classList.remove('hidden'); }
  else if (G.state === 'paused') { G.state = 'fight'; $('pause').classList.add('hidden'); }
}
$('trainBtn').onclick = () => { G.mode = 'training'; $('startBtn').onclick(true); };
$('startBtn').onclick = (tr) => { if (tr !== true) G.mode = 'versus'; initAudio(); sfx.ui(); $('title').classList.add('hidden'); $('select').classList.remove('hidden'); buildCards(0); };
$('backBtn').onclick = () => { $('select').classList.add('hidden'); $('title').classList.remove('hidden'); };
$('resumeBtn').onclick = togglePause;
$('quitBtn').onclick = $('selBtn').onclick = () => { SS.removeItem('match'); SS.setItem('goSelect', '1'); location.reload(); };
$('rematchBtn').onclick = () => location.reload();
addEventListener('keydown', (e) => { if (G.state === 'intro' && performance.now() - G.lineAt > 350 && (e.key === 'Enter' || e.key === ' ')) nextLine(); });
addEventListener('click', () => { if (G.state === 'intro' && performance.now() - G.lineAt > 350) nextLine(); });

// ---------------- training mode ----------------
const TRAIN_MODES = ['Stand', 'Guard', 'Blast', 'Fight'];
G.train = { dummy: 0, infKi: true, dmg: 0, best: 0, bestDmg: 0 };
function updateTrainPanel() {
  const T = G.train;
  $('trDummy').textContent = TRAIN_MODES[T.dummy]; $('trKi').textContent = T.infKi ? 'ON' : 'OFF';
  $('trBest').textContent = `${T.best} hits · ${Math.round(T.bestDmg)} dmg`;
}
function resetTraining() {
  const [p, e] = G.fighters; for (const f of [p, e]) { f.endAct(); if (f.isApe) f.revertApe('manual'); f.setForm(0, true); f.hp = f.maxHp; f.ki = 100; f.stun = 0; f.vel.set(0, 0, 0); }
  p.pos.set(0, arena.height(0, 6) + 1.5, 6); e.pos.set(8, arena.height(8, 30) + 3, 30); G.proj.forEach((q) => scene.remove(q.mesh)); G.proj.length = 0; banner('RESET');
}
let trLastHp = 0;
function updateTraining(dt) {
  const T = G.train, [p, e] = G.fighters;
  if (pressed.has('f')) { T.dummy = (T.dummy + 1) % TRAIN_MODES.length; e.endAct(); updateTrainPanel(); sfx.ui(); }
  if (pressed.has('g')) { T.infKi = !T.infKi; updateTrainPanel(); sfx.ui(); }
  if (pressed.has('h')) resetTraining();
  if (T.infKi) p.ki = 100;
  // combo damage tracking
  if (e.hp < trLastHp) T.dmg += trLastHp - e.hp;
  if (G.comboT <= 0 && T.dmg > 0) T.dmg = 0;
  if (G.comboT > 0 && (G.combo > T.best || T.dmg > T.bestDmg)) { T.best = Math.max(T.best, G.combo); T.bestDmg = Math.max(T.bestDmg, T.dmg); updateTrainPanel(); }
  $('trNow').textContent = G.comboT > 0 ? `${G.combo} hits · ${Math.round(T.dmg)} dmg` : '—';
  // dummy recovers after 3s without being hit
  if (G.time - e.lastHitT > 3 && e.hp < e.maxHp) e.hp = Math.min(e.maxHp, e.hp + e.maxHp * dt);
  if (G.time - p.lastHitT > 3 && p.hp < p.maxHp) p.hp = Math.min(p.maxHp, p.hp + p.maxHp * dt * 0.5);
  trLastHp = e.hp;
}

// ---------------- loop ----------------
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  let rdt = Math.min(0.05, (now - last) / 1000); last = now;
  if (G.state === 'paused') { pressed.clear(); composer.render(); return; }
  if (G.state === 'ko' || G.state === 'result') { G.koT = (G.koT || 0) + rdt; if (G.koT > 1.6) G.timeScale = Math.min(1, G.timeScale + rdt); }
  let dt = rdt * G.timeScale;
  if (G.hitstop > 0) { G.hitstop -= rdt; dt *= 0.05; }
  G.time += dt;
  const [p, e] = G.fighters;
  if (p) {
    if (G.state === 'intro') { G.intro.t += rdt; if (G.intro.t > 5.5) nextLine(); }
    if (window.AUTOPLAY) { p.ai ||= { t: 0, plan: null, planT: 0, react: 0, hold: null, holdT: 0 }; aiThink(p, dt); } else playerIntent(p); aiThink(e, dt);
    for (const f of G.fighters) if (!G.freeze || G.freeze === f) f.update(dt);
    // body separation
    const d = p.center().distanceTo(e.center()), min = (p.hitR + e.hitR) * 0.9;
    if (d < min && p.act?.type !== 'knock' && e.act?.type !== 'knock') { const n = e.center().sub(p.center()).normalize().multiplyScalar((min - d) * 0.5); p.pos.sub(n); e.pos.add(n); }
    if (!G.freeze) updateProj(dt);
    updateClash(dt);
    updateHUD(rdt);
    if (G.mode === 'training') updateTraining(rdt);
  } else { G.titleT = (G.titleT || 0) + rdt; }
  arena.update(dt); fx.update(dt);
  if (p) updateCamera(rdt);
  else { const a = G.titleT * 0.08; camera.position.set(Math.cos(a) * 60, 25, Math.sin(a) * 60 + 30); camera.lookAt(8, 2, 30); }
  pressed.clear();
  composer.render();
}
$('loading').classList.add('hidden');
requestAnimationFrame(frame);

// auto-resume rematch / go to select
const saved = SS.getItem('match');
if (saved) { const m = JSON.parse(saved); $('title').classList.add('hidden'); addEventListener('pointerdown', initAudio, { once: true }); addEventListener('keydown', initAudio, { once: true }); startMatch(m.pid, m.eid, m.diff, m.mode); }
else if (SS.getItem('goSelect')) { SS.removeItem('goSelect'); $('title').classList.add('hidden'); $('select').classList.remove('hidden'); buildCards(0); addEventListener('pointerdown', initAudio, { once: true }); }
