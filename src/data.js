// Roster, forms, super attacks and dialogue.

export const ROSTER = {
  goku_ss: {
    id: 'goku_ss', hero: 'goku', name: 'Goku', saga: 'Saiyan Saga', level: 24,
    look: { armor: null, kanji: '亀', backKanji: '亀', tail: false, scouter: false },
    forms: [
      { id: 'base', name: 'Base', pow: 1, spd: 1, drain: 0, cost: 0, aura: 0xdfeaff, hair: 0x15161c, style: 'turtle', blast: 'orb',
        supers: ['kamehameha', 'jankenPunch', 'destructo', 'afterimageStrike'], ult: 'spiritBomb' },
      { id: 'kaio', name: 'Kaio-ken', pow: 1.3, spd: 1.25, drain: 90, cost: 25, aura: 0xff2a1a, tint: 0xff6a55, hair: 0x15161c, style: 'kaio', blast: 'rapid',
        supers: ['kaioKame', 'kaioAttack', 'kaioBarrage', 'destructo'], ult: 'kaioFinish' },
      { id: 'kaio3', name: 'Kaio-ken x3', pow: 1.65, spd: 1.45, drain: 200, cost: 40, aura: 0xff1010, tint: 0xff4433, hair: 0x15161c, style: 'kaio', blast: 'rapid',
        supers: ['kaioKame3', 'kaioAttack', 'kaioBarrage', 'destructo'], ult: 'spiritBomb' },
    ],
  },
  goku_nm: {
    id: 'goku_nm', hero: 'goku', name: 'Goku', saga: 'Namek Saga', level: 41,
    look: { armor: null, kanji: '悟', backKanji: '亀', tail: false, scouter: false },
    forms: [
      { id: 'base', name: 'Base', pow: 1.1, spd: 1.05, drain: 0, cost: 0, aura: 0xdfeaff, hair: 0x15161c, style: 'turtle', blast: 'orb',
        supers: ['kamehameha', 'meteorSmash', 'destructo', 'kiBlastCannon'], ult: 'spiritBomb' },
      { id: 'kaio20', name: 'Kaio-ken x20', pow: 1.55, spd: 1.4, drain: 260, cost: 30, aura: 0xff1a10, tint: 0xff5540, hair: 0x15161c, style: 'kaio', blast: 'rapid',
        supers: ['kaioKame20', 'kaioAttack', 'meteorSmash', 'kaioBarrage'], ult: 'kaioFinish' },
      { id: 'ssj', name: 'Super Saiyan', pow: 2.0, spd: 1.5, drain: 0, cost: 60, aura: 0xffd23a, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true, style: 'ssj', blast: 'heavy',
        supers: ['superKame', 'superMeteor', 'angryKame', 'energyBurst'], ult: 'hopeOfUniverse' },
    ],
  },
  goku_z: {
    id: 'goku_z', hero: 'goku', name: 'Z Goku', saga: 'Buu Saga', level: 72,
    look: { armor: null, kanji: '悟', backKanji: '悟', tail: false, scouter: false },
    forms: [
      { id: 'base', name: 'Base', pow: 1.3, spd: 1.15, drain: 0, cost: 0, aura: 0xdfeaff, hair: 0x15161c, style: 'turtle', blast: 'orb',
        supers: ['kamehameha', 'meteorCombination', 'instantKame', 'kiBlastCannon'], ult: 'superSpiritBomb' },
      { id: 'ssj', name: 'Super Saiyan', pow: 1.75, spd: 1.4, drain: 0, cost: 35, aura: 0xffd23a, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true, style: 'ssj', blast: 'heavy',
        supers: ['superKame', 'instantKame', 'superMeteor', 'energyBurst'], ult: 'meteorCombination' },
      { id: 'ssj2', name: 'Super Saiyan 2', pow: 2.15, spd: 1.55, drain: 0, cost: 50, aura: 0xffe04a, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true, ssj2: true, style: 'ssj2', blast: 'heavy',
        supers: ['ssj2Kame', 'ssj2Rush', 'angryKame', 'energyBurst'], ult: 'ssj2Finish' },
      { id: 'ssj3', name: 'Super Saiyan 3', pow: 2.6, spd: 1.5, drain: 80, cost: 70, aura: 0xffea5a, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true, long: true, ssj2: true, noBrow: true, style: 'ssj3', blast: 'heavy',
        supers: ['ssj3Kame', 'dragonFist', 'ssj3Wave', 'ssj2Rush'], ult: 'dragonFistExplosion' },
    ],
  },
  vegeta_ss: {
    id: 'vegeta_ss', hero: 'vegeta', name: 'Vegeta', saga: 'Saiyan Saga', level: 26,
    look: { armor: 'saiyan', tail: true, scouter: true },
    forms: [
      { id: 'base', name: 'Base', pow: 1.05, spd: 1.05, drain: 0, cost: 0, aura: 0xd8c8ff, hair: 0x14131a, style: 'elite', blast: 'orb',
        supers: ['galickGun', 'explosiveWave', 'dirtyFireworks', 'eliteRush'], ult: 'galickGunMax' },
      { id: 'full', name: 'Full Power', pow: 1.4, spd: 1.3, drain: 0, cost: 30, aura: 0xb06cff, hair: 0x14131a, style: 'elite', blast: 'rapid',
        supers: ['galickGun', 'burstAttack', 'dirtyFireworks', 'explosiveWave'], ult: 'galickGunMax' },
      { id: 'ape', name: 'Great Ape', pow: 2.2, spd: 0.8, drain: 0, cost: 50, aura: 0xff4040, ape: true, style: 'ape', blast: 'mouth',
        supers: ['mouthBlast', 'stompQuake', 'apeRoar', 'apeCrush'], ult: 'apeRampage' },
    ],
  },
  vegeta_nm: {
    id: 'vegeta_nm', hero: 'vegeta', name: 'Vegeta', saga: 'Namek Saga', level: 40,
    look: { armor: 'namek', tail: false, scouter: false },
    forms: [
      { id: 'base', name: 'Base', pow: 1.1, spd: 1.1, drain: 0, cost: 0, aura: 0xd8c8ff, hair: 0x14131a, style: 'elite', blast: 'orb',
        supers: ['galickGun', 'explosiveWave', 'dirtyFireworks', 'bigTreeCannon'], ult: 'finalImpact' },
      { id: 'zenkai', name: 'Zenkai Surge', pow: 1.5, spd: 1.35, drain: 0, cost: 30, aura: 0x8f5bff, hair: 0x14131a, style: 'elite', blast: 'rapid',
        supers: ['galickGun', 'eliteRush', 'explosiveWave', 'finalImpact'], ult: 'galickGunMax' },
      { id: 'ssj', name: 'Super Saiyan (What-If)', pow: 2.0, spd: 1.5, drain: 0, cost: 60, aura: 0xffd23a, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true, style: 'prince', blast: 'heavy',
        supers: ['bigBang', 'finalImpact', 'princeRush', 'explosiveWave'], ult: 'finalFlash' },
    ],
  },
  vegeta_majin: {
    id: 'vegeta_majin', hero: 'vegeta', name: 'Majin Vegeta', saga: 'Buu Saga', level: 70,
    look: { armor: 'namek', tail: false, scouter: false },
    forms: [
      { id: 'base', name: 'Base', pow: 1.3, spd: 1.2, drain: 0, cost: 0, aura: 0xd8c8ff, hair: 0x14131a, style: 'prince', blast: 'rapid',
        supers: ['bigBang', 'galickGun', 'dirtyFireworks', 'princeRush'], ult: 'finalFlash' },
      { id: 'ssj', name: 'Super Saiyan', pow: 1.75, spd: 1.4, drain: 0, cost: 35, aura: 0xffd23a, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true, style: 'prince', blast: 'heavy',
        supers: ['bigBang', 'finalFlash', 'princeRush', 'explosiveWave'], ult: 'finalFlashMax' },
      { id: 'majin', name: 'Majin Super Saiyan 2', pow: 2.3, spd: 1.55, drain: 0, cost: 60, aura: 0xffc830, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true, ssj2: true, majin: true, style: 'majin', blast: 'heavy',
        supers: ['bigBangMax', 'majinRage', 'finalFlash', 'majinWave'], ult: 'finalExplosion' },
    ],
  },
  piccolo_nm: {
    id: 'piccolo_nm', hero: 'piccolo', name: 'Piccolo', saga: 'Namek Saga', level: 38,
    look: {},
    forms: [
      { id: 'base', name: 'Weighted Cape', pow: 1.05, spd: 1.0, drain: 0, cost: 0, aura: 0xf2ffe0, style: 'demon', blast: 'spread', look: 'cape',
        supers: ['specialBeamCannon', 'demonHand', 'evilBlast', 'hellzone'], ult: 'specialBeamCannonMax' },
      { id: 'unweighted', name: 'Weights Off', pow: 1.35, spd: 1.4, drain: 0, cost: 20, aura: 0xd8ff9a, style: 'demonFast', blast: 'spread', look: 'bare',
        supers: ['specialBeamCannon', 'hellzone', 'demonSlam', 'demonHand'], ult: 'hellzoneMax' },
      { id: 'nail', name: 'Fused with Nail', pow: 1.9, spd: 1.5, drain: 0, cost: 55, aura: 0x9dff6a, style: 'namekian', blast: 'spread', look: 'bare',
        supers: ['lightGrenade', 'demonWave', 'hellzone', 'demonSlam'], ult: 'specialBeamCannonMax' },
    ],
  },
  frieza_nm: {
    id: 'frieza_nm', hero: 'frieza', name: 'Frieza', saga: 'Namek Saga', level: 50,
    look: {},
    forms: [
      { id: 'first', name: 'First Form', pow: 1.1, spd: 1.0, drain: 0, cost: 0, aura: 0xd8b0ff, look: 'first', eyes: 0xb0102a, style: 'tyrant', blast: 'laser',
        supers: ['deathBeam', 'psychoThrow', 'deathSaucer', 'tailRush'], ult: 'supernova' },
      { id: 'second', name: 'Second Form', pow: 1.45, spd: 1.1, drain: 0, cost: 30, aura: 0xc080ff, look: 'second', eyes: 0xb0102a, style: 'brute', blast: 'laser',
        supers: ['deathBeam', 'hornCharge', 'deathWave', 'psychoThrow'], ult: 'deathBall' },
      { id: 'final', name: 'Final Form', pow: 1.8, spd: 1.45, drain: 0, cost: 45, aura: 0xb070ff, look: 'final', eyes: 0xb0102a, style: 'tyrant', blast: 'laser',
        supers: ['deathBeamBarrage', 'deathSaucer', 'novaStrike', 'deathWave'], ult: 'deathBall' },
      { id: 'full', name: '100% Full Power', pow: 2.25, spd: 1.55, drain: 110, cost: 60, aura: 0xff4de0, look: 'full', eyes: 0xb0102a, style: 'emperor', blast: 'laser',
        supers: ['emperorBeam', 'novaStrike', 'deathBeamBarrage', 'deathSaucer'], ult: 'supernova' },
    ],
  },
};

