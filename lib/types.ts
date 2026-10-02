export type WuXing = "金" | "木" | "水" | "火" | "土";
export type TianGan = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type DiZhi = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
export type ShengXiao = "鼠" | "牛" | "虎" | "兔" | "龍" | "蛇" | "馬" | "羊" | "猴" | "雞" | "狗" | "豬";
export interface Pillar { gan: TianGan; zhi: DiZhi; ganWuXing: WuXing; zhiWuXing: WuXing; }
export interface BaZi { year: Pillar; month: Pillar; day: Pillar; hour: Pillar; dayMaster: TianGan; dayMasterWuXing: WuXing; shengXiao: ShengXiao; }
export interface WuXingCount { 金: number; 木: number; 水: number; 火: number; 土: number; }
export interface YongShenResult { dayMasterStrength: "強" | "弱" | "中和"; yongShen: WuXing[]; jiShen: WuXing[]; reason: string; }
export interface LiuNianLiuYueLiuRi { year: Pillar; month: Pillar; day: Pillar; yearShengXiao: ShengXiao; monthShengXiao: ShengXiao; dayShengXiao: ShengXiao; }
export type ShengXiaoRelation = "六合" | "三合" | "相沖" | "無關係";
