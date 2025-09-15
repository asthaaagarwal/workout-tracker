# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Development Guidelines

- **Testing**: User will test all changes manually. Do NOT use bash commands to open files or test the application.
- **Response Length**: Keep responses concise. After making changes, don't provide lengthy explanations of what was changed unless specifically requested.
- **File Structure**: All changes should be made to the existing files (index.html, style.css, script.js, manifest.json, sw.js). Do not create additional files unless absolutely necessary.

## Project Architecture

This is a single-page Progressive Web App (PWA) workout tracker called "Workout Trainer" built with vanilla HTML, CSS, and JavaScript.

### Core Components
- **PWA Configuration**: `manifest.json` defines app metadata and `sw.js` handles service worker caching
- **Local Storage**: All workout data is persisted using browser localStorage with no backend database

### Data Architecture

The app uses a centralized `workoutData` object stored in localStorage:

```javascript
workoutData = {
    totalWorkouts: 0,           // Total workouts completed across all time
    lastWeights: {},           // Weight data by workout type and exercise
    lastReps: {},             // Rep data by workout type and exercise
    lastSets: {},             // Set counts by workout type and exercise
    lastExerciseData: {},     // Detailed exercise data with sets
    history: [],              // Historical workout records with dates
    pendingWorkouts: {},      // In-progress workouts saved when cancelled
    workoutStates: {},        // Current state of each workout: 'pending', 'ongoing', 'completed'
    dailyEntries: {}          // Daily check-in data with mood and notes
}
```

### Workout System
- **Exercise**: An exercise has a name, icon, and description
- **Workout**: Three workout types: upper-body, lower-body, full-body
- **Progressive Tracking**: Tracks weights, reps, and sets for each exercise
- **Daily Check-ins**: Simple emoji-based mood tracking

### Workout State Management

The app uses a state-based system to track workout progress:

**Three States:**
- **Pending** (`'pending'`): Initial state, workout not yet started
- **Ongoing** (`'ongoing'`): Workout in progress, timer running
- **Completed** (`'completed'`): Workout finished and recorded

**State Functions:**
- `getWorkoutState(type)`: Returns current state for workout type
- `setWorkoutState(type, state)`: Updates state and saves to localStorage

### Key JavaScript Functions

- `updateDisplay()`: Main rendering function that updates UI
- `openWorkout(type)`: Initiates a workout session
- `startWorkout()`: Begins workout timer and transitions to ongoing state
- `completeWorkout()`: Saves workout data and transitions to completed state
- `openCalendar()`: Displays historical workout calendar
- `saveWorkoutData()`: Persists data to localStorage
- `updatePendingWorkout()`: Real-time updates of pending workout progress

## Development Commands

This project has no build system or package.json. To develop:

### Local Development
User will manually open index.html in their preferred browser.

### File Structure
```
.
├── index.html              # Main application file
├── style.css              # All CSS styling
├── script.js              # All JavaScript logic
├── manifest.json          # PWA manifest configuration
├── sw.js                  # Service worker for offline caching
├── icons/                 # App icons
├── images/                # Exercise images
└── CLAUDE.md             # This file (project documentation)
```

## Key Implementation Details

- **Exercise Data**: Hardcoded in `workoutExercises` object
- **Exercise Metadata**: Icons and descriptions stored in `exerciseInfo` object
- **State Management**: Uses global variables (`currentWorkout`, `exerciseData`)
- **Mobile Design**: Mobile-only design with max-width of 400px
- **Offline Support**: Service worker caches app for offline use
- **Calendar Integration**: Custom calendar view showing workout history
- **Bottom App Bar**: Fixed navigation using Lucide icons
- **Exercise Bottom Sheet**: Modal overlay for exercise set management
- **Weight Units**: All weights displayed in kilograms (kg)
- **Timer Display**: High-precision timer showing hours:minutes:seconds format

## Functionality

### Home Screen
- Daily check-in with emoji selection
- List of workouts with states (pending/ongoing/completed)
- Stats card showing days since last workout and total workouts

### Navigation
- Bottom App Bar with Home and Calendar icons
- No back buttons - navigation handled through bottom app bar

### Workout View
- Workout name with back button
- Timer that starts when workout is started
- Complete workout button
- Exercise list with progress indicators
- Exercise bottom sheet for set/weight/rep management

### Calendar View
- Monthly calendar with navigation
- Workout dates marked with colors
- Daily check-in display for selected dates
- Workout details on date selection

### Daily Check-ins
- Simple emoji-based mood tracking
- Optional notes
- Stored in `workoutData.dailyEntries`

## Workout Data

### Three Workout Types
- **Upper Body**: Chest, back, shoulders, arms
- **Lower Body**: Legs, glutes, lower body strength
- **Full Body**: Complete body workout with core focus

### Exercise Types
- **Warmup exercises**: Type `'warmup'`
- **Main exercises**: No type (default)
- **Cooldown exercises**: Type `'cooldown'`

### Complete Exercise List
**Warmup/Core:**
- Dead bug 🐛, Shoulder tap 👋, Push ups 💪, Bodyweight squats 🤸, Hand walks 🙏

**Main Exercises:**
- Chest press 🏋️, Lat pull downs ⬇️, Bent over rows 🦵, Shoulder press ⬆️, Bicep curls 💪, Tricep curls 💪
- Back squats 🏋️, Deadlift 🏋️, Step ups 🚆, Hip thrust 🏋️, Single leg extension 🦵, Side lunge 🤸, Single leg deadlift ⚖️

**Cooldown:**
- Plank 🤸, Russian twists 🌀, Mountain climbers ⛰️, Bicycle crunches 🚲, Leg raises 🦵, Stretch 🤸

### Data Persistence
All data is stored in browser localStorage under the key `workoutTrackerData`. The app includes test data functions for development and progress is auto-saved during workouts.