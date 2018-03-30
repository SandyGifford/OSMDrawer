export default interface OsmData {
	version: string;
	generator: string;
	nodes: { [id: string]: OsmNode };
	ways: OsmWay[];
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
