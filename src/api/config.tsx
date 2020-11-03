const filePath : string = window.fs.configPath;

let config;

export namespace Config {
	export function fetch() {
		return new Promise((resolve, reject) => {
			if (typeof config == "undefined") {
				console.log('loading config');
				window.fs.read(filePath, (err, data) => {
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
			window.fs.write(filePath, JSON.stringify(conf), (err) => {
				if (err) reject(err);
				else {
					config = conf;
					resolve();
				}
			});
		});
	}
}
