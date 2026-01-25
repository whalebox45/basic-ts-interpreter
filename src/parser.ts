/**
 * Parser for ECMA-55 Minimal BASIC
 * Converts token stream to Abstract Syntax Tree
 */

import type { Token, TokenType } from "./lexer.js";
import type {
  Program,
  ProgramLine,
  Statement,
  Expression,
  NumericExpression,
  StringExpression,
  Variable,
  RelationalExpression,
  PrintItem,
  LetStatement,
  PrintStatement,
  InputStatement,
  IfThenStatement,
  GotoStatement,
  GosubStatement,
  ReturnStatement,
  OnGotoStatement,
  ForStatement,
  NextStatement,
  ReadStatement,
  RestoreStatement,
  DataStatement,
  DimStatement,
  DefStatement,
  OptionStatement,
  RandomizeStatement,
  RemarkStatement,
  StopStatement,
  EndStatement,
  SimpleNumericVariable,
  NumericArrayElement,
  StringVariable,
  NumberLiteral,
  StringLiteral,
  BinaryExpression,
  UnaryExpression,
  FunctionCall,
  SourceLocation,
} from "./ast.js";

export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private currentToken: Token;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentToken = tokens[0];
  }

  // ============================================================================
  // Main parsing method
  // ============================================================================

  public parse(): Program {
    const lines: ProgramLine[] = [];

    while (!this.isAtEnd()) {
      // Skip EOL tokens
      if (this.check("EOL")) {
        this.advance();
        continue;
      }

      if (this.check("EOF")) {
        break;
      }

      lines.push(this.parseProgramLine());
    }

    // Validate: last line must be END
    if (lines.length === 0 || lines[lines.length - 1].statement.type !== "EndStatement") {
      throw new Error("Program must end with END statement");
    }

    return {
      type: "Program",
      lines,
    };
  }

  // ============================================================================
  // Program line parsing
  // ============================================================================

  private parseProgramLine(): ProgramLine {
    // Line must start with line number
    const lineNumber = this.consumeNumber("Expected line number");
    const location = this.currentToken.location;

    const statement = this.parseStatement();

    // Consume EOL or EOF
    if (!this.check("EOF")) {
      this.consume("EOL", "Expected end of line");
    }

    return {
      type: "ProgramLine",
      lineNumber,
      statement,
      location,
    };
  }

  // ============================================================================
  // Statement parsing
  // ============================================================================

  private parseStatement(): Statement {
    const location = this.currentToken.location;

    // Check keyword type
    if (this.check("LET")) return this.parseLetStatement(location);
    if (this.check("PRINT")) return this.parsePrintStatement(location);
    if (this.check("INPUT")) return this.parseInputStatement(location);
    if (this.check("IF")) return this.parseIfThenStatement(location);
    if (this.check("GOTO")) return this.parseGotoStatement(location);
    if (this.check("GOSUB")) return this.parseGosubStatement(location);
    if (this.check("RETURN")) return this.parseReturnStatement(location);
    if (this.check("ON")) return this.parseOnGotoStatement(location);
    if (this.check("FOR")) return this.parseForStatement(location);
    if (this.check("NEXT")) return this.parseNextStatement(location);
    if (this.check("READ")) return this.parseReadStatement(location);
    if (this.check("RESTORE")) return this.parseRestoreStatement(location);
    if (this.check("DATA")) return this.parseDataStatement(location);
    if (this.check("DIM")) return this.parseDimStatement(location);
    if (this.check("DEF")) return this.parseDefStatement(location);
    if (this.check("OPTION")) return this.parseOptionStatement(location);
    if (this.check("RANDOMIZE")) return this.parseRandomizeStatement(location);
    if (this.check("REM")) return this.parseRemarkStatement(location);
    if (this.check("STOP")) return this.parseStopStatement(location);
    if (this.check("END")) return this.parseEndStatement(location);

    throw new Error(`Unexpected token: ${this.currentToken.type} at line ${location.lineNumber}`);
  }

  // LET statement
  private parseLetStatement(location: SourceLocation): LetStatement {
    this.advance(); // consume LET
    const variable = this.parseVariable();
    this.consume("EQUAL", "Expected = in LET statement");
    const expression = this.parseExpression();

    return {
      type: "LetStatement",
      variable,
      expression,
      location,
    };
  }

  // PRINT statement
  private parsePrintStatement(location: SourceLocation): PrintStatement {
    this.advance(); // consume PRINT

    const items: PrintItem[] = [];

    // Empty print list
    if (this.check("EOL") || this.check("EOF")) {
      return { type: "PrintStatement", items, location };
    }

    while (!this.check("EOL") && !this.check("EOF")) {
      // Check for separator first
      if (this.check("COMMA")) {
        items.push({ type: "Separator", value: "," });
        this.advance();
        continue;
      }

      if (this.check("SEMICOLON")) {
        items.push({ type: "Separator", value: ";" });
        this.advance();
        continue;
      }

      // TAB call
      if (this.check("TAB")) {
        this.advance();
        this.consume("LPAREN", "Expected ( after TAB");
        const argument = this.parseNumericExpression();
        this.consume("RPAREN", "Expected ) after TAB argument");
        items.push({ type: "TabCall", argument });
        continue;
      }

      // Expression
      items.push({ type: "Expression", value: this.parseExpression() });
    }

    return { type: "PrintStatement", items, location };
  }

  // INPUT statement
  private parseInputStatement(location: SourceLocation): InputStatement {
    this.advance(); // consume INPUT
    const variables = this.parseVariableList();

    return { type: "InputStatement", variables, location };
  }

  // IF-THEN statement
  private parseIfThenStatement(location: SourceLocation): IfThenStatement {
    this.advance(); // consume IF
    const condition = this.parseRelationalExpression();
    this.consume("THEN", "Expected THEN in IF statement");
    const thenLineNumber = this.consumeNumber("Expected line number after THEN");

    return { type: "IfThenStatement", condition, thenLineNumber, location };
  }

  // GOTO statement
  private parseGotoStatement(location: SourceLocation): GotoStatement {
    this.advance(); // consume GOTO
    const targetLineNumber = this.consumeNumber("Expected line number after GOTO");

    return { type: "GotoStatement", targetLineNumber, location };
  }

  // GOSUB statement
  private parseGosubStatement(location: SourceLocation): GosubStatement {
    this.advance(); // consume GOSUB
    const targetLineNumber = this.consumeNumber("Expected line number after GOSUB");

    return { type: "GosubStatement", targetLineNumber, location };
  }

  // RETURN statement
  private parseReturnStatement(location: SourceLocation): ReturnStatement {
    this.advance(); // consume RETURN
    return { type: "ReturnStatement", location };
  }

  // ON-GOTO statement
  private parseOnGotoStatement(location: SourceLocation): OnGotoStatement {
    this.advance(); // consume ON
    const expression = this.parseNumericExpression();
    this.consume("GOTO", "Expected GOTO after ON expression");

    const lineNumbers: number[] = [];
    lineNumbers.push(this.consumeNumber("Expected line number"));

    while (this.check("COMMA")) {
      this.advance();
      lineNumbers.push(this.consumeNumber("Expected line number after comma"));
    }

    return { type: "OnGotoStatement", expression, lineNumbers, location };
  }

  // FOR statement
  private parseForStatement(location: SourceLocation): ForStatement {
    this.advance(); // consume FOR
    const controlVariable = this.parseSimpleNumericVariable();
    this.consume("EQUAL", "Expected = in FOR statement");
    const initialValue = this.parseNumericExpression();
    this.consume("TO", "Expected TO in FOR statement");
    const limit = this.parseNumericExpression();

    let step: NumericExpression | null = null;
    if (this.check("STEP")) {
      this.advance();
      step = this.parseNumericExpression();
    }

    return { type: "ForStatement", controlVariable, initialValue, limit, step, location };
  }

  // NEXT statement
  private parseNextStatement(location: SourceLocation): NextStatement {
    this.advance(); // consume NEXT
    const controlVariable = this.parseSimpleNumericVariable();

    return { type: "NextStatement", controlVariable, location };
  }

  // READ statement
  private parseReadStatement(location: SourceLocation): ReadStatement {
    this.advance(); // consume READ
    const variables = this.parseVariableList();

    return { type: "ReadStatement", variables, location };
  }

  // RESTORE statement
  private parseRestoreStatement(location: SourceLocation): RestoreStatement {
    this.advance(); // consume RESTORE
    return { type: "RestoreStatement", location };
  }

  // DATA statement
  private parseDataStatement(location: SourceLocation): DataStatement {
    this.advance(); // consume DATA

    const constants: (number | string)[] = [];

    constants.push(this.parseDataConstant());

    while (this.check("COMMA")) {
      this.advance();
      constants.push(this.parseDataConstant());
    }

    return { type: "DataStatement", constants, location };
  }

  private parseDataConstant(): number | string {
    if (this.check("NUMBER")) {
      return this.consumeNumber("Expected number");
    }
    if (this.check("STRING")) {
      const value = this.currentToken.value as string;
      this.advance();
      return value;
    }
    // Unquoted string (identifier)
    if (this.check("IDENTIFIER")) {
      const value = this.currentToken.value as string;
      this.advance();
      return value;
    }
    throw new Error("Expected constant in DATA statement");
  }

  // DIM statement
  private parseDimStatement(location: SourceLocation): DimStatement {
    this.advance(); // consume DIM

    const arrays = [];
    arrays.push(this.parseArrayDeclaration());

    while (this.check("COMMA")) {
      this.advance();
      arrays.push(this.parseArrayDeclaration());
    }

    return { type: "DimStatement", arrays, location };
  }

  private parseArrayDeclaration() {
    const arrayName = this.consume("IDENTIFIER", "Expected array name").value as string;
    this.consume("LPAREN", "Expected ( after array name");

    const dimensions: number[] = [];
    dimensions.push(this.consumeNumber("Expected dimension"));

    if (this.check("COMMA")) {
      this.advance();
      dimensions.push(this.consumeNumber("Expected second dimension"));
    }

    this.consume("RPAREN", "Expected ) after dimensions");

    return { arrayName: arrayName[0], dimensions }; // First letter only
  }

  // DEF statement
  private parseDefStatement(location: SourceLocation): DefStatement {
    this.advance(); // consume DEF
    
    // FNX where X is a letter - now comes as a single IDENTIFIER token
    const functionToken = this.consume("IDENTIFIER", "Expected function name (FN + letter)");
    const functionName = functionToken.value as string;
    
    // Validate it starts with FN
    if (!functionName.startsWith("FN") || functionName.length !== 3) {
      throw new Error(`Invalid function name: ${functionName}. Must be FN followed by a single letter.`);
    }

    this.consume("LPAREN", "Expected ( after function name");
    const parameter = this.parseSimpleNumericVariable();
    this.consume("RPAREN", "Expected ) after parameter");
    this.consume("EQUAL", "Expected = in DEF statement");
    const expression = this.parseNumericExpression();

    return { type: "DefStatement", functionName, parameter, expression, location };
  }

  // OPTION statement
  private parseOptionStatement(location: SourceLocation): OptionStatement {
    this.advance(); // consume OPTION
    this.consume("BASE", "Expected BASE after OPTION");
    const baseValue = this.consumeNumber("Expected 0 or 1 after BASE");

    if (baseValue !== 0 && baseValue !== 1) {
      throw new Error("OPTION BASE must be 0 or 1");
    }

    return { type: "OptionStatement", base: baseValue as 0 | 1, location };
  }

  // RANDOMIZE statement
  private parseRandomizeStatement(location: SourceLocation): RandomizeStatement {
    this.advance(); // consume RANDOMIZE
    return { type: "RandomizeStatement", location };
  }

  // REM statement
  private parseRemarkStatement(location: SourceLocation): RemarkStatement {
    this.advance(); // consume REM
    
    // Collect all remaining tokens until EOL as comment
    let comment = "";
    while (!this.check("EOL") && !this.check("EOF")) {
      comment += this.currentToken.value;
      this.advance();
    }

    return { type: "RemarkStatement", comment, location };
  }

  // STOP statement
  private parseStopStatement(location: SourceLocation): StopStatement {
    this.advance(); // consume STOP
    return { type: "StopStatement", location };
  }

  // END statement
  private parseEndStatement(location: SourceLocation): EndStatement {
    this.advance(); // consume END
    return { type: "EndStatement", location };
  }

  // ============================================================================
  // Expression parsing
  // ============================================================================

  private parseExpression(): Expression {
    // Try numeric expression first
    if (this.isNumericExpressionStart()) {
      return this.parseNumericExpression();
    }

    // String expression
    return this.parseStringExpression();
  }

  private parseNumericExpression(): NumericExpression {
    return this.parseAdditive();
  }

  private parseStringExpression(): StringExpression {
    if (this.check("STRING")) {
      const value = this.currentToken.value as string;
      const location = this.currentToken.location;
      this.advance();
      return { type: "StringLiteral", value, location };
    }

    // String variable
    const variable = this.parseVariable();
    if (variable.type !== "StringVariable") {
      throw new Error("Expected string expression");
    }
    return variable;
  }

  // Additive: term ((+|-) term)*
  private parseAdditive(): NumericExpression {
    let left = this.parseMultiplicative();

    while (this.check("PLUS") || this.check("MINUS")) {
      const operator = this.currentToken.type === "PLUS" ? "+" : "-";
      const location = this.currentToken.location;
      this.advance();
      const right = this.parseMultiplicative();
      left = { type: "BinaryExpression", operator, left, right, location };
    }

    return left;
  }

  // Multiplicative: unary ((*|/) unary)*
  private parseMultiplicative(): NumericExpression {
    let left = this.parseExponentiation();

    while (this.check("MULTIPLY") || this.check("DIVIDE")) {
      const operator = this.currentToken.type === "MULTIPLY" ? "*" : "/";
      const location = this.currentToken.location;
      this.advance();
      const right = this.parseExponentiation();
      left = { type: "BinaryExpression", operator, left, right, location };
    }

    return left;
  }

  // Exponentiation: unary (^ unary)*
  // ECMA-55: Left-associative: 2^3^4 = (2^3)^4
  private parseExponentiation(): NumericExpression {
    let left = this.parseUnary();

    while (this.check("POWER")) {
      const location = this.currentToken.location;
      this.advance();
      const right = this.parseUnary();
      left = { type: "BinaryExpression", operator: "^", left, right, location };
    }

    return left;
  }

  // Unary: (+|-)? primary
  private parseUnary(): NumericExpression {
    if (this.check("PLUS")) {
      const location = this.currentToken.location;
      this.advance();
      const operand = this.parseUnary();
      return { type: "UnaryExpression", operator: "+", operand, location };
    }

    if (this.check("MINUS")) {
      const location = this.currentToken.location;
      this.advance();
      const operand = this.parseUnary();
      return { type: "UnaryExpression", operator: "-", operand, location };
    }

    return this.parsePrimary();
  }

  // Primary: number | variable | function | (expression)
  private parsePrimary(): NumericExpression {
    const location = this.currentToken.location;

    // Number literal
    if (this.check("NUMBER")) {
      const value = this.consumeNumber("Expected number");
      return { type: "NumberLiteral", value, location };
    }

    // Parenthesized expression
    if (this.check("LPAREN")) {
      this.advance();
      const expr = this.parseNumericExpression();
      this.consume("RPAREN", "Expected )");
      return expr;
    }

    // Function call
    if (this.isFunction()) {
      return this.parseFunctionCall();
    }

    // Variable
    const variable = this.parseVariable();
    if (variable.type === "StringVariable") {
      throw new Error("Cannot use string variable in numeric expression");
    }
    return variable;
  }

  // Relational expression
  private parseRelationalExpression(): RelationalExpression {
    const left = this.parseExpression();
    const location = this.currentToken.location;

    let operator: "=" | "<>" | "<" | ">" | "<=" | ">=" | null = null;

    if (this.check("EQUAL")) operator = "=";
    else if (this.check("NOT_EQUAL")) operator = "<>";
    else if (this.check("LESS")) operator = "<";
    else if (this.check("GREATER")) operator = ">";
    else if (this.check("LESS_EQUAL")) operator = "<=";
    else if (this.check("GREATER_EQUAL")) operator = ">=";
    else throw new Error("Expected relational operator");

    this.advance();
    const right = this.parseExpression();

    // Check if string comparison (only = and <> allowed)
    if (left.type === "StringLiteral" || left.type === "StringVariable") {
      if (operator !== "=" && operator !== "<>") {
        throw new Error("String comparison only allows = and <>");
      }
      return {
        type: "StringRelationalExpression",
        operator: operator as "=" | "<>",
        left: left as StringExpression,
        right: right as StringExpression,
        location,
      };
    }

    return {
      type: "NumericRelationalExpression",
      operator,
      left: left as NumericExpression,
      right: right as NumericExpression,
      location,
    };
  }

  // ============================================================================
  // Variable parsing
  // ============================================================================

  private parseVariable(): Variable {
    const location = this.currentToken.location;
    const name = this.consume("IDENTIFIER", "Expected variable name").value as string;

    // String variable (ends with $)
    if (name.endsWith("$")) {
      return { type: "StringVariable", name, location };
    }

    // Check for array subscript
    if (this.check("LPAREN")) {
      this.advance();
      const subscripts: NumericExpression[] = [];
      subscripts.push(this.parseNumericExpression());

      if (this.check("COMMA")) {
        this.advance();
        subscripts.push(this.parseNumericExpression());
      }

      this.consume("RPAREN", "Expected ) after subscript");

      return {
        type: "NumericArrayElement",
        arrayName: name[0], // First letter
        subscripts,
        location,
      };
    }

    // Simple numeric variable
    return { type: "SimpleNumericVariable", name, location };
  }

  private parseSimpleNumericVariable(): SimpleNumericVariable {
    const variable = this.parseVariable();
    if (variable.type !== "SimpleNumericVariable") {
      throw new Error("Expected simple numeric variable");
    }
    return variable;
  }

  private parseVariableList(): Variable[] {
    const variables: Variable[] = [];
    variables.push(this.parseVariable());

    while (this.check("COMMA")) {
      this.advance();
      variables.push(this.parseVariable());
    }

    return variables;
  }

  // ============================================================================
  // Function parsing
  // ============================================================================

  private parseFunctionCall(): FunctionCall {
    const location = this.currentToken.location;
    const functionName = this.currentToken.value as string;
    this.advance();

    // RND has no argument
    if (functionName === "RND") {
      return { type: "FunctionCall", functionName, argument: null, location };
    }

    // All other functions have one argument
    this.consume("LPAREN", `Expected ( after ${functionName}`);
    const argument = this.parseNumericExpression();
    this.consume("RPAREN", `Expected ) after ${functionName} argument`);

    return { type: "FunctionCall", functionName, argument, location };
  }

  // ============================================================================
  // Utility methods
  // ============================================================================

  private isFunction(): boolean {
    // Built-in functions
    const isBuiltIn = (
      this.check("ABS") || this.check("ATN") || this.check("COS") ||
      this.check("EXP") || this.check("INT") || this.check("LOG") ||
      this.check("RND") || this.check("SGN") || this.check("SIN") ||
      this.check("SQR") || this.check("TAN")
    );
    
    // User-defined functions: IDENTIFIER starting with "FN"
    const isUserDefined = this.check("IDENTIFIER") && 
      typeof this.currentToken.value === "string" &&
      this.currentToken.value.startsWith("FN");
    
    return isBuiltIn || isUserDefined;
  }

  private isNumericExpressionStart(): boolean {
    return (
      this.check("NUMBER") ||
      this.check("LPAREN") ||
      this.check("PLUS") ||
      this.check("MINUS") ||
      this.isFunction() ||
      (this.check("IDENTIFIER") && !(this.currentToken.value as string).endsWith("$"))
    );
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.currentToken.type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.position++;
      this.currentToken = this.tokens[this.position];
    }
    return this.tokens[this.position - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`${message} at line ${this.currentToken.location.lineNumber}`);
  }

  private consumeNumber(message: string): number {
    const token = this.consume("NUMBER", message);
    return token.value as number;
  }

  private isAtEnd(): boolean {
    return this.position >= this.tokens.length || this.currentToken.type === "EOF";
  }
}
