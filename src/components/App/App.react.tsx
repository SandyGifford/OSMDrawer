import * as React from "react";

import "./App";

import OsmMap from "../OsmMap/OsmMap.react";
import OsmData from "../../interfaces/OSM";
import OsmUtils from "../../utils/OsmUtils";
import DomUtils from "../../utils/DomUtils";

export interface AppProps {
	mapResolution: number;
}
export interface AppState {
	osmData: OsmData;
	query: string;
	fetching: boolean;
}

// honestly just putting this up here so the tabbing doesn't throw me off
const initialQuery = `(
	node(51.249,7.148,51.251,7.152);
	<;
);
out meta;`;

export default class App extends React.Component<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);

		this.state ={
			osmData: null,
			query: initialQuery,
			fetching: false,
		};
	}

	public componentDidMount(): void {
		this.runQuery();
	}

	public render(): React.ReactNode {
		const buttonClassName = DomUtils.BemClassName("App__form__submit", {
			"disabled": this.state.fetching,
		});

		return (
			<div className="App">
				<div className="App__map">
					<OsmMap
						osmData={this.state.osmData}
						width={this.props.mapResolution}
						height={this.props.mapResolution} />
				</div>
				<div className="App__form">
					<textarea
						className="App__form__query"
						value={this.state.query}
						onChange={this.queryChanged} />
					<div className={buttonClassName} onClick={this.runQuery}>query</div>
				</div>
			</div>
		);
	}

	private runQuery = (): void => {
		this.setState({
			osmData: null,
			fetching: true,
		});

		OsmUtils.jsonOsmQuery(this.state.query)
			.then(osmData => {
				this.setState({
					osmData: osmData,
					fetching: false,
				})
			})
			.catch(() => {
				this.setState({
					fetching: false,
				})
			});
	};

	private queryChanged = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		this.setState({
			query: e.target.value,
		});
	};
}
