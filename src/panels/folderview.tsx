import React from "react";
import fs    from "fs";
import path  from "path";
import Panel from "./panel";
import { resolve } from "dns";

/**
 * Describes if the node is a branch node.
 */
const BRANCH_NODE: number = 0;

/**
 * Describes if the node is a leaf node.
 */
const LEAF_NODE: number = 1;

/**
 * A file hierarchy node is one in which the node represents either a folder, on its branches, or a
 * file on its leaves.
 */
class FileHierarchyNode {
	/**
	 * The name of the path for this node in the hierarchy.
	 */
	public readonly pathName: string;

	/**
	 * The type of this node.
	 */
	public readonly nodeType: number;

	/**
	 * The children of this node. Each child represents another branch in the paths of the hierarchy,
	 * though that should go without saying.
	 */
	public childNodes: FileHierarchyNode[];

	/**
	 * Constructs a FileHierarchyNode with the given path name.
	 * @param pathName The name of the path for this node in the hierarchy.
	 * @param nodeType The type of the node.
	 */
	public constructor(pathName: string, nodeType: number) {
		this.pathName   = pathName;
		this.nodeType   = nodeType;
		this.childNodes = [];
	}

	/**
	 * Renders out the file hierarchy node.
	 * @returns The file hierarchy node as a react element.
	 */
	public render(): React.ReactElement {
		// Convert children to elements.
		let children: React.ReactElement[] = [];
		this.childNodes.forEach((child: FileHierarchyNode) => {
			children.push(child.render());
		});

		// Create an object.
		let divAttrs = {
			id: this.nodeType === BRANCH_NODE ? "PopFolderNode" : "PopFileNode",
			className: this.nodeType === BRANCH_NODE ? "folder" : "file"
		};

		// Create an object.
		let spanAttrs = {
			className: this.nodeType === BRANCH_NODE ? "folderName" : "fileName"
		};

		// Return results.
		console.log("This is happening");
		return (
			<div key={ this.pathName } {...divAttrs}>
				<span {...spanAttrs}>{ this.pathName }</span>
				{ children }
			</div>
		);
	}
}

/**
 * Represents a file hierarchy from disk.
 */
class FileHierarchy {
	/**
	 * The root node of the file hierarchy.
	 */
	public readonly rootNode: FileHierarchyNode;

	/**
	 * Creates a new FileHierarchy.
	 * @param rootPath The path the hierarchy starts from.
	 */
	private constructor(root : FileHierarchyNode) {
		this.rootNode = root;
	}

	/**
	 * Creates a hierarchy from the given root.
	 * @param rootPath The root path of the hierarchy to load.
	 */
	public static loadFrom(rootPath: string): Promise<FileHierarchy> {
		return new Promise((resolve, rejects) => {
			FileHierarchy.loadDirectory(rootPath).then((root : FileHierarchyNode) => {
				const fs = new FileHierarchy(root);
				resolve(fs);
			}).catch((e) => {
				rejects(e);
			});
		});
	}

	/**
	 * Loads the given directory into a file hierarchy node.
	 * @param dirPath The path of the directory to load.
	 */
	private static loadDirectory(dirPath: string): Promise<FileHierarchyNode> {
		return new Promise((resolve, reject) => {
			// Normalize directory path.
			const wnd = window as any;
			dirPath = wnd.fs.normalize(dirPath);

			// Break up the dir and get the name of the last directory.
			const segs = dirPath.split(wnd.fs.path.sep);
			const rootName = segs[segs.length - 2];
			let node = new FileHierarchyNode(rootName, BRANCH_NODE);

			wnd.fs.listFiles(dirPath).then((entries: fs.Dirent[]) => {
				// List each directory entry.
				entries.forEach((ent: fs.Dirent) => {
					// Check what type of directory entry this is.
					if (ent.isDirectory()) {
						// Another directory.
						const path : string = dirPath.concat(ent.name, wnd.fs.path.sep);
						this.loadDirectory(path).then((branch : FileHierarchyNode) => {
							node.childNodes.push(branch);
						}).catch(reject);
					} else if (ent.isFile()) {
						// File.
						const leaf : FileHierarchyNode = new FileHierarchyNode(ent.name, LEAF_NODE);
						node.childNodes.push(leaf);
					}
				});

				resolve(node);
			}).catch(reject);
		});
	}

	/**
	 * Renders out the entire hierarchy to the folder view.
	 */
	// public render(): React.ReactElement {
	// 	// Convert children to elements.
	// 	console.log(this.rootNode.childNodes.length);
	// 	let children: React.ReactElement[] = [];
	// 	this.rootNode.childNodes.forEach((child: FileHierarchyNode) => {
	// 		children.push(child.render());
	// 	});

	// 	// Return results.
	// 	return (

	// 	);
	// }
}

/**
 * Represents the type of the props that the folder view panel needs.
 */
type FolderViewPanelProps = {
	rootPath: string;
};

/**
 * Represents the folder view panel.
 */
class FolderViewPanel extends React.Component<FolderViewPanelProps> {
	state : {
		children : React.ReactElement[]
	} = {
		children : []
	}

	/**
	 * Renders out the entire file hierarchy.
	 */
	public render(): JSX.Element {
		return (
			<Panel>
				<div className="fileHierarchy" id="PopFileHierarchyPanel">
					{ this.state.children }
				</div>
			</Panel>
		);
	}

	componentDidMount() {
		FileHierarchy.loadFrom(this.props.rootPath).then((fs : FileHierarchy) => {
			// build out children
			let children : React.ReactElement[] = [];
			fs.rootNode.childNodes.forEach((child: FileHierarchyNode) => {
				children.push(child.render());
			});

			this.setState({
				children: children
			});
		}).catch((e) => {
			// TODO: show visual error
			console.log(e);
		});
	}
}

export default FolderViewPanel;
