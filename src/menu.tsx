import React from "react";
import $ from "domtastic";

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
			$("#root").css("background-image", `url("${response.filePaths[0]}"`);
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
