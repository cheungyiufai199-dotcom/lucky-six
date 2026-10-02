import { Solar } from "lunar-javascript";
import { BaZi, Pillar, TianGan, DiZhi, LiuNianLiuYueLiuRi } from "./types";
import { GAN_WUXING, ZHI_WUXING } from "./wuxing";
import { ZHI_SHENGXIAO } from "./zodiac";
export function calculateBaZi(year: number, month: number, day: number, hour: number, minute: number = 0): BaZi {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const ec = solar.getLunar().getEightChar();
  const yG = ec.getYearGan() as TianGan, yZ = ec.getYearZhi() as DiZhi;
  const mG = ec.getMonthGan() as TianGan, mZ = ec.getMonthZhi() as DiZhi;
  const dG = ec.getDayGan() as TianGan, dZ = ec.getDayZhi() as DiZhi;
  const hG = ec.getTimeGan() as TianGan, hZ = ec.getTimeZhi() as DiZhi;
  const mk = (g: TianGan, z: DiZhi): Pillar => ({ gan: g, zhi: z, ganWuXing: GAN_WUXING[g], zhiWuXing: ZHI_WUXING[z] });
  return { year: mk(yG, yZ), month: mk(mG, mZ), day: mk(dG, dZ), hour: mk(hG, hZ), dayMaster: dG, dayMasterWuXing: GAN_WUXING[dG], shengXiao: ZHI_SHENGXIAO[yZ] };
}
export function calculateLiuNianLiuYueLiuRi(year: number, month: number, day: number): LiuNianLiuYueLiuRi {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const ec = solar.getLunar().getEightChar();
  const yG = ec.getYearGan() as TianGan, yZ = ec.getYearZhi() as DiZhi;
  const mG = ec.getMonthGan() as TianGan, mZ = ec.getMonthZhi() as DiZhi;
  const dG = ec.getDayGan() as TianGan, dZ = ec.getDayZhi() as DiZhi;
  const mk = (g: TianGan, z: DiZhi): Pillar => ({ gan: g, zhi: z, ganWuXing: GAN_WUXING[g], zhiWuXing: ZHI_WUXING[z] });
  return { year: mk(yG, yZ), month: mk(mG, mZ), day: mk(dG, dZ), yearShengXiao: ZHI_SHENGXIAO[yZ], monthShengXiao: ZHI_SHENGXIAO[mZ], dayShengXiao: ZHI_SHENGXIAO[dZ] };
}
