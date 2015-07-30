var loadGlobally = function(module) {
	for(var i in module) {
		global[i] = module[i];
	}
};

module.exports = { loadGlobally: loadGlobally };
