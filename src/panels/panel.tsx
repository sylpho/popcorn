import React from "react";
import { HoverReveal } from "../widget/hover_reveal"

export class Panel extends React.Component {
	render() {
		return (
			<div style={{ display: 'block' }}>
				<HoverReveal>
					<p style={{ margin: 0 }}>Panel types go here</p>
				</HoverReveal>
				{ this.props.children }
			</div>
		);
	}
}
