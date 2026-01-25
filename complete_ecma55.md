<h1>ECMA<br>EUROPEAN COMPUTER MANUFACTURERS ASSOCIATION</h1>

# Standard ECMA-55<br>Minimal BASIC

January 1978

[Brief History](brief_history.md)

<!-- [Table of Contents](index.md) -->

  1. [Scope](1_scope.md)
  2. [References](2_references.md)
  3. [Definitions](3_definitions.md)
  4. [Characters and strings](4_characters_and_strings.md)
  5. [Programs](5_programs.md)
  6. [Constants](6_constants.md)
  7. [Variables](7_variables.md)
  8. [Expressions](8_expressions.md)
  9. [Implementation supplied functions](9_implementation_supplied_functions.md)
  10. [User defined functions](10_user_defined_functions.md)
  11. [LET statement](11_let_statement.md)
  12. [Control statements](12_control_statement.md)
  13. [FOR and NEXT statements](13_for_and_next_statements.md)
  14. [PRINT statement](14_print_statement.md)
  15. [INPUT statement](15_input_statement.md)
  16. [READ and RESTORE statements](16_read_and_restore_statements.md)
  17. [DATA statement](17_data_statement.md)
  18. [ARRAY declarations](18_array_declarations.md)
  19. [REMARK statement](19_remark_statement.md)
  20. [RANDOMIZE statement](20_randomize_statement.md)

[TABLE 1 - BASIC Character Set](T2_basic_character_set.md)<br>
[TABLE 2 - BASIC Code](T1_basic_code.md)

[APPENDIX 1 - Organisation of the Standard](A1_organisation_of_the_standard.md)<br>
[APPENDIX 2 - Method of Syntax Specification](A2_method_of_syntax_specification.md)<br>
[APPENDIX 3 - Conformance](A3_conformance.md)<br>
[APPENDIX 4 - Implementation-defined Features](A4_implementation_defined_features.md)
---
next: 1_scope.html
---

# Brief History

The first version of the language BASIC, acronym for Beginner's All-purpose Symbolic Instruction Code, was produced in 
1964 at the Dartmouth College in the USA. This version of the language was oriented towards interactive use.
Subsequently, a number of implementations of the language were prepared, that differed in part from the original one.

In 1974, the ECMA General Assembly recognized the need for a standardized version of the language, and in September 1974
the first meeting of the ECMA Committee TC 21, BASIC, took place. In January 1974, a corresponding committee, X3J2, had
been founded in the USA.

Through a strict co-operation it was possible to maintain full compatibility between the ANSI and ECMA draft standards. 
The ANSI one was distributed for public comments in January 1976 , and a number of comments were presented by ECMA.

A final version of the ECMA Standard was prepared at the meeting of June 1977 and adopted by the General Assembly of
ECMA on Dec. 14, 1977 as Standard ECMA-55.
---
prev: brief_history.html
next: 2_references.html
---

# Scope

This Standard ECMA-55 is designed to promote the interchangeability of BASIC programs among a variety of automatic data
processing systems. Subsequent Standards for the same purpose will describe extensions and enhancements to this
Standard. Programs conforming to this Standard, as opposed to extensions or enhancements of this Standard, will be said
to be written in "Minimal BASIC".

This Standard establishes:

- The syntax of a program written in Minimal BASIC.
- The formats of data and the precision and range of numeric representations which are acceptable as input to an
  automatic data processing system being controlled by a program written in Minimal BASIC.
- The formats of data and the precision and range of numeric representations which can be generated as output by an
  automatic data processing system being controlled by a program written in Minimal BASIC.
- The semantic rules for interpreting the meaning of a program written in Minimal BASIC.
- The errors and exceptional circumstances which shall be detected and also the manner in which such errors and
  exceptional circumstances shall be handled.

Although the BASIC language was originally designed primarily for interactive use, this Standard describes a language
that is not so restricted.

The organization of the Standard is outlined in [Appendix 1](A1_organisation_of_the_standard.md). The method of syntax
specification used is explained in [Appendix 2](A2_method_of_syntax_specification.md).
---
prev: 1_scope.html
next: 3_definitions.html
---

# References

