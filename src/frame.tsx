import React, { ReactElement } from "react";
import { PanelDivider } from "./widget/panel_divider";


export function makeFrame(children : ReactElement[], id : string) {
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
					index={++dividerIndex}
					target={'#' + id}
				/>
			)
	}

	// create column/row distribution
	let dist = [];
	for (let i: number = 0; i < newchildren.length; i++) {
		if (i % 2 == 0) dist.push("1fr");
		else dist.push("4px");
	}

	const style = {
		gridTemplateRows: "1fr",
		gridTemplateColumns: dist.join(" ")
	};

	// return element
	return <Frame id={ id } style={ style }>
		{ newchildren }
	</Frame>
}

class Frame extends React.Component {
	render() {
		return(
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
