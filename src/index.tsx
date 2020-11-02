import React from "react";
import ReactDOM from "react-dom";

class Frame extends React.Component {
	render() {
		return (
			<div class="frame" style={{ grid: '100% / repeat(2, 50%)' }}>
				<Panel/>
			</div>
		);
	}
}

class Panel extends React.Component {
	render() {
		return (
			<div style={{ display: 'block', background_color: '#ff0000' }}></div>
		);
	}
}

ReactDOM.render(<Frame />, document.getElementById("root"));
