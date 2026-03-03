import type { CalculateResult, ErrorResult } from '../types.js';

/**
 * Safe math expression evaluator — recursive descent parser.
 * No eval(). Supports:
 *   - Basic arithmetic: + - * / %
 *   - Exponentiation: ^ or **
 *   - Parentheses
 *   - Unary minus
 *   - Functions: sqrt, cbrt, abs, ceil, floor, round, log, log2, log10, ln, sin, cos, tan, asin, acos, atan, exp, sign, trunc
 *   - Constants: pi, e, tau, phi, inf/infinity
 *   - Factorial: !
 *   - Percentage: 50% (treated as 0.5)
 *   - Bitwise: & | ~ << >>
 *   - Hex (0x), binary (0b), octal (0o) literals
 *   - Scientific notation: 1e10, 2.5e-3
 */

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  π: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
  τ: Math.PI * 2,
  phi: (1 + Math.sqrt(5)) / 2,
  φ: (1 + Math.sqrt(5)) / 2,
  inf: Infinity,
  infinity: Infinity,
};

const FUNCTIONS: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  trunc: Math.trunc,
  sign: Math.sign,
  log: Math.log10,
  log2: Math.log2,
  log10: Math.log10,
  ln: Math.log,
  exp: Math.exp,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  asinh: Math.asinh,
  acosh: Math.acosh,
  atanh: Math.atanh,
};

// Two-argument functions
const FUNCTIONS2: Record<string, (a: number, b: number) => number> = {
  pow: Math.pow,
  max: Math.max,
  min: Math.min,
  atan2: Math.atan2,
  mod: (a, b) => ((a % b) + b) % b,
};

class Parser {
  private pos = 0;
  private expr: string;

