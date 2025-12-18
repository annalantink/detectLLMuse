import { getEmbedding } from "./embedder.js";

export async function getUserEmbedding(userText) {
  return await getEmbedding(userText);
}
