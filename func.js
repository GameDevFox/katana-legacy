import _ from "lodash";

export function noop() {}

export function fo(func) {
	_.merge(func, {
		$out: noop,
		out: function(input) {
			if(arguments.length !== 0) {
				func.$out = input;
				return input;
			} else
				return func.$out;
		}
	});
	return func;
}

export function getArgs(func) {
	var funcStr = func.toString();
	var openParenIdx = funcStr.indexOf("(");
	var closeParanIdx = funcStr.indexOf(")");
	var argStr = funcStr.substring(openParenIdx+1, closeParanIdx);
	return _.remove(argStr.split(/[\s,]+/));
}
