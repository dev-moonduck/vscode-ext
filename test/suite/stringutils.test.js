const assert = require('assert');
const { before } = require('mocha');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const stringutils = require('../../src/utils/stringutils');

suite('All functions in stringutils test', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	test('remove_comment should remove sql type comment', () => {
		var query = "NOT comment--This is comment"
		var expected = "NOT comment"
		assert.equal(stringutils.remove_comment(query), expected)
	});

	test('remove_comment should remove sql type comment. It should NOT trim', () => {
		var query = " NOT comment --This is comment "
		var expected = " NOT comment "
		assert.equal(stringutils.remove_comment(query), expected)
	});

	//TODO: Make this test pass
	// test('remove_comment should ignore sql type comment inside quote', () => {
	// 	var query = "Not comment '--This is also NOT comment ' '--but this is comment because it is not wrapped by quote"
	// 	var expected = "Not comment '--This is also NOT comment '"
	// 	assert.equal(stringutils.remove_comment(query), expected)
	// });
	
	test('remove_comment should remove sql type comment in all line', () => {
		var query = "--This is comment\n--This is also comment\n--This is also comment"
		var expected = "\n\n"
		assert.equal(stringutils.remove_comment(query), expected)
	});

	test('remove_comment should remove sql type comment in all line except query in the middle of comment line', () => {
		var query = "--This is comment\nThis is NOT comment\n--This is also comment"
		var expected = "\nThis is NOT comment\n"
		assert.equal(stringutils.remove_comment(query), expected)
	});

	test('remove_comment should remove c type comment', () => {
		var query = "NOT comment/*This is comment*/"
		var expected = "NOT comment"
		assert.equal(stringutils.remove_comment(query), expected)
	});

	test('remove_comment should remove c type comment. It should NOT trim', () => {
		var query = " NOT comment /*This is comment */"
		var expected = " NOT comment "
		assert.equal(stringutils.remove_comment(query), expected)
	});

	//TODO: Make this test pass
	// test('remove_comment should ignore c type comment inside quote', () => {
	// 	var query = "Not comment '/*This is also NOT comment */' '/*but this is comment because it is not wrapped by quote*/"
	// 	var expected = "Not comment '/*This is also NOT comment */' "
	// 	assert.equal(stringutils.remove_comment(query), expected)
	// });

	test('remove_comment should remove c type comment in all line', () => {
		var query = "/*This is comment\nThis is also comment\nThis is also comment*/"
		var expected = ""
		assert.equal(stringutils.remove_comment(query), expected)
	});

	test('remove_comment should remove c type comment in all line except query in the middle of comment line', () => {
		var query = "/*This is comment*/\nThis is NOT comment\n/*This is also comment*/"
		var expected = "\nThis is NOT comment\n"
		assert.equal(stringutils.remove_comment(query), expected)
	});

	test('remove_comment should not remove c type comment if it is not closed', () => {
		var query = "/*This is not closed"
		var expected = "/*This is not closed"
		assert.equal(stringutils.remove_comment(query), expected)
	});

	test('remove_comment should not remove c type comment if it is not opened', () => {
		var query = "This is not opened*/"
		var expected = "This is not opened*/"
		assert.equal(stringutils.remove_comment(query), expected)
	});
});
