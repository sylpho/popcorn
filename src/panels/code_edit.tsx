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
				fileCusor: { start: 0, end: endCursor },
				block: { start: 0, length: lines.length }
			});
		}).catch((err) => {
			// TODO: visual error
			console.log(err);
		});

		$(document).on('keydown', (e) => {
			const hasUTF_BOM = this.state.lines[0].charCodeAt(0) == 65279;
			const dim = getCharDimensions('a');

			const cursorLine = this.state.cursor.y / dim.height;
			const blockLine = cursorLine - this.state.block.start;

			// get cursor column; compensating for potential UTF BOM
			let cursorCol = this.state.cursor.x / dim.width;
			if (cursorLine == 0 && hasUTF_BOM)
				cursorCol++;

			// movement keys
			if (e.keyCode >= 37 && e.keyCode <= 40) {
				let newX: number = this.state.cursor.x;
				let newY: number = this.state.cursor.y;

				e.preventDefault();

				// left
				if (e.keyCode == 37) {
					newX -= dim.width;
					if (newX < 0) {
						// dont do anything if we're at the topmost line
						if (newY == 0) return;

						newY -= dim.height;

						// set newX to the end of the previous line, keeping in mind UTF BOM
						let lineLength = this.state.lines[newY / dim.height].length;
						if (newY == 0 && hasUTF_BOM) lineLength -= 1;
						
						newX = lineLength * dim.width;
					}
				}

				// right
				else if (e.keyCode == 39) {
					newX += dim.width;

					let lineLength = this.state.lines[newY / dim.height].length;
					if (newY == 0 && hasUTF_BOM) lineLength -= 1;

					if (newX > lineLength * dim.width)
					{
						// TODO: ensure there is another line to go to
						newY += dim.height;
						newX = 0;
					}
				}

				else {
					// up
					if (e.keyCode == 38)
						newY = Math.max(0, this.state.cursor.y - dim.height);

					// down
					else if (e.keyCode == 40) newY += dim.height;

					// clamp, keeping in mind possible UTF BOM
					let lineLength = this.state.lines[newY / dim.height].length;
					if (newY == 0 && hasUTF_BOM) lineLength -= 1;
					newX = Math.min(newX, lineLength * dim.width);
				}

				this.setState({
					cursor: {
						x: newX, y: newY
					}
				});
			}

			// backspace key
			else if (e.keyCode == 8) {
				let lineCopy = this.state.lines;

				// if we delete the start, go to previous line
				if (cursorCol == 0) {
					if (cursorLine == 0) return;

					// append previous line and dete current line
					const prevLine = lineCopy[blockLine - 1];
					lineCopy[blockLine - 1] = prevLine + lineCopy[blockLine];
					lineCopy.splice(blockLine, 1);

					// update state, also moving cursor
					this.setState({
						lines: lineCopy,
						cursor: {
							x: prevLine.length * dim.width,
							y: this.state.cursor.y - dim.height
						}
					});
				}

				// delete a normal character
				else {
					// delete character
					let line = this.state.lines[blockLine];
					lineCopy[blockLine] = line.substring(0, cursorCol - 1) + line.substring(cursorCol, line.length);

					// update state, also moving cursor
					this.setState({
						lines: lineCopy,
						cursor: {
							x: this.state.cursor.x - dim.width,
							y: this.state.cursor.y
						}
					});
				}
			}

			// delete key
			else if (e.keyCode == 46) {
				const line = this.state.lines[blockLine];
				let lineCopy = this.state.lines;

				// deleting the newline character
				if (cursorCol == line.length) {
					// abort if there is no next line
					if (blockLine == this.state.lines.length - 1) return;

					// append next line and delete next line
					lineCopy[blockLine] = line + lineCopy[blockLine + 1];
					lineCopy.splice(blockLine + 1, 1);
				}

				// delete as normal
				else
					lineCopy[blockLine] = line.substring(0, cursorCol) + line.substring(cursorCol + 1, line.length);

				// update state
				this.setState({
					lines: lineCopy
				});
			}

			// new line
			else if (e.keyCode == 13) {
				let lineCopy = this.state.lines;
				const line = this.state.lines[blockLine];
				const lineEnd = line.substring(cursorCol);
				lineCopy[blockLine] = line.substring(0, cursorCol);
				lineCopy.splice(blockLine + 1, 0, lineEnd)

				this.setState({
					lines: lineCopy,
					cursor: {
						x: 0,
						y: this.state.cursor.y + dim.height
					}
				});
			}

			// typing a character
			else {
				// only type single character things
				if (e.key.length != 1) return;

				let lineCopy = this.state.lines;
				const line = lineCopy[blockLine];
				lineCopy[blockLine] = [line.slice(0, cursorCol), e.key, line.slice(cursorCol)].join('');

				// update state, also moving cursor
				this.setState({
					lines: lineCopy,
					cursor: {
						x: this.state.cursor.x + dim.width,
						y: this.state.cursor.y
					}
				});
			}
		});
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
