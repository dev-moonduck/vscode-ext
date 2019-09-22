const vscode = require('vscode');

function run_resolve(editor, getter) {
    var selection = editor.selection;
    var text = editor.document.getText(selection);
    var required_vars = getter.var_extractor.apply(getter.var_extractor, [text]);
    var var_values = getter.value_extractor
    var missings, resolved, var_map;
    
    var_map = var_values.apply(var_values, [text])
    missings = get_missing_var(var_map, required_vars);
    
    if (missings.length) {
        throw "Not defined vars : " + missings.join(", ");
    }
    
    resolved = resolve(text, var_map, required_vars);
    
    editor.edit(editBuilder => {
        editBuilder.replace(selection, resolved);
    });
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

module.exports = run_resolve