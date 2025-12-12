const express = require('express')
const path = require('path')

const app = express()
const port = 3000

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/public" });
})

app.get('/example_summary', (req, res) => {
  res.sendFile("example_summary.html", { root: __dirname + "/public" });
})

app.get('/summarize_one', (req, res) => {
  res.sendFile("summarize_one.html", { root: __dirname + "/public" });
})

app.get('/summarize_two', (req, res) => {
  res.sendFile("summarize_two.html", { root: __dirname + "/public" });
})

app.listen(port, () => {
  console.log("Crowd computing application running on port ${port}")
})
