import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.backends.onnx.setup = false;
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';

let extractor = null;

async function loadModel() {
  if (!extractor) {
    try {
      extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        {
          quantized: true,
          device: 'wasm',
        }
      );
    } catch (error) {
      console.error("Model failed to load, retrying with WASM fallback...");
      throw error;
    }
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
