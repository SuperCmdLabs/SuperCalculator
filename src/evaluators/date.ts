import type { CalculateResult, ErrorResult } from '../types.js';

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Handle date queries:
 * - "today", "tomorrow", "yesterday"
 * - "next monday", "last friday"
 * - "3 days from now", "2 weeks ago"
 * - "in 5 days"
 * - Unix timestamp parsing
 * - ISO date parsing
 * - "date" / "what's the date"
 */
export function evaluateDate(query: string): CalculateResult | ErrorResult {
  const lower = query.toLowerCase().trim();

  try {
    // ─── Relative simple ──────────────────────────────
    if (
      lower === 'today' ||
      lower === 'now' ||
      lower === 'date' ||
      /^(?:(?:what(?:'s|s| is))\s+today|(?:what(?:'s|s| is))\s+today'?s date|what day is it|todays date|today'?s date|date today|current date|what is the date today)$/.test(lower) ||
      /^(?:what(?:'s| is) )?(?:the )?(?:current )?date(?: today)?$/.test(lower)
    ) {
      return formatDateResult(query, new Date());
    }

    if (lower === 'tomorrow') {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return formatDateResult(query, d);
    }

    if (lower === 'yesterday') {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return formatDateResult(query, d);
    }

    if (lower === 'day after tomorrow') {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      return formatDateResult(query, d);
    }

    if (lower === 'day before yesterday') {
      const d = new Date();
      d.setDate(d.getDate() - 2);
      return formatDateResult(query, d);
    }

    const whatDateMatch = lower.match(/^what date is (.+)$/);
    if (whatDateMatch) {
      const d = parseFlexibleDate(whatDateMatch[1]);
      if (d) return formatDateResult(query, d);
    }

    const whenIsMatch = lower.match(/^(?:what day is|when is)\s+(.+)$/);
    if (whenIsMatch) {
      const d = parseFlexibleDate(whenIsMatch[1]);
      if (d) return formatDateResult(query, d);
    }

    // ─── "next/last <day>" ────────────────────────────
    const nextLastMatch = lower.match(/^(next|last|this)\s+(.+)$/);
    if (nextLastMatch) {
      const direction = nextLastMatch[1];
      const target = nextLastMatch[2];

      const dayIndex = DAY_NAMES.indexOf(target);
      if (dayIndex !== -1) {
        const d = getRelativeDay(dayIndex, direction as 'next' | 'last' | 'this');
        return formatDateResult(query, d);
      }

      // "next week", "last month", "next year"
      const now = new Date();
      if (target === 'week') {
        const offset = direction === 'next' ? 7 : direction === 'last' ? -7 : 0;
        now.setDate(now.getDate() + offset);
        return formatDateResult(query, now);
      }
      if (target === 'month') {
        const offset = direction === 'next' ? 1 : direction === 'last' ? -1 : 0;
        now.setMonth(now.getMonth() + offset);
        return formatDateResult(query, now);
      }
      if (target === 'year') {
        const offset = direction === 'next' ? 1 : direction === 'last' ? -1 : 0;
        now.setFullYear(now.getFullYear() + offset);
        return formatDateResult(query, now);
      }
    }

    // ─── "N <units> from now/ago" ─────────────────────
    const relativeMatch = lower.match(/^(\d+)\s+(days?|weeks?|months?|years?|hours?|minutes?|seconds?)\s+(from now|ago|from today|from tomorrow)$/);
    if (relativeMatch) {
      const amount = parseInt(relativeMatch[1]);
      const unit = relativeMatch[2].replace(/s$/, '');
      const direction = relativeMatch[3];
      const isAgo = direction === 'ago';
      const base = direction === 'from tomorrow' ? (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })() : new Date();

      const d = applyOffset(base, amount * (isAgo ? -1 : 1), unit);
      return formatDateResult(query, d);
    }

    // ─── "in N <units>" ──────────────────────────────
    const inMatch = lower.match(/^in\s+(\d+)\s+(days?|weeks?|months?|years?|hours?|minutes?|seconds?)$/);
    if (inMatch) {
      const amount = parseInt(inMatch[1]);
      const unit = inMatch[2].replace(/s$/, '');
      const d = applyOffset(new Date(), amount, unit);
      return formatDateResult(query, d);
    }

    // ─── Unix timestamp ──────────────────────────────
    const unixMatch = lower.match(/^(?:unix\s+)?(?:timestamp\s+)?(\d{10,13}|0)$/);
    if (unixMatch) {
      const ts = parseInt(unixMatch[1]);
      // If 13 digits, it's milliseconds; if 10, seconds
      const ms = ts > 9999999999 ? ts : ts * 1000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) {
        return { type: 'error', input: query, error: 'Invalid timestamp' };
      }
      return {
        type: 'date',
        input: query,
        result: d.toISOString(),
        formatted: `${formatDate(d)} (${d.toISOString()})`,
        metadata: { unix: Math.floor(ms / 1000), iso: d.toISOString(), date: d },
      };
    }

    // "to unix" / "to timestamp"
    const toUnixMatch = lower.match(/^(.+)\s+(?:to|in)\s+(?:unix|timestamp|epoch)$/);
    if (toUnixMatch) {
      const dateStr = toUnixMatch[1].trim();
      let d: Date;
      const parsed = parseFlexibleDate(dateStr);
      if (!parsed) {
        return { type: 'error', input: query, error: `Cannot parse date: '${dateStr}'` };
      }
      d = parsed;
      const unix = Math.floor(d.getTime() / 1000);
      return {
        type: 'date',
        input: query,
        result: unix,
        formatted: unix.toString(),
        metadata: { iso: d.toISOString(), date: d },
      };
    }

    // ─── ISO / standard date string ──────────────────
    if (/^\d{4}-\d{2}-\d{2}/.test(lower)) {
      const d = new Date(query.trim());
      if (!isNaN(d.getTime())) {
        return formatDateResult(query, d, { iso: d.toISOString(), unix: Math.floor(d.getTime() / 1000) });
      }
    }

    // ─── Days between dates ──────────────────────────
    const betweenMatch = lower.match(/^(?:days?\s+)?(?:between|from)\s+(.+)\s+(?:to|and|until)\s+(.+)$/);
    if (betweenMatch) {
      const d1 = parseFlexibleDate(betweenMatch[1].trim());
      const d2 = parseFlexibleDate(betweenMatch[2].trim());
      if (d1 && d2) {
        const diffMs = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        return {
          type: 'date',
          input: query,
          result: diffDays,
          formatted: `${diffDays} days`,
          metadata: { from: d1.toISOString(), to: d2.toISOString() },
        };
      }
    }

    return { type: 'error', input: query, error: 'Could not parse date query' };
  } catch (err) {
    return {
      type: 'error',
      input: query,
      error: err instanceof Error ? err.message : 'Date evaluation failed',
    };
  }
}

