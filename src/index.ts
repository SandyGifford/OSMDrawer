interface OsmQueryResponseJson {
	version: string;
	generator: string;
	nodes: OsmNode[];
	ways: OsmWay[];
}

interface OsmNode {
	id: string;
	lat: number;
	lon: number;
	version: string;
	timestamp: string;
	changeset: string;
	uid: string;
	user: string;
	tags: OsmTag[];
}

interface OsmTag {
	k: string;
	v: string;
}

interface OsmWay {
	id: string;
	version: string;
	timestamp: string;
	changeset: string;
	uid: string;
	user: string;
	tags: OsmTag[];
	nds: OsmNd[];
}

interface OsmNd {
	ref: string;
}

interface LatLonRange {
	min: number;
	max: number;
	range: number;
}

interface LatLonRect {
	lat: LatLonRange;
	lon: LatLonRange;
}

function intHash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++)
		hash = str.charCodeAt(i) + ((hash << 5) - hash);

	return hash;
}

function intToRgb(int: number) {
	const color = (int & 0x00FFFFFF)
		.toString(16)
		.toUpperCase();

	return `#${"00000".substring(0, 6 - color.length) + color}`;
}

function colorHash(str: string): string {
	return intToRgb(intHash(str));
}

function parseOsmNode(node: Element): OsmNode {
	return {
		id: node.getAttribute("id"),
		lat: parseFloat(node.getAttribute("lat")),
		lon: parseFloat(node.getAttribute("lon")),
		version: node.getAttribute("version"),
		timestamp: node.getAttribute("timestamp"),
		changeset: node.getAttribute("changeset"),
		uid: node.getAttribute("uid"),
		user: node.getAttribute("user"),
		tags: Array.from(node.querySelectorAll("tag")).map(parseOsmTag),
	};
}

function parseOsmTag(tag: Element): OsmTag {
	return {
		k: tag.getAttribute("k"),
		v: tag.getAttribute("v"),
	}
}

function parseOsmNd(nd: Element): OsmNd {
	return {
		ref: nd.getAttribute("ref"),
	}
}

function parseOsmWay(way: Element): OsmWay {
	return {
		id: way.getAttribute("id"),
		version: way.getAttribute("version"),
		timestamp: way.getAttribute("timestamp"),
		changeset: way.getAttribute("changeset"),
		uid: way.getAttribute("uid"),
		user: way.getAttribute("user"),
		tags: Array.from(way.querySelectorAll("tag")).map(parseOsmTag),
		nds: Array.from(way.querySelectorAll("nd")).map(parseOsmNd),
	}
}

function parseOsmQueryResponse(response: XMLDocument): OsmQueryResponseJson {
	const root = response.querySelector("osm");

	return {
		version: root.getAttribute("version"),
		generator: root.getAttribute("generator"),
		nodes: Array.from(root.querySelectorAll("node")).map(parseOsmNode),
		ways: Array.from(root.querySelectorAll("way")).map(parseOsmWay),
	};
}

function fetchXML(input: RequestInfo, init?: RequestInit): Promise<XMLDocument> {
	return fetch(input, init)
		.then(response => response.text())
		.then(text => new DOMParser().parseFromString(text, "text/xml"));
}

function osmQuery(query: string): Promise<XMLDocument> {
	return fetchXML("/data", {
		method: "post",
		body: query
	});
}

function jsonOsmQuery(query: string): Promise<OsmQueryResponseJson> {
	return osmQuery(query)
		.then(response => parseOsmQueryResponse(response));
}


const cvs: HTMLCanvasElement = document.querySelector("#mapCanvas");
const ctx = cvs.getContext("2d");

function drawOsm(osmJson: OsmQueryResponseJson): void {

	const rect: LatLonRect = {
		lat: {
			min: Infinity,
			max: -Infinity,
			range: 0,
		},
		lon: {
			min: Infinity,
			max: -Infinity,
			range: 0,
		}
	};

	osmJson.nodes.forEach(node => {
		if (node.lat > rect.lat.max) rect.lat.max = node.lat;
		else if (node.lat < rect.lat.min) rect.lat.min = node.lat;
		if (node.lon > rect.lon.max) rect.lon.max = node.lon;
		else if (node.lon < rect.lon.min) rect.lon.min = node.lon;
	});

	rect.lat.range = rect.lat.max - rect.lat.min;
	rect.lon.range = rect.lon.max - rect.lon.min;

	osmJson.nodes.forEach(node => {
		ctx.fillStyle = colorHash(node.id);

		ctx.fillRect(
			cvs.width * (node.lat - rect.lat.min) / rect.lat.range - 5,
			cvs.height * (node.lon - rect.lon.min) / rect.lon.range - 5,
			10,
			10
		);
	});
}

function drawOsmQuery(query: string): void {
	jsonOsmQuery(query)
		.then(json => drawOsm(json));
}

drawOsmQuery(`
	(
		node(51.249,7.148,51.251,7.152);
		<;
	);
	out meta;
`);