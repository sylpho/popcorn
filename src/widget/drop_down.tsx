import React from "react";

import { HoverReveal } from "../widget/hover_reveal"

export class DropdownEntry extends React.Component {
	render() {
		return (
			<div key={ this.props.item.id } className="list-item">
				<p>{ this.props.item.label }</p>
			</div>
		);
	}
}

export class DropDown extends React.Component {
	render() {
		const items = this.props.items
		return (
			<HoverReveal
				trigger={ <button className="hover-btn">TEST</button> }
				content={
					<div className="list-container">
						<div className="list">
							{
								items.map(
									item => <DropdownEntry item={ item } />
								)
							}
						</div>
					</div>
				}
			/>
		);
	}
}
