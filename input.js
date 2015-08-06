import _ from "lodash";
import { split } from "./pipes";

var buildWASDKeys = function(upKey, downKey, leftKey, rightKey) {
	return {
		up: upKey,
		down: downKey,
		left: leftKey,
		right: rightKey
	};
};

var buildWASD = function(keyboard, keys) {
	var wasd = _.mapValues(keys, function(value) {
		var key = keyboard.getKey(value);
		key.preventDefault = true;
		return split(key);
	});
	return wasd;
};

var WASD = buildWASDKeys("w", "s", "a", "d");
var IJKL = buildWASDKeys("i", "k", "j", "l");
var UDLR = buildWASDKeys("up", "down", "left", "right");

export default {
	buildWASDKeys,
	buildWASD,
	WASD,
	IJKL,
	UDLR
};
