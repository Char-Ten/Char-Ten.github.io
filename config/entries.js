const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const srcDir = path.join(__dirname,'../src');
const entriesDir = path.join(srcDir,'entries');
const children = fs.readdirSync(entriesDir);
const entries={};
const htmlPlugin=[];
children.forEach((item)=>{
    if(/\.tsx?$/.test(item)){
        let name = item.replace(/\.tsx?$/,'');
        entries[name]=`./entries/${item}`;
        htmlPlugin.push(new HtmlWebpackPlugin({
            filename:`${name}.html`,
            template:path.join(__dirname,'../tmp/template.html')
        }))
    }
});
module.exports ={
    entries,
    htmlPlugin
}