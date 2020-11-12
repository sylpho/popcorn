import React, { ReactElement } from "react";
import { CodeEditPanel } from "./panels/code_edit";
import FolderViewPanel from "./panels/folderview";
import Panel from "./panels/panel";
import Frame from "./frame";

class ApplicationRoot extends React.Component {
	render() : JSX.Element {
		const frame: ReactElement = Frame.build("frame-1", Frame.VERTICAL, [
			<FolderViewPanel key="1" rootPath="D:\Simular\HearthEngine\Hearth\"/>,
			<CodeEditPanel key="2" id="edit-1" path="D:\Simular\HearthEngine\Hearth\source\Native\WinAPI\WinApiEnvironment.cpp"/>,
			<Panel key="3"/>
		]);

		return <div id="ApplicationRoot">{ frame }</div>;
	}

}

export default ApplicationRoot;
