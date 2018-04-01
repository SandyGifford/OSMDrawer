import * as React from "react";
import OsmData, { OsmWay } from "../../interfaces/OSM";

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
	glow?: {
		size: number;
		color: string;
	};
}

export default class OsmMap extends React.Component<OsmMapProps, OsmMapState> {
	private cvs: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private static layerStyles: LayerStyle[] = [
		{
			tag: "highway",
			fill: false,
			lineWeight: 10,
			color: "#99999F",
			glow: {
				size: 30,
				color: "#fdec77"
			}
		},
		{
			tag: "building",
			fill: true,
			lineWeight: 1,
			color: "#f0abfd",
		},
		{
			tag: "park",
			fill: true,
			lineWeight: 1,
		}
	];

	public componentDidMount(): void {
		this.ctx = this.cvs.getContext("2d");
		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 0;
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
			if (!style.color) style.color = HashUtils.colorHash(style.tag);
			const layer = layers[style.tag];
			
			if (!layer) return;

			const drawWay = (way: OsmWay) => {
				if (way.nds.length) {
					this.ctx.beginPath();

					way.nds.forEach(nd => {
						const node = nodes[nd.ref];

						if (node) {
							const p = PositionConversionUtils.nodeToPx(node, rect, this.cvs.width, this.cvs.height);
							this.ctx.lineTo(p.x, p.y);
						}
					});

					this.ctx.stroke();
					if (style.fill) this.ctx.fill();
				}
			}

			this.ctx.lineWidth = style.lineWeight;

			if (style.glow) {
				this.ctx.shadowBlur = style.glow.size;
				this.ctx.shadowColor = style.glow.color;
				this.ctx.fillStyle = "";
				this.ctx.strokeStyle = "";

				layer.forEach(drawWay);
			}

			this.ctx.shadowBlur = 0;
			this.ctx.shadowColor = "";

			this.ctx.strokeStyle = style.color;
			this.ctx.fillStyle = style.color;
			
			layer.forEach(drawWay);
		});
	}

	private clearCanvas(): void {
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
	}

	private setRef = (ref: HTMLCanvasElement): void => {
		this.cvs = ref;
	}
}