import * as React from "react";
import OsmData from "../../interfaces/OSM";

import "./OsmMap";

import PositionConversionUtils from "../../utils/PositionConversionUtils";
import HashUtils from "../../utils/HashUtils";
// import HashUtils from "../../utils/HashUtils";

export interface OsmMapProps {
	osmData: OsmData;
	width: number;
	height: number;
}
export interface OsmMapState { }

interface LayerStyle {
	tag: string;
	color?: string;
	fill: boolean;
	lineWeight: number;
}

export default class OsmMap extends React.Component<OsmMapProps, OsmMapState> {
	private cvs: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private static layerStyles: LayerStyle[] = [
		{
			tag: "highway",
			fill: false,
			lineWeight: 4,
		},
		{
			tag: "building",
			fill: true,
			lineWeight: 1,
		}
	];

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
		
		OsmMap.layerStyles.forEach(style => {
			style.color = HashUtils.colorHash(style.tag);
			const layer = layers[style.tag];
			
			if (!layer) return;

			this.ctx.strokeStyle = style.color;
			this.ctx.fillStyle = style.color;
			this.ctx.lineWidth = style.lineWeight;
			// console.log(tagKey, HashUtils.colorHash(tagKey));
			
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
					
					// this.ctx.closePath();
					this.ctx.stroke();
					if (style.fill) this.ctx.fill();
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