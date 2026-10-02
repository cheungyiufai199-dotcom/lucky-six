export interface NumerologyResult { lifePath: number; isMaster: boolean; birthday: number; luckyNumbers: number[]; }
export function digitalRoot(n: number): number {
  while (n > 9) {
    if (n === 11 || n === 22 || n === 33) return n;
    n = String(n).split("").reduce((s, d) => s + parseInt(d), 0);
  }
  return n;
}
export function calculateLifePath(year: number, month: number, day: number): number {
  return digitalRoot(digitalRoot(year) + digitalRoot(month) + digitalRoot(day));
}
export const LIFE_PATH_LUCKY: Record<number, number[]> = {
  1: [1, 10, 19, 28, 37, 46], 2: [2, 11, 20, 29, 38, 47], 3: [3, 12, 21, 30, 39, 48],
  4: [4, 13, 22, 31, 40, 49], 5: [5, 14, 23, 32, 41], 6: [6, 15, 24, 33, 42],
  7: [7, 16, 25, 34, 43], 8: [8, 17, 26, 35, 44], 9: [9, 18, 27, 36, 45],
  11: [11, 29, 38, 47], 22: [22, 31, 40, 49], 33: [6, 15, 24, 33, 42],
};
export function calculateNumerology(year: number, month: number, day: number): NumerologyResult {
  const lifePath = calculateLifePath(year, month, day);
  return { lifePath, isMaster: lifePath === 11 || lifePath === 22 || lifePath === 33, birthday: digitalRoot(day), luckyNumbers: LIFE_PATH_LUCKY[lifePath] || [] };
}
