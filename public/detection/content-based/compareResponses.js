import fs from "fs";
import path from "path";
import { getEmbedding } from "./embedder.js";
import { getUserEmbedding } from "./userEmbedding.js";

const RESPONSES_DIR = "./llm-responses";

// ---------- Cosine similarity ---------- 

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

// ---------- Call logic ---------- 

async function compareUserResponse(userText) {
  const files = fs.readdirSync(RESPONSES_DIR)

  const userEmbedding = await getUserEmbedding(userText);
  const results = [];

  for (const file of files) {
    const content = fs.readFileSync(
      path.join(RESPONSES_DIR, file),
      "utf-8"
    );

    const embedding = await getEmbedding(content);
    const similarity = cosineSimilarity(userEmbedding, embedding);

    results.push({
      file,
      similarity
    });
  }

  results.sort((a, b) => b.similarity - a.similarity);
  return results;
}

// ---------- Example usage ---------- 

const userText = `
This abstract is about the prevention of using LLM to generate responses in crowd working settings. 
`;

const results = await compareUserResponse(userText);

console.log("Similarity ranking:");
for (const r of results) {
  console.log(`${r.file}: ${r.similarity.toFixed(4)}`);
}
