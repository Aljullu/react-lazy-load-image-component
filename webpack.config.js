const webpack = require('webpack');
const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js',
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.jsx?$/,
				loaders: ['eslint-loader'],
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules|bower_components|build)/,
			},
			{
				test: /\.jsx?$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules|bower_components|build)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env'],
					},
				},
			},
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader'],
				exclude: /node_modules/,
			},
		],
	},
	externals: {
		react: 'commonjs react',
		'react-dom': 'commonjs react-dom',
	},
};
