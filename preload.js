const { remote } = require("electron");
const { app, dialog } = remote;
const customTitlebar = require("custom-electron-titlebar");

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
	read: fs.readFile,
	listFiles: (dir) => {
		return new Promise((resolve, reject) => {
			fs.readdir(dir, function (err, files) {
				if (err) reject(err)
				else resolve(files);
			});
		});
	}
};

window.electron = {
	application: app,
	screen: remote.screen,
	browserWindow: remote.BrowserWindow.getFocusedWindow()
};

window.menu = {
	openFile: dialog.showOpenDialog
};

window.addEventListener("DOMContentLoaded", () => {
	window.titlebar = new customTitlebar.Titlebar({
		backgroundColor: customTitlebar.Color.fromHex("#F0F0F044")
	});

	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);
		if (element)
			element.innerText = text;
	};

	for (const type of ["chrome", "node", "electron"])
		replaceText(`${type}-version`, process.versions[type]);
});
