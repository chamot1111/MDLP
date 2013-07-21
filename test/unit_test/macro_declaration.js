var assert = require("assert")
  , macroDeclaration = require("../../lib/MacroDeclaration.js");

describe('Macro declaration', function(){
    it('simple test', function(){
        var lines = ["<<macro_dec>> =", "  line1", "    <<macro>>", "  line2"];
        var md = macroDeclaration.ParseMacroDeclaration(lines, 0, "test-file");
    	assert(md != null, "Parse fail");
    	
        assert.equal(md.MacroContentArray[0].Code, "line1", "line1 bad parsed");
        assert.equal(md.MacroContentArray[0].Indent, 0, "bad indentation");
        
        assert.equal(md.MacroContentArray[1].Name, "macro", "bad macro declaration name");
        assert.equal(md.MacroContentArray[1].Indent, 2, "bad indentation");

        assert.equal(md.MacroContentArray[2].Code, "line2", "line2 bad parsed");
        assert.equal(md.MacroContentArray[2].Indent, 0, "bad indentation");
        
    });
});
