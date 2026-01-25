/**
 * Interpreter for ECMA-55 Minimal BASIC
 * Executes the Abstract Syntax Tree
 */

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
  SimpleNumericVariable,
  NumericArrayElement,
  StringVariable,
} from "./ast.js";
import { formatNumber, safePower } from "./numeric.js";

// ============================================================================
// Runtime State
// ============================================================================

class RuntimeState {
  // Variables
  private numericVars = new Map<string, number>();
  private stringVars = new Map<string, string>();
  private arrays = new Map<string, number[] | number[][]>();
  
  // Array bounds (for DIM and OPTION BASE)
  private arrayBounds = new Map<string, number[]>();
  private optionBase: 0 | 1 = 0;
  
  // Program control
  private programLines = new Map<number, ProgramLine>();
  private currentLineIndex = 0;
  private lineNumbers: number[] = [];
  
  // GOSUB/RETURN stack
  private returnStack: number[] = [];
  
  // DATA statement support
  private dataValues: (number | string)[] = [];
  private dataPointer = 0;
  
  // User-defined functions (DEF FN)
  private userFunctions = new Map<string, {
    parameter: string;
    expression: NumericExpression;
  }>();
  
  // Input/Output handlers
  public outputHandler: (text: string) => void = console.log;
  public inputHandler: () => Promise<string> = async () => {
    throw new Error("Input handler not configured");
  };

  constructor(program: Program) {
    // Index program lines by line number
    for (const line of program.lines) {
      this.programLines.set(line.lineNumber, line);
      this.lineNumbers.push(line.lineNumber);
    }
    this.lineNumbers.sort((a, b) => a - b);
  }

  // Variable access
  getNumeric(name: string): number {
    if (!this.numericVars.has(name)) {
      // ECMA-55: Initial values are implementation-defined
      // We use 0 for simplicity
      return 0;
    }
    return this.numericVars.get(name)!;
  }

  setNumeric(name: string, value: number): void {
    this.numericVars.set(name, value);
  }

  getString(name: string): string {
    if (!this.stringVars.has(name)) {
      return ""; // Empty string by default
    }
    return this.stringVars.get(name)!;
  }

  setString(name: string, value: string): void {
    // ECMA-55: Strings up to 18 characters
    if (value.length > 18) {
      throw new Error(`String too long (max 18 characters): ${value.length}`);
    }
    this.stringVars.set(name, value);
  }

  // Array access
  getArray(name: string, subscripts: number[]): number {
    const key = name;
    if (!this.arrays.has(key)) {
      // Auto-dimension: 0-10 or 1-10 depending on OPTION BASE
      this.dimensionArray(name, subscripts.length === 1 ? [10] : [10, 10]);
    }

    const arr = this.arrays.get(key)!;
    const indices = subscripts.map(s => Math.round(s) - this.optionBase);

    // Bounds check
    if (indices.some((idx, i) => {
      const bound = this.arrayBounds.get(key)![i];
      return idx < 0 || idx > bound;
    })) {
      throw new Error(`Array subscript out of bounds: ${name}(${subscripts.join(",")})`);
    }

    if (subscripts.length === 1) {
      return (arr as number[])[indices[0]];
    } else {
      const dim1 = this.arrayBounds.get(key)![0] + 1;
      return (arr as number[])[indices[0] * dim1 + indices[1]];
    }
  }

  setArray(name: string, subscripts: number[], value: number): void {
    const key = name;
    if (!this.arrays.has(key)) {
      this.dimensionArray(name, subscripts.length === 1 ? [10] : [10, 10]);
    }

    const arr = this.arrays.get(key)!;
    const indices = subscripts.map(s => Math.round(s) - this.optionBase);

    // Bounds check
    if (indices.some((idx, i) => {
      const bound = this.arrayBounds.get(key)![i];
      return idx < 0 || idx > bound;
    })) {
      throw new Error(`Array subscript out of bounds: ${name}(${subscripts.join(",")})`);
    }

    if (subscripts.length === 1) {
      (arr as number[])[indices[0]] = value;
    } else {
      const dim1 = this.arrayBounds.get(key)![0] + 1;
      (arr as number[])[indices[0] * dim1 + indices[1]] = value;
    }
  }

