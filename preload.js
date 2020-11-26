const { remote } = require("electron");
const { app, dialog } = remote;
const customTitlebar = require("custom-electron-titlebar");

const path = require("path");
const fs = require("fs");
const { resolve } = require("dns");

/*
	TODO:
	sandbox the read and write functions so they only have access
	to the userData folder, and the current working directory.
*/
window.fs = {
	configPath: path.join(app.getPath("userData"), 'config.json'),
	write: fs.writeFile,
	read: fs.readFile,
	normalize: path.normalize,
	path: path,
	listFiles: async (dir) => {
		return new Promise((resolve, reject) => {
			fs.readdir(dir, { withFileTypes: true }, function (err, paths) {
				if (err) reject(err)
				else resolve(paths);
			});
		});
	},
	readBlock: (path, start, amount) => {
		return new Promise((resolve, reject) => {
			var stats = fs.statSync(path);
			var fileSizeInBytes = stats["size"];

			// ensure we arent reading passed the end
			if ((fileSizeInBytes - start) < amount)
				amount = fileSizeInBytes - start;

			// create read stream
			let totalLines = [];
			let lastLine = "";

			fs.createReadStream(path, {
				encoding: 'utf8',
				flag: 'r',
				start: start,
				end: start + amount
			}).on('data', (chunk) => {
				const chunkString = chunk.toString();

				// convert chunk to string and split at newlines
				let lines = chunkString.split(/\r?\n/);

				// add previous incomplete line to this
				lines[0] = lastLine + lines[0];

				// store last line
				lastLine = lines[lines.length - 1];

				// if last line is incomplete, remove it from lines
				if (lastLine[lastLine.length - 1] != '\n')
					lines.pop();

				// else, dont append it to our next read
				else lastLine = "";

				// add lines read to totalLines
				totalLines = totalLines.concat(lines);
			}).on('end', () => {
				let cl = 0;
				totalLines.forEach(line => cl += Buffer.byteLength(line, 'utf8'));
				console.log("Cl is " + cl);

				resolve(totalLines)
			}).on('error', reject);
		});
	},
	strBytes: (str) => {
		return Buffer.byteLength(str, 'utf8');
	},
	overwriteBlock: (start, end, lines, sourcePath) => {
		const dpath = sourcePath + "-cache.txt";
		const wstream = fs.createWriteStream(dpath);

		return new Promise((resolve, reject) => {
			if (start == 0) resolve();
			else {
				fs.createReadStream(sourcePath, {
					encoding: 'utf8',
					flag: 'r',
					start: 0,
					end: start
				}).on('data', (chunk) => {
					wstream.write(chunk.toString())
				}).on('end', () => {
					resolve();
				}).on('error', reject);
			}
		}).then(() => {
			lines.forEach(line => wstream.write(line + '\n'));
			return;
		}).then(() => {
			return new Promise((resolve, reject) => {
				console.log("end is " + end);
				fs.createReadStream(sourcePath, {
					encoding: 'utf8',
					flag: 'r',
					start: end
				}).on('data', (chunk) => {
					wstream.write(chunk.toString())
				}).on('end', () => {
					resolve();
				}).on('error', reject);
			});
		}).then(() => {
			return new Promise((resolve, reject) => {
				fs.copyFile(dpath, sourcePath, (err) => {
					if (err) reject(err);
					else resolve();
				});
			})
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
