// ─── Result Types ───────────────────────────────────────────

export type ResultType = 'math' | 'unit' | 'currency' | 'crypto' | 'time' | 'date';

export interface CalculateResult {
  type: ResultType;
  input: string;
  result: number | string;
  formatted: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorResult {
  type: 'error';
  input: string;
  error: string;
}

export type CalculateOutput = CalculateResult | ErrorResult;

// ─── Configuration ──────────────────────────────────────────

export interface RateProvider {
  getFiatRate(base: string, target: string): Promise<number>;
  getCryptoRate(base: string, target: string): Promise<number>;
}

export interface Config {
  rateProvider?: RateProvider;
  /** User's local timezone (IANA), defaults to system timezone */
  timezone?: string;
  /** Locale for number formatting, defaults to 'en-US' */
  locale?: string;
  /** Maximum decimal places for results */
  precision?: number;
}

// ─── Internal Types ─────────────────────────────────────────

export type Intent =
  | { kind: 'time'; query: string; from?: string; to?: string }
  | { kind: 'date'; query: string }
  | { kind: 'currency'; amount: number; from: string; to: string }
  | { kind: 'crypto'; amount: number; from: string; to: string }
  | { kind: 'unit'; amount: number; from: string; to: string; category: string }
  | { kind: 'math'; expression: string };