  dimensionArray(name: string, dimensions: number[]): void {
    const key = name;
    if (this.arrays.has(key)) {
      throw new Error(`Array ${name} already dimensioned`);
    }

    // Store bounds
    this.arrayBounds.set(key, dimensions);

    // Create array
    if (dimensions.length === 1) {
      const size = dimensions[0] + 1 - this.optionBase;
      this.arrays.set(key, new Array(size).fill(0));
    } else {
      const size1 = dimensions[0] + 1 - this.optionBase;
      const size2 = dimensions[1] + 1 - this.optionBase;
      this.arrays.set(key, new Array(size1 * size2).fill(0));
    }
  }

  setOptionBase(base: 0 | 1): void {
    this.optionBase = base;
  }

  // Program control
  getCurrentLine(): ProgramLine | null {
    if (this.currentLineIndex >= this.lineNumbers.length) {
      return null;
    }
    const lineNum = this.lineNumbers[this.currentLineIndex];
    return this.programLines.get(lineNum)!;
  }

  nextLine(): void {
    this.currentLineIndex++;
  }

  gotoLine(lineNumber: number): void {
    const index = this.lineNumbers.indexOf(lineNumber);
    if (index === -1) {
      throw new Error(`Line number ${lineNumber} not found`);
    }
    this.currentLineIndex = index;
  }

  pushReturn(lineNumber: number): void {
    this.returnStack.push(lineNumber);
  }

  popReturn(): number {
    if (this.returnStack.length === 0) {
      throw new Error("RETURN without GOSUB");
    }
    return this.returnStack.pop()!;
  }

  // DATA/READ support
  addData(values: (number | string)[]): void {
    this.dataValues.push(...values);
  }

  readData(): number | string {
    if (this.dataPointer >= this.dataValues.length) {
      throw new Error("Out of DATA");
    }
    return this.dataValues[this.dataPointer++];
  }

  restoreData(): void {
    this.dataPointer = 0;
  }

  // User-defined functions
  defineFunction(name: string, parameter: string, expression: NumericExpression): void {
    this.userFunctions.set(name, { parameter, expression });
  }

  getFunction(name: string) {
    return this.userFunctions.get(name);
  }
}

// ============================================================================
// Interpreter
// ============================================================================

export class Interpreter {
  private state: RuntimeState;
  private running = false;
  private jumpedThisStatement = false; // Track if current statement caused a jump
  private printBuffer = "";
  private printColumn = 0;
  private readonly PRINT_ZONE_WIDTH = 15;
  private readonly MARGIN = 75;

  constructor(program: Program) {
    this.state = new RuntimeState(program);
  }

  // Configure I/O handlers
  setOutputHandler(handler: (text: string) => void): void {
    this.state.outputHandler = handler;
  }

  setInputHandler(handler: () => Promise<string>): void {
    this.state.inputHandler = handler;
  }

  // ============================================================================
  // Main execution loop
  // ============================================================================

