import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, WorkoutData, WorkoutType, WorkoutExerciseData, DailyEntry } from '../types/workout.types';
import { WorkoutDataService } from '../services/WorkoutDataService';

// Initial state
const initialState: AppState = {
  workoutData: {
    totalWorkouts: 0,
    lastWeights: {},
    lastReps: {},
    lastSets: {},
    lastExerciseData: {},
    history: [],
    pendingWorkouts: {},
    ongoingWorkout: null,
    dailyEntries: {}
  },
  currentWorkout: null,
  workoutStartTime: null,
  exerciseData: {},
  currentCalendarDate: new Date(),
  selectedCalendarDate: new Date(),
  isLoading: false,
  error: null
};

// App reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_WORKOUT_DATA':
      return { ...state, workoutData: action.payload };

    case 'SET_CURRENT_WORKOUT':
      return { ...state, currentWorkout: action.payload };

    case 'SET_WORKOUT_START_TIME':
      return { ...state, workoutStartTime: action.payload };

    case 'SET_EXERCISE_DATA':
      return { ...state, exerciseData: action.payload };

    case 'UPDATE_EXERCISE_DATA':
      return {
        ...state,
        exerciseData: {
          ...state.exerciseData,
          [action.payload.exerciseName]: action.payload.data
        }
      };

    case 'SET_CALENDAR_DATE':
      return { ...state, currentCalendarDate: action.payload };

    case 'SET_SELECTED_CALENDAR_DATE':
      return { ...state, selectedCalendarDate: action.payload };

    case 'ADD_WORKOUT_HISTORY':
      const updatedData = WorkoutDataService.getInstance().addWorkoutToHistory(
        state.workoutData,
        action.payload
      );
      return { ...state, workoutData: updatedData };

    case 'UPDATE_DAILY_ENTRY':
      const updatedDataWithEntry = WorkoutDataService.getInstance().updateDailyEntry(
        state.workoutData,
        action.payload.dateKey,
        action.payload.entry
      );
      return { ...state, workoutData: updatedDataWithEntry };

    case 'DELETE_DAILY_ENTRY':
      const updatedDataWithoutEntry = WorkoutDataService.getInstance().deleteDailyEntry(
        state.workoutData,
        action.payload
      );
      return { ...state, workoutData: updatedDataWithoutEntry };

    case 'SET_ONGOING_WORKOUT':
      const updatedDataWithOngoing = WorkoutDataService.getInstance().setOngoingWorkout(
        state.workoutData,
        action.payload
      );
      return { ...state, workoutData: updatedDataWithOngoing };

    default:
      return state;
  }
};

// Context
const WorkoutContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const workoutService = WorkoutDataService.getInstance();

  // Load data on initialization
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const workoutData = workoutService.loadWorkoutData();
      dispatch({ type: 'SET_WORKOUT_DATA', payload: workoutData });

      // Check if any workout is ongoing and restore state
      const ongoingWorkoutType = workoutService.getOngoingWorkoutType(workoutData);
      if (ongoingWorkoutType && workoutData.pendingWorkouts[ongoingWorkoutType]) {
        dispatch({ type: 'SET_CURRENT_WORKOUT', payload: ongoingWorkoutType as WorkoutType });
        dispatch({
          type: 'SET_WORKOUT_START_TIME',
          payload: new Date(workoutData.pendingWorkouts[ongoingWorkoutType].startTime)
        });
        dispatch({
          type: 'SET_EXERCISE_DATA',
          payload: workoutData.pendingWorkouts[ongoingWorkoutType].exerciseData
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load workout data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Hook to use the workout context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};