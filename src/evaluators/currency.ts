import type { CalculateResult, ErrorResult, RateProvider } from '../types.js';
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '../data/currencies.js';

export async function evaluateCurrency(
  amount: number,
  from: string,
  to: string,
  provider: RateProvider | undefined,
  locale: string = 'en-US',
  precision: number = 10,
): Promise<CalculateResult | ErrorResult> {
  const inputStr = `${amount} ${from} to ${to}`;

  if (!provider) {
    return {
      type: 'error',
      input: inputStr,
      error: 'No rate provider configured. Pass a rateProvider in options to enable currency conversion.',
    };
  }

  try {
    const rate = await provider.getFiatRate(from, to);
    const result = amount * rate;
    const rounded = parseFloat(result.toPrecision(precision));

    // Format with currency symbol if possible
    let formatted: string;
    try {
      formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: to,
        maximumSignificantDigits: precision,
      }).format(rounded);
    } catch {
      formatted = `${new Intl.NumberFormat(locale, { maximumSignificantDigits: precision }).format(rounded)} ${to}`;
    }

    return {
      type: 'currency',
      input: inputStr,
      result: rounded,
      formatted,
      metadata: {
        from: { code: from, name: FIAT_CURRENCIES[from] ?? from },
        to: { code: to, name: FIAT_CURRENCIES[to] ?? to },
        rate,
        amount,
      },
    };
  } catch (err) {
    return {
      type: 'error',
      input: inputStr,
      error: err instanceof Error ? err.message : 'Currency conversion failed',
    };
  }
}

export async function evaluateCrypto(
  amount: number,
  from: string,
  to: string,
  provider: RateProvider | undefined,
  locale: string = 'en-US',
  precision: number = 10,
): Promise<CalculateResult | ErrorResult> {
  const inputStr = `${amount} ${from} to ${to}`;

  if (!provider) {
    return {
      type: 'error',
      input: inputStr,
      error: 'No rate provider configured. Pass a rateProvider in options to enable crypto conversion.',
    };
  }

  try {
    const rate = await provider.getCryptoRate(from, to);
    const result = amount * rate;
    const rounded = parseFloat(result.toPrecision(precision));

    // Format: try currency format for fiat targets
    let formatted: string;
    if (FIAT_CURRENCIES[to]) {
      try {
        formatted = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: to,
          maximumSignificantDigits: precision,
        }).format(rounded);
      } catch {
        formatted = `${new Intl.NumberFormat(locale, { maximumSignificantDigits: precision }).format(rounded)} ${to}`;
      }
    } else {
      formatted = `${new Intl.NumberFormat(locale, { maximumSignificantDigits: precision }).format(rounded)} ${CRYPTO_CURRENCIES[to] ?? to}`;
    }

    return {
      type: 'crypto',
      input: inputStr,
      result: rounded,
      formatted,
      metadata: {
        from: { code: from, name: CRYPTO_CURRENCIES[from] ?? FIAT_CURRENCIES[from] ?? from },
        to: { code: to, name: CRYPTO_CURRENCIES[to] ?? FIAT_CURRENCIES[to] ?? to },
        rate,
        amount,
      },
    };
  } catch (err) {
    return {
      type: 'error',
      input: inputStr,
      error: err instanceof Error ? err.message : 'Crypto conversion failed',
    };
  }
}
