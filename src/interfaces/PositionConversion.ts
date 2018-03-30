export interface LatLonRange {
	min: number;
	max: number;
	range: number;
}

export default interface LatLonRect {
	lat: LatLonRange;
	lon: LatLonRange;
}