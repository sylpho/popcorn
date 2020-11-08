import React from "react";
import fs    from "fs";
import path  from "path";

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
	 */
	public constructor(pathName: string, nodeType: number) {
		this.pathName = pathName;
		this.nodeType = nodeType;
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
	private constructor(rootPath: string) {
		this.rootNode = FileHierarchy.loadDirectory(rootPath);
	}

	/**
	 * Creates a hierarchy from the given root.
	 * @param rootPath The root path of the hierarchy to load.
	 */
	public static loadFrom(rootPath: string) : FileHierarchy {
		return new FileHierarchy(rootPath);
	}

	/**
	 * Loads the given directory into a file hierarchy node.
	 * @param dirPath The path of the directory to load.
	 */
	private static loadDirectory(dirPath: string) : FileHierarchyNode {
		let   node     = new FileHierarchyNode(dirPath, BRANCH_NODE);
		const wnd      = window as any;
		wnd.fs.listFiles(dirPath).then((entries: fs.Dirent[]) => {
			// List each directory entry.
			entries.forEach((ent: fs.Dirent) => {
				// Check what type of directory entry this is.
				if (ent.isDirectory()) {
					// Another directory.
					const root   : string            = path.join(dirPath, ent.name);
					const branch : FileHierarchyNode = this.loadDirectory(root);
					node.childNodes.push(branch);
				} else if (ent.isFile()) {
					// File.
					const leaf : FileHierarchyNode = new FileHierarchyNode(ent.name, LEAF_NODE);
					node.childNodes.push(leaf);
				}
			});
		});

		return node;
	}
}

/**
 * Represents the folder view panel.
 */
class FolderViewPanel extends React.Component {
	/**
	 * The hierarchy that is loaded at any time.
	 */
	private hierarchy: FileHierarchy;

	/**
	 * Loads the hierarchy at the given path.
	 * @param rootPath The root path of the hierarchy.
	 */
	public loadHierarchy(rootPath: string) : void {
		this.hierarchy = undefined; // Clear hierarchy first.
		this.hierarchy = FileHierarchy.loadFrom(rootPath);
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
