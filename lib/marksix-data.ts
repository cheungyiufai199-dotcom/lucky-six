export interface DrawResult { drawNumber: string; date: string; numbers: number[]; special: number; }
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/icelam/mark-six-data-visualization/master";
const CACHE_KEY = "marksix_data_cache", CACHE_TIME_KEY = "marksix_data_cache_time", CACHE_DURATION_MS = 15 * 60 * 1000;
export async function fetchMarkSixData(): Promise<DrawResult[]> {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(CACHE_KEY), cacheTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < CACHE_DURATION_MS) return JSON.parse(cached);
  }
  try {
    const res = await fetch(GITHUB_RAW_BASE + "/data/results.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const raw = await res.json();
    const data = normalizeData(raw);
    if (typeof window !== "undefined") {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    }
    return data;
  } catch (err) {
    if (typeof window !== "undefined") { const c = localStorage.getItem(CACHE_KEY); if (c) return JSON.parse(c); }
    throw err;
  }
}
function normalizeData(raw: any): DrawResult[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any) => ({
    drawNumber: String(item.drawNumber || item.no || ""),
    date: item.date || item.drawDate || "",
    numbers: (item.numbers || item.results || []).slice(0, 6).map(Number),
    special: Number(item.special || item.specialNumber || 0),
  })).filter((d: any) => d.numbers.length === 6);
}
export function filterRecentMonths(data: DrawResult[], months: number): DrawResult[] {
  const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - months);
  return data.filter((d) => new Date(d.date) >= cutoff);
}
