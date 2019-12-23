const assert = require('assert');
const { before } = require('mocha');
const autoBind = require('auto-bind');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const Resolver = require('../../src/resolver');

suite('All functions in resolver test', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	test('should return variable array when it does not have values correspond to declared variable', () => {
		var resolver = new Resolver();
		var expected = ['a', 'b'];
		assert.deepStrictEqual(resolver.get_missing_var({}, [
			['${hiveconf:a}', 'a'], ['${hiveconf:b}', 'b']
		]), expected);
	});

	test('should throw if it does not have values correspond to declared variables', () => {
		class MockResolver extends Resolver {
			constructor() {
				super();
				autoBind(this);
			}
			collect_vars(query) {
				return {
					'vars' : [['${hiveconf:a}', 'a'], ['${hiveconf:b}', 'b']],
					'value_map' : {}
				}
			}
		}
		assert.throws(() => {
			new MockResolver().resolve('select ${hiveconf:c}');
		});
	})

	test('should replace all query by given value map', () => {
		var query = 'select ${hiveconf:a}, ${hiveconf:b}';
		var var_map = {'a' : '1', 'b' : '2'};
		var required_vars = [['${hiveconf:a}', 'a'], ['${hiveconf:b}', 'b']];

		var expected = 'select 1, 2';
		assert.equal(new Resolver().replace_all(query, var_map, required_vars), expected)
	});
});
