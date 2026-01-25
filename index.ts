import { REPL } from "./src/repl.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length > 0 && args[0] === "--file") {
    // File mode: run a .bas file
    const fs = await import("fs");
    const { Lexer } = await import("./src/lexer.js");
    const { Parser } = await import("./src/parser.js");
    const { Interpreter } = await import("./src/interpreter.js");

    const filename = args[1];
    if (!filename) {
      console.error("Usage: bun index.ts --file <filename.bas>");
      process.exit(1);
    }

    const code = fs.readFileSync(filename, "utf-8");
    
    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      const interpreter = new Interpreter(ast);
      
      interpreter.setOutputHandler((text) => {
        process.stdout.write(text);
      });
      
      // Create readline interface once
      const readline = await import("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false // Disable terminal mode for piped input
      });
      
      const lines: string[] = [];
      let lineIndex = 0;
      let inputResolve: ((value: string) => void) | null = null;
      
      // Pre-read all lines if stdin is not a TTY (piped input)
      if (!process.stdin.isTTY) {
        for await (const line of rl) {
          lines.push(line);
        }
        rl.close();
      }
      
      interpreter.setInputHandler(async () => {
        if (!process.stdin.isTTY) {
          // For piped input, return next line
          if (lineIndex < lines.length) {
            const line = lines[lineIndex++];
            process.stdout.write(line + "\n"); // Echo the input
            return line;
          }
          throw new Error("No more input available");
        } else {
          // For interactive input
          return new Promise((resolve) => {
            rl.question("", (answer) => {
              resolve(answer);
            });
          });
        }
      });
      
      await interpreter.run();
      if (process.stdin.isTTY) {
        rl.close();
      }
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  } else {
    // Interactive mode (REPL)
    const repl = new REPL();
    await repl.start();
  }
}

main();
