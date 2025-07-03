import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjsCalendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(dayjsCalendar);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(duration);

dayjs().calendar(null, {
  sameElse: 'MMM DD, YYYY, h:mm A',
});

/**
 * Loads the dayjs library with the necessary plugins for date manipulation.
 *
 * Included plugins:
 *
 * - `advancedFormat`: Adds advanced formatting options.
 * - `calendar`: Provides calendar formatting.
 * - `customParseFormat`: Allows custom date parsing.
 * - `duration`: Adds duration support.
 * - `localizedFormat`: Adds localized formatting options.
 * - `relativeTime`: Adds relative time formatting.
 * - `timezone`: Adds timezone support.
 * - `utc`: Adds UTC support.
 *
 * When additional plugins are needed, they can be imported and extended similarly.
 * @example
 * ```
 * import dayjs from '@markterence/utils/date-time-dayjs';
 * dayjs.extend(pluginName);
 *
 * dayjs().calendar(null, {
 *   sameElse: 'MMM DD, YYYY',
 * });
 * ```
 */
export default dayjs;

export function dateIsValid(date: null | Date): boolean {
  return dayjs(date).isValid();
}

/**
 * Will try to format a date string. If it fails, it will return an empty string.
 */
export function maybeFormatDate(date: string | Date | null | undefined, format = 'MMM DD, YYYY'): string {
  if (date === null) {
    return '';
  }

  if (dayjs(date).isValid()) {
    return dayjs(date).format(format);
  }
  return '';
}

/**
 * Formats a date, default format is `MMM DD, YYYY, h:mm A`.
 * If the date is invalid, it will return an empty string or whatever is specified in `invalidDateResult`.
 * If the date is `null`, it will return an empty string or whatever is specified in `nilDateResult`.
 *
 * Useful for displaying dates and returning messages when the date is invalid or null.
 */
export function formatDateTime(date: string | Date | null | undefined, options: {
  format?: string;
  invalidDateResult?: string;
  nilDateResult?: string;
}): string | undefined {
  if (date === null) {
    return options.nilDateResult || '';
  }

  if (dayjs(date).isValid()) {
    return dayjs(date).format(options.format || 'MMM DD, YYYY, h:mm A');
  }

  return options.invalidDateResult || '';
}

/**
 * Combines a date and time string into a single date-time string.
 * @param {any} date - Date string
 * @param {any} time - Datetime string.
 *
 * @returns {string|undefined} - Returns `undefined`, when one of the parameter is invalid or can't be parsed.
 * Otherwise, returns a string in `YYYY-MM-DDTHH:mm:ss` format.
 */
export function combineDateAndTime(date: dayjs.ConfigType, time: dayjs.ConfigType): string | undefined {
  if (!dayjs(date).isValid() || !dayjs(time).isValid()) {
    return undefined;
  }

  const _date = dayjs(date).format('YYYY-MM-DD');
  const _time = dayjs(time).format('HH:mm:ss');

  // Combine date and time into a single string.
  // Example: '2023-01-01T12:00:00'
  const dateTime = dayjs(`${_date}T${_time}`);

  return dateTime.isValid() ? dateTime.format('YYYY-MM-DDTHH:mm:ss') : undefined;
}
