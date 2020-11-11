import { CodeEditPanel } from "../code_edit";

export function code_edit_backspace(
	blockLine : number,
	cursorCol : number,
	cursorLine : number,
	dim : any,
	cp : CodeEditPanel
) {
	let lineCopy = cp.state.lines;

	// we ignore utf BOM
	let visualCursorCol = cp.state.cursor.x / dim.width;

	// if we delete the start, go to previous line
	if (visualCursorCol <= 0) {
		if (cursorLine == 0) return;

		// append previous line and dete current line
		const prevLine = lineCopy[blockLine - 1];
		lineCopy[blockLine - 1] = prevLine + lineCopy[blockLine];
		lineCopy.splice(blockLine, 1);

		// update state, also moving cursor
		cp.setState({
			lines: lineCopy,
			cursor: {
				x: prevLine.length * dim.width,
				y: cp.state.cursor.y - dim.height
			}
		});
	}

	// delete a normal character
	else {
		// delete character
		let line = cp.state.lines[blockLine];
		lineCopy[blockLine] = line.substring(0, cursorCol - 1) + line.substring(cursorCol, line.length);

		// update state, also moving cursor
		cp.setState({
			lines: lineCopy,
			cursor: {
				x: cp.state.cursor.x - dim.width,
				y: cp.state.cursor.y
			}
		});
	}
}
