const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const entries = require('./entries');
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const moduleCssLoader = {
	loader: 'css-loader',
	options: {
		modules: true
	}
};
module.exports = function(env) {
	const styleLoader = env.production
		? MiniCssExtractPlugin.loader
		: 'style-loader';
	return {
		mode: env.production ? 'production' : 'development',
		context: path.join(__dirname, '../'),
		entry: entries.entries,
		output: {
			pathinfo: false,
			path: path.join(__dirname, '../'),
			filename: 'lib/scripts/[name].[hash:5].js',
			chunkFilename: 'lib/srcipts/chunk.[name].[hash:5].js',
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						name: 'commons',
						chunks: 'initial',
						minChunks: 2
					}
				}
			}
		},
		resolve: {
			alias: {
				src: path.join(__dirname, '../src')
			},
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					include: path.join(__dirname, '../src'),
					use: 'babel-loader'
				},
				{
					test: /\.ts$/,
					include: path.join(__dirname, '../src'),
					use: 'babel-loader'
				},
				{
					test: cssRegex,
					include: path.join(__dirname, '../src'),
					exclude: cssModuleRegex,
					use: [styleLoader, 'css-loader', 'postcss-loader']
				},
				{
					test: lessRegex,
					include: path.join(__dirname, '../src'),
					exclude: lessModuleRegex,
					use: [
						styleLoader,
						'css-loader',
						'postcss-loader',
						'less-loader'
					]
				},
				{
					test: cssModuleRegex,
					include: path.join(__dirname, '../src'),
					use: [styleLoader, moduleCssLoader, 'postcss-loader']
				},
				{
					test: lessModuleRegex,
					include: path.join(__dirname, '../src'),
					use: [
						styleLoader,
						moduleCssLoader,
						'postcss-loader',
						'less-loader'
					]
				},
				{
					test: /\.(jpe?g|png|svg|bmp|gif)$/,
					include: path.join(__dirname, '../src'),
					use: {
						loader: 'url-loader',
						options: {
							limit: 5000,
							name(file){
								return '/index/[name].[ext]'
							}
						}
					}
				},
			]
		},
		plugins: [
			...entries.htmlPlugin,
			new webpack.DefinePlugin({
				'module.IS_DEV': !env.production,
				'module.IS_PROD': env.production,
				'module.IS_RENDER': env.render
			}),
			new ForkTsCheckerWebpackPlugin(),
			!env.production && new webpack.HotModuleReplacementPlugin(),
			env.production &&
				new MiniCssExtractPlugin({
					filename: 'styles/[name].[contenthash:8].css',
					chunkFilename: 'styles/[name].[contenthash:8].chunk.css'
				})
		]
			.filter(Boolean),
		devtool: env.production?'none':'cheap-eval-source-map'
	};
};
