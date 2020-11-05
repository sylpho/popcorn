import React, { ReactElement } from "react";
import Frame   from "./frame";
import Panel   from "./panels/panel";

class ApplicationRoot extends React.Component {
	render() : JSX.Element {
		const frame: ReactElement =
			Frame.build("frame-1", Frame.VERTICAL, [ <Panel/>, <Panel/>, <Panel/> ]);
		return <div id="ApplicationRoot">{[ frame ]}</div>;
	}

}

export default ApplicationRoot;
