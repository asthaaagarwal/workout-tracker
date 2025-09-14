import { format, parseISO, isToday, differenceInDays } from 'date-fns';
import { DateKey, TimerFormat } from '../types/workout.types';

/**
 * Get local date key (timezone-neutral) in YYYY-MM-DD format
 */
export const getLocalDateKey = (date: Date): DateKey => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Parse date key back to Date object
 */
export const parseDateKey = (dateKey: DateKey): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Format workout completion date/time to "11:30, Thu, 20 Sep" format
 */
export const formatWorkoutDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  // Round to nearest 15 minutes
  const minutes = dateObj.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  const roundedDate = new Date(dateObj);
  roundedDate.setMinutes(roundedMinutes);
  roundedDate.setSeconds(0);
  roundedDate.setMilliseconds(0);

  return format(roundedDate, 'HH:mm, EEE, d MMM');
};

/**
 * Format date for home display (e.g., "Monday, 20 Sep")
 */
export const formatDateForHomeDisplay = (date: Date): string => {
  return format(date, 'EEEE, dd MMM');
};

/**
 * Format timer display in MM:SS.T format
 */
export const formatTimerDisplay = (milliseconds: number): TimerFormat => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((milliseconds % 1000) / 100);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
};

/**
 * Calculate days since last workout
 */
export const calculateDaysSinceLastWorkout = (lastWorkoutDate: string | Date | null): number => {
  if (!lastWorkoutDate) return 0;

  const lastDate = typeof lastWorkoutDate === 'string' ? parseISO(lastWorkoutDate) : lastWorkoutDate;
  const today = new Date();

  return Math.max(0, differenceInDays(today, lastDate));
};

/**
 * Check if date is today
 */
export const isDateToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

/**
 * Check if date is in the future
 */
export const isDateInFuture = (date: Date): boolean => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
};

/**
 * Get start and end of current month for calendar display
 */
export const getMonthBounds = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

/**
 * Generate calendar grid dates (including previous/next month padding)
 */
export const getCalendarDates = (date: Date): Date[] => {
  const { start, end } = getMonthBounds(date);
  const dates: Date[] = [];

  // Add dates from previous month to fill the first week
  const startDay = start.getDay(); // 0 = Sunday
  for (let i = startDay - 1; i >= 0; i--) {
    const prevDate = new Date(start);
    prevDate.setDate(start.getDate() - i - 1);
    dates.push(prevDate);
  }

  // Add all dates in current month
  for (let day = 1; day <= end.getDate(); day++) {
    dates.push(new Date(date.getFullYear(), date.getMonth(), day));
  }

  // Add dates from next month to fill the last week
  const remainingCells = 42 - dates.length; // 6 weeks × 7 days
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(end);
    nextDate.setDate(end.getDate() + i);
    dates.push(nextDate);
  }

  return dates;
};

/**
 * Get month name and year for calendar header
 */
export const getMonthYearDisplay = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};