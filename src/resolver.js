const vscode = require('vscode');
const autoBind = require('auto-bind');

class Resolver {
    constructor() {
        autoBind(this)
    }

    run(editor, edit) {
        //var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }
        try {
            this.write_result(
                editor,
                this.resolve(this.get_query(editor))
            )
        } catch(msg) {
            vscode.window.showInformationMessage(msg);
        }
    }

    write_result(editor, resolved_query) {
        editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, resolved_query);
        });
    }

    get_query(editor) {
        return editor.document.getText(editor.selection);
    }

    get_missing_var(var_map, required_vars) {
        var i;
        var missings = [];
        for (i = 0; i < required_vars.length; i += 1) {
            if (!var_map[required_vars[i][1]]) {
                missings.push(required_vars[i][1]);
            }
        }
        return missings;
    }

    resolve(query) {    
        var result = this.collect_vars(query)
    
        var required_vars = result['vars']
        var value_map = result['value_map']
        var missings;
        
        missings = this.get_missing_var(value_map, required_vars);
        
        if (missings.length) {
            throw "Not defined vars : " + missings.join(", ");
        }
        
        return this.replace_all(query, value_map, required_vars);
    }

    replace_all(text, var_map, required_vars) {
        var result = text;
        var i;
    
        for (i = 0; i < required_vars.length; i += 1) {
            result = result.replace(required_vars[i][0], function() { return var_map[required_vars[i][1]] });
        }
        
        return result;
    }

    collect_vars(query) {
        throw 'Not implemented!'
    }
}

module.exports = Resolver