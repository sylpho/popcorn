import React from "react";

/***/
class FolderViewPanel extends React.Component {
	private loadedFiles : string[];

	/***/
	public loadHierarchy(rootPath: string) : void {
		// Store folder contents here.
		const wnd = window as any;
		wnd.fs.listFiles(rootPath).then((files) => {
			for (var file in files) {
				const path = rootPath.concat(file);
				path.endsWith("/") ?
					this.loadHierarchy(path) :
					this.loadedFiles.push(path);
			}
		});
	}

	/***/
	private renderHierarchy() : React.ReactElement[] {
		var rootElements: React.ReactElement[];
		// TODO(Someone): Make this work
		return rootElements;
	}

	/***/
	public render() : JSX.Element {
		return (
			<div className="" id="PopFileHierarchyPanel" style={{}}>
				{ this.renderHierarchy() }
			</div>
		);
	}

}

export default FolderViewPanel;