const B = (name, cost, dmg, color, o = {}) => ({ name, type: 'beam', cost, dmg, color, charge: 0.9, width: 1.1, pose: 'kame', ...o });
const RU = (name, cost, dmg, color, hits, o = {}) => ({ name, type: 'rush', cost, dmg, color, hits, ...o });
const AO = (name, cost, dmg, color, radius, o = {}) => ({ name, type: 'aoe', cost, dmg, color, radius, ...o });
const BA = (name, cost, dmg, color, count, o = {}) => ({ name, type: 'barrage', cost, dmg, color, count, ...o });
const BL = (name, cost, dmg, color, size, charge, o = {}) => ({ name, type: 'ball', cost, dmg, color, size, charge, ...o });
const GR = (name, cost, dmg, color, range, o = {}) => ({ name, type: 'grab', cost, dmg, color, range, ...o });
const U = (o) => ({ ...o, cost: 100, ult: true });

// type: beam | rush | aoe | ball | disc | barrage | roar | grab | transform
export const SUPERS = {
  // ---- Goku
  kamehameha: B('Kamehameha', 35, 1500, 0x5fc8ff),
  kaioKame: B('Kaio-ken Kamehameha', 40, 1900, 0xff6a6a, { width: 1.3 }),
  kaioKame3: B('Kamehameha x3', 50, 2400, 0xff5050, { width: 1.6 }),
  kaioKame20: B('Kaio-ken x20 Kamehameha', 55, 2800, 0xff4a4a, { width: 1.9 }),
  superKame: B('Super Kamehameha', 55, 2700, 0x7fdcff, { charge: 1.2, width: 1.9 }),
  angryKame: B('Angry Kamehameha', 45, 2300, 0x9fe8ff, { charge: 0.5, width: 1.5 }),
  instantKame: B('Instant Transmission Kamehameha', 50, 2500, 0x7fdcff, { charge: 0.7, width: 1.5, teleport: true }),
  ssj2Kame: B('Super Kamehameha (SSJ2)', 60, 3100, 0x8fe4ff, { charge: 1.0, width: 2.1 }),
  ssj3Kame: B('Super Kamehameha (SSJ3)', 70, 3600, 0xa8f0ff, { charge: 1.1, width: 2.5 }),
  kiBlastCannon: B('Ki Blast Cannon', 30, 1300, 0xfff08a, { charge: 0.4, width: 1.4, pose: 'palm', firePose: 'palm' }),
  jankenPunch: RU('Jan Ken: Rock!', 30, 1400, 0xffe2a0, 4),
  afterimageStrike: RU('Afterimage Strike', 25, 1100, 0xdfeaff, 5),
  kaioAttack: RU('Kaio-ken Attack', 30, 1700, 0xff3020, 8),
  meteorSmash: RU('Meteor Smash', 30, 1700, 0xfff0a0, 8),
  superMeteor: RU('Super Meteor Smash', 40, 2300, 0xffe24a, 10),
  meteorCombination: RU('Meteor Combination', 45, 2600, 0x9fdcff, 12),
  ssj2Rush: RU('Lightning Rush', 45, 2800, 0xfff3a0, 12),
  dragonFist: RU('Dragon Fist', 60, 3400, 0xffd23a, 6),
  kaioBarrage: BA('Kaio-ken Barrage', 35, 1600, 0xff5a4a, 28),
  destructo: { name: 'Destructo Disc', type: 'disc', cost: 30, dmg: 1300, color: 0xfff27a },
  energyBurst: AO('Super Explosive Wave', 40, 1900, 0xfff08a, 12),
  ssj3Wave: AO('Ascended Burst', 50, 2600, 0xfff4a0, 16),
  spiritBomb: U(BL('Spirit Bomb', 0, 5200, 0x9fe8ff, 5, 2.6)),
  superSpiritBomb: U(BL('Super Spirit Bomb', 0, 6500, 0xb6f0ff, 8, 3.0)),
  kaioFinish: U(RU('Kaio-ken Finish', 0, 5000, 0xff2a1a, 16)),
  hopeOfUniverse: U(RU('Hope of the Universe', 0, 5600, 0xffe24a, 14)),
  ssj2Finish: U(B('Kamehameha Finish', 0, 6000, 0x9fe8ff, { charge: 1.2, width: 3 })),
  dragonFistExplosion: U(RU('Dragon Fist Explosion', 0, 7000, 0xffd23a, 10)),
  // ---- Vegeta
  galickGun: B('Galick Gun', 35, 1550, 0xc070ff, { pose: 'galick' }),
  galickGunMax: U(B('Galick Gun: Full Power', 0, 5200, 0xb060ff, { pose: 'galick', charge: 1.4, width: 2.8 })),
  bigTreeCannon: B('Big Tree Cannon', 35, 1450, 0xe8a0ff, { pose: 'point', firePose: 'point', charge: 0.5, width: 0.8 }),
  finalImpact: B('Final Impact', 55, 2700, 0x9fd8ff, { charge: 1.0, width: 2.0, pose: 'palm' }),
  finalFlash: B('Final Flash', 65, 3200, 0xfff4a0, { charge: 1.3, width: 2.4, pose: 'palm' }),
  finalFlashMax: U(B('Final Flash: Full Power', 0, 6200, 0xfff4a0, { charge: 1.6, width: 3.4, pose: 'palm' })),
  bigBang: BL('Big Bang Attack', 45, 2300, 0x8fd0ff, 1.6, 0.6, { speed: 55, pose: 'blastR' }),
  bigBangMax: BL('Big Bang Attack (Majin)', 55, 2900, 0x9fe0ff, 2.2, 0.6, { speed: 55, pose: 'blastR' }),
  explosiveWave: AO('Explosive Wave', 35, 1500, 0xd9b8ff, 11),
  majinWave: AO('Majin Shockwave', 45, 2300, 0xffd070, 15),
  dirtyFireworks: BA('Rapid Fire Barrage', 35, 1600, 0xffe080, 26),
  eliteRush: RU('Elite Beatdown', 30, 1600, 0xc8a0ff, 7),
  burstAttack: RU('Burst Attack', 35, 1900, 0xb06cff, 9),
  princeRush: RU('Prince\'s Pride', 40, 2400, 0xffd23a, 10),
  majinRage: RU('Majin Rage', 45, 2900, 0xffc830, 12),
  finalExplosion: U(AO('Final Explosion', 0, 8000, 0xfff6c0, 32, { selfDmg: 0.35 })),
  powerBall: { name: 'Power Ball → Great Ape', type: 'transform', cost: 50, color: 0xfff4c0 },
  // ---- Great Ape
  mouthBlast: B('Mouth Energy Wave', 30, 2200, 0xff7aa0, { charge: 0.8, width: 2.6, pose: 'roar' }),
  stompQuake: AO('Stomp Quake', 30, 1800, 0xffa060, 22),
  apeRoar: { name: 'Primal Roar', type: 'roar', cost: 25, dmg: 400, color: 0xff6060, radius: 30 },
  apeCrush: RU('Great Ape Crush', 30, 2100, 0xff5050, 4),
  apeRampage: U(BA('Great Ape Rampage', 0, 5200, 0xff7aa0, 30)),
  // ---- Piccolo
  specialBeamCannon: B('Special Beam Cannon', 45, 2300, 0xffe36a, { charge: 1.5, width: 0.5, pose: 'sbc', firePose: 'point' }),
  specialBeamCannonMax: U(B('Special Beam Cannon: Max', 0, 6000, 0xffe36a, { charge: 2.2, width: 0.9, pose: 'sbc', firePose: 'point' })),
  evilBlast: B('Evil Explosion', 30, 1400, 0xfff08a, { charge: 0.5, width: 1.3, pose: 'palm', firePose: 'palm' }),
  demonWave: B('Explosive Demon Wave', 50, 2700, 0xfff6a0, { charge: 0.9, width: 1.9, pose: 'palm' }),
  hellzone: BA('Hellzone Grenade', 40, 1800, 0xfff08a, 30),
  hellzoneMax: U(BA('Hellzone Grenade: Encirclement', 0, 5200, 0xfff08a, 60)),
  lightGrenade: BL('Light Grenade', 55, 2600, 0xfff6a0, 2.4, 1.1, { speed: 42 }),
  demonSlam: RU('Demon Slam', 30, 1700, 0xb6ff7a, 6),
  demonHand: GR('Demon Hand', 25, 1400, 0x9dff6a, 14),
  // ---- Frieza
  deathBeam: B('Death Beam', 20, 1000, 0xff5ad0, { charge: 0.35, width: 0.3, pose: 'point', firePose: 'point' }),
  emperorBeam: B('Emperor\'s Death Beam', 55, 2900, 0xff4de0, { charge: 0.8, width: 1.4, pose: 'point', firePose: 'point' }),
  deathBeamBarrage: BA('Death Beam Barrage', 35, 1700, 0xff5ad0, 22, { laser: true }),
  deathSaucer: { name: 'Death Saucer', type: 'disc', cost: 30, dmg: 1300, color: 0xff7ae0 },
  novaStrike: RU('Nova Strike', 35, 2000, 0xd070ff, 7),
  tailRush: RU('Tail Assault', 25, 1300, 0xe0c0ff, 6),
  hornCharge: RU('Horn Charge', 30, 1800, 0xc080ff, 5),
  deathWave: AO('Death Wave', 35, 1800, 0xff6ad8, 14),
  psychoThrow: GR('Psycho Kinesis', 25, 1500, 0xff7ae0, 35, { tele: true }),
  deathBall: U(BL('Death Ball', 0, 5800, 0xff6a3a, 6, 2.2)),
  supernova: U(BL('Supernova', 0, 6400, 0xffb03a, 7, 2.4)),
};

