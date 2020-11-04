import React from "react";
import $ from "cash-dom";

type MenuProps = {
	id: string
};

/***/
export class PopMenubar extends React.Component<MenuProps> {
	/***/
	changeBackground() : void {
		var wnd       = window as any;
		var openProps = { properties: [ "openFile" ] };
		wnd.menu.openFile(openProps).then((response: { canceled: any, filePaths: string[]; }) => {
			if (response.canceled)
				return;
			if (response.filePaths === null)
				return;
			// Take first file and put it as the background image of the root.
			let path: string[] = response.filePaths[0].split('');
			for (let i = 0; i < path.length; i++)
				if (path[i] == '\\')
					path[i] = '/';

			$("#root").css("background-image", `url("${ path.join("") }"`);
		});
	}

	/***/
	render() : JSX.Element {
		return (
			<div className="menubar" id={ this.props.id }>
				<button type="button" onClick={this.changeBackground}>Background</button>
			</div>
		);
	}
}
