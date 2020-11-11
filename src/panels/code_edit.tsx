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
		block: { start: number, length: number },
		cursor: { x: number, y: number }
	} = {
		lines: [],
		fileCursor: { start: 0, end: 0 },
		block: { start: 0, length: 0 },
		cursor: { x: 0, y: 0 }
	}

	constructor(props) {
		super(props);

		this.keyInputHandle = this.keyInputHandle.bind(this);
		this.keyActionHandle = this.keyActionHandle.bind(this);
	}

	render() {
		return (
			<Panel>
				<div className="editor-wrapper"
					tabIndex={ -1 }
					onKeyDown={ this.keyActionHandle }
					onKeyPress={ this.keyInputHandle }>
					<div className="editor">
						<div className="gutter">
							{
								[...Array(this.state.block.length)].map(
									(_, i) => this.state.block.start + i
								).map((num) => {
									return <p key={ 'g' + num.toString() }>{ num }</p>
								})
							}
						</div>
						<div className="code-block">
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

	keyInputHandle(e) {
		const dim = getCharDimensions('a');
		const hasUTF_BOM = this.state.lines[0].charCodeAt(0) == 65279;

		const cursorLine = this.state.cursor.y / dim.height;
		const blockLine = cursorLine - this.state.block.start;

		// get cursor column; compensating for potential UTF BOM
		let cursorCol = this.state.cursor.x / dim.width;
		if (cursorLine == 0 && hasUTF_BOM)
			cursorCol++;

		code_edit_type(blockLine, cursorCol, e, dim, this);
	}

	keyActionHandle(e) {
		const dim = getCharDimensions('a');
		const hasUTF_BOM = this.state.lines[0].charCodeAt(0) == 65279;

		const cursorLine = this.state.cursor.y / dim.height;
		const blockLine = cursorLine - this.state.block.start;

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
	}

	componentDidMount() {
		// TODO: watch file for external changes
		// TODO: read appropriate segment of file on scroll
		window.fs.readBlock(
			this.props.path, 0, 10000
		).then((lines : string[], endCursor : number) => {
			// update state
			this.setState({
				lines: lines,
				fileCusor: { start: 0, end: endCursor },
				block: { start: 0, length: lines.length }
			});
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
