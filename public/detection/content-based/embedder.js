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

export async function getEmbedding(text) {
  try {
    const model = await loadModel();
    const output = await model(text, {
      pooling: "mean",
      normalize: true
    });

    return Array.from(output.data);
  } catch (error) {
    console.error("Embedding error:", error);
    throw error;
  }
}