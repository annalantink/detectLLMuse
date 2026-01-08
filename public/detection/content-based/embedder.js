import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

let extractor = null;
let initializationPromise = null;

async function loadModel() {
  if (extractor) return extractor;
  if (initializationPromise) {
    return initializationPromise;
  }
  initializationPromise = (async () => {
    try {
      console.log("Loading model for the first time...");
      const model = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        { quantized: true }
      );
      extractor = model;
      return extractor;
    } catch (error) {
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

function logMemory(label) {
  const used = process.memoryUsage();
  console.log(`--- Memory Usage: ${label} ---`);
  for (let key in used) {

    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
  console.log('----------------------------');
}
export async function getEmbedding(text) {
  try {
    logMemory("Before Model Load");
    const model = await loadModel();
    const output = await model(text, {
      pooling: "mean",
      normalize: true
    });
    const result = Array.from(output.data);
    logMemory("After Inference");
    return result;

  } catch (error) {
    console.error("Embedding error:", error);
    throw error;
  }
}