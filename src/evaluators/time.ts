import type { CalculateResult, ErrorResult } from '../types.js';
import { resolveTimezone } from '../data/timezones.js';

/**
 * Handle timezone queries:
 * - "time in tokyo"
 * - "india to us time"
 * - "time" (current time)
 */
export function evaluateTime(
  query: string,
  fromTz?: string,
  toTz?: string,
  explicitTime?: string,
  localTz?: string,
): CalculateResult | ErrorResult {
  const now = new Date();
  const userTz = localTz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    // Simple "time" → show local time
    if (!fromTz && !toTz) {
      const formatted = formatTimeInZone(now, userTz);
      return {
        type: 'time',
        input: query,
        result: formatted,
        formatted,
        metadata: { timezone: userTz, iso: now.toISOString() },
      };
    }

    // "time in <place>"
    if (toTz && !fromTz) {
      const resolvedTo = resolveTimezone(toTz) ?? toTz;
      try {
        const formatted = formatTimeInZone(now, resolvedTo);
        return {
          type: 'time',
          input: query,
          result: formatted,
          formatted,
          metadata: { timezone: resolvedTo, iso: now.toISOString() },
        };
      } catch {
        return { type: 'error', input: query, error: `Unknown timezone: '${toTz}'` };
      }
    }

    // "<from> to <to> time"
    if (fromTz && toTz) {
      const resolvedFrom = resolveTimezone(fromTz) ?? fromTz;
      const resolvedTo = resolveTimezone(toTz) ?? toTz;

      try {
        const sourceDate = explicitTime
          ? buildDateInZone(explicitTime, resolvedFrom, now)
          : now;
        const fromTime = explicitTime
          ? `${explicitTime} (${getShortTzName(resolvedFrom)})`
          : formatTimeInZone(sourceDate, resolvedFrom);
        const toTime = formatTimeInZone(sourceDate, resolvedTo);
        const formatted = toTime;
        return {
          type: 'time',
          input: query,
          result: formatted,
          formatted,
          metadata: {
            explicitTime,
            from: { timezone: resolvedFrom, time: fromTime },
            to: { timezone: resolvedTo, time: toTime },
            iso: sourceDate.toISOString(),
          },
        };
      } catch {
        return {
          type: 'error',
          input: query,
          error: `Cannot resolve timezone conversion: '${fromTz}' → '${toTz}'`,
        };
      }
    }

    return { type: 'error', input: query, error: 'Could not parse time query' };
  } catch (err) {
    return {
      type: 'error',
      input: query,
      error: err instanceof Error ? err.message : 'Time evaluation failed',
    };
  }
}

function buildDateInZone(timeExpression: string, timezone: string, anchor: Date): Date {
  const { hour, minute } = parseTimeExpression(timeExpression);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(anchor);

  const year = Number(parts.find(p => p.type === 'year')?.value);
  const month = Number(parts.find(p => p.type === 'month')?.value);
  const day = Number(parts.find(p => p.type === 'day')?.value);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = getTimeZoneOffsetMs(utcGuess, timezone);
  return new Date(utcGuess.getTime() - offset);
}

function parseTimeExpression(value: string): { hour: number; minute: number } {
  const trimmed = value.trim().toLowerCase();
  if (trimmed === 'midnight') return { hour: 0, minute: 0 };
  if (trimmed === 'noon') return { hour: 12, minute: 0 };

  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) throw new Error(`Invalid time: '${value}'`);

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2] ?? '0', 10);
  const meridiem = match[3];

  if (meridiem === 'am' && hour === 12) hour = 0;
  if (meridiem === 'pm' && hour < 12) hour += 12;

  if (hour > 23 || minute > 59) throw new Error(`Invalid time: '${value}'`);
  return { hour, minute };
}

function getTimeZoneOffsetMs(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const year = Number(parts.find(p => p.type === 'year')?.value);
  const month = Number(parts.find(p => p.type === 'month')?.value);
  const day = Number(parts.find(p => p.type === 'day')?.value);
  const rawHour = Number(parts.find(p => p.type === 'hour')?.value);
  const hour = rawHour % 24;
  const minute = Number(parts.find(p => p.type === 'minute')?.value);
  const second = Number(parts.find(p => p.type === 'second')?.value);

  return Date.UTC(year, month - 1, day, hour, minute, second) - date.getTime();
}

function formatTimeInZone(date: Date, timezone: string): string {
  // Format the time without timezone name first — gives clean local time
  const timePart = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);

  const datePart = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  const tzAbbrev = getShortTzName(timezone);

  return `${timePart}, ${datePart} (${tzAbbrev})`;
}

function getShortTzName(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date());
    const name = parts.find(p => p.type === 'timeZoneName')?.value ?? timezone;
    // If Intl returned a raw offset like "GMT+5:30", try to keep it but prefer named abbreviations
    return name;
  } catch {
    return timezone;
  }
}
