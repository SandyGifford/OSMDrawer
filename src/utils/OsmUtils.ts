import FetchUtils from "./FetchUtils";
import OsmData, { OsmNode, OsmTag, OsmNd, OsmWay } from "../interfaces/OSM";

export default class OsmUtils {
	public static osmQuery(query: string): Promise<XMLDocument> {
		return FetchUtils.fetchXML("/data", {
			method: "post",
			body: query
		});
	}

	public static jsonOsmQuery(query: string): Promise<OsmData> {
		return OsmUtils.osmQuery(query)
			.then(response => OsmUtils.parseOsmQueryResponse(response));
	}

	public static parseOsmQueryResponse(response: XMLDocument): OsmData {
		const root = response.querySelector("osm");

		return {
			version: root.getAttribute("version"),
			generator: root.getAttribute("generator"),
			nodes: Array.from(root.querySelectorAll("node")).reduce((col, node) => {
				col[node.getAttribute("id")] = OsmUtils.parseOsmNode(node);
				return col;
			}, {} as {[id: string]: OsmNode}),
			ways: Array.from(root.querySelectorAll("way")).map(OsmUtils.parseOsmWay),
		};
	}

	public static parseOsmNode(node: Element): OsmNode {
		return {
			id: node.getAttribute("id"),
			lat: parseFloat(node.getAttribute("lat")),
			lon: parseFloat(node.getAttribute("lon")),
			version: node.getAttribute("version"),
			timestamp: node.getAttribute("timestamp"),
			changeset: node.getAttribute("changeset"),
			uid: node.getAttribute("uid"),
			user: node.getAttribute("user"),
			tags: Array.from(node.querySelectorAll("tag")).map(OsmUtils.parseOsmTag),
		};
	}

	public static parseOsmTag(tag: Element): OsmTag {
		return {
			k: tag.getAttribute("k"),
			v: tag.getAttribute("v"),
		}
	}

	public static parseOsmNd(nd: Element): OsmNd {
		return {
			ref: nd.getAttribute("ref"),
		}
	}

	public static parseOsmWay(way: Element): OsmWay {
		return {
			id: way.getAttribute("id"),
			version: way.getAttribute("version"),
			timestamp: way.getAttribute("timestamp"),
			changeset: way.getAttribute("changeset"),
			uid: way.getAttribute("uid"),
			user: way.getAttribute("user"),
			tags: Array.from(way.querySelectorAll("tag")).map(OsmUtils.parseOsmTag),
			nds: Array.from(way.querySelectorAll("nd")).map(OsmUtils.parseOsmNd),
		}
	}
}