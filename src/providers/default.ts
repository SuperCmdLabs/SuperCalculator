import type { RateProvider } from '../types.js';

const STATIC_FIAT_PER_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.1,
  JPY: 150,
  CNY: 7.2,
  AUD: 1.52,
  CAD: 1.35,
  CHF: 0.88,
  KRW: 1330,
  SGD: 1.34,
  HKD: 7.8,
  NZD: 1.64,
  SEK: 10.5,
  NOK: 10.7,
  DKK: 6.85,
  MXN: 17.1,
  BRL: 5.0,
  THB: 35.8,
  PHP: 56.2,
  IDR: 15700,
  MYR: 4.48,
  ZAR: 18.4,
  AED: 3.67,
  SAR: 3.75,
  TRY: 32.1,
  PLN: 3.95,
  CZK: 23.2,
  RUB: 92,
};

const STATIC_CRYPTO_USD: Record<string, number> = {
  BTC: 92000,
  ETH: 3500,
  SOL: 180,
  XRP: 2.3,
  DOGE: 0.18,
  ADA: 0.8,
  MATIC: 0.95,
  DOT: 7.5,
  LTC: 95,
  AVAX: 42,
  LINK: 20,
  UNI: 12,
  ATOM: 10,
  XLM: 0.12,
  TON: 6,
  SHIB: 0.000025,
  BNB: 650,
  USDT: 1,
  USDC: 1,
};

// ─── Helpers ────────────────────────────────────────────────

async function fetchJSON(url: string, timeoutMs = 8000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function withFallback<T>(fns: Array<() => Promise<T>>): Promise<T> {
  let lastError: Error | undefined;
  for (const fn of fns) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError ?? new Error('All providers failed');
}

async function staticFiatRate(base: string, target: string): Promise<number> {
  const from = STATIC_FIAT_PER_USD[base];
  const to = STATIC_FIAT_PER_USD[target];
  if (from === undefined || to === undefined) {
    throw new Error(`Static fiat rate unavailable for ${base}/${target}`);
  }
  return to / from;
}

async function staticCryptoRate(from: string, to: string): Promise<number> {
  const fromCrypto = STATIC_CRYPTO_USD[from];
  const toCrypto = STATIC_CRYPTO_USD[to];

  if (fromCrypto !== undefined && toCrypto !== undefined) {
    return fromCrypto / toCrypto;
  }

  if (fromCrypto !== undefined) {
    const usdToTarget = await staticFiatRate('USD', to);
    return fromCrypto * usdToTarget;
  }

  if (toCrypto !== undefined) {
    const fromToUsd = await staticFiatRate(from, 'USD');
    return fromToUsd / toCrypto;
  }

  throw new Error(`Static crypto rate unavailable for ${from}/${to}`);
}

// ─── Fiat Providers ─────────────────────────────────────────

/** Provider 1: Frankfurter (ECB data, free, no key) */
async function frankfurterRate(base: string, target: string): Promise<number> {
  const data = await fetchJSON(
    `https://api.frankfurter.dev/v1/latest?base=${base}&symbols=${target}`,
  ) as { rates: Record<string, number> };
  const rate = data?.rates?.[target];
  if (typeof rate !== 'number') throw new Error('Rate not found');
  return rate;
}

/** Provider 2: ExchangeRate API (free, no key) */
async function exchangeRateApiRate(base: string, target: string): Promise<number> {
  const data = await fetchJSON(
    `https://open.er-api.com/v6/latest/${base}`,
  ) as { rates: Record<string, number> };
  const rate = data?.rates?.[target];
  if (typeof rate !== 'number') throw new Error('Rate not found');
  return rate;
}

/** Provider 3: Fawaz Ahmed Currency API (free, no key) */
async function fawazCurrencyRate(base: string, target: string): Promise<number> {
  const b = base.toLowerCase();
  const t = target.toLowerCase();
  const data = await fetchJSON(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${b}.json`,
  ) as Record<string, Record<string, number>>;
  const rate = data?.[b]?.[t];
  if (typeof rate !== 'number') throw new Error('Rate not found');
  return rate;
}

// ─── Crypto Providers ───────────────────────────────────────

// CoinGecko ID map for common tickers
const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', XRP: 'ripple',
  USDT: 'tether', USDC: 'usd-coin', BNB: 'binancecoin', DOGE: 'dogecoin',
  ADA: 'cardano', MATIC: 'matic-network', DOT: 'polkadot', LTC: 'litecoin',
  AVAX: 'avalanche-2', LINK: 'chainlink', UNI: 'uniswap', ATOM: 'cosmos',
  XLM: 'stellar', ALGO: 'algorand', FIL: 'filecoin', NEAR: 'near',
  APT: 'aptos', ARB: 'arbitrum', OP: 'optimism', SUI: 'sui',
  SHIB: 'shiba-inu', PEPE: 'pepe', TRX: 'tron', TON: 'the-open-network',
  HBAR: 'hedera-hashgraph', ICP: 'internet-computer', VET: 'vechain',
  AAVE: 'aave', MKR: 'maker', CRV: 'curve-dao-token', SNX: 'havven',
  COMP: 'compound-governance-token', SAND: 'the-sandbox', MANA: 'decentraland',
  AXS: 'axie-infinity', APE: 'apecoin', FTM: 'fantom', ONE: 'harmony',
  KAVA: 'kava', ROSE: 'oasis-network', ZEC: 'zcash', XMR: 'monero',
  DASH: 'dash', ETC: 'ethereum-classic', BCH: 'bitcoin-cash', BSV: 'bitcoin-cash-sv',
};

// CoinGecko currency map (fiat tickers it supports)
const COINGECKO_FIATS = new Set([
  'usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'cny', 'hkd', 'nzd',
  'sek', 'krw', 'sgd', 'nok', 'mxn', 'inr', 'rub', 'zar', 'try', 'brl',
  'twd', 'dkk', 'pln', 'thb', 'idr', 'huf', 'czk', 'ils', 'clp', 'php',
  'aed', 'sar', 'myr', 'ars', 'ngn', 'pkr', 'bdt', 'vnd', 'egp', 'uah',
  'btc', 'eth', 'bnb', 'xrp', 'sol', 'dot', 'ltc',
]);

/** Provider 1: CoinGecko (free, no key, generous limits) */
async function coingeckoRate(from: string, to: string): Promise<number> {
  const fromId = COINGECKO_IDS[from];
  const toId = COINGECKO_IDS[to];

  // Crypto → Fiat or Crypto → Crypto
  if (fromId) {
    const vsCurrency = toId ? to.toLowerCase() : to.toLowerCase();
    if (!COINGECKO_FIATS.has(vsCurrency) && !toId) {
      throw new Error(`CoinGecko: unsupported target ${to}`);
    }
    const target = toId ? to.toLowerCase() : to.toLowerCase();
    const data = await fetchJSON(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromId}&vs_currencies=${target}`,
    ) as Record<string, Record<string, number>>;
    const rate = data?.[fromId]?.[target];
    if (typeof rate !== 'number') throw new Error('CoinGecko: rate not found');
    return rate;
  }

  // Fiat → Crypto (invert: get crypto price in fiat, then 1/price)
  if (toId) {
    const fiat = from.toLowerCase();
    if (!COINGECKO_FIATS.has(fiat)) {
      throw new Error(`CoinGecko: unsupported source ${from}`);
    }
    const data = await fetchJSON(
      `https://api.coingecko.com/api/v3/simple/price?ids=${toId}&vs_currencies=${fiat}`,
    ) as Record<string, Record<string, number>>;
    const priceInFiat = data?.[toId]?.[fiat];
    if (typeof priceInFiat !== 'number' || priceInFiat === 0) throw new Error('CoinGecko: rate not found');
    return 1 / priceInFiat;
  }

  throw new Error(`CoinGecko: unknown pair ${from}/${to}`);
}

// Binance symbol formatting
function binanceSymbol(from: string, to: string): string {
  return `${from}${to}`;
}

// Stablecoins treated as USD equivalents for Binance routing
const STABLECOINS = new Set(['USDT', 'USDC', 'BUSD']);
const BINANCE_QUOTES = new Set(['USDT', 'USDC', 'BTC', 'ETH', 'BNB', 'BUSD']);

/** Provider 2: Binance (free, no key, fast) */
async function binanceRate(from: string, to: string): Promise<number> {
  // Direct pair
  const tryDirect = async (a: string, b: string): Promise<number | null> => {
    try {
      const data = await fetchJSON(
        `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol(a, b)}`,
      ) as { price: string };
      const p = parseFloat(data?.price);
      return isNaN(p) ? null : p;
    } catch {
      return null;
    }
  };

  // Try direct pair
  let rate = await tryDirect(from, to);
  if (rate !== null) return rate;

  // Try inverse
  rate = await tryDirect(to, from);
  if (rate !== null && rate !== 0) return 1 / rate;

  // Route through USDT
  if (from !== 'USDT' && to !== 'USDT') {
    const fromUsdt = await tryDirect(from, 'USDT');
    const toUsdt = await tryDirect(to, 'USDT');
    if (fromUsdt !== null && toUsdt !== null && toUsdt !== 0) {
      return fromUsdt / toUsdt;
    }
  }

  // For fiat targets, route: crypto → USDT, then treat USDT ≈ 1 USD
  // and use fiat conversion for USD → target
  throw new Error(`Binance: no pair found for ${from}/${to}`);
}

/** Provider 3: CoinCap (free, no key) */
async function coincapRate(from: string, to: string): Promise<number> {
  const COINCAP_IDS: Record<string, string> = {
    BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', XRP: 'xrp',
    USDT: 'tether', USDC: 'usd-coin', BNB: 'binance-coin', DOGE: 'dogecoin',
    ADA: 'cardano', DOT: 'polkadot', LTC: 'litecoin', AVAX: 'avalanche',
    LINK: 'chainlink', UNI: 'uniswap', ATOM: 'cosmos', XLM: 'stellar',
    MATIC: 'polygon', SHIB: 'shiba-inu', TRX: 'tron', TON: 'toncoin',
    BCH: 'bitcoin-cash', ETC: 'ethereum-classic', XMR: 'monero', ZEC: 'zcash',
  };

  // CoinCap returns prices in USD, so we get both prices in USD and divide
  const getUsdPrice = async (ticker: string): Promise<number> => {
    // If it's a fiat currency
    if (ticker === 'USD') return 1;
    const id = COINCAP_IDS[ticker];
    if (!id) throw new Error(`CoinCap: unknown ${ticker}`);
    const data = await fetchJSON(
      `https://api.coincap.io/v2/assets/${id}`,
    ) as { data: { priceUsd: string } };
    const price = parseFloat(data?.data?.priceUsd);
    if (isNaN(price)) throw new Error(`CoinCap: no price for ${ticker}`);
    return price;
  };

  const isFiat = (t: string) => !COINCAP_IDS[t] && t !== 'USD';

  // Crypto → USD
  if (to === 'USD') {
    return getUsdPrice(from);
  }

  // Crypto → Fiat (route through USD + fiat conversion later)
  if (isFiat(to)) {
    // Get USD price, caller handles fiat portion
    throw new Error('CoinCap: fiat target not directly supported');
  }

  // USD → Crypto
  if (from === 'USD') {
    const price = await getUsdPrice(to);
    return price === 0 ? 0 : 1 / price;
  }

  // Crypto → Crypto
  const fromUsd = await getUsdPrice(from);
  const toUsd = await getUsdPrice(to);
  if (toUsd === 0) throw new Error('CoinCap: zero price');
  return fromUsd / toUsd;
}

// ─── Combined Crypto Rate ───────────────────────────────────

/** Attempt crypto conversion, falling back through fiat routing if needed */
async function getCryptoRateWithFiatFallback(
  from: string,
  to: string,
  getFiat: (base: string, target: string) => Promise<number>,
): Promise<number> {
  // Check if we need fiat routing (crypto → non-USD fiat)
  const CRYPTO_SET = new Set(Object.keys(COINGECKO_IDS));
  const fromIsCrypto = CRYPTO_SET.has(from);
  const toIsCrypto = CRYPTO_SET.has(to);
  const toIsFiat = !toIsCrypto;
  const fromIsFiat = !fromIsCrypto;

  // Try direct crypto providers first
  try {
    return await withFallback([
      () => coingeckoRate(from, to),
      () => binanceRate(from, to),
      () => coincapRate(from, to),
      () => staticCryptoRate(from, to),
    ]);
  } catch {
    // If direct failed, try routing through USD
  }

  // Route: Crypto → USD → Fiat
  if (fromIsCrypto && toIsFiat) {
    const cryptoToUsd = await withFallback([
      () => coingeckoRate(from, 'USD'),
      () => binanceRate(from, 'USDT'),
      () => coincapRate(from, 'USD'),
      () => staticCryptoRate(from, 'USD'),
    ]);
    if (to === 'USD' || to === 'USDT' || to === 'USDC') return cryptoToUsd;
    const usdToFiat = await getFiat('USD', to);
    return cryptoToUsd * usdToFiat;
  }

  // Route: Fiat → USD → Crypto
  if (fromIsFiat && toIsCrypto) {
    const fiatToUsd = from === 'USD' ? 1 : await getFiat(from, 'USD');
    const usdToCrypto = await withFallback([
      () => coingeckoRate('USD', to).then(r => r === 0 ? Promise.reject() : r),
      async () => {
        const p = await coingeckoRate(to, 'USD');
        return p === 0 ? Promise.reject('zero') : 1 / p;
      },
      async () => {
        const p = await coincapRate(to, 'USD');
        return p === 0 ? Promise.reject('zero') : 1 / p;
      },
      () => staticCryptoRate('USD', to),
    ]);
    return fiatToUsd * usdToCrypto;
  }

  return staticCryptoRate(from, to);
}

// ─── Default Provider ───────────────────────────────────────

/**
 * Built-in rate provider with automatic fallback chains.
 *
 * Fiat: Frankfurter (ECB) → ExchangeRate API → Fawaz Ahmed Currency API
 * Crypto: CoinGecko → Binance → CoinCap (with fiat routing when needed)
 *
 * All APIs are free and require no API key.
 */
export function createDefaultProvider(): RateProvider {
  return {
    async getFiatRate(base: string, target: string): Promise<number> {
      return withFallback([
        () => frankfurterRate(base, target),
        () => exchangeRateApiRate(base, target),
        () => fawazCurrencyRate(base, target),
        () => staticFiatRate(base, target),
      ]);
    },

    async getCryptoRate(base: string, target: string): Promise<number> {
      const getFiat = (b: string, t: string) =>
        withFallback([
          () => frankfurterRate(b, t),
          () => exchangeRateApiRate(b, t),
          () => fawazCurrencyRate(b, t),
          () => staticFiatRate(b, t),
        ]);

      return getCryptoRateWithFiatFallback(base, target, getFiat);
    },
  };
}
