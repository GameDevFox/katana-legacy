export function out(value) {
	console.log(value);
};

export function labeledOut(label) {
	return function(value) {
		console.log(label+": "+value);
	};
};

export function time() {
	return new Date().getTime();
};
