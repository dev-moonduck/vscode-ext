const vscode = require('vscode');

const resolvers = {
    'hive' : require('./hiveconf_resolver')
}

function write_result(editor, resolved_query) {
    editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, resolved_query);
    });
}

function run(editor, edit, resolver_type) {
    //var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }
    try {
        write_result(
            editor,
            run_resolver(get_query(editor), resolvers[resolver_type])
        )
    } catch(msg) {
        vscode.window.showInformationMessage(msg);
    }
}

function get_query(editor) {
    return editor.document.getText(editor.selection);
}

function run_resolver(query, query_resolver) {    
    var result = query_resolver.apply(query_resolver, [query])

    var required_vars = result['vars']
    var value_map = result['value_map']
    var missings;
    
    missings = get_missing_var(value_map, required_vars);
    
    if (missings.length) {
        throw "Not defined vars : " + missings.join(", ");
    }
    
    return resolve(query, value_map, required_vars);
}

function get_missing_var(var_map, required_vars) {
    var i;
    var missings = [];
    for (i = 0; i < required_vars.length; i += 1) {
        if (!var_map[required_vars[i][1]]) {
            missings.push(required_vars[i][1]);
        }
    }
    return missings;
}

function resolve(text, var_map, required_vars) {
    var result = text;
    var i;

    for (i = 0; i < required_vars.length; i += 1) {
        result = result.replace(required_vars[i][0], var_map[required_vars[i][1]], 'g');
    }
    
    return result;
}

function wrapper(resolver_type) {
    return function(editor, edit) {
        run(editor, edit, resolver_type)
    }
}

module.exports = {
    'hive' : wrapper('hive')
}