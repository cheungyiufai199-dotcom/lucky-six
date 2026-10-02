import { ZodiacSign, SIGN_LUCKY_NUMBERS, SIGN_RULER } from "./astrology";
export function getSunSign(month: number, day: number): ZodiacSign {
  const dates: [number, number, ZodiacSign][] = [
    [3, 21, "白羊"], [4, 20, "金牛"], [5, 21, "雙子"], [6, 21, "巨蟹"], [7, 23, "獅子"], [8, 23, "處女"],
    [9, 23, "天秤"], [10, 23, "天蠍"], [11, 22, "射手"], [12, 22, "摩羯"], [1, 20, "水瓶"], [2, 19, "雙魚"],
  ];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "摩羯";
  for (let i = dates.length - 1; i >= 0; i--) {
    const [m, d, sign] = dates[i];
    if (month > m || (month === m && day >= d)) return sign;
  }
  return "摩羯";
}
export interface SunSignData { sign: ZodiacSign; ruler: string; luckyNumbers: number[]; }
export function getSunSignData(month: number, day: number): SunSignData {
  const sign = getSunSign(month, day);
  return { sign, ruler: SIGN_RULER[sign], luckyNumbers: SIGN_LUCKY_NUMBERS[sign] };
}
