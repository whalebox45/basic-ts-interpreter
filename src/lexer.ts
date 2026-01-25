/**
 * Lexer for ECMA-55 Minimal BASIC
 * Tokenizes source code according to the character set and syntax rules
 */

import type { SourceLocation } from "./ast.js";

// ============================================================================
// Token Types (derived from ECMA-55 syntax)
// ============================================================================

export type TokenType =
  // Keywords (Section 3 - Definitions)
  | "BASE" | "DATA" | "DEF" | "DIM" | "END" | "FOR" | "GO" | "GOSUB" 
  | "GOTO" | "IF" | "INPUT" | "LET" | "NEXT" | "ON" | "OPTION" 
  | "PRINT" | "RANDOMIZE" | "READ" | "REM" | "RESTORE" | "RETURN" 
  | "STEP" | "STOP" | "SUB" | "THEN" | "TO"
  
  // Special function prefix
  | "FN" | "TAB"
  
  // Built-in functions (Section 9)
  | "ABS" | "ATN" | "COS" | "EXP" | "INT" | "LOG" 
  | "RND" | "SGN" | "SIN" | "SQR" | "TAN"
  
  // Literals
  | "NUMBER"        // Numeric constant
  | "STRING"        // String constant (quoted)
  | "IDENTIFIER"    // Variable name (A, A5, A$, etc.)
  
  // Operators
  | "PLUS"          // +
  | "MINUS"         // -
  | "MULTIPLY"      // *
  | "DIVIDE"        // /
  | "POWER"         // ^
  
  // Relational operators
  | "EQUAL"         // =
  | "NOT_EQUAL"     // <>
  | "LESS"          // <
  | "GREATER"       // >
  | "LESS_EQUAL"    // <=
  | "GREATER_EQUAL" // >=
  
  // Delimiters
  | "LPAREN"        // (
  | "RPAREN"        // )
  | "COMMA"         // ,
  | "SEMICOLON"     // ;
  | "DOLLAR"        // $
  
  // Special
  | "EOL"           // End of line
  | "EOF";          // End of file

export interface Token {
  readonly type: TokenType;
  readonly value: string | number;
  readonly location: SourceLocation;
}

