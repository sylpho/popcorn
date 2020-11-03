import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Frame } from "./frame"
import { Panel } from "./panels/panel"

let rootFrame: ReactElement = Frame.build(
	"frame-1",
	Frame.VERTICAL,
	[ <Panel/>, <Panel/>, <Panel/> ]
);

ReactDOM.render(rootFrame, document.getElementById("root"));
