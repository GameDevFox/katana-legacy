var pipes = require("./pipes");

var element = {};

var getCssPoint = function(elem, cssName) {
	var result = function(value) {
		if(arguments.length == 0)
			return elem.css(cssName);

		elem.css(cssName, value);
	};
	return result;
};
element.getCssPoint = getCssPoint;

var getCssPixelPoint = function(elem, cssName) {
	var result = function(value) {
		if(arguments.length == 0) {
			var rawValue = elem.css(cssName);
			var valueStr = rawValue.substring(0, rawValue.length-2);
			return parseFloat(valueStr);
		}

		elem.css(cssName, value+"px");
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

	var result = pipes.mapGroup(posPoint, function(value) {
		return pipes.buildIncr(value);
	});
	return result;
};
element.getMovePoint = getMovePoint;

var buildElementBuilder = function(elementData) {
	var elementBuilder = function(id, data) {
		var markup = elementData[id];
		if(markup == null)
			throw "Element id: "+id+" doesn't exist";

		var el = $(markup);
		el.addClass(id);

		if(data != null) {
			el = new Vue({
				el: el.get(0),
				data: data
			});
		}
		return el;

	};
	return elementBuilder;
};
element.buildElementBuilder = buildElementBuilder;

module.exports = element;
