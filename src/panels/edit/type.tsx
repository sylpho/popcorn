import { CodeEditPanel } from "../code_edit";

export function code_edit_type(
	blockLine : number,
	cursorCol : number,
	e : any,
	dim: any,
	cp : CodeEditPanel
) {
	let lineCopy = cp.state.lines;
	const line = lineCopy[blockLine];
	lineCopy[blockLine] = [
		line.slice(0, cursorCol),
		e.key,
		line.slice(cursorCol)
	].join('');

	// update state, also moving cursor
	cp.setState({
		lines: lineCopy,
		cursor: {
			x: cp.state.cursor.x + dim.width,
			y: cp.state.cursor.y
		}
	});
}