  constructor(expression: string) {
    // Normalize: replace × with *, ÷ with /, — with -, ** with ^
    this.expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/—/g, '-')
      .replace(/\*\*/g, '^');
  }

  parse(): number {
    const result = this.parseBitwiseOr();
    this.skipWhitespace();
    if (this.pos < this.expr.length) {
      throw new Error(`Unexpected character: '${this.expr[this.pos]}' at position ${this.pos}`);
    }
    return result;
  }

  private skipWhitespace(): void {
    while (this.pos < this.expr.length && /\s/.test(this.expr[this.pos])) {
      this.pos++;
    }
  }

  private peek(): string {
    this.skipWhitespace();
    return this.expr[this.pos] ?? '';
  }

  private consume(expected?: string): string {
    this.skipWhitespace();
    const ch = this.expr[this.pos];
    if (expected && ch !== expected) {
      throw new Error(`Expected '${expected}' at position ${this.pos}, got '${ch ?? 'end'}'`);
    }
    this.pos++;
    return ch;
  }

  // Bitwise OR: expr | expr
  private parseBitwiseOr(): number {
    let left = this.parseBitwiseXor();
    while (this.peek() === '|') {
      this.consume();
      left = left | this.parseBitwiseXor();
    }
    return left;
  }

  // Bitwise XOR (not used commonly, but supported)
  private parseBitwiseXor(): number {
    let left = this.parseBitwiseAnd();
    // We don't use ^ for XOR since it's exponentiation
    return left;
  }

  // Bitwise AND: expr & expr
  private parseBitwiseAnd(): number {
    let left = this.parseBitwiseShift();
    while (this.peek() === '&') {
      this.consume();
      left = left & this.parseBitwiseShift();
    }
    return left;
  }

  // Bitwise shift: << >>
  private parseBitwiseShift(): number {
    let left = this.parseAddition();
    while (true) {
      this.skipWhitespace();
      if (this.expr[this.pos] === '<' && this.expr[this.pos + 1] === '<') {
        this.pos += 2;
        left = left << this.parseAddition();
      } else if (this.expr[this.pos] === '>' && this.expr[this.pos + 1] === '>') {
        this.pos += 2;
        left = left >> this.parseAddition();
      } else {
        break;
      }
    }
    return left;
  }

  // Addition / subtraction
  private parseAddition(): number {
    let left = this.parseMultiplication();
    while (true) {
      const op = this.peek();
      if (op === '+') {
        this.consume();
        left += this.parseMultiplication();
      } else if (op === '-') {
        this.consume();
        left -= this.parseMultiplication();
      } else {
        break;
      }
    }
    return left;
  }

  // Multiplication / division / modulo
  private parseMultiplication(): number {
    let left = this.parseExponentiation();
    while (true) {
      const op = this.peek();
      if (op === '*') {
        this.consume();
        left *= this.parseExponentiation();
      } else if (op === '/') {
        this.consume();
        const right = this.parseExponentiation();
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      } else if (op === '%') {
        this.consume();
        left = left % this.parseExponentiation();
      } else if (op && /[([a-zA-Zπτφ_]/.test(op)) {
        left *= this.parseExponentiation();
      } else {
        break;
      }
    }
    return left;
  }

  // Exponentiation (right-associative)
  private parseExponentiation(): number {
    const base = this.parseUnary();
    if (this.peek() === '^') {
      this.consume();
      const exp = this.parseExponentiation(); // right-associative
      return Math.pow(base, exp);
    }
    return base;
  }

  // Unary: + - ~
  private parseUnary(): number {
    const op = this.peek();
    if (op === '-') {
      this.consume();
      return -this.parseUnary();
    }
    if (op === '+') {
      this.consume();
      return this.parseUnary();
    }
    if (op === '~') {
      this.consume();
      return ~this.parseUnary();
    }
    return this.parsePostfix();
  }

  // Postfix: factorial (!), percentage (%)
  private parsePostfix(): number {
    let value = this.parsePrimary();
    while (true) {
      this.skipWhitespace();
      if (this.expr[this.pos] === '!') {
        this.pos++;
        value = factorial(value);
      } else if (this.expr[this.pos] === '%' && this.shouldTreatAsPercentage()) {
        this.pos++;
        value = value / 100;
      } else {
        break;
      }
    }
    return value;
  }

  // Primary: number, constant, function, parenthesized expr
  private parsePrimary(): number {
    this.skipWhitespace();

    // Parenthesized expression
    if (this.expr[this.pos] === '(') {
      this.consume('(');
      const value = this.parseBitwiseOr();
      this.consume(')');
      return value;
    }

    // Number literals: hex, binary, octal, decimal, scientific
    if (/[0-9.]/.test(this.expr[this.pos]) || (this.expr[this.pos] === '0' && /[xXbBoO]/.test(this.expr[this.pos + 1]))) {
      return this.parseNumber();
    }

    // Identifier: constant or function
    if (/[a-zA-Zπτφ_]/.test(this.expr[this.pos])) {
      return this.parseIdentifier();
    }

    throw new Error(`Unexpected character: '${this.expr[this.pos]}' at position ${this.pos}`);
  }

  private shouldTreatAsPercentage(): boolean {
    let i = this.pos + 1;
    while (i < this.expr.length && /\s/.test(this.expr[i])) i++;
    const next = this.expr[i];
    return next === undefined || /[+\-*/^)%|&<>]/.test(next);
  }

  private charAt(i: number): string {
    return i < this.expr.length ? this.expr[i] : '';
  }

  private parseNumber(): number {
    const start = this.pos;

    // Hex
    if (this.charAt(this.pos) === '0' && /[xX]/.test(this.charAt(this.pos + 1))) {
      this.pos += 2;
      while (this.pos < this.expr.length && /[0-9a-fA-F]/.test(this.expr[this.pos])) this.pos++;
      return parseInt(this.expr.slice(start, this.pos), 16);
    }

    // Binary
    if (this.charAt(this.pos) === '0' && /[bB]/.test(this.charAt(this.pos + 1))) {
      this.pos += 2;
      while (this.pos < this.expr.length && /[01]/.test(this.expr[this.pos])) this.pos++;
      return parseInt(this.expr.slice(start + 2, this.pos), 2);
    }

    // Octal
    if (this.charAt(this.pos) === '0' && /[oO]/.test(this.charAt(this.pos + 1))) {
      this.pos += 2;
      while (this.pos < this.expr.length && /[0-7]/.test(this.expr[this.pos])) this.pos++;
      return parseInt(this.expr.slice(start + 2, this.pos), 8);
    }

    // Decimal (with optional scientific notation)
    while (this.pos < this.expr.length && /[0-9]/.test(this.expr[this.pos])) this.pos++;
    if (this.charAt(this.pos) === '.') {
      this.pos++;
      while (this.pos < this.expr.length && /[0-9]/.test(this.expr[this.pos])) this.pos++;
    }
    if (this.pos < this.expr.length && /[eE]/.test(this.expr[this.pos])) {
      this.pos++;
      if (this.pos < this.expr.length && /[+-]/.test(this.expr[this.pos])) this.pos++;
      while (this.pos < this.expr.length && /[0-9]/.test(this.expr[this.pos])) this.pos++;
    }

    const numStr = this.expr.slice(start, this.pos);
    const num = parseFloat(numStr);
    if (isNaN(num)) throw new Error(`Invalid number: '${numStr}'`);
    return num;
  }

  private parseIdentifier(): number {
    const start = this.pos;
    while (this.pos < this.expr.length && /[a-zA-Zπτφ_0-9]/.test(this.expr[this.pos])) {
      this.pos++;
    }
    const name = this.expr.slice(start, this.pos).toLowerCase();

    // Check for function call
    this.skipWhitespace();
    if (this.expr[this.pos] === '(') {
      if (name === 'max' || name === 'min') {
        const args = this.parseArguments();
        if (args.length === 0) throw new Error(`Function '${name}' requires at least one argument`);
        return name === 'max' ? Math.max(...args) : Math.min(...args);
      }
      if (FUNCTIONS2[name]) {
        const args = this.parseArguments();
        if (args.length !== 2) throw new Error(`Function '${name}' expects 2 arguments`);
        return FUNCTIONS2[name](args[0], args[1]);
      }
      if (FUNCTIONS[name]) {
        this.consume('(');
        const arg = this.parseBitwiseOr();
        this.consume(')');
        return FUNCTIONS[name](arg);
      }
      throw new Error(`Unknown function: '${name}'`);
    }

    // Constant
    if (CONSTANTS[name] !== undefined) return CONSTANTS[name];

    throw new Error(`Unknown identifier: '${name}'`);
  }

  private parseArguments(): number[] {
    const args: number[] = [];
    this.consume('(');
    this.skipWhitespace();
    if (this.expr[this.pos] === ')') {
      this.consume(')');
      return args;
    }
    while (true) {
      args.push(this.parseBitwiseOr());
      this.skipWhitespace();
      if (this.expr[this.pos] === ',') {
        this.pos++;
        continue;
      }
      break;
    }
    this.consume(')');
    return args;
  }
}

