import React, { Component, ReactElement } from "react";
import Panel from "./panel";
import $ from "cash-dom";

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

	render() {
		return (
			<Panel>
				<p id="char-test">a</p>
				<div className="editor-wrapper">
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

	componentDidMount() {
		// TODO: watch file for external changes
		// TODO: read appropriate segment of file on scroll
		window.fs.readBlock(
			this.props.path, 0, 10000
		).then((lines : string[], endCursor : number) => {
			// update state
			this.setState({
				lines: lines,
				cusor: { start: 0, end: endCursor },
				block: { start: 0, length: lines.length }
			});
		}).catch((err) => {
			// TODO: visual error
			console.log(err);
		});

		$(document).on('keydown', (e) => {
			const dim = getCharDimensions('a');

			let newX : number = this.state.cursor.x;
			let newY : number = this.state.cursor.y;

			// TODO: prevent cursor from exceeding line length, and instead wrap to next line
			if (e.keyCode == 37) newX = Math.max(0, this.state.cursor.x - dim.width);
			else if (e.keyCode == 39) newX = this.state.cursor.x + dim.width;
			else if (e.keyCode == 38) newY = Math.max(0, this.state.cursor.y - dim.height);
			else if (e.keyCode == 40) newY = this.state.cursor.y + dim.height;
			else return;

			e.preventDefault();

			this.setState({
				cursor: {
					x: newX, y: newY
				}
			});

			console.log({
				x: newX, y: newY
			});
		});
	}
}

export class Editor {
	component : ReactElement;

	state: {
		lines: string[],
		cusor: { start: number, end: number },
		block: { start: number, length: number }
	} = {
		lines: [],
		cusor: { start: 0, end: 0 },
		block: { start: 0, length: 0 }
	};

	constructor(path : string) {
		this.component = <CodeEditPanel key="2" id="edit-1" path={ path } />;
	}
}

var charDimensionCache = {};

function getCharDimensions(character) {
	if (typeof charDimensionCache[character] == "undefined") {
		// set test element to this character
		$("#char-test")[0].innerHTML = character;

		// measure the character
		charDimensionCache[character] = $("#char-test")[0].getBoundingClientRect();
	}

	// return dimensions
	return charDimensionCache[character];
}