// ─── Helpers ────────────────────────────────────────────────

function getRelativeDay(targetDay: number, direction: 'next' | 'last' | 'this'): Date {
  const now = new Date();
  const currentDay = now.getDay();
  let diff: number;

  if (direction === 'next') {
    diff = (targetDay - currentDay + 7) % 7 || 7;
  } else if (direction === 'last') {
    diff = -((currentDay - targetDay + 7) % 7 || 7);
  } else {
    // "this" — closest occurrence this week
    diff = targetDay - currentDay;
  }

  now.setDate(now.getDate() + diff);
  return now;
}

function applyOffset(base: Date, amount: number, unit: string): Date {
  const d = new Date(base);
  switch (unit) {
    case 'second': d.setSeconds(d.getSeconds() + amount); break;
    case 'minute': d.setMinutes(d.getMinutes() + amount); break;
    case 'hour': d.setHours(d.getHours() + amount); break;
    case 'day': d.setDate(d.getDate() + amount); break;
    case 'week': d.setDate(d.getDate() + amount * 7); break;
    case 'month': d.setMonth(d.getMonth() + amount); break;
    case 'year': d.setFullYear(d.getFullYear() + amount); break;
  }
  return d;
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

function formatDateResult(
  input: string,
  d: Date,
  extraMeta?: Record<string, unknown>,
): CalculateResult {
  const formatted = formatDate(d);
  return {
    type: 'date',
    input,
    result: d.toISOString(),
    formatted,
    metadata: {
      iso: d.toISOString(),
      unix: Math.floor(d.getTime() / 1000),
      dayOfWeek: DAY_NAMES[d.getDay()],
      ...extraMeta,
    },
  };
}

function parseFlexibleDate(str: string): Date | null {
  if (str === 'today' || str === 'now' || str === 'date') return new Date();
  if (str === 'tomorrow') {
    const d = new Date(); d.setDate(d.getDate() + 1); return d;
  }
  if (str === 'yesterday') {
    const d = new Date(); d.setDate(d.getDate() - 1); return d;
  }
  if (str === 'day after tomorrow') {
    const d = new Date(); d.setDate(d.getDate() + 2); return d;
  }
  if (str === 'day before yesterday') {
    const d = new Date(); d.setDate(d.getDate() - 2); return d;
  }
  const relativeDay = str.match(/^(next|last|this)\s+(.+)$/);
  if (relativeDay) {
    const direction = relativeDay[1] as 'next' | 'last' | 'this';
    const dayIndex = DAY_NAMES.indexOf(relativeDay[2]);
    if (dayIndex !== -1) return getRelativeDay(dayIndex, direction);
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}
