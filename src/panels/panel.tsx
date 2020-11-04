import React from "react";
import { DropDown } from "../widget/drop_down"

class Panel extends React.Component {
	render() {
		// TODO make a nice api for building this
		const dropdownItems = [
			{ id: 'btn', label: 'btn' },
			{ id: 'eee', label: 'eee' }
		];

		return (
			<div className="panel panel-shell">
				<div className="panel">
					<DropDown items={ dropdownItems }/>
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Panel;
