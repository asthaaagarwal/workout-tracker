import { WorkoutData, WorkoutHistoryEntry, DailyEntry, PendingWorkout, WorkoutType } from '../types/workout.types';
import { STORAGE_KEY } from '../types/constants';
import { getLocalDateKey } from '../utils/dateUtils';

/**
 * Service class for handling workout data persistence and management
 * Maintains compatibility with existing localStorage data structure
 */
export class WorkoutDataService {
  private static instance: WorkoutDataService;
  private readonly storageKey = STORAGE_KEY;

  private constructor() {}

  public static getInstance(): WorkoutDataService {
    if (!WorkoutDataService.instance) {
      WorkoutDataService.instance = new WorkoutDataService();
    }
    return WorkoutDataService.instance;
  }

  /**
   * Get the default workout data structure
   */
  private getDefaultWorkoutData(): WorkoutData {
    return {
      totalWorkouts: 0,
      lastWeights: {},
      lastReps: {},
      lastSets: {},
      lastExerciseData: {},
      history: [],
      pendingWorkouts: {},
      ongoingWorkout: null,
      dailyEntries: {}
    };
  }

  /**
   * Load workout data from localStorage with migration support
   */
  public loadWorkoutData(): WorkoutData {
    try {
      const saved = localStorage.getItem(this.storageKey);

      if (!saved) {
        return this.getDefaultWorkoutData();
      }

      const parsedData = JSON.parse(saved);
      let workoutData: WorkoutData = { ...this.getDefaultWorkoutData(), ...parsedData };

      // Migration: Remove cycle-related properties if they exist (from old version)
      let migrationNeeded = false;

      if ('currentCycle' in parsedData) {
        delete (workoutData as any).currentCycle;
        migrationNeeded = true;
      }

      if ('totalCycles' in parsedData) {
        delete (workoutData as any).totalCycles;
        migrationNeeded = true;
      }

      if ('weekStartDate' in parsedData) {
        delete (workoutData as any).weekStartDate;
        migrationNeeded = true;
      }

      // Initialize missing properties
      if (!workoutData.dailyEntries) {
        workoutData.dailyEntries = {};
        migrationNeeded = true;
      }

      // Migrate from old workoutStates to new ongoingWorkout
      if ('workoutStates' in parsedData) {
        const workoutStates = (parsedData as any).workoutStates;
        // Find any ongoing workout
        const ongoingWorkout = Object.keys(workoutStates).find(key => workoutStates[key] === 'ongoing');
        workoutData.ongoingWorkout = ongoingWorkout || null;
        delete (workoutData as any).workoutStates;
        migrationNeeded = true;
      }

      if (!('ongoingWorkout' in workoutData)) {
        workoutData.ongoingWorkout = null;
        migrationNeeded = true;
      }

      // Save migrated data if needed
      if (migrationNeeded) {
        this.saveWorkoutData(workoutData);
      }

      return workoutData;
    } catch (error) {
      console.error('Error loading workout data:', error);
      return this.getDefaultWorkoutData();
    }
  }

