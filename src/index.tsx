import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App/App.react";

ReactDOM.render(
	<App mapResolution={1000} />,
	document.getElementById("wrapper")
);
