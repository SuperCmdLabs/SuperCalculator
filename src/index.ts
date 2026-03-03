export type {
  CalculateResult,
  ErrorResult,
  CalculateOutput,
  ResultType,
  RateProvider,
  Config,
} from './types.js';

export { FIAT_CURRENCIES, CRYPTO_CURRENCIES, resolveFiat, resolveCrypto } from './data/currencies.js';
export { UNIT_CATEGORIES, lookupUnit, convertUnit } from './data/units.js';
export { TIMEZONE_MAP, TZ_ABBREVIATIONS, resolveTimezone } from './data/timezones.js';
export { createDefaultProvider } from './providers/default.js';

import type { CalculateOutput, Config, RateProvider } from './types.js';
import { detectIntent } from './parser/intent.js';
import { evaluateMath } from './evaluators/math.js';
import { evaluateUnit } from './evaluators/unit.js';
import { evaluateTime } from './evaluators/time.js';
import { evaluateDate } from './evaluators/date.js';
import { evaluateCurrency, evaluateCrypto } from './evaluators/currency.js';
import { createDefaultProvider } from './providers/default.js';

/** Lazily-initialized default rate provider */
let _defaultProvider: RateProvider | null = null;
function getDefaultProvider(): RateProvider {
  if (!_defaultProvider) _defaultProvider = createDefaultProvider();
  return _defaultProvider;
}

/**
 * Natural language calculator — the single entry point.
 *
 * Accepts a string input and returns a structured result.
 * Works offline for math, units, time, and dates.
 * Uses built-in free API providers for currency/crypto by default.
 * Pass a custom `rateProvider` in options to override.
 *
 * @example
 * ```ts
 * const result = await calculate("3 + 4 * 2");
 * // { type: "math", result: 11, formatted: "11", ... }
 *
 * const result = await calculate("3 km to m");
 * // { type: "unit", result: 3000, formatted: "3,000 meter", ... }
 *
 * const result = await calculate("time in tokyo");
 * // { type: "time", result: "...", formatted: "...", ... }
 * ```
 */
export async function calculate(
  input: string,
  options?: Config,
): Promise<CalculateOutput> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { type: 'error', input, error: 'Empty input' };
  }

  const locale = options?.locale ?? 'en-US';
  const precision = options?.precision ?? 10;
  const rateProvider = options?.rateProvider ?? getDefaultProvider();

  const intent = detectIntent(trimmed);

  switch (intent.kind) {
    case 'time':
      return evaluateTime(
        intent.query,
        intent.from,
        intent.to,
        intent.time,
        options?.timezone,
      );

    case 'date':
      return evaluateDate(intent.query);

    case 'currency':
      return evaluateCurrency(
        intent.amount,
        intent.from,
        intent.to,
        rateProvider,
        locale,
        precision,
      );

    case 'crypto':
      return evaluateCrypto(
        intent.amount,
        intent.from,
        intent.to,
        rateProvider,
        locale,
        precision,
      );

    case 'unit':
      return evaluateUnit(
        intent.amount,
        intent.from,
        intent.to,
        locale,
        precision,
      );

    case 'math':
      return evaluateMath(intent.expression, locale, precision);
  }
}
