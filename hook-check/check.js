var process = require('child_process');
var fs = require('fs');
var gitExec;
var promiseList = [];
var modules = {
	'module-a': false,
	'module-b': false
};

gitExec = process.exec('git diff HEAD --name-only --diff-filter=ACMR', function(error, stdout, stderr) {
	if(error || stderr){
		process.exit(1);
	}else if(stdout) {
		stdout = stdout.replace(/\n/g, ',');
		Object.keys(modules).forEach(function(moduleName){
			if(stdout.indexOf(moduleName + '/') >= 0){
				modules[moduleName] = true;
				process.exec('cd ' + moduleName + ' && npm run check', function(error, stdout, stderr){
					console.info('***** Start to check' + moduleName + ' before commit ****');
					if(error || stderr){
						console.info('Failed for running check function for module ' + moduleName, error);
						process.exit(1);
					}else if(stdout){
						console.info('success! for running check function for module ', moduleName);
					}
				});
			}
		});
	}
});