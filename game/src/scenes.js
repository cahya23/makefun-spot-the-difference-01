// Twin Gardens — Spot the Difference
// scenes.js: every picture is drawn from code, never loaded from a file.
// drawScene(ctx, levelIndex, diffs, ox, oy) paints one panel of one level
// inside a 600 x 520 box at (ox, oy). `diffs` is the set of difference ids
// applied to this panel: the left panel gets an empty set, the right panel
// gets the level's seven. All positions are fixed constants, so both panels
// are identical except where a difference says otherwise.

import { PANEL_W, PANEL_H } from './config.js';

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function triangle(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y) {
  ellipse(ctx, x, y, 42, 20, '#ffffff');
  ellipse(ctx, x - 26, y + 6, 26, 15, '#ffffff');
  ellipse(ctx, x + 28, y + 6, 28, 15, '#ffffff');
}

function bird(ctx, x, y) {
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.quadraticCurveTo(x - 5, y - 9, x, y);
  ctx.quadraticCurveTo(x + 5, y - 9, x + 12, y);
  ctx.stroke();
}

function flower(ctx, x, y, petal, center) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  circle(ctx, x, y, 6, center);
}

function pineTree(ctx, x, y, s) {
  rect(ctx, x - 4 * s, y - 8 * s, 8 * s, 16 * s, '#6b4423');
  triangle(ctx, x - 26 * s, y - 6 * s, x, y - 44 * s, x + 26 * s, y - 6 * s, '#1e6b34');
  triangle(ctx, x - 20 * s, y - 26 * s, x, y - 58 * s, x + 20 * s, y - 26 * s, '#2a7d3f');
  triangle(ctx, x - 14 * s, y - 44 * s, x, y - 72 * s, x + 14 * s, y - 44 * s, '#35914a');
}

function star4(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// ---------------------------------------------------------------- Level 1
function drawSunnyPark(ctx, diffs) {
  // Sky and sun.
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  sky.addColorStop(0, '#7ec8f2');
  sky.addColorStop(0.55, '#bfe6f7');
  sky.addColorStop(1, '#e8f7e0');
  rect(ctx, 0, 0, PANEL_W, PANEL_H, sky);
  circle(ctx, 80, 70, 34, '#ffd93b');
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(80 + Math.cos(a) * 44, 70 + Math.sin(a) * 44);
    ctx.lineTo(80 + Math.cos(a) * 56, 70 + Math.sin(a) * 56);
    ctx.stroke();
  }
  // Clouds: one is missing on the right panel.
  if (!diffs.has('cloud')) cloud(ctx, 180, 60);
  cloud(ctx, 350, 45);
  cloud(ctx, 500, 80);
  // Birds: one is missing on the right panel.
  bird(ctx, 250, 80);
  if (!diffs.has('bird')) bird(ctx, 430, 70);
  bird(ctx, 340, 110);
  // Distant hills and grass.
  ellipse(ctx, 130, 300, 260, 70, '#8fce6e');
  ellipse(ctx, 480, 310, 280, 80, '#7cc464');
  rect(ctx, 0, 300, PANEL_W, PANEL_H - 300, '#5da744');
  // Winding path.
  ctx.fillStyle = '#e8d9a8';
  ctx.beginPath();
  ctx.moveTo(260, PANEL_H);
  ctx.quadraticCurveTo(280, 400, 300, 330);
  ctx.quadraticCurveTo(310, 300, 300, 290);
  ctx.quadraticCurveTo(340, 300, 350, 330);
  ctx.quadraticCurveTo(370, 400, 390, PANEL_H);
  ctx.closePath();
  ctx.fill();
  // Pond: its colour changes on the right panel.
  ellipse(ctx, 300, 400, 95, 34, diffs.has('pond') ? '#3fae8a' : '#3f8fd2');
  ellipse(ctx, 275, 392, 40, 10, 'rgba(255,255,255,0.45)');
  ellipse(ctx, 330, 408, 26, 7, 'rgba(255,255,255,0.35)');
  // Bench.
  rect(ctx, 400, 330, 120, 10, '#8a5a2b');
  rect(ctx, 400, 348, 120, 10, '#8a5a2b');
  rect(ctx, 408, 358, 8, 34, '#6b4423');
  rect(ctx, 504, 358, 8, 34, '#6b4423');
  rect(ctx, 400, 306, 10, 26, '#8a5a2b');
  // Left tree: round canopy on the left panel, pointed on the right.
  rect(ctx, 82, 220, 16, 70, '#6b4423');
  if (diffs.has('tree')) {
    triangle(ctx, 40, 235, 90, 140, 140, 235, '#2a7d3f');
  } else {
    circle(ctx, 90, 180, 46, '#2a7d3f');
    circle(ctx, 52, 205, 30, '#35914a');
    circle(ctx, 128, 205, 30, '#2f8a44');
  }
  // Right tree.
  rect(ctx, 512, 250, 14, 55, '#6b4423');
  circle(ctx, 520, 225, 34, '#2a7d3f');
  circle(ctx, 492, 245, 20, '#35914a');
  circle(ctx, 548, 245, 20, '#2f8a44');
  // Butterfly: it moves down on the right panel.
  const bf = diffs.has('butterfly') ? [520, 250] : [520, 180];
  ellipse(ctx, bf[0] - 9, bf[1], 10, 14, '#ff8c42');
  ellipse(ctx, bf[0] + 9, bf[1], 10, 14, '#ffb347');
  circle(ctx, bf[0], bf[1], 4, '#4a3226');
  // Flowers along the grass.
  flower(ctx, 60, 430, '#ff6b9d', '#ffd93b');
  flower(ctx, 180, 460, '#ffffff', '#ff9f1c');
  flower(ctx, 420, 470, '#c77dff', '#ffd93b');
  flower(ctx, 500, 440, '#ff6b9d', '#ffd93b');
  flower(ctx, 250, 480, '#ff9f1c', '#7a4a21');
  // Extra flower on the right panel.
  if (diffs.has('flower')) flower(ctx, 120, 430, '#e63946', '#ffd93b');
  // Little fence, bottom right: one post is missing on the right panel.
  rect(ctx, 470, 440, 110, 6, '#a9713f');
  rect(ctx, 470, 462, 110, 6, '#a9713f');
  rect(ctx, 476, 432, 8, 46, '#8a5a2b');
  rect(ctx, 516, 432, 8, 46, '#8a5a2b');
  if (!diffs.has('fence')) rect(ctx, 556, 432, 8, 46, '#8a5a2b');
}

