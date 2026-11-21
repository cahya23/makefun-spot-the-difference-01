# Twin Gardens — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/cahya23/makefun-spot-the-difference-01/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/cahya23/makefun-spot-the-difference-01/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game that plays offline in a desktop browser.
Two near-identical pictures hang side by side — the right one hides 7
differences. Click a difference on either picture to circle it, and find all
7 before the 3-minute timer runs out. Three hand-drawn gardens wait, each a
little harder than the last.

## The three levels

1. **Sunny Park** (Easy) — a bright morning in the park: trees, a pond, a
   bench, birds and a butterfly.
2. **Cozy Kitchen** (Medium) — tea is on, the cat is in: a window, a fruit
   bowl, a teapot, jars on a shelf.
3. **Mountain Camp** (Hard) — dusk settles over the pines: a tent, a
   campfire, stars and a wandering moon.

Every picture is drawn from code with canvas paths — no image files, no
fonts and no sounds loaded from anywhere. The sounds (a chime on each find,
a soft buzz on a wrong click, a fanfare on a finished level) are synthesized
with WebAudio.

## How to play

```bash
node serve.ts
```

Then open http://localhost:8080 in a desktop browser.

- Click or tap a difference on either picture to mark it. A green circle
  with a check appears on both pictures, and the counter climbs
  ("Found 3 of 7").
- **Hint** (3 per level) pulses a difference you have not found yet.
- Wrong clicks cost nothing but a soft buzz and a little shake.
- Finish a level to bank a time bonus; finish all three for the victory
  screen and a total score.
- Keyboard: `H` hint · `M` mute · `R` restart level · `N` next level ·
  `Enter` start.

## Files

- `game/index.html` — the page: header, two panels, footer, overlay screens
- `game/src/config.js` — fixed numbers and the three levels' difference lists
- `game/src/scenes.js` — the three procedurally drawn scenes
- `game/src/audio.js` — WebAudio sounds, synthesized, no audio files
- `game/src/input.js` — pointer clicks turned into panel positions
- `game/src/main.js` — game state, timer, scoring, overlays, `?shot=` presets
- `main.ts` — hands the entry in (copies `game/` and `screenshots/`, writes
  `dossier.json`); run it with `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`
- `screenshots/` — real renders of the game's own code: mid-play on level 1
  (cover), mid-play on level 2, the title screen, and the victory screen

## License

MIT — see `LICENSE`.
