// server only exists to circumvent CORS restriction

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");
const app = express();

app.use(bodyParser.text());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "public", req.url)));

app.post("/data", (req, res) => {
	fetch("https://lz4.overpass-api.de/api/interpreter", {
		body: req.body,
		method: "post",
	})
		.then(OSMResp => OSMResp.text())
		.then(text => res.send(text));
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));