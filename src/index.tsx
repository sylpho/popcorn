import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Frame } from "./frame";
import { PopMenubar } from "./menu";
import { Panel } from "./panels/panel";
import { Config } from "./api/config";

const rootFrame: ReactElement = Frame.build(
	"frame-1",
	Frame.VERTICAL,
	[ <Panel/>, <Panel/>, <Panel/> ]
);

const menubar: ReactElement = <PopMenubar id="main"></PopMenubar>;
const root : ReactElement = <div className="full-window">{[ menubar, rootFrame ]}</div>;

ReactDOM.render(root, document.getElementById("root"));

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
