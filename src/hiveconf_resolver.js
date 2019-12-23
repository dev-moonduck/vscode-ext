const stringutils = require('./utils/stringutils')
const name_validator = require('./utils/validators')

const Resolver = require('./resolver')
const autoBind = require('auto-bind');

const regexes = {
    set_syntax : /SET\s+(.*?)\s*=\s*(.*)/sigm, //e.g) SET var_name = value
    var_def : /\$\{hiveconf:(.*?)\}/g //e.g) ${hiveconf:var_name}
}

class HiveconfResolver extends Resolver {
    constructor() {
        super()
        autoBind(this)
    }

    collect_vars(query) {
        return {
            'vars' : this.get_required_conf(query),
            'value_map' : this.get_value_map(query)
        }
    }

    get_required_conf(query) {
        const conf_regex = regexes.var_def;
        conf_regex.lastIndex = 0; //Intenally, Regex change lastIndex every exec, So It should be initialized 
        var varAndConf = [];
        var matched;
        while (matched = conf_regex.exec(query)) {
            if (matched.length !== 2) {
                throw query + ' is invalid syntax'
            }
            varAndConf.push([matched[0], matched[1]]);
        }
        return varAndConf;
    }

    get_value_map(query) {
        const var_regex = regexes.set_syntax;
        const lines = query.split(';');
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
}

module.exports = HiveconfResolver;