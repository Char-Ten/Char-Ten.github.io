const commonConfig = require("./common.config")({'production':1});
const path = require("path");
const rmDir = require("../scripts/utils/rmDir");
rmDir(path.join(__dirname,"../lib"))
module.exports = commonConfig
