import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { compareUserResponse } from "./public/detection/content-based/compareResponses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

app.get("/example_summary", (req, res) => {
  res.sendFile("example_summary.html", { root: path.join(__dirname, "public") });
});

app.get("/summarize_one", (req, res) => {
  res.sendFile("summarize_one.html", { root: path.join(__dirname, "public") });
});

app.get("/summarize_two", (req, res) => {
  res.sendFile("summarize_two.html", { root: path.join(__dirname, "public") });
});

app.get("/survey", (req, res) => {
  res.sendFile("survey.html", { root: path.join(__dirname, "public") });
});


app.post("/detect_content", async (req, res) => {
  const { text, task } = req.body;

  if (!text || text.length < 100) {
    return res.status(400).json({ error: "Text too short" });
  }

  try {
    const result = await compareUserResponse(text, task);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Detection failed" });
  }
});
