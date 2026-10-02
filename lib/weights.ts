export interface WeightConfig { chinese: number; western: number; data: number; baziYongShen: number; liuNian: number; shengXiaoWuXing: number; tailWuXing: number; astrology: number; numerology: number; sunSign: number; freq: number; hot: number; cold: number; overdue: number; tail: number; aiWeight: number; liuNianWeight: number; liuYueWeight: number; liuRiWeight: number; shengXiaoRatio: number; tailRatio: number; }
export const DEFAULT_WEIGHTS: WeightConfig = { chinese: 40, western: 25, data: 25, baziYongShen: 35, liuNian: 25, shengXiaoWuXing: 25, tailWuXing: 15, astrology: 50, numerology: 30, sunSign: 20, freq: 0.3, hot: 0.25, cold: 0.25, overdue: 0.25, tail: 0.2, aiWeight: 10, liuNianWeight: 0.4, liuYueWeight: 0.3, liuRiWeight: 0.3, shengXiaoRatio: 70, tailRatio: 30 };
export const PRESETS: Record<string, Partial<WeightConfig>> = {
  "平衡": { chinese: 33, western: 33, data: 34 },
  "中國命理為主": { chinese: 60, western: 25, data: 15 },
  "西方占卜為主": { chinese: 25, western: 50, data: 25 },
  "數據為主": { chinese: 20, western: 20, data: 60 },
  "AI為主": { chinese: 20, western: 20, data: 20, aiWeight: 40 },
};
