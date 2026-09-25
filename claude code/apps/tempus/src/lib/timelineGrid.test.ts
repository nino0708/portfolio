import { describe, expect, it } from 'vitest';
import {
  GRID_END_MIN, GRID_START_MIN, minutesToHHMM, minutesToY, yToSnappedMinutes,
} from './timelineGrid';

describe('timelineGrid', () => {
  it('grid開始のYは0', () => {
    expect(minutesToY(GRID_START_MIN)).toBe(0);
  });

  it('15分刻みにスナップする', () => {
    expect(yToSnappedMinutes(minutesToY(GRID_START_MIN) + 7)).toBe(GRID_START_MIN);
    expect(yToSnappedMinutes(minutesToY(GRID_START_MIN) + 8)).toBe(GRID_START_MIN + 15);
  });

  it('グリッド範囲外はクランプする', () => {
    expect(yToSnappedMinutes(-9999)).toBe(GRID_START_MIN);
    expect(yToSnappedMinutes(9999)).toBe(GRID_END_MIN - 15);
  });

  it('HH:MM表記に変換する', () => {
    expect(minutesToHHMM(6 * 60)).toBe('06:00');
    expect(minutesToHHMM(23 * 60 + 45)).toBe('23:45');
  });
});