// ---------------------------------------------------------------- Level 2
function drawCozyKitchen(ctx, diffs) {
  // Wall and wooden floor.
  rect(ctx, 0, 0, PANEL_W, 400, '#f7e8c9');
  rect(ctx, 0, 400, PANEL_W, PANEL_H - 400, '#b07d4f');
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 2;
  for (let y = 420; y < PANEL_H; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(PANEL_W, y);
    ctx.stroke();
  }
  // Window with curtains: the curtain colour changes on the right panel.
  rect(ctx, 56, 56, 168, 168, '#ffffff');
  rect(ctx, 66, 66, 148, 148, '#9fd8f0');
  circle(ctx, 130, 130, 34, '#ffd93b');
  cloud(ctx, 170, 100);
  rect(ctx, 136, 66, 8, 148, '#ffffff');
  rect(ctx, 66, 136, 148, 8, '#ffffff');
  const curtain = diffs.has('curtain') ? '#2a9d8f' : '#e63946';
  triangle(ctx, 56, 50, 96, 50, 76, 230, curtain);
  triangle(ctx, 224, 50, 184, 50, 204, 230, curtain);
  // Wall clock: missing on the right panel.
  if (!diffs.has('clock')) {
    circle(ctx, 300, 70, 34, '#ffffff');
    ctx.strokeStyle = '#4a3226';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(300, 70, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(300, 70);
    ctx.lineTo(300, 48);
    ctx.moveTo(300, 70);
    ctx.lineTo(318, 78);
    ctx.stroke();
    circle(ctx, 300, 70, 4, '#4a3226');
  }
  // Shelf with jars: three on the left panel, two on the right.
  rect(ctx, 420, 128, 150, 10, '#8a5a2b');
  rect(ctx, 436, 96, 26, 32, '#7fb069');
  rect(ctx, 472, 96, 26, 32, '#e07a5f');
  if (!diffs.has('jars')) rect(ctx, 508, 96, 26, 32, '#f2cc8f');
  // Framed picture: missing on the right panel.
  if (!diffs.has('picture')) {
    rect(ctx, 452, 168, 72, 56, '#6b4423');
    rect(ctx, 458, 174, 60, 44, '#9fd8f0');
    triangle(ctx, 458, 218, 478, 188, 498, 218, '#2a7d3f');
    triangle(ctx, 488, 218, 508, 192, 518, 218, '#1e6b34');
    circle(ctx, 505, 186, 7, '#ffd93b');
  }
  // Hanging lamp.
  rect(ctx, 516, 0, 4, 46, '#4a3226');
  triangle(ctx, 492, 46, 544, 46, 518, 78, '#e07a5f');
  circle(ctx, 518, 82, 10, '#ffe66d');
  ellipse(ctx, 518, 92, 34, 12, 'rgba(255,230,109,0.35)');
  // Table.
  ellipse(ctx, 300, 470, 250, 22, 'rgba(0,0,0,0.15)');
  rect(ctx, 60, 320, 480, 26, '#8a5a2b');
  rect(ctx, 70, 346, 460, 16, '#7a4e24');
  rect(ctx, 90, 362, 14, 108, '#6b4423');
  rect(ctx, 496, 362, 14, 108, '#6b4423');
  // Rug: oval on the left panel, square on the right.
  if (diffs.has('rug')) {
    rect(ctx, 220, 452, 160, 34, '#e07a5f');
    rect(ctx, 236, 460, 128, 18, '#f2cc8f');
  } else {
    ellipse(ctx, 300, 470, 110, 22, '#e07a5f');
    ellipse(ctx, 300, 470, 74, 13, '#f2cc8f');
  }
  // Cat asleep on the chair, left of the table.
  circle(ctx, 140, 392, 34, '#ff9f1c');
  triangle(ctx, 112, 372, 122, 344, 134, 368, '#ff9f1c');
  triangle(ctx, 146, 368, 158, 344, 168, 372, '#ff9f1c');
  ctx.strokeStyle = '#ff9f1c';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(172, 400);
  ctx.quadraticCurveTo(200, 410, 192, 380);
  ctx.stroke();
  ctx.strokeStyle = '#4a3226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(128, 392);
  ctx.lineTo(134, 392);
  ctx.moveTo(146, 392);
  ctx.lineTo(152, 392);
  ctx.stroke();
  // Fruit bowl.
  ellipse(ctx, 300, 336, 70, 18, '#3d5a80');
  circle(ctx, 272, 322, 16, '#e63946');
  circle(ctx, 300, 314, 16, '#ff9f1c');
  circle(ctx, 326, 324, 16, '#e63946');
  // Extra apple on the right panel.
  if (diffs.has('apple')) circle(ctx, 330, 330, 14, '#e63946');
  // Teapot: it moves to the other side of the table on the right panel.
  const tp = diffs.has('teapot') ? [180, 350] : [430, 330];
  // Steam above the teapot.
  ctx.strokeStyle = 'rgba(120,120,120,0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(tp[0], tp[1] - 34);
  ctx.quadraticCurveTo(tp[0] - 6, tp[1] - 46, tp[0], tp[1] - 56);
  ctx.moveTo(tp[0] + 12, tp[1] - 34);
  ctx.quadraticCurveTo(tp[0] + 18, tp[1] - 46, tp[0] + 12, tp[1] - 56);
  ctx.stroke();
  ellipse(ctx, tp[0], tp[1] - 8, 26, 20, '#5a7d9a');
  rect(ctx, tp[0] - 6, tp[1] - 40, 12, 12, '#5a7d9a');
  triangle(ctx, tp[0] + 24, tp[1] - 18, tp[0] + 38, tp[1] - 4, tp[0] + 24, tp[1] + 2, '#5a7d9a');
}

// ---------------------------------------------------------------- Level 3
function drawMountainCamp(ctx, diffs) {
  // Dusk sky.
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  sky.addColorStop(0, '#2b2d5c');
  sky.addColorStop(0.55, '#7a4a7e');
  sky.addColorStop(0.8, '#e07a5f');
  sky.addColorStop(1, '#f2a65a');
  rect(ctx, 0, 0, PANEL_W, PANEL_H, sky);
  // Stars: one is missing on the right panel.
  star4(ctx, 120, 60, 7, '#ffffff');
  if (!diffs.has('star')) star4(ctx, 200, 50, 8, '#ffffff');
  star4(ctx, 350, 40, 6, '#ffffff');
  star4(ctx, 500, 90, 7, '#ffffff');
  star4(ctx, 80, 140, 6, '#ffffff');
  star4(ctx, 420, 130, 6, '#ffffff');
  star4(ctx, 280, 90, 5, '#ffe66d');
  // Moon: it moves to the other side of the sky on the right panel.
  const moon = diffs.has('moon') ? [90, 110] : [480, 70];
  circle(ctx, moon[0], moon[1], 26, '#ffeec2');
  circle(ctx, moon[0] - 8, moon[1] - 6, 6, '#e8d9a8');
  circle(ctx, moon[0] + 8, moon[1] + 8, 4, '#e8d9a8');
  // Mountains: the left peak is flat-topped on the right panel.
  triangle(ctx, 0, 320, 150, 150, 300, 320, '#4a4a7a');
  if (diffs.has('peak')) {
    ctx.fillStyle = '#4a4a7a';
    ctx.beginPath();
    ctx.moveTo(120, 185);
    ctx.lineTo(180, 185);
    ctx.lineTo(150, 150);
    ctx.closePath();
    ctx.fill();
  }
  triangle(ctx, 120, 190, 150, 150, 180, 190, '#ffffff');
  triangle(ctx, 220, 320, 420, 120, 600, 320, '#3a3a66');
  triangle(ctx, 385, 165, 420, 120, 455, 165, '#ffffff');
  // Ground.
  rect(ctx, 0, 320, PANEL_W, PANEL_H - 320, '#3d5a3a');
  ellipse(ctx, 300, 470, 260, 26, '#2f4a2e');
  // Pine trees: an extra one appears on the right panel.
  pineTree(ctx, 90, 400, 1);
  pineTree(ctx, 180, 420, 0.8);
  if (diffs.has('pine')) pineTree(ctx, 520, 380, 1);
  // Tent: orange on the left panel, teal on the right.
  const tent = diffs.has('tent') ? '#2a9d8f' : '#e76f51';
  triangle(ctx, 210, 440, 300, 330, 390, 440, tent);
  triangle(ctx, 278, 440, 300, 380, 322, 440, '#5a3226');
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 330);
  ctx.lineTo(300, 380);
  ctx.stroke();
  // Campfire: three logs on the left panel, two on the right.
  rect(ctx, 268, 448, 64, 10, '#6b4423');
  rect(ctx, 276, 438, 48, 10, '#8a5a2b');
  if (!diffs.has('logs')) rect(ctx, 284, 428, 32, 10, '#6b4423');
  ellipse(ctx, 300, 452, 34, 10, '#ff9f1c');
  ellipse(ctx, 300, 440, 22, 16, '#ff6b35');
  ellipse(ctx, 300, 430, 12, 14, '#ffd93b');
  // Marshmallow stick leaning by the fire.
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(352, 452);
  ctx.lineTo(378, 400);
  ctx.stroke();
  circle(ctx, 380, 396, 7, '#ffffff');
  circle(ctx, 388, 404, 7, '#fff3e0');
  // Backpack: missing on the right panel.
  if (!diffs.has('backpack')) {
    rect(ctx, 428, 408, 44, 46, '#e63946');
    ellipse(ctx, 450, 408, 22, 10, '#c1121f');
    rect(ctx, 440, 424, 20, 6, '#ffd93b');
    rect(ctx, 440, 436, 20, 6, '#ffd93b');
  }
}

// ------------------------------------------------------------------ entry
export function drawScene(ctx, levelIndex, diffs, ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.beginPath();
  ctx.rect(0, 0, PANEL_W, PANEL_H);
  ctx.clip();
  if (levelIndex === 0) drawSunnyPark(ctx, diffs);
  else if (levelIndex === 1) drawCozyKitchen(ctx, diffs);
  else drawMountainCamp(ctx, diffs);
  ctx.restore();
}
