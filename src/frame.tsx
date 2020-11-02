import React from "react";

export class Frame extends React.Component {
	render() {
		return (
			<div className="frame" style={{ grid: '100% / 100%' }}>
				{ this.props.children }
			</div>
		);
	}
}
