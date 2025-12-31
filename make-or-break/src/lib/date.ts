/**
 * Date utilities for habit tracking
 * Week starts Monday (ISO week)
 */

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as ISO string
 */
export function todayISO(): string {
  return formatDateISO(new Date());
}

/**
 * Get the start of the week (Monday) for a given date
 * Returns ISO date string for Monday of that week
 */
export function getWeekStartISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDay();
  // Convert Sunday (0) to 7, then subtract 1 to get days from Monday
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(d);
  monday.setDate(d.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);
  return formatDateISO(monday);
}

/**
 * Get weekday index (0 = Monday, 6 = Sunday)
 */
export function getWeekdayIndex(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDay();
  // Convert to Monday = 0, Sunday = 6
  return day === 0 ? 6 : day - 1;
}

/**
 * Get date from ISO string
 */
export function dateFromISO(iso: string): Date {
  return new Date(iso + 'T00:00:00');
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): string {
  const d = typeof date === 'string' ? dateFromISO(date) : date;
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return formatDateISO(result);
}

