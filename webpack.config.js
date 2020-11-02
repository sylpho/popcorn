const path = require('path');

module.exports = {
	devtool: 'source-map',
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.json']
	},
	entry: './src/index.tsx',
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist/js/'),
		filename: 'popcorn.bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.m?tsx$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							"@babel/preset-react",
							"@babel/preset-typescript",
							"@babel/preset-env"
						]
					}
				}
			}
		]
	}
};