function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial of negative number');
  if (!Number.isInteger(n)) throw new Error('Factorial of non-integer');
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// ─── Public API ─────────────────────────────────────────────

export function evaluateMath(
  expression: string,
  locale: string = 'en-US',
  precision: number = 10,
): CalculateResult | ErrorResult {
  try {
    const normalizedExpression = normalizeMathExpression(expression);
    const parser = new Parser(normalizedExpression);
    const result = parser.parse();

    // Format the number
    let formatted: string;
    if (Number.isInteger(result) && Math.abs(result) < Number.MAX_SAFE_INTEGER) {
      formatted = new Intl.NumberFormat(locale).format(result);
    } else if (!isFinite(result)) {
      formatted = result.toString();
    } else {
      // Round to avoid floating point noise
      const rounded = parseFloat(result.toPrecision(precision));
      formatted = new Intl.NumberFormat(locale, {
        maximumSignificantDigits: precision,
      }).format(rounded);
    }

    // For hex/binary/octal inputs, also show base representations
    const metadata: Record<string, unknown> = {};
    if (Number.isInteger(result) && isFinite(result)) {
      const int = Math.trunc(result);
      metadata.hex = '0x' + int.toString(16).toUpperCase();
      metadata.binary = '0b' + int.toString(2);
      metadata.octal = '0o' + int.toString(8);
    }

    return {
      type: 'math',
      input: expression,
      result,
      formatted,
      metadata: {
        ...metadata,
        normalizedExpression,
      },
    };
  } catch (err) {
    return {
      type: 'error',
      input: expression,
      error: err instanceof Error ? err.message : 'Invalid expression',
    };
  }
}

function normalizeMathExpression(expression: string): string {
  let normalized = expression.trim().replace(/\s+/g, ' ');

  normalized = normalized.replace(/^(?:(?:what(?:'s|s| is))\s+the\s+|(?:what(?:'s|s| is))\s+|calculate\s+)/i, '');
  normalized = normalized.replace(/^the\s+/i, '');

  const wrappers: Array<[RegExp, string]> = [
    [/^square root of (.+)$/i, 'sqrt($1)'],
    [/^cube root of (.+)$/i, 'cbrt($1)'],
    [/^log of (.+)$/i, 'log($1)'],
    [/^sine of (.+)$/i, 'sin($1)'],
    [/^cosine of (.+)$/i, 'cos($1)'],
    [/^tangent of (.+)$/i, 'tan($1)'],
    [/^absolute value of (.+)$/i, 'abs($1)'],
    [/^factorial of (.+)$/i, '($1)!'],
    [/^half of (.+)$/i, '($1) / 2'],
    [/^double (.+)$/i, '2 * ($1)'],
    [/^triple (.+)$/i, '3 * ($1)'],
    [/^one third of (.+)$/i, '($1) / 3'],
    [/^one quarter of (.+)$/i, '($1) / 4'],
    [/^remainder of (.+?) divided by (.+)$/i, '($1) % ($2)'],
    [/^(.+?) to the power of (.+)$/i, '($1) ^ ($2)'],
    [/^(.+?) raised to (.+)$/i, '($1) ^ ($2)'],
    [/^(.+?) squared$/i, '($1) ^ 2'],
    [/^(.+?) cubed$/i, '($1) ^ 3'],
    [/^(\d+(?:\.\d+)?) percent of (.+)$/i, '($1%) * ($2)'],
    [/^(.+?%) of (.+)$/i, '($1) * ($2)'],
  ];

  for (const [pattern, replacement] of wrappers) {
    if (pattern.test(normalized)) {
      normalized = normalized.replace(pattern, replacement);
      break;
    }
  }

  normalized = normalized
    .replace(/\bdivided by\b/gi, '/')
    .replace(/\btimes\b/gi, '*')
    .replace(/\bplus\b/gi, '+')
    .replace(/\bminus\b/gi, '-');

  return normalized.replace(/\s+/g, ' ').trim();
}