export const PALETTES = {
  goku: { skin: 0xffd3ab, gi: 0xff7a18, under: 0x1f3d9c, belt: 0x1f3d9c, boot: 0x1f3d9c, bootTrim: 0xd23b2a, band: 0x1f3d9c },
  piccolo: { skin: 0x71b84a, gi: 0x5b2c8c, sash: 0x3a7fd8, shoe: 0x7a4a26, patch: 0xd9828f, cape: 0xf4f4f0 },
  frieza: { skin: 0xf6f2f6, gem: 0x8a3cc4, horn: 0x3a2a44, armor: 0xf0eee8, pad: 0x6a3a8a, suit: 0x2a2a38 },
  vegeta: { skin: 0xf6c9a0, suit: 0x1c2b7a, armor: 0xf3f1e8, pad: 0xd8ae45, glove: 0xf7f7f2, boot: 0xf7f7f2, bootTip: 0xe0b83c, tail: 0x6a3f22 },
};

const INTRO = {
  'ss-ss': [
    ['vegeta', 'So you are Kakarot. A low-class warrior who calls this mud-ball planet home.'],
    ['goku', 'You came all this way and hurt my friends. I won\'t let you walk away from that.'],
    ['vegeta', 'Your power level is laughable. Nappa was a fool — I am the Prince of all Saiyans!'],
    ['goku', 'Then let\'s find out, prince. Believe it or not, battles aren\'t just about strength!'],
  ],
  'nm-nm': [
    ['vegeta', 'Kakarot. You\'ve grown... but on Namek, the Dragon Balls — and the crown — are mine.'],
    ['goku', 'Vegeta, we don\'t have time for this. Frieza is still out there!'],
    ['vegeta', 'Frieza can wait. First I prove there is only ONE Saiyan who matters.'],
    ['goku', 'Heh. Alright. I\'ve been itching to see how strong you got too!'],
  ],
  'ss-nm': [
    ['vegeta', 'What is this? Kakarot... as weak as the day he first crawled out of a pod?'],
    ['goku', 'Vegeta? You look different. Stronger. Where did you come from?'],
    ['vegeta', 'Namek, fool. Every near-death has made me stronger. You are a relic of my past.'],
    ['goku', 'Relic or not, I don\'t back down from a good fight!'],
  ],
  'nm-ss': [
    ['goku', 'Vegeta... with your scouter and the old armor. This is like the day we first met.'],
    ['vegeta', 'Met? Hah! I\'ve never seen you before, but your power level... it\'s over 9000?!'],
    ['goku', 'A lot happened after Earth. I\'ll show you what King Kai\'s training really means.'],
    ['vegeta', 'Impossible! No low-class Saiyan can surpass an elite! Prepare yourself!'],
  ],
};

