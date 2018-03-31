import * as React from "react";
import OsmData from "../../interfaces/OSM";

import "./OsmMap";

import PositionConversionUtils from "../../utils/PositionConversionUtils";
// import HashUtils from "../../utils/HashUtils";

export interface OsmMapProps {
	osmData: OsmData;
	width: number;
	height: number;
}
export interface OsmMapState { }

export default class OsmMap extends React.Component<OsmMapProps, OsmMapState> {
	private cvs: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	public componentDidMount(): void {
		this.ctx = this.cvs.getContext("2d");
		this.drawMap();
	}

	public componentDidUpdate(): void {
		this.drawMap();
	}

	public render(): React.ReactNode {
		return (
			<canvas
				width={this.props.width}
				height={this.props.height}
				className="OsmMap"
				ref={this.setRef} />
		);
	}

	private drawMap(): void {
		const {osmData} = this.props;

		if (!osmData) return;

		const {nodes, layers} = osmData;

		
		this.clearCanvas();
		
		const rect = PositionConversionUtils.getLatLonRect(nodes);
		
		Object.keys(layers).forEach(tagKey => {
			const layer = layers[tagKey];
			
			layer.forEach(way => {
				if (way.nds.length) {
					this.ctx.beginPath();

					way.nds.forEach(nd => {
						const node = nodes[nd.ref];

						if (node) {
							const p = PositionConversionUtils.nodeToPx(node, rect, this.cvs.width, this.cvs.height);
							this.ctx.lineTo(p.x, p.y);
						}
					});
					this.ctx.closePath();
					this.ctx.stroke();
				}
			})
		});
	}

	private clearCanvas(): void {
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
	}

	private setRef = (ref: HTMLCanvasElement): void => {
		this.cvs = ref;
	}
}