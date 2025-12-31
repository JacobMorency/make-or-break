import { getWeekStartISO, formatDateISO } from '../date';

describe('date utilities', () => {
  it('getWeekStartISO returns Monday for Monday input', () => {
    // Create a Monday date (2024-01-01 is a Monday)
    const monday = new Date('2024-01-01T00:00:00');
    const result = getWeekStartISO(monday);
    
    expect(result).toBe('2024-01-01');
  });

  it('getWeekStartISO returns Monday for Wednesday input', () => {
    // Create a Wednesday date (2024-01-03 is a Wednesday)
    const wednesday = new Date('2024-01-03T00:00:00');
    const result = getWeekStartISO(wednesday);
    
    // Should return Monday of that week (2024-01-01)
    expect(result).toBe('2024-01-01');
  });

  it('getWeekStartISO returns Monday for Sunday input', () => {
    // Create a Sunday date (2024-01-07 is a Sunday)
    const sunday = new Date('2024-01-07T00:00:00');
    const result = getWeekStartISO(sunday);
    
    // Should return Monday of that week (2024-01-01, not previous week)
    expect(result).toBe('2024-01-01');
  });

  it('getWeekStartISO returns previous Monday for Sunday at week boundary', () => {
    // Create a Sunday that starts a new week (2024-01-14 is a Sunday)
    const sunday = new Date('2024-01-14T00:00:00');
    const result = getWeekStartISO(sunday);
    
    // Should return Monday of that week (2024-01-08)
    expect(result).toBe('2024-01-08');
  });
});