const PAIR = {
  'frieza-goku': [
    ['frieza', 'So you are the monkey who has been causing my men so much trouble. How quaint.'],
    ['goku', 'You\'re Frieza. You hurt Krillin... and you destroyed the Saiyans\' home. I won\'t forgive you.'],
    ['frieza', 'Forgive me? Ho ho ho! You speak as though you have a choice.'],
    ['goku', 'Everyone\'s counting on me. Let\'s settle this — right here!'],
  ],
  'frieza-vegeta': [
    ['vegeta', 'Frieza! For years I bowed to you. Today the Prince of all Saiyans takes back his pride!'],
    ['frieza', 'Vegeta, my loyal little monkey. Have the Dragon Balls gone to your head?'],
    ['vegeta', 'You murdered my father and destroyed my planet. I will make you scream!'],
    ['frieza', 'Such passion. It will make breaking you all the sweeter.'],
  ],
  'frieza-piccolo': [
    ['piccolo', 'You\'ve spilled enough Namekian blood on this planet, Frieza.'],
    ['frieza', 'A Namekian with some fight in him? How novel. You\'ll make a fine trophy.'],
    ['piccolo', 'Nail\'s power flows through me now. You won\'t find me as easy as the villagers.'],
    ['frieza', 'Then do entertain me, slug.'],
  ],
  'goku-piccolo': [
    ['piccolo', 'Goku. Our truce ends the moment this is over — so fight me seriously.'],
    ['goku', 'Heh, you never change, Piccolo. But you\'ve gotten a lot stronger, huh?'],
    ['piccolo', 'Strong enough to finally beat you. Don\'t hold back.'],
    ['goku', 'Wouldn\'t dream of it. Let\'s go!'],
  ],
  'piccolo-vegeta': [
    ['vegeta', 'The Namekian. You\'re a long way from being a match for a Saiyan elite.'],
    ['piccolo', 'You talk too much for someone who lost to a low-class warrior.'],
    ['vegeta', 'You insolent green — I\'ll tear those antennae right off your head!'],
    ['piccolo', 'Try it.'],
  ],
};
const MIRROR = {
  goku: ['Whoa, another me? This is gonna be fun!', 'Guess we\'ll see which of us trained harder!'],
  vegeta: ['An imposter wearing my face? There is only ONE Prince!', 'Then prove it, fool!'],
  piccolo: ['A copy... Another of Kami\'s tricks?', 'No tricks. Just the better Namekian.'],
  frieza: ['Two emperors? How unseemly. One of us must go.', 'Then it shall be you. Ho ho ho!'],
};
// returns [[hero, text], ...]
export function introFor(a, b) {
  if (a.hero === b.hero) { const m = MIRROR[a.hero]; return [[a.hero, m[0]], [a.hero, m[1]]]; }
  const set = [a.hero, b.hero].sort().join('-');
  if (set === 'goku-vegeta' && (a.id === 'vegeta_majin' || b.id === 'vegeta_majin' || a.id === 'goku_z' || b.id === 'goku_z')) {
    const maj = a.id === 'vegeta_majin' || b.id === 'vegeta_majin';
    return maj ? [
      ['vegeta', 'Kakarot. I let Babidi into my mind for one reason — to settle things with you. No more distractions.'],
      ['goku', 'Vegeta... people are dying out there because of this! Is this really what you want?'],
      ['vegeta', 'I want my PRIDE back! The pure, ruthless Saiyan I was before this planet made me soft!'],
      ['goku', 'Alright. If this is the only way to reach you... then I\'ll give you everything I\'ve got!'],
    ] : [
      ['goku', 'Vegeta! I just got back from Other World — and I\'ve got a few new tricks to show you.'],
      ['vegeta', 'Tricks? Ha! You\'re as smug as ever, Kakarot. Let\'s see if the afterlife dulled your edge.'],
      ['goku', 'Only one way to find out!'],
    ];
  }
  if (set === 'goku-vegeta') {
    const gd = a.hero === 'goku' ? a : b, vd = a.hero === 'goku' ? b : a;
    return INTRO[`${gd.id.endsWith('ss') ? 'ss' : 'nm'}-${vd.id.endsWith('ss') ? 'ss' : 'nm'}`];
  }
  return PAIR[set];
}

