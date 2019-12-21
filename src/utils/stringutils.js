const regexes = {
    //--comment but ignore if it is in quote
    hiveql_one_line_comment : /(?<=^([^']|'[^']*')*)--.*/g,
    
    //c style comment(/* */) but ignore if it is in quote
    c_comment : /(?<=^([^']|'[^']*')*)\/\*(\*(?!\/)|[^*])*\*\//g
}

function remove_comment(line) {
    return line
        .replace(regexes.c_comment, '')
        .replace(regexes.hiveql_one_line_comment, '').trim()
}

module.exports = {
    remove_comment: remove_comment
}