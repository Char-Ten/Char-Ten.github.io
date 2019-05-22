const commonConfig = require("./common.config")({});
module.exports = Object.assign({},commonConfig,{
    devServer:{
        port:3000,
        host:'0.0.0.0',
        hot:true,
        publicPath:commonConfig.output.path
    }
});
