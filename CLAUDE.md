# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Development Guidelines

- **Testing**: User will test all changes manually. Do NOT use bash commands to open files or test the application.
- **Response Length**: Keep responses concise. After making changes, don't provide lengthy explanations of what was changed unless specifically requested.
- **File Structure**: All changes should be made to the existing files (index.html, style.css, script.js, manifest.json, sw.js). Do not create additional files unless absolutely necessary.

## Project Architecture

This is a single-page Progressive Web App (PWA) workout tracker built with vanilla HTML, CSS, and JavaScript. The entire application is built in index.html, with supporting style.css, and script.js files.

### Core Components
- **PWA Configuration**: `manifest.json` defines app metadata and `sw.js` handles service worker caching. Add the appropriate meta tags in the index.html file.
- **Local Storage**: All workout data is persisted using browser localStorage with no backend database.

### Data Architecture

The app uses a centralized `workoutData` object stored in localStorage:

```javascript
workoutData = {
    currentCycle: [],        // Completed workouts in current week cycle
    totalWorkouts: 0,        // Total workouts completed across all time
    totalCycles: 0,          // Total completed cycles across all time
    lastWeights: {},         // Weight data by workout type and exercise
    lastReps: {},           // Rep data by workout type and exercise  
    lastSets: {},           // Set counts by workout type and exercise
    weekStartDate: null,     // Start date of current workout cycle
    history: [],            // Historical workout records with dates
    pendingWorkouts: {},    // In-progress workouts saved when cancelled
    workoutStates: {}       // Current state of each workout: 'pending', 'ongoing', 'completed'
}
```

### Workout System
- **Exercise**: An exercise has a name, image, and last weight value used.
- **Workout**: A workout is a collection of exercises to be performed. Each workout has a warm up, exercises to be performed, and a cooldown. A single exercise may appear in multiple workouts.
- **Progressive Tracking**: Tracks weights, reps, and sets for each exercise across sessions.
- **Weekly Cycles**: Tracks completion of all three workouts per week cycle.
- **Workout States**: Each workout has three possible states that control UI behavior and user flow.

### Workout State Management

The app uses a state-based system to track workout progress:

**Three States:**
- **Pending** (`'pending'`): Initial state, workout not yet started
- **Ongoing** (`'ongoing'`): Workout in progress, timer running  
- **Completed** (`'completed'`): Workout finished and recorded

**State Transitions:**
- **Pending → Ongoing**: User clicks "Start Workout" button
- **Ongoing → Completed**: User clicks "Complete Workout" button
- **All → Pending**: New cycle begins (automatic reset)

**UI Behavior by State:**
- **Pending**: Shows "Available" status, "Start Workout" button visible
- **Ongoing**: Shows "Ongoing" status (orange), "Complete Workout" button visible
- **Completed**: Shows "Completed" status, workout card disabled

**State Functions:**
- `getWorkoutState(type)`: Returns current state for workout type
- `setWorkoutState(type, state)`: Updates state and saves to localStorage

### Key JavaScript Functions

- `updateDisplay()`: Main rendering function that updates all UI components
- `openWorkout(type)`: Initiates a workout session for given type
- `startWorkout()`: Begins workout timer and transitions to ongoing state
- `completeWorkout()`: Saves workout data and transitions to completed state
- `openCalendar()`: Displays historical workout calendar
- `saveWorkoutData()`: Persists data to localStorage
- `updatePendingWorkout()`: Real-time updates of pending workout progress
- `getWorkoutState(type)`: Returns current state for workout type
- `setWorkoutState(type, state)`: Updates workout state and saves data
- `formatWorkoutDateTime(date)`: Formats completion dates to "11:30, Thu, 20 Sep" format
- `openExerciseSheet(name)`: Opens bottom sheet for exercise set management
- `updateAppBarState(tab)`: Updates bottom app bar active state

## Development Commands

This project has no build system or package.json. To develop:

### Local Development
User will manually open index.html in their preferred browser.

### Testing the PWA
Will be manually tested by the user.

### File Structure
```
.
├── index.html              # Main application file with Lucide icons CDN
├── style.css              # All CSS styling including bottom app bar and responsive design
├── script.js              # All JavaScript logic with bottom sheet and timer functionality
├── manifest.json          # PWA manifest configuration
├── sw.js                  # Service worker for offline caching
├── icons/favicon.png      # App favicon
└── CLAUDE.md             # This file (project documentation)
```

## Key Implementation Details

- **Exercise Data**: Hardcoded in `workoutExercises` object with exercise names, sets, and types
- **Exercise Metadata**: Images and descriptions stored in `exerciseInfo` object
- **State Management**: Uses global variables (`currentWorkout`, `exerciseData`) for session state
- **Mobile Design**: Mobile-only design with a max-width of 390px and bottom padding for app bar
- **Offline Support**: Service worker caches app for offline use
- **Calendar Integration**: Custom calendar view showing workout history with color coding
- **Bottom App Bar**: Fixed navigation using Lucide icons with z-index 1000
- **Exercise Bottom Sheet**: Modal overlay with z-index 1100, responsive to keyboard
- **Weight Units**: All weights displayed in kilograms (kg) throughout the app
- **Timer Display**: High-precision timer showing tenths of seconds (MM:SS.T format)
- **Date Formatting**: Consistent "11:30, Thu, 20 Sep" format with 15-minute rounding


