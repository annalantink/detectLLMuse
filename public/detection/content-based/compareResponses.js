import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUserEmbedding } from "./userEmbedding.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EMBEDDINGS_PATH = path.join(__dirname, "llm_embeddings.json");

let PRECOMPUTED_DATA = [];
try {
  const rawData = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
  PRECOMPUTED_DATA = JSON.parse(rawData);
  console.log(`Successfully loaded ${PRECOMPUTED_DATA.length} precomputed embeddings.`);
} catch (err) {
  console.error("Could not load llm_embeddings.json", err);
}

// Function to compute similarity between two vectors (vectors are text embeddings of the summaries in this case)
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Compute the maximum similarity between a users summary and all of the pre-generated AI summaries
export async function compareUserResponse(userText, task = "summary1") {
  console.log("Received detection request for:", task, "| Input length:", userText.length);
  const userEmbedding = await getUserEmbedding(userText);

  let maxSimilarity = 0;

  const taskEmbeddings = PRECOMPUTED_DATA.filter(item => item.category === task);

  if (taskEmbeddings.length === 0) {
    console.warn(`No precomputed embeddings found for category: ${task}`);
  }

  for (const item of taskEmbeddings) {
    const similarity = cosineSimilarity(userEmbedding, item.embedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }

  // console.log("Max similarity computed:", maxSimilarity);

  return {
    similarity: maxSimilarity
  };
}