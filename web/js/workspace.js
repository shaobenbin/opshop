(function (root, factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory();
		return;
	}

	root.WorkspaceUtils = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
	function createWorkspace(nameInput, nowFn = Date.now, fallbackName = 'NEW_WORKSPACE') {
		const trimmedName = typeof nameInput === 'string' ? nameInput.trim() : '';

		return {
			id: String(nowFn()),
			name: trimmedName || fallbackName,
			nodes: []
		};
	}

	return {
		createWorkspace
	};
});
