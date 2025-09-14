// Workout Tracker TypeScript Interfaces

export type WorkoutType = 'upper-body' | 'lower-body' | 'full-body';
export type WorkoutState = 'available' | 'ongoing';
export type ExerciseType = 'weighted' | 'bodyweight';
export type SectionType = 'warmup' | 'cooldown' | 'main';
export type MoodType = 'amazing' | 'good' | 'okay' | 'tough' | 'terrible';
export type SorenessType = 'none' | 'mild' | 'sore' | 'very-sore';

// Exercise Set Interface
export interface ExerciseSet {
  weight?: number;
  reps: number;
  completed?: boolean;
}

// Exercise Information Interface
export interface ExerciseInfo {
  icon: string;
  description: string;
  video?: string | null;
  exerciseType: ExerciseType;
}

// Exercise Configuration Interface
export interface ExerciseConfig {
  name: string;
  sets: number;
  type?: SectionType;
}

// Workout Exercise Data (during workout session)
export interface WorkoutExerciseData {
  sets: ExerciseSet[];
  completed: boolean;
  lastWeight?: number;
  lastReps?: number;
  lastSets?: number;
}

// Workout Template Interface
export interface WorkoutTemplate {
  title: string;
  description: string;
  exercises: ExerciseConfig[];
}

// Completed Workout Exercise (in history)
export interface CompletedWorkoutExercise {
  [exerciseName: string]: ExerciseSet[];
}

// Workout History Entry
export interface WorkoutHistoryEntry {
  date: string; // ISO string
  type: WorkoutType;
  duration: number; // milliseconds
  exercises: CompletedWorkoutExercise;
  feedback?: MoodType | null;
  isTestData?: boolean;
}

// Pending Workout Data
export interface PendingWorkout {
  exerciseData: { [exerciseName: string]: WorkoutExerciseData };
  startTime: string; // ISO string
}

// Daily Entry Interface
export interface DailyEntry {
  mood: MoodType;
  soreness?: SorenessType;
  note: string;
  date: string; // ISO string
  isTestData?: boolean;
}

// Main Workout Data Structure
export interface WorkoutData {
  totalWorkouts: number;
  lastWeights: { [exerciseName: string]: number };
  lastReps: { [exerciseName: string]: number };
  lastSets: { [exerciseName: string]: number };
  lastExerciseData: { [exerciseName: string]: WorkoutExerciseData };
  history: WorkoutHistoryEntry[];
  pendingWorkouts: { [workoutType: string]: PendingWorkout };
  ongoingWorkout: WorkoutType | null; // Single ongoing workout instead of states per workout
  dailyEntries: { [dateKey: string]: DailyEntry };
}

// Feedback Emoji Mapping
export interface FeedbackEmoji {
  emoji: string;
  label: string;
}

// Workout Colors Configuration
export interface WorkoutColors {
  [workoutType: string]: string;
}

// App State Interface
export interface AppState {
  workoutData: WorkoutData;
  currentWorkout: WorkoutType | null;
  workoutStartTime: Date | null;
  exerciseData: { [exerciseName: string]: WorkoutExerciseData };
  currentCalendarDate: Date;
  selectedCalendarDate: Date;
  isLoading: boolean;
  error: string | null;
}

// Action Types for State Management
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WORKOUT_DATA'; payload: WorkoutData }
  | { type: 'SET_CURRENT_WORKOUT'; payload: WorkoutType | null }
  | { type: 'SET_WORKOUT_START_TIME'; payload: Date | null }
  | { type: 'SET_EXERCISE_DATA'; payload: { [exerciseName: string]: WorkoutExerciseData } }
  | { type: 'UPDATE_EXERCISE_DATA'; payload: { exerciseName: string; data: WorkoutExerciseData } }
  | { type: 'SET_CALENDAR_DATE'; payload: Date }
  | { type: 'SET_SELECTED_CALENDAR_DATE'; payload: Date }
  | { type: 'ADD_WORKOUT_HISTORY'; payload: WorkoutHistoryEntry }
  | { type: 'UPDATE_DAILY_ENTRY'; payload: { dateKey: string; entry: DailyEntry } }
  | { type: 'DELETE_DAILY_ENTRY'; payload: string }
  | { type: 'SET_ONGOING_WORKOUT'; payload: WorkoutType | null };

// Utility Types
export type DateKey = string; // Format: YYYY-MM-DD
export type TimerFormat = string; // Format: MM:SS:T

// Chart Data Interface for Stats
export interface ChartDataPoint {
  date: string;
  weight: number;
  reps: number;
}

export interface ExerciseStats {
  exerciseName: string;
  totalSets: number;
  averageWeight: number;
  maxWeight: number;
  totalReps: number;
  progression: ChartDataPoint[];
}