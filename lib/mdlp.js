var codeBlocks = require('./CodeBlocks.js')
  , macroDeclaration = require('./MacroDeclaration.js')
  , tree = require('./Tree.js')
  , writer = require('./Writer.js')
  , fs = require('fs')
  , path = require('path');
  
function ExtractSourceCode(inputFilesArray, outputFolder, comment) {
    var success = true;
    
    // extract macro declaration
    var macroDeclarationArray = [];
    for(var i = 0; i < inputFilesArray.length; i++) {
        var inputFile = inputFilesArray[i];
        var b = path.basename(inputFile);
        var ext = path.extname(b);

        if(!fs.existsSync(inputFile)) {
            console.error(inputFile + " doesn't exist");
            success = false;
            continue;
        }
        var fileContent = fs.readFileSync(inputFile, 'utf8');

        if(ext == ".mdlp") {
            var rootName = path.basename(b, ".mdlp");
            var md = macroDeclaration.ExtractMacroContent(0, fileContent.split("\n"), 0, inputFile, "::" + rootName, false);
            if(md == null) {
                success = false;
            } else {
                macroDeclarationArray.push(md);
            }
        } else {
            codeBlocks.CodeBlocksParse(fileContent.split("\n"), function(lines, lineNumber, filename) {
                var md = macroDeclaration.ParseMacroDeclaration(lines, lineNumber, filename);
                if(md == null) {
                    success = false;
                } else {
                    macroDeclarationArray.push(md);
                }
            }, inputFile);
        }
    }
    
    // create tree
    var rootArray = tree.ConstructTree(macroDeclarationArray);
    if(rootArray != null) {
        // write source code
        writer.WriteTree(rootArray, outputFolder, comment);
    } else {
        console.error("generation stopped after some error in the tree");
    }
}

module.exports.ExtractSourceCode = ExtractSourceCode;