import { WorkoutTemplate, ExerciseInfo, FeedbackEmoji, WorkoutColors } from './workout.types';

// App names to cycle through
export const APP_NAMES: string[] = [
  "Exercise? I thought you said Extra Fries",
  "Abs are great, but have you tried donuts?",
  "I have a love–hate relationship with burpees. Mostly hate.",
  "Burpees? No thanks, I'll do burfis.",
  "HIIT = High Intensity Imbiss Training.",
];

// Workout colors
export const WORKOUT_COLORS: WorkoutColors = {
  'upper-body': '#fcd5c1',
  'lower-body': '#fcd5c1',
  'full-body': '#fcd5c1'
};

// Feedback emoji mapping
export const FEEDBACK_MAP: { [key: string]: FeedbackEmoji } = {
  'amazing': { emoji: '🔥', label: 'Amazing' },
  'good': { emoji: '😊', label: 'Good' },
  'okay': { emoji: '😐', label: 'Okay' },
  'tough': { emoji: '😮‍💨', label: 'Tough' },
  'terrible': { emoji: '😞', label: 'Terrible' }
};

// Mood emoji mappings
export const MOOD_EMOJIS: { [key: string]: string } = {
  'amazing': '🔥',
  'good': '😊',
  'okay': '😐',
  'tough': '😮‍💨',
  'terrible': '😞'
};

// Soreness level mappings
export const SORENESS_LEVELS: { [key: string]: { emoji: string; label: string } } = {
  'none': { emoji: '😌', label: 'None' },
  'mild': { emoji: '😊', label: 'Mild' },
  'sore': { emoji: '😬', label: 'Sore' },
  'very-sore': { emoji: '😵', label: 'Very Sore' }
};

// Workout exercises data
export const WORKOUT_EXERCISES: { [key: string]: WorkoutTemplate } = {
  'upper-body': {
    title: 'Upper Body',
    description: 'Chest, back, shoulders, and arms',
    exercises: [
      { name: 'Dead bug', sets: 1, type: 'warmup' },
      { name: 'Shoulder tap', sets: 1, type: 'warmup' },
      { name: 'Push ups', sets: 2, type: 'warmup' },
      { name: 'Chest press', sets: 3 },
      { name: 'Lat pull downs', sets: 3 },
      { name: 'Bent over rows', sets: 3 },
      { name: 'Shoulder press', sets: 3 },
      { name: 'Bicep curls', sets: 3 },
      { name: 'Tricep curls', sets: 3 },
      { name: 'Plank', sets: 2, type: 'cooldown' },
      { name: 'Russian twists', sets: 2, type: 'cooldown' },
      { name: 'Stretch', sets: 1, type: 'cooldown' }
    ]
  },
  'lower-body': {
    title: 'Lower Body',
    description: 'Legs, glutes, and lower body strength',
    exercises: [
      { name: 'Dead bug', sets: 1, type: 'warmup' },
      { name: 'Shoulder tap', sets: 1, type: 'warmup' },
      { name: 'Bodyweight squats', sets: 1, type: 'warmup' },
      { name: 'Back squats', sets: 3 },
      { name: 'Deadlift', sets: 3 },
      { name: 'Step ups', sets: 3 },
      { name: 'Hip thrust', sets: 3 },
      { name: 'Single leg extension', sets: 3 },
      { name: 'Side lunge', sets: 3 },
      { name: 'Mountain climbers', sets: 2, type: 'cooldown' },
      { name: 'Bicycle crunches', sets: 2, type: 'cooldown' },
      { name: 'Stretch', sets: 1, type: 'cooldown' }
    ]
  },
  'full-body': {
    title: 'Full Body',
    description: 'Complete body workout with core focus',
    exercises: [
      { name: 'Dead bug', sets: 1, type: 'warmup' },
      { name: 'Shoulder tap', sets: 1, type: 'warmup' },
      { name: 'Hand walks', sets: 1, type: 'warmup' },
      { name: 'Chest press', sets: 3 },
      { name: 'Back squats', sets: 3 },
      { name: 'Bent over rows', sets: 3 },
      { name: 'Single leg deadlift', sets: 3 },
      { name: 'Push ups', sets: 3 },
      { name: 'Side lunge', sets: 3 },
      { name: 'Dead bug', sets: 2, type: 'cooldown' },
      { name: 'Leg raises', sets: 2, type: 'cooldown' },
      { name: 'Stretch', sets: 1, type: 'cooldown' }
    ]
  }
};

