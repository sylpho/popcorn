// HACK! Gets rid of the missing property error
var wnd = window as any;
const filePath : string = wnd.fs.configPath;

let config;

export namespace Config {
	export function fetch() {
		return new Promise((resolve, reject) => {
			if (typeof config == "undefined") {
				wnd.fs.read(filePath, (err, data) => {
					if (err) reject(err);
					else {
						config = JSON.parse(data.toString());
						resolve(config);
					}
				});
			} else resolve(config);
		});
	}

	export function commit(conf) {
		return new Promise((resolve, reject) => {
			wnd.fs.write(filePath, JSON.stringify(conf), (err) => {
				if (err) reject(err);
				else {
					config = conf;
					resolve();
				}
			});
		});
	}
}
