import pipes from "./pipes";
import not$ from "./not-jquery";

import Vue from "vue";

var element = {};

var getCssPoint = function(elem, cssName) {
	var result = function(value) {
		if(arguments.length === 0)
			return not$.css(elem, cssName);

		not$.css(elem, cssName, value);
	};
	return result;
};
element.getCssPoint = getCssPoint;

var getCssPixelPoint = function(elem, cssName) {
	var result = function(value) {
		if(arguments.length === 0) {
			var rawValue = not$.css(elem, cssName);
			var valueStr = rawValue.substring(0, rawValue.length-2);
			return parseFloat(valueStr);
		}

		not$.css(elem, cssName, value+"px");
	};
	return result;
};
element.getCssPixelPoint = getCssPixelPoint;

var getPosPoint = function(elem) {
	var result = [
		getCssPixelPoint(elem, "left"),
		getCssPixelPoint(elem, "top")
	];
	return result;
};
element.getPosPoint = getPosPoint;

var getMovePoint = function(elem) {
	var posPoint = getPosPoint(elem);

	var result = pipes.mapGroup(posPoint, function(point) {
		return pipes.buildIncr(point);
	});
	return result;
};
element.getMovePoint = getMovePoint;

var buildElementBuilder = function(elementData) {
	var elementBuilder = function(id, data) {
		var markup = elementData[id];
		if(!markup)
			throw "Element id: "+id+" doesn't exist";

		var el = not$.parseHtml(markup)[0];
		el.classList.add(id);

		if(data !== undefined) {
			el = new Vue({
				el: el,
				data: data
			});
		}
		return el;

	};
	return elementBuilder;
};
element.buildElementBuilder = buildElementBuilder;

export default element;
