function ConstructTree(macroArray) {
    var success = true;
    var mergedArray = macroArray.slice();
    var macroMap = {};
    for(var i = 0; i < macroArray.length; i++) {
        var m = macroArray[i];
        if(m.Name in macroMap) {
            // merge process
            var originMacro = macroMap[m.Name];
            if(m.Concatenate) {
                var index = mergedArray.indexOf(m);
                if(index != -1){
                    mergedArray.splice(index, 1);
                }
                originMacro.MergeWith(m);
            } else {
                success = false;
                console.error(m.Filename + ":" + m.Linenumber + "Macro " + m.Name + " was already defined " + originMacro.Filename + ":" + originMacro.Linenumber);
            }
        } else {
            if(!m.Concatenate) {
                macroMap[m.Name] = m;
            } else {
                success = false;
                console.error(m.Filename + ":" + m.Linenumber + ": " + m.Name + " has no declaration before.");
            }
        }
    }
    var rootArray = mergedArray.slice();
    for(var i = 0; i < mergedArray.length; i++) {
        // search for child reference
        var m = mergedArray[i];
        for(var j = 0; j < m.MacroContentArray.length; j++) {
            var mc = m.MacroContentArray[j];
            if(mc.IsMacroReference) {
                if(mc.Name in macroMap) {
                    mc.Ref = macroMap[mc.Name];
                    var index = rootArray.indexOf(mc.Ref);
                    if(index != -1){
                        rootArray.splice(index, 1);
                    }
                } else {
                    success = false;
                    console.error(mc.Filename + ":" + mc.lineNumber + " can't find macro declaration " + mc.Name);
                }
            }
        }
    }
    
    return (success)? rootArray : null;
}

module.exports.ConstructTree = ConstructTree;
