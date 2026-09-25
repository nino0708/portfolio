import { mergeBusy, subtractBusy } from './plan';
import type { BusyBlock } from '../types/domain';

export interface SlotCandidateInput {
  dayStartIso: string;
  dayEndIso: string;
  busy: BusyBlock[];
  estimateMin: number;
  maxCandidates?: number;
}

export interface SlotCandidate {
  startIso: string;
  endIso: string;
}

const DEFAULT_MAX_CANDIDATES = 4;

/**
 * 今日の空きギャップから、estimateMin に収まる候補を先頭からmaxCandidates件返す。
 * 1つの大きなギャップを複数候補に割らない（YAGNI。まずは「置ける場所」を示すだけで十分）。
 */
export function findSlotCandidates(input: SlotCandidateInput): SlotCandidate[] {
  const windowStart = Date.parse(input.dayStartIso);
  const windowEnd = Date.parse(input.dayEndIso);
  const merged = mergeBusy(input.busy);
  const gaps = subtractBusy(windowStart, windowEnd, merged);
  const estimateMs = input.estimateMin * 60 * 1000;
  const max = input.maxCandidates ?? DEFAULT_MAX_CANDIDATES;

  const candidates: SlotCandidate[] = [];
  for (const gap of gaps) {
    if (gap.end - gap.start < estimateMs) continue;
    candidates.push({
      startIso: new Date(gap.start).toISOString(),
      endIso: new Date(gap.start + estimateMs).toISOString(),
    });
    if (candidates.length >= max) break;
  }
  return candidates;
}
