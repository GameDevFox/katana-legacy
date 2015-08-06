export function loadGlobally(module) {
	for(var i in module) {
		global[i] = module[i];
	}
}
