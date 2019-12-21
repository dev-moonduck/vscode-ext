const assert = require('assert');
const { before } = require('mocha');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const hiveconf_resolver = require('../../src/hiveconf_resolver');

suite('All functions in hiveconf_resolver test', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	test('right query statement should be resolved', () => {
		var query = `
			set name_a=1;
			select \${hiveconf:name_a} from my_table
		`;
		var expected = {
			'vars' : [['${hiveconf:name_a}', 'name_a']],
			'value_map' : {
				'name_a' : '1'
			}
		};
		var actual = hiveconf_resolver.apply(hiveconf_resolver, [query])
		
		assert.deepStrictEqual(actual, expected, JSON.stringify(actual) + "///" + JSON.stringify(expected))
	});

	test('should ignore all comments', () => {
		var query = `
			-----This is oneline comment-------
			set name_a='Hi a! --this is not comment';
			/*
				this is multiline comment.
				can you ignore me?
			*/
			set name_b='Hi b! /*this is not comment*/';
			--last comment
			select \${hiveconf:name_a}, \${hiveconf:name_b} from my_table
		`;
		var expected = {
			'vars' : [['${hiveconf:name_a}', 'name_a'], ['${hiveconf:name_b}', 'name_b']],
			'value_map' : {
				'name_a' : `'Hi a! --this is not comment'`,
				'name_b' : `'Hi b! /*this is not comment*/'`
			}
		};
		var actual = hiveconf_resolver.apply(hiveconf_resolver, [query])
		assert.deepStrictEqual(actual, expected, actual)
	});

	test('should resolve statement even though there are more declaration than needed', () => {
		var query = `
			set name_a='a';
			set name_b='b';
			select \${hiveconf:name_a} from my_table
		`;
		var expected = {
			'vars' : [['${hiveconf:name_a}', 'name_a']],
			'value_map' : {
				'name_a' : `'a'`,
				'name_b' : `'b'`
			}
		};
		var actual = hiveconf_resolver.apply(hiveconf_resolver, [query])
		assert.deepStrictEqual(actual, expected, actual)
	});

	test('should throw error if the statement has wrong var name', () => {
		var query = `
			set #wrong_name='Hi! I am wrong'
			select \${hiveconf:#wrong_name} from my_table
		`;
		assert.throws(() => {
			hiveconf_resolver.apply(hiveconf_resolver, [query])
		})
	});
});
