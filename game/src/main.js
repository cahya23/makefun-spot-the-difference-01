// Twin Gardens — Spot the Difference
// main.js: the game itself. A small state machine (start, playing,
// levelComplete, victory, timeout) drives the canvas, the header and footer,
// and the overlay screens. Two panels are drawn from the same scene code:
// the left panel plain, the right panel with the level's seven differences.
// ?shot= presets freeze the game in a photogenic state for screenshots.

import {
  PANEL_W,
  PANEL_H,
  PANEL_GAP,
  PANEL_MARGIN,
  LEVEL_TIME,
  HINTS_PER_LEVEL,
  POINTS_PER_FIND,
  TIME_BONUS_PER_SECOND,
  LEVELS,
  TOTAL_LEVELS,
  DIFFS_PER_LEVEL,
} from './config.js';
import { drawScene } from './scenes.js';
import { SoundBank } from './audio.js';
import { attachPanelClicks, pickDifference } from './input.js';

const canvas = document.getElementById('panels');
const ctx = canvas.getContext('2d');
const sounds = new SoundBank();

const el = (id) => document.getElementById(id);
const hudLevel = el('hud-level');
const hudCount = el('hud-count');
const hudTimer = el('hud-timer');
const hudScore = el('hud-score');
const hintBtn = el('btn-hint');
const muteBtn = el('btn-mute');
const restartBtn = el('btn-restart');
const levelDots = el('level-dots');
const overlays = {
  start: el('overlay-start'),
  level: el('overlay-level'),
  victory: el('overlay-victory'),
  timeout: el('overlay-timeout'),
};

const game = {
  state: 'start',
  levelIndex: 0,
  found: new Set(),
  foundAt: new Map(),
  wrongMarks: [],
  hintsLeft: HINTS_PER_LEVEL,
  hintPulse: null, // { id, until }
  score: 0,
  timeLeft: LEVEL_TIME,
  lastTick: 0,
  lastCountdownSecond: null, // displayed second last ticked in the final 10s
  frozen: false, // shot mode: no countdown, no animation
  levelBonus: 0,
};

