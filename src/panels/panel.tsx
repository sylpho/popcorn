import React from "react";
import { DropDown } from "../widget/drop_down"

export class Panel extends React.Component {
	render() {
		return (
			<div className="panel panel-shell">
				<div className="panel">
					<DropDown></DropDown>
					{this.props.children}
				</div>
			</div>
		);
	}
}
