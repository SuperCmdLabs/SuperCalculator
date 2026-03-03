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
        const fromTime = formatTimeInZone(now, resolvedFrom);
        const toTime = formatTimeInZone(now, resolvedTo);
        const formatted = `${fromTime} → ${toTime}`;
        return {
          type: 'time',
          input: query,
          result: formatted,
          formatted,
          metadata: {
            from: { timezone: resolvedFrom, time: fromTime },
            to: { timezone: resolvedTo, time: toTime },
            iso: now.toISOString(),
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