## Data Persistence

All data is stored in browser localStorage under the key `workoutTrackerData`. The app uses multiple persistence strategies:

### Real-time Persistence
- **Pending Workouts**: Progress is saved immediately when any exercise data changes (weights, reps, sets, completion status)
- **Auto-save Triggers**: Called from `removeSet()`, `addSet()`, `updateWeight()`, `updateReps()`, and `markExerciseComplete()`
- **Smart Cleanup**: Pending workouts are automatically removed if no progress exists (no completed exercises and no sets with weight)

### Workout Completion
- Final workout data is saved when `completeWorkout()` is called
- Historical records are stored with timestamps and exercise details
- Pending workout data is cleared upon successful completion

### Data Recovery
- Cancelled workouts with progress are saved as pending and can be resumed
- Exercise data includes current session state (`exerciseData`) and workout start time
- Resume functionality restores exact state including timer and all set data

### Storage Structure
```javascript
// Pending workout example
pendingWorkouts: {
    'upper-body': {
        exerciseData: { /* current session data */ },
        startTime: '2024-01-15T10:30:00.000Z'
    }
}
```

## Functionality

### Home screen layout
[Bottom app bar with Home and Calendar icons]
[List of all workouts (with a start button for pending workouts) sorted to show pending/ongoing first - completed workouts show completion time and are shown last]
[Stats card that shows - Days since last workout, total count of workouts completed, and total cycles completed]

### Navigation
- **Bottom App Bar**: Fixed navigation with Home and Calendar icons (no text labels)
- **No Back Buttons**: Navigation handled entirely through bottom app bar
- **Zoom Prevention**: Viewport configured to prevent zooming and double-tap zoom

### Workout view
When the user clicks "Start workout" on the home screen the workout screen is opened.
[Workout name] [Cancel button]
[Timer that starts when the workout is started and shows MM:SS.T format with tenths of seconds]
[Complete workout button]
[Warm-up section: Dark container with individual exercise cards]
[List of main exercises, sorted to show the incomplete ones on top with progress indicators]
[Cool-down section: Dark container with individual exercise cards]
[For each main exercise, clicking opens a bottom sheet with sets, weights, and reps]

### Exercise Bottom Sheet
- **Weight Input**: Number input with decimal keypad, shows previous weights as placeholders (e.g., "45kg")
- **Reps Control**: Plus/minus buttons with display, default value 12, range 1-∞
- **Set Management**: Add/remove sets dynamically
- **Keyboard Handling**: Bottom sheet stays at bottom when mobile keyboard appears
- **Units**: All weights displayed in kilograms (kg)

### Calendar view
Accessed via bottom app bar calendar icon.
[Calendar view with month navigation]
A calendar with month navigator on top
For each date on the calendar mark it with workout-specific colors if a workout was done that day.
On clicking any date, below the calendar show the workout details with completion time in "11:30, Thu, 20 Sep" format.
Show only exercises that have recorded weights with format "45kg × 12, 50kg × 10".

### Celebration screen
This will appear for 5 seconds when the user marks a workout as completed, then automatically returns to the home screen.

## Styling
The app follows iOS design principles with a clean, minimalist aesthetic and smooth animations.

### Color Palette

**Primary Colors:**
- Background: `#f2f2f7` (iOS light gray background)
- Text: `#1c1c1e` (iOS dark text)
- Secondary text: `#6c6c70` (iOS secondary label)
- Accent blue: `#007aff` (iOS system blue)
- Success green: `#34c759` (iOS system green)
- Warning/Highlight: `#c6f847` (lime green for celebrations)

**Surface Colors:**
- Card backgrounds: `white`
- Modal overlay: `rgba(0, 0, 0, 0.8)`
- Progress card: `#1c1c1e` (dark background with white text)
- Disabled state: `#e8f5e8` (light green tint)

### Typography

**Font Stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

**Font Sizes & Weights:**
- Main title: `28px, font-weight: 700`
- Card titles: `20px, font-weight: 600`
- Subtitle text: `16px, font-weight: 400`
- Body text: `14px, font-weight: 500`
- Small text: `12px, font-weight: 500`
- Celebration text: `64px, font-weight: 800`

### Spacing & Layout

**Container:**
- Max width: `400px` (mobile-first design)
- Main padding: `20px`
- Card gaps: `16px`

**Border Radius:**
- Cards: `16px`
- Buttons: `12px`
- Small elements: `6px`
- Input fields: `6px`

### Button Styling

**Primary Button (.btn-success):**
- Background: `#FFA570` (Orange)
- Color: `white`
- Padding: `16px 32px`
- Font: `17px, font-weight: 600`
- Border-radius: `12px`
- Hover: `#FF9F63`