function level() {
  return LEVELS[game.levelIndex];
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function showOverlay(name) {
  for (const key of Object.keys(overlays)) {
    overlays[key].classList.toggle('hidden', key !== name);
  }
}

function updateHud() {
  const lv = level();
  hudLevel.textContent = `Level ${game.levelIndex + 1} of ${TOTAL_LEVELS} — ${lv.name}`;
  hudCount.textContent = `Found ${game.found.size} of ${DIFFS_PER_LEVEL}`;
  hudTimer.textContent = formatTime(game.timeLeft);
  hudTimer.classList.toggle('low', game.state === 'playing' && game.timeLeft <= 30);
  hudScore.textContent = `Score ${game.score}`;
  hintBtn.textContent = `💡 Hint (${game.hintsLeft})`;
  hintBtn.disabled = game.state !== 'playing' || game.hintsLeft <= 0;
  muteBtn.textContent = sounds.muted ? '🔇 Muted' : '🔊 Sound on';
  levelDots.innerHTML = LEVELS.map((l, i) =>
    `<span class="dot${i === game.levelIndex ? ' current' : ''}${i < game.levelIndex ? ' done' : ''}" title="${l.name}">${i + 1}</span>`,
  ).join('');
}

function startLevel(index) {
  game.levelIndex = index;
  game.found = new Set();
  game.foundAt = new Map();
  game.wrongMarks = [];
  game.hintsLeft = HINTS_PER_LEVEL;
  game.hintPulse = null;
  game.timeLeft = LEVEL_TIME;
  game.lastCountdownSecond = null;
  game.state = 'playing';
  showOverlay(null);
  updateHud();
}

function startGame() {
  game.score = 0;
  startLevel(0);
}

function useHint() {
  if (game.state !== 'playing' || game.hintsLeft <= 0) return;
  const next = level().diffs.find((d) => !game.found.has(d.id));
  if (!next) return;
  game.hintsLeft -= 1;
  game.hintPulse = { id: next.id, until: performance.now() + 1600 };
  sounds.click();
  updateHud();
}

function markFound(diff) {
  game.found.add(diff.id);
  game.foundAt.set(diff.id, performance.now());
  game.score += POINTS_PER_FIND;
  sounds.chime();
  updateHud();
  if (game.found.size === DIFFS_PER_LEVEL) {
    finishLevel();
  }
}

function finishLevel() {
  const bonus = Math.ceil(game.timeLeft) * TIME_BONUS_PER_SECOND;
  game.levelBonus = bonus;
  game.score += bonus;
  game.state = 'levelComplete';
  sounds.fanfare();
  el('level-title').textContent = `${level().name} complete!`;
  el('level-detail').textContent =
    `You found all ${DIFFS_PER_LEVEL} differences with ${formatTime(game.timeLeft)} left — time bonus +${bonus}.`;
  el('level-score').textContent = `Score ${game.score}`;
  el('btn-next').textContent =
    game.levelIndex + 1 < TOTAL_LEVELS ? 'Next level →' : 'See results →';
  showOverlay('level');
  updateHud();
}

function nextLevel() {
  if (game.levelIndex + 1 < TOTAL_LEVELS) {
    startLevel(game.levelIndex + 1);
  } else {
    game.state = 'victory';
    el('victory-score').textContent = `Total score ${game.score}`;
    el('victory-detail').textContent =
      `You spotted all ${TOTAL_LEVELS * DIFFS_PER_LEVEL} differences across ${TOTAL_LEVELS} gardens. Sharp eyes!`;
    showOverlay('victory');
    updateHud();
  }
}

// ------------------------------------------------------------ drawing
function panelX(side) {
  return PANEL_MARGIN + (side === 'right' ? PANEL_W + PANEL_GAP : 0);
}

function drawFoundMarker(x, y, ageMs) {
  const pop = Math.min(1, ageMs / 180);
  const r = 26 * (0.7 + 0.3 * pop);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#2fbf4a';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r - 5, 0, Math.PI * 2);
  ctx.stroke();
  // Check mark.
  ctx.strokeStyle = '#2fbf4a';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.lineTo(x - 3, y + 9);
  ctx.lineTo(x + 12, y - 9);
  ctx.stroke();
}

function drawWrongMark(mark, now) {
  const age = now - mark.at;
  if (age > 500) return;
  const alpha = 1 - age / 500;
  ctx.strokeStyle = `rgba(230,57,70,${alpha})`;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(mark.x - 10, mark.y - 10);
  ctx.lineTo(mark.x + 10, mark.y + 10);
  ctx.moveTo(mark.x + 10, mark.y - 10);
  ctx.lineTo(mark.x - 10, mark.y + 10);
  ctx.stroke();
}

function drawHintPulse(now) {
  if (!game.hintPulse) return;
  if (now > game.hintPulse.until) {
    game.hintPulse = null;
    return;
  }
  const diff = level().diffs.find((d) => d.id === game.hintPulse.id);
  if (!diff) return;
  const phase = (now % 500) / 500;
  const r = 22 + phase * 16;
  for (const side of ['left', 'right']) {
    ctx.save();
    ctx.translate(panelX(side), PANEL_MARGIN);
    ctx.strokeStyle = `rgba(255,217,59,${1 - phase})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPanels(now) {
  const rightDiffs = new Set(level().diffs.map((d) => d.id));
  drawScene(ctx, game.levelIndex, new Set(), panelX('left'), PANEL_MARGIN);
  drawScene(ctx, game.levelIndex, rightDiffs, panelX('right'), PANEL_MARGIN);
  // Labels above the panels.
  ctx.fillStyle = 'rgba(20,40,20,0.75)';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ORIGINAL', panelX('left'), 14);
  ctx.textAlign = 'right';
  ctx.fillText('CHANGED  —  find 7 differences', panelX('right') + PANEL_W, 14);
  // Found markers on both panels.
  for (const diff of level().diffs) {
    if (!game.found.has(diff.id)) continue;
    const age = game.frozen ? Infinity : now - (game.foundAt.get(diff.id) ?? now);
    for (const side of ['left', 'right']) {
      ctx.save();
      ctx.translate(panelX(side), PANEL_MARGIN);
      drawFoundMarker(diff.x, diff.y, age);
      ctx.restore();
    }
  }
  // Wrong-click crosses, on the panel they happened on: draw on both, the
  // click itself only ever lands on one, so store the side with the mark.
  for (const mark of game.wrongMarks) {
    ctx.save();
    ctx.translate(panelX(mark.side), PANEL_MARGIN);
    drawWrongMark(mark, now);
    ctx.restore();
  }
  game.wrongMarks = game.wrongMarks.filter((m) => now - m.at <= 500);
  drawHintPulse(now);
}

function frame(now) {
  if (game.state === 'playing' && !game.frozen) {
    const dt = game.lastTick ? (now - game.lastTick) / 1000 : 0;
    game.lastTick = now;
    game.timeLeft -= dt;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      game.state = 'timeout';
      sounds.buzz();
      el('timeout-detail').textContent =
        `Time ran out on ${level().name} with ${DIFFS_PER_LEVEL - game.found.size} difference${DIFFS_PER_LEVEL - game.found.size === 1 ? '' : 's'} still hiding.`;
      showOverlay('timeout');
      updateHud();
    } else {
      hudTimer.textContent = formatTime(game.timeLeft);
      hudTimer.classList.toggle('low', game.timeLeft <= 30);
      // Soft tick once per second in the final 10 seconds. tick() itself
      // stays silent while muted (tone() returns early when muted).
      const secondLeft = Math.ceil(game.timeLeft);
      if (secondLeft <= 10 && secondLeft !== game.lastCountdownSecond) {
        game.lastCountdownSecond = secondLeft;
        sounds.tick();
      }
    }
  }
  drawPanels(now);
  requestAnimationFrame(frame);
}

// ------------------------------------------------------------ shot presets
// ?shot=start | play | play2 | end — freezes the game in a fixed state so
// screenshots are real renders of the same code a player sees.
function applyShotPreset() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return;
  game.frozen = true;
  if (shot === 'start') {
    game.state = 'start';
    showOverlay('start');
  } else if (shot === 'play') {
    game.state = 'playing';
    game.levelIndex = 0;
    game.found = new Set(['bird', 'flower', 'pond']);
    game.timeLeft = 167;
    game.score = 300;
    showOverlay(null);
  } else if (shot === 'play2') {
    game.state = 'playing';
    game.levelIndex = 1;
    game.found = new Set(['clock', 'apple']);
    game.timeLeft = 132;
    game.score = 200;
    showOverlay(null);
  } else if (shot === 'end') {
    game.state = 'victory';
    game.levelIndex = 2;
    game.found = new Set(level().diffs.map((d) => d.id));
    game.score = 2740;
    el('victory-score').textContent = 'Total score 2740';
    showOverlay('victory');
  }
  updateHud();
}

// ------------------------------------------------------------ wiring
attachPanelClicks(canvas, (side, x, y) => {
  if (game.state !== 'playing') return;
  sounds.ensure();
  const diff = pickDifference(level().diffs, game.found, x, y);
  if (diff) {
    markFound(diff);
  } else {
    sounds.buzz();
    game.wrongMarks.push({ x, y, side, at: performance.now() });
    canvas.classList.remove('shake');
    void canvas.offsetWidth;
    canvas.classList.add('shake');
  }
});

el('btn-start').addEventListener('click', () => {
  sounds.ensure();
  sounds.click();
  startGame();
});
el('btn-next').addEventListener('click', () => {
  sounds.click();
  nextLevel();
});
el('btn-again').addEventListener('click', () => {
  sounds.click();
  startGame();
});
el('btn-retry').addEventListener('click', () => {
  sounds.click();
  startLevel(game.levelIndex);
});
hintBtn.addEventListener('click', useHint);
muteBtn.addEventListener('click', () => {
  sounds.ensure();
  sounds.toggleMute();
  updateHud();
});
restartBtn.addEventListener('click', () => {
  sounds.click();
  startLevel(game.levelIndex);
});

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'enter' && (game.state === 'start' || game.state === 'victory')) {
    startGame();
  } else if (key === 'h') {
    useHint();
  } else if (key === 'm') {
    sounds.toggleMute();
    updateHud();
  } else if (key === 'r' && game.state === 'playing') {
    startLevel(game.levelIndex);
  } else if (key === 'n' && game.state === 'levelComplete') {
    nextLevel();
  }
});

applyShotPreset();
updateHud();
requestAnimationFrame(frame);

// A small handle for automated play-testing: never shown on screen.
window.__twinGardens = {
  state: () => game.state,
  level: () => game.levelIndex,
  found: () => game.found.size,
  score: () => game.score,
  timeLeft: () => game.timeLeft,
  diffs: () => level().diffs.map((d) => ({ id: d.id, x: d.x, y: d.y })),
};
