import _ from "lodash";
import * as func from "./func";

export function pipe() {
	var result = func.fo(function pipeFn() {
		pipeFn.$out.apply(this, arguments);
	});
	return result;
}

export function buildValve() {
	var isOpen = 0;

	var valve = func.fo(function valveFn() {
		if(isOpen) {
			valveFn.$out.apply(this, arguments);
		}
	});
	valve.open = function(open) {
			isOpen = open;
	};
	valve.type = "valve";
	return valve;
}

export function valve(input, output) {
	var result = buildValve();
	input.out(result);
	result.out(output);
	return result.open;
}

export function chain() {
	if(arguments.length < 2)
		throw new Error("Must have more than two nodes to wrap");

	var firstNode = _(arguments).shift();
	var result = function() {
		firstNode.apply(this, arguments);
	};

	var prevNode = firstNode;
	_.each(arguments, function(node) {
		prevNode.out(node);
		prevNode = node;
	});
	result.out = prevNode.out;

	result.type = "chain";
	return result;
}

export function buildSplit() {

	var outputs = [];
	outputs.remove = function() {
		_.each(arguments, function(node) {
			var index = outputs.indexOf(node);
			if(index == -1)
				throw new Error("Can't remove node, not found");

			outputs.splice(index, 1);
		});
	};

	var split = func.fo(function() {
		var splitArgs = arguments;
		_.each(outputs, function(output) {
			output.apply(this, splitArgs);
		});
	});
	split.out = function(input) {
		if(input === undefined)
			return outputs;
		else {
			if(typeof input != "object")
				input = [input];
			_.each(input, function(output) {
				outputs.push(output);
			});
		}
	};
	split.type = "split";
	return split;
}

export function split(node) {
	var result = buildSplit();
	return chain(node, result);
}

export function buildMerge(defaults, mergeFunc, asArray) {

	var merge = function() {
		var data = _.clone(defaults);
		var inputs = asArray ? [] : {};

		var target = func.fo(function targetFn(outMap) {
			if(arguments.length === 0)
				return inputs;
			else {
				autoPipe(outMap, targetFn);
				return targetFn;
			}
		});

		var push = function() {
			var value = mergeFunc.apply(this, data);
			target.$out(value);
		};
		var args = func.getArgs(mergeFunc);
		_.each(args, function(arg, index) {
			var key = asArray ? index : arg;
			inputs[key] = function(value) {
				data[index] = value;
				push();
			};
			//target[key] = inputs[key];
		});

		return target;
	};
	merge.type = "merge";
	return merge;
}

var buildMergeArray = _.bind(buildMerge, this, _, _, true);
export { buildMergeArray };

export function pump(input) {
	var result = func.fo(function pumpFn() {
		var output = input();
		pumpFn.$out(output);
	});
	result.type = "pump";
	return result;
}

export function plus(plusValue) {
	var result = func.fo(function plusFn(value) {
		var output = value + plusValue;
		plusFn.$out(output);
	});
	result.type = "plus";
	return result;
}

export function buildInvert() {
	var result = func.fo(function invertFn(value) {
		invertFn.$out(-value);
	});
	result.type = "invert";
	return result;
}

export function invert(node) {
	var result = buildInvert();
	return chain(node, result);
}

export function delta() {
	var lastValue = 0;
	var result = func.fo(function deltaFn(value) {
		var deltaValue = value - lastValue;
		lastValue = value;
		deltaFn.$out(deltaValue);
	});
	result.type = "delta";
	return result;
}

export function buildMultiply(magValue) {

	var mag = arguments.length === 0 ? 1 : magValue;

	var multiply = func.fo(function(value) {
		var output = value * mag;
		multiply.$out(output);
	});
	multiply.multiplier = function(value) {
		mag = value;
	};

	multiply.type = "multiply";
	return multiply;
}

export function multiply(node) {
	var result = buildMultiply();
	chain(node, result);
	return result.magnitude;
}

export function buildIncr(point) {
	var incr = function(value) {
		var result = point() + value;
		point(result);
	};
	incr.type = "incr";
	return incr;
}

export function autoPipe(output, input) {
	var inputNodes = input;
	if(typeof input == "function")
		inputNodes = input();

	_.each(output, function(value, key) {
		var inVal = inputNodes[key];
		if(inVal !== undefined)
			value.out(inVal);
	});
	return input;
}

export function group(obj) {
	var result = function(outMap) {
		if(arguments.length === 0)
			return obj;
		else {
			return autoPipe(outMap, obj);
		}
	};
	result.out = function(inMap) {
		if(arguments.length === 0)
			return obj;
		else {
			return autoPipe(obj, inMap);
		}
	};
	result.sub = function(property) {
		return _.pluck(obj, property);
	};
	result.type = "group";
	return result;
}

var buildCompare = buildMergeArray([0, 0], function(a, b) {
	if(a == b)
		return 0;
	else
		return a < b ? -1 : 1;
});
export { buildCompare };

export function compare(a, b) {
	var result = buildCompare();
	result([a, b]);
	result.type = "compare";
	return result;
}

export function mapGroup(objs, func) {
	var mapFunc = _.isArray(objs) ? _.map : _.mapValues;
	var result = mapFunc(objs, func);
	result = group(result);
	return result;
}

///////////
// Extra //
///////////

var buildXY2Point = buildMergeArray([0, 0], function(x, y) {
	return [x, y];
});
export { buildXY2Point };

// mapAndPipeGroup ???
export function all(grp, nodeBuilder) {
	var result = _.mapValues(grp.out(), function(value, key) {
		var node = nodeBuilder();
		return chain(value, node);
	});
	result = group(result);
	result.type = "all";
	return result;
}
