import React from "react";
import { Panel } from "./panel"

export class Frame extends React.Component {
	render() {
		return (
			<div className="frame" style={{ grid: '100% / repeat(2, 50%)' }}>
				<Panel/>
			</div>
		);
	}
}
