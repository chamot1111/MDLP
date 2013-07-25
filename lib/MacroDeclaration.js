function ContainsMacroDeclaration(lines) {
    return (/^<<[^<]/).test(lines[0]);
}
    
function ReadIndentLevel(l) {
    var spaces = 0;
    var whiteStartRes = (/^( |\t)*/).exec(l);
    if(whiteStartRes) {
        var whiteStart = whiteStartRes[0];
        var wsRes = whiteStart.match(/ /g);
        var tabRes = whiteStart.match(/\t/g);
        var wsCount = (wsRes != null)? wsRes.length : 0;
        var tabCount = (tabRes != null)? tabRes.length : 0;
        spaces = wsCount + tabCount * 4;
    }
    return spaces;
}
    
/**
 * This take a string like "<<name>>" and extract the name component.
 * If the definition is illegal this fonction return an empty string.
 * n.b: this function print no error
 */
function ExtractMacroName(content) {
    var r = (/^<<[\w \-\.\/]+>>$/).exec(content);
    if(r == null) {
        return "";
    }
    return r[0].substr(r.index + 2, r[0].length - 4);
}
    
/**
 * return {name: "", concatenate: false/true}, null if error happends
 */
function ParseMacroDeclarationHeader(l, lineNumber, filename) {
    var result = {};
    var r = (/^<<.*>>/).exec(l);
    
    if(r == null) {
        console.error(filename + ":" + lineNumber + ": Lack \">>\" in the macro declaration");
        return null;
    }
    
    result.name = ExtractMacroName(r[0]);
    
    if(result.name == "") {
        console.error(filename + ":" + lineNumber + ": macro declaration name contains illegal character");
        return null;
    }
    
    l = l.substring(r.index + r[0].length);;
    
    var affectationRegex = /^\s*=\s*$/;
    var additionRegex = /^\s*\+=\s*$/;
    
    if(affectationRegex.test(l)) {
        result.concatenate = false;
    } else if(additionRegex.test(l)) {
        result.concatenate = true;
    }
    
    else {
        r = (/\+?=/).exec(l);
        if(r == null) {
            console.error(filename + ":" + lineNumber + ": No affectation operator (+?=)");
        } else if(line.substring(0, resR.index).trim().length != 0) {
            console.error(filename + ":" + lineNumber + ": Unexpected character before affectation operator (+?=)");
        } else if(line.substring(resR.index + resR[0].length).trim().length != 0) {
            console.error(filename + ":" + lineNumber + ": Unexpected character after affectation operator (+?=)");
        } else {
            console.error(filename + ":" + lineNumber + ": Unexpected error");
        }
        return null;
    }
    return result;
}

function MacroContent(content, indent, lineNumber, filename) {
    this.Indent = indent;
    this.LineNumber = lineNumber;
    this.Filename = filename;
    
    var mName = ExtractMacroName(content);
    if(mName != "") {
        this.IsMacroReference = true;
        this.Name = mName;
        this.Ref = null;
    } else {
        this.IsMacroReference = false;
        this.Code = content;
    }
}
    
function MacroDeclaration() {
    this.Name = "";
    /**
     * This array contains objects of type MacroContent.
     */
    this.MacroContentArray = [];
    /**
     * If the macro is declared with '=', this is not a concatenation.
     * '+=' => concatenation
     */
    this.Concatenate = false;
    
    this.Filename = "";
    
    this.Linenumber = 0;
}

MacroDeclaration.prototype = {
    MergeWith: function(m) {
        for(var i = 0; i < m.MacroContentArray.length; i++) {
            this.MacroContentArray.push(m.MacroContentArray[i]);
        }
    }
}
    
/**
 * Take code block content and return a MacroDeclaration object.
 * Return null if an error happen.
 */
function ParseMacroDeclaration(lines, lineNumber, filename) {
    if(!ContainsMacroDeclaration(lines)) {
        return null;
    }
    var md = new MacroDeclaration();
    var headerInfo = ParseMacroDeclarationHeader(lines[0], lineNumber, filename);
    if(headerInfo == null) {
        return null;
    }
    md.Name = headerInfo.name;
    md.Filename = filename;
    md.Linenumber = lineNumber;
    md.Concatenate = headerInfo.concatenate;
    var baselineSpaces = Number.MAX_VALUE;
    for(var i = 1; i < lines.length; i++) {
        var l = lines[i];
        var lTrim = l.trim();
        var indent = ReadIndentLevel(l);
        var mc = new MacroContent(lTrim, indent, lineNumber + i, filename);
        md.MacroContentArray.push(mc);
        // empty lines don't participate in baseline
        if(lTrim.length > 0) {
            baselineSpaces = (indent < baselineSpaces)? indent : baselineSpaces;
        }
    }
    for(var i = 0; i < md.MacroContentArray.length; i++) {
        var mc = md.MacroContentArray[i];
        mc.Indent = (mc.Indent < baselineSpaces)? baselineSpaces : mc.Indent - baselineSpaces;
    }
    
    if(md.MacroContentArray.length == 0) {
        console.error(filename + ":" + lineNumber + ": macro declaration is empty");
    }
    
    return md;
}
    
module.exports.ParseMacroDeclaration = ParseMacroDeclaration;