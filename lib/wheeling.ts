export interface WheelingPlan { name: string; description: string; numbersNeeded: number; costPerBet: number; generate: (numbers: number[], danCount?: number) => number[][]; guarantee: string; }
function plan1Dan9Jiao(numbers: number[]): number[][] { if (numbers.length < 10) return []; const dan = numbers[0]; return numbers.slice(1, 10).map((j) => [dan, j]); }
function plan2Dan12Jiao(numbers: number[]): number[][] {
  if (numbers.length < 14) return [];
  const dans = numbers.slice(0, 2); const jiaos = numbers.slice(2, 14); const bets: number[][] = [];
  for (let i = 0; i < jiaos.length && bets.length < 26; i++) for (let j = i + 1; j < jiaos.length && bets.length < 26; j++) for (let k = j + 1; k < jiaos.length && bets.length < 26; k++) for (let l = k + 1; l < jiaos.length && bets.length < 26; l++) bets.push([...dans, jiaos[i], jiaos[j], jiaos[k], jiaos[l]]);
  return bets;
}
function planZhong6Bao5(numbers: number[]): number[][] {
  if (numbers.length < 12) return [];
  const bets: number[][] = []; const n = numbers.length;
  for (let i = 0; i < n && bets.length < 44; i++) for (let j = i + 1; j < n && bets.length < 44; j++) for (let k = j + 1; k < n && bets.length < 44; k++) for (let l = k + 1; l < n && bets.length < 44; l++) for (let m = l + 1; m < n && bets.length < 44; m++) for (let o = m + 1; o < n && bets.length < 44; o++) bets.push([numbers[i], numbers[j], numbers[k], numbers[l], numbers[m], numbers[o]]);
  return bets;
}
function plan17QuanCan(): number[][] {
  const all = Array.from({ length: 49 }, (_, i) => i + 1); const bets: number[][] = [];
  for (let i = 0; i < 17; i++) { const bet: number[] = []; for (let j = 0; j < 6; j++) bet.push(all[(i * 6 + j) % 49]); bets.push([...new Set(bet)].slice(0, 6)); }
  return bets;
}
function plan3Dan15Jiao(numbers: number[]): number[][] {
  if (numbers.length < 18) return [];
  const dans = numbers.slice(0, 3); const jiaos = numbers.slice(3, 18); const bets: number[][] = [];
  for (let i = 0; i < jiaos.length && bets.length < 20; i++) for (let j = i + 1; j < jiaos.length && bets.length < 20; j++) for (let k = j + 1; k < jiaos.length && bets.length < 20; k++) bets.push([...dans, jiaos[i], jiaos[j], jiaos[k]]);
  return bets;
}
export const WHEELING_PLANS: Record<string, WheelingPlan> = {
  dan1jiao9: { name: "1膽9腳", description: "10 個號碼，9 注單式", numbersNeeded: 10, costPerBet: 10, generate: plan1Dan9Jiao, guarantee: "腳中5個正碼時，至少中三獎" },
  dan2jiao12: { name: "2膽拖12腳", description: "14 個號碼，26 注單式", numbersNeeded: 14, costPerBet: 10, generate: plan2Dan12Jiao, guarantee: "膽全中 + 腳中4個  百分百中三獎" },
  zhong6bao5: { name: "中六保五", description: "12 個號碼，44 注單式", numbersNeeded: 12, costPerBet: 10, generate: planZhong6Bao5, guarantee: "12 碼含全部 6 正碼  至少中三獎" },
  quanCan17: { name: "17注全餐", description: "覆蓋 49 個號碼，17 注", numbersNeeded: 0, costPerBet: 10, generate: () => plan17QuanCan(), guarantee: "不保證中獎" },
  dan3jiao15: { name: "3膽拖15腳", description: "18 個號碼，20 注單式", numbersNeeded: 18, costPerBet: 10, generate: plan3Dan15Jiao, guarantee: "膽中2個 + 腳中3個  至少中五獎" },
};
export function recommendPlan(budget: number, numbersAvailable: number): WheelingPlan[] {
  return Object.values(WHEELING_PLANS).filter((plan) => { if (plan.numbersNeeded > numbersAvailable && plan.numbersNeeded > 0) return false; const testBets = plan.generate(Array.from({ length: Math.max(numbersAvailable, 10) }, (_, i) => i + 1)); return testBets.length * plan.costPerBet <= budget; });
}
