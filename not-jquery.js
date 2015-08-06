export function ready() {
	return new Promise(function(resolve, reject) {
		if(document.readyState != "loading")
			resolve();
		else
			document.addEventListener("DOMContentLoaded", resolve);
	});
}

export function ajax(url, method) {
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
}

export function ajaxGet(url) {
	return ajax(url, "GET");
}

export function ajaxGetJson(url) {
	return ajaxGet(url).then(JSON.parse);
}

export function parseHtml(html) {
	var doc = document.implementation.createHTMLDocument();
	doc.body.innerHTML = html;
	return doc.body.children;
}

export function css(element, ruleName, value) {
	if(value === undefined) {
		return getComputedStyle(element)[ruleName];
	} else {
		return (element.style[ruleName] = value);
	}
}

export function find(selector) {
	return document.querySelectorAll(selector);
}