// Exercise information with descriptions and emojis
export const EXERCISE_INFO: { [key: string]: ExerciseInfo } = {
  'Dead bug': {
    icon: '🐛',
    description: 'Lie on your back, arms up, knees bent at 90°. Lower opposite arm and leg slowly, return to start.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Shoulder tap': {
    icon: '👋',
    description: 'Start in plank position. Tap opposite shoulder with hand while maintaining stable core.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Push ups': {
    icon: '💪',
    description: 'Start in plank, lower chest to ground, push back up. Keep body straight throughout.',
    video: 'https://www.youtube.com/watch?v=KEFQyLkDYtI',
    exerciseType: 'bodyweight'
  },
  'Bodyweight squats': {
    icon: '🤸',
    description: 'Stand with feet shoulder-width apart. Lower hips down and back, then return to standing.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Hand walks': {
    icon: '🙏',
    description: 'From standing, walk hands forward to plank, then walk back to standing position.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Chest press': {
    icon: '🏋️',
    description: 'Lie on bench, press weights from chest level up and slightly forward, then lower slowly.',
    video: 'https://www.youtube.com/watch?v=tuwHzzPdaGc',
    exerciseType: 'weighted'
  },
  'Lat pull downs': {
    icon: '⬇️',
    description: 'Sit at machine, pull bar down to chest level, squeeze shoulder blades together.',
    video: 'https://www.youtube.com/watch?v=Mdp7kuhZD_M',
    exerciseType: 'weighted'
  },
  'Bent over rows': {
    icon: '🦵',
    description: 'Hinge at hips, pull weights to lower chest, squeeze shoulder blades at the top.',
    video: 'https://www.youtube.com/watch?v=3_RR7ELmcAk',
    exerciseType: 'weighted'
  },
  'Shoulder press': {
    icon: '⬆️',
    description: 'Press weights overhead from shoulder level, extend arms fully, lower with control.',
    video: 'https://www.youtube.com/watch?v=FRxZ6wr5bpA',
    exerciseType: 'weighted'
  },
  'Bicep curls': {
    icon: '💪',
    description: 'Curl weights from extended arms to shoulders, control the descent.',
    video: 'https://www.youtube.com/watch?v=tMEGqKOa-M',
    exerciseType: 'weighted'
  },
  'Tricep curls': {
    icon: '💪',
    description: 'Extend arms overhead, lower weight behind head, press back to start.',
    video: 'https://www.youtube.com/watch?v=VjmgzEmODnI',
    exerciseType: 'weighted'
  },
  'Back squats': {
    icon: '🏋️',
    description: 'Bar on upper back, squat down keeping chest up, drive through heels to stand.',
    video: 'https://www.youtube.com/watch?v=R2dMsNhN3DE',
    exerciseType: 'weighted'
  },
  'Deadlift': {
    icon: '🏋️',
    description: 'Lift bar from ground by extending hips and knees, keep bar close to body.',
    video: 'https://www.youtube.com/watch?v=wjsu6ceEkAQ',
    exerciseType: 'weighted'
  },
  'Step ups': {
    icon: '🚆',
    description: 'Step onto platform with full foot, drive through heel, step down with control.',
    video: 'https://www.youtube.com/watch?v=elhu-WC1qk4',
    exerciseType: 'weighted'
  },
  'Hip thrust': {
    icon: '🏋️',
    description: 'Shoulders on bench, drive hips up squeezing glutes, lower with control.',
    video: 'https://www.youtube.com/watch?v=aweBS7K71l8',
    exerciseType: 'weighted'
  },
  'Single leg extension': {
    icon: '🦵',
    description: 'Extend one leg at a time, control the movement, focus on quad engagement.',
    video: 'https://www.youtube.com/watch?v=82IuSLk5zNc',
    exerciseType: 'weighted'
  },
  'Side lunge': {
    icon: '🤸',
    description: 'Step wide to one side, lower into lunge, push back to center.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Single leg deadlift': {
    icon: '⚖️',
    description: 'Balance on one leg, hinge at hip lowering weight, return to standing.',
    video: null,
    exerciseType: 'weighted'
  },
  'Plank': {
    icon: '🤸',
    description: 'Hold straight body position on forearms and toes, engage core throughout.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Russian twists': {
    icon: '🌀',
    description: 'Sit with knees bent, lean back slightly, rotate torso side to side.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Mountain climbers': {
    icon: '⛰️',
    description: 'Start in plank, alternate bringing knees to chest in running motion.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Bicycle crunches': {
    icon: '🚲',
    description: 'Lie on back, alternate elbow to opposite knee in cycling motion.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Leg raises': {
    icon: '🦵',
    description: 'Lie on back, raise straight legs to 90°, lower slowly without touching ground.',
    video: null,
    exerciseType: 'bodyweight'
  },
  'Stretch': {
    icon: '🤸',
    description: 'Perform gentle stretches to relax muscles and improve flexibility.',
    video: null,
    exerciseType: 'bodyweight'
  }
};

// Default timer format
export const DEFAULT_TIMER_DISPLAY = '00:00.0';

// LocalStorage key
export const STORAGE_KEY = 'workoutTrackerData';