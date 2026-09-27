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
  piccolo_nm: {
    id: 'piccolo_nm', hero: 'piccolo', name: 'Piccolo', saga: 'Namek Saga', level: 38,
    look: {},
    forms: [
      { id: 'base', name: 'Weighted Cape', pow: 1.05, spd: 1.0, drain: 0, cost: 0, aura: 0xf2ffe0, style: 'cape' },
      { id: 'unweighted', name: 'Weights Off', pow: 1.35, spd: 1.4, drain: 0, cost: 20, aura: 0xd8ff9a, style: 'bare' },
      { id: 'nail', name: 'Fused with Nail', pow: 1.9, spd: 1.5, drain: 0, cost: 55, aura: 0x9dff6a, style: 'bare' },
    ],
    supers: ['specialBeamCannon', 'hellzone', 'lightGrenade', 'demonSlam'],
  },
  frieza_nm: {
    id: 'frieza_nm', hero: 'frieza', name: 'Frieza', saga: 'Namek Saga', level: 50,
    look: {},
    forms: [
      { id: 'first', name: 'First Form', pow: 1.1, spd: 1.0, drain: 0, cost: 0, aura: 0xd8b0ff, style: 'first', eyes: 0xb0102a },
      { id: 'second', name: 'Second Form', pow: 1.45, spd: 1.1, drain: 0, cost: 30, aura: 0xc080ff, style: 'second', eyes: 0xb0102a },
      { id: 'final', name: 'Final Form', pow: 1.8, spd: 1.45, drain: 0, cost: 45, aura: 0xb070ff, style: 'final', eyes: 0xb0102a },
      { id: 'full', name: '100% Full Power', pow: 2.25, spd: 1.55, drain: 60, cost: 60, aura: 0xff4de0, style: 'full', eyes: 0xb0102a },
    ],
    supers: ['deathBeam', 'deathSaucer', 'novaStrike', 'deathBall'],
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
  specialBeamCannon: { name: 'Special Beam Cannon', type: 'beam', cost: 45, dmg: 2000, color: 0xffe36a, charge: 1.5, width: 0.5, pose: 'sbc', firePose: 'point', pierce: true },
  hellzone: { name: 'Hellzone Grenade', type: 'barrage', cost: 40, dmg: 1500, color: 0xfff08a, count: 30 },
  lightGrenade: { name: 'Light Grenade', type: 'ball', cost: 55, dmg: 2200, color: 0xfff6a0, charge: 1.1, size: 2.4, speed: 42 },
  demonSlam: { name: 'Demon Slam', type: 'rush', cost: 30, dmg: 1400, color: 0xb6ff7a, hits: 6 },
  deathBeam: { name: 'Death Beam', type: 'beam', cost: 20, dmg: 850, color: 0xff5ad0, charge: 0.35, width: 0.3, pose: 'point', firePose: 'point' },
  deathSaucer: { name: 'Death Saucer', type: 'disc', cost: 30, dmg: 1100, color: 0xff7ae0, note: 'Cuts a Great Ape tail!' },
  novaStrike: { name: 'Nova Strike', type: 'rush', cost: 35, dmg: 1600, color: 0xd070ff, hits: 7 },
  deathBall: { name: 'Death Ball', type: 'ball', cost: 90, dmg: 3800, color: 0xff6a3a, charge: 2.2, size: 6 },
  apeRoar: { name: 'Primal Roar', type: 'roar', cost: 25, dmg: 300, color: 0xff6060, radius: 30 },
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
