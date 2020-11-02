import React, { ReactElement } from "react";

export
module Popcorn {

	const frmElm = (obj) =>
		<div className="frame" style={{ grid: "100% / 100%" }}>
			{ obj }
		</div>;

	export
	class Frame extends React.Component {
		render = () => frmElm(this.props.children);
	}

}
