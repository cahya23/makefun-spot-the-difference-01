// Twin Gardens — Spot the Difference
// config.js: every fixed number the game runs on. Nothing here changes at run
// time, so the same level always looks the same: the two pictures differ only
// where a level's difference list says so.

export const PANEL_W = 600;
export const PANEL_H = 520;
export const PANEL_GAP = 40;
export const PANEL_MARGIN = 20;

export const LEVEL_TIME = 180; // seconds per level
export const HINTS_PER_LEVEL = 3;
export const POINTS_PER_FIND = 100;
export const TIME_BONUS_PER_SECOND = 5;

// A difference: where it lives in panel coordinates (600 x 520), how big a
// click may be to count, and a short label used by the hint button's tooltip.
export const LEVELS = [
  {
    name: 'Sunny Park',
    tagline: 'A bright morning in the park',
    difficulty: 'Easy',
    diffs: [
      { id: 'bird', x: 430, y: 70, r: 26, label: 'a bird in the sky' },
      { id: 'flower', x: 120, y: 430, r: 26, label: 'a flower by the path' },
      { id: 'pond', x: 300, y: 400, r: 30, label: 'the colour of the pond' },
      { id: 'butterfly', x: 520, y: 250, r: 26, label: 'a butterfly' },
      { id: 'cloud', x: 180, y: 60, r: 28, label: 'a cloud in the sky' },
      { id: 'tree', x: 90, y: 180, r: 30, label: 'the shape of a tree' },
      { id: 'fence', x: 560, y: 450, r: 24, label: 'a fence post' },
    ],
  },
  {
    name: 'Cozy Kitchen',
    tagline: 'Tea is on, the cat is in',
    difficulty: 'Medium',
    diffs: [
      { id: 'clock', x: 300, y: 70, r: 28, label: 'the wall clock' },
      { id: 'apple', x: 330, y: 330, r: 24, label: 'an apple in the bowl' },
      { id: 'curtain', x: 90, y: 130, r: 28, label: 'the curtain colour' },
      { id: 'teapot', x: 180, y: 350, r: 28, label: 'the teapot' },
      { id: 'jars', x: 480, y: 115, r: 26, label: 'the jars on the shelf' },
      { id: 'rug', x: 300, y: 470, r: 30, label: 'the shape of the rug' },
      { id: 'picture', x: 480, y: 190, r: 26, label: 'the picture on the wall' },
    ],
  },
  {
    name: 'Mountain Camp',
    tagline: 'Dusk settles over the pines',
    difficulty: 'Hard',
    diffs: [
      { id: 'star', x: 200, y: 50, r: 24, label: 'a star in the dusk sky' },
      { id: 'pine', x: 520, y: 380, r: 28, label: 'a pine tree' },
      { id: 'tent', x: 300, y: 380, r: 30, label: 'the colour of the tent' },
      { id: 'moon', x: 90, y: 110, r: 26, label: 'the moon' },
      { id: 'logs', x: 300, y: 440, r: 26, label: 'the logs in the fire' },
      { id: 'peak', x: 150, y: 200, r: 30, label: 'the shape of a mountain' },
      { id: 'backpack', x: 450, y: 430, r: 26, label: 'the backpack' },
    ],
  },
];

export const TOTAL_LEVELS = LEVELS.length;
export const DIFFS_PER_LEVEL = 7;
