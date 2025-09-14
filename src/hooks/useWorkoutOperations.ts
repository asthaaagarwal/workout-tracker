import { useCallback } from 'react';
import { useWorkout } from '../store/WorkoutContext';
import { WorkoutType, WorkoutHistoryEntry, DailyEntry, MoodType, WorkoutExerciseData } from '../types/workout.types';
import { WorkoutDataService } from '../services/WorkoutDataService';
import { getLocalDateKey } from '../utils/dateUtils';
import { WORKOUT_EXERCISES } from '../types/constants';

export const useWorkoutOperations = () => {
  const { state, dispatch } = useWorkout();
  const workoutService = WorkoutDataService.getInstance();

  // Start a workout
  const startWorkout = useCallback((workoutType: WorkoutType) => {
    const now = new Date();
    dispatch({ type: 'SET_CURRENT_WORKOUT', payload: workoutType });
    dispatch({ type: 'SET_WORKOUT_START_TIME', payload: now });
    dispatch({ type: 'SET_ONGOING_WORKOUT', payload: workoutType });

    // Initialize exercise data if not already present
    if (!state.workoutData.pendingWorkouts[workoutType]) {
      const template = WORKOUT_EXERCISES[workoutType];
      const initialExerciseData: { [exerciseName: string]: WorkoutExerciseData } = {};

      template.exercises.forEach((exercise) => {
        initialExerciseData[exercise.name] = {
          sets: Array(exercise.sets).fill(null).map(() => ({
            weight: state.workoutData.lastWeights[exercise.name] || undefined,
            reps: state.workoutData.lastReps[exercise.name] || 12
          })),
          completed: false
        };
      });

      dispatch({ type: 'SET_EXERCISE_DATA', payload: initialExerciseData });

      // Save as pending workout
      const updatedData = workoutService.updatePendingWorkout(state.workoutData, workoutType, {
        exerciseData: initialExerciseData,
        startTime: now.toISOString()
      });
      dispatch({ type: 'SET_WORKOUT_DATA', payload: updatedData });
    } else {
      // Load existing pending workout data
      const pendingWorkout = state.workoutData.pendingWorkouts[workoutType];
      dispatch({ type: 'SET_EXERCISE_DATA', payload: pendingWorkout.exerciseData });
      dispatch({ type: 'SET_WORKOUT_START_TIME', payload: new Date(pendingWorkout.startTime) });
    }
  }, [state.workoutData, dispatch, workoutService]);

  // Complete a workout
  const completeWorkout = useCallback((feedback?: MoodType) => {
    if (!state.currentWorkout || !state.workoutStartTime) return;

    const endTime = new Date();
    const duration = endTime.getTime() - state.workoutStartTime.getTime();

    // Process completed exercises
    const completedExercises = Object.fromEntries(
      Object.entries(state.exerciseData)
        .filter(([_, data]) => data.completed && data.sets.some(set => set.weight && parseFloat(String(set.weight)) > 0))
        .map(([name, data]) => [name, data.sets.filter(set => set.weight && parseFloat(String(set.weight)) > 0)])
    );

    // Create workout history entry
    const workoutEntry: WorkoutHistoryEntry = {
      date: endTime.toISOString(),
      type: state.currentWorkout,
      duration,
      exercises: completedExercises,
      feedback: feedback || null
    };

    // Add to history
    dispatch({ type: 'ADD_WORKOUT_HISTORY', payload: workoutEntry });

    // Clear ongoing workout
    dispatch({ type: 'SET_ONGOING_WORKOUT', payload: null });

    // Remove pending workout
    const updatedData = workoutService.removePendingWorkout(state.workoutData, state.currentWorkout);
    dispatch({ type: 'SET_WORKOUT_DATA', payload: updatedData });

    // Reset current workout state
    dispatch({ type: 'SET_CURRENT_WORKOUT', payload: null });
    dispatch({ type: 'SET_WORKOUT_START_TIME', payload: null });
    dispatch({ type: 'SET_EXERCISE_DATA', payload: {} });
  }, [state.currentWorkout, state.workoutStartTime, state.exerciseData, dispatch, workoutService]);

  // Cancel a workout
  const cancelWorkout = useCallback(() => {
    if (!state.currentWorkout) return;

    // Check if there's any progress (completed exercises or entered weights)
    const hasProgress = Object.values(state.exerciseData).some(exercise =>
      exercise.completed || exercise.sets.some(set => set.weight && parseFloat(String(set.weight)) > 0)
    );

    if (hasProgress) {
      // Save as pending workout
      const updatedData = workoutService.updatePendingWorkout(state.workoutData, state.currentWorkout, {
        exerciseData: state.exerciseData,
        startTime: state.workoutStartTime?.toISOString() || new Date().toISOString()
      });
      dispatch({ type: 'SET_WORKOUT_DATA', payload: updatedData });
    } else {
      // Remove pending workout if no progress
      const updatedData = workoutService.removePendingWorkout(state.workoutData, state.currentWorkout);
      dispatch({ type: 'SET_WORKOUT_DATA', payload: updatedData });
    }

    // Clear ongoing workout
    dispatch({ type: 'SET_ONGOING_WORKOUT', payload: null });

    // Reset current workout state
    dispatch({ type: 'SET_CURRENT_WORKOUT', payload: null });
    dispatch({ type: 'SET_WORKOUT_START_TIME', payload: null });
    dispatch({ type: 'SET_EXERCISE_DATA', payload: {} });
  }, [state.currentWorkout, state.workoutStartTime, state.exerciseData, state.workoutData, dispatch, workoutService]);

  // Update exercise data
  const updateExerciseData = useCallback((exerciseName: string, data: WorkoutExerciseData) => {
    dispatch({ type: 'UPDATE_EXERCISE_DATA', payload: { exerciseName, data } });

    // Save to pending workout if there's a current workout
    if (state.currentWorkout) {
      const updatedExerciseData = {
        ...state.exerciseData,
        [exerciseName]: data
      };

      const updatedData = workoutService.updatePendingWorkout(state.workoutData, state.currentWorkout, {
        exerciseData: updatedExerciseData,
        startTime: state.workoutStartTime?.toISOString() || new Date().toISOString()
      });
      dispatch({ type: 'SET_WORKOUT_DATA', payload: updatedData });
    }
  }, [state.currentWorkout, state.workoutStartTime, state.exerciseData, state.workoutData, dispatch, workoutService]);

  // Check if workout is ongoing
  const isWorkoutOngoing = useCallback((workoutType: WorkoutType): boolean => {
    return workoutService.isWorkoutOngoing(state.workoutData, workoutType);
  }, [state.workoutData, workoutService]);

  // Check if any workout is ongoing
  const hasOngoingWorkout = useCallback((): boolean => {
    return state.workoutData.ongoingWorkout !== null;
  }, [state.workoutData.ongoingWorkout]);

  // Get ongoing workout type
  const getOngoingWorkoutType = useCallback((): WorkoutType | null => {
    return workoutService.getOngoingWorkoutType(state.workoutData);
  }, [state.workoutData, workoutService]);

  // Get days since last workout
  const getDaysSinceLastWorkout = useCallback((): number => {
    return workoutService.getDaysSinceLastWorkout(state.workoutData);
  }, [state.workoutData, workoutService]);

  return {
    startWorkout,
    completeWorkout,
    cancelWorkout,
    updateExerciseData,
    isWorkoutOngoing,
    hasOngoingWorkout,
    getOngoingWorkoutType,
    getDaysSinceLastWorkout
  };
};