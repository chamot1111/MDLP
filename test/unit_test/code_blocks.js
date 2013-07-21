var assert = require("assert")
  , cb = require("../../lib/CodeBlocks");

describe('Code Blocks', function(){
  describe('4spaces', function(){
    it('should fail if there in no blank line before', function(){
    	var blockFind = false;
    	cb.CodeBlocksParse(["non empty", "    Code block"], function(lines, lineNumber, fileName){
    		blockFind = true;
    	}, "test");
    	assert.equal(false, blockFind);
    });
    it('should pass with simple two lines example', function(){
    	var blockFind = false;
    	cb.CodeBlocksParse(["", "    Code block"], function(lines, lineNumber, fileName){
    		blockFind = true;
    	}, "test");
    	assert.equal(true, blockFind);
    });
  });
  describe('fenced code blocks', function(){
    it('should fail if there in no blank line before', function(){
    	var blockFind = false;
    	cb.CodeBlocksParse(["non empty", "```", "Code block", "```"], function(lines, lineNumber, fileName){
    		blockFind = true;
    	}, "test");
    	assert.equal(false, blockFind);
    });
    it('should pass with simple two lines example', function(){
    	var blockFind = false;
    	cb.CodeBlocksParse(["", "```", "Code block", "```"], function(lines, lineNumber, fileName){
    		blockFind = true;
    	}, "test");
    	assert.equal(true, blockFind);
    });
  })
});
