export interface TarotCard { number: number; name: string; nameEn: string; keywords: string[]; luckyNumbers: number[]; }
export const TAROT_CARDS: TarotCard[] = [
  { number: 0, name: "愚者", nameEn: "The Fool", keywords: ["開始", "冒險", "自由"], luckyNumbers: [22, 44] },
  { number: 1, name: "魔術師", nameEn: "The Magician", keywords: ["創造", "意志", "行動"], luckyNumbers: [1, 23, 45] },
  { number: 2, name: "女祭司", nameEn: "The High Priestess", keywords: ["直覺", "潛意識", "神秘"], luckyNumbers: [2, 24, 46] },
  { number: 3, name: "皇后", nameEn: "The Empress", keywords: ["豐收", "母性", "創造力"], luckyNumbers: [3, 25, 47] },
  { number: 4, name: "皇帝", nameEn: "The Emperor", keywords: ["權威", "穩定", "領導"], luckyNumbers: [4, 26, 48] },
  { number: 5, name: "教皇", nameEn: "The Hierophant", keywords: ["傳統", "信仰", "教導"], luckyNumbers: [5, 27, 49] },
  { number: 6, name: "戀人", nameEn: "The Lovers", keywords: ["愛情", "選擇", "和諧"], luckyNumbers: [6, 28] },
  { number: 7, name: "戰車", nameEn: "The Chariot", keywords: ["勝利", "意志", "前進"], luckyNumbers: [7, 29] },
  { number: 8, name: "力量", nameEn: "Strength", keywords: ["勇氣", "耐心", "內在力量"], luckyNumbers: [8, 30] },
  { number: 9, name: "隱士", nameEn: "The Hermit", keywords: ["內省", "智慧", "孤獨"], luckyNumbers: [9, 31] },
  { number: 10, name: "命運之輪", nameEn: "Wheel of Fortune", keywords: ["命運", "轉機", "循環"], luckyNumbers: [10, 32] },
  { number: 11, name: "正義", nameEn: "Justice", keywords: ["公平", "平衡", "因果"], luckyNumbers: [11, 33] },
  { number: 12, name: "倒吊人", nameEn: "The Hanged Man", keywords: ["犧牲", "等待", "新視角"], luckyNumbers: [12, 34] },
  { number: 13, name: "死神", nameEn: "Death", keywords: ["結束", "轉變", "重生"], luckyNumbers: [13, 35] },
  { number: 14, name: "節制", nameEn: "Temperance", keywords: ["平衡", "調和", "耐心"], luckyNumbers: [14, 36] },
  { number: 15, name: "惡魔", nameEn: "The Devil", keywords: ["誘惑", "束縛", "物質"], luckyNumbers: [15, 37] },
  { number: 16, name: "塔", nameEn: "The Tower", keywords: ["劇變", "破壞", "覺醒"], luckyNumbers: [16, 38] },
  { number: 17, name: "星星", nameEn: "The Star", keywords: ["希望", "靈感", "治癒"], luckyNumbers: [17, 39] },
  { number: 18, name: "月亮", nameEn: "The Moon", keywords: ["幻象", "恐懼", "直覺"], luckyNumbers: [18, 40] },
  { number: 19, name: "太陽", nameEn: "The Sun", keywords: ["成功", "快樂", "活力"], luckyNumbers: [19, 41] },
  { number: 20, name: "審判", nameEn: "Judgement", keywords: ["重生", "召喚", "覺醒"], luckyNumbers: [20, 42] },
  { number: 21, name: "世界", nameEn: "The World", keywords: ["完成", "圓滿", "成就"], luckyNumbers: [21, 43] },
];
export function getTarotByLifePath(lifePath: number): TarotCard {
  if (lifePath === 22) return TAROT_CARDS[0];
  if (lifePath === 33) return TAROT_CARDS[6];
  if (lifePath >= 0 && lifePath <= 21) return TAROT_CARDS[lifePath];
  return TAROT_CARDS[lifePath % 22];
}
export function getTarotByBirthday(day: number): TarotCard { return TAROT_CARDS[day % 22]; }