- [ECMA-6 : 7-Bit Input/Output Coded Character Set, 4th Edition](https://ecma-international.org/publications-and-standards/standards/ecma-6/)
- [ECMA-53 : Representation of Source Programs](https://ecma-international.org/publications-and-standards/standards/ecma-53/)
---
prev: 2_references.html
next: 4_characters_and_strings.html
---

# Definitions

<dl>

<dt>BASIC</dt>
<dd markdown="1">
A term applied as a name to members of a special class of languages which possess similar syntaxes and semantic 
meanings; acronym for Beginner's All-purpose Symbolic Instruction Code.
</dd>
<dt>Batch-mode</dt>
<dd markdown="1">
The processing of programs in an environment where no provision is made for user interaction.
</dd>
<dt>End-of-line</dt>
<dd markdown="1">
The character(s) or indicator which identifies the termination of a line. Lines of three kinds may be identified in
Minimal BASIC: program lines, print lines and input reply lines. End-of-line may vary between the three cases and may
also vary depending upon context. Thus, for example, an end of input line may vary on a given system depending on the
terminal being used in interactive or batch mode.

Typical examples of end-of-line are carriage-return, carriage-return line-feed, and end of record (such as end of card). 
</dd>
<dt>Error</dt>
<dd markdown="1">
A flaw in the syntax of a program which causes the program to be incorrect.
</dd>
<dt>Exception</dt>
<dd markdown="1">
A circumstance arising in the course of executing a program which results from faulty data or computations or from 
exceeding some resource constraint. Where indicated certain exceptions (non-fatal exceptions) may be handled by the
specified procedures if no procedure is given (fatal exceptions) or if restrictions imposed by the hardware or operating
environment make it impossible to follow the given procedure, then the exception shall be handled by terminating the
program.
</dd>
<dt>Identifier</dt>
<dd markdown="1">
A character string used to name a variable or a function.
</dd>
<dt>Interactive mode</dt>
<dd markdown="1">
The processing of programs in an environment which permits the user to respond directly to the actions of individual 
programs and to control the commencement and termination of these programs.
</dd>
<dt>Keyword</dt>
<dd markdown="1">
A character string, usually with the spelling of a commonly used or mnemonic word, which provides a distinctive
identification of a statement or a component of a statement of a programming language. 

The keywords in Minimal BASIC are: `BASE`, `DATA`, `DEF`, `DIM`, `END`, `FOR`, `GO`, `GOSUB`, `GOTO`, `IF`, `INPUT`, 
`LET`, `NEXT`, `ON`, `OPTION`, `PRINT`, `RANDOMIZE`, `READ`, `REM, `, `RESTORE`, `RETURN`, `STEP`, `STOP`, `SUB`, `THEN` 
and `TO`. 
</dd>
<dt>Line</dt>
<dd markdown="1">
A single transmission of characters which terminates with an end-of-line.
</dd>
<dt>Nesting</dt>
<dd markdown="1">
A set of statements is nested within another set of statements when:

- the nested set is physically contiguous, and
- the nesting set (divided by the nested set) is non-null.
<p></p>
</dd>
<dt>Print zone</dt>
<dd markdown="1">
A contiguous set of character positions in a printed output line which may contain an evaluated print statement element.
</dd>
<dt>Rounding</dt>
<dd markdown="1">
The process by which the representation of a value with lower precision is generated from a representation of higher 
precision taking into account the value of that portion of the original number which is to be omitted.
</dd>
<dt>Significant digits</dt>
<dd markdown="1">
The contiguous sequence of digits between the high-order nonzero digit and the low-order non-zero digit, without regard 
for the location of the radix point. Commonly, in a normalized floating point internal representation, only the
significant digits of a representation are maintained in the significance.
<div class="note information">
<h4>NOTE:</h4>
<p>The Standard requires that the ability of a conforming implementation to accept numeric representations be measured 
in terms of significant digits rather than the actual number of digits (that is including leading or trailing zeroes) in
the representation.</p>
</div>
</dd>
<dt>Truncation</dt>
<dd markdown="1">
The process by which the representation of a value with lower precision is generated from a representation of higher 
precision by merely deleting the unwanted low order digits of the original representation.
</dd>

</dl>
---
prev: 3_definitions.html
next: 5_programs.html
---

# Characters and strings

## General Description 

The character set for BASIC is contained in the ECMA 7-bit coded character set. Strings are sequences of characters and
are used in BASIC programs as comments (see [19](19_remark_statement.md)), as string constants
(see [6](6_constants.md)), or as data (see [15](15_input_statement.md)). 

## Syntax

1. letter = A/B/C/D/E/F/G/H/I/J/K/L/M/N/O/P/Q/R/S/T/U/V/W/X/Y/Z 
2. digit = 0/1/2/3/4/5/6/7/8/9 
3. string-character = quotation-mark / quoted-string-character
4. quoted-string-character = exclamation-mark / number-sign / dollar-sign / percent-sign / ampersand / apostrophe /
   left-parenthesis / right-parenthesis / asterisk / comma / solidus / colon / semi-colon / less-than-sign / equals-sign
   / greater-than-sign / question-mark / circumflex-accent / underline / unquoted-string-character 
5. unquoted-string-character = space / plain-string-character 
6. plain-string-character = plus-sign / minus-sign / full-stop / digit / letter 
7. remark-string = string-character*
8. quoted-string = quotation-mark quoted-string-character* quotation-mark 
9. unquoted-string = plain-string-character / plain-st ring-character unquoted-string-character* plain-string-character

## Examples

```BASIC
ANY CHARACTERS AT ALL (?!*!!) CAN BE USED IN A "REMARK". 
"SPACES AND COMMAS CAN OCCUR IN QUOTED STRINGS."
COMMAS CANNOT OCCUR IN UNQUOTED STRINGS.
```

## Semantics

The letters shall be the set of upper-case Roman letters contained in the ECMA 7-bit coded character set in positions
4/1 to 5/10.

The digits shall be the set of arabic digits contained in the ECMA 7-bit coded character set in positions 3/0 to 3/9.

The remaining string-characters shall correspond to the remaining graphic characters in position 2/0 to 2/15, 3/10 to
3/15 and in positions 5/14, 5/15 of the ECMA 7-bit coded character set.

The names of characters are specified in [Table 1](T1_basic_code.md). 

The coding of characters is specified in [Table 2](T2_basic_character_set.md); however, this coding applies only when
programs and/or input/output data are exchanged by means of coded media.

## Exceptions 

None. 

## Remarks 

Other characters from the ECMA 7-bit coded character set (including control characters) may be accepted by an
implementation and may have a meaning to some other processor (such as an editor) but have no prescribed meaning within
this Standard. Programs containing characters other than the string-characters described above are not 
standard-conforming programs. 

The several kinds of characters and strings described by the syntax correspond to the various uses of strings in a BASIC
program. Remark-strings may be used in remark-statements (see [19](19_remark_statement.md)). Quoted-strings may be used 
as string-constants (see [6](6_constants.md)). Unquoted-strings may be used in addition to quoted-strings as data
elements (see [17](17_data_statement.md)) without being enclosed in quotation marks; unquoted-strings cannot contain
leading or trailing spaces.
---
prev: 4_characters_and_strings.html
next: 6_constants.html
---

# Programs

## General Description 

BASIC is a line-oriented language. A BASIC program is a sequence of lines, the last of which shall be an end-line and each of which contains a keyword. Each line shall contain a unique line-number which serves as a label for the statement contained in that line. 

## Syntax 

1. program = block* end-line 
2. block = (line/for-block)* 
3. line = line-number statement end-of-line 
4. line-number = digit digit? digit? digit? 
5. end-of-line = \[implementation-defined]
6. end-line = line-number end-statement end-of-line 
7. end-statement = END 
8. statement = data-statement / def-statement / dimension -statement / gosub-statement / goto-statement / 
   if-then-statement / input-statement / let-statement / on-goto-statement / option-statement / print-statement /
   randomize-statement / read-statement / remark-statement / restore-statement / return-statement / stop-statement

## Examples 

    999 END 
    
## Semantics 

A BASIC program shall be composed of a sequence of lines ordered by line-numbers, the last of which contains an
end-statement. Program lines shall be executed in sequential order, starting with the first line, until 

- some other action is dictated by a control statement, or
- an exception condition occurs, which results in a termination of the program, or
- a stop-statement or end-statement is executed.
    
Special conventions shall be observed regarding spaces. With the following exceptions, spaces may occur anywhere in a
BASIC program without affecting the execution of that program and may be used to improve the appearance and readability
of the program.

Spaces shall not appear:

- at the beginning of a line
- within keywords
- within numeric constants
- within line numbers
- within function or variable names
- within two-character relation symbols 

All keywords in a program shall be preceded by at least one space and, if not at the end of a line, shall be followed by
at least one space. 

Each line shall begin with a line-number. The values of the integers represented by the line-numbers shall be positive
nonzero; leading zeroes shall have no effect. Statements shall occur in ascending line-number order. 

The manner in which the end of a statement line is detected is determined by the implementation; e.g. the end-of-line
may be a carriage-return character, a carriage-return character followed by a line-feed character, or the end of a
physical record. Lines in a standard-conforming program may contain up to 72 characters; the end-of-line indicator is 
not included within this 72 character limit. 

The end-statement serves both to mark the physical end of the main body of a program and to terminate the execution of
the program when encountered. 

## Exceptions 

None. 

## Remarks 

Local editing facilities may allow for the entry of statement lines in any order and also allow for duplicate
line-numbers and lines containing only a line-number. Such editing facilities usually sort the program into the proper
order and in the case of duplicate line-numbers, the last line entered with that line-number is retained. In many
implementations, a line containing only a line-number (without trailing spaces) is usually deleted from the program.
---
prev: 5_programs.html
next: 7_variables.html
---

# Constants

## General Description 

Constants can denote both scalar numeric values and string values. 

A numeric-constant is a decimal representation in positional notation of a number. There are four general syntactic
forms of (optionally signed) numeric constants:

- implicit point representation                `sd...d`
- explicit point unscaled representation       `sd..drd..d`
- explicit point scaled representation         `sd..drd..dEsd..d`
- implicit point scaled representation         `sd..dEsd..d`
    
where: 

d is a decimal digit,<br>
r is a full-stop<br>
s is an optional sign, and<br> 
E is the explicit character E.<br>
A string-constant is a character string enclosed in quotation marks (see [4](4_characters_and_strings.md)).

## Syntax 

1. numeric-constant = sign? numeric-rep
2. sign = plus-sign / minus-sign
3. numeric-rep = significand exrad?
4. significand = integer full-stop? / integer? fraction 
5. integer = digit digit* 
6. fraction = full-stop digit digit* 
7. exrad = E sign? integer 
8. string-constant = quoted-string 

## Examples 

```BASIC
    1         500          -21.        .255        1E10
    5E-1      .4E+1 
    "XYZ"     "X - 3B2"    "1E10"
```

## Semantics

The value of a numeric-constant is the number represented by that constant. "E" stands for "times ten to the power"; if
no sign follows the symbol "E", then a plus sign is understood. Spaces shall not occur in numeric-constants. 

A program may contain numeric representations which have an arbitrary number of digits, though implementations may round 
the values of such representations to an implementation-defined precision of not less than six significant decimal
digits. Numeric constants can also have an arbitrary number of digits in the exrad, though nonzero constants whose
magnitude is outside an implementation-defined range will be treated as exceptions. The implementation-defined range
shall be at least IE-38 to 1E+38. Constants whose magnitudes are less than machine infinitesimal shall be replaced by 
zero, while constants whose magnitudes are larger than machine infinity shall be diagnosed as causing an overflow. 

A string-constant has as its value the string of all characters between the quotation marks; spaces shall not be 
ignored. The length of a string-constant, i.e. the number of characters contained between the quotation-marks, is 
limited only by the length of a line. 

## Exceptions 

The evaluation of a numeric constant causes an overflow (non-fatal, the recommended recovery procedure is to supply
machine infinity with the appropriate sign and continue). 

## Remarks 

Since this Standard does not require that strings with more than 18 characters be assignable to string variables (see
[7](7_variables.md)), conforming programs can use string constants with more than 18 characters only as elements in a 
print-list.

It is recommended that implementations report constants whose magnitudes are less than machine infinitesimal as 
underflows and continue.---
prev: 6_constants.html
next: 8_expressions.html
---

# Variables

## General Description

Variables in BASIC are associated with either numeric or string values and, in the case of numeric variables, may be
either simple variables or references to elements of one or two dimensional arrays; such references are called
subscripted variables.

Simple numeric variables shall be named by a letter followed by an optional digit.

Subscripted numeric variables shall be named by a letter followed by one or two numeric expressions enclosed within
parentheses. 

String variables shall be named by a letter followed by a dollar sign. 

Explicit declarations of variable types are not required; a dollar-sign serves to distinguish string from numeric
variables, and the presence of a subscript distinguisnes a subscripted variable from a simple one.

## Syntax 

1. variable = numeric-variable / string-variable 
2. numeric-variable = simple-numeric-variable / numeric-array-element 
3. simple-numeric-variable = letter digit? 
4. numeric-array-element = numeric-array-name subscript
5. numeric-array-name = letter
6. subscript = left-parenthesis numeric-expression (comma numeric-expression)? right-parenthesis 
7. string-variable = letter dollar-sign 

## Examples

```BASIC
    X      A5    V(3)    W(X,X+Y/2)
    S$     C$
```

## Semantics

At any instant in the execution of a program, a numeric-variable is associated with a single numeric value and a 
string-variable is associated with a single string value. The value associated with a variable may be changed by the
execution of statements in the program. 

The length of the character string associated with a string-variable can vary during the execution of a program from a
length of zero characters (signifying the null or empty string) to 18 characters. 

Simple-numeric-variables and string-variables are declared implicitly through their appearance in a program. 

A subscripted variable refers to the element in the one or two dimensional array selected by the value(s) of the
subscript(s). The value of each subscript is rounded to the nearest integer. Unless explicitly declared in a dimension
statement, subscripted variables are implicitly declared by their first appearance in a program. In this case the range
of each subscript is from zero to ten inclusive, unless the presence of an option-statement indicates that the range is
from one to ten inclusive. Subscript expressions shall have values within the appropriate range (see [18](18_array_declarations.md)).

The same letter shall not be the name of both a simple variable and an array, nor the name of both a one-dimensional and
a two-dimensional array. 

There is no relationship between a numeric-variable and a string-variable whose names agree except for the dollar-sign. 

At the initiation of execution the values associated with all variables shall be implementation-defined. 

## Exceptions 

A subscript is not in the range of the explicit or implicit dimensioning bounds (fatal). 

## Remarks 

Since initialization of variables is not specified, and hence may vary from implementation to implementation, programs
that are intended to be transportable should explicitly assign a value to each variable before any expression involving
that variable is evaluated. 

There are many commonly used alternatives for associating implementation-defined initial values with variables; it is
recommended that all variables are recognizably undefined in the sense that an exception will result from any attempt to
access the value of any variable before that variable is explicitly assigned a value.
---
prev: 7_variables.html
next: 9_implementation_supplied_functions.html
---

# Expressions

## General Description

Expressions shall be either numeric-expressions or string- expressions.

Numeric-expressions may be constructed from variables, constants, and function references using the operations of
addition, subtraction, multiplication, division and involution.

String-expressions are composed of either a string-variable or a string-constant.

## Syntax

1. expression = numeric-expression / string-expression
2. numeric-expression = sign? term (sign term)*
3. term = factor (multiplier factor)*
4. factor = primary (circumflex-accent primary)*
5. multiplier = asterisk / solidus
6. primary = numeric-variable / numeric-rep / numeric-function-ref / left-parenthesis numeric-expression
7. numeric-function-ref = numeric-function-name argument-list?
8. numeric-function-name = numeric-defined-function / numeric-supplied-function
9. argument-list = left-parenthesis argument right-parenthesis
10. argument = numeric-expression
11. string-expression = string-variable / string-constant

## Examples

```BASIC
    3*X - Y^2      A(1)+A(2)+A(3)    2^(-X)
    -X/Y           SQR(X^2+Y^2)
```
    
## Semantics

The formation and evaluation of numeric-expressions follows the normal algebraic rules. The symbols circumflex-accent,
asterics , solidus, plus-sign and minus-sign represent the operations of involution, multiplication, division, addition 
and subtraction, respectively. Unless parentheses dictate otherwise, involutions are performed first, then 
multiplications and divisions, and finally additions and subtractions. In the absence of parentheses, operations of the
same precedence are associated to the left.

`A-B-C` is interpreted as `(A-B)-C`, `A^B^C` as `(A^B)^C`, `A/B/C` as `(A/B)/C` and `-A^B` as `-(A^B)`.

If an underflow occurs in the evaluation of a numeric expression then the value generated by the operation which
resulted in t e underflow shall be replaced by zero.

`0^0` is defined to be `1`, as in ordinary mathematical usage.

When the order of evaluation of an expression is not constrained by the use of parentheses, and if the mathematical use 
of operators is associative, commutative, or both, then full use of these properties may be made in order to revise the
order of evaluation of the expression.

In a function reference, the number of arguments supplied shall be equal to the number of parameters required by the
definition of the function.

A function reference is a notation for the invocation of a predefined algorithm, into which the argument value, if any,
is substituted for the parameter (see [9](9_implementation_supplied_functions.md) and 
[10](10_user_defined_functions.md)) which is used in the function definition. All functions referenced in an expression 
shall either be implementation-supplied or be defined in a def-statement. The result of the evaluation of the function,
achieved by the execution of the defining algorithm, is a scalar numeric value which replaces the function reference in 
the expression.

## Exceptions

- Evaluation of an expression results in division by zero (nonfatal, the recommended recovery procedure is to supply 
  machine infinity with the sign of the numerator and continue).
- Evaluation of an expression results in an overflow (nonfatal, the recommended recovery procedure is to supply machine 
  infinity with the algebraically correct sign and continue).
- Evaluation of the operation of involution results in a negative number being raised to a non-integral power (fatal).
- Evaluation of the operation of involution results in zero being raised to a negative value (nonfatal, the recommended 
  recovery procedure is to supply positive machine infinity and continue).
  
## Remarks

The accuracy with which the evaluation of an expression takes place will vary from implementation to implementation.
While no minimum accuracy is specified for the evaluation of numeric- expressions, it is recommended that
implementations maintain at least six significant decimal digits of precision.

The method of evaluation of the operation of involution may depend upon whether or not the exponent is an integer. If it
is, then the indicated number of multiplications may be performed; if it is not, then the expression may be evaluated 
using the LOG and EXP functions (see [9](9_implementation_supplied_functions.md).

It is recommended that implementations report underflow as an exception and continue.
---
prev: 8_expressions.html
next: 10_user_defined_functions.html
---

# Implementation supplied functions

## General Description

Predefined algorithms are supplied by the implementation for the evaluation of commonly used numeric functions. 

## Syntax

1. numeric-supplied-function = `ABS` / `ATN` / `COS` / `EXP` / `INT` / `LOG` / `RND` / `SGN` / `SIN` / `SQR` / `TAN` 

## Examples 

None. 

## Semantics 

The values of the implementation-supplied functions, as well as the number of arguments required for each function, are described below. In all cases, X stands for a numeric expression. 

| Function                 | Function value                                                                                                                                                                                             |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ABS(X)`                 | The absolute value of X.                                                                                                                                                                                   |
| `ATN(X)`                 | The arctangent of X in radians, i.e. the angle whose tangent is X. The range of the function is<br>`-(pi/2) < ATN(X) < (pi/2)`<br>where pi is the ratio of the circumference of a circle to its diameter.  |
| `COS(X)`                 | The cosine of X, where X is in radians.                                                                                                                                                                    |
| `EXP(X)`                 | The exponential of X, i.e. the value of the base of natural logarithms (e = 2,71828...) raised to the power X; if EXP(X) is less than machine infinitesimal, then its value shall be replaced by zero.     |
| `INT(X)`                 | The largest integer not greater than X; e.g.<br>`INT(1.3) = 1` and `INT(-1.3) = -2`                                                                                                                        |
| `LOG(X)`                 | The natural logarithm of X; X must be greater than zero.                                                                                                                                                   |
| `RND`                    | The next pseudo-random number in an implementation-supplied sequence of pseudo-random numbers uniformly distributed in the range 0 <= RND < 1 (see also [20](20_randomize_statement.md)).                  |
| `SGN(X)`                 | The sign of X: -1 if X < 0, 0 if X = 0 and +1 if X > 0.                                                                                                                                                    |
| `SIN(X)`                 | The sine of X, where X is in radians.                                                                                                                                                                      |
| `SQR(X)`                 | The nonnegative square root of X; X must be nonnegative.                                                                                                                                                   |
| `TAN(X)`                 | The tangent of X, where X is in radians.                                                                                                                                                                   |

## Exceptions

- The value of the argument of the LOG function is zero or negative (fatal).
- The value of the argument of the SQR function is negative (fatal).
- The magnitude of the value of the exponential or tangent function is larger than machine infinity (nonfatal, the 
  recommended recovery procedure is to supply machine infinity with the appropriate sign and continue).

## Remarks 

The RND function in the absence of a randomize-statement (see [20](20_randomize_statement.md)) will generate the same 
sequence of pseudo-random numbers each time a program is run. This convention is chosen so that programs employing 
pseudo-random numbers can be executed several times with the same result. 

It is recommended that, if the value of the exponential function is less than machine infinitesimal, implementations
report this as an underflow and continue.
---
prev: 9_implementation_supplied_functions.html
next: 11_let_statement.html
---

# User defined functions

## General Description

In addition to the implementation supplied functions provided for the convenience of the programmer 
(see [9](9_implementation_supplied_functions.md)), BASIC allows the programmer to define new functions within a program.

The general form of statements for defining functions is

    DEF FNx = expression 
    or DEF FNx (parameter) = expression

where x is a single letter and a parameter is a simple numeric-variable.

## Syntax 

1. def-statement = `DEF` numeric-defined-function parameter-list? equals-sign numeric-expression
2. numeric-defined-function = `FN` letter
3. parameter-list = simple-numeric-variable

## Examples 

```BASIC
    DEF FNF(X) = X^4 - 1        DEF FNP = 3.14159  
    DEF FNA(X) = A*X + B
```

## Semantics

A function definition specifies the means of evaluating the function in terms of the value of an expression involving 
the parameter appearing in the parameter-list and possibly other variables or constants. When the function is
referenced, i.e. when an expression involving the function is evaluated, then the expression in the argument list for 
the function reference, if any, is evaluated and its value is assigned to the parameter in the parameter-list for the
function definition (the number of arguments shall correspond exactly to the number of parameters). The expression in 
the function definition is then evaluated, and this value is assigned as the value of the function. 

The parameter appearing in the parameter-list of a function definition is local to that definition, i.e. it is distinct
from any variable with the same name outside of the function definition. Variables which do not appear in the
parameter-list are the variables of the same name outside the function definition.

A function definition shall occur in a lower numbered line than that of the first reference to the function. The
expression in a def-statement is not evaluated unless the defined function is referenced.

If the execution of a program reaches a line containing a def-statement, then it shall proceed to the next line with no
other effect.

A function definition may refer to other defined functions, but not to the function being defined. A function shall be
defined at most once in a program.

## Exceptions

None.
---
prev: 10_user_defined_functions.html
next: 12_control_statement.html
---

# LET statement

## General Description 

A let-statement provides for the assignment of the value of an expression to a variable. The general syntactic form of 
the let-statement shall be

    LET variable = expression

## Syntax

1. let-statement = numeric-let-statement / string-let-statement
2. numeric-let-statement = `LET` numeric-variable equals-sign numeric-expression 
3. string-let-statement = `LET` string-variable equals-sign string-expression 

## Examples

```BASIC
    LET P = 3.14159 
    LET A(X,3) = SIN(X)*Y + 1 
    LET A$ = "ABC" 
    LET A$ = B$ 
```
 
## Semantics

The expression is evaluated (see 8) and its value is assigned to the variable to the left of the equals sign. 

## Exceptions

A string datum contains too many characters (fatal).
---
prev: 11_let_statement.html
next: 13_for_and_next_statements.html
---

# Control Statement

## General Description

Control statements allow for the interruption of the normal sequence of execution of statements by causing execution to
continue at a specified line, rather than at the one with the next higher line number.

### The goto-statement

    GO TO line-number 

allows for an unconditional transfer.

### The if-then-statement

    IF expl rel exp2 THEN line-number

where "expl" and'texp2" are expressions and "rel" is a relational operator, allows for a conditional transfer.

### The gosub and return statements

    GO SUB line-number 
    RETURN

allow for subroutine calls.

### The on-goto-statement

    ON expression GO TO line-number, ..., line-number

allows control to be transferred to a selected line.

### The stop-statement

    STOP

allows for program termination.

## Syntax

1. goto-statement = GO space* TO line-number 
2. if-then-statement = IF relational-expression THEN line-number  
3. relational-expression = numeric-expression relation numeric-expression / string-expression equality-relation
   string-expression 
4. relation = equality-relation / less-than-sign / greater-than-sign / not-less / not-greater
5. equality-relation = equals-sign / not-equals  
6. not-less = greater-than-sign equals-sign 
7. not-greater = less-than-sign equals-sign 
8. not-equals = less-than-sign greater-than-sign 
9. gosub-statement = GO space* SUB line-number  
10. return-statement = RETURN 
11. on-goto-statement = ON numeric-expression GO space* TO line-number (comma line-number)*
12. stop-statement = STOP

## Examples

```BASIC
    GO TO 999                   IF X > Y+83 then 200 
    IF A$ <> B$ THEN 550        ON L+1 GO TO 300,400,500
```

## Semantics 
 
A goto-statement indicates that execution of the program is to be continued at the specified line-number.

If the value of the relational-expression in an lf-then-statement is true, then execution of the program shall continue
from the specified line-number; if the value of the relational-expression is false, then execution shall be continued in
sequence i.e. with the statement on the line following that containing the if-then-statement.

The relation "less than or equal to" shall be denoted by `<=`. Similarly, "greater than or equal to" shall be denoted by
`>=`, while "not equal to" shall be denoted by `<>`.

The relation of equality holds between two strings if and only if the two strings have the same length and contain
identical sequences of characters.

The execution of the gosub-statement and the return-statement can be described in terms of a stack of line-numbers (but
may be implemented in some other fashion). Prior to execution of the first gosub-statement by the program, this stack is
empty. Each time a gosub-statement is executed, the line number the gosub-statement is placed on top of the stack and of
the program is continued at the line specified in the gosub-statement. Each time a return-statement is executed, the
line-number on top of the stack is removed from the stack and execution of the program is continued at the line 
following the one with that line-number. 
 
It is not necessary that equal numbers of gosub-statements and return-statements be executed before termination of the 
program.

The expression in an on-goto-statement shall be evaluated and rounded to obtain an integer, whose value is then used to
select a line-number from the list following the GOTO (the line-numbers in the list are indexed from left to right,
starting 1). Execution of the program shall continue at the statement with the selected line-number.

All line-numbers in control-statements shall refer to lines in the program.

The stop-statement causes termination of the program.

## Exceptions

- An attempt is made to execute a return-statement without having executed a corresponding gosub-statement (fatal).
- The integer obtained as the value of an expression in an on-goto-statement is less than one or greater than the number
  of line-numbers in the list (fatal).
---
prev: 12_control_statement.html
next: 14_print_statement.html
---

# FOR and NEXT statements

## General Description

The for-statement and next-statement provide for the construction of loops. The general syntactic form of the 
for-statement and next-statement is

    FOR v = initial-value TO limit STEP increment 
    NEXT v

where "v" is a simple numeric variable and the "initial-value", "limit" and "increment" are numeric expressions; the
clause "STEP increment" is optional. 

## Syntax

1. for-block = for-line for-body 
2. for-body = block next-line 
3. for-line = line-number for-statement end-of-line 
4. next-line = line-number next-statement end-of-line
5. for-statement = `FOR` control-variable equals-sign initial-value `TO` limit (`STEP` increment)? 
6. control-variable = simple-numeric-variable
7. initial-value = numeric-expression 
8. limit = numeric-expression 
9. increment = numeric-expression 
10. next-statement = `NEXT` control-variable 

## Examples

```BASIC
    FOR I = 1 TO 10         FOR I = A TO B STEP -1
    NEXT I                  NEXT I
```

## Semantics

The for-statement and the next-statement are defined in conjunction with each other. The physical sequence of statements 
beginning with a for-statement and continuing up to and including the first next-statement with the same control
variable is termed a "for-block". For-blocks can be physically nested, i.e. one can contain another, but they shall not
be interleaved, i.e. a for-block which contains a for-statement or a next-statement shall contain the entire for-block 
begun or ended by that statement.

Furthermore, physically nested for-blocks shall not use the same control variable. 

In the absence of a `STEP` clause in a for-statement, the increment is assumed to be +1. 

The action of the for-statement and the next-statement is defined in terms of other statements, as follows:

    FOR v = initial-value TO limit STEP increment 
    (block) 
    NEXT v

is equivalent to:

            LET own1 = limit 
            LET own2 = increment 
            LET v = initial-value 
    line1   IF (v-own1) * SGN (own2) > 0 THEN line2 
            (block) 
            LET v = v + own2 
            GOTO line1 
    line2   REM continued in sequence

Here v is any simple-numeric-variable, own1 and own2 are variables associated with the particular for-block and not
accessible to the programmer, and linel and line2 are line-numbers associated with the particular for-block and not
accessible to the programmer. The variables own1 and own2 are distinct from similar variables associated with other
for-blocks. A program shall not transfer control into a for-body by any statement other than a return statement 
(see [12](12_control_statement.md)).

##  Exceptions

None.

## Remarks

Where arithmetic is approximate (as with decimal fractions in a binary machine), the loop will be executed within the
limits of machine arithmetic. No presumptions about approximate achievement of the end test are made. It is noted that
in most ordinary situations where machine arithmetic is truncated (rather than rounded), such constructions as 

    FOR X = 0 TO 1 STEP 0.1 

will work as the user expects, even though 0.1 is not representable exactly in a binary machine. If this is indeed the
case, then the construction 

    FOR X = 1 TO 0 STEP -0.1 

will probably not work as expected.

As specified above, the value of the control-variable upon exit from a for-block via its next-statement is the first 
value not used; if exit is via a control-statement, the control variable retains the value it has when the
control-statement is executed.

The variables "own1" and "own2" associated with a for-block are assigned values only upon entry to the for-block through
its for-statement.
---
prev: 13_for_and_next_statements.html
next: 15_input_statement.html
---

# Print Statement

## General Description

The print-statement is designed for generation of tabular out¬ put in a consistent format.

The general syntactic form of the print-statement is

  PRINT item p item p ... p item
  
where each item is an expression, a tab-call, or null, and each punctuation mark p is either a comma or a semi-colon.

## Syntax

1. print-statement      = `PRINT` print-list?
2. print-list           = (print-item? print-separator)* print-item?
3. print-item           = expression / tab-call
4. tab-call             = `TAB` left-parenthesis numeric-expression right-parenthesis
5. print-separator      = comma / semicolon

## Examples

```BASIC
    PRINT X                         PRINT "X EQUALS", 10
    PRINT X; (Y+Z)/2                PRINT X, Y
    PRINT                           PRINT ,,,X
    PRINT TAB(10); A$; "IS DONE."
```

## Semantics

The execution of a print-statement generates a string of characters for transmission to an external device. This string 
of characters is determined by the successive evaluation of each print-item and print-separator in the print-list.

Numeric-expressions shall be evaluated to produce a string of characters consisting of a leading space if the number is
positive or a leading minus-sign if the number is negative followed by the decimal representation of the absolute value
of the number and a trailing space. The possible formats for the decimal representation of a number are the same as 
those described for numeric-constants in [6](6_constants.md) and are used as follows.

Each implementation shall define two quantities, a significance-width d to control the number of significant decimal 
digits printed in numeric representations, and an exrad-width e to control the number of digits printed in the exrad
component of a numeric representation. The value of d shall be at least six and the value of e shall be at least two.

Each number that can be represented exactly as an integer with d or fewer decimal digits is output using the implicit 
point unsealed representation.

All other numbers shall be output using either explicit point unsealed notation or explicit point scaled notation.
Numbers which can be represented with d or fewer digits in the unsealed format no less accurately than they can be
represented in the scaled format shall be output using the unsealed format. For example, if d = 6, then 10<sup>-6</sup>
is output as .000001 and 10<sup>-7</sup> is output as l.E-7.

Numbers represented in the explicit point unsealed notation shall be output with up to d significant decimal digits and
a full-stop; trailing zeroes in the fractional part may be omitted. A number with magnitude less than 1 shall be
represented with no digits to the left of the full-stop. This form requires up to d+3 characters counting the sign, the 
full-stop and the trailing space.

Numbers represented in the explicit point scaled notation shall be output in the format

    significand E sign integer

where the value x of the significand is in the range 1 <= x < 10 and is to be represented with exactly d digits of
precision, and where the exrad component has one to e digits. Trailing zeroes may be omitted in the fractional part of
the significand and leading zeroes may be omitted from the exrad. This form requires up to d+e+5 characters counting the
two signs, the full-stop, the "E" and a trailing space.

String-expressions shall be evaluated to generate a string of characters.

The evaluation of the semicolon separator shall generate the null string, i.e. a string of zero length.

The evaluation of a tab-call or a comma separator depends upon the string of characters already generated by the current or previous print-statements. The "current line" is the (possibly empty) string of characters generated since the last end-of- line was generated. The "margin" is the number of characters, excluding the end-of-line character, that can be output on one line and is defined by the implementation. The "columnar position" of the current line is the print position that will be occupied by the next character output to that line; print positions are numbered consecutively from the left, starting with position one.

Each print-line is divided into a fixed number of print zones, where the number of zones and the length of each zone is implementation defined. All print zones, except possibly the last one on a line, shall have the same length. This length shall be at least d+e+6 characters in order to accomodate the printing of numbers in explicit point scaled notation as described above and to allow the comma separator to move the printing mechanism to the next zone as described below.

The purpose of the tab-call is to set the columnar position of the current line to the specified value prior to printing the next print-item. More precisely, the argument of the tab-call is evaluated and rounded to the nearest integer n. If n is less than one, an exception occurs. If n is greater than the margin m, then n is reduced by an integral multiple of m so that it is in the range 1 <= n <= m; i.e. n is set equal to

    n - m * INT ((n-l)/m).
  
If the columnar position of the current line is less than or equal to n, then spaces are generated, if necessary, to set
the columnar position to n; if the columnar position of the current line is greater than n, then an end-of-line is
generated followed by enough spaces to set the columnar position of the new current line to n.

The evaluation of the comma-separator generates one or more spaces to set the columnar position to the beginning of the
next print zone, unless the current print zone is the last on the line, in which case an end-of-line is generated.

If the print list does not end in a print-separator, then an end-of-line is generated and added to the characters 
generated by the evaluation of the print-list.

If the evaluation of any print-item in a print-list would cause the length of a nonempty line to exceed the margin, then
an end-of-line is generated prior to the characters generated by that print-item. Subsequently, if the evaluation of a
print-item generates a string whose length is greater than the margin, then end-of-lines are inserted after every m
characters in the string, where m is the margin value.

## Exceptions

The evaluation of a tab-call argument generates a value less than one (nonfatal: the recommended recovery procedure is
to supply one and continue).

## Remarks

The comma-separator allows the programmer to tabulate the printing mechanism to fixed tab settings at the end of each
print zone.

A completely empty print-list will generate an end-of-line, thereby completing the current line of output. If this line 
contained no characters, then a blank line results.

A print line on a typical terminal might be divided into five print zones of fifteen print positions each.
---
prev: 14_print_statement.html
next: 16_read_and_restore_statements.html
---

# Input Statement

## General Description

Input-statements provide for user interaction with a running program by allowing variables to be assigned values that 
are supplied by a user. The input-statement enables the entry of mixed string and numeric data, with data items being
separated by commas. The general syntactic form of the input-statement is

    INPUT variable, ..., variable

## Syntax

1. input-statement    = `INPUT` variable-list 
2. variable-list      = variable (comma variable)*
3. input-prompt       = [implementation-defined]
4. input-reply        = input-list end-of-line
5. input-list         = padded-datum (comma padded-datum)*
6. padded-datum       = space* datum space*
7. datum              = quoted-string / unquoted-string

## Examples

```BASIC
    INPUT X       INPUT X, A$, Y(2)      INPUT A, B, C
    3.14159       2,SMITH,-3             25,0 ,-15
```

## Semantics

An input-statement causes the variables in the variable-list to be assigned, in order, values from the input-reply. In
the interactive mode, the user of the program is informed of the need to supply data by the output of an input-prompt.
In batch mode, the input-reply is requested from the external source by an implementation-defined means. Execution of 
the program is suspended until a valid input-reply has been supplied.

The type of each datum in the input-reply shall correspond to the type of the variable to which it is to be assigned;
i.e. , numeric-constants shall be supplied as input for numeric-variables, and either quoted-strings or unquoted-strings
shall be supplied as input for string-variables. If the response to input for a string-variable is an unquoted-string,
leading and trailing spaces shall be ignored (see [4](4_characters_and_strings.md)).

If the evaluation of a numeric datum causes an underflow, then its value shall be replaced by zero.

Subscript expressions in the variable-list are evaluated after values have been assigned to the variables preceding them
(i.e. to the left of them) in the variable-list.

No assignment of values in the input-reply shall take place un¬ til the input-reply has been validated with respect to
the type of each datum, the number of input items, and the allowable range for each datum.

## Exceptions

- The type of datum does not match the type of the variable to which it is to be assigned (nonfatal, the recommended
  recovery procedure is to request that the input-reply be re-supplied).
- There is insufficient data in the input-list (nonfatal, the recommended recovery procedure is to request that the
  input-reply be resupplied).
- There is too much data in the input-list (nonfatal, the recommended recovery procedure is to request that the
  input-reply be resupplied).
- The evaluation of a numeric datum causes an overflow (non-fatal, the recommended recovery procedure is to request that
  the input-reply be resupplied).
- A string datum contains too many characters (nonfatal, the recommended recovery procedure is to request that the
  input-reply he resupplied).

## Remarks

This Standard does not require an implementation to perform any editing of the input-reply, though such editing may be 
performed by the operating environment.

It is recommended that the input-prompt consists of a question-mark followed by a single space.

This Standard does not require an implementation to output the input-reply.

It is recommended that implementations report an underflow as an exception and allow the input-reply to be resupplied.
---
prev: 15_input_statement.html
next: 17_data_statement.html
---

# READ and RESTORE Statements

## General Description

The read-statement provides for the assignment of values to variables from a sequence of data created from
data-statements (see [17](17_data_statement.md)). The restore-statement allows the data in the program to be reread. The
general syntactic forms of the read and restore statements are

    READ variable, ..., variable 
    RESTORE

## Syntaxe

1. read-statement       = `READ` variable-list
2. restore-statement    = `RESTORE`

## Examples

```BASIC
    READ X, Y, Z        READ X(l), A$, C
```

## Semantics

The read-statement causes variables in the variable-list to be assigned values, in order, from the sequence of data
(see [17](17_data_statement.md)). A conceptual pointer is associated with the data sequence. At the initiation of
execution of a program, this pointer points to the first datum in the data sequence. Each time a read-statement is
executed, each variable in the variable-list in sequence is assigned the value of the datum indicated by the pointer and
the pointer is advanced to point beyond that datum.

The restore-statement resets the pointer for the data sequence to the beginning of the sequence, so that the next
read-statement executed will read data from the beginning of the sequence once again.

The type of a datum in the data sequence shall correspond to the type of the variable to which it is to be assigned;
i.e., numeric-variables require unquoted-strings which are numeric-constants as data and string-variables require
quoted-strings or unquoted-strings as data. An unquoted-string which is a valid numeric representation may be assigned
to either a string-variable or a numeric-variable by a read-statement. 

If the evaluation of a numeric datum causes an underflow, then its value shall be replaced by zero. 

Subscript expressions in the variable-list are evaluated after values have been assigned to the variables preceding them
(i.e. to the left of them) in the list.

## Exceptions

- The variable-list in a read-statement requires more data than are present in the remainder of the data-sequence
  (fatal).
- An attempt is made to assign a string datum to a numeric variable (fatal).
- The evaluation of a numeric datum causes an overflow (non-fatal, the recommended recovery procedure is to supply
  machine infinity with the appropriate sign and continue). 
- A string datum contains too many characters (fatal). 

## Remarks

It is recommended that implementations report an underflow as exception and continue.
---
prev: 16_read_and_restore_statements.html
next: 18_array_declarations.html
---

# Data Statement 

## General Description 

The data-statement provides for the creation of a sequence of representations for data elements for use by the
read-statement. The general syntactic form of the data-statement is 

    DATA datum, ..., datum

where each datum is either a numeric constant, a string-constant or an unquoted string.

## Syntax

1. data-statement   = `DATA` data-list  
2. data-list        = datum (comma datum)*
 
## Examples

```BASIC
DATA 3.14159, PI, 5E-10, ","
```

## Semantics

Data from the totality of data-statements in the program are collected into a single data sequence. The order in which
data appear textually in the totality of all data-statements determines the order of the data in the data sequence.

If the execution of a program reaches a line containing a data-statement, then it shall proceed to the next line with no
other effect.

## Exceptions

None.
---
prev: 17_data_statement.html
next: 19_remark_statement.html
---

# Array declarations

## General Description

The dimension-statement is used to reserve space for arrays. Unless declared otherwise, all array subscripts shall have
a lower bound of zero and an upper bound of ten. Thus the default space allocation reserves space for 11 elements in
one-dimensional arrays and 121 elements in two-dimensional arrays. By use of a dimension-statement, the subscript(s) of
an array may be declared to have an upper bound other than ten. By use of an option-statement, the subscripts of all
arrays may be declared to have a lower bound of one.

The general syntactic form of the dimension-statement is

    DIM declaration, ..., declaration

where each declaration has the form

        letter (integer)
    or  letter (integer , integer)

The general syntactic form of the option-statement is

    OPTION BASE n

where n is either 0 or 1.

## Syntax

1. dimension-statement      = `DIM` array declaration (comma array-declaration)* 
2. array-declaration        = numeric-array-name left-parenthesis bounds right-parenthesis
3. bounds                   = integer (comma integer)?
4. option-statement         = `OPTION BASE` (0/1)          
 
## Examples

```BASIC
DIM A (6), B(10,10)
```

## Semantics

Each array-declaration occurring in a dimension-statement declares the array named to be either one or two dimensional
according to whether one or two bounds are listed for the array. In addition, the hounds specify the maximum values that
subscript expressions for the array can have.

The declaration for an array, if present at all, shall occur in a lower numbered line than any reference to an element
of that array. Arrays that are not declared in any dimension-statement are declared implicitly to be one or
two dimensional according to their use in the program, and to have subscripts with a maximum value of ten
(see [7](7_variables.md)). 

The option-statement declares the minimum value for all array subscripts; if no option-statement occurs in a program,
this minimum is zero. An option-statement, if present at all, must occur in a lower numbered line than any 
dimension-statement or any reference to an element of an array. If an option-statement specifies that the lower bound
for array subscripts is one, the no dimension-statement in the program may specify an upper bound of zero. A program may
contain at most one option-statement. 

If the execution of a program reaches a line containing a dimension-statement or an option-statement, then it shall
proceed to the next line with no other effect.

An array can be explicitly dimensioned only once.

## Exceptions 

None.
---
prev: 18_array_declarations.html
next: 20_randomize_statement.html
---

# Remark Statement

## General Description

The remark-statement allows program annotation. 

## Syntax
 
1. remark-statement     = `REM` remark-string

## Examples

```BASIC
REM FINAL CHECK 
```

## Semantics

If the execution of a program reaches a line containing a remark-statement, then it shall proceed to the next line with
no other effect.

## Exceptions

None.
---
prev: 19_read_and_restore_statements.html
next: T1_basic_code.html
---

# Randomize Statement

## General Description

The randomize-statement overrides the implementation-predefined sequence of pseudo-random numbers as values for the 
`RND` function, allowing different (and unpredictable) sequences each time a given program is executed.

## Syntax

1. randomize-statement      = `RANDOMIZE`

## Examples 
```BASIC
RANDOMIZE
``` 

## Semantics

Execution of the randomize-statement shall generate a new unpredictable starting point for the list of pseudo-random
numbers used by the `RND` function (see [9](9_implementation_supplied_functions.md)).

## Exceptions 

None. 

## Remarks

In the case of implementations which do not have access to a randomizing device such as a real-time clock, the 
randomize-statement may be implemented by means of an interaction with the user.
---
prev: 20_randomize_statement.html
next: T2_basic_character_set.html
---

# Table 1

| Name               | Graphic           |
|--------------------|:-----------------:|
| Space              | ` `               |
| Exclamation-mark   | `!`               |
| Quotation-mark     | `"`               |
| Number-sign        | `#`               |
| Dollar-sign        | `$`               |
| Percent-sign       | `%`               |
| Ampersand          | `&`               |
| Apostrophe         | `'`               |
| Left-parenthesis   | `(`               |
| Right-parenthesis  | `)`               |
| Asterisk           | `*`               |
| Plus-sign          | `+`               |
| Comma              | `,`               |
| Minus-sign         | `-`               |
| Full-stop          | `.`               |
| Solidus            | `/`               |
| Digits             | `0` - `9`         |
| Colon              | `:`               |
| Semi-colon         | `;`               |
| Less-than-sign     | `<`               |
| Equals-sign        | `=`               |
| Greater-than-sign  | `>`               |
| Question-mark      | `?`               |
| Letters            | `A` - `Z`         |
| Circumflex-accent  | `^`               |
| Underline          | `_`               |
---
prev: T1_basic_code.html
next: A1_organisation_of_the_standard.html
---

# Table 2

<table>
<tr><td colspan="5"></td><td>b<sub>7</sub></td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td colspan="5"></td><td>b<sub>6</sub></td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td colspan="5"></td><td>b<sub>5</sub></td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td colspan="5"></td><td></td><th rowspan="2">0</th><th rowspan="2">1</th><th rowspan="2">2</th><th rowspan="2">3</th><th rowspan="2">4</th><th rowspan="2">5</th><th rowspan="2">6</th><th rowspan="2">7</th></tr>
<tr><td>b4</td><td>b<sub>3</sub></td><td>b<sub>2</sub></td><td>b<sub>1</sub></td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><th colspan="2">0</th><td>NUL</td><td>DLE</td><td>SP</td><td>0</td><td>@</td><td>P</td><td>`</td><td>p</td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>1</td><th colspan="2">1</th><td>SOH</td><td>DC<sub>1</sub></td><td>!</td><td>1</td><td>A</td><td>Q</td><td>a</td><td>q</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><th colspan="2">2</th><td>STX</td><td>DC<sub>2</sub></td><td>"</td><td>2</td><td>B</td><td>R</td><td>b</td><td>r</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td><th colspan="2">3</th><td>ETX</td><td>DC<sub>3</sub></td><td>#</td><td>3</td><td>C</td><td>S</td><td>c</td><td>s</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><th colspan="2">4</th><td>EOT</td><td>DC<sub>4</sub></td><td>$/¤</td><td>4</td><td>D</td><td>T</td><td>d</td><td>t</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><th colspan="2">5</th><td>ENQ</td><td>NAK</td><td>%</td><td>5</td><td>E</td><td>U</td><td>e</td><td>u</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><th colspan="2">6</th><td>ACK</td><td>SYN</td><td>&</td><td>6</td><td>F</td><td>V</td><td>f</td><td>v</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><th colspan="2">7</th><td>BEL</td><td>ETB</td><td>'</td><td>7</td><td>G</td><td>W</td><td>g</td><td>w</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><th colspan="2">8</th><td>BS</td><td>CAN</td><td>(</td><td>8</td><td>H</td><td>X</td><td>h</td><td>x</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><th colspan="2">9</th><td>HT</td><td>EM</td><td>)</td><td>9</td><td>I</td><td>Y</td><td>i</td><td>y</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><th colspan="2">10</th><td>LF</td><td>SUB</td><td>*</td><td>:</td><td>J</td><td>Z</td><td>j</td><td>z</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><th colspan="2">11</th><td>VT</td><td>ESC</td><td>+</td><td>;</td><td>K</td><td>[</td><td>k</td><td>{</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><th colspan="2">12</th><td>FF</td><td>FS</td><td>,</td><td>&lt;</td><td>L</td><td>\</td><td>l</td><td>|</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><th colspan="2">13</th><td>CR</td><td>GS</td><td>-</td><td>=</td><td>M</td><td>]</td><td>m</td><td>}</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><th colspan="2">14</th><td>SO</td><td>RS</td><td>.</td><td>&gt;</td><td>N</td><td>^</td><td>n</td><td>~</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><th colspan="2">15</th><td>SI</td><td>US</td><td>/</td><td>?</td><td>O</td><td>_</td><td>o</td><td>DEL</td></tr>
</table>

<div class="note info">
<h3>Note:</h3>
<p>In the 7-bit and in the 8-bit code tables two characters are allocated to pos. 2/4, namely $ and h. In any version of
the codes a single character is to be allocated to this position. The character of the 7-bit or of the 8-bit coded
character set, which corresponds to the character $ of the Minimal BASIC character set is either $ or ¤ (¤ in the
International Reference Version).</p>
<p>The same applies to pos. 2/3 for the characters £ and #, the latter being the character of the International
Reference Version.</p>
</div>
---
prev: T2_basic_character_set.html
next: A2_method_of_syntax_specification.html
---

# Appendix 1<br>Organization of the Standard

This Standard is organized into a number of sections, each of which covers a particular feature of BASIC. Sections 4 to
20 are divided into sub-sections, as follows. 

## Sub-section 1. General Description

This sub-section briefly describes the features of BASIC to be treated and indicates the general syntactic form of these
features. 

## Sub-section 2. Syntax 

The exact syntax of features of the language is described in a modified context-free grammar or Backus-Naur Form. The
details of this method of syntax specification are described in [Appendix 2](A2_method_of_syntax_specification). 

In order to keep the syntax reasonably simple the syntax specification will allow it to describe some constructions 
which, strictly speaking, are not legal according to this Standard, e.g. it will allow the generation of the statement

```BASIC
100 LET X = A( 1) + A( 1,2 )
``` 

in which the array A occurs with differing numbers of subscripts, Rather than ruling such constructions out by a more
complicated syntax, this Standard shall instead rule them out in the semantics. 

## Sub-section 3. Examples 

A short list of valid examples that can be generated by certain of the syntax equations in sub-section 2 is given. 

## Sub-section 4. Semantics 

The semantic rules in this Standard serve two purposes. First, they rule out certain constructions which are permitted
by the syntax, but which have no valid meaning according to this Standard. Second, they assign a meaning to the
remaining constructions. 

## Sub-section 5. Exceptions 

An exception occurs when an implementation recognizes that a program may not perform or is not performing in accordance
with this Standard. All exceptions described in this section shall be reported unless some mechanism is provided in an
enhancement to this Standard that has been invoked by the user to handle exceptions. 

Where indicated, certain exceptions may be handled by the specified procedures; if no procedure is given, or if
restrictions imposed by the hardware or the operating environment make it impossible to follow the given procedures,
then the exception must be handled by terminating the program. Enhancements to this Standard may describe mechanisms for
controlling the manner in which exceptions are reported and handled, but no such mechanisms are specified in this 
Standard. 

This Standard does not specify an order in which exceptions shall be detected or processed. 

## Sub-section 6. Remarks

This sub-section contains remarks which point out certain features of this Standard as well as remarks which make
recommendations concerning the implementation of a BASIC language processor in an operating environment.
---
prev: A1_organisation_of_the_standard.html
next: A3_conformance.html
---

# Appendix 2<br>Method of Syntax Specification

The syntax, through a series of rewriting rules known as "productions", defines syntactic objects of various types, such
as "program" or "expression", and describes which strings of symbols are objects of these types. 

In the syntax, upper-case letters, digits, and (possibly hyphenated) lower-case words are used as "metanames", i.e. as
names of syntactic objects. Most of these metanames are defined by rewriting rules in terms of other metanames. In order
that this process terminate, certain metanames are designated as "terminal" metanames, and rewriting rules for them are
not included in the syntax. All terminal metanames occur for the first time and are defined in 
[Section 4](4_characters_and_strings.md). It should be noted in particular that all upper-case letters are terminal 
metanames which denote themselves. 

We illustrate further details of the syntax by considering some examples. In [Section 12](12_control_statement.md) we
find the production 

    gosub-statement = GO space* SUB line-number

which indicates that a "gosub-statement" consists of the letters G, O, any number of spaces, S, U, and B followed by a 
line number.

What is a "line-number"? In [Section 5](5_programs.md), the production 

    line-number = digit digit? digit? digit?

indicates that a "line-number" is a "digit" followed by up to three other "digits" (the question mark is a syntactic 
operator indicating that the object it follows may or may not be present). 

What is a "digit"? [Section 4](4_characters_and_strings.md), the production

    digit = 0/1/2/3/4/5/6/7/8/9 

indicates that a "digit" is either a "0", a "1", ... or a "9" (the solidus is a syntactic operator meaning "or" and is
used to indicate that a metaname can be rewritten in one of several ways). Since the digits are terminal metanames (i.e.
they do not occur on the left-hand side of any production), our decipherment of the syntax for the "gosub-statement"
comes to an end. The semantics in [Section 4](4_characters_and_strings.md) identify the digits in terms of the 
characters they represent.

An asterisk is a syntactic operator like the question-mark, and it indicates that the object it follows may occur any
number of times, including zero times, in the production. 

For example

    integer = digit digit*

indicates that an "integer" is a "digit" followed by an arbitrary number of other "digits".

Parentheses may be used to group sequences of metanames together. 

For example

    variable-list = variable (comma variable)* 

defines a "variable-list" to consist of a "variable" followed by an arbitrary number of other "variables" separated by
"commas". 

When several syntactic operators occur in the same production, the operators "?" and "*" take precedence over the
operator "/". 

Spaces in the syntax are used to separate hyphenated lower-case words from each other. Special conventions are observed
regarding spaces in BASIC programs (see [Section 5](5_programs.md)). The syntax as described generates programs which
contain no spaces other than those occurring in remarks, in certain string constants, or where the presence of a space
is explicitly indicated by the metaname "space". 

Additional spaces may be inserted to improve readability provided that the restrictions imposed in 
[Section 5](5_programs.md) are observed.
---
prev: A2_method_of_syntax_specification.html
next: A4_implementation_defined_features.html
---

# Appendix 3<br>Conformance

There are two aspects of conformance to this language Standard : conformance by a program written in the language, and
conformance by an implementation which processes such programs. 

A program is said to conform to this Standard only when 

- each statement contained therein is a syntactically valid instance of a statement specified in this Standard, 
- each statement has an explicitly valid meaning specified herein, and
- the totality of statements compose an instance of a valid program which has an explicitly valid meaning specified 
  herein. 

An implementation is said to conform to this Standard only when 

- it accepts and processes programs conforming to this Standard,
- it reports reasons for rejecting any program which does not conform to this Standard,
- it interprets errors and exceptional circumstances according to the specifications of this Standard,
- its interpretation of the semantics of each statement of a standard-conforming program conforms to the specification 
  in this Standard, 
- its interpretation of the semantics of a standard-conforming program as a whole conforms to the specifications in this
  Standard,
- it accepts as input, manipulates, and can generate as output numbers of at least the precision and range specified in
  this Standard, and
- it is accompanied by a reference manual which clearly defines the actions taken in regard to features which are called 
  "undefined" or "implementation-defined" in this Standard.

This Standard does not include requirements for reporting specific syntactic errors in the text of a program.
Implementations conforming to this Standard may accept programs written in an enhanced language without having to report
all constructs not conforming to this Standard. However, whenever a statement or other program element does not conform 
to the syntactic rules given herein, either an error shall be reported or the statement or other program element shall 
have an implementation-defined meaning.
---
prev: A3_conformance.html
---

# Appendix 4<br>Implementation-defined Features

A number of the features defined in this Standard have been left for definition by the implementor. However, this will
not affect portability, provided that the limits recommended in the various sections are respected. The way these
features are implemented shall be defined in the user- or system-manual of the specific implementation.

The following is a list of implementation-defined features: 

- accuracy of evaluation of numeric expressions (see [8](8_expressions.md))
- end-of-line (see [5](5_programs.md), [14](14_print_statement.md) and [15](15_input_statement.md))
- exrad-width for printing numeric representations (see [14](14_print_statement.md))
- initial value of variables (see [7](7_variables.md))
- input-prompt (see [15](15_input_statement.md))
- longest string that can be retained (see [11](11_let_statement.md))
- value of machine infinitesimal (see [6](6_constants.md))
- value of machine infinity (see [6](6_constants.md))
- margin for output lines (see [14](14_print_statement.md))
- precision for numeric values (see [6](6_constants.md))
- print-zone length (see [14](14_print_statement.md))
- pseudo-random number sequence (see [9](9_implementation_supplied_functions.md) and [20](20_randomize_statement.md))
- significance width for printing numeric representations (see [15](15_input_statement.md))
- means of requesting the input-reply in batch mode (see [15](15_input_statement.md))
