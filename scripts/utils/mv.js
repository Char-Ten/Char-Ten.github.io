const childProcess = require("child_process");
module.exports=function(source="",target=""){
	let command = `mv -f "${source}" "${target}"`
	if(process.platform==='win32'){
		command = `move "${source}" "${target}"`
	}
	childProcess.execSync(command);
}