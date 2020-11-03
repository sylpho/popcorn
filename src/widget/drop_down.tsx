import React from "react";

import { HoverReveal } from "../widget/hover_reveal"

export class DropdownEntry extends React.Component {
	render() {
		return (
			<li> </li>
		);
	}
}

export class DropDown extends React.Component {
	render() {
		return (
			<HoverReveal>
				{
					this.props.items.map((item) => {
						<DropdownEntry key={item} message={item} />
					})
				}
			</HoverReveal>
		);
	}
}
