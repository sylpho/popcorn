import React, { ReactElement } from "react";
import { CodeEditPanel } from "./panels/code_edit";
import Panel from "./panels/panel";
import Frame from "./frame";

class ApplicationRoot extends React.Component {
	render() : JSX.Element {
		const frame: ReactElement = Frame.build("frame-1", Frame.VERTICAL, [
			<Panel key="1"/>,
			<CodeEditPanel key="2" id="edit-1" path="C:\Users\mcfish\Documents\waterbox-cli\Assets\Scripts\Display.cs"/>,
			<Panel key="3"/>
		]);

		return <div id="ApplicationRoot">{ frame }</div>;
	}

}

export default ApplicationRoot;