**Control Buttons:**
- Background: `#1c1c1e`
- Size: `24px × 24px`
- Color: `white`
- Border-radius: `6px`

**Calendar Navigation:**
- Background: `white`
- Size: `40px × 40px`
- Box-shadow: `0 2px 8px rgba(0, 0, 0, 0.1)`
- Hover: scale `1.05`

### Card Design

**Workout Cards:**
- Background: `white`
- Padding: `20px`
- Border-radius: `16px`
- Box-shadow: `0 2px 12px rgba(0, 0, 0, 0.08)`
- Hover: `translateY(-2px)` + enhanced shadow
- Selected state: border `#007aff` + background `#f0f8ff`

**Status Badges:**
- Completed: `#34c759` background, `white` text
- Available: `#007aff` background, `white` text
- Padding: `6px 12px`
- Border-radius: `20px`
- Font: `13px, font-weight: 600`

### Input Styling

**Weight Inputs:**
- Width: `120px`
- Height: `32px`
- Background: `white`
- Border: `1px solid #dee2e6`
- Border-radius: `6px`
- Text-align: `center`
- Font: `16px, font-weight: 600`
- Focus: border-color `#007aff`

**Reps Display:**
- Background: `white`
- Padding: `8px 16px`
- Border-radius: `6px`
- Min-width: `80px`
- Text-align: `center`

### Animations & Transitions

**Standard Transitions:**
- Duration: `0.3s ease`
- Hover effects: `transform: translateY(-2px)`
- Scale effects: `transform: scale(1.05)`

**Celebration Animations:**
- `celebrationFadeIn`: opacity and scale animation
- `bounceIn`: scale and rotation with bounce effect
- `slideInUp`: translateY animation from bottom
- `confettiFall`: falling confetti with rotation

**Progress Bar:**
- Background: linear gradient `#007aff` to `#34c759`
- Animation: width transition `0.3s ease`
- Glow effect: `box-shadow: 0 0 10px rgba(52, 199, 89, 0.3)`

## Complete Exercise List with Instructions

**Core/Warmup Exercises:**
- **Dead bug** 🐛: Lie on your back, arms up, knees bent at 90°. Lower opposite arm and leg slowly, return to start.
- **Shoulder tap** 👋: Start in plank position. Tap opposite shoulder with hand while maintaining stable core.
- **Push ups** 💪: Start in plank, lower chest to ground, push back up. Keep body straight throughout.
- **Bodyweight squats** 🤸: Stand with feet shoulder-width apart. Lower hips down and back, then return to standing.
- **Hand walks** 🙏: From standing, walk hands forward to plank, then walk back to standing position.

**Upper Body Exercises:**
- **Chest press** 🏋️: Lie on bench, press weights from chest level up and slightly forward, then lower slowly.
- **Lat pull downs** ⬇️: Sit at machine, pull bar down to chest level, squeeze shoulder blades together.
- **Bent over rows** 🦵: Hinge at hips, pull weights to lower chest, squeeze shoulder blades at the top.
- **Shoulder press** ⬆️: Press weights overhead from shoulder level, extend arms fully, lower with control.
- **Bicep curls** 💪: Curl weights from extended arms to shoulders, control the descent.
- **Tricep curls** 💪: Extend arms overhead, lower weight behind head, press back to start.

**Lower Body Exercises:**
- **Back squats** 🏋️: Bar on upper back, squat down keeping chest up, drive through heels to stand.
- **Deadlift** 🏋️: Lift bar from ground by extending hips and knees, keep bar close to body.
- **Step ups** 🚆: Step onto platform with full foot, drive through heel, step down with control.
- **Hip thrust** 🏋️: Shoulders on bench, drive hips up squeezing glutes, lower with control.
- **Single leg extension** 🦵: Extend one leg at a time, control the movement, focus on quad engagement.
- **Side lunge** 🤸: Step wide to one side, lower into lunge, push back to center.
- **Single leg deadlift** ⚖️: Balance on one leg, hinge at hip lowering weight, return to standing.

**Core/Cooldown Exercises:**
- **Plank** 🤸: Hold straight body position on forearms and toes, engage core throughout.
- **Russian twists** 🌀: Sit with knees bent, lean back slightly, rotate torso side to side.
- **Mountain climbers** ⛰️: Start in plank, alternate bringing knees to chest in running motion.
- **Bicycle crunches** 🚲: Lie on back, alternate elbow to opposite knee in cycling motion.
- **Leg raises** 🦵: Lie on back, raise straight legs to 90°, lower slowly without touching ground.
- **Stretch** 🤸: Perform gentle stretches to relax muscles and improve flexibility.

### Data Modification Notes

- All exercise data is stored in JavaScript objects within the HTML file (workout-tracker.html:1278-1348)
- To add new exercises: Update both `workoutExercises` and `exerciseInfo` objects
- Exercise types: `'warmup'`, `'cooldown'`, or no type (main exercises)
- Set counts are configurable per exercise and can be dynamically adjusted during workouts