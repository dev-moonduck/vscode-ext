const assert = require('assert');
const { before } = require('mocha');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const validators = require('../../src/utils/validators');
const var_name_validator = validators.validate_name

suite('All functions in validators test', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	test('validate_name should validate name correctly', () => {
		var right_names = ["var_a", "Var_A", "_varA", "__va__", "vara", "VARA", "v1", "V1", "_1"]
		right_names.forEach((var_name, i, arr) => {
			assert.equal(var_name_validator.apply(var_name_validator, [var_name]), true, var_name + " should be allowed")
		})
	});

	test('validate_name should NOT allow these case', () => {
		var wrong_name = [
			"1a", //number cannot be first character of name 
			"1", 
			"-x", //contains special character
			"a#", 
			"a한글", //contains neither alphabet, number nor underscore
			"a c", " " //contains whitespace
		]
		wrong_name.forEach((var_name, i, arr) => {
			assert.equal(var_name_validator.apply(var_name_validator, [var_name]), false, var_name + " should NOT be allowed")
		})
	});
});
