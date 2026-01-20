import { pipeline } from "@xenova/transformers";

let extractor = null;

// Load model to use for creating text embeddings
async function loadModel() {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return extractor;
}

export async function getEmbedding(text) {
  const model = await loadModel();

  const output = await model(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
}