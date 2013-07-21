var codeBlocks = require('./CodeBlocks.js')
  , macroDeclaration = require('./MacroDeclaration.js')
  , tree = require('./Tree.js')
  , writer = require('./Writer.js')
  , fs = require('fs');

function ExtractSourceCode(inputFilesArray, outputFolder) {
    var success = true;

    // extract macro declaration
    var macroDeclarationArray = [];
    for(var i =0; i < inputFilesArray.length; i++) {
        var inputFile = inputFilesArray[i];
        if(!fs.existsSync(inputFile)) {
            console.error(inputFile + " doesn't exist");
            success = false;
            continue;
        }
        var fileContent = fs.readFileSync(inputFile, 'utf8');
        codeBlocks.CodeBlocksParse(fileContent.split("\n"), function(lines, lineNumber, filename) {
            var md = macroDeclaration.ParseMacroDeclaration(lines, lineNumber, filename);
            if(md == null) {
                success = false;
            } else {
                macroDeclarationArray.push(md);
            }
        }, inputFile);
    }

    // create tree
    var rootArray = tree.ConstructTree(macroDeclarationArray);

    // write source code
    writer.WriteTree(rootArray, outputFolder);
}

module.exports.ExtractSourceCode = ExtractSourceCode;
