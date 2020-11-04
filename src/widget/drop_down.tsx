import React from "react";
import { HoverReveal } from "../widget/hover_reveal"

type DropdownEntryProps = {
	label: string
};

type DropdownProps = {
	items: any
};

export class DropdownEntry extends React.Component<DropdownEntryProps> {
	render() {
		return (
			<div className="list-item">
				<p>{ this.props.label }</p>
			</div>
		);
	}
}

export class DropDown extends React.Component<DropdownProps> {
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
									item => <DropdownEntry
										key={ item.id }
										label={ item.label }
									/>
								)
							}
						</div>
					</div>
				}
			/>
		);
	}
}
