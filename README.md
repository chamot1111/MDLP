MDLP
====

MarkDown Literate Programing: A parser for literate programing inherit from markdown syntax

To understand what is literate programming, read the [wikipedia page](http://en.wikipedia.org/wiki/Literate_programming).

The src code is generated from `mdlp.md`. Extract source code with this command:

```
mdlp -o ./ mdlp.md
```

CLI Usage
---------

To install the program as a binary. Use npm with this command:

```
npm install -g mdlp
```

Then you can use it from the command line.

```
mdlp -o ./src_folder file1.md file2.md file3.md
```

MDLP syntax
-----------

To declare a macro in the file, begin a code block with four spaces indent or a fenced code block.
Then declare a macro like this:

	```
	<<macro-name>> =
		line of code 1
		line of code 2
		<<macro2>>
		line of code 3
	```
	
You can add code to a macro already defined like this:

	```
	<<macro-name>> +=
		line of code 4
	```
	
All the code blocks are extracted from the file. The root macros names become file:
	```
	<<./lib/file1>> =
		<<macro-name>>
	```
	
To avoid problems, by convention root macro name must begin with a `.` and path outside the output folder are forbidden.
