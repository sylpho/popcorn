import { CodeEditPanel } from "../code_edit";

export function code_edit_type(
	blockLine : number,
	cursorCol : number,
	e : any,
	dim: any,
	cp : CodeEditPanel
) {
	// dont handle control calls
	if (e.ctrlKey) return;

	// dont handle the enter event
	if (e.keyCode == 13) return;

	// dont make space tab down
	if (e.keyCode == 0) e.preventDefault();

	let lineCopy = cp.state.lines;
	const line = lineCopy[blockLine];

	const key = e.shiftKey ? e.key.toUpperCase() : e.key;

	lineCopy[blockLine] = [
		line.slice(0, cursorCol), key, line.slice(cursorCol)
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
