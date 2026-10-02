"use client";
import { useState } from "react";
import { calculateBaZi } from "@/lib/bazi";
import { countWuXing, analyzeYongShen } from "@/lib/wuxing";
import { calculateAstrologyChart } from "@/lib/astrology";
import { calculateNumerology } from "@/lib/numerology";
import { getTarotByLifePath, getTarotByBirthday } from "@/lib/tarot";
import { getSunSignData } from "@/lib/constellation";
export default function TestPage() {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [hour, setHour] = useState(10);
  const [result, setResult] = useState<any>(null);
  function handleCalculate() {
    const bazi = calculateBaZi(year, month, day, hour);
    const ganList = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];
    const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
    const count = countWuXing(ganList, zhiList);
    const yongShen = analyzeYongShen(bazi.dayMasterWuXing, count);
    const chart = calculateAstrologyChart(year, month, day, hour, 0);
    const numerology = calculateNumerology(year, month, day);
    const tarotLife = getTarotByLifePath(numerology.lifePath);
    const tarotBirthday = getTarotByBirthday(day);
    const sunSignData = getSunSignData(month, day);
    setResult({ bazi, count, yongShen, chart, numerology, tarotLife, tarotBirthday, sunSignData });
  }
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gold mb-6">測試頁面</h1>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[{ label: "年", value: year, set: setYear }, { label: "月", value: month, set: setMonth }, { label: "日", value: day, set: setDay }, { label: "時", value: hour, set: setHour }].map((f) => (
          <div key={f.label}><label className="block text-sm mb-1">{f.label}</label><input type="number" value={f.value} onChange={(e) => f.set(+e.target.value)} className="w-full bg-dark border border-gold/30 rounded px-3 py-2" /></div>
        ))}
      </div>
      <button onClick={handleCalculate} className="bg-gold text-dark font-bold px-6 py-2 rounded">計算</button>
      {result && (<div className="mt-8 space-y-4"><section className="bg-purple/20 border border-gold/30 rounded p-4"><h2 className="text-xl font-bold text-gold mb-3">八字</h2><div className="grid grid-cols-4 gap-4 text-center"><div><div className="text-xs text-gray-400">年</div><div className="text-2xl">{result.bazi.year.gan}{result.bazi.year.zhi}</div></div><div><div className="text-xs text-gray-400">月</div><div className="text-2xl">{result.bazi.month.gan}{result.bazi.month.zhi}</div></div><div><div className="text-xs text-gray-400">日</div><div className="text-2xl">{result.bazi.day.gan}{result.bazi.day.zhi}</div></div><div><div className="text-xs text-gray-400">時</div><div className="text-2xl">{result.bazi.hour.gan}{result.bazi.hour.zhi}</div></div></div><div className="mt-3 text-sm">日主：{result.bazi.dayMaster}（{result.bazi.dayMasterWuXing}）｜生肖：{result.bazi.shengXiao}</div></section></div>)}
    </main>
  );
}
