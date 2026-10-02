import * as tf from "@tensorflow/tfjs";
import { DrawResult } from "./marksix-data";
interface TrainingSample { features: number[]; label: number; }
export function buildTrainingData(data: DrawResult[], windowSize: number = 10): TrainingSample[] {
  const samples: TrainingSample[] = [];
  if (data.length < windowSize + 1) return samples;
  const sorted = [...data].reverse();
  for (let i = windowSize; i < sorted.length; i++) {
    const history = sorted.slice(i - windowSize, i);
    const actualNumbers = [...sorted[i].numbers, sorted[i].special];
    for (let n = 1; n <= 49; n++) {
      samples.push({ features: extractFeatures(n, history, windowSize), label: actualNumbers.includes(n) ? 1 : 0 });
    }
  }
  return samples;
}
function extractFeatures(num: number, history: DrawResult[], windowSize: number): number[] {
  const freq = history.filter((d) => d.numbers.includes(num) || d.special === num).length / windowSize;
  let gap = windowSize;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].numbers.includes(num) || history[i].special === num) { gap = history.length - 1 - i; break; }
  }
  const gapNorm = gap / windowSize;
  const tail = (num % 10) / 9;
  const recent = history.slice(-10);
  const recentFreq = recent.filter((d) => d.numbers.includes(num) || d.special === num).length / 10;
  const half = Math.floor(history.length / 2);
  const firstHalf = history.slice(0, half).filter((d) => d.numbers.includes(num) || d.special === num).length;
  const secondHalf = history.slice(half).filter((d) => d.numbers.includes(num) || d.special === num).length;
  const trend = (secondHalf - firstHalf) / windowSize;
  return [freq, gapNorm, tail, recentFreq, trend];
}
export function createModel(): tf.Sequential {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [5], units: 16, activation: "relu", kernelInitializer: "heNormal" }));
  model.add(tf.layers.dense({ units: 8, activation: "relu", kernelInitializer: "heNormal" }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: tf.train.adam(0.001), loss: "binaryCrossentropy", metrics: ["accuracy"] });
  return model;
}
export async function trainModel(samples: TrainingSample[], onEpoch?: (epoch: number, logs: tf.Logs) => void): Promise<tf.Sequential> {
  const model = createModel();
  const features = samples.map((s) => s.features);
  const labels = samples.map((s) => s.label);
  const xs = tf.tensor2d(features);
  const ys = tf.tensor2d(labels, [labels.length, 1]);
  await model.fit(xs, ys, { epochs: 30, batchSize: 64, validationSplit: 0.2, shuffle: true, callbacks: { onEpochEnd: (epoch, logs) => { if (onEpoch && logs) onEpoch(epoch, logs); } } });
  xs.dispose(); ys.dispose();
  return model;
}
export async function predictNumbers(model: tf.Sequential, recentData: DrawResult[], windowSize: number = 10): Promise<{ number: number; probability: number }[]> {
  const history = recentData.slice(0, windowSize);
  const features: number[][] = [];
  for (let n = 1; n <= 49; n++) features.push(extractFeatures(n, history, windowSize));
  const xs = tf.tensor2d(features);
  const predictions = model.predict(xs) as tf.Tensor;
  const probs = await predictions.data();
  xs.dispose(); predictions.dispose();
  const results = [];
  for (let n = 1; n <= 49; n++) results.push({ number: n, probability: probs[n - 1] });
  return results.sort((a, b) => b.probability - a.probability);
}
export async function runAIPrediction(data: DrawResult[], onProgress?: (msg: string, epoch?: number, logs?: tf.Logs) => void): Promise<{ model: tf.Sequential; predictions: { number: number; probability: number }[]; trainingSamples: number; finalAccuracy: number; }> {
  onProgress?.("建立訓練數據...");
  const samples = buildTrainingData(data, 10);
  if (samples.length === 0) throw new Error("數據不足，無法訓練模型");
  onProgress?.("訓練樣本數：" + samples.length);
  let finalAccuracy = 0;
  const model = await trainModel(samples, (epoch, logs) => { finalAccuracy = logs.acc || 0; onProgress?.("訓練中... Epoch " + (epoch + 1) + "/30", epoch, logs); });
  onProgress?.("預測中...");
  const predictions = await predictNumbers(model, data, 10);
  return { model, predictions, trainingSamples: samples.length, finalAccuracy };
}
