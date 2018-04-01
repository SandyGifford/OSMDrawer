export type OsmLayer = { [tagKey: string]: string[] };
export type OsmWays = { [id: string]: OsmWay };
export type OsmNodes = { [id: string]: OsmNode };

export default interface OsmData {
	version: string;
	generator: string;
	nodes: OsmNodes;
	ways: OsmWays;
	layers: OsmLayer;
}

export interface OsmNode {
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

export interface OsmTag {
	k: string;
	v: string;
}

export interface OsmWay {
	id: string;
	version: string;
	timestamp: string;
	changeset: string;
	uid: string;
	user: string;
	tags: OsmTag[];
	nds: OsmNd[];
}

export interface OsmNd {
	ref: string;
}
