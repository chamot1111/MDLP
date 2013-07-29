// <<./lib/CodeBlocks.js>> ( mdlp.md:316)
    
// less than 4 spaces
function IsEmptyLine(l) {
    return (/^ ? ? ?\r?$/).test(l);
}

function IsFencedDelimitor(l) {
    return (/^```\s*$/).test(l);
}

function StartW4Spaces(l) {
    return (/^(    |\t)/).test(l);
}
    
/**
 * Take an array of line and search for code blocks. Each time a code blocks is find, this function
 * create an array of lines with the code blocks content. The callback is call for each code blocks
 * with the line array of the code blocks and his start line.
 * callback = function(lines, lineNumber, filename);
 * return true if no error happened.
 */
function CodeBlocksParse(lines, callback, filename) {
    var success = true;
    var line_index = 0;
    var line_count = lines.length;
    // <<code_blocks_parser>> ( mdlp.md:15)
    while( line_index < line_count ) {
        // search for a blank line
         if( IsEmptyLine(lines[line_index]) ) {
            // look if the next line is a beginning of code blocks
            line_index++;
            if( IsFencedDelimitor(lines[line_index]) ) {
                // <<fenced_code_blocks>> ( mdlp.md:36)
                var lineNumber = line_index + 1;
                var block = [];
                // advance to the next line
                line_index++;
                while( line_index < line_count && !IsFencedDelimitor(lines[line_index]) ) {
                    block.push(lines[line_index]);
                    line_index++;
                }
                    
                // <<fenced_code_blocks_error_or_callback>> ( mdlp.md:351)
                if(line_index == line_count) {
                    // we reach the end of the file without closing fenced code blocks
                    success = false;
                    console.error("Line " + line_index + ": No closing fenced code blocks until the end of file.");
                } else {
                    // no error
                    callback(block, lineNumber, filename);
                }
            } else if( StartW4Spaces(lines[line_index]) ) {
                // <<four_spaces_code_blocks>> ( mdlp.md:52)
                var lineNumber = line_index;
                var block = [];
                while( line_index < line_count && StartW4Spaces(lines[line_index]) ) {
                    block.push(lines[line_index]);
                    line_index++;
                }
                    
                // go back to the last line of the block
                line_index--;
                    
                callback(block, lineNumber, filename);
             }
         }
     line_index++;
     }
    
    return success;
}

module.exports.CodeBlocksParse = CodeBlocksParse;