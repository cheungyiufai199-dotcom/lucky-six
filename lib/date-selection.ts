import { calculateLiuNianLiuYueLiuRi } from "./bazi";
import { getRelation, relationScore } from "./zodiac";
import { ShengXiao } from "./types";
import { WeightConfig } from "./weights";
export interface DayScore { date: string; dayOfWeek: string; yearRel: { rel: string; score: number }; monthRel: { rel: string; score: number }; dayRel: { rel: string; score: number }; total: number; isChong: boolean; reason: string; }
export function calculateDateScores(userShengXiao: ShengXiao, daysAhead: number, weights: WeightConfig, includeChong: boolean = false): DayScore[] {
  const results: DayScore[] = []; const today = new Date();
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const liu = calculateLiuNianLiuYueLiuRi(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const yearRel = getRelation(userShengXiao, liu.yearShengXiao);
    const monthRel = getRelation(userShengXiao, liu.monthShengXiao);
    const dayRel = getRelation(userShengXiao, liu.dayShengXiao);
    const yearScore = relationScore(yearRel) * weights.liuNianWeight;
    const monthScore = relationScore(monthRel) * weights.liuYueWeight;
    const dayScore = relationScore(dayRel) * weights.liuRiWeight;
    const total = yearScore + monthScore + dayScore;
    const isChong = dayRel === "相沖";
    if (isChong && !includeChong) continue;
    const dayOfWeek = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
    let reason = "";
    if (dayRel === "六合") reason = "流日" + liu.dayShengXiao + "與你六合";
    else if (dayRel === "三合") reason = "流日" + liu.dayShengXiao + "與你三合";
    else if (isChong) reason = "流日" + liu.dayShengXiao + "與你相沖";
    else reason = "流日" + liu.dayShengXiao;
    results.push({ date: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"), dayOfWeek: "星期" + dayOfWeek, yearRel: { rel: yearRel, score: yearScore }, monthRel: { rel: monthRel, score: monthScore }, dayRel: { rel: dayRel, score: dayScore }, total, isChong, reason });
  }
  return results.sort((a, b) => b.total - a.total);
}
export function getBestDate(scores: DayScore[]): DayScore | null { return scores.length > 0 ? scores[0] : null; }
