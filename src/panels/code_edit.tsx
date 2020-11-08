import React from "react";
import Panel from "./panel";
import $ from "cash-dom";

type CodeEditorCursorProps = {
	target: string
};

class CodeEditorCursor extends React.Component<CodeEditorCursorProps> {
	state : {
		x: number,
		y: number
	} = {
		x: 0,
		y: 0
	}

	render() {
		return(
			<div className="cursor" style={{
				left: this.state.x + 'px',
				top: this.state.y + 'px'
			}}></div>
		);
	}

	componentDidMount() {
		$(document).on('keydown', (e) => {
			const dim = getCharDimensions('a');

			// TODO: prevent cursor from exceeding line length, and instead wrap to next line
			switch (e.keyCode) {
				case 37:
					this.setState({
						x: Math.max(0, this.state.x - (dim.width))
					});

					break;

				case 39:
					this.setState({
						x: this.state.x + (dim.width)
					});

					break;

				case 38:
					this.setState({
						y: Math.max(0, this.state.y - (dim.height))
					});

					break;

				case 40:
					this.setState({
						y: this.state.y + dim.height
					});

					break;
			}
		});
	}
}

type CodeEditPanelProps = {
	id: string,
	path: string
};

export class CodeEditPanel extends React.Component<CodeEditPanelProps> {
	state : {
		lines: string[],
		cusor: { start: number, end: number },
		block: { start: number, length: number }
	} = {
		lines: [],
		cusor: { start: 0, end: 0 },
		block: { start: 0, length: 0 }
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
								target={ this.props.id } data-x="0" data-y="0"/>
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
