var log = function(value) {
	console.log(value);
};

var labeledLog = function(label) {
	return function(value) {
		console.log(label+": "+value);
	};
};

var time = function() {
	return new Date().getTime();
};

export default { log, labeledLog, time };
