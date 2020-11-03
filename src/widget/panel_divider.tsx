import React from "react";
import $ from 'domtastic';
import { Frame } from "../frame";

let dragTrack;

export class PanelDivider extends React.Component {
	render() {
		return (
			<div
				className="divider"
				index={ this.props.index }
				target={ this.props.target }
				axis={ this.props.axis }
				onMouseDown={ dragStartHandle }
			></div>
		);
	}
}

/** DRAG LOGIC **/
// mouse down event handler
function dragStartHandle(e) {
	// get target container
	const c = e.target.attributes.target.nodeValue;
	const elem = $(c)[0];

	// get axis
	const axis = parseInt(e.target.attributes.axis.nodeValue);
	const accessor = (axis == Frame.HORIZONTAL)
		? "grid-template-columns" : "grid-template-rows";

	// get children
	const children = elem.children;

	// get current distribution
	let style = elem.style[accessor].split(" ");

	// get current divider index
	let index = parseInt(e.target.attributes.index.nodeValue);

	// convert everything to pixels
	for (let i = 0; i < style.length; i++) {
		// only odd children
		if (i % 2 == 1) continue;

		// convert
		style[i] = children[i].offsetWidth + "px";
	}

	// apply pixel distribution
	elem.style[accessor] = style.join(" ");

	// start tracking
	dragTrack = {
		x: e.pageX,
		y: e.pageY,
		elem: c,
		index: index,
		style: style
	};

	$(document).on("mouseup", dragEndHandle);
	$(document).on("mousemove", dragMoveHandler);
}

// drag completion handler
function dragEndHandle(e) {
	// stop tracking
	$(document).off("mouseup", dragEndHandle);
	$(document).off("mousemove", dragMoveHandler);

	// get target container
	const elem = $(dragTrack.elem)[0];

	// get axis
	const axis = parseInt(e.target.attributes.axis.nodeValue);
	const accessor = (axis == Frame.HORIZONTAL)
		? "grid-template-columns" : "grid-template-rows";

	// get parent width
	const parentWidth = elem.offsetWidth;

	// get current distribution
	let style = elem.style[accessor].split(" ");

	// convert distribution to percentages
	for (let i = 0; i < style.length; i++) {
		// only odd children
		if (i % 2 == 1) continue;

		// convert
		let num = style[i].substring(0, style[i].length - 2);
		style[i] = (num / parentWidth) * 100 + "%";
	}

	// apply percentage distribution
	elem.style[accessor] = style.join(" ");
}

// drag movement handler
function dragMoveHandler(e) {
	// get x difference
	const xDiff = e.pageX - dragTrack.x;
	dragTrack.x = e.pageX;

	// apply x difference
	let dividerChildIndex = dragTrack.index * 2 - 1;
	let str1 = dragTrack.style[dividerChildIndex - 1];
	let str2 = dragTrack.style[dividerChildIndex + 1];
	let num1 = parseInt(str1.substring(0, str1.length - 2));
	let num2 = parseInt(str2.substring(0, str2.length - 2));
	num1 += xDiff;
	num2 -= xDiff;
	str1 = num1 + "px";
	str2 = num2 + "px";
	dragTrack.style[dividerChildIndex - 1] = str1;
	dragTrack.style[dividerChildIndex + 1] = str2;

	// get target container
	const elem = $(dragTrack.elem)[0];

	// get axis
	const axis = parseInt(e.target.attributes.axis.nodeValue);
	const accessor = (axis == Frame.HORIZONTAL)
		? "grid-template-columns" : "grid-template-rows";

	// apply percentage distribution
	elem.style[accessor] = dragTrack.style.join(" ");
}
