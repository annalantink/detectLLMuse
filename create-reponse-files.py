# Run once to create embeddings from LLM response text files

import os
import json
from sentence_transformers import SentenceTransformer

INPUT_DIR = "./llm-responses"
OUTPUT_FILE = "./llm_embeddings.json"
MODEL_NAME = "all-MiniLM-L6-v2"

def generate_embeddings():
    print(f"Loading model: {MODEL_NAME}...")
    model = SentenceTransformer(MODEL_NAME)
    
    all_data = []

    print(f"Scanning directory: {INPUT_DIR}")
    
    for root, dirs, files in os.walk(INPUT_DIR):
        for file in files:
            if file.endswith(".txt"):
                file_path = os.path.join(root, file)
                
                category = os.path.basename(root)
                
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                
                if not content:
                    continue

                print(f"Processing: {category}/{file}")
                
                embedding = model.encode(content)
                
                embedding_list = embedding.tolist()
                
                all_data.append({
                    "category": category,
                    "filename": file,
                    "embedding": embedding_list
                })

    with open(OUTPUT_FILE, "w") as f:
        json.dump(all_data, f)
    
    print(f"Saved {len(all_data)} embeddings to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_embeddings()