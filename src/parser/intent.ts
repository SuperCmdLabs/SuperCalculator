import type { Intent } from '../types.js';
import { resolveFiat, resolveCrypto } from '../data/currencies.js';
import { lookupUnit } from '../data/units.js';
import { resolveTimezone } from '../data/timezones.js';

/**
 * Classify user input into an intent.
 * Resolution order: Time → Date → Currency/Crypto → Unit → Math
 */
export function detectIntent(input: string): Intent {
  const trimmed = normalizeWhitespace(input);
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

const TIME_IN_PATTERNS = [
  /^(?:what(?:'s| is) )?(?:the )?(?:current )?time (?:in|at) (.+)$/i,
  /^(?:what time is it|whats the time|what is the time|current time|time now) (?:in|at) (.+)$/i,
  /^(?:now|current time) in (.+)$/i,
];
const TIME_EXPLICIT_CONVERT_PATTERN = /^(midnight|noon|\d{1,2}(?::\d{2})?(?:\s*(?:am|pm))?)\s+(.+?)\s+to\s+(.+?)$/i;
const TIME_CONVERT_PATTERN = /^(.+?) to (.+?)(?: time)?$/i;
const TIME_NOW_PATTERN = /^(?:what(?:'s| is) )?(?:the )?(?:current )?time(?: now)?$/i;

function tryTimeIntent(input: string): Intent | null {
  let match: RegExpMatchArray | null;

  // "time in <place>"
  for (const pattern of TIME_IN_PATTERNS) {
    match = input.match(pattern);
    if (match) {
      const place = match[1].trim();
      const tz = resolveTimezone(place);
      if (tz) return { kind: 'time', query: input, to: tz };
      return { kind: 'time', query: input, to: place };
    }
  }

  match = input.match(TIME_EXPLICIT_CONVERT_PATTERN);
  if (match) {
    const time = match[1].trim();
    const from = match[2].trim();
    const to = match[3].trim();
    const fromTz = resolveTimezone(from);
    const toTz = resolveTimezone(to);
    if (fromTz && toTz) {
      return { kind: 'time', query: input, from: fromTz, to: toTz, time };
    }
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
  /^(date|day after tomorrow|day before yesterday)$/i,
  /^(next|last|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|year)$/i,
  /^(\d+)\s+(days?|weeks?|months?|years?|hours?|minutes?|seconds?)\s+(from now|ago|from today|from tomorrow)$/i,
  /^in\s+(\d+)\s+(days?|weeks?|months?|years?|hours?|minutes?|seconds?)$/i,
  // Unix timestamp
  /^(?:unix\s+)?(?:timestamp\s+)?(\d{10,13}|0)$/i,
  /^(?:unix|timestamp|epoch)\s+(\d{10,13})$/i,
  // "to unix" / "to timestamp"
  /^.+\s+(?:to|in)\s+(?:unix|timestamp|epoch)$/i,
  // ISO / date strings
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?/,
  // "date" queries
  /^(?:what(?:'s| is) )?(?:the )?(?:current )?date(?: today)?$/i,
  /^(?:(?:what(?:'s|s| is))\s+today|(?:what(?:'s|s| is))\s+today'?s date|what day is it|what date is .+|todays date|today'?s date|date today|current date|what day is .+|when is .+)$/i,
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
  const normalized = normalizeConversionInput(input);
  const match = normalized.match(CONVERSION_PATTERN);
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
  const normalized = normalizeConversionInput(input);
  const match = normalized.match(UNIT_PATTERN) || normalized.match(UNIT_PATTERN_NO_SPACE);
  if (!match) return null;

  const amount = parseFloat(match[1].replace(/,/g, ''));
  const fromToken = match[2].trim().toLowerCase();
  const toToken = match[3].trim().toLowerCase();

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

  if (resolveFiat(fromToken) || resolveCrypto(fromToken)) return null;
  if (resolveFiat(toToken) || resolveCrypto(toToken)) return null;

  return null;
}

function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

function normalizeConversionInput(input: string): string {
  let normalized = normalizeWhitespace(input);
  normalized = normalized
    .replace(/^convert\s+/i, '')
    .replace(/^how much is\s+/i, '')
    .replace(/^what(?:'s|s| is)\s+/i, '');

  normalized = normalized.replace(/^([$€£¥₹₩₽₺₦₵₪฿])\s*([\d.,]+)/, '$2 $1');

  return normalized;
}
