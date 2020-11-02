import React from "react";

export class HoverReveal extends React.Component {
	render() {
		return (
			<div className="hover-root">
				<button className="hover-btn">BTN</button>
				<div className="hover-content">
					{ this.props.children }
				</div>
			</div>
		);
	}
}
