const test = require('node:test');
const assert = require('node:assert/strict');

const { createWorkspace } = require('./workspace.js');

test('createWorkspace uses trimmed custom name', () => {
	const workspace = createWorkspace('  Team Alpha  ', () => 123456);

	assert.deepEqual(workspace, {
		id: '123456',
		name: 'Team Alpha',
		nodes: []
	});
});

test('createWorkspace falls back to default name for blank input', () => {
	const workspace = createWorkspace('   ', () => 7890);

	assert.deepEqual(workspace, {
		id: '7890',
		name: 'NEW_WORKSPACE',
		nodes: []
	});
});
