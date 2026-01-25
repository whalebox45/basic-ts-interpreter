/**
 * REPL for ECMA-55 Minimal BASIC
 * Classic commands: RUN, LIST, NEW
 */

import * as readline from "readline";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";
import type { Program, ProgramLine, Statement } from "./ast.js";

export class REPL {
  private programLines = new Map<number, ProgramLine>();
  private rl: readline.Interface;
  private pendingInputResolve: ((value: string) => void) | null = null;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "",
    });
  }

  async start(): Promise<void> {
    console.log("ECMA-55 Minimal BASIC Interpreter");
    console.log("READY\n");

    this.rl.on("line", async (input) => {
      if (this.pendingInputResolve) {
        this.pendingInputResolve(input);
        this.pendingInputResolve = null;
        return;
      }

      await this.processLine(input.trim());
    });

    this.rl.prompt();
  }

  private async processLine(input: string): Promise<void> {
    if (!input) {
      this.rl.prompt();
      return;
    }

    const upper = input.toUpperCase();

    // System commands
    if (upper === "RUN") {
      await this.runProgram();
      this.rl.prompt();
      return;
    }

    if (upper === "LIST") {
      this.listProgram();
      this.rl.prompt();
      return;
    }

    if (upper === "NEW") {
      this.programLines.clear();
      console.log("READY");
      this.rl.prompt();
      return;
    }

    if (upper === "EXIT" || upper === "QUIT" || upper === "BYE") {
      console.log("BYE");
      this.rl.close();
      process.exit(0);
    }

    // Check if line starts with a number
    const lineNumberMatch = input.match(/^(\d+)\s*(.*)/);

    if (lineNumberMatch) {
      const lineNumber = parseInt(lineNumberMatch[1]);
      const rest = lineNumberMatch[2];

      if (!rest) {
        // Delete line (silent)
        this.programLines.delete(lineNumber);
      } else {
        // Add/update line (silent unless error)
        try {
          const statement = this.parseStatement(rest);
          const programLine: ProgramLine = {
            type: "ProgramLine",
            lineNumber,
            statement,
            location: { lineNumber, column: 1 },
          };
          this.programLines.set(lineNumber, programLine);
        } catch (error) {
          console.error("?SYNTAX ERROR");
        }
      }
    } else {
      // Immediate mode
      try {
        await this.executeImmediate(input);
      } catch (error) {
        console.error("?ERROR");
      }
    }

    this.rl.prompt();
  }

  private parseStatement(code: string): Statement {
    const tempCode = `10 ${code}\n20 END\n`;
    const tokens = new Lexer(tempCode).tokenize();
    const parser = new Parser(tokens);
    const program = parser.parse();
    return program.lines[0].statement;
  }

  private listProgram(): void {
    const sortedLines = Array.from(this.programLines.keys()).sort((a, b) => a - b);

    if (sortedLines.length === 0) {
      return;
    }

    for (const lineNum of sortedLines) {
      const line = this.programLines.get(lineNum)!;
      console.log(this.formatLine(line));
    }
  }

  private formatLine(line: ProgramLine): string {
    return `${line.lineNumber} ${this.formatStatement(line.statement)}`;
  }

  private formatStatement(stmt: Statement): string {
    switch (stmt.type) {
      case "PrintStatement":
        return "PRINT ...";
      case "LetStatement":
        return "LET ...";
      case "InputStatement":
        return "INPUT ...";
      case "IfThenStatement":
        return `IF ... THEN ${stmt.thenLineNumber}`;
      case "GotoStatement":
        return `GOTO ${stmt.targetLineNumber}`;
      case "GosubStatement":
        return `GOSUB ${stmt.targetLineNumber}`;
      case "ReturnStatement":
        return "RETURN";
      case "OnGotoStatement":
        return "ON ... GOTO ...";
      case "ForStatement":
        return `FOR ${stmt.controlVariable.name} = ... TO ...`;
      case "NextStatement":
        return `NEXT ${stmt.controlVariable.name}`;
      case "ReadStatement":
        return "READ ...";
      case "RestoreStatement":
        return "RESTORE";
      case "DataStatement":
        return `DATA ${stmt.constants.join(", ")}`;
      case "DimStatement":
        return "DIM ...";
      case "DefStatement":
        return `DEF ${stmt.functionName}(...) = ...`;
      case "OptionStatement":
        return `OPTION BASE ${stmt.base}`;
      case "RandomizeStatement":
        return "RANDOMIZE";
      case "RemarkStatement":
        return `REM ${stmt.comment}`;
      case "StopStatement":
        return "STOP";
      case "EndStatement":
        return "END";
      default:
        return "???";
    }
  }

  private async runProgram(): Promise<void> {
    const sortedLines = Array.from(this.programLines.values()).sort(
      (a, b) => a.lineNumber - b.lineNumber
    );

    if (sortedLines.length === 0) {
      console.log("?NO PROGRAM");
      return;
    }

    const lastLine = sortedLines[sortedLines.length - 1];
    if (lastLine.statement.type !== "EndStatement") {
      console.error("?MISSING END");
      return;
    }

    const program: Program = {
      type: "Program",
      lines: sortedLines,
    };

    try {
      const interpreter = new Interpreter(program);

      interpreter.setOutputHandler((text) => {
        process.stdout.write(text);
      });

      interpreter.setInputHandler(async () => {
        return new Promise<string>((resolve) => {
          this.pendingInputResolve = resolve;
        });
      });

      await interpreter.run();
      console.log(); // Newline after program ends
    } catch (error) {
      console.error("\n?RUNTIME ERROR:", error instanceof Error ? error.message : error);
    }
  }

  private async executeImmediate(input: string): Promise<void> {
    const code = `10 ${input}\n20 END\n`;
    
    const tokens = new Lexer(code).tokenize();
    const parser = new Parser(tokens);
    const program = parser.parse();

    const interpreter = new Interpreter(program);
    
    interpreter.setOutputHandler((text) => {
      process.stdout.write(text);
    });

    interpreter.setInputHandler(async () => {
      return new Promise<string>((resolve) => {
        this.pendingInputResolve = resolve;
      });
    });

    await interpreter.run();
  }

  close(): void {
    this.rl.close();
  }
}
