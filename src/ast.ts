/**
 * Abstract Syntax Tree node types for ECMA-55 Minimal BASIC
 */

// ============================================================================
// Base Types
// ============================================================================

export type ASTNode = Statement | Expression | Variable;

export interface SourceLocation {
  readonly lineNumber: number;
  readonly column: number;
}

// ============================================================================
// Program Structure
// ============================================================================

export interface Program {
  readonly type: "Program";
  readonly lines: ProgramLine[];
}

export interface ProgramLine {
  readonly type: "ProgramLine";
  readonly lineNumber: number;
  readonly statement: Statement;
  readonly location: SourceLocation;
}

// ============================================================================
// Statements (Section 5, 11-20)
// ============================================================================

export type Statement =
  | LetStatement
  | PrintStatement
  | InputStatement
  | IfThenStatement
  | GotoStatement
  | GosubStatement
  | ReturnStatement
  | OnGotoStatement
  | ForStatement
  | NextStatement
  | ReadStatement
  | RestoreStatement
  | DataStatement
  | DimStatement
  | DefStatement
  | OptionStatement
  | RandomizeStatement
  | RemarkStatement
  | StopStatement
  | EndStatement;

// Section 11: LET statement
export interface LetStatement {
  readonly type: "LetStatement";
  readonly variable: Variable;
  readonly expression: Expression;
  readonly location: SourceLocation;
}

// Section 14: PRINT statement
export interface PrintStatement {
  readonly type: "PrintStatement";
  readonly items: PrintItem[];
  readonly location: SourceLocation;
}

export type PrintItem = 
  | { readonly type: "Expression"; readonly value: Expression }
  | { readonly type: "TabCall"; readonly argument: NumericExpression }
  | { readonly type: "Separator"; readonly value: "," | ";" };

// Section 15: INPUT statement
export interface InputStatement {
  readonly type: "InputStatement";
  readonly variables: Variable[];
  readonly location: SourceLocation;
}

// Section 12: Control statements
export interface IfThenStatement {
  readonly type: "IfThenStatement";
  readonly condition: RelationalExpression;
  readonly thenLineNumber: number;
  readonly location: SourceLocation;
}

export interface GotoStatement {
  readonly type: "GotoStatement";
  readonly targetLineNumber: number;
  readonly location: SourceLocation;
}

export interface GosubStatement {
  readonly type: "GosubStatement";
  readonly targetLineNumber: number;
  readonly location: SourceLocation;
}

export interface ReturnStatement {
  readonly type: "ReturnStatement";
  readonly location: SourceLocation;
}

export interface OnGotoStatement {
  readonly type: "OnGotoStatement";
  readonly expression: NumericExpression;
  readonly lineNumbers: readonly number[];
  readonly location: SourceLocation;
}

export interface StopStatement {
  readonly type: "StopStatement";
  readonly location: SourceLocation;
}

export interface EndStatement {
  readonly type: "EndStatement";
  readonly location: SourceLocation;
}

// Section 13: FOR and NEXT statements
export interface ForStatement {
  readonly type: "ForStatement";
  readonly controlVariable: SimpleNumericVariable;
  readonly initialValue: NumericExpression;
  readonly limit: NumericExpression;
  readonly step: NumericExpression | null; // null means default +1
  readonly location: SourceLocation;
}

export interface NextStatement {
  readonly type: "NextStatement";
  readonly controlVariable: SimpleNumericVariable;
  readonly location: SourceLocation;
}

// Section 16: READ and RESTORE statements
export interface ReadStatement {
  readonly type: "ReadStatement";
  readonly variables: Variable[];
  readonly location: SourceLocation;
}

export interface RestoreStatement {
  readonly type: "RestoreStatement";
  readonly location: SourceLocation;
}

// Section 17: DATA statement
export interface DataStatement {
  readonly type: "DataStatement";
  readonly constants: readonly (number | string)[];
  readonly location: SourceLocation;
}

// Section 18: DIM statement
export interface DimStatement {
  readonly type: "DimStatement";
  readonly arrays: readonly ArrayDeclaration[];
  readonly location: SourceLocation;
}

export interface ArrayDeclaration {
  readonly arrayName: string; // Single letter
  readonly dimensions: readonly number[]; // 1 or 2 dimensions
}

