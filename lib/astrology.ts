import * as Astronomy from "astronomy-engine";
export type ZodiacSign = "白羊" | "金牛" | "雙子" | "巨蟹" | "獅子" | "處女" | "天秤" | "天蠍" | "射手" | "摩羯" | "水瓶" | "雙魚";
export type Planet = "太陽" | "月亮" | "水星" | "金星" | "火星" | "木星" | "土星" | "天王星" | "海王星" | "冥王星";
export interface PlanetPosition { planet: Planet; longitude: number; sign: ZodiacSign; degree: number; }
export interface House { number: number; startLongitude: number; sign: ZodiacSign; }
export interface AstrologyChart { planets: PlanetPosition[]; ascendant: ZodiacSign; ascendantLongitude: number; houses: House[]; sunSign: ZodiacSign; moonSign: ZodiacSign; }
export function longitudeToSign(l: number): ZodiacSign {
  const s: ZodiacSign[] = ["白羊", "金牛", "雙子", "巨蟹", "獅子", "處女", "天秤", "天蠍", "射手", "摩羯", "水瓶", "雙魚"];
  return s[Math.floor((((l % 360) + 360) % 360) / 30)];
}
export function longitudeToDegree(l: number): number { return ((l % 30) + 30) % 30; }
function getPlanetLongitude(body: Astronomy.Body, date: Date): number {
  return Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;
}
function calculateAscendant(date: Date, latitude: number, longitude: number): number {
  const gmst = Astronomy.SiderealTime(date);
  const lst = (gmst + longitude / 15) * 15;
  const lstRad = (lst * Math.PI) / 180, latRad = (latitude * Math.PI) / 180, oblRad = (23.4393 * Math.PI) / 180;
  const ascRad = Math.atan2(Math.cos(lstRad), -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad)));
  let asc = (ascRad * 180) / Math.PI;
  return ((asc % 360) + 360) % 360;
}
export function calculateAstrologyChart(year: number, month: number, day: number, hour: number, minute: number, latitude = 22.3193, longitude = 114.1694): AstrologyChart {
  const localDate = new Date(Date.UTC(year, month - 1, day, hour - 8, minute));
  const bodies: { planet: Planet; body: Astronomy.Body }[] = [
    { planet: "太陽", body: Astronomy.Body.Sun }, { planet: "月亮", body: Astronomy.Body.Moon },
    { planet: "水星", body: Astronomy.Body.Mercury }, { planet: "金星", body: Astronomy.Body.Venus },
    { planet: "火星", body: Astronomy.Body.Mars }, { planet: "木星", body: Astronomy.Body.Jupiter },
    { planet: "土星", body: Astronomy.Body.Saturn }, { planet: "天王星", body: Astronomy.Body.Uranus },
    { planet: "海王星", body: Astronomy.Body.Neptune }, { planet: "冥王星", body: Astronomy.Body.Pluto },
  ];
  const planets = bodies.map(({ planet, body }) => {
    const lon = getPlanetLongitude(body, localDate);
    return { planet, longitude: lon, sign: longitudeToSign(lon), degree: longitudeToDegree(lon) };
  });
  const ascLon = calculateAscendant(localDate, latitude, longitude);
  const houses: House[] = [];
  for (let i = 0; i < 12; i++) {
    const startLon = (ascLon + i * 30) % 360;
    houses.push({ number: i + 1, startLongitude: startLon, sign: longitudeToSign(startLon) });
  }
  return { planets, ascendant: longitudeToSign(ascLon), ascendantLongitude: ascLon, houses, sunSign: planets.find((p) => p.planet === "太陽")!.sign, moonSign: planets.find((p) => p.planet === "月亮")!.sign };
}
export const SIGN_LUCKY_NUMBERS: Record<ZodiacSign, number[]> = {
  白羊: [1, 9, 10, 19, 28, 37, 46], 金牛: [2, 6, 11, 20, 29, 38, 47], 雙子: [3, 5, 12, 21, 30, 39, 48],
  巨蟹: [4, 7, 13, 22, 31, 40, 49], 獅子: [1, 4, 10, 13, 19, 22, 28, 31, 37, 40, 46, 49], 處女: [5, 8, 14, 23, 32, 41],
  天秤: [6, 9, 15, 24, 33, 42], 天蠍: [7, 10, 16, 25, 34, 43], 射手: [8, 11, 17, 26, 35, 44],
  摩羯: [9, 12, 18, 27, 36, 45], 水瓶: [1, 2, 11, 20, 29, 38, 47], 雙魚: [3, 7, 12, 16, 21, 25, 30, 34, 39, 43, 48],
};
export const SIGN_RULER: Record<ZodiacSign, string> = {
  白羊: "火星", 金牛: "金星", 雙子: "水星", 巨蟹: "月亮", 獅子: "太陽", 處女: "水星",
  天秤: "金星", 天蠍: "冥王星", 射手: "木星", 摩羯: "土星", 水瓶: "天王星", 雙魚: "海王星",
};