  async run(): Promise<void> {
    this.running = true;

    // First pass: collect DATA statements
    this.collectData();

    // Reset to first line
    this.state.gotoLine(this.state["lineNumbers"][0]);

    while (this.running) {
      const line = this.state.getCurrentLine();
      if (!line) break;

      try {
        this.jumpedThisStatement = false; // Reset flag before executing statement
        await this.executeStatement(line.statement);
        if (!this.jumpedThisStatement) {
          this.state.nextLine(); // Only advance if we didn't jump
        }
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error at line ${line.lineNumber}: ${error.message}`);
        }
        throw error;
      }
    }

    // Flush any remaining print buffer
    this.flushPrintBuffer();
  }

  private collectData(): void {
    for (const lineNum of this.state["lineNumbers"]) {
      const line = this.state["programLines"].get(lineNum)!;
      if (line.statement.type === "DataStatement") {
        this.state.addData(line.statement.constants);
      }
    }
  }

  // ============================================================================
  // Statement execution
  // ============================================================================

  private async executeStatement(stmt: Statement): Promise<void> {
    switch (stmt.type) {
      case "LetStatement":
        return this.executeLet(stmt);
      case "PrintStatement":
        return this.executePrint(stmt);
      case "InputStatement":
        return await this.executeInput(stmt);
      case "IfThenStatement":
        return this.executeIfThen(stmt);
      case "GotoStatement":
        return this.executeGoto(stmt);
      case "GosubStatement":
        return this.executeGosub(stmt);
      case "ReturnStatement":
        return this.executeReturn(stmt);
      case "OnGotoStatement":
        return this.executeOnGoto(stmt);
      case "ForStatement":
        return this.executeFor(stmt);
      case "NextStatement":
        return this.executeNext(stmt);
      case "ReadStatement":
        return this.executeRead(stmt);
      case "RestoreStatement":
        return this.executeRestore(stmt);
      case "DataStatement":
        return; // No-op at runtime
      case "DimStatement":
        return this.executeDim(stmt);
      case "DefStatement":
        return this.executeDef(stmt);
      case "OptionStatement":
        return this.executeOption(stmt);
      case "RandomizeStatement":
        return this.executeRandomize(stmt);
      case "RemarkStatement":
        return; // No-op
      case "StopStatement":
      case "EndStatement":
        this.flushPrintBuffer();
        this.running = false;
        return;
    }
  }

  private executeLet(stmt: Statement & { type: "LetStatement" }): void {
    const value = this.evaluateExpression(stmt.expression);
    this.assignVariable(stmt.variable, value);
  }

 private executePrint(stmt: Statement & { type: "PrintStatement" }): void {
  let suppressNewline = false;

  // Handle empty PRINT statement (just outputs a newline)
  if (stmt.items.length === 0) {
    this.state.outputHandler("\n");
    return;
  }

  for (const item of stmt.items) {
    if (item.type === "Expression") {
      const value = this.evaluateExpression(item.value);
      const text = typeof value === "number" ? formatNumber(value) : value;
      this.printText(text);
      suppressNewline = false;
    } else if (item.type === "TabCall") {
      const n = Math.round(this.evaluateNumericExpression(item.argument));
      if (n < 1) {
        console.warn("TAB argument < 1, using 1");
        this.printTab(1);
      } else {
        this.printTab(n);
      }
      suppressNewline = false;
    } else if (item.type === "Separator") {
      if (item.value === ",") {
        this.printComma();
      }
      // Semicolon does nothing (no space added)
      suppressNewline = true;
    }
  }

  if (!suppressNewline) {
    this.flushPrintBuffer();
  }
}


  private async executeInput(stmt: Statement & { type: "InputStatement" }): Promise<void> {
    // Flush any pending output before showing input prompt
    this.flushPrintBuffer();
    
    // Output prompt
    this.state.outputHandler("? ");

    // Get input
    const input = await this.state.inputHandler();
    
    // Output newline after input
    this.state.outputHandler("\n");
    
    const values = input.split(",").map(s => s.trim());

    if (values.length !== stmt.variables.length) {
      throw new Error(`Expected ${stmt.variables.length} values, got ${values.length}`);
    }

    for (let i = 0; i < stmt.variables.length; i++) {
      const variable = stmt.variables[i];
      const valueStr = values[i];

      if (variable.type === "StringVariable") {
        // Remove quotes if present
        const str = valueStr.startsWith('"') && valueStr.endsWith('"')
          ? valueStr.slice(1, -1)
          : valueStr;
        this.assignVariable(variable, str);
      } else {
        const num = parseFloat(valueStr);
        if (isNaN(num)) {
          throw new Error(`Invalid numeric input: ${valueStr}`);
        }
        this.assignVariable(variable, num);
      }
    }
  }

  private executeIfThen(stmt: Statement & { type: "IfThenStatement" }): void {
    const condition = this.evaluateRelationalExpression(stmt.condition);
    if (condition) {
      this.state.gotoLine(stmt.thenLineNumber);
      this.jumpedThisStatement = true;
    }
  }

  private executeGoto(stmt: Statement & { type: "GotoStatement" }): void {
    this.state.gotoLine(stmt.targetLineNumber);
    this.jumpedThisStatement = true;
  }

  private executeGosub(stmt: Statement & { type: "GosubStatement" }): void {
    const currentLine = this.state.getCurrentLine()!;
    this.state.pushReturn(currentLine.lineNumber);
    this.state.gotoLine(stmt.targetLineNumber);
    this.jumpedThisStatement = true;
  }

  private executeReturn(stmt: Statement & { type: "ReturnStatement" }): void {
    const returnLine = this.state.popReturn();
    // Find next line after return point
    const index = this.state["lineNumbers"].indexOf(returnLine);
    this.state["currentLineIndex"] = index + 1;
    this.jumpedThisStatement = true;
  }

  private executeOnGoto(stmt: Statement & { type: "OnGotoStatement" }): void {
    const value = Math.round(this.evaluateNumericExpression(stmt.expression));
    if (value < 1 || value > stmt.lineNumbers.length) {
      throw new Error(`ON-GOTO index out of range: ${value}`);
    }
    this.state.gotoLine(stmt.lineNumbers[value - 1]);
    this.jumpedThisStatement = true;
  }

  private executeFor(stmt: Statement & { type: "ForStatement" }): void {
    const initial = this.evaluateNumericExpression(stmt.initialValue);
    this.state.setNumeric(stmt.controlVariable.name, initial);
  }

  private executeNext(stmt: Statement & { type: "NextStatement" }): void {
    // Find matching FOR statement by scanning backwards
    const currentIndex = this.state["currentLineIndex"];
    const lines = this.state["lineNumbers"];
    
    let forLine: ProgramLine | null = null;
    for (let i = currentIndex - 1; i >= 0; i--) {
      const line = this.state["programLines"].get(lines[i])!;
      if (line.statement.type === "ForStatement" &&
          line.statement.controlVariable.name === stmt.controlVariable.name) {
        forLine = line;
        break;
      }
    }

    if (!forLine || forLine.statement.type !== "ForStatement") {
      throw new Error(`NEXT without FOR: ${stmt.controlVariable.name}`);
    }

    const forStmt = forLine.statement;
    const step = forStmt.step ? this.evaluateNumericExpression(forStmt.step) : 1;
    const limit = this.evaluateNumericExpression(forStmt.limit);
    
    const current = this.state.getNumeric(stmt.controlVariable.name);
    const next = current + step;
    
    // Test: (value - limit) * SGN(step) <= 0
    const shouldContinue = (next - limit) * Math.sign(step) <= 0;
    
    if (shouldContinue) {
      this.state.setNumeric(stmt.controlVariable.name, next);
      this.state.gotoLine(forLine.lineNumber);
      this.jumpedThisStatement = true;
    }
  }

  private executeRead(stmt: Statement & { type: "ReadStatement" }): void {
    for (const variable of stmt.variables) {
      const value = this.state.readData();
      
      if (variable.type === "StringVariable") {
        if (typeof value !== "string") {
          throw new Error(`Type mismatch: expected string, got number`);
        }
        this.assignVariable(variable, value);
      } else {
        if (typeof value === "string") {
          const num = parseFloat(value);
          if (isNaN(num)) {
            throw new Error(`Invalid numeric data: ${value}`);
          }
          this.assignVariable(variable, num);
        } else {
          this.assignVariable(variable, value);
        }
      }
    }
  }

  private executeRestore(stmt: Statement & { type: "RestoreStatement" }): void {
    this.state.restoreData();
  }

  private executeDim(stmt: Statement & { type: "DimStatement" }): void {
    for (const arr of stmt.arrays) {
      this.state.dimensionArray(arr.arrayName, arr.dimensions);
    }
  }

  private executeDef(stmt: Statement & { type: "DefStatement" }): void {
    this.state.defineFunction(stmt.functionName, stmt.parameter.name, stmt.expression);
  }

  private executeOption(stmt: Statement & { type: "OptionStatement" }): void {
    this.state.setOptionBase(stmt.base);
  }

  private executeRandomize(stmt: Statement & { type: "RandomizeStatement" }): void {
    // JavaScript's Math.random() is automatically randomized
    // Nothing to do here
  }

  // ============================================================================
  // Expression evaluation
  // ============================================================================

  private evaluateExpression(expr: Expression): number | string {
    if (expr.type === "StringLiteral" || expr.type === "StringVariable") {
      return this.evaluateStringExpression(expr);
    }
    return this.evaluateNumericExpression(expr);
  }

  private evaluateNumericExpression(expr: NumericExpression): number {
    switch (expr.type) {
      case "NumberLiteral":
        return expr.value;

      case "SimpleNumericVariable":
        return this.state.getNumeric(expr.name);

      case "NumericArrayElement": {
        const subscripts = expr.subscripts.map(s => this.evaluateNumericExpression(s));
        return this.state.getArray(expr.arrayName, subscripts);
      }

      case "UnaryExpression":
        const operand = this.evaluateNumericExpression(expr.operand);
        return expr.operator === "+" ? operand : -operand;

      case "BinaryExpression": {
        const left = this.evaluateNumericExpression(expr.left);
        const right = this.evaluateNumericExpression(expr.right);
        
        switch (expr.operator) {
          case "+": return left + right;
          case "-": return left - right;
          case "*": return left * right;
          case "/": 
            if (right === 0) {
              console.warn("Division by zero");
              return left >= 0 ? Infinity : -Infinity;
            }
            return left / right;
          case "^": return safePower(left, right);
        }
      }

      case "FunctionCall":
        return this.evaluateFunction(expr);
    }
  }

  private evaluateStringExpression(expr: StringExpression): string {
    if (expr.type === "StringLiteral") {
      return expr.value;
    }
    return this.state.getString(expr.name);
  }

  private evaluateRelationalExpression(expr: RelationalExpression): boolean {
    if (expr.type === "StringRelationalExpression") {
      const left = this.evaluateStringExpression(expr.left);
      const right = this.evaluateStringExpression(expr.right);
      
      if (expr.operator === "=") return left === right;
      if (expr.operator === "<>") return left !== right;
    } else {
      const left = this.evaluateNumericExpression(expr.left);
      const right = this.evaluateNumericExpression(expr.right);
      
      switch (expr.operator) {
        case "=": return left === right;
        case "<>": return left !== right;
        case "<": return left < right;
        case ">": return left > right;
        case "<=": return left <= right;
        case ">=": return left >= right;
      }
    }
    return false;
  }

  private evaluateFunction(call: Expression & { type: "FunctionCall" }): number {
    const arg = call.argument ? this.evaluateNumericExpression(call.argument) : 0;

    switch (call.functionName) {
      case "ABS": return Math.abs(arg);
      case "ATN": return Math.atan(arg);
      case "COS": return Math.cos(arg);
      case "EXP": return Math.exp(arg);
      case "INT": return Math.floor(arg);
      case "LOG": return Math.log(arg);
      case "RND": return Math.random();
      case "SGN": return arg > 0 ? 1 : arg < 0 ? -1 : 0;
      case "SIN": return Math.sin(arg);
      case "SQR": return Math.sqrt(arg);
      case "TAN": return Math.tan(arg);
      
      default: {
        // User-defined function
        const fn = this.state.getFunction(call.functionName);
        if (!fn) {
          throw new Error(`Undefined function: ${call.functionName}`);
        }
        
        // Save current parameter value
        const savedValue = this.state.getNumeric(fn.parameter);
        
        // Set parameter to argument value
        this.state.setNumeric(fn.parameter, arg);
        
        // Evaluate function expression
        const result = this.evaluateNumericExpression(fn.expression);
        
        // Restore parameter value
        this.state.setNumeric(fn.parameter, savedValue);
        
        return result;
      }
    }
  }

  // ============================================================================
  // Variable assignment
  // ============================================================================

  private assignVariable(variable: Variable, value: number | string): void {
    if (variable.type === "SimpleNumericVariable") {
      if (typeof value !== "number") {
        throw new Error("Type mismatch: expected number");
      }
      this.state.setNumeric(variable.name, value);
    } else if (variable.type === "NumericArrayElement") {
      if (typeof value !== "number") {
        throw new Error("Type mismatch: expected number");
      }
      const subscripts = variable.subscripts.map(s => this.evaluateNumericExpression(s));
      this.state.setArray(variable.arrayName, subscripts, value);
    } else if (variable.type === "StringVariable") {
      if (typeof value !== "string") {
        throw new Error("Type mismatch: expected string");
      }
      this.state.setString(variable.name, value);
    }
  }

  // ============================================================================
  // Print support
  // ============================================================================

  private printText(text: string): void {
    this.printBuffer += text;
    this.printColumn += text.length;
    
    if (this.printColumn >= this.MARGIN) {
      this.flushPrintBuffer();
    }
  }

  private printTab(n: number): void {
    // Modulo by margin
    let target = n;
    while (target > this.MARGIN) {
      target -= this.MARGIN;
    }

    if (this.printColumn >= target) {
      this.flushPrintBuffer();
    }

    const spaces = target - this.printColumn;
    this.printBuffer += " ".repeat(spaces);
    this.printColumn = target;
  }

  private printComma(): void {
    const zone = Math.floor(this.printColumn / this.PRINT_ZONE_WIDTH);
    const nextZone = (zone + 1) * this.PRINT_ZONE_WIDTH;
    
    if (nextZone >= this.MARGIN) {
      this.flushPrintBuffer();
    } else {
      const spaces = nextZone - this.printColumn;
      this.printBuffer += " ".repeat(spaces);
      this.printColumn = nextZone;
    }
  }

private flushPrintBuffer(): void {
  if (this.printBuffer.length > 0) {
    this.state.outputHandler(this.printBuffer + "\n");
    this.printBuffer = "";
    this.printColumn = 0;
  }
}


}
