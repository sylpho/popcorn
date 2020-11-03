import { app } from "electron"
import fs from "fs"
import path from "path"

const dataPath = app.getPath('userData');
const filePath = path.join(dataPath, 'config.json');

let config;

export namespace Config {
	export function fetch() {
		return new Promise((resolve, reject) => {
			if (typeof config == "undefined") {
				try {
					console.log('loading config');
					config = JSON.parse(fs.readFileSync(filePath).toString());
					resolve(config);
				} catch (error) {
					reject(error);
				}
			} else resolve(config);
		});
	}

	export function commit(conf) {
		return new Promise((resolve, reject) => {
			fs.writeFile(filePath, JSON.stringify(conf), (err) => {
				if (err) reject(err);
				else {
					config = conf;
					resolve();
				}
			});
		});
	}
}
