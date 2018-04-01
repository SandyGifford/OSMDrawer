// server only exists to circumvent CORS restriction

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");
const app = express();

const useMockData = true;

app.use(bodyParser.text());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/*", (req, res) => {
	const filePath = path.join(__dirname, "public", req.url);
	res.sendFile(filePath);
});

app.post("/data", (req, res) => {
	console.log(`processing query\n${req.body}`);

	if (useMockData) {
		const filePath = path.join(__dirname, "mockData/basicQuery.xml");
		res.sendFile(filePath);
	}else {
		fetch("https://lz4.overpass-api.de/api/interpreter", {
			body: req.body,
			method: "post",
		})
			.then(OSMResp => OSMResp.text())
			.then(text => res.send(text));
	}
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));