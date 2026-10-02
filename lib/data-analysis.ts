import { DrawResult } from "./marksix-data";
export interface FrequencyStat { number: number; count: number; lastSeen: string; gapDays: number; gapDraws: number; }
export interface DataAnalysisResult { frequencies: FrequencyStat[]; hotNumbers: number[]; coldNumbers: number[]; overdueNumbers: number[]; tailDistribution: Record<number, number>; }
export function analyzeFrequency(data: DrawResult[]): FrequencyStat[] {
  const stats: FrequencyStat[] = [];
  const latestDate = data.length > 0 ? data[0].date : "";
  for (let n = 1; n <= 49; n++) {
    let count = 0, lastSeen = "", lastIdx = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i].numbers.includes(n) || data[i].special === n) {
        count++;
        if (!lastSeen) { lastSeen = data[i].date; lastIdx = i; }
      }
    }
    const gapDraws = lastIdx >= 0 ? lastIdx : data.length;
    const gapDays = lastSeen ? Math.floor((new Date(latestDate).getTime() - new Date(lastSeen).getTime()) / 86400000) : 9999;
    stats.push({ number: n, count, lastSeen, gapDays, gapDraws });
  }
  return stats;
}
export function getHotCold(data: DrawResult[], recentCount: number = 50) {
  const recent = data.slice(0, recentCount);
  const countMap: Record<number, number> = {};
  for (let n = 1; n <= 49; n++) countMap[n] = 0;
  recent.forEach((d) => { d.numbers.forEach((n) => countMap[n]++); countMap[d.special]++; });
  const sorted = Object.entries(countMap).map(([n, c]) => ({ number: Number(n), count: c })).sort((a, b) => b.count - a.count);
  return { hot: sorted.slice(0, 12).map((s) => s.number), cold: sorted.slice(-12).map((s) => s.number) };
}
export function getOverdue(data: DrawResult[]): number[] {
  return analyzeFrequency(data).sort((a, b) => b.gapDraws - a.gapDraws).slice(0, 12).map((f) => f.number);
}
export function getTailDistribution(data: DrawResult[]): Record<number, number> {
  const dist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  data.forEach((d) => { [...d.numbers, d.special].forEach((n) => { dist[n % 10]++; }); });
  return dist;
}
export function analyzeAll(data: DrawResult[]): DataAnalysisResult {
  return { frequencies: analyzeFrequency(data), ...getHotCold(data), overdueNumbers: getOverdue(data), tailDistribution: getTailDistribution(data) };
}
export function dataScore(number: number, analysis: DataAnalysisResult, weights: { freq: number; hot: number; cold: number; overdue: number; tail: number }): number {
  let score = 0;
  const freq = analysis.frequencies.find((f) => f.number === number);
  if (freq) score += freq.count * weights.freq;
  if (analysis.hotNumbers.includes(number)) score += weights.hot;
  if (analysis.coldNumbers.includes(number)) score += weights.cold;
  if (analysis.overdueNumbers.includes(number)) score += weights.overdue;
  score += (analysis.tailDistribution[number % 10] || 0) * weights.tail * 0.1;
  return score;
}
