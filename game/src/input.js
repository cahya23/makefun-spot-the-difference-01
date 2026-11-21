// Twin Gardens — Spot the Difference
// input.js: turns a pointer click on the canvas into a panel-local position.
// The canvas is drawn at a fixed internal size, so client coordinates are
// scaled by the canvas's on-screen box. A click belongs to the left panel,
// the right panel, or neither (the gap between them, or outside).

import { PANEL_W, PANEL_H, PANEL_GAP, PANEL_MARGIN } from './config.js';

export function attachPanelClicks(canvas, onPanelClick) {
  canvas.addEventListener('pointerdown', (event) => {
    const box = canvas.getBoundingClientRect();
    const scaleX = canvas.width / box.width;
    const scaleY = canvas.height / box.height;
    const x = (event.clientX - box.left) * scaleX;
    const y = (event.clientY - box.top) * scaleY;
    const leftX = PANEL_MARGIN;
    const rightX = PANEL_MARGIN + PANEL_W + PANEL_GAP;
    const top = PANEL_MARGIN;
    if (y < top || y > top + PANEL_H) return;
    if (x >= leftX && x <= leftX + PANEL_W) {
      onPanelClick('left', x - leftX, y - top);
    } else if (x >= rightX && x <= rightX + PANEL_W) {
      onPanelClick('right', x - rightX, y - top);
    }
  });
}

// Nearest unfound difference within its click radius, or null.
export function pickDifference(diffs, found, x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const d of diffs) {
    if (found.has(d.id)) continue;
    const dist = Math.hypot(d.x - x, d.y - y);
    if (dist <= d.r + 14 && dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  return best;
}
