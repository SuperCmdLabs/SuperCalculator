import type { CalculateResult, ErrorResult } from '../types.js';
import { lookupUnit, convertUnit } from '../data/units.js';

export function evaluateUnit(
  amount: number,
  fromToken: string,
  toToken: string,
  locale: string = 'en-US',
  precision: number = 10,
): CalculateResult | ErrorResult {
  const from = lookupUnit(fromToken);
  const to = lookupUnit(toToken);

  if (!from) {
    return { type: 'error', input: `${amount} ${fromToken} to ${toToken}`, error: `Unknown unit: '${fromToken}'` };
  }
  if (!to) {
    return { type: 'error', input: `${amount} ${fromToken} to ${toToken}`, error: `Unknown unit: '${toToken}'` };
  }
  if (from.category !== to.category) {
    return {
      type: 'error',
      input: `${amount} ${fromToken} to ${toToken}`,
      error: `Cannot convert ${from.category.name} to ${to.category.name}`,
    };
  }

  const result = convertUnit(amount, from, to);
  const inputStr = `${amount} ${fromToken} to ${toToken}`;

  // Smart formatting
  const rounded = parseFloat(result.toPrecision(precision));
  const formatted = `${new Intl.NumberFormat(locale, { maximumSignificantDigits: precision }).format(rounded)} ${to.def.name}`;

  return {
    type: 'unit',
    input: inputStr,
    result: rounded,
    formatted,
    metadata: {
      fromUnit: from.def.name,
      toUnit: to.def.name,
      category: from.category.name,
      amount,
    },
  };
}
