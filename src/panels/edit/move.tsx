import { CodeEditPanel } from "../code_edit";

export function code_edit_move(
	dim, e, cp : CodeEditPanel
) {
	let newX: number = cp.state.cursor.x;
	let newY: number = cp.state.cursor.y;

	const hasUTF_BOM = cp.state.lines[0].charCodeAt(0) == 65279;

	e.preventDefault();

	// left
	if (e.keyCode == 37) {
		newX -= dim.width;
		if (newX < 0) {
			// dont do anything if we're at the topmost line
			if (newY == 0) return;

			newY -= dim.height;

			// set newX to the end of the previous line, keeping in mind UTF BOM
			let lineLength = cp.state.lines[newY / dim.height].length;
			if (newY == 0 && hasUTF_BOM) lineLength -= 1;

			newX = lineLength * dim.width;
		}
	}

	// right
	else if (e.keyCode == 39) {
		newX += dim.width;

		let lineLength = cp.state.lines[newY / dim.height].length;
		if (newY == 0 && hasUTF_BOM) lineLength -= 1;

		if (newX > lineLength * dim.width) {
			// TODO: ensure there is another line to go to
			newY += dim.height;
			newX = 0;
		}
	}

	else {
		// up
		if (e.keyCode == 38)
			newY = Math.max(0, cp.state.cursor.y - dim.height);

		// down
		else if (e.keyCode == 40) newY += dim.height;

		// clamp, keeping in mind possible UTF BOM
		let lineLength = cp.state.lines[newY / dim.height].length;
		if (newY == 0 && hasUTF_BOM) lineLength -= 1;
		newX = Math.min(newX, lineLength * dim.width);
	}

	cp.setState({
		cursor: {
			x: newX, y: newY
		}
	});
}
