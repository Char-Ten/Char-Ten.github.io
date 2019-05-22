const commonConfig = require("./common.config")({});
const path= require("path")
module.exports = Object.assign({},commonConfig,{
    devServer:{
		contentBase: path.join(__dirname, ".."),
        port:3002,
        host:'0.0.0.0',
        hot:true,
    }
});
