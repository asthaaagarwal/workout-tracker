import { useCallback } from 'react';
import { useWorkout } from '../store/WorkoutContext';
import { DailyEntry, MoodType, SorenessType } from '../types/workout.types';
import { getLocalDateKey } from '../utils/dateUtils';

export const useDailyCheckin = () => {
  const { state, dispatch } = useWorkout();

  // Get daily entry for a specific date
  const getDailyEntry = useCallback((date: Date): DailyEntry | null => {
    const dateKey = getLocalDateKey(date);
    return state.workoutData.dailyEntries[dateKey] || null;
  }, [state.workoutData.dailyEntries]);

  // Get today's daily entry
  const getTodaysEntry = useCallback((): DailyEntry | null => {
    return getDailyEntry(new Date());
  }, [getDailyEntry]);

  // Save daily entry
  const saveDailyEntry = useCallback((date: Date, mood: MoodType, note: string = '', soreness?: SorenessType) => {
    const dateKey = getLocalDateKey(date);
    const entry: DailyEntry = {
      mood,
      note: note.trim(),
      date: date.toISOString(),
      ...(soreness && { soreness })
    };

    dispatch({ type: 'UPDATE_DAILY_ENTRY', payload: { dateKey, entry } });
  }, [dispatch]);

  // Save today's daily entry
  const saveTodaysEntry = useCallback((mood: MoodType, note: string = '', soreness?: SorenessType) => {
    saveDailyEntry(new Date(), mood, note, soreness);
  }, [saveDailyEntry]);

  // Delete daily entry
  const deleteDailyEntry = useCallback((date: Date) => {
    const dateKey = getLocalDateKey(date);
    dispatch({ type: 'DELETE_DAILY_ENTRY', payload: dateKey });
  }, [dispatch]);

  // Delete today's entry
  const deleteTodaysEntry = useCallback(() => {
    deleteDailyEntry(new Date());
  }, [deleteDailyEntry]);

  // Check if entry exists for date
  const hasEntryForDate = useCallback((date: Date): boolean => {
    return getDailyEntry(date) !== null;
  }, [getDailyEntry]);

  // Check if today has an entry
  const hasTodaysEntry = useCallback((): boolean => {
    return hasEntryForDate(new Date());
  }, [hasEntryForDate]);

  // Get all entries within a date range
  const getEntriesInRange = useCallback((startDate: Date, endDate: Date): { [dateKey: string]: DailyEntry } => {
    const entries: { [dateKey: string]: DailyEntry } = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const entry = getDailyEntry(currentDate);
      if (entry) {
        const dateKey = getLocalDateKey(currentDate);
        entries[dateKey] = entry;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return entries;
  }, [getDailyEntry]);

  // Get entries for current month
  const getCurrentMonthEntries = useCallback((): { [dateKey: string]: DailyEntry } => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return getEntriesInRange(startOfMonth, endOfMonth);
  }, [getEntriesInRange]);

  return {
    getDailyEntry,
    getTodaysEntry,
    saveDailyEntry,
    saveTodaysEntry,
    deleteDailyEntry,
    deleteTodaysEntry,
    hasEntryForDate,
    hasTodaysEntry,
    getEntriesInRange,
    getCurrentMonthEntries
  };
};