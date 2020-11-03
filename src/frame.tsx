import React, { ReactElement } from "react";
import { PanelDivider } from "./widget/panel_divider";

export namespace Frame {
	export const HORIZONTAL : number = 0;
	export const VERTICAL : number = 1;

	export function build(
		id : string,
		axis : number,
		children : ReactElement[]
	) {
		// insert dividers
		let dividerIndex = 0;
		let newchildren = [];

		for (let i: number = 0; i < children.length; i++) {
			// add child
			newchildren.push(children[i]);

			// if not the last child, add a divider
			if (!(i + 1 == children.length))
				newchildren.push(
					<PanelDivider
						index={ ++dividerIndex }
						target={ '#' + id }
						axis={ axis }
					/>
				)
		}

		// create column/row distribution
		let dist = [];
		for (let i: number = 0; i < newchildren.length; i++) {
			if (i % 2 == 0) dist.push("1fr");
			else dist.push("4px");
		}

		let style;
		if (axis == HORIZONTAL)
			style = {
				gridTemplateRows: "1fr",
				gridTemplateColumns: dist.join(" ")
			};
		else
			style = {
				gridTemplateRows: dist.join(" "),
				gridTemplateColumns: "1fr"
			};

		// return element
		return <Frame id={ id } style={ style }>
			{ newchildren }
		</Frame>
	}

	class Frame extends React.Component {
		render() {
			return (
				<div
					id={ this.props.id }
					className="frame"
					style={ this.props.style }
				>
					{ this.props.children }
				</div>
			);
		}
	}
}
