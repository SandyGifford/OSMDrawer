import * as React from "react";
import OsmData from "../../interfaces/OSM";

import "./OsmMap";

import PositionConversionUtils from "../../utils/PositionConversionUtils";

export interface OsmMapProps {
	osmData: OsmData;
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
				className="OsmMap"
				ref={this.setRef} />
		);
	}

	private drawMap(): void {
		const {osmData} = this.props;

		if (!osmData) return;

		const {nodes, ways} = osmData;

		
		this.clearCanvas();
		
		const rect = PositionConversionUtils.getLatLonRect(nodes);
		
		ways.forEach(way => {
			if (way.nds.length) {
				// this.ctx.strokeStyle = "black";
				
				// const firstId = way.nds.find(nd => !!nodes[nd.ref]).ref;
				// const firstNode = nodes[firstId];
				
				// const p = PositionConversionUtils.nodeToPx(firstNode, rect, this.cvs.width, this.cvs.height);
				// this.ctx.moveTo(p.x, p.y);
				
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
		});
	}

	private clearCanvas(): void {
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
	}

	private setRef = (ref: HTMLCanvasElement): void => {
		this.cvs = ref;
	}
}