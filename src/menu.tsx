import React from "react";
import $ from "cash-dom";

type MenuProps = {
	id: string
};

/***/
class Menubar extends React.Component<MenuProps> {
	/***/
	closeApplication() : void {
		var wnd = window as any;
		wnd.electron.application.quit();
	}

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
				<div style={{ display: "inline-flex" }}>
					<button type="button" onClick={this.changeBackground}>Background</button>
				</div>
				<div style={{ display: "inline-flex" }}>
					<button type="button" onClick={this.closeApplication}>
						<i className="gg-close"></i>
					</button>
				</div>
			</div>
		);
	}
}

export default Menubar;
