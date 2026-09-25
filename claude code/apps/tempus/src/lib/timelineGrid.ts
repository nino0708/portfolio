// 「今日の時間割」のグリッド計算。6:00〜24:00 を15分刻みで表示し、
// ピクセル位置↔分の変換をここに集める（Timeline描画とドラッグ&ドロップの両方が使う）。

export const GRID_START_MIN = 6 * 60; // 06:00
export const GRID_END_MIN = 24 * 60;  // 24:00
export const SLOT_MIN = 15;
export const PX_PER_MIN = 1;
export const GRID_HEIGHT_PX = (GRID_END_MIN - GRID_START_MIN) * PX_PER_MIN;
export const MIN_BLOCK_MIN = SLOT_MIN;

export function minutesToY(min: number): number {
  return (min - GRID_START_MIN) * PX_PER_MIN;
}

/** ピクセルのオフセット（グリッド上端からの距離）を15分刻みの分数に変換する */
export function yToSnappedMinutes(offsetY: number): number {
  const raw = GRID_START_MIN + offsetY / PX_PER_MIN;
  const snapped = Math.round(raw / SLOT_MIN) * SLOT_MIN;
  return Math.min(GRID_END_MIN - SLOT_MIN, Math.max(GRID_START_MIN, snapped));
}

/** 'HH:MM' 文字列に変換 */
export function minutesToHHMM(min: number): string {
  const clamped = Math.max(0, Math.min(24 * 60, min));
  const hh = String(Math.floor(clamped / 60)).padStart(2, '0');
  const mm = String(clamped % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}
