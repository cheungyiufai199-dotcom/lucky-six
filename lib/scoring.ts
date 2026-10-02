import { YongShenResult, WuXing } from "./types";
import { wuXingScore } from "./wuxing";
import { SHENGXIAO_WUXING_2025, TAIL_WUXING } from "./zodiac";
import { AstrologyChart, SIGN_LUCKY_NUMBERS, ZodiacSign } from "./astrology";
import { NumerologyResult } from "./numerology";
import { TarotCard } from "./tarot";
import { SunSignData } from "./constellation";
import { DataAnalysisResult, dataScore } from "./data-analysis";
import { WeightConfig } from "./weights";
export interface NumberScore { number: number; total: number; breakdown: { bazi: number; shengXiao: number; tail: number; astrology: number; numerology: number; sunSign: number; data: number; ai: number; }; reasons: string[]; }
export interface ScoringInput { yongShen: YongShenResult; chart: AstrologyChart; numerology: NumerologyResult; tarotLife: TarotCard; tarotBirthday: TarotCard; sunSign: ZodiacSign; sunSignData: SunSignData; dataAnalysis: DataAnalysisResult; aiPredictions?: { number: number; probability: number }[]; }
export function scoreNumber(num: number, input: ScoringInput, weights: WeightConfig): NumberScore {
  const reasons: string[] = [];
  const shengXiaoWuXing = (SHENGXIAO_WUXING_2025[num] || "土") as WuXing;
  const tailWuXing = (TAIL_WUXING[num % 10] || "土") as WuXing;
  const baziShengXiao = wuXingScore(shengXiaoWuXing, input.yongShen.yongShen, input.yongShen.jiShen);
  const baziTail = wuXingScore(tailWuXing, input.yongShen.yongShen, input.yongShen.jiShen);
  const shengXiaoWeighted = baziShengXiao * (weights.shengXiaoRatio / 100);
  const tailWeighted = baziTail * (weights.tailRatio / 100);
  const baziScore = shengXiaoWeighted + tailWeighted;
  if (baziShengXiao > 0) reasons.push("生肖五行" + shengXiaoWuXing + "為用神");
  if (baziTail > 0) reasons.push("尾數五行" + tailWuXing + "為用神");
  let astrologyScore = 0;
  const signNumbers = SIGN_LUCKY_NUMBERS[input.sunSign] || [];
  if (signNumbers.includes(num)) { astrologyScore += 3; reasons.push("太陽星座" + input.sunSign + "幸運號碼"); }
  input.chart.planets.forEach((p) => { if ((SIGN_LUCKY_NUMBERS[p.sign] || []).includes(num)) { astrologyScore += 1; reasons.push(p.planet + "在" + p.sign + "對應"); } });
  if ((SIGN_LUCKY_NUMBERS[input.chart.ascendant] || []).includes(num)) { astrologyScore += 2; reasons.push("上升星座" + input.chart.ascendant + "對應"); }
  let numerologyScore = 0;
  if (input.numerology.luckyNumbers.includes(num)) { numerologyScore += 3; reasons.push("生命靈數" + input.numerology.lifePath + "幸運號碼"); }
  if (input.tarotLife.luckyNumbers.includes(num)) { numerologyScore += 2; reasons.push("塔羅「" + input.tarotLife.name + "」對應"); }
  if (input.tarotBirthday.luckyNumbers.includes(num)) { numerologyScore += 1; reasons.push("生日塔羅「" + input.tarotBirthday.name + "」對應"); }
  let sunSignScore = 0;
  if (input.sunSignData.luckyNumbers.includes(num)) { sunSignScore += 2; reasons.push("太陽星座" + input.sunSign + "幸運數字"); }
  const dScore = dataScore(num, input.dataAnalysis, { freq: weights.freq, hot: weights.hot, cold: weights.cold, overdue: weights.overdue, tail: weights.tail });
  let aiScore = 0;
  if (input.aiPredictions) { const aiPred = input.aiPredictions.find((p) => p.number === num); if (aiPred) { aiScore = aiPred.probability * 10; if (aiPred.probability > 0.5) reasons.push("AI 預測 " + (aiPred.probability * 100).toFixed(1) + "%"); } }
  const chineseTotal = (baziScore * weights.baziYongShen) / 100 + (shengXiaoWeighted * weights.shengXiaoWuXing) / 100 + (tailWeighted * weights.tailWuXing) / 100;
  const westernTotal = (astrologyScore * weights.astrology) / 100 + (numerologyScore * weights.numerology) / 100 + (sunSignScore * weights.sunSign) / 100;
  const dataTotal = dScore * weights.data;
  const total = (chineseTotal * weights.chinese) / 100 + (westernTotal * weights.western) / 100 + (dataTotal * weights.data) / 100 + aiScore * (weights.aiWeight / 100);
  return { number: num, total, breakdown: { bazi: baziScore, shengXiao: shengXiaoWeighted, tail: tailWeighted, astrology: astrologyScore, numerology: numerologyScore, sunSign: sunSignScore, data: dScore, ai: aiScore }, reasons };
}
export function scoreAllNumbers(input: ScoringInput, weights: WeightConfig): NumberScore[] {
  const results: NumberScore[] = [];
  for (let n = 1; n <= 49; n++) results.push(scoreNumber(n, input, weights));
  return results.sort((a, b) => b.total - a.total);
}
export function getTopNumbers(scores: NumberScore[], n: number): number[] { return scores.slice(0, n).map((s) => s.number); }
