import React, { Component, ReactElement } from "react";
import Panel from "./panel";
import $ from "cash-dom";
import EventEmitter from "eventemitter3";
import { code_edit_delete } from "./edit/delete";
import { code_edit_enter } from "./edit/enter";
import { code_edit_backspace } from "./edit/backspace";
import { code_edit_move } from "./edit/move";
import { code_edit_type } from "./edit/type";

type CodeEditorCursorProps = {
	x: number,
	y: number
};

class CodeEditorCursor extends React.Component<CodeEditorCursorProps> {
	render() {
		return(
			<div className="cursor" style={{
				left: this.props.x + 'px',
				top: this.props.y + 'px'
			}}></div>
		);
	}
}

type CodeEditPanelProps = {
	id: string,
	path: string
};

export class CodeEditPanel extends React.Component<CodeEditPanelProps> {
	event : EventEmitter

	state : {
		lines: string[],
		fileCursor: { start: number, end: number },
		cursor: { x: number, y: number },
		firstLine: number
	} = {
		lines: [],
		fileCursor: { start: 0, end: 0 },
		cursor: { x: 0, y: 0 },
		firstLine: 0
	}

	constructor(props) {
		super(props);

		this.keyActionHandle = this.keyActionHandle.bind(this);
		this.mouseDownHandler = this.mouseDownHandler.bind(this);
		this.selectHandler = this.selectHandler.bind(this);
	}

	render() {
		return (
			<Panel>
				<div className="editor-wrapper">
					<div className="editor">
						<div className="gutter">
							{
								[...Array(this.state.lines.length)].map(
									(_, i) => this.state.firstLine + i
								).map((num) => {
									return <p key={ 'g' + num.toString() }>{ num }</p>
								})
							}
						</div>
						<div className="code-block"
							id={ this.props.id + "-code" }
							tabIndex={ -1 }
							onKeyDown={ this.keyActionHandle }
							onMouseDown={ this.mouseDownHandler }
							onSelect={ this.selectHandler }>
							<CodeEditorCursor
								x={ this.state.cursor.x }
								y={ this.state.cursor.y }
							/>
							{
								this.state.lines.map((line : string, i : number) => {
									return <p
										key={ 'l' + i.toString() }>{
											(line.length > 0) ? line : ' '
										}
									</p>
								})
							}
						</div>
					</div>
				</div>
			</Panel>
		);
	}

	keyActionHandle(e) {
		// TODO: emit event instead of handling all manually
		const dim = getCharDimensions('a');
		const hasUTF_BOM = this.state.lines[0].charCodeAt(0) == 65279;

		const cursorLine = this.state.cursor.y / dim.height;
		const blockLine = cursorLine - this.state.firstLine;

		// get cursor column; compensating for potential UTF BOM
		let cursorCol = this.state.cursor.x / dim.width;
		if (cursorLine == 0 && hasUTF_BOM)
			cursorCol++;

		// movement keys
		if (e.keyCode >= 37 && e.keyCode <= 40)
			code_edit_move(dim, e, this);

		// backspace key
		else if (e.keyCode == 8)
			code_edit_backspace(blockLine, cursorCol, cursorLine, dim, this);

		// delete key
		else if (e.keyCode == 46)
			code_edit_delete(blockLine, cursorCol, this);

		// new line
		else if (e.keyCode == 13)
			code_edit_enter(blockLine, cursorCol, dim, this);

		// typed character
		else if (e.key.length == 1)
			code_edit_type(blockLine, cursorCol, e, dim, this);

		// save change
		this.save();
	}

	mouseDownHandler(e) {
		// TODO: extract into own file and call via event
		const dim = getCharDimensions('a');
		const bounds : DOMRect = $("#" + this.props.id + "-code")[0]
			.getBoundingClientRect();

		const clickX : number = e.pageX - bounds.x;
		const clickY : number = e.pageY - bounds.y;

		const cursorLine : number = Math.floor(clickY / dim.height);
		const blockLine : number = cursorLine - this.state.firstLine;
		const lineWidth : number = this.state.lines[blockLine].length * dim.width;

		// move cursor
		this.setState({
			cursor: {
				x: Math.min(lineWidth, Math.round(clickX / dim.width) * dim.width),
				y: Math.floor(clickY / dim.height) * dim.height
			}
		});
	}

	selectHandler(e) {
		// console.log(e);
	}

	componentDidMount() {
		// TODO: watch file for external changes
		// TODO: read appropriate segment of file on scroll
		this.loadBlock(0, 0, 10000);
	}

	loadBlock(offset : number, lineNumber : number, blockSize : number) {
		window.fs.readBlock(
			this.props.path, offset, blockSize
		).then((lines: string[]) => {
			// compute end cursor. we add one to each line for newline
			let end = offset;
			lines.forEach(line => end += window.fs.strBytes(line) + 1);
			console.log("computed end " + end);

			// update state
			this.setState({
				lines: lines,
				fileCursor: { start: offset, end: end },
				firstLine: lineNumber
			});
		}).catch((err) => {
			// TODO: visual error
			console.log(err);
		});
	}

	save() {
		// write block into file
		window.fs.overwriteBlock(
			this.state.fileCursor.start,
			this.state.fileCursor.end,
			this.state.lines,
			this.props.path
		).then(() => {
			// compute new block end cursor. add one to each line for newline
			let end = this.state.fileCursor.start;
			this.state.lines.forEach(line => end += window.fs.strBytes(line) + 1);
			this.setState({
				fileCursor: {
					start: this.state.fileCursor.start,
					end: end
				}
			});

			console.log("updated");
		}).catch((err) => {
			// TODO: visual error
			console.log(err);
		});
	}
}

var charDimensionCache = {};

export function getCharDimensions(character) {
	if (typeof charDimensionCache[character] == "undefined") {
		// set test element to this character
		$("#char-test")[0].innerHTML = character;

		// measure the character
		charDimensionCache[character] = $("#char-test")[0].getBoundingClientRect();
	}

	// return dimensions
	return charDimensionCache[character];
}
