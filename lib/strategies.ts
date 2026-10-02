export interface Strategy { id: string; name: string; origin: string; description: string; realEffect: string; apply: (input: StrategyInput) => StrategyOutput; }
export interface StrategyInput { topNumbers: number[]; userFixedNumbers?: number[]; }
export interface StrategyOutput { bets: number[][]; explanation: string; cost: number; guarantee: string; }
function strategyCross(input: StrategyInput): StrategyOutput {
  const nums = input.topNumbers.slice(0, 24);
  if (nums.length < 24) return { bets: [], explanation: "需要至少 24 個號碼", cost: 0, guarantee: "不適用" };
  const g1 = nums.slice(0, 6), g2 = nums.slice(6, 12), g3 = nums.slice(12, 18), g4 = nums.slice(18, 24);
  const bets = [[g1[0], g1[1], g2[0], g2[1], g3[0], g3[1]], [g1[2], g1[3], g2[2], g2[3], g4[0], g4[1]], [g3[2], g3[3], g4[2], g4[3], g1[4], g1[5]], [g2[4], g2[5], g3[4], g3[5], g4[4], g4[5]]];
  return { bets, explanation: "24 個號碼分 4 組，畫十字交叉重組成 4 注。", cost: bets.length * 10, guarantee: "不保證中獎" };
}
function strategyMandel(input: StrategyInput): StrategyOutput {
  const nums = input.topNumbers.slice(0, 18);
  if (nums.length < 6) return { bets: [], explanation: "需要至少 6 個號碼", cost: 0, guarantee: "不適用" };
  const bets: number[][] = [];
  for (let i = 0; i < nums.length; i++) { const bet: number[] = []; for (let j = 0; j < 6; j++) bet.push(nums[(i + j) % nums.length]); const unique = [...new Set(bet)]; if (unique.length === 6) bets.push(unique); }
  return { bets, explanation: "Mandel 溫和版：確保每個號碼至少出現兩次。", cost: bets.length * 10, guarantee: "不保證中獎" };
}
function strategyFullCoverage(): StrategyOutput {
  const all = Array.from({ length: 49 }, (_, i) => i + 1); const bets: number[][] = [];
  for (let i = 0; i < 17; i++) { const bet: number[] = []; for (let j = 0; j < 6; j++) bet.push(all[(i * 6 + j) % 49]); const unique = [...new Set(bet)]; while (unique.length < 6) { const c = all[Math.floor(Math.random() * 49)]; if (!unique.includes(c)) unique.push(c); } bets.push(unique.slice(0, 6)); }
  return { bets, explanation: "英國教授團隊方法：17 注覆蓋全部 49 個號碼。", cost: bets.length * 10, guarantee: "不保證中獎" };
}
function strategyFixedNumbers(input: StrategyInput): StrategyOutput {
  const nums = input.userFixedNumbers || input.topNumbers.slice(0, 6);
  if (nums.length < 6) return { bets: [], explanation: "需要至少 6 個固定號碼", cost: 0, guarantee: "不適用" };
  const bet = nums.slice(0, 6);
  const bets = [bet, bet, bet, bet, bet];
  return { bets, explanation: "Richard Lustig 方法：固定同一組號碼長期重複購買。", cost: bets.length * 10, guarantee: "不保證中獎" };
}
function strategyValueBet(input: StrategyInput): StrategyOutput {
  const high = input.topNumbers.filter((n) => n >= 32 && n !== 38 && n !== 48);
  const low = input.topNumbers.filter((n) => n < 32);
  const pool = [...high, ...low]; const bets: number[][] = [];
  for (let i = 0; i < Math.min(6, Math.floor(pool.length / 6)); i++) bets.push(pool.slice(i * 6, i * 6 + 6));
  return { bets, explanation: "值博率策略：優先揀 32-49，避開生日同情意結號碼。", cost: bets.length * 10, guarantee: "提高派彩金額，但唔改變中獎機率" };
}
export const STRATEGIES: Strategy[] = [
  { id: "cross", name: "畫十字投注法", origin: "香港六合彩頭獎得主（2003年）", description: "買 4 注電腦飛，畫十字分成四部份，重新組合成 4 注。", realEffect: "❌ 不改變中獎機率", apply: strategyCross },
  { id: "mandel", name: "Mandel 覆蓋法（溫和版）", origin: "Stefan Mandel（14 次頭獎）", description: "用滾動窗口確保所有推薦號碼都出現喺注項入面。", realEffect: "❌ 不改變中獎機率", apply: strategyMandel },
  { id: "fullCoverage", name: "全號碼覆蓋（17注全餐）", origin: "英國布拉德福德大學教授團隊", description: "17 注覆蓋全部 49 個號碼，每個號碼至少出現兩次。", realEffect: "❌ 不改變中獎機率", apply: () => strategyFullCoverage() },
  { id: "fixed", name: "固定號碼組", origin: "Richard Lustig（7 次中獎）", description: "固定同一組號碼，長期重複購買。", realEffect: "❌ 不改變中獎機率", apply: strategyFixedNumbers },
  { id: "valueBet", name: "值博率策略", origin: "香港值博率分析", description: "優先揀 32-49 嘅號碼，避開生日同情意結號碼。", realEffect: "✅ 提高派彩金額，但唔改變中獎機率", apply: strategyValueBet },
];
