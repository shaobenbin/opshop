const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..', '..');

test('NodeModal add provider button uses nodeProvider category', () => {
	const modalSource = fs.readFileSync(path.join(repoRoot, 'web/js/components/NodeModal.js'), 'utf8');

	assert.match(
		modalSource,
		/@click="promptNewItem\('nodeProvider'\)"/,
		'expected provider add button to create a nodeProvider item',
	);
});

test('index wires node-modal create-global-item to the root handler', () => {
	const indexSource = fs.readFileSync(path.join(repoRoot, 'web/index.html'), 'utf8');

	assert.match(
		indexSource,
		/<node-modal[\s\S]*@create-global-item="handleCreateGlobalItem"[\s\S]*<\/node-modal>/,
		'expected node-modal to emit create-global-item to handleCreateGlobalItem',
	);
});
