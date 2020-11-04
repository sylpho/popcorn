import React, { ReactElement } from "react";
import Frame   from "./frame";
import Menubar from "./menu";
import Panel   from "./panels/panel";

class ApplicationRoot extends React.Component {
	render() : JSX.Element {
		const frame:   ReactElement = Frame.build("frame-1", Frame.VERTICAL, [ <Panel/>, <Panel/>, <Panel/> ]);
		const menubar: ReactElement = <Menubar id="main"/>;
		return <div id="ApplicationRoot">{[ menubar, frame ]}</div>;
	}

}

export default ApplicationRoot;
