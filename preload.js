const { remote } = require("electron");
const { app, dialog } = remote;

const path = require("path");
const fs = require("fs");

/*
	TODO:
	sandbox the read and write functions so they only have access
	to the userData folder, and the current working directory.
*/
window.fs = {
	configPath: path.join(app.getPath("userData"), 'config.json'),
	write: fs.writeFile,
	read: fs.readFile
};


window.menu = {
	openFile: dialog.showOpenDialog
};
