const vscode = require('vscode');

const regexes = {
    set_syntax : /SET\s+(.*?)\s*=\s*(.*)/igm,
    hiveconf : /\$\{hiveconf:(.*?)\}/g,
    var_name : /[a-zA-Z_$][0-9a-z_$]/
}

function hiveconf_resolver(textEditor, edit, args) {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    var selection = editor.selection;
    var text = editor.document.getText(selection);
    var required_vars = get_required_conf(text);
    var var_map, missings, resolved;
    try {
        var_map = get_vars(text);
        missings = get_missing_var(var_map, required_vars);

        if (missings.length) {
            throw "Not defined vars : " + missings.join(", ");
        }
    
        resolved = resolve(text, var_map, required_vars);
        
        textEditor.edit(editBuilder => {
            editBuilder.replace(selection, resolved);
        });
    } catch(msg) {
        vscode.window.showInformationMessage(msg);
    }
}

//return var name with conf array (i.e : [['myVar', '${hiveconf:myVar}'], ...])
function get_required_conf(text) {
    const conf_regex = regexes.hiveconf;
    var varAndConf = [];
    var matched;
    while (matched = conf_regex.exec(text)) {
        varAndConf.push(matched);
    }
    return varAndConf;
}

function get_vars(text) {
    const var_regex = regexes.set_syntax
    const lines = text.split(';');
    var result = {};
    var matched, i, line, extracted;
    for (i = 0; i < lines.length; i += 1) {
        line = lines[i];
        
        var_regex.lastIndex = 0;
        extracted = var_regex.exec(line);
        if (extracted) {
            if (!validate_name(extracted[1])) {
                throw extracted[1] + ' is not valid name';
            }
            if (result[extracted[1]]) {
                throw 'You defined "' + extracted[1] + ' multiple times';
            }
        
            result[extracted[1]] = extracted[2];
            if (line.replace(extracted[0], '').trim() != '') {
                throw 'Your SET syntax is not valid. Check the query around "SET ' + extracted[1] + '"';
            }
        }
    }
    return result;
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

function validate_name(var_name) {
    var result = regexes.var_name.test(var_name);
    return result
}

module.exports = hiveconf_resolver;