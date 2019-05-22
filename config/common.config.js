const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const entries = require('./entries')
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const moduleCssLoader = {
	loader: "css-loader",
	options: {
		modules: true
	}
};
module.exports = function(env) {
	const styleLoader = env.production
		? MiniCssExtractPlugin.loader
		: "style-loader";
	return {
		mode: env.production ? "production" : "development",
		context: path.join(__dirname, "../src"),
		entry: entries.entries,
		output: {
			path: path.join(__dirname, "../lib"),
            filename: "scripts/[name].[hash:5].js",
            chunkFilename:"srcipts/chunk.[name].[hash:5].js",
			publicPath: "."
		},
		resolve: {
			alias: {
				src: path.join(__dirname, "src")
			},
			extensions: [".ts", ".js", ".json"]
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: "babel-loader"
				},
				{
					test: /\.ts$/,
					use: ["babel-loader", "ts-loader"]
				},
				{
					test: cssRegex,
					exclude: cssModuleRegex,
					use: [styleLoader, "css-loader", "postcss-loader"]
				},
				{
					test: lessRegex,
					exclude: lessModuleRegex,
					use: [
						styleLoader,
						"css-loader",
						"postcss-loader",
						"less-loader"
					]
				},
				{
					test: cssModuleRegex,
					use: [styleLoader, moduleCssLoader, "postcss-loader"]
				},
				{
					test: lessRegex,
					use: [
						styleLoader,
						moduleCssLoader,
						"postcss-loader",
						"less-loader"
					]
				},
				{
					test: /\.(jpe?g|png|svg|bmp|gif)$/,
					use: {
						loader: "url-loader",
						options: {
							limit: 5000,
							name: "[path][name].[ext]"
						}
					}
				},
				{
					use: "file-loader"
				}
			]
		},
		plugins: [
            new webpack.DefinePlugin({
                "module.IS_DEV":!env.production,
                "module.IS_PROD":env.production,
                "module.IS_RENDER":env.render
            }),
			!env.production && new webpack.HotModuleReplacementPlugin(),
			env.production &&
				new MiniCssExtractPlugin({
					filename: "styles/[name].[contenthash:8].css",
					chunkFilename: "styles/[name].[contenthash:8].chunk.css"
				})
		].filter(Boolean).concat(entries.htmlPlugin)
	};
};
