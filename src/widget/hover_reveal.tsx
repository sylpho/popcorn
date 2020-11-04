import React from "react";

type HoverRevealProps = {
	trigger: any,
	content: any
};

export class HoverReveal extends React.Component<HoverRevealProps> {
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
