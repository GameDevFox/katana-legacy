import _ from "lodash";

import pipes from "./pipes";

var input = {};

var buildWASDKeys = function(upKey, downKey, leftKey, rightKey) {
	return {
		up: upKey,
		down: downKey,
		left: leftKey,
		right: rightKey
	};
};

input.WASD = buildWASDKeys("w", "s", "a", "d");
input.IJKL = buildWASDKeys("i", "k", "j", "l");
input.UDLR = buildWASDKeys("up", "down", "left", "right");

var buildWASD = function(keyboard, keys) {
	var wasd = _.mapValues(keys, function(value) {
		var key = keyboard.getKey(value);
		key.preventDefault = true;
		return pipes.split(key);
	});
	return wasd;
};
input.buildWASD = buildWASD;

exports default input;
