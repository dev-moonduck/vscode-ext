const regexes = {
    var_name : /^[a-zA-Z_]{1}[0-9a-zA-Z_]*$/
}

function validate_name(var_name) {
    var result = regexes.var_name.test(var_name);
    return result
}

module.exports = {
    validate_name : validate_name
}