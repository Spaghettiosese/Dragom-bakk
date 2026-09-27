# Saiyan Showdown — Goku vs Vegeta (tech demo)

A third-person 3D arena fighter inspired by *Dragon Ball Z: Kakarot*. It runs in the browser on Three.js, which is bundled in `vendor/`, so it needs no build step and no network connection.

## Run
```
python3 -m http.server 8000     # or any static server
# open http://localhost:8000
```

## Features
- **Third-person chase camera** over the shoulder, locked on to your rival as in Kakarot. It uses cinematic cameras for transformations, the pre-fight dialogue and the KO.
- **4 fighters:** Goku and Vegeta, each in a Saiyan Saga and a Namek Saga version. Every version has its own forms and supers.

  | Fighter | Forms | Supers |
  |---|---|---|
  | Goku (Saiyan) | Base → Kaio-ken → Kaio-ken x3 | Kamehameha, Kaio-ken Attack, Destructo Disc, Spirit Bomb |
  | Goku (Namek) | Base → Kaio-ken x20 → Super Saiyan | Kamehameha, Meteor Smash, Destructo Disc, Super Kamehameha |
  | Vegeta (Saiyan) | Base → Full Power → **Great Ape** | Galick Gun, Explosive Wave, Rapid Fire Barrage, Power Ball |
  | Vegeta (Namek) | Base → Zenkai Surge → Super Saiyan (What-If) | Galick Gun, Explosive Wave, Rapid Fire Barrage, Final Impact |

- **Great Ape:** Vegeta throws the Power Ball, a moon appears and he grows to 7× size. As the ape he has super armor, heavy swipes, Mouth Energy Wave, Stomp Quake (flying targets avoid it), Primal Roar (causes fear-stun) and Great Ape Crush. The form ends after 45 s, or earlier when **Goku's Destructo Disc cuts the tail**.
- **Combat:** a 5-hit rush combo that closes the distance to your rival, homing ki blasts, guard, **Perfect Counter** (guard just before a hit to teleport behind the attacker), vanish step, ki charge, a stun gauge and a one-time **Zenkai boost** below 30% HP. Kaio-ken drains HP while it is active.
- **Beam clashes:** when two beams meet, mash J or K to push yours through.
- **Destruction:** the terrain deforms for real, leaving craters and scorch marks. Rock pillars shatter into debris with physics, and knocked-back fighters plough into the ground and smash through rocks.
- **Anime look:** cel shading, ink outlines, faces drawn on a canvas that change expression, flame-shader auras, bloom and anime impact lines. Portraits are SVG drawings that change with each form and when a fighter is badly hurt.
- **Dialogue:** a unique pre-fight exchange for each saga pairing, plus in-fight lines for transformations, supers, clashes, Zenkai, tail cuts, victory and defeat.

## Controls
| Key | Action |
|---|---|
| W A S D | move / circle the target |
| Space / C | rise / descend (Space while knocked back = recover) |
| Shift | boost dash |
| J (or LMB) | melee — tap to chain |
| K (or RMB) | ki blast (hold) |
| L | guard (tap just before a hit = Perfect Counter) |
| I | charge ki (hold) |
| Q | vanish step |
| 1–4 | super attacks |
| T / R | transform / revert |
| Esc | pause |

The source is in `src/`: `main.js` (game, combat, AI, camera, HUD), `models.js` (procedural fighters and poses), `arena.js` (terrain and destruction), `fx.js` (particles, beams), `data.js` (roster, supers, dialogue), `portraits.js` and `audio.js` (synthesised sound effects).
