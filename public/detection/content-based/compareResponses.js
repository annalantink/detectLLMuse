import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { getEmbedding } from "./embedder.js";
import { getUserEmbedding } from "./userEmbedding.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export async function compareUserResponse(userText, task = "summary1") {
  // console.log("Received detection request:", task, userText.length);

  const responses_dir = path.join(__dirname, "../../../llm-responses"); 

  const referenceFolder =
    task === "summary1"
      ? path.join(responses_dir, "summary1")
      : path.join(responses_dir, "summary2");

  let files = fs.readdirSync(referenceFolder);

  const userEmbedding = await getUserEmbedding(userText);

  let maxSimilarity = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(referenceFolder, file), "utf-8");
    const embedding = await getEmbedding(content);
    const similarity = cosineSimilarity(userEmbedding, embedding);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }

  // console.log("Max similarity computed:", maxSimilarity);

  return {
    similarity: maxSimilarity
  };
  
}
