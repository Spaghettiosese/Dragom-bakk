// Roster, forms, super attacks and dialogue.

export const ROSTER = {
  goku_ss: {
    id: 'goku_ss', hero: 'goku', name: 'Goku', saga: 'Saiyan Saga', level: 24,
    look: { armor: null, kanji: '亀', backKanji: '亀', tail: false, scouter: false },
    forms: [
      { id: 'base', name: 'Base', pow: 1, spd: 1, drain: 0, cost: 0, aura: 0xdfeaff, hair: 0x15161c },
      { id: 'kaio', name: 'Kaio-ken', pow: 1.35, spd: 1.25, drain: 45, cost: 25, aura: 0xff2a1a, tint: 0xff6a55, hair: 0x15161c },
      { id: 'kaio3', name: 'Kaio-ken x3', pow: 1.75, spd: 1.45, drain: 110, cost: 40, aura: 0xff1010, tint: 0xff4433, hair: 0x15161c },
    ],
    supers: ['kamehameha', 'kaioAttack', 'destructo', 'spiritBomb'],
  },
  goku_nm: {
    id: 'goku_nm', hero: 'goku', name: 'Goku', saga: 'Namek Saga', level: 41,
    look: { armor: null, kanji: '悟', backKanji: '亀', tail: false, scouter: false },
    forms: [
      { id: 'base', name: 'Base', pow: 1.1, spd: 1.05, drain: 0, cost: 0, aura: 0xdfeaff, hair: 0x15161c },
      { id: 'kaio20', name: 'Kaio-ken x20', pow: 1.6, spd: 1.4, drain: 140, cost: 30, aura: 0xff1a10, tint: 0xff5540, hair: 0x15161c },
      { id: 'ssj', name: 'Super Saiyan', pow: 2.1, spd: 1.55, drain: 0, cost: 60, aura: 0xffd23a, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true },
    ],
    supers: ['kamehameha', 'meteorSmash', 'destructo', 'superKame'],
  },
  vegeta_ss: {
    id: 'vegeta_ss', hero: 'vegeta', name: 'Vegeta', saga: 'Saiyan Saga', level: 26,
    look: { armor: 'saiyan', tail: true, scouter: true },
    forms: [
      { id: 'base', name: 'Base', pow: 1.05, spd: 1.05, drain: 0, cost: 0, aura: 0xd8c8ff, hair: 0x14131a },
      { id: 'full', name: 'Full Power', pow: 1.4, spd: 1.3, drain: 0, cost: 30, aura: 0xb06cff, hair: 0x14131a },
      { id: 'ape', name: 'Great Ape', pow: 2.2, spd: 0.8, drain: 0, cost: 50, aura: 0xff4040, ape: true },
    ],
    supers: ['galickGun', 'explosiveWave', 'dirtyFireworks', 'powerBall'],
    apeSupers: ['mouthBlast', 'stompQuake', 'apeRoar', 'apeCrush'],
  },
  vegeta_nm: {
    id: 'vegeta_nm', hero: 'vegeta', name: 'Vegeta', saga: 'Namek Saga', level: 40,
    look: { armor: 'namek', tail: false, scouter: false },
    forms: [
      { id: 'base', name: 'Base', pow: 1.1, spd: 1.1, drain: 0, cost: 0, aura: 0xd8c8ff, hair: 0x14131a },
      { id: 'zenkai', name: 'Zenkai Surge', pow: 1.5, spd: 1.35, drain: 0, cost: 30, aura: 0x8f5bff, hair: 0x14131a },
      { id: 'ssj', name: 'Super Saiyan (What-If)', pow: 2.1, spd: 1.55, drain: 0, cost: 60, aura: 0xffd23a, hair: 0xffe24a, eyes: 0x1bb59a, spiky: true },
    ],
    supers: ['galickGun', 'explosiveWave', 'dirtyFireworks', 'finalImpact'],
  },
};

// type: beam | rush | aoe | ball | disc | barrage | roar | transform
export const SUPERS = {
  kamehameha: { name: 'Kamehameha', type: 'beam', cost: 35, dmg: 1300, color: 0x5fc8ff, charge: 0.9, width: 1.1, pose: 'kame' },
  superKame: { name: 'Super Kamehameha', type: 'beam', cost: 70, dmg: 2600, color: 0x7fdcff, charge: 1.3, width: 2.0, pose: 'kame' },
  galickGun: { name: 'Galick Gun', type: 'beam', cost: 35, dmg: 1350, color: 0xc070ff, charge: 0.9, width: 1.1, pose: 'galick' },
  finalImpact: { name: 'Final Impact', type: 'beam', cost: 70, dmg: 2600, color: 0x9fd8ff, charge: 1.2, width: 2.1, pose: 'palm' },
  mouthBlast: { name: 'Mouth Energy Wave', type: 'beam', cost: 30, dmg: 1900, color: 0xff7aa0, charge: 0.8, width: 2.6, pose: 'roar' },
  kaioAttack: { name: 'Kaio-ken Attack', type: 'rush', cost: 30, dmg: 1400, color: 0xff3020, hits: 7 },
  meteorSmash: { name: 'Meteor Smash', type: 'rush', cost: 30, dmg: 1500, color: 0xfff0a0, hits: 8 },
  apeCrush: { name: 'Great Ape Crush', type: 'rush', cost: 30, dmg: 1700, color: 0xff5050, hits: 4 },
  explosiveWave: { name: 'Explosive Wave', type: 'aoe', cost: 35, dmg: 1200, color: 0xd9b8ff, radius: 11 },
  stompQuake: { name: 'Stomp Quake', type: 'aoe', cost: 30, dmg: 1500, color: 0xffa060, radius: 22 },
  dirtyFireworks: { name: 'Rapid Fire Barrage', type: 'barrage', cost: 35, dmg: 1300, color: 0xffe080, count: 26 },
  destructo: { name: 'Destructo Disc', type: 'disc', cost: 30, dmg: 1000, color: 0xfff27a, note: 'Cuts a Great Ape tail!' },
  spiritBomb: { name: 'Spirit Bomb', type: 'ball', cost: 90, dmg: 3600, color: 0x9fe8ff, charge: 2.6, size: 5 },
  powerBall: { name: 'Power Ball → Great Ape', type: 'transform', cost: 50, color: 0xfff4c0 },
  apeRoar: { name: 'Primal Roar', type: 'roar', cost: 25, dmg: 300, color: 0xff6060, radius: 30 },
};

export const PALETTES = {
  goku: { skin: 0xffd3ab, gi: 0xff7a18, under: 0x1f3d9c, belt: 0x1f3d9c, boot: 0x1f3d9c, bootTrim: 0xd23b2a, band: 0x1f3d9c },
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

export function introFor(gokuId, vegId) {
  const g = gokuId.endsWith('ss') ? 'ss' : 'nm', v = vegId.endsWith('ss') ? 'ss' : 'nm';
  return INTRO[`${g}-${v}`];
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
  },
};

export function pick(a) { return a[(Math.random() * a.length) | 0]; }
