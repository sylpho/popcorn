const path = require('path');

module.exports = {
  entry: './src/index.tsx',
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
