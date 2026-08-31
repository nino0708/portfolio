import { describe, it, expect } from 'vitest';
import { findSlotCandidates } from './slotCandidates';

describe('findSlotCandidates', () => {
  const day = (h: number, m = 0) => `2026-08-31T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00+09:00`;

  it('busyが無ければ日の始まりを1件目の候補にする', () => {
    const result = findSlotCandidates({
      dayStartIso: day(9), dayEndIso: day(22), busy: [], estimateMin: 30,
    });
    expect(result[0]).toEqual({
      startIso: new Date(day(9)).toISOString(),
      endIso: new Date(day(9, 30)).toISOString(),
    });
  });

  it('estimateMinに満たない隙間は候補にしない', () => {
    const result = findSlotCandidates({
      dayStartIso: day(9),
      dayEndIso: day(12),
      busy: [
        { start: day(9), end: day(11, 50) },
      ],
      estimateMin: 30,
    });
    expect(result).toEqual([]);
  });

  it('maxCandidates件で打ち切る', () => {
    const result = findSlotCandidates({
      dayStartIso: day(9),
      dayEndIso: day(22),
      busy: [
        { start: day(10), end: day(10, 30) },
        { start: day(12), end: day(12, 30) },
        { start: day(14), end: day(14, 30) },
        { start: day(16), end: day(16, 30) },
      ],
      estimateMin: 15,
      maxCandidates: 2,
    });
    expect(result).toHaveLength(2);
  });

  it('隙間0件なら空配列', () => {
    const result = findSlotCandidates({
      dayStartIso: day(9),
      dayEndIso: day(10),
      busy: [{ start: day(9), end: day(10) }],
      estimateMin: 15,
    });
    expect(result).toEqual([]);
  });
});
