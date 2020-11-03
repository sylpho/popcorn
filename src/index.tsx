import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { makeFrame } from "./frame"
import { Panel } from "./panels/panel"

let rootFrame: ReactElement = makeFrame(
	[
		<Panel/>,
		<Panel/>,
		<Panel/>
	],
	"frame-1"
);

ReactDOM.render(rootFrame, document.getElementById("root"));