  /**
   * Save workout data to localStorage
   */
  public saveWorkoutData(data: WorkoutData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving workout data:', error);
    }
  }

  /**
   * Add a workout to history
   */
  public addWorkoutToHistory(data: WorkoutData, workout: WorkoutHistoryEntry): WorkoutData {
    const updatedData = {
      ...data,
      history: [...data.history, workout].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      totalWorkouts: data.totalWorkouts + 1
    };

    this.saveWorkoutData(updatedData);
    return updatedData;
  }

  /**
   * Update daily entry
   */
  public updateDailyEntry(data: WorkoutData, dateKey: string, entry: DailyEntry): WorkoutData {
    const updatedData = {
      ...data,
      dailyEntries: {
        ...data.dailyEntries,
        [dateKey]: entry
      }
    };

    this.saveWorkoutData(updatedData);
    return updatedData;
  }

  /**
   * Delete daily entry
   */
  public deleteDailyEntry(data: WorkoutData, dateKey: string): WorkoutData {
    const updatedEntries = { ...data.dailyEntries };
    delete updatedEntries[dateKey];

    const updatedData = {
      ...data,
      dailyEntries: updatedEntries
    };

    this.saveWorkoutData(updatedData);
    return updatedData;
  }

  /**
   * Update pending workout
   */
  public updatePendingWorkout(data: WorkoutData, workoutType: WorkoutType, pendingData: PendingWorkout): WorkoutData {
    const updatedData = {
      ...data,
      pendingWorkouts: {
        ...data.pendingWorkouts,
        [workoutType]: pendingData
      }
    };

    this.saveWorkoutData(updatedData);
    return updatedData;
  }

  /**
   * Remove pending workout
   */
  public removePendingWorkout(data: WorkoutData, workoutType: WorkoutType): WorkoutData {
    const updatedPendingWorkouts = { ...data.pendingWorkouts };
    delete updatedPendingWorkouts[workoutType];

    const updatedData = {
      ...data,
      pendingWorkouts: updatedPendingWorkouts
    };

    this.saveWorkoutData(updatedData);
    return updatedData;
  }

  /**
   * Set ongoing workout
   */
  public setOngoingWorkout(data: WorkoutData, workoutType: WorkoutType | null): WorkoutData {
    const updatedData = {
      ...data,
      ongoingWorkout: workoutType
    };

    this.saveWorkoutData(updatedData);
    return updatedData;
  }

  /**
   * Check if workout is ongoing
   */
  public isWorkoutOngoing(data: WorkoutData, workoutType: WorkoutType): boolean {
    return data.ongoingWorkout === workoutType;
  }

  /**
   * Get ongoing workout type
   */
  public getOngoingWorkoutType(data: WorkoutData): WorkoutType | null {
    return data.ongoingWorkout;
  }

  /**
   * Get days since last workout
   */
  public getDaysSinceLastWorkout(data: WorkoutData): number {
    if (data.history.length === 0) {
      return 0;
    }

    const lastWorkout = data.history[data.history.length - 1];
    const lastWorkoutDate = new Date(lastWorkout.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastWorkoutDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Get workouts for a specific date
   */
  public getWorkoutsForDate(data: WorkoutData, date: Date): WorkoutHistoryEntry[] {
    const dateKey = getLocalDateKey(date);
    return data.history.filter(workout => {
      const workoutDateKey = getLocalDateKey(new Date(workout.date));
      return workoutDateKey === dateKey;
    });
  }

  /**
   * Get daily entry for date
   */
  public getDailyEntryForDate(data: WorkoutData, date: Date): DailyEntry | null {
    const dateKey = getLocalDateKey(date);
    return data.dailyEntries[dateKey] || null;
  }


  /**
   * Update completed workout in history (for editing from calendar)
   */
  public updateCompletedWorkoutInHistory(data: WorkoutData, workoutType: WorkoutType, exerciseData: any): WorkoutData {
    // Find the most recent workout of this type
    const workoutIndex = [...data.history].reverse().findIndex(h => h.type === workoutType);

    if (workoutIndex === -1) {
      return data;
    }

    // Calculate actual index (since we reversed the array)
    const actualIndex = data.history.length - 1 - workoutIndex;

    // Update the exercises data with current exercise data
    const updatedExercises = Object.fromEntries(
      Object.entries(exerciseData)
        .filter(([_, exerciseInfo]: [string, any]) => {
          return exerciseInfo.sets.some((set: any) => set.weight && parseFloat(set.weight) > 0);
        })
        .map(([name, exerciseInfo]: [string, any]) => [
          name,
          exerciseInfo.sets.filter((set: any) => set.weight && parseFloat(set.weight) > 0)
        ])
    );

    const updatedHistory = [...data.history];
    updatedHistory[actualIndex] = {
      ...updatedHistory[actualIndex],
      exercises: updatedExercises
    };

    const updatedData = {
      ...data,
      history: updatedHistory
    };

    this.saveWorkoutData(updatedData);
    return updatedData;
  }

  /**
   * Clear all data (for testing/development)
   */
  public clearAllData(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Export data for backup
   */
  public exportData(): string {
    const data = this.loadWorkoutData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from backup
   */
  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveWorkoutData(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}