# basic-ts

一個以 TypeScript 實作的 ECMA-55 Minimal BASIC 直譯器。

## 簡介

本專案是根據 [ECMA-55 Minimal BASIC 標準](https://ecma-international.org/publications-and-standards/standards/ecma-55/) 實作的 BASIC 語言直譯器，支援在 Bun 環境下執行。

ECMA-55 是 1978 年發布的 BASIC 語言標準，定義了 Minimal BASIC 的語法與語義規範，確保程式碼在不同系統間的可攜性。

## 致謝

- 感謝 [ECMA International](https://ecma-international.org/publications-and-standards/standards/ecma-55/) 將 BASIC 語言標準化，讓我們有明確的規範可以依循。
- 特別感謝 [Marcussacapuces91](https://github.com/Marcussacapuces91/Standard-ECMA-55-Minimal-BASIC) 將 ECMA-55 標準文件電子化，使得 AI 能夠閱讀並協助實作此直譯器。

## 功能特色

- 完整實作 ECMA-55 Minimal BASIC 標準
- 支援互動式 REPL 環境
- 支援執行 `.bas` 程式檔案
- 可編譯成獨立執行檔（macOS、Linux、Windows）

### 支援的語法

- **變數**：數值變數 (`A`, `X1`)、字串變數 (`A$`)、陣列 (`A(10)`, `B(3,3)`)
- **運算子**：`+`, `-`, `*`, `/`, `^` (次方)
- **控制流程**：`IF...THEN`, `GOTO`, `GOSUB...RETURN`, `FOR...NEXT`, `ON...GOTO`
- **輸入輸出**：`PRINT`, `INPUT`
- **資料處理**：`DATA`, `READ`, `RESTORE`
- **函式**：
  - 內建函式：`ABS`, `ATN`, `COS`, `EXP`, `INT`, `LOG`, `RND`, `SGN`, `SIN`, `SQR`, `TAN`
  - 自訂函式：`DEF FN`
- **其他**：`DIM`, `REM`, `OPTION BASE`, `RANDOMIZE`, `STOP`, `END`

## 安裝

```bash
bun install
```

## 執行方式

```bash
# 啟動 REPL 互動模式
bun start

# 執行 BASIC 程式檔案
bun start --file tests/samples/hello.bas

# 監視模式（檔案變更時自動重新執行）
bun run dev
```

### 建置獨立執行檔

```bash
# 建置當前平台的執行檔
bun run build:exe

# 建置所有平台的執行檔
bun run build:exe:all

# 個別平台
bun run build:exe:macos    # macOS (ARM64)
bun run build:exe:linux    # Linux (x64)
bun run build:exe:windows  # Windows (x64)
```

執行編譯好的執行檔：

```bash
./bin/basic                              # REPL 模式
./bin/basic --file tests/samples/hello.bas  # 執行程式檔案
```

## REPL 指令

在互動模式下，可使用以下指令：

| 指令 | 說明 |
|------|------|
| `LIST` | 列出目前的程式碼 |
| `RUN` | 執行目前的程式 |
| `NEW` | 清除目前的程式 |
| `EXIT` 或 `BYE` | 離開直譯器 |

輸入帶有行號的 BASIC 敘述可以編輯程式：

```basic
10 PRINT "HELLO, WORLD!"
20 END
RUN
```

## 範例程式

專案包含多個範例程式於 `tests/samples/` 目錄：

| 檔案 | 說明 |
|------|------|
| `hello.bas` | Hello World 程式 |
| `fibonacci.bas` | 費氏數列 |
| `factorial.bas` | 階乘計算 |
| `prime.bas` | 質數判斷 |
| `guess.bas` | 猜數字遊戲 |
| `array.bas` | 陣列操作範例 |
| `function.bas` | 自訂函式範例 |
| `trig.bas` | 三角函數範例 |
| `data.bas` | DATA/READ 範例 |
| `average.bas` | 計算平均值 |
| `multiplication.bas` | 九九乘法表 |
| `subroutine.bas` | 副程式範例 |

### 執行範例

```bash
bun start --file tests/samples/fibonacci.bas
```

### 執行所有測試

```bash
bash tests/run_all_samples.sh
```

## 程式碼範例

### Hello World

```basic
10 REM Hello World Program
20 PRINT "HELLO, WORLD!"
30 END
```

### 費氏數列

```basic
10 REM Fibonacci Sequence
20 PRINT "HOW MANY NUMBERS";
30 INPUT N
40 LET A = 0
50 LET B = 1
60 PRINT A;
70 FOR I = 1 TO N - 1
80 PRINT B;
90 LET C = A + B
100 LET A = B
110 LET B = C
120 NEXT I
130 PRINT
140 END
```

### 自訂函式

```basic
10 REM User Defined Functions
20 DEF FNS(X) = X * X
30 DEF FNC(X) = X * X * X
40 PRINT "ENTER A NUMBER";
50 INPUT N
60 PRINT "SQUARE ="; FNS(N)
70 PRINT "CUBE ="; FNC(N)
80 END
```

## 專案結構

```
basic-ts/
├── index.ts              # 程式進入點
├── package.json          # 專案設定
├── tsconfig.json         # TypeScript 設定
├── README.md             # 本文件
├── complete_ecma55.md    # ECMA-55 標準文件
├── src/
│   ├── ast.ts            # 抽象語法樹定義
│   ├── lexer.ts          # 詞法分析器
│   ├── parser.ts         # 語法分析器
│   ├── interpreter.ts    # 直譯器
│   ├── repl.ts           # REPL 互動介面
│   └── numeric.ts        # 數值處理工具
└── tests/
    ├── comprehensive.bas # 綜合測試程式
    ├── run_all_samples.sh
    └── samples/          # 範例程式
```

## 技術細節

### ECMA-55 規範重點

- 數值精度：至少 6 位有效數字
- 數值範圍：至少 1E-38 至 1E+38
- 字串長度：最多 18 個字元
- 陣列下標：預設範圍 0-10（可用 `OPTION BASE 1` 改為 1-10）

## 相關連結

- [ECMA-55 標準文件](https://ecma-international.org/publications-and-standards/standards/ecma-55/)
- [ECMA-55 電子化版本](https://github.com/Marcussacapuces91/Standard-ECMA-55-Minimal-BASIC)
- [Bun 官方網站](https://bun.sh)
