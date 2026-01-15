# Web Application for Detecting LLM Usage in Crowd Work

This repository contains an application that is part of Group 6's submission for the 2025/2026 Crowd Computing course at the Delft University of Technology.

The web application contained in this repository is created to test out an LLM detection and prevention method. Users are presented with a couple of abstracts, which they are asked to summarize. For the second abstract, if users are flagged as potentially using LLMs, they will be presented with a pop-up asking them to refrain from using LLMs. Several detection strategies are use, including behavioral methods (pause detection, backspace tracking, and word-rate calculations) and a content-based method (similarity to known LLM responses).

Before running the application, ensure that all necessary packages are installed:
```
npm install
```

The application can be run locally using the command:

```
node app.js
```

When run, the application will open in `http://localhost:3000/`.