import React from "react";

export class HoverReveal extends React.Component {
	render() {
		return (
			<div className="hover-root">
				{ this.props.trigger }
				<div className="hover-content">
					{ this.props.content }
				</div>
			</div>
		);
	}
}
