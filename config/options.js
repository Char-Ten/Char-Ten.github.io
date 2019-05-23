const path = require("path")
module.exports = {
	context:path.join(__dirname,'../src'),
	outputPath:path.join(__dirname,'..'),
	js:{
		filename: 'lib/scripts/[name].[hash:5].js',
		chunkFilename: 'lib/srcipts/chunk.[name].[hash:5].js',
	},
	css:{
		filename: 'lib/styles/[name].[hash:5].css',
		chunkFilename: 'lib/styles/chunk.[name].[hash:5].css',
	},
	assets:{
		html:'[name].html',
		imgs(file){
			
		},
	}
}