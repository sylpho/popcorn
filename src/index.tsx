import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import ApplicationRoot from "./application";
import { Config } from "./api/config";

const approot: ReactElement = <ApplicationRoot></ApplicationRoot>;
ReactDOM.render(approot, document.getElementById("root"));

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
