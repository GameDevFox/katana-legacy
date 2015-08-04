var ready = function() {
	return new Promise(function(resolve, reject) {
		if(document.readyState != "loading")
			resolve();
		else
			document.addEventListener("DOMContentLoaded", resolve);
	});
};

var ajax = function(url, method) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();
		request.open(method, url, true);
		request.onload = function() {
			if(request.status >= 200 && request.status < 400)
				resolve(request.responseText);
			else
				reject(Error(req.statusText));
		};
		request.onerror = function() {
			reject(Error("Network error"));
		};
		request.send();
	});
};

var ajaxGet = function(url) {
	return ajax(url, "GET");
};

var ajaxGetJson = function(url) {
	return ajaxGet(url).then(JSON.parse);
};

var parseHtml = function(html) {
	var doc = document.implementation.createHTMLDocument();
	doc.body.innerHTML = html;
	return doc.body.children;
};

var css = function(element, ruleName, value) {
	if(value === undefined) {
		return getComputedStyle(element)[ruleName];
	} else {
		return (element.style[ruleName] = value);
	}
};

var find = function(selector) {
	return document.querySelectorAll(selector);
};

module.exports = {
	ready: ready,
	ajaxGetJson: ajaxGetJson,
	css: css,
	find: find,
	parseHtml: parseHtml
};
