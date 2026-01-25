import { Lexer } from "./lexer.js";

// Test case 1: Simple PRINT statement
const code1 = '10 PRINT "HELLO WORLD"\n20 END';
const lexer1 = new Lexer(code1);
const tokens1 = lexer1.tokenize();
console.log("Test 1:", tokens1);

// Test case 2: Numeric expressions
const code2 = '10 LET X = 3.14159E-2\n20 LET Y = X * 2 + 1';
const lexer2 = new Lexer(code2);
const tokens2 = lexer2.tokenize();
console.log("Test 2:", tokens2);

// Test case 3: Control flow
const code3 = '10 IF X > 0 THEN 100\n20 GO TO 200';
const lexer3 = new Lexer(code3);
const tokens3 = lexer3.tokenize();
console.log("Test 3:", tokens3);

// Test case 4: Variables and arrays
const code4 = '10 LET A5 = 10\n20 LET B$ = "TEST"\n30 LET C(1,2) = A5';
const lexer4 = new Lexer(code4);
const tokens4 = lexer4.tokenize();
console.log("Test 4:", tokens4);
