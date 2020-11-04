import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Frame } from "./frame";
import { PopMenubar } from "./menu";
import { Panel } from "./panels/panel";
import { Config } from "./api/config";

let rootFrame: ReactElement = Frame.build(
	"frame-1",
	Frame.VERTICAL,
	[ <Panel/>, <Panel/>, <Panel/> ]
);

let menubar: ReactElement = <PopMenubar id="main"></PopMenubar>;
ReactDOM.render(menubar, document.getElementById("root"));
ReactDOM.render(rootFrame, document.getElementById("root"));

Config.fetch().then((config) => {
	console.log(config);
}).catch((err) => {
	if (err.code != "ENOENT") {
		// TODO: report error visually
		console.log(JSON.stringify(err));
	} else {
		Config.commit({});
		console.log("Config not found. Constructed one.");
	}
});
