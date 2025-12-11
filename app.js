const express = require('express')
const path = require('path')

const app = express()
const port = 3000

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: "/public" });
})

app.listen(port, () => {
  console.log(`Crowd computing application running on port ${port}`)
})
