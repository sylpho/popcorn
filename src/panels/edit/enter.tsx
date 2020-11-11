import { CodeEditPanel } from "../code_edit";

export function code_edit_enter(
	blockLine : number, cursorCol : number, dim, cp : CodeEditPanel
) {
	let lineCopy = cp.state.lines;
	const line = cp.state.lines[blockLine];
	const lineEnd = line.substring(cursorCol);
	lineCopy[blockLine] = line.substring(0, cursorCol);
	lineCopy.splice(blockLine + 1, 0, lineEnd)

	cp.setState({
		lines: lineCopy,
		cursor: {
			x: 0,
			y: cp.state.cursor.y + dim.height
		}
	});
}
