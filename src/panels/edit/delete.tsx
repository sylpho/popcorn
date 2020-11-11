import { CodeEditPanel } from "../code_edit";

export function code_edit_delete(
	blockLine : number, cursorCol : number, cp : CodeEditPanel
) {
	const line = cp.state.lines[blockLine];
	let lineCopy = cp.state.lines;

	// deleting the newline character
	if (cursorCol == line.length) {
		// abort if there is no next line
		if (blockLine == cp.state.lines.length - 1) return;

		// append next line and delete next line
		lineCopy[blockLine] = line + lineCopy[blockLine + 1];
		lineCopy.splice(blockLine + 1, 1);
	}

	// delete as normal
	else lineCopy[blockLine] = line.substring(0, cursorCol)
		+ line.substring(cursorCol + 1, line.length);

	// update state
	cp.setState({
		lines: lineCopy
	});
}
