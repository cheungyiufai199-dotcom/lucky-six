import { DiZhi, ShengXiao, ShengXiaoRelation } from "./types";
export const ZHI_SHENGXIAO: Record<DiZhi, ShengXiao> = { 子: "鼠", 丑: "牛", 寅: "虎", 卯: "兔", 辰: "龍", 巳: "蛇", 午: "馬", 未: "羊", 申: "猴", 酉: "雞", 戌: "狗", 亥: "豬" };
export const LIUHE: Record<ShengXiao, ShengXiao> = { 鼠: "牛", 牛: "鼠", 虎: "豬", 豬: "虎", 兔: "狗", 狗: "兔", 龍: "雞", 雞: "龍", 蛇: "猴", 猴: "蛇", 馬: "羊", 羊: "馬" };
export const SANHE: Record<ShengXiao, ShengXiao[]> = { 猴: ["鼠", "龍"], 鼠: ["猴", "龍"], 龍: ["猴", "鼠"], 豬: ["兔", "羊"], 兔: ["豬", "羊"], 羊: ["豬", "兔"], 虎: ["馬", "狗"], 馬: ["虎", "狗"], 狗: ["虎", "馬"], 蛇: ["雞", "牛"], 雞: ["蛇", "牛"], 牛: ["蛇", "雞"] };
export const XIANGCHONG: Record<ShengXiao, ShengXiao> = { 鼠: "馬", 馬: "鼠", 牛: "羊", 羊: "牛", 虎: "猴", 猴: "虎", 兔: "雞", 雞: "兔", 龍: "狗", 狗: "龍", 蛇: "豬", 豬: "蛇" };
export function getRelation(a: ShengXiao, b: ShengXiao): ShengXiaoRelation { if (LIUHE[a] === b) return "六合"; if (SANHE[a]?.includes(b)) return "三合"; if (XIANGCHONG[a] === b) return "相沖"; return "無關係"; }
export function relationScore(r: ShengXiaoRelation): number { return r === "六合" ? 3 : r === "三合" ? 2 : r === "相沖" ? -3 : 0; }
export const SHENGXIAO_WUXING_2025: Record<number, string> = { 1: "金", 2: "金", 15: "金", 16: "金", 23: "金", 24: "金", 31: "金", 32: "金", 45: "金", 46: "金", 5: "木", 6: "木", 13: "木", 14: "木", 27: "木", 28: "木", 35: "木", 36: "木", 43: "木", 44: "木", 3: "水", 4: "水", 11: "水", 12: "水", 19: "水", 20: "水", 33: "水", 34: "水", 41: "水", 42: "水", 49: "水", 7: "火", 8: "火", 21: "火", 22: "火", 29: "火", 30: "火", 37: "火", 38: "火", 9: "土", 10: "土", 17: "土", 18: "土", 25: "土", 26: "土", 39: "土", 40: "土", 47: "土", 48: "土" };
export const TAIL_WUXING: Record<number, string> = { 0: "土", 5: "土", 1: "水", 6: "水", 2: "火", 7: "火", 3: "木", 8: "木", 4: "金", 9: "金" };
