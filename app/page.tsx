"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getUserProfile, saveUserProfile } from "@/lib/user-profile";
import { calculateBaZi } from "@/lib/bazi";
import { countWuXing, analyzeYongShen } from "@/lib/wuxing";
import { calculateAstrologyChart } from "@/lib/astrology";
import { calculateNumerology } from "@/lib/numerology";
import { getTarotByLifePath, getTarotByBirthday } from "@/lib/tarot";
import { getSunSignData } from "@/lib/constellation";
import { fetchMarkSixData, filterRecentMonths } from "@/lib/marksix-data";
import { analyzeAll } from "@/lib/data-analysis";
import { runAIPrediction } from "@/lib/ai-model";
import { scoreAllNumbers, getTopNumbers } from "@/lib/scoring";
import { DEFAULT_WEIGHTS, WeightConfig, PRESETS } from "@/lib/weights";
import { recommendPlan } from "@/lib/wheeling";
import { calculateDateScores, getBestDate } from "@/lib/date-selection";
import { STRATEGIES, StrategyOutput } from "@/lib/strategies";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(30);
  const [latitude, setLatitude] = useState(22.3193);
  const [longitude, setLongitude] = useState(114.1694);
  const [budget, setBudget] = useState(500);
  const [weights, setWeights] = useState<WeightConfig>(DEFAULT_WEIGHTS);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showChong, setShowChong] = useState(false);
  const [daysAhead, setDaysAhead] = useState(30);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiProgress, setAiProgress] = useState("");
  const [aiPredictions, setAiPredictions] = useState<any[] | undefined>();
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [strategyResults, setStrategyResults] = useState<Record<string, StrategyOutput>>({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.uid);
        if (p) {
          setYear(p.birthYear); setMonth(p.birthMonth); setDay(p.birthDay);
          setHour(p.birthHour); setMinute(p.birthMinute || 0);
          setLatitude(p.birthLatitude); setLongitude(p.birthLongitude);
        }
      }
    });
    return () => unsub();
  }, []);

  async function handleSave() {
    if (!user) return;
    await saveUserProfile({ uid: user.uid, email: user.email || "", fullName: user.displayName || "", birthYear: year, birthMonth: month, birthDay: day, birthHour: hour, birthMinute: minute, birthLatitude: latitude, birthLongitude: longitude, isAdmin: false, updatedAt: Date.now() });
    alert("已儲存出生資料");
  }

  async function handleCalculate() {
    setLoading(true); setError("");
    try {
      const bazi = calculateBaZi(year, month, day, hour, minute);
      const ganList = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];
      const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];
      const count = countWuXing(ganList, zhiList);
      const yongShen = analyzeYongShen(bazi.dayMasterWuXing, count);
      const chart = calculateAstrologyChart(year, month, day, hour, minute, latitude, longitude);
      const numerology = calculateNumerology(year, month, day);
      const tarotLife = getTarotByLifePath(numerology.lifePath);
      const tarotBirthday = getTarotByBirthday(day);
      const sunSignData = getSunSignData(month, day);
      const rawData = await fetchMarkSixData();
      const recentData = filterRecentMonths(rawData, 24);
      const dataAnalysis = analyzeAll(recentData);
      const scores = scoreAllNumbers({ yongShen, chart, numerology, tarotLife, tarotBirthday, sunSign: sunSignData.sign, sunSignData, dataAnalysis, aiPredictions }, weights);
      const top18 = getTopNumbers(scores, 18);
      const dateScores = calculateDateScores(bazi.shengXiao, daysAhead, weights, showChong);
      const bestDate = getBestDate(dateScores);
      const plans = recommendPlan(budget, top18.length);
      setResult({ bazi, count, yongShen, scores, top18, dateScores, bestDate, plans, dataAnalysis, numerology, tarotLife, sunSignData });
    } catch (err: any) { setError(err.message || "計算失敗"); }
    finally { setLoading(false); }
  }

  async function handleAIPredict() {
    setAiLoading(true); setAiProgress("");
    try {
      const rawData = await fetchMarkSixData();
      const recentData = filterRecentMonths(rawData, 24);
      const out = await runAIPrediction(recentData, (msg, epoch, logs) => { setAiProgress(msg + (logs ? " | Loss: " + logs.loss?.toFixed(4) + " | Acc: " + logs.acc?.toFixed(4) : "")); });
      setAiResult(out); setAiPredictions(out.predictions);
    } catch (err: any) { setError("AI 訓練失敗：" + (err.message || "未知錯誤")); }
    finally { setAiLoading(false); }
  }

  function updateWeight(key: keyof WeightConfig, value: number) { setWeights((w) => ({ ...w, [key]: value })); }
  function runStrategies() {
    if (!result?.top18) return;
    const out: Record<string, StrategyOutput> = {};
    selectedStrategies.forEach((id) => { const s = STRATEGIES.find((x) => x.id === id); if (s) out[id] = s.apply({ topNumbers: result.top18 }); });
    setStrategyResults(out);
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gold">Lucky Six 選號系統</h1>
        {user ? (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-400 hidden md:inline">{user.email}</span>
            <button onClick={handleSave} className="bg-gold text-dark font-bold px-3 py-1 rounded text-sm">儲存出生資料</button>
            <button onClick={() => signOut(auth)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">登出</button>
          </div>
        ) : (
          <button onClick={() => signInWithPopup(auth, googleProvider)} className="bg-white text-black font-bold px-4 py-2 rounded text-sm">用 Google 登入</button>
        )}
      </div>

      <section className="bg-purple/10 border border-gold/30 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold text-gold mb-3">出生資料</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ label: "年", value: year, set: setYear }, { label: "月", value: month, set: setMonth }, { label: "日", value: day, set: setDay }, { label: "時", value: hour, set: setHour }, { label: "分", value: minute, set: setMinute }, { label: "緯度", value: latitude, set: setLatitude, step: 0.0001 }, { label: "經度", value: longitude, set: setLongitude, step: 0.0001 }, { label: "預算 ($)", value: budget, set: setBudget }].map((f) => (
            <div key={f.label}>
              <label className="block text-sm mb-1 text-gray-400">{f.label}</label>
              <input type="number" step={f.step} value={f.value} onChange={(e) => f.set(+e.target.value)} className="w-full bg-dark border border-gold/30 rounded px-3 py-2" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <span className="text-sm text-gray-400">查看未來</span>
          <input type="number" value={daysAhead} onChange={(e) => setDaysAhead(+e.target.value)} className="w-20 bg-dark border border-gold/30 rounded px-2 py-1" />
          <span className="text-sm text-gray-400">日</span>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showChong} onChange={(e) => setShowChong(e.target.checked)} />顯示相沖日</label>
        </div>
      </section>

      <section className="bg-purple/10 border border-gold/30 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold text-gold mb-3">權重設定</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.keys(PRESETS).map((name) => (<button key={name} onClick={() => setWeights({ ...DEFAULT_WEIGHTS, ...PRESETS[name] })} className="bg-gold/20 border border-gold/40 rounded px-3 py-1 text-sm hover:bg-gold/30">{name}</button>))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-bold text-sm mb-2">三大類別</h3>
            {[{ key: "chinese" as const, label: "中國命理" }, { key: "western" as const, label: "西方占卜" }, { key: "data" as const, label: "數據分析" }].map((w) => (
              <div key={w.key} className="mb-2"><div className="flex justify-between text-sm"><span>{w.label}</span><span>{weights[w.key]}%</span></div><input type="range" min="0" max="100" value={weights[w.key]} onChange={(e) => updateWeight(w.key, +e.target.value)} className="w-full" /></div>
            ))}
            <div className="mb-2"><div className="flex justify-between text-sm"><span>AI 權重</span><span>{weights.aiWeight}%</span></div><input type="range" min="0" max="50" value={weights.aiWeight} onChange={(e) => updateWeight("aiWeight", +e.target.value)} className="w-full" /></div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">生肖 vs 尾數五行</h3>
            <div className="mb-2"><div className="flex justify-between text-sm"><span>生肖五行</span><span>{weights.shengXiaoRatio}%</span></div><input type="range" min="0" max="100" value={weights.shengXiaoRatio} onChange={(e) => { const v = +e.target.value; setWeights((w) => ({ ...w, shengXiaoRatio: v, tailRatio: 100 - v })); }} className="w-full" /></div>
            <div><div className="flex justify-between text-sm"><span>尾數五行</span><span>{weights.tailRatio}%</span></div><input type="range" min="0" max="100" value={weights.tailRatio} onChange={(e) => { const v = +e.target.value; setWeights((w) => ({ ...w, tailRatio: v, shengXiaoRatio: 100 - v })); }} className="w-full" /></div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">生肖擇日</h3>
            {[{ key: "liuNianWeight" as const, label: "流年" }, { key: "liuYueWeight" as const, label: "流月" }, { key: "liuRiWeight" as const, label: "流日" }].map((w) => (
              <div key={w.key} className="mb-2"><div className="flex justify-between text-sm"><span>{w.label}</span><span>{(weights[w.key] * 100).toFixed(0)}%</span></div><input type="range" min="0" max="1" step="0.1" value={weights[w.key]} onChange={(e) => updateWeight(w.key, +e.target.value)} className="w-full" /></div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex gap-3 mb-6">
        <button onClick={handleCalculate} disabled={loading} className="bg-gold text-dark font-bold px-8 py-3 rounded hover:opacity-80 disabled:opacity-50">{loading ? "計算中..." : "開始計算"}</button>
        <button onClick={handleAIPredict} disabled={aiLoading} className="bg-purple text-white font-bold px-8 py-3 rounded hover:opacity-80 disabled:opacity-50">{aiLoading ? "AI 訓練中..." : "🧠 訓練 AI 模型"}</button>
      </div>

      {error && <div className="mb-4 bg-red-900/30 border border-red-500 rounded p-3 text-red-300">{error}</div>}
      {aiProgress && <div className="mb-4 bg-dark/50 rounded p-2 text-xs font-mono text-gray-300">{aiProgress}</div>}

      {result && (
        <div className="mt-8 space-y-6">
          {result.bestDate && (
            <section className="bg-gold/10 border-2 border-gold rounded-lg p-4">
              <h2 className="text-2xl font-bold text-gold mb-2">🎯 最佳購買日期</h2>
              <div className="text-3xl font-bold mb-2">{result.bestDate.date}（{result.bestDate.dayOfWeek}）</div>
              <div className="text-sm text-gray-300">{result.bestDate.reason}</div>
            </section>
          )}

          <section className="bg-purple/20 border border-gold/30 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gold mb-3">推薦號碼（前 18 個）</h2>
            <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
              {result.top18.map((n: number, i: number) => (
                <div key={n} className={"text-center rounded p-2 " + (i < 6 ? "bg-gold text-dark font-bold" : "bg-gold/20")}>
                  <div className="text-2xl">{String(n).padStart(2, "0")}</div>
                  <div className="text-xs">{result.scores.find((s: any) => s.number === n)?.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>

          {aiResult && (
            <section className="bg-purple/20 border border-gold/30 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-gold mb-3">🧠 AI 神經網絡預測</h2>
              <div className="bg-dark/50 rounded p-3 text-sm mb-3"><div>訓練樣本數：{aiResult.trainingSamples}</div><div>最終準確率：{(aiResult.finalAccuracy * 100).toFixed(2)}%</div></div>
              <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
                {aiResult.predictions.slice(0, 18).map((p: any, i: number) => (
                  <div key={p.number} className={"text-center rounded p-2 " + (i < 6 ? "bg-purple text-white font-bold" : "bg-purple/30")}>
                    <div className="text-xl">{String(p.number).padStart(2, "0")}</div>
                    <div className="text-xs">{(p.probability * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-red-900/20 border border-red-500/30 rounded p-3 text-xs text-gray-300">⚠️ 學術界明確指出 AI 無法預測彩票。呢個模組只供參考同實驗用途。</div>
            </section>
          )}

          <section className="bg-purple/20 border border-gold/30 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gold mb-3">聰明組合推薦（預算 ${budget}）</h2>
            {result.plans.length === 0 ? (<div className="text-gray-400">預算不足。</div>) : (
              <div className="space-y-3">
                {result.plans.map((plan: any) => {
                  const bets = plan.generate(result.top18); const cost = bets.length * plan.costPerBet;
                  return (
                    <div key={plan.name} className="bg-dark/50 rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div><div className="font-bold text-gold">{plan.name}</div><div className="text-sm text-gray-400">{plan.description}</div></div>
                        <div className="text-right"><div className="text-xl font-bold">${cost}</div><div className="text-xs text-gray-400">{bets.length} 注</div></div>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">保證：{plan.guarantee}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-purple/20 border border-gold/30 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gold mb-3">真實案例策略</h2>
            <div className="space-y-2 mb-4">
              {STRATEGIES.map((s) => (
                <label key={s.id} className="flex items-start gap-3 bg-dark/50 rounded p-3 cursor-pointer">
                  <input type="checkbox" checked={selectedStrategies.includes(s.id)} onChange={(e) => { if (e.target.checked) setSelectedStrategies([...selectedStrategies, s.id]); else setSelectedStrategies(selectedStrategies.filter((id) => id !== s.id)); }} className="mt-1" />
                  <div className="flex-1">
                    <div className="font-bold text-gold">{s.name}</div>
                    <div className="text-xs text-gray-500">來源：{s.origin}</div>
                    <div className="text-sm text-gray-300 mt-1">{s.description}</div>
                    <div className="text-xs mt-1">{s.realEffect}</div>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={runStrategies} className="bg-gold text-dark font-bold px-6 py-2 rounded">生成策略注項</button>
            {Object.entries(strategyResults).map(([id, out]) => {
              const s = STRATEGIES.find((x) => x.id === id);
              if (!s || out.bets.length === 0) return null;
              return (
                <div key={id} className="bg-dark/50 rounded p-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-gold">{s.name}</div>
                    <div className="text-right"><div className="text-xl font-bold">${out.cost}</div><div className="text-xs text-gray-400">{out.bets.length} 注</div></div>
                  </div>
                  <details>
                    <summary className="cursor-pointer text-sm text-gold">查看注項</summary>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-1 text-xs">
                      {out.bets.map((bet, i) => (<div key={i} className="font-mono">{i + 1}. {bet.map((n) => String(n).padStart(2, "0")).join(" ")}</div>))}
                    </div>
                  </details>
                </div>
              );
            })}
          </section>

          <section className="bg-purple/20 border border-gold/30 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-gold mb-3">未來 {daysAhead} 日運勢排名</h2>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {result.dateScores.slice(0, 30).map((d: any, i: number) => (
                <div key={d.date} className={"flex justify-between items-center text-sm p-2 rounded " + (d.isChong ? "bg-red-900/20" : i < 3 ? "bg-gold/20" : "")}>
                  <div className="flex gap-3"><span className="font-mono">{d.date}</span><span className="text-gray-400">{d.dayOfWeek}</span><span>{d.reason}</span></div>
                  <div className="font-bold">{d.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-sm text-gray-300">
            ⚠️ 免責聲明：本工具只供娛樂參考。六合彩本質為隨機事件，任何方法都無法保證中獎。中頭獎機率恆定為 1/13,983,816。請量力而為，切勿過度投注。
          </section>
        </div>
      )}
    </main>
  );
}