// Section 10: DEF statement
export interface DefStatement {
  readonly type: "DefStatement";
  readonly functionName: string; // FN + letter
  readonly parameter: SimpleNumericVariable;
  readonly expression: NumericExpression;
  readonly location: SourceLocation;
}

// OPTION BASE statement
export interface OptionStatement {
  readonly type: "OptionStatement";
  readonly base: 0 | 1; // Array subscript lower bound
  readonly location: SourceLocation;
}

// Section 20: RANDOMIZE statement
export interface RandomizeStatement {
  readonly type: "RandomizeStatement";
  readonly location: SourceLocation;
}

// Section 19: REM statement
export interface RemarkStatement {
  readonly type: "RemarkStatement";
  readonly comment: string;
  readonly location: SourceLocation;
}

// ============================================================================
// Variables (Section 7)
// ============================================================================

export type Variable = 
  | SimpleNumericVariable
  | NumericArrayElement
  | StringVariable;

// Simple numeric variable: letter + optional digit (A, A5, X9)
export interface SimpleNumericVariable {
  readonly type: "SimpleNumericVariable";
  readonly name: string; // 1-2 characters: letter or letter+digit
  readonly location: SourceLocation;
}

// Numeric array element: letter(subscript) or letter(subscript, subscript)
export interface NumericArrayElement {
  readonly type: "NumericArrayElement";
  readonly arrayName: string; // Single letter
  readonly subscripts: readonly NumericExpression[]; // 1 or 2 subscripts
  readonly location: SourceLocation;
}

// String variable: letter + dollar sign (A$, B$)
export interface StringVariable {
  readonly type: "StringVariable";
  readonly name: string; // letter + "$"
  readonly location: SourceLocation;
}

// ============================================================================
// Expressions (Section 8)
// ============================================================================

export type Expression = NumericExpression | StringExpression;

export type NumericExpression =
  | NumberLiteral
  | SimpleNumericVariable
  | NumericArrayElement
  | UnaryExpression
  | BinaryExpression
  | FunctionCall;

export type StringExpression =
  | StringLiteral
  | StringVariable;

// Section 6: Numeric constant
export interface NumberLiteral {
  readonly type: "NumberLiteral";
  readonly value: number;
  readonly location: SourceLocation;
}

// Section 6: String constant
export interface StringLiteral {
  readonly type: "StringLiteral";
  readonly value: string;
  readonly location: SourceLocation;
}

// Unary expression: -X, +X
export interface UnaryExpression {
  readonly type: "UnaryExpression";
  readonly operator: "+" | "-";
  readonly operand: NumericExpression;
  readonly location: SourceLocation;
}

// Binary expression: addition, subtraction, multiplication, division, involution
export interface BinaryExpression {
  readonly type: "BinaryExpression";
  readonly operator: "+" | "-" | "*" | "/" | "^";
  readonly left: NumericExpression;
  readonly right: NumericExpression;
  readonly location: SourceLocation;
}

// Relational expression (for IF-THEN)
export type RelationalExpression =
  | NumericRelationalExpression
  | StringRelationalExpression;

export interface NumericRelationalExpression {
  readonly type: "NumericRelationalExpression";
  readonly operator: "=" | "<>" | "<" | ">" | "<=" | ">=";
  readonly left: NumericExpression;
  readonly right: NumericExpression;
  readonly location: SourceLocation;
}

export interface StringRelationalExpression {
  readonly type: "StringRelationalExpression";
  readonly operator: "=" | "<>"; // Only equality/inequality for strings
  readonly left: StringExpression;
  readonly right: StringExpression;
  readonly location: SourceLocation;
}

// Section 9: Implementation-supplied functions
export type BuiltInFunction =
  | "ABS" | "ATN" | "COS" | "EXP" | "INT" 
  | "LOG" | "RND" | "SGN" | "SIN" | "SQR" | "TAN";

export interface FunctionCall {
  readonly type: "FunctionCall";
  readonly functionName: BuiltInFunction | string; // Built-in or user-defined (FN+letter)
  readonly argument: NumericExpression | null; // RND has no argument
  readonly location: SourceLocation;
}