// Event barks. {form} placeholder replaced at runtime.
export const BARKS = {
  goku: {
    transform_kaio: ['Kaio-ken!', 'Hope my body can take this... KAIO-KEN!'],
    transform_kaio3: ['Kaio-ken... times THREE!!', 'I\'ve got to push it further — times three!'],
    transform_kaio20: ['Kaio-ken... TIMES TWENTY!!'],
    transform_ssj: ['I am the hope of the universe... I am the answer to all living things that cry out for peace!', 'You\'ve pushed me too far... this is SUPER SAIYAN!'],
    kamehameha: ['Ka... me... ha... me... HAAA!'],
    superKame: ['Take this — SUPER KAMEHAMEHA!'],
    kaioAttack: ['Kaio-ken ATTACK!'],
    meteorSmash: ['Can you keep up? Meteor Smash!'],
    destructo: ['Krillin taught me this one — Destructo Disc!'],
    spiritBomb: ['Everyone... lend me your energy!', 'Plants, animals, people of Earth... give me your strength!'],
    tailcut: ['Sorry Vegeta — that tail\'s gotta go!'],
    hurt: ['Ngh... he\'s strong!', 'Not... done yet!'],
    zenkai: ['I can feel it... my Saiyan blood is fired up!'],
    stunned: ['Can\'t... move...!'],
    clash: ['Push... harder!!', 'I won\'t lose this!'],
    victory: ['That was a great fight, Vegeta. Let\'s do it again sometime!', 'Phew! You\'re tough, but I\'ve got people to protect.'],
    defeat: ['Guess I... still have training to do...'],
    counter: ['Too slow!', 'Over here!'],
    rageApe: ['A giant ape?! So that\'s what happened to Grandpa...'],
    transform_ssj2: ['This... is what you call a Super Saiyan that has ascended past a Super Saiyan!', 'HAAAAAH! Super Saiyan 2!'],
    transform_ssj3: ['And THIS... is to go even further beyond!', 'This form is called Super Saiyan 3!'],
    kaioKame: ['Kaio-ken... KAMEHAMEHA!'], kaioKame3: ['Kamehameha... times THREE!'], kaioKame20: ['Kaio-ken times twenty... KAMEHAMEHA!'],
    angryKame: ['You\'ll pay for that! HAAA!'], instantKame: ['Instant Transmission... Kamehameha!'],
    ssj2Kame: ['Kamehameha... HAAAAA!'], ssj3Kame: ['This is it — KAMEHAMEHA!!'], kiBlastCannon: ['Take this!'],
    jankenPunch: ['Jan... Ken... ROCK!'], afterimageStrike: ['Over here!'], superMeteor: ['Keep up with this!'],
    meteorCombination: ['Hah! Meteor Combination!'], ssj2Rush: ['Can you see me?!'], dragonFist: ['DRAGON... FIST!!'],
    kaioBarrage: ['Kaio-ken barrage!'], energyBurst: ['HAAAAH!'], ssj3Wave: ['RAAAAAAH!!'],
    superSpiritBomb: ['Everyone on Earth, raise your hands! Lend me your energy!'],
    kaioFinish: ['Kaio-ken... TIMES TEN!!'], hopeOfUniverse: ['I am the hope of the universe!'],
    ssj2Finish: ['This ends now! KAMEHAMEHA!!'], dragonFistExplosion: ['DRAGON FIST... EXPLOSION!!!'],
  },
  piccolo: {
    transform_unweighted: ['Hmph. Time to lose the dead weight.', 'These weights were holding me back. Not anymore.'],
    transform_nail: ['Nail... your power is mine now. We are one!', 'I am no longer Piccolo, nor Nail — I am the Namekian who will defeat you!'],
    specialBeamCannon: ['Special... BEAM... CANNON!!', 'Hold still — this one pierces anything!'],
    hellzone: ['Nowhere to run! Hellzone Grenade!'],
    lightGrenade: ['LIGHT GRENADE!'],
    demonSlam: ['You\'re open!'],
    hurt: ['Tch... not bad.', 'Ngh!'],
    zenkai: ['Hmph. A Namekian can regrow anything.'],
    stunned: ['Can\'t... focus...'],
    clash: ['Is that all?!', 'I\'ve trained too hard to lose here!'],
    victory: ['Stay down. You\'re not ready yet.', 'Hmph. Go train some more.'],
    defeat: ['Damn it... not again...'],
    counter: ['Predictable.', 'Behind you.'],
    tailcut: ['That tail is your weakness, Saiyan.'],
    rageApe: ['A Great Ape... this is exactly why I blew up the moon!'],
    specialBeamCannonMax: ['Fully charged... SPECIAL BEAM CANNON!!'], evilBlast: ['Hah!'], demonWave: ['Explosive Demon Wave!'],
    hellzoneMax: ['Every direction... no escape! HELLZONE GRENADE!'], demonHand: ['You can\'t outrun my reach!'],
  },
  frieza: {
    transform_second: ['I\'ll show you my second form. You should feel honored.'],
    transform_final: ['Well done, you\'ve earned a glimpse of my true form. Few ever do.', 'Ho ho ho... now let\'s begin in earnest.'],
    transform_full: ['One hundred percent! You\'ll regret making me go this far!'],
    deathBeam: ['Death Beam.', 'Pop.'],
    deathSaucer: ['Try to dodge this!'],
    novaStrike: ['Keep up, if you can!'],
    deathBall: ['I\'ll destroy you and this planet together!', 'Say goodbye!'],
    hurt: ['You... you scratched me?!', 'How DARE you!'],
    zenkai: ['Now you\'ve made me angry...'],
    stunned: ['Impossible... my body...'],
    clash: ['Insolent worm!', 'I am the EMPEROR!'],
    victory: ['Ho ho ho. Did you honestly think you could win?', 'Know your place, monkey.'],
    defeat: ['This isn\'t... how it ends... not for ME...'],
    counter: ['Too slow.', 'Ho ho!'],
    tailcut: ['Your tail was always your weakness, monkey.'],
    rageApe: ['A Great Ape? Ho ho, what a nostalgic sight.'],
    emperorBeam: ['Disappear!'], deathBeamBarrage: ['Dance for me!'], tailRush: ['Ho ho!'], hornCharge: ['GRAAH!'],
    deathWave: ['Kneel!'], psychoThrow: ['Come here, you insect.'], supernova: ['SUPERNOVA!', 'Let\'s see you survive THIS!'],
  },
  vegeta: {
    transform_full: ['Witness the power of an elite Saiyan!', 'HAAAAH! Now you face my true power!'],
    transform_zenkai: ['Every beating made me stronger — this is the Saiyan way!'],
    transform_ape: ['Behold the Power Ball! Gaze upon it and feel the Blutz Waves!', 'Now you\'ll see the true terror of a Saiyan!'],
    transform_ssj: ['The legend... it was meant for ME! I am the SUPER SAIYAN!'],
    galickGun: ['Galick Gun... FIRE!!'],
    finalImpact: ['Disappear! FINAL IMPACT!'],
    explosiveWave: ['Get away from me!'],
    dirtyFireworks: ['Dance, clown! Dance!'],
    mouthBlast: ['GRAAAAH!'],
    stompQuake: ['Crushed like the insect you are!'],
    apeRoar: ['RRROOOAAARR!!'],
    apeCrush: ['I\'ll squeeze the life out of you!'],
    hurt: ['You... you damaged the Prince?!', 'Impossible!'],
    zenkai: ['Hah... hahaha! Every wound makes me stronger!'],
    stunned: ['My body... won\'t respond!'],
    clash: ['You dare push back against ME?!', 'I am the PRINCE!'],
    victory: ['Know your place, Kakarot. There is only one Prince of all Saiyans.', 'Hmph. A pitiful display for a Saiyan.'],
    defeat: ['This... can\'t be... defeated by a low-class...'],
    counter: ['Hmph. Predictable.', 'You\'re wide open!'],
    tailLost: ['My TAIL! You wretched insect!!'],
    apeTimeout: ['Tch... the Power Ball faded.'],
    transform_majin: ['I\'ve let go of everything... I\'m the old Vegeta again!', 'Babidi gave me this power — but my pride is my own!'],
    galickGunMax: ['Take my full power — GALICK GUN!!'], bigTreeCannon: ['Hmph.'], finalFlash: ['FINAL... FLASH!!!'], finalFlashMax: ['Full power... FINAL FLASH!!!'],
    bigBang: ['Big Bang Attack!'], bigBangMax: ['BIG BANG ATTACK!!'], majinWave: ['Out of my way!'], eliteRush: ['Know your place!'],
    burstAttack: ['Burst Attack!'], princeRush: ['Bow before the Prince!'], majinRage: ['RAAAAAH! Kakarot!!'],
    finalExplosion: ['Trunks... Bulma... Kakarot... Farewell.', 'This is for my pride... FINAL EXPLOSION!'],
    apeRampage: ['GRAAAAAAAH!!'],
  },
};

export function pick(a) { return a[(Math.random() * a.length) | 0]; }
