import React from "react"
import $ from 'cash-dom';
import { Frame } from "../frame";

let dragTrack;

type PanelProps = {
	index:  number,
	target: any,
	axis:   number,
};

export class PanelDivider extends React.Component<PanelProps, {}> {
	render() {
		let className : string;
		if (this.props.axis == Frame.HORIZONTAL)
			className = "divider d-horz";
		else
			className = "divider d-vert";

		return (
			<div
				className={ className }
				data-index={ this.props.index }
				data-target={ this.props.target }
				data-axis={ this.props.axis }
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
		if (axis == Frame.HORIZONTAL)
			style[i] = children[i].offsetWidth + "px";
		else
			style[i] = children[i].offsetHeight + "px";
	}

	// apply pixel distribution
	elem.style[accessor] = style.join(" ");

	// get starting value
	let startVal : number;
	if (axis == Frame.HORIZONTAL) startVal = e.pageX;
	else startVal = e.pageY;

	// start tracking
	dragTrack = {
		val: startVal,
		elem: c,
		index: index,
		style: style,
		axis: axis
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
	const axis : number = dragTrack.axis;
	const accessor : string = (axis == Frame.HORIZONTAL)
		? "grid-template-columns" : "grid-template-rows";

	// get parent width
	let parentSize : number;
	if (axis == Frame.HORIZONTAL)
		parentSize = elem.offsetWidth;
	else
		parentSize = elem.offsetHeight;

	// get current distribution
	let style : [string] = elem.style[accessor].split(" ");

	// convert distribution to percentages
	for (let i = 0; i < style.length; i++) {
		// only odd children
		if (i % 2 == 1) continue;

		// convert
		let num : number = parseInt(style[i].substring(0, style[i].length - 2));
		style[i] = (num / parentSize) * 100 + "%";
	}

	// apply percentage distribution
	elem.style[accessor] = style.join(" ");
}

// drag movement handler
function dragMoveHandler(e) {
	// get axis
	const axis = dragTrack.axis;
	const accessor = (axis == Frame.HORIZONTAL)
		? "grid-template-columns" : "grid-template-rows";

	// get x difference
	let diff;
	if (axis == Frame.HORIZONTAL) {
		diff = e.pageX - dragTrack.val;
		dragTrack.val = e.pageX;
	} else {
		diff = e.pageY - dragTrack.val;
		dragTrack.val = e.pageY;
	}

	// apply difference
	let dividerChildIndex = dragTrack.index * 2 - 1;
	let str1 = dragTrack.style[dividerChildIndex - 1];
	let str2 = dragTrack.style[dividerChildIndex + 1];
	let num1 = parseInt(str1.substring(0, str1.length - 2));
	let num2 = parseInt(str2.substring(0, str2.length - 2));
	num1 += diff;
	num2 -= diff;
	str1 = num1 + "px";
	str2 = num2 + "px";
	dragTrack.style[dividerChildIndex - 1] = str1;
	dragTrack.style[dividerChildIndex + 1] = str2;

	// get target container
	const elem = $(dragTrack.elem)[0];

	// apply percentage distribution
	elem.style[accessor] = dragTrack.style.join(" ");
}
