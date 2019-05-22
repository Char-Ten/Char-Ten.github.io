const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const srcDir = path.join(__dirname,'../src');
const entriesDir = path.join(srcDir,'entries');
const children = fs.readdirSync(entriesDir);
const entries={};
const htmlPlugin=[];
children.forEach((item)=>{
    if(/\.[tj]sx?$/.test(item)){
        let name = item.replace(/\.[tj]sx?$/,'');
        entries[name]=`./entries/${item}`;
        htmlPlugin.push(new HtmlWebpackPlugin({
            filename:`${name}.html`,
            template:path.join(__dirname,'../tmp/template.html'),
            chunks:[name]
        }))
    }
});
module.exports ={
    entries,
    htmlPlugin
}