const childProcess = require("child_process");
module.exports=function(target=""){
	let command = `rm -rf "${target}"`
	if(process.platform==='win32'){
		command = `rd /s /q "${target}"`
	}
	childProcess.execSync(command);
}