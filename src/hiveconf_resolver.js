const vscode = require('vscode');
const resolve = require('./resolver')

const regexes = {
    set_syntax : /SET\s+(.*?)\s*=\s*(.*)/igm,
    var_def : /\$\{hiveconf:(.*?)\}/g,
    var_name : /[a-zA-Z_$]{1}[0-9a-z_$]*/
}

function hiveconf_resolver(textEditor, edit, args) {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    try {
        resolve(editor, {
            var_extractor: get_required_conf,
            value_extractor: get_vars
        });
    } catch(msg) {
        vscode.window.showInformationMessage(msg);
    }
}

function get_required_conf(text) {
    const conf_regex = regexes.var_def;
    var varAndConf = [];
    var matched;
    while (matched = conf_regex.exec(text)) {
        varAndConf.push(matched);
    }
    return varAndConf;
}

function get_vars(text, required_vars) {
    const var_regex = regexes.set_syntax;
    const lines = text.split(';');
    var result = {};
    var i, line, extracted;
    
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

function validate_name(var_name) {
    var result = regexes.var_name.test(var_name);
    return result
}

module.exports = hiveconf_resolver;