// ============================================================================
// Lexer Class
// ============================================================================

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentChar: string | null;

  // ECMA-55 Keywords (must be preceded and followed by space)
  private static readonly KEYWORDS = new Set([
    "BASE", "DATA", "DEF", "DIM", "END", "FOR", "GO", "GOSUB", 
    "GOTO", "IF", "INPUT", "LET", "NEXT", "ON", "OPTION", 
    "PRINT", "RANDOMIZE", "READ", "REM", "RESTORE", "RETURN", 
    "STEP", "STOP", "SUB", "THEN", "TO"
  ]);

  private static readonly FUNCTIONS = new Set([
    "ABS", "ATN", "COS", "EXP", "INT", "LOG", 
    "RND", "SGN", "SIN", "SQR", "TAN", "FN", "TAB"
  ]);

  constructor(source: string) {
    this.source = source;
    this.currentChar = source.length > 0 ? source[0] : null;
  }

  // ============================================================================
  // Main tokenization method
  // ============================================================================

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.currentChar !== null) {
      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }

    // Add EOF token
    tokens.push({
      type: "EOF",
      value: "",
      location: this.getLocation()
    });

    return tokens;
  }

  private nextToken(): Token | null {
    // Skip spaces (except at beginning of line or in specific contexts)
    // ECMA-55: Spaces may occur anywhere except in keywords, numbers, line numbers, identifiers
    while (this.isSpace(this.currentChar)) {
      this.advance();
    }

    if (this.currentChar === null) {
      return null;
    }

    const location = this.getLocation();

    // End of line (CR, LF, or CRLF)
    if (this.isNewLine(this.currentChar)) {
      return this.tokenizeEOL(location);
    }

    // Numbers (Section 6: Constants)
    // Digits: implicit/explicit point, scaled/unscaled
    if (this.isDigit(this.currentChar) || this.currentChar === ".") {
      return this.tokenizeNumber(location);
    }

    // String constants (Section 6: quoted-string)
    if (this.currentChar === '"') {
      return this.tokenizeString(location);
    }

    // Letters: Keywords, Functions, or Identifiers
    if (this.isLetter(this.currentChar)) {
      return this.tokenizeWord(location);
    }

    // Operators and delimiters
    return this.tokenizeOperator(location);
  }

  // ============================================================================
  // Character classification (Section 4)
  // ============================================================================

  private isLetter(char: string | null): boolean {
    if (!char) return false;
    return /[A-Z]/i.test(char);
  }

  private isDigit(char: string | null): boolean {
    if (!char) return false;
    return /[0-9]/.test(char);
  }

  private isSpace(char: string | null): boolean {
    return char === " " || char === "\t";
  }

  private isNewLine(char: string | null): boolean {
    return char === "\n" || char === "\r";
  }

  private isAlphanumeric(char: string | null): boolean {
    return this.isLetter(char) || this.isDigit(char);
  }

  // ============================================================================
  // Number tokenization (Section 6: numeric-constant)
  // ============================================================================

  private tokenizeNumber(location: SourceLocation): Token {
    let numStr = "";
    let hasDecimal = false;
    let hasExponent = false;

    // Optional leading sign is handled by parser as unary expression
    // Here we only handle unsigned numeric representations

    // Integer part or leading decimal point
    if (this.currentChar === ".") {
      hasDecimal = true;
      numStr += ".";
      this.advance();
    }

    // Digits before decimal or exponent
    while (this.isDigit(this.currentChar)) {
      numStr += this.currentChar;
      this.advance();
    }

    // Decimal point (if not already consumed)
    if (!hasDecimal && this.currentChar === ".") {
      hasDecimal = true;
      numStr += ".";
      this.advance();

      // Fractional part
      while (this.isDigit(this.currentChar)) {
        numStr += this.currentChar;
        this.advance();
      }
    }

    // Exponent part (E followed by optional sign and digits)
    if (this.currentChar?.toUpperCase() === "E") {
      hasExponent = true;
      numStr += "E";
      this.advance();

      // Optional sign in exponent
      if (this.currentChar === "+" || this.currentChar === "-") {
        numStr += this.currentChar;
        this.advance();
      }

      // Exponent digits
      if (!this.isDigit(this.currentChar)) {
        throw new Error(`Invalid number format at ${location.lineNumber}:${location.column}`);
      }

      while (this.isDigit(this.currentChar)) {
        numStr += this.currentChar;
        this.advance();
      }
    }

    const value = parseFloat(numStr);
    
    return {
      type: "NUMBER",
      value,
      location
    };
  }

  // ============================================================================
  // String tokenization (Section 6: quoted-string)
  // ============================================================================

  private tokenizeString(location: SourceLocation): Token {
    let str = "";
    
    // Consume opening quote
    this.advance();

    // Read until closing quote or EOL
    // ECMA-55: String cannot span multiple lines
    while (this.currentChar !== null && this.currentChar !== '"' && !this.isNewLine(this.currentChar)) {
      str += this.currentChar;
      this.advance();
    }

    if (this.currentChar !== '"') {
      throw new Error(`Unterminated string at ${location.lineNumber}:${location.column}`);
    }

    // Consume closing quote
    this.advance();

    return {
      type: "STRING",
      value: str,
      location
    };
  }

  // ============================================================================
  // Word tokenization (Keywords, Functions, Identifiers)
  // ============================================================================

  private tokenizeWord(location: SourceLocation): Token {
    let word = "";

    // Read letter(s)
    while (this.isLetter(this.currentChar)) {
      word += this.currentChar.toUpperCase();
      this.advance();
    }

    // Check for special two-word keywords: "GO TO", "GO SUB"
    if (word === "GO") {
      const savedPos = this.position;
      const savedCol = this.column;

      // Skip spaces
      while (this.isSpace(this.currentChar)) {
        this.advance();
      }

      // Check for TO or SUB
      let nextWord = "";
      while (this.isLetter(this.currentChar)) {
        nextWord += this.currentChar.toUpperCase();
        this.advance();
      }

      if (nextWord === "TO") {
        return { type: "GOTO", value: "GOTO", location };
      } else if (nextWord === "SUB") {
        return { type: "GOSUB", value: "GOSUB", location };
      } else {
        // Not GO TO or GO SUB, backtrack
        this.position = savedPos;
        this.column = savedCol;
        this.currentChar = this.source[this.position] || null;
      }
    }

    // Special case: FN followed by a letter is a user-defined function call
    if (word === "FN" && this.isLetter(this.currentChar)) {
      // Read the function name letter
      word += this.currentChar.toUpperCase();
      this.advance();
      return {
        type: "IDENTIFIER",
        value: word,
        location
      };
    }

    // Check if it's a keyword
    if (Lexer.KEYWORDS.has(word)) {
      // Special handling for REM: consume rest of line as remark-string
      if (word === "REM") {
        let remark = "";
        while (this.currentChar !== null && !this.isNewLine(this.currentChar)) {
          remark += this.currentChar;
          this.advance();
        }
        return {
          type: "REM",
          value: remark.trim(), // Store the remark text
          location
        };
      }
      
      return {
        type: word as TokenType,
        value: word,
        location
      };
    }

    // Check if it's a built-in function
    if (Lexer.FUNCTIONS.has(word)) {
      return {
        type: word as TokenType,
        value: word,
        location
      };
    }

    // Variable name: letter + optional digit + optional $
    // ECMA-55: Simple numeric (A, A5), array (A), string (A$)
    let varName = word;

    // Optional digit for simple numeric variable
    if (this.isDigit(this.currentChar)) {
      varName += this.currentChar;
      this.advance();
    }

    // Check for string variable marker ($)
    if (this.currentChar === "$") {
      varName += "$";
      this.advance();
      
      return {
        type: "IDENTIFIER",
        value: varName,
        location
      };
    }

    return {
      type: "IDENTIFIER",
      value: varName,
      location
    };
  }

  // ============================================================================
  // Operator and delimiter tokenization
  // ============================================================================

  private tokenizeOperator(location: SourceLocation): Token {
    const char = this.currentChar!;

    switch (char) {
      case "+":
        this.advance();
        return { type: "PLUS", value: "+", location };

      case "-":
        this.advance();
        return { type: "MINUS", value: "-", location };

      case "*":
        this.advance();
        return { type: "MULTIPLY", value: "*", location };

      case "/":
        this.advance();
        return { type: "DIVIDE", value: "/", location };

      case "^":
        this.advance();
        return { type: "POWER", value: "^", location };

      case "(":
        this.advance();
        return { type: "LPAREN", value: "(", location };

      case ")":
        this.advance();
        return { type: "RPAREN", value: ")", location };

      case ",":
        this.advance();
        return { type: "COMMA", value: ",", location };

      case ";":
        this.advance();
        return { type: "SEMICOLON", value: ";", location };

      case "$":
        this.advance();
        return { type: "DOLLAR", value: "$", location };

      case "=":
        this.advance();
        return { type: "EQUAL", value: "=", location };

      case "<":
        this.advance();
        // Check for <= or <>
        if (this.currentChar === "=") {
          this.advance();
          return { type: "LESS_EQUAL", value: "<=", location };
        } else if (this.currentChar === ">") {
          this.advance();
          return { type: "NOT_EQUAL", value: "<>", location };
        }
        return { type: "LESS", value: "<", location };

      case ">":
        this.advance();
        // Check for >=
        if (this.currentChar === "=") {
          this.advance();
          return { type: "GREATER_EQUAL", value: ">=", location };
        }
        return { type: "GREATER", value: ">", location };

      default:
        throw new Error(`Unexpected character '${char}' at ${location.lineNumber}:${location.column}`);
    }
  }

  // ============================================================================
  // End-of-line tokenization
  // ============================================================================

  private tokenizeEOL(location: SourceLocation): Token {
    // Handle CRLF, CR, or LF
    if (this.currentChar === "\r") {
      this.advance();
      if (this.currentChar === "\n") {
        this.advance();
      }
    } else if (this.currentChar === "\n") {
      this.advance();
    }

    this.line++;
    this.column = 1;

    return {
      type: "EOL",
      value: "\n",
      location
    };
  }

  // ============================================================================
  // Utility methods
  // ============================================================================

  private advance(): void {
    this.position++;
    this.column++;
    this.currentChar = this.position < this.source.length 
      ? this.source[this.position] 
      : null;
  }

  private getLocation(): SourceLocation {
    return {
      lineNumber: this.line,
      column: this.column
    };
  }

  // ============================================================================
  // Public utility: Tokenize single line (for REPL or line-by-line parsing)
  // ============================================================================

  public static tokenizeLine(line: string, lineNumber: number): Token[] {
    const lexer = new Lexer(line);
    lexer.line = lineNumber;
    return lexer.tokenize();
  }
}
