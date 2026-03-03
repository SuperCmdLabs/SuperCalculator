import type { Intent } from '../types.js';
import { resolveFiat, resolveCrypto } from '../data/currencies.js';
import { lookupUnit } from '../data/units.js';
import { resolveTimezone } from '../data/timezones.js';

/**
 * Classify user input into an intent.
 * Resolution order: Time → Date → Currency/Crypto → Unit → Math
 */
export function detectIntent(input: string): Intent {
  const trimmed = input.trim();
  if (!trimmed) {
    return { kind: 'math', expression: '0' };
  }

  // Try each classifier in priority order
  return (
    tryTimeIntent(trimmed) ??
    tryDateIntent(trimmed) ??
    tryCurrencyOrCryptoIntent(trimmed) ??
    tryUnitIntent(trimmed) ??
    { kind: 'math', expression: trimmed }
  );
}

// ─── TIME INTENT ────────────────────────────────────────────

const TIME_IN_PATTERN = /^(?:what(?:'s| is) )?(?:the )?(?:current )?time (?:in|at) (.+)$/i;
const TIME_CONVERT_PATTERN = /^(.+?) to (.+?) time$/i;
const TIME_NOW_PATTERN = /^(?:what(?:'s| is) )?(?:the )?(?:current )?time(?: now)?$/i;

function tryTimeIntent(input: string): Intent | null {
  let match: RegExpMatchArray | null;

  // "time in <place>"
  match = input.match(TIME_IN_PATTERN);
  if (match) {
    const place = match[1].trim();
    const tz = resolveTimezone(place);
    if (tz) return { kind: 'time', query: place, to: tz };
    // Still try — maybe it's a valid timezone string
    return { kind: 'time', query: place, to: place };
  }

  // "<zone> to <zone> time"
  match = input.match(TIME_CONVERT_PATTERN);
  if (match) {
    const from = match[1].trim();
    const to = match[2].trim();
    const fromTz = resolveTimezone(from);
    const toTz = resolveTimezone(to);
    if (fromTz || toTz) {
      return { kind: 'time', query: input, from: fromTz ?? from, to: toTz ?? to };
    }
  }

  // "time" / "what time is it"
  match = input.match(TIME_NOW_PATTERN);
  if (match) {
    return { kind: 'time', query: input };
  }

  // "time in" at start but place didn't resolve — still treat as time
  if (/^time\s/i.test(input)) {
    return { kind: 'time', query: input };
  }

  // "<place> time" / "<place> time now" / "<place> now"
  const placeSuffixMatch = input.match(/^(.+?)\s+(?:time|now|time now)$/i);
  if (placeSuffixMatch) {
    const place = placeSuffixMatch[1].trim();
    const tz = resolveTimezone(place);
    if (tz) return { kind: 'time', query: place, to: tz };
  }

  // Bare place name — "madison", "tokyo", "new york"
  // Only match if the entire input resolves to a known timezone
  const tz = resolveTimezone(input);
  if (tz) {
    return { kind: 'time', query: input, to: tz };
  }

  return null;
}

// ─── DATE INTENT ────────────────────────────────────────────

const DATE_PATTERNS = [
  // Relative dates
  /^(today|now|tomorrow|yesterday)$/i,
  /^(next|last|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|year)$/i,
  /^(\d+)\s+(days?|weeks?|months?|years?|hours?|minutes?|seconds?)\s+(from now|ago|from today|from tomorrow)$/i,
  /^in\s+(\d+)\s+(days?|weeks?|months?|years?|hours?|minutes?|seconds?)$/i,
  // Unix timestamp
  /^(?:unix\s+)?(?:timestamp\s+)?(\d{10,13})$/i,
  /^(?:unix|timestamp|epoch)\s+(\d{10,13})$/i,
  // "to unix" / "to timestamp"
  /^.+\s+(?:to|in)\s+(?:unix|timestamp|epoch)$/i,
  // ISO / date strings
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?/,
  // "date" queries
  /^(?:what(?:'s| is) )?(?:the )?(?:current )?date(?: today)?$/i,
  // Days between dates
  /^(?:days?\s+)?(?:between|from)\s+.+\s+(?:to|and|until)\s+.+$/i,
];

function tryDateIntent(input: string): Intent | null {
  for (const pattern of DATE_PATTERNS) {
    if (pattern.test(input)) {
      return { kind: 'date', query: input };
    }
  }
  return null;
}

// ─── CURRENCY / CRYPTO INTENT ───────────────────────────────

// Patterns:
// "100 usd to inr" | "usd to inr" | "$100 to eur" | "100 dollars to euros"
// "1.5 btc to usd" | "eth to inr" | "bitcoin to usd"
const CONVERSION_PATTERN = /^([\d.,]+)?\s*([a-zA-Z$€£¥₹₩₽₺₦₵₪฿]+(?:\s+[a-zA-Z]+)?)\s+(?:to|in|into|as|=)\s+([a-zA-Z$€£¥₹₩₽₺₦₵₪฿]+(?:\s+[a-zA-Z]+)?)$/i;

function tryCurrencyOrCryptoIntent(input: string): Intent | null {
  const match = input.match(CONVERSION_PATTERN);
  if (!match) return null;

  const amount = match[1] ? parseFloat(match[1].replace(/,/g, '')) : 1;
  const fromToken = match[2].trim();
  const toToken = match[3].trim();

  // Check crypto first (both sides)
  const fromCrypto = resolveCrypto(fromToken);
  const toCrypto = resolveCrypto(toToken);
  const fromFiat = resolveFiat(fromToken);
  const toFiat = resolveFiat(toToken);

  // Crypto → Crypto, Crypto → Fiat, Fiat → Crypto
  if (fromCrypto && (toCrypto || toFiat)) {
    return { kind: 'crypto', amount, from: fromCrypto, to: toCrypto ?? toFiat! };
  }
  if (fromFiat && toCrypto) {
    return { kind: 'crypto', amount, from: fromFiat, to: toCrypto };
  }

  // Fiat → Fiat
  if (fromFiat && toFiat) {
    return { kind: 'currency', amount, from: fromFiat, to: toFiat };
  }

  return null;
}

// ─── UNIT INTENT ────────────────────────────────────────────

// "3 km to m" | "3km to m" | "5 kilograms in pounds" | "100 fahrenheit to celsius"
// Also handle "100f to c" and "100 f to c"
const UNIT_PATTERN = /^(-?[\d.,]+)\s*([a-zA-Z°/µμ'"²³]+(?:\s+[a-zA-Z]+(?:\s+[a-zA-Z]+)?)?)\s+(?:to|in|into|as|=)\s+([a-zA-Z°/µμ'"²³]+(?:\s+[a-zA-Z]+(?:\s+[a-zA-Z]+)?)?)$/i;
const UNIT_PATTERN_NO_SPACE = /^(-?[\d.,]+)([a-zA-Z°]+)\s+(?:to|in|into|as)\s+([a-zA-Z°]+(?:\s+[a-zA-Z]+)?)$/i;

function tryUnitIntent(input: string): Intent | null {
  const match = input.match(UNIT_PATTERN) || input.match(UNIT_PATTERN_NO_SPACE);
  if (!match) return null;

  const amount = parseFloat(match[1].replace(/,/g, ''));
  const fromToken = match[2].trim().toLowerCase();
  const toToken = match[3].trim().toLowerCase();

  // Don't match if these are currencies/cryptos
  if (resolveFiat(fromToken) || resolveCrypto(fromToken)) return null;
  if (resolveFiat(toToken) || resolveCrypto(toToken)) return null;

  const fromUnit = lookupUnit(fromToken);
  const toUnit = lookupUnit(toToken);

  if (fromUnit && toUnit && fromUnit.category === toUnit.category) {
    return {
      kind: 'unit',
      amount,
      from: fromToken,
      to: toToken,
      category: fromUnit.category.name,
    };
  }

  return null;
}
