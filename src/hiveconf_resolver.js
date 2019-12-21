const vscode = require('vscode');
const resolve = require('./resolver')

// const regexes = require('./utils/regexes')
const stringutils = require('./utils/stringutils')
const name_validator = require('./utils/validators')

const regexes = {
    set_syntax : /SET\s+(.*?)\s*=\s*(.*)/sigm,
    var_def : /\$\{hiveconf:(.*?)\}/g
}

function hiveconf_resolver(text) {
    return {
        'vars' : get_required_conf(text),
        'value_map' : get_value_map(text)
    }
}

function get_required_conf(text) {
    const conf_regex = regexes.var_def;
    conf_regex.lastIndex = 0;
    var varAndConf = [];
    var matched;
    while (matched = conf_regex.exec(text)) {
        if (matched.length !== 2) {
            throw text + ' is invalid syntax'
        }
        varAndConf.push([matched[0], matched[1]]);
    }
    return varAndConf;
}

function get_value_map(text) {
    const var_regex = regexes.set_syntax;
    const lines = text.split(';');
    var result = {};
    var i, line, extracted;
    
    for (i = 0; i < lines.length; i += 1) {
        line = stringutils.remove_comment(lines[i]).trim();
        
        var_regex.lastIndex = 0;
        extracted = var_regex.exec(line);
        if (extracted) {
            if (!name_validator.validate_name(extracted[1])) {
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

module.exports = hiveconf_resolver;