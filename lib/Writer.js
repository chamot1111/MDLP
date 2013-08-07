var fs = require('fs')
  , path = require('path');
    
function EnsurePathExist(filePath) {
    var folder = path.dirname(filePath);
    var stackFolder = [];
    while(!fs.existsSync(folder)) {
        stackFolder.push(folder);
        folder = path.dirname(folder);
    }
    for(var i = stackFolder.length - 1; i >= 0; i--) {
        var f = stackFolder[i];
        fs.mkdirSync(f);
    }
}

function IsPathInSandbox(sandboxFolder, filePath) {
    var sandboxFolderR = path.resolve(sandboxFolder);
    var pathR = path.resolve(filePath);
    return pathR.search(sandboxFolderR) != -1;
}

/**
 * Take a macro declaration tree and flat it into a array of line
 */
function FlatTree(root, comment) {
    var lines = [];
    function traverse(node, indent) {
        if(comment != null) {
            var s = "";
            for(var j = 0; j < indent; j++) {
                s += " ";
            }
            s += comment + " <<" + node.Name + ">> ( " + node.Filename + ":" + node.Linenumber + " )";
        
            lines.push(s);
        }
        for(var i = 0; i < node.MacroContentArray.length; i++) {
            var c = node.MacroContentArray[i];
            if(c.IsMacroReference) {
                if("Ref" in c && c.Ref != null) {
                    traverse(c.Ref, indent + c.Indent);
                } else {
                    lines.push("<<" + c.Name + ">>");
                }
            } else {
                // indent the line
                var s = "";
                for(var j = 0; j < indent + c.Indent; j++) {
                    s += " ";
                }
                lines.push(s + c.Code);
            }
        }
    }
    traverse(root, 0);
    return lines;
}

function WriteTree(rootArray, outputFolder, comment) {
    var success = true;
    var absoluteOutputFolder = path.resolve(outputFolder);
    if(!fs.existsSync(absoluteOutputFolder)) {
        console.error("Output folder " + absoluteOutputFolder + " dosn't exist");
        return false;
    }
    for(var i = 0; i < rootArray.length; i++) {
        var rootNode = rootArray[i];
        var filePath = path.resolve(absoluteOutputFolder, rootNode.Name);
        if(!(/^\./).test(rootNode.Name)) {
            console.error(rootNode.Filename + ":" + rootNode.Linenumber + ": If " + rootNode.Name + " is a root macro declaration, his name should begin with a '.' else a macro reference to it is lacking");
            success = false;
            continue;
        }
        if(!IsPathInSandbox(absoluteOutputFolder, filePath)) {
            console.error(filePath + " is outside the output folder");
            success = false;
            continue;
        }
    
        var flatContentArray = FlatTree(rootNode, comment);
        
        EnsurePathExist(filePath);
        fs.writeFileSync(filePath, flatContentArray.join("\n"));
    }
    return success;
}

module.exports.WriteTree = WriteTree;