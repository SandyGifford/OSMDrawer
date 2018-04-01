import { OsmNode } from "../interfaces/OSM";
import LatLonRect, { LatLonRange } from "../interfaces/PositionConversion";

export default class PositionConversionUtils {
	public static getLatLonRect(nodes: { [uid: string]: OsmNode }): LatLonRect {
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

		Object.keys(nodes).forEach(id => {
			const node = nodes[id];
			if (node.lat > rect.lat.max) rect.lat.max = node.lat;
			else if (node.lat < rect.lat.min) rect.lat.min = node.lat;
			if (node.lon > rect.lon.max) rect.lon.max = node.lon;
			else if (node.lon < rect.lon.min) rect.lon.min = node.lon;
		});
		
		rect.lat.range = rect.lat.max - rect.lat.min;
		rect.lon.range = rect.lon.max - rect.lon.min;

		return rect;
	}

	public static nodeToPx(node: OsmNode, rect: LatLonRect, cvsW: number, cvsH: number): { x: number, y: number } {
		return {
			x: this.latLonToPx(node.lon, rect.lon, cvsW),
			y: cvsH - this.latLonToPx(node.lat, rect.lat, cvsH),
		}
	}

	public static latLonToPx(num: number, range: LatLonRange, canvasDim: number): number {
		return canvasDim * (num - range.min) / range.range
	}
}