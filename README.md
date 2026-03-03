# @supercmd/calculator

A Raycast-style natural language calculator. One function, one string input, structured JSON output.

Supports math expressions, unit conversions, time zones, date calculations, currency, and crypto — all from natural language.

## Install

```bash
npm install @supercmd/calculator
```

## Quick Start

```ts
import { calculate } from '@supercmd/calculator';

// Math
await calculate('3 + 43 + 23');       // { type: "math", result: 69, formatted: "69" }
await calculate('sqrt(144)');          // { type: "math", result: 12, formatted: "12" }
await calculate('2^10');               // { type: "math", result: 1024, formatted: "1,024" }
await calculate('0xFF');               // { type: "math", result: 255, formatted: "255" }
await calculate('5!');                 // { type: "math", result: 120, formatted: "120" }

// Unit Conversions
await calculate('3 km to m');          // { type: "unit", result: 3000, formatted: "3,000 meter" }
await calculate('100 fahrenheit to celsius');  // { type: "unit", result: 37.78, formatted: "37.78 celsius" }
await calculate('5 kg to lb');         // { type: "unit", result: 11.02, formatted: "11.02 pound" }
await calculate('1 gb to mb');         // { type: "unit", result: 1000, formatted: "1,000 megabyte" }

// Time Zones
await calculate('time in tokyo');      // { type: "time", formatted: "Mon, Mar 2, 2026, 05:46 AM JST" }
await calculate('time in madison');    // { type: "time", formatted: "Sun, Mar 1, 2026, 02:46 PM CST" }
await calculate('india to us time');   // { type: "time", formatted: "... IST → ... EST" }

// Dates
await calculate('tomorrow');           // { type: "date", formatted: "Tuesday, March 3, 2026 at 02:16 AM" }
await calculate('next friday');        // { type: "date", formatted: "Friday, March 6, 2026 ..." }
await calculate('3 days from now');    // { type: "date", formatted: "..." }
await calculate('1741000000');         // { type: "date", formatted: "Monday, March 3, 2025 ..." } (unix timestamp)

// Currency (works out of the box — free APIs with fallbacks)
await calculate('usd to inr');            // { type: "currency", formatted: "₹91.08" }
await calculate('100 usd to inr');        // { type: "currency", formatted: "₹9,108" }
await calculate('500 jpy to usd');        // { type: "currency", formatted: "$3.21" }

// Crypto (works out of the box — CoinGecko → Binance → CoinCap)
await calculate('btc to usd');            // { type: "crypto", formatted: "$65,295" }
await calculate('1 eth to usd');          // { type: "crypto", formatted: "$1,914.12" }
await calculate('100 usd to btc');        // { type: "crypto", formatted: "0.00153 Bitcoin" }
await calculate('1.5 eth to inr');        // { type: "crypto", formatted: "₹261,743" }
await calculate('doge to inr');           // { type: "crypto", formatted: "₹8.28" }
```

## API

### `calculate(input: string, options?: Config): Promise<CalculateOutput>`

Single entry point. Accepts any natural language string.

#### Config

```ts
interface Config {
  rateProvider?: RateProvider;  // Optional — built-in free providers used by default
  timezone?: string;            // User's IANA timezone (default: system)
  locale?: string;              // Locale for formatting (default: 'en-US')
  precision?: number;           // Max significant digits (default: 10)
}
```

#### Output

```ts
// Success
interface CalculateResult {
  type: 'math' | 'unit' | 'currency' | 'crypto' | 'time' | 'date';
  input: string;
  result: number | string;
  formatted: string;
  metadata?: Record<string, unknown>;
}

// Failure
interface ErrorResult {
  type: 'error';
  input: string;
  error: string;
}
```

## Rate Provider

Currency and crypto conversions work **out of the box** using built-in free API providers:

- **Fiat**: Frankfurter (ECB) → ExchangeRate API → Fawaz Ahmed Currency API
- **Crypto**: CoinGecko → Binance → CoinCap

Each has automatic fallback — if one API is down, the next is tried. No API keys needed.

You can override with a custom provider:

```ts
interface RateProvider {
  getFiatRate(base: string, target: string): Promise<number>;
  getCryptoRate(base: string, target: string): Promise<number>;
}
```

### Example: Custom Provider

```ts
const myProvider: RateProvider = {
  async getFiatRate(base, target) {
    const res = await fetch(`https://api.example.com/rates?from=${base}&to=${target}`);
    const data = await res.json();
    return data.rate;
  },
  async getCryptoRate(base, target) {
    const res = await fetch(`https://api.example.com/crypto?from=${base}&to=${target}`);
    const data = await res.json();
    return data.rate;
  },
};

const result = await calculate('100 usd to eur', { rateProvider: myProvider });
```

## What's Supported

### Math Expressions
- Arithmetic: `+`, `-`, `*`, `/`, `%` (modulo)
- Exponentiation: `^`, `**`
- Parentheses: `(3 + 4) * 2`
- Functions: `sqrt`, `cbrt`, `abs`, `ceil`, `floor`, `round`, `log`, `log2`, `log10`, `ln`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `exp`, `sinh`, `cosh`, `tanh`, `pow`, `max`, `min`
- Constants: `pi`, `e`, `tau`, `phi`, `infinity`
- Factorial: `5!`
- Percentage: `50%` → 0.5
- Bitwise: `&`, `|`, `~`, `<<`, `>>`
- Base literals: `0xFF`, `0b1010`, `0o77`
- Scientific notation: `1e10`, `2.5e-3`

### Unit Conversions (16 categories, 250+ units)
- **Length**: nm, mm, cm, m, km, in, ft, yd, mi, nmi, au, light year, parsec
- **Mass**: mg, g, kg, tonne, oz, lb, stone, carat, grain
- **Volume**: ml, l, tsp, tbsp, fl oz, cup, pint, quart, gallon, barrel
- **Area**: mm², cm², m², km², in², ft², yd², mi², acre, hectare
- **Temperature**: celsius, fahrenheit, kelvin
- **Speed**: m/s, km/h, mph, knots, mach
- **Time**: ns, ms, s, min, hr, day, week, month, year, decade, century
- **Data**: bit, byte, KB, MB, GB, TB, PB, KiB, MiB, GiB, TiB
- **Pressure**: Pa, kPa, bar, atm, psi, torr, mmHg
- **Energy**: J, kJ, cal, kcal, Wh, kWh, BTU, eV
- **Power**: W, kW, MW, GW, hp
- **Angle**: rad, deg, grad, arcmin, arcsec, revolution
- **Frequency**: Hz, kHz, MHz, GHz, THz, RPM
- **Electric current**: A, mA, kA, μA
- **Voltage**: V, mV, kV, μV
- **Fuel economy**: km/l, mpg

### Currencies (150+ fiat codes)
Full ISO 4217 coverage including USD, EUR, GBP, JPY, INR, CNY, BRL, and 140+ more.
Common names work: `dollar`, `euro`, `pound`, `rupee`, `yuan`, `yen`.

### Cryptocurrencies (40+)
BTC, ETH, SOL, XRP, USDT, USDC, BNB, DOGE, ADA, MATIC, DOT, LTC, AVAX, LINK, UNI, ATOM, XLM, TON, SHIB, and more.
Names work: `bitcoin`, `ethereum`, `solana`, etc.

### Time Zones (200+ cities/regions)
- Cities: `time in tokyo`, `time in new york`, `time in madison`
- Countries: `time in india`, `time in germany`
- Abbreviations: `time in pst`, `time in ist`, `time in jst`
- Conversions: `india to us time`, `utc to ist`

### Dates
- Relative: `today`, `tomorrow`, `yesterday`
- Named days: `next monday`, `last friday`, `this wednesday`
- Offsets: `3 days from now`, `2 weeks ago`, `in 5 months`
- Unix timestamps: `1741000000`
- ISO parsing: `2025-03-03`
- To unix: `now to unix`, `today to timestamp`
- Date diff: `from 2025-01-01 to 2025-12-31`

## Intent Resolution Order

When input is ambiguous, the parser resolves in this order:

1. **Time** — if input matches "time in X" or "X to Y time"
2. **Date** — if input matches relative dates, timestamps, or date patterns
3. **Currency/Crypto** — if both sides of "X to Y" resolve to currencies or crypto
4. **Unit** — if both sides resolve to units in the same category
5. **Math** — fallback for any arithmetic expression

## Offline vs Online

| Feature | Offline | Needs Internet | Provider |
|---------|---------|----------------|----------|
| Math | Yes | | |
| Units | Yes | | |
| Time zones | Yes | | |
| Dates | Yes | | |
| Fiat currency | | Yes | Frankfurter → ExchangeRate → Fawaz Ahmed |
| Crypto | | Yes | CoinGecko → Binance → CoinCap |

## Edge Cases

- **Empty input** → `{ type: "error", error: "Empty input" }`
- **Invalid math** → `{ type: "error", error: "Unexpected character..." }`
- **Unknown currency** → falls through to math (likely error)
- **All APIs down** → `{ type: "error", error: "All providers failed" }`
- **Division by zero** → `{ type: "error", error: "Division by zero" }`
- **Large numbers** → handled via JavaScript's native number precision
- **Ambiguous `m`** → resolved as meter (length), not minute — use `min` for minutes

## License

MIT
