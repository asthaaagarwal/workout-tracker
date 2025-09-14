// Workout Tracker JavaScript

// Global state variables
let currentWorkout = null;
let workoutStartTime = null;
let timerInterval = null;
let exerciseData = {};
let currentCalendarDate = new Date();
let selectedCalendarDate = new Date(); // Track selected date for calendar check-ins
let previousScreen = 'home'; // Track which screen opened the workout

// App names to cycle through
const appNames = [
    "Exercise? I thought you said Extra Fries",
    "Abs are great, but have you tried donuts?",
    "I have a love–hate relationship with burpees. Mostly hate.",
    "Burpees? No thanks, I’ll do burfis.",
    "HIIT = High Intensity Imbiss Training.",
];

// Workout colors
const workoutColors = {
    'upper-body': '#fcd5c1',    // Default workout card color
    'lower-body': '#fcd5c1',    // Default workout card color
    'full-body': '#fcd5c1'      // Default workout card color
};

// Feedback emoji mapping
const feedbackMap = {
    'amazing': { emoji: '🔥', label: 'Amazing' },
    'good': { emoji: '😊', label: 'Good' },
    'okay': { emoji: '😐', label: 'Okay' },
    'tough': { emoji: '😮‍💨', label: 'Tough' },
    'terrible': { emoji: '😞', label: 'Terrible' }
};

// Workout exercises data
const workoutExercises = {
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
const exerciseInfo = {
    'Dead bug': { icon: '🐛', description: 'Lie on your back, arms up, knees bent at 90°. Lower opposite arm and leg slowly, return to start.', video: null, exerciseType: 'bodyweight' },
    'Shoulder tap': { icon: '👋', description: 'Start in plank position. Tap opposite shoulder with hand while maintaining stable core.', video: null, exerciseType: 'bodyweight' },
    'Push ups': { icon: '💪', description: 'Start in plank, lower chest to ground, push back up. Keep body straight throughout.', video: 'https://www.youtube.com/watch?v=KEFQyLkDYtI', exerciseType: 'bodyweight' },
    'Bodyweight squats': { icon: '🤸', description: 'Stand with feet shoulder-width apart. Lower hips down and back, then return to standing.', video: null, exerciseType: 'bodyweight' },
    'Hand walks': { icon: '🙏', description: 'From standing, walk hands forward to plank, then walk back to standing position.', video: null, exerciseType: 'bodyweight' },
    'Chest press': { icon: '🏋️', description: 'Lie on bench, press weights from chest level up and slightly forward, then lower slowly.', video: 'https://www.youtube.com/watch?v=tuwHzzPdaGc', exerciseType: 'weighted' },
    'Lat pull downs': { icon: '⬇️', description: 'Sit at machine, pull bar down to chest level, squeeze shoulder blades together.', video: 'https://www.youtube.com/watch?v=Mdp7kuhZD_M', exerciseType: 'weighted' },
    'Bent over rows': { icon: '🦵', description: 'Hinge at hips, pull weights to lower chest, squeeze shoulder blades at the top.', video: 'https://www.youtube.com/watch?v=3_RR7ELmcAk', exerciseType: 'weighted' },
    'Shoulder press': { icon: '⬆️', description: 'Press weights overhead from shoulder level, extend arms fully, lower with control.', video: 'https://www.youtube.com/watch?v=FRxZ6wr5bpA', exerciseType: 'weighted' },
    'Bicep curls': { icon: '💪', description: 'Curl weights from extended arms to shoulders, control the descent.', video: 'https://www.youtube.com/watch?v=tMEGqKuOa-M', exerciseType: 'weighted' },
    'Tricep curls': { icon: '💪', description: 'Extend arms overhead, lower weight behind head, press back to start.', video: 'https://www.youtube.com/watch?v=VjmgzEmODnI', exerciseType: 'weighted' },
    'Back squats': { icon: '🏋️', description: 'Bar on upper back, squat down keeping chest up, drive through heels to stand.', video: 'https://www.youtube.com/watch?v=R2dMsNhN3DE', exerciseType: 'weighted' },
    'Deadlift': { icon: '🏋️', description: 'Lift bar from ground by extending hips and knees, keep bar close to body.', video: 'https://www.youtube.com/watch?v=wjsu6ceEkAQ', exerciseType: 'weighted' },
    'Step ups': { icon: '🚆', description: 'Step onto platform with full foot, drive through heel, step down with control.', video: 'https://www.youtube.com/watch?v=elhu-WC1qk4', exerciseType: 'weighted' },
    'Hip thrust': { icon: '🏋️', description: 'Shoulders on bench, drive hips up squeezing glutes, lower with control.', video: 'https://www.youtube.com/watch?v=aweBS7K71l8', exerciseType: 'weighted' },
    'Single leg extension': { icon: '🦵', description: 'Extend one leg at a time, control the movement, focus on quad engagement.', video: 'https://www.youtube.com/watch?v=82IuSLk5zNc', exerciseType: 'weighted' },
    'Side lunge': { icon: '🤸', description: 'Step wide to one side, lower into lunge, push back to center.', video: null, exerciseType: 'bodyweight' },
    'Single leg deadlift': { icon: '⚖️', description: 'Balance on one leg, hinge at hip lowering weight, return to standing.', video: null, exerciseType: 'weighted' },
    'Plank': { icon: '🤸', description: 'Hold straight body position on forearms and toes, engage core throughout.', video: null, exerciseType: 'bodyweight' },
    'Russian twists': { icon: '🌀', description: 'Sit with knees bent, lean back slightly, rotate torso side to side.', video: null, exerciseType: 'bodyweight' },
    'Mountain climbers': { icon: '⛰️', description: 'Start in plank, alternate bringing knees to chest in running motion.', video: null, exerciseType: 'bodyweight' },
    'Bicycle crunches': { icon: '🚲', description: 'Lie on back, alternate elbow to opposite knee in cycling motion.', video: null, exerciseType: 'bodyweight' },
    'Leg raises': { icon: '🦵', description: 'Lie on back, raise straight legs to 90°, lower slowly without touching ground.', video: null, exerciseType: 'bodyweight' },
    'Stretch': { icon: '🤸', description: 'Perform gentle stretches to relax muscles and improve flexibility.', video: null, exerciseType: 'bodyweight' }
};

// Helper function to get local date key (timezone-neutral)
function getLocalDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Initialize workout data structure
let workoutData = {
    totalWorkouts: 0,
    lastWeights: {},
    lastReps: {},
    lastSets: {},
    lastExerciseData: {}, // Store full exercise data (sets with weights and reps)
    history: [],
    pendingWorkouts: {},
    workoutStates: {}, // Track workout states: 'pending', 'ongoing', 'completed'
    dailyEntries: {} // Track daily wellness entries: date -> {note, soreness}
};

// Load data from localStorage on page load
function loadWorkoutData() {
    const saved = localStorage.getItem('workoutTrackerData');
    if (saved) {
        const parsedData = JSON.parse(saved);
        workoutData = { ...workoutData, ...parsedData };

        // Migration: Remove cycle-related properties if they exist
        if (workoutData.currentCycle) {
            delete workoutData.currentCycle;
        }
        if (workoutData.totalCycles) {
            delete workoutData.totalCycles;
        }
        if (workoutData.weekStartDate) {
            delete workoutData.weekStartDate;
        }

        // If any changes were made, save the migrated data
        if (parsedData.currentCycle || parsedData.totalCycles || parsedData.weekStartDate) {
            saveWorkoutData();
        }
    }
}

// Save data to localStorage
function saveWorkoutData() {
    localStorage.setItem('workoutTrackerData', JSON.stringify(workoutData));
}

// Test data functions for development/testing
function addTestData() {
    const workoutTypes = ['upper-body', 'lower-body', 'full-body'];
    const testWorkouts = [];

    // Generate workouts for the last 2 months (8-9 weeks)
    const today = new Date();
    const yesterday = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000)); // Start from yesterday
    const startDate = new Date(yesterday.getTime() - (60 * 24 * 60 * 60 * 1000)); // 60 days before yesterday

    // Sample exercise data for each workout type
    const sampleExercises = {
        'upper-body': {
            'Chest press': { baseWeight: 20, sets: 3 },
            'Lat pull downs': { baseWeight: 30, sets: 3 },
            'Bent over rows': { baseWeight: 25, sets: 3 },
            'Shoulder press': { baseWeight: 15, sets: 3 },
            'Bicep curls': { baseWeight: 10, sets: 2 },
            'Tricep curls': { baseWeight: 12, sets: 2 }
        },
        'lower-body': {
            'Back squats': { baseWeight: 40, sets: 3 },
            'Deadlift': { baseWeight: 50, sets: 3 },
            'Step ups': { baseWeight: 15, sets: 3 },
            'Hip thrust': { baseWeight: 35, sets: 3 },
            'Single leg extension': { baseWeight: 20, sets: 2 },
            'Side lunge': { baseWeight: 0, sets: 2 }
        },
        'full-body': {
            'Back squats': { baseWeight: 35, sets: 3 },
            'Chest press': { baseWeight: 18, sets: 3 },
            'Bent over rows': { baseWeight: 22, sets: 3 },
            'Shoulder press': { baseWeight: 12, sets: 3 },
            'Hip thrust': { baseWeight: 30, sets: 3 }
        }
    };

    // Generate 2-3 workouts per week for the last 2 months with dynamic scheduling
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysToGenerate = 61; // 60 days before yesterday + yesterday
    const weeksToGenerate = Math.ceil(daysToGenerate / 7);

    for (let week = 0; week < weeksToGenerate; week++) {
        const weekStartDate = new Date(startDate.getTime() + (week * 7 * msPerDay));

        // Randomly decide 2 or 3 workouts this week (weighted towards 3)
        const workoutsThisWeek = Math.random() < 0.7 ? 3 : 2;

        // Define possible workout days (Mon-Sat, avoiding Sunday)
        const possibleDays = [1, 2, 3, 4, 5, 6]; // Mon-Sat

        // Randomly select workout days for this week with minimum rest day between workouts
        const selectedDays = [];
        if (workoutsThisWeek === 2) {
            // For 2 workouts, use predefined patterns to ensure variety and proper spacing
            const twoWorkoutPatterns = [
                [1, 4], // Mon, Thu
                [1, 5], // Mon, Fri
                [1, 6], // Mon, Sat
                [2, 5], // Tue, Fri
                [2, 6], // Tue, Sat
                [3, 6], // Wed, Sat
                [1, 3], // Mon, Wed
                [3, 5], // Wed, Fri
            ];
            const patternIndex = (week + Math.floor(Math.random() * 2)) % twoWorkoutPatterns.length;
            const pattern = twoWorkoutPatterns[patternIndex];
            selectedDays.push(...pattern);
        } else {
            // For 3 workouts, use a more varied pattern based on week number for consistent variety
            const patterns = [
                [1, 3, 5], // Mon, Wed, Fri - classic
                [1, 3, 6], // Mon, Wed, Sat
                [2, 4, 6], // Tue, Thu, Sat
                [1, 4, 6], // Mon, Thu, Sat
                [2, 4, 5], // Tue, Thu, Fri
                [1, 2, 4], // Mon, Tue, Thu
                [3, 5, 6], // Wed, Fri, Sat
            ];
            // Use week number to ensure different patterns across weeks, but with some randomness
            const patternIndex = (week + Math.floor(Math.random() * 3)) % patterns.length;
            const pattern = patterns[patternIndex];
            selectedDays.push(...pattern);
        }

        // Sort selected days
        selectedDays.sort((a, b) => a - b);

        selectedDays.forEach((dayOfWeek, workoutIndex) => {
            // Calculate the actual date for this workout
            const daysFromWeekStart = dayOfWeek - weekStartDate.getDay();
            const adjustedDaysFromWeekStart = daysFromWeekStart < 0 ? daysFromWeekStart + 7 : daysFromWeekStart;
            const workoutDate = new Date(weekStartDate.getTime() + (adjustedDaysFromWeekStart * msPerDay));

            // Only add workout if it's within our date range and not in the future
            if (workoutDate >= startDate && workoutDate <= yesterday) {
                // Cycle through workout types in order for consistency
                const workoutType = workoutTypes[workoutIndex % workoutTypes.length];
                const exercises = sampleExercises[workoutType];

                // Set realistic workout times with more variety
                let hour;
                const timePreference = Math.random();
                if (timePreference < 0.3) { // 30% morning workouts
                    hour = 6 + Math.floor(Math.random() * 3); // 6-8 AM
                } else if (timePreference < 0.7) { // 40% evening workouts
                    hour = 17 + Math.floor(Math.random() * 4); // 5-8 PM
                } else { // 30% afternoon/lunch workouts
                    hour = 12 + Math.floor(Math.random() * 3); // 12-2 PM
                }
                workoutDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

                // Generate exercise data with more realistic progressive overload
                const workoutExercises = {};
                Object.entries(exercises).forEach(([exerciseName, config]) => {
                    const sets = [];

                    // Calculate base weight for this week with realistic progression
                    const weeksOfTraining = week;
                    let baseWeightForWeek = config.baseWeight;

                    // Progressive overload pattern: increase weight every 2-3 weeks
                    const progressionCycle = Math.floor(weeksOfTraining / 3); // Every 3 weeks
                    const weekInCycle = weeksOfTraining % 3;

                    // Add progression based on exercise type (compound vs isolation)
                    const isCompoundMovement = ['Back squats', 'Deadlift', 'Chest press', 'Bent over rows'].includes(exerciseName);
                    const progressionRate = isCompoundMovement ? 2.5 : 1.25; // Compounds progress faster

                    baseWeightForWeek += progressionCycle * progressionRate;

                    // Add small week-to-week variations within the cycle
                    if (weekInCycle === 1) {
                        baseWeightForWeek += 0.5; // Slight increase in week 2
                    } else if (weekInCycle === 2) {
                        baseWeightForWeek += 1; // Small increase in week 3
                    }

                    // Handle deload weeks (every 4th cycle = every 12 weeks)
                    const isDeloadCycle = progressionCycle > 0 && progressionCycle % 4 === 0;
                    if (isDeloadCycle) {
                        baseWeightForWeek *= 0.9; // 10% reduction for deload
                    }

                    // Occasional plateau periods (simulate training plateaus)
                    const plateauProbability = Math.max(0, (progressionCycle - 3) * 0.1); // Higher chance after week 9
                    const isPlateauWeek = Math.random() < plateauProbability;
                    if (isPlateauWeek && weekInCycle === 0) {
                        baseWeightForWeek = Math.max(config.baseWeight, baseWeightForWeek - progressionRate); // Slight regression
                    }

                    for (let setNum = 0; setNum < config.sets; setNum++) {
                        // Small variations between sets (realistic training)
                        let setWeight = baseWeightForWeek;

                        // First set: sometimes lighter for warm-up
                        if (setNum === 0 && Math.random() < 0.3) {
                            setWeight -= 2.5;
                        }

                        // Last set: sometimes heavier for top set
                        if (setNum === config.sets - 1 && Math.random() < 0.4) {
                            setWeight += 1.25;
                        }

                        // Small random variation (±1.25kg)
                        const randomVariation = (Math.random() - 0.5) * 2.5;
                        setWeight += randomVariation;

                        // Round to nearest 1.25kg (realistic plate increments)
                        setWeight = Math.max(5, Math.round(setWeight * 0.8) / 0.8);

                        // Realistic rep ranges based on weight progression
                        let reps;
                        if (setWeight >= baseWeightForWeek + 2.5) {
                            reps = 6 + Math.floor(Math.random() * 4); // 6-9 reps for heavier sets
                        } else if (setWeight <= baseWeightForWeek - 2.5) {
                            reps = 12 + Math.floor(Math.random() * 4); // 12-15 reps for lighter sets
                        } else {
                            reps = 8 + Math.floor(Math.random() * 5); // 8-12 reps for normal sets
                        }

                        sets.push({ weight: setWeight, reps });
                    }

                    if (sets.length > 0) {
                        workoutExercises[exerciseName] = sets;
                    }
                });

                // Realistic workout duration based on workout type
                const baseDuration = 40 * 60 * 1000; // 40 minutes base
                const variation = Math.floor(Math.random() * 40 * 60 * 1000); // ±40 minutes variation
                const duration = baseDuration + variation;

                testWorkouts.push({
                    date: workoutDate.toISOString(),
                    type: workoutType,
                    duration: duration,
                    exercises: workoutExercises,
                    feedback: null,
                    isTestData: true // Mark as test data for easy removal
                });
            }
        });
    }

    // Add test workouts to history
    workoutData.history.push(...testWorkouts);
    workoutData.totalWorkouts = (workoutData.totalWorkouts || 0) + testWorkouts.length;

    // Sort history by date
    workoutData.history.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Generate fake daily check-in data
    const moods = ['amazing', 'good', 'okay', 'tough', 'terrible'];
    const sorenessLevels = ['none', 'mild', 'sore', 'very-sore'];
    const sampleNotes = [
        "Feeling energized today!",
        "Great workout session",
        "A bit tired but motivated",
        "Recovery day needed",
        "Pushed through the soreness",
        "Feeling strong and focused",
        "Had a challenging day",
        "Loving the progress",
        "Need to stretch more",
        "Perfect workout weather",
        "",
        "",
        "" // Some entries with no notes
    ];

    // Initialize dailyEntries if it doesn't exist
    if (!workoutData.dailyEntries) {
        workoutData.dailyEntries = {};
    }

    // Add daily check-ins for the same date range, with some gaps
    for (let i = 0; i < daysToGenerate; i++) { // 2 months
        // Skip some days randomly to make it realistic (about 25% skip rate)
        if (Math.random() < 0.25) continue;

        const checkInDate = new Date(startDate.getTime() + (i * msPerDay));
        const dateKey = getLocalDateKey(checkInDate);

        // Don't add check-ins for future dates
        if (checkInDate > yesterday) continue;

        // Don't overwrite existing real check-ins
        if (!workoutData.dailyEntries[dateKey]) {
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            const randomSoreness = sorenessLevels[Math.floor(Math.random() * sorenessLevels.length)];
            const randomNote = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];

            workoutData.dailyEntries[dateKey] = {
                mood: randomMood,
                soreness: randomSoreness,
                note: randomNote,
                date: checkInDate.toISOString(),
                isTestData: true // Mark as test data for easy removal
            };
        }
    }

    saveWorkoutData();

    const checkinCount = Object.values(workoutData.dailyEntries).filter(entry => entry.isTestData).length;

    // Refresh the display if we're on the home page
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }

    return testWorkouts.length;
}

function removeTestData() {
    const initialWorkoutCount = workoutData.history.length;
    const initialCheckinCount = workoutData.dailyEntries ? Object.keys(workoutData.dailyEntries).length : 0;

    // Remove all workouts marked as test data
    workoutData.history = workoutData.history.filter(workout => !workout.isTestData);

    const removedWorkoutCount = initialWorkoutCount - workoutData.history.length;

    // Remove all daily check-ins marked as test data
    let removedCheckinCount = 0;
    if (workoutData.dailyEntries) {
        const testEntryKeys = Object.keys(workoutData.dailyEntries).filter(key =>
            workoutData.dailyEntries[key].isTestData
        );

        testEntryKeys.forEach(key => {
            delete workoutData.dailyEntries[key];
            removedCheckinCount++;
        });
    }

    // Update total workout count
    workoutData.totalWorkouts = Math.max(0, (workoutData.totalWorkouts || 0) - removedWorkoutCount);

    saveWorkoutData();


    // Refresh the display if we're on the home page
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }

    return removedWorkoutCount;
}

// Update pending workout data if current workout is in progress or save to history if completed
function updatePendingWorkout() {
    if (!currentWorkout || !exerciseData) return;
    
    const workoutState = getWorkoutState(currentWorkout);
    
    // Check if any exercises are completed or have weight entered
    const hasProgress = Object.values(exerciseData).some(exercise => 
        exercise.completed || exercise.sets.some(set => set.weight && set.weight > 0)
    );
    
    // Check if workout is ongoing (started)
    const isOngoing = workoutState === 'ongoing';
    
    if (workoutState === 'completed') {
        // Save changes to completed workout in history
        updateCompletedWorkoutInHistory();
    } else if (hasProgress || isOngoing) {
        // Save current progress as pending workout (for progress OR ongoing workouts)
        workoutData.pendingWorkouts[currentWorkout] = {
            exerciseData: JSON.parse(JSON.stringify(exerciseData)),
            startTime: workoutStartTime?.toISOString() || new Date().toISOString()
        };
        saveWorkoutData();
    } else {
        // Remove pending workout only if no progress AND not ongoing
        if (workoutData.pendingWorkouts[currentWorkout]) {
            delete workoutData.pendingWorkouts[currentWorkout];
            saveWorkoutData();
        }
    }
}

// Update completed workout in history
function updateCompletedWorkoutInHistory() {
    if (!currentWorkout || !exerciseData) return;
    
    // Find the most recent workout of this type in history
    const workoutIndex = workoutData.history.findIndex(h => h.type === currentWorkout);
    if (workoutIndex === -1) return;
    
    // Get the most recent workout (they're stored chronologically)
    let mostRecentIndex = workoutIndex;
    for (let i = workoutIndex + 1; i < workoutData.history.length; i++) {
        if (workoutData.history[i].type === currentWorkout) {
            mostRecentIndex = i;
        }
    }
    
    // Update the exercises data with current exercise data
    // For completed workouts being edited, save all exercises with valid weight data
    const workoutState = getWorkoutState(currentWorkout);
    const updatedExercises = Object.fromEntries(
        Object.entries(exerciseData)
            .filter(([_, data]) => {
                // If workout is already completed (editing from calendar), save all exercises with weights
                // Otherwise, only save completed exercises with weights
                if (workoutState === 'completed') {
                    return data.sets.some(set => set.weight && parseFloat(set.weight) > 0);
                } else {
                    return data.completed && data.sets.some(set => set.weight && parseFloat(set.weight) > 0);
                }
            })
            .map(([name, data]) => [name, data.sets.filter(set => set.weight && parseFloat(set.weight) > 0)])
    );
    
    workoutData.history[mostRecentIndex].exercises = updatedExercises;
    saveWorkoutData();
}

// Initialize the app
function initApp() {
    loadWorkoutData();
    
    // Check if any workout is ongoing and restart timer
    const ongoingWorkoutType = getOngoingWorkoutType();
    if (ongoingWorkoutType && workoutData.pendingWorkouts[ongoingWorkoutType]) {
        workoutStartTime = new Date(workoutData.pendingWorkouts[ongoingWorkoutType].startTime);
        startWorkoutTimer();
    }
    
    updateDisplay();
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('cancelWorkoutBtn').addEventListener('click', goBackHome);
    document.getElementById('startWorkoutBtn').addEventListener('click', startWorkout);
    document.getElementById('completeWorkoutBtn').addEventListener('click', completeWorkout);
    
    // Daily Check-in Popover
    document.getElementById('closeCheckinBtn').addEventListener('click', closeCheckinPopover);
    document.getElementById('saveCheckinBtn').addEventListener('click', saveCheckinFromPopover);

    // Textarea blur handler for "Done" button
    document.getElementById('checkinTextarea').addEventListener('blur', (e) => {
        // Small delay to allow other events to process first
        setTimeout(() => {
            // Only submit if there's content and a mood is selected
            if (e.target.value.trim() && selectedMood) {
                saveCheckinFromPopover();
            }
        }, 100);
    });

    // Bottom App Bar
    document.getElementById('homeAppBarBtn').addEventListener('click', () => {
        showHomeScreen();
        updateAppBarState('home');
    });
    document.getElementById('calendarAppBarBtn').addEventListener('click', () => {
        openCalendar();
        updateAppBarState('calendar');
    });
    document.getElementById('statsAppBarBtn').addEventListener('click', () => {
        openStats();
    });

    // Exercise dropdown change
    document.getElementById('exerciseDropdown').addEventListener('change', (e) => {
        renderStats(e.target.value);
    });
    
    // Calendar navigation
    document.getElementById('prevMonthBtn').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('nextMonthBtn').addEventListener('click', () => navigateMonth(1));
    
    // Bottom Sheet
    // Close button removed - sheet can be closed by clicking background
    document.getElementById('exerciseBottomSheet').addEventListener('click', (e) => {
        if (e.target.id === 'exerciseBottomSheet') closeExerciseSheet();
    });
    
    
    // Confirmation dialog event listeners
    document.getElementById('confirmYesBtn').addEventListener('click', confirmCompleteWorkout);
    document.getElementById('confirmNoBtn').addEventListener('click', closeConfirmationDialog);
    document.getElementById('confirmationDialog').addEventListener('click', (e) => {
        if (e.target.id === 'confirmationDialog') closeConfirmationDialog();
    });
    
    // Delete workout event listeners
    document.getElementById('deleteWorkoutBtn').addEventListener('click', showDeleteConfirmationDialog);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteWorkout);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteConfirmationDialog);
    document.getElementById('deleteConfirmationDialog').addEventListener('click', (e) => {
        if (e.target.id === 'deleteConfirmationDialog') closeDeleteConfirmationDialog();
    });

    // Checkin deletion dialog event listeners
    document.getElementById('confirmDeleteCheckinBtn').addEventListener('click', confirmDeleteCheckin);
    document.getElementById('cancelDeleteCheckinBtn').addEventListener('click', closeDeleteCheckinConfirmationDialog);
    document.getElementById('deleteCheckinConfirmationDialog').addEventListener('click', (e) => {
        if (e.target.id === 'deleteCheckinConfirmationDialog') closeDeleteCheckinConfirmationDialog();
    });

    // Developer controls event listeners
    document.getElementById('addTestDataBtn').addEventListener('click', () => {
        const count = addTestData();
        alert(`Added ${count} test workouts to your history!`);
    });
    document.getElementById('removeTestDataBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to remove all test data? This cannot be undone.')) {
            const count = removeTestData();
            alert(`Removed ${count} test workouts from your history!`);
        }
    });
}

// Update the main display
function updateDisplay() {
    updateAppName();
    renderDailyCheckin();
    renderWorkoutCards();
    updateStats();
}

// Global variable to track selected mood for home checkin
let selectedMood = null;
let currentCheckinScreen = 'home'; // Track which screen opened the check-in

// Render daily checkin emojis on home page
function renderDailyCheckin() {
    renderHomeCheckin();
    renderCalendarCheckin();
}

function renderHomeCheckin() {
    const dailyCheckinDiv = document.getElementById('dailyCheckin');
    if (!dailyCheckinDiv) return;
    
    const today = new Date();
    const dateKey = getLocalDateKey(today);
    const todayEntry = workoutData.dailyEntries[dateKey];

    let checkinHTML = generateCheckinHTML(todayEntry, 'home');
    
    dailyCheckinDiv.innerHTML = checkinHTML;
    dailyCheckinDiv.classList.remove('hidden');
}

function renderCalendarCheckin() {
    const calendarDailyCheckinDiv = document.getElementById('calendarDailyCheckin');
    if (!calendarDailyCheckinDiv) return;

    // Check if selected date is in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedCalendarDate > today) {
        calendarDailyCheckinDiv.classList.add('hidden');
        return;
    }

    const dateKey = getLocalDateKey(selectedCalendarDate);
    const selectedEntry = workoutData.dailyEntries[dateKey];

    let checkinHTML = generateCheckinHTML(selectedEntry, 'calendar');

    calendarDailyCheckinDiv.innerHTML = checkinHTML;
    calendarDailyCheckinDiv.classList.remove('hidden');
}

function generateCheckinHTML(entry, screen) {
    if (entry && entry.mood) {
        // Show completed state with selected emoji, note, and action buttons
        const moodEmoji = getMoodEmoji(entry.mood);
        const noteText = entry.note ? entry.note : '';
        const dateKey = getLocalDateKey(screen === 'calendar' ? selectedCalendarDate : new Date());
        
        return `
            <div style="background: white; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="mood-emoji" style="background: transparent; transform: none; cursor: pointer;" data-mood="${entry.mood}" onclick="openCheckinPopover('${entry.mood}', '${screen}')">${moodEmoji}</button>
                    ${noteText ? `<p style="margin: 0; font-size: 14px; color: #1c1c1e; flex: 1;">${noteText}</p>` : ''}
                </div>
            </div>
        `;
    } else {
        // Show mood emoji options
        const moods = ['amazing', 'good', 'okay', 'tough', 'terrible'];
        const moodEmojis = {
            'amazing': '🔥',
            'good': '😊',
            'okay': '😐',
            'tough': '😮‍💨',
            'terrible': '😞'
        };

        return moods.map(mood => 
            `<button class="mood-emoji" data-mood="${mood}" onclick="openCheckinPopover('${mood}', '${screen}')">${moodEmojis[mood]}</button>`
        ).join('');
    }
}

// Helper function to get mood emoji
function getMoodEmoji(mood) {
    const moodEmojis = {
        'amazing': '🔥',
        'good': '😊',
        'okay': '😐',
        'tough': '😮‍💨',
        'terrible': '😞'
    };
    return moodEmojis[mood] || '😊';
}

// Open checkin popover
function openCheckinPopover(initialMood = null, screen = 'home') {
    selectedMood = initialMood;
    currentCheckinScreen = screen;
    
    const popover = document.getElementById('checkinPopover');
    const homeScreen = document.getElementById('homeScreen');
    const workoutScreen = document.getElementById('workoutScreen');
    const calendarScreen = document.getElementById('calendarScreen');
    
    // Hide other screens
    homeScreen.classList.add('hidden');
    workoutScreen.classList.add('hidden');
    calendarScreen.classList.add('hidden');
    
    // Show popover
    popover.classList.remove('hidden');
    
    // Render mood options
    renderMoodOptions();
    
    // Focus textarea and load existing note if any
    const textarea = document.getElementById('checkinTextarea');
    const deleteBtn = document.getElementById('deleteCheckinBtn');
    const targetDate = screen === 'calendar' ? selectedCalendarDate : new Date();
    const dateKey = getLocalDateKey(targetDate);
    const existingEntry = workoutData.dailyEntries[dateKey];
    
    if (existingEntry && existingEntry.note) {
        textarea.value = existingEntry.note;
    } else {
        textarea.value = '';
    }

    // Auto-focus on textarea with slight delay for smooth transition
    setTimeout(() => {
        textarea.focus();
    }, 300);
    
    // Show delete button only if editing existing entry
    if (existingEntry && existingEntry.mood) {
        deleteBtn.classList.remove('hidden');
        deleteBtn.onclick = () => deleteCheckinFromPopover(dateKey);
    } else {
        deleteBtn.classList.add('hidden');
    }
    
    // Focus textarea after a short delay to ensure it's rendered
    setTimeout(() => {
        textarea.focus();
    }, 100);
}

// Close checkin popover
function closeCheckinPopover() {
    const popover = document.getElementById('checkinPopover');
    popover.classList.add('hidden');
    
    // Return to the screen that opened the check-in popover
    if (currentCheckinScreen === 'calendar') {
        openCalendar();
    } else {
        showHomeScreen();
    }
}

// Render mood options in popover
function renderMoodOptions() {
    const moodOptionsDiv = document.getElementById('moodOptions');
    const moods = [
        { id: 'amazing', emoji: '🔥', label: 'Amazing' },
        { id: 'good', emoji: '😊', label: 'Good' },
        { id: 'okay', emoji: '😐', label: 'Okay' },
        { id: 'tough', emoji: '😮‍💨', label: 'Tough' },
        { id: 'terrible', emoji: '😞', label: 'Terrible' }
    ];
    
    const moodButtons = moods.map(mood => {
        const isSelected = mood.id === selectedMood ? 'selected' : '';
        return `
            <button class="mood-emoji ${isSelected}" data-mood="${mood.id}" onclick="selectMood('${mood.id}')">${mood.emoji}</button>
        `;
    }).join('');
    
    moodOptionsDiv.innerHTML = moodButtons;
}

// Select mood in popover
function selectMood(mood) {
    selectedMood = mood;
    renderMoodOptions(); // Re-render to update selection
}

// Save checkin from popover
function saveCheckinFromPopover() {
    if (!selectedMood) {
        alert('Please select how you\'re feeling first');
        return;
    }

    const textarea = document.getElementById('checkinTextarea');
    const note = textarea.value.trim();

    const targetDate = currentCheckinScreen === 'calendar' ? selectedCalendarDate : new Date();

    // Prevent future date check-ins
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    if (targetDate > today) {
        alert('Cannot add check-ins for future dates');
        return;
    }

    const dateKey = getLocalDateKey(targetDate);
    
    // Initialize dailyEntries if it doesn't exist
    if (!workoutData.dailyEntries) {
        workoutData.dailyEntries = {};
    }
    
    // Save the entry
    workoutData.dailyEntries[dateKey] = {
        mood: selectedMood,
        note: note,
        date: targetDate.toISOString()
    };
    
    saveWorkoutData();
    closeCheckinPopover();
    
    // Refresh appropriate screen
    if (currentCheckinScreen === 'calendar') {
        renderCalendarCheckin();
        updateCalendarDisplay(); // Refresh calendar to show dot indicators
    } else {
        updateDisplay(); // Refresh the home screen
    }
}

// Delete checkin entry
function deleteCheckinEntry(dateKey) {
    checkinToDelete = dateKey;
    showDeleteCheckinConfirmationDialog();
}

// Delete checkin entry from popover
function deleteCheckinFromPopover(dateKey) {
    checkinToDelete = dateKey;
    showDeleteCheckinConfirmationDialog();
}

// Select soreness for home checkin
function selectHomeCheckinSoreness(soreness) {
    homeCheckinSoreness = soreness;

    // Update visual selection
    const sorenessOptions = document.querySelectorAll('.checkin-soreness-option');
    sorenessOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.soreness === soreness) {
            option.classList.add('selected');
        }
    });
}

// Save home checkin
function saveHomeCheckin() {
    const noteInput = document.getElementById('homeCheckinNoteInput');
    const noteText = noteInput.value.trim();
    const today = new Date();
    const dateKey = getLocalDateKey(today);

    // Require at least soreness selection or note text
    if (homeCheckinSoreness || noteText) {
        workoutData.dailyEntries[dateKey] = {
            note: noteText,
            soreness: homeCheckinSoreness,
            date: dateKey
        };
        saveWorkoutData();

        // Reset selected soreness
        homeCheckinSoreness = null;

        // Refresh the display
        renderDailyCheckin();

        // If calendar is currently visible, refresh it too
        const calendarScreen = document.getElementById('calendarScreen');
        if (!calendarScreen.classList.contains('hidden')) {
            updateCalendarDisplay();
        }
    }
}

// Toggle daily check-in collapse
function toggleDailyCheckin() {
    const content = document.querySelector('.checkin-content');
    const toggle = document.querySelector('.checkin-toggle');

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.textContent = '⌄';
    } else {
        content.classList.add('collapsed');
        toggle.textContent = '›';
    }
}

// Format date for home display
function formatDateForHomeDisplay(date) {
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'short'
    });
}

// Update app bar active state
function updateAppBarState(activeTab) {

    // Remove active class from all buttons
    document.getElementById('homeAppBarBtn').classList.remove('active');
    document.getElementById('calendarAppBarBtn').classList.remove('active');
    document.getElementById('statsAppBarBtn').classList.remove('active');

    // Add active class to the selected tab
    if (activeTab === 'home') {
        document.getElementById('homeAppBarBtn').classList.add('active');
    } else if (activeTab === 'calendar') {
        document.getElementById('calendarAppBarBtn').classList.add('active');
    } else if (activeTab === 'stats') {
        document.getElementById('statsAppBarBtn').classList.add('active');
    }
}

// Open stats screen
function openStats() {
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('calendarScreen').classList.add('hidden');
    document.getElementById('workoutScreen').classList.add('hidden');
    document.getElementById('statsScreen').classList.remove('hidden');
    populateExerciseDropdown();
    renderStats();
    updateAppBarState('stats');
}

// Populate exercise dropdown
function populateExerciseDropdown() {
    const dropdown = document.getElementById('exerciseDropdown');
    const allExercises = new Set();

    // Collect all exercises from all workout types
    Object.values(workoutExercises).forEach(workout => {
        workout.exercises.forEach(exercise => {
            // Only add main exercises (not warmup/cooldown)
            if (!exercise.type) {
                allExercises.add(exercise.name);
            }
        });
    });

    // Sort exercises alphabetically
    const sortedExercises = Array.from(allExercises).sort();

    // Clear existing options except "All Exercises"
    dropdown.innerHTML = '<option value="all">All Exercises</option>';

    // Add exercise options
    sortedExercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise;
        option.textContent = exercise;
        dropdown.appendChild(option);
    });
}

// Render stats content
function renderStats(selectedExercise = 'all') {
    const statsContent = document.getElementById('statsContent');

    if (selectedExercise === 'all') {
        // Show general workout stats
        const totalWorkouts = workoutData.totalWorkouts || 0;
        const totalCycles = workoutData.totalCycles || 0;
        const daysSinceLastWorkout = calculateDaysSinceLastWorkout();
        const currentStreak = calculateCurrentStreak();
        const mostActiveDay = calculateMostActiveDay();
        const favoriteWorkout = calculateFavoriteWorkout();
        const averageDuration = calculateAverageWorkoutDuration();
        const totalTimeInGym = calculateTotalTimeInGym();

        statsContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card wide">
                    <div class="stat-value">${mostActiveDay}</div>
                    <div class="stat-label">Most Active Day</div>
                </div>

                <div class="stat-card wide">
                    <div class="stat-value">${favoriteWorkout}</div>
                    <div class="stat-label">Favorite Workout</div>
                </div>

                <div class="stat-card wide">
                    <div class="stat-value">${averageDuration}</div>
                    <div class="stat-label">Average Workout Duration</div>
                </div>

                <div class="stat-card wide">
                    <div class="stat-value">${totalTimeInGym}</div>
                    <div class="stat-label">Total Time Spent in Gym</div>
                </div>
            </div>
        `;
    } else {
        // Show exercise-specific stats
        const exerciseStats = calculateExerciseStats(selectedExercise);

        statsContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${exerciseStats.totalSessions}</div>
                    <div class="stat-label">Total Sessions</div>
                </div>

                <div class="stat-card">
                    <div class="stat-value">${exerciseStats.averageSetsPerSession}</div>
                    <div class="stat-label">Average Sets Per Session</div>
                </div>

                <div class="stat-card">
                    <div class="stat-value">${exerciseStats.maxWeight}kg</div>
                    <div class="stat-label">Max Weight</div>
                </div>

                <div class="stat-card">
                    <div class="stat-value">${exerciseStats.startWeight}kg</div>
                    <div class="stat-label">Start Weight</div>
                </div>
            </div>
        `;
    }

    // Render the weight progression graph
    renderWeightProgressionGraph(selectedExercise);
}

// Get weight progression data for an exercise
function getWeightProgressionData(exerciseName) {
    const history = workoutData.history || [];
    const progressionData = [];

    history.forEach(workout => {
        if (workout.exercises && workout.exercises[exerciseName]) {
            const workoutDate = new Date(workout.date);
            const exerciseData = workout.exercises[exerciseName];

            // Get the average weight for this workout
            const weights = exerciseData.map(set => parseFloat(set.weight)).filter(w => w > 0);

            if (weights.length > 0) {
                const averageWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;

                progressionData.push({
                    date: workoutDate,
                    weight: Math.round(averageWeight * 4) / 4 // Round to nearest 0.25kg
                });
            }
        }
    });

    // Sort by date
    progressionData.sort((a, b) => a.date - b.date);
    return progressionData;
}

// Render weight progression graph
function renderWeightProgressionGraph(exerciseName) {
    const graphContainer = document.getElementById('weightProgressionGraph');
    const svg = document.getElementById('progressionSvg');
    const noDataMessage = document.getElementById('noDataMessage');
    const graphSubtitle = document.getElementById('graphSubtitle');

    if (exerciseName === 'all') {
        graphContainer.classList.add('hidden');
        return;
    }

    const progressionData = getWeightProgressionData(exerciseName);

    if (progressionData.length === 0) {
        graphContainer.classList.remove('hidden');
        svg.classList.add('hidden');
        noDataMessage.classList.remove('hidden');
        graphSubtitle.textContent = `No weight data available for ${exerciseName}`;
        return;
    }

    // Show graph and hide no data message
    graphContainer.classList.remove('hidden');
    svg.classList.remove('hidden');
    noDataMessage.classList.add('hidden');
    graphSubtitle.textContent = `${exerciseName} weight progression over time`;

    // Clear previous graph
    svg.innerHTML = '';

    // Graph dimensions and margins
    const margin = { top: 14, right: 30, bottom: 14, left: 30 };
    const containerWidth = svg.clientWidth || 350; // Use actual SVG width
    const width = containerWidth - margin.left - margin.right;
    const height = 140 - margin.top - margin.bottom;

    // Set SVG viewBox to ensure proper scaling
    svg.setAttribute('viewBox', `0 0 ${containerWidth} 140`);

    // Create scales
    const minWeight = Math.min(...progressionData.map(d => d.weight));
    const maxWeight = Math.max(...progressionData.map(d => d.weight));
    const weightPadding = (maxWeight - minWeight) * 0.1 || 5;

    const minDate = progressionData[0].date;
    const maxDate = progressionData[progressionData.length - 1].date;

    // Scale functions
    const xScale = (date) => {
        const ratio = (date - minDate) / (maxDate - minDate) || 0;
        return margin.left + ratio * width;
    };

    const yScale = (weight) => {
        const ratio = (weight - (minWeight - weightPadding)) / ((maxWeight + weightPadding) - (minWeight - weightPadding));
        return margin.top + height - ratio * height;
    };


    // Draw smooth line
    if (progressionData.length > 1) {
        const points = progressionData.map(d => ({
            x: xScale(d.date),
            y: yScale(d.weight)
        }));

        let pathData = `M ${points[0].x} ${points[0].y}`;

        if (points.length === 2) {
            // For just 2 points, use a straight line
            pathData += ` L ${points[1].x} ${points[1].y}`;
        } else {
            // For 3+ points, create smooth curves
            for (let i = 1; i < points.length; i++) {
                const current = points[i];
                const previous = points[i - 1];
                const next = points[i + 1];

                if (i === 1) {
                    // First curve - control point based on next point
                    const cp1x = previous.x + (current.x - previous.x) * 0.3;
                    const cp1y = previous.y;
                    const cp2x = current.x - (current.x - previous.x) * 0.3;
                    const cp2y = current.y;
                    pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${current.x} ${current.y}`;
                } else if (i === points.length - 1) {
                    // Last curve - control point based on previous point
                    const cp1x = previous.x + (current.x - previous.x) * 0.3;
                    const cp1y = previous.y;
                    const cp2x = current.x - (current.x - previous.x) * 0.3;
                    const cp2y = current.y;
                    pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${current.x} ${current.y}`;
                } else {
                    // Middle curves - smoother control points
                    const prevDx = current.x - previous.x;
                    const prevDy = current.y - previous.y;
                    const nextDx = next.x - current.x;
                    const nextDy = next.y - current.y;

                    const cp1x = previous.x + prevDx * 0.5;
                    const cp1y = previous.y + prevDy * 0.3;
                    const cp2x = current.x - nextDx * 0.3;
                    const cp2y = current.y - nextDy * 0.3;

                    pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${current.x} ${current.y}`;
                }
            }
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('class', 'chart-line');
        svg.appendChild(path);
    }

    // Draw points
    progressionData.forEach((d, i) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', xScale(d.date));
        circle.setAttribute('cy', yScale(d.weight));
        circle.setAttribute('class', 'chart-point');

        // Add tooltip
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${d.weight}kg (${d.date.toLocaleDateString()})`;
        circle.appendChild(title);

        svg.appendChild(circle);
    });

}

// Calculate exercise-specific stats
function calculateExerciseStats(exerciseName) {
    const history = workoutData.history || [];
    let totalSessions = 0;
    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;
    let maxWeight = 0;
    let startWeight = 0;
    let allWeights = [];

    // Sort history by date to get chronological order
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedHistory.forEach((workout, workoutIndex) => {
        if (workout.exercises && workout.exercises[exerciseName]) {
            totalSessions++;
            const exerciseData = workout.exercises[exerciseName];

            exerciseData.forEach(set => {
                if (set.weight && set.reps) {
                    totalSets++;
                    totalReps += set.reps;
                    const weight = parseFloat(set.weight);
                    const volume = weight * set.reps;
                    totalVolume += volume;
                    maxWeight = Math.max(maxWeight, weight);
                    allWeights.push(weight);

                    // Set start weight from the first workout's first set
                    if (workoutIndex === 0 && startWeight === 0) {
                        startWeight = weight;
                    }
                }
            });
        }
    });

    const averageWeight = allWeights.length > 0
        ? Math.round((allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length) * 10) / 10
        : 0;

    const averageSetsPerSession = totalSessions > 0
        ? Math.round((totalSets / totalSessions) * 10) / 10
        : 0;

    return {
        totalSessions,
        totalSets,
        averageSetsPerSession,
        totalReps,
        totalVolume: Math.round(totalVolume),
        maxWeight: maxWeight || 0,
        startWeight: startWeight || 0,
        averageWeight
    };
}

// Calculate current streak
function calculateCurrentStreak() {
    if (!workoutData.history || workoutData.history.length === 0) return 0;

    const sortedHistory = workoutData.history
        .map(w => new Date(w.date).toDateString())
        .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < sortedHistory.length; i++) {
        const workoutDate = new Date(sortedHistory[i]);
        const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
            streak++;
        } else if (daysDiff > streak + 1) {
            break;
        }
    }

    return streak;
}

// Calculate most active day of week
function calculateMostActiveDay() {
    if (!workoutData.history || workoutData.history.length === 0) return 'None';

    const dayCount = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    workoutData.history.forEach(workout => {
        const dayOfWeek = new Date(workout.date).getDay();
        const dayName = dayNames[dayOfWeek];
        dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });

    let mostActiveDay = 'None';
    let maxCount = 0;

    Object.entries(dayCount).forEach(([day, count]) => {
        if (count > maxCount) {
            maxCount = count;
            mostActiveDay = day;
        }
    });

    return mostActiveDay;
}

// Calculate favorite workout type
function calculateFavoriteWorkout() {
    if (!workoutData.history || workoutData.history.length === 0) return 'None';

    const workoutCount = {};

    workoutData.history.forEach(workout => {
        const workoutTitle = workoutExercises[workout.type]?.title || workout.type;
        workoutCount[workoutTitle] = (workoutCount[workoutTitle] || 0) + 1;
    });

    let favoriteWorkout = 'None';
    let maxCount = 0;

    Object.entries(workoutCount).forEach(([workout, count]) => {
        if (count > maxCount) {
            maxCount = count;
            favoriteWorkout = workout;
        }
    });

    return favoriteWorkout;
}

function calculateDaysSinceLastWorkout() {
    let daysSince = 0;
    if (workoutData.history && workoutData.history.length > 0) {
        const lastWorkoutDate = new Date(workoutData.history[workoutData.history.length - 1].date);
        const today = new Date();
        daysSince = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));
    }
    return daysSince;
}

function calculateAverageWorkoutDuration() {
    if (!workoutData.history || workoutData.history.length === 0) return '0m';

    let totalDurationMinutes = 0;
    let workoutsWithDuration = 0;

    workoutData.history.forEach(workout => {
        if (workout.duration && workout.duration > 0) {
            totalDurationMinutes += Math.round(workout.duration / 60000); // Convert ms to minutes
            workoutsWithDuration++;
        }
    });

    if (workoutsWithDuration === 0) return '0m';

    const averageMinutes = Math.round(totalDurationMinutes / workoutsWithDuration);
    return `${averageMinutes}m`;
}

function calculateTotalTimeInGym() {
    if (!workoutData.history || workoutData.history.length === 0) return '0h';

    let totalDurationMinutes = 0;

    workoutData.history.forEach(workout => {
        if (workout.duration && workout.duration > 0) {
            totalDurationMinutes += Math.round(workout.duration / 60000); // Convert ms to minutes
        }
    });

    if (totalDurationMinutes === 0) return '0h';

    const totalHours = Math.round(totalDurationMinutes / 60 * 10) / 10; // Round to 1 decimal place
    return `${totalHours}h`;
}

// ==== SIMPLIFIED CORE FUNCTIONS ====

// 1. Render workout cards on home screen
function renderWorkoutCards() {
    const workoutList = document.getElementById('workoutList');
    workoutList.innerHTML = '';

    const workoutTypes = Object.keys(workoutExercises);
    const hasCompletedToday = hasCompletedWorkoutToday();

    // Sort workouts: ongoing first, then available
    workoutTypes.sort((a, b) => {
        const aState = getWorkoutState(a);
        const bState = getWorkoutState(b);
        const stateOrder = { 'ongoing': 0, 'pending': 1 };
        return stateOrder[aState] - stateOrder[bState];
    });

    workoutTypes.forEach(type => {
        const workout = workoutExercises[type];
        const workoutState = getWorkoutState(type);

        let status, statusClass;
        switch (workoutState) {
            case 'ongoing':
                status = 'Ongoing';
                statusClass = 'status-ongoing';
                break;
            default: // 'pending' or any other state
                if (hasCompletedToday) {
                    status = '';
                    statusClass = '';
                } else {
                    status = '';
                    statusClass = '';
                }
        }

        const workoutCard = document.createElement('div');
        workoutCard.className = `workout-card ${workoutState === 'ongoing' ? 'ongoing' : ''}`;
        if (workoutState !== 'ongoing') {
            workoutCard.style.background = workoutColors[type];
        }

        // Add timer display for ongoing workouts
        let timerHtml = '';
        if (workoutState === 'ongoing' && workoutData.pendingWorkouts[type] && workoutData.pendingWorkouts[type].startTime) {
            const elapsedTime = getFormattedElapsedTime(workoutData.pendingWorkouts[type].startTime);
            timerHtml = `<div class="workout-timer" data-workout-type="${type}">⏱️ ${elapsedTime}</div>`;
        }

        // Determine description text based on workout state
        let descriptionText = workout.description;

        // For ongoing workouts, show timer above title
        let timerElement = '';
        let statusElement = '';
        
        if (workoutState === 'ongoing' && workoutData.pendingWorkouts[type] && workoutData.pendingWorkouts[type].startTime) {
            const elapsedTime = getFormattedElapsedTime(workoutData.pendingWorkouts[type].startTime);
            timerElement = `<div class="workout-timer" data-workout-type="${type}">⏱️ ${elapsedTime}</div>`;
        } else if (status) {
            statusElement = `<span class="workout-status ${statusClass}">${status}</span>`;
        }

        workoutCard.innerHTML = `
            ${timerElement}
            <div class="workout-card-header">
                <h3 class="workout-title">${workout.title}</h3>
                ${statusElement}
            </div>
            <p class="workout-description">${descriptionText}</p>
        `;

        // Add click event to card
        workoutCard.addEventListener('click', () => openWorkout(type));

        workoutList.appendChild(workoutCard);
    });

    // Show completion message above cards if workout completed today
    if (hasCompletedToday) {
        // Get today's workout feedback
        const today = new Date();
        const todayDateString = today.toDateString();
        const todayWorkout = workoutData.history.find(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.toDateString() === todayDateString;
        });

        const feedbackDisplay = todayWorkout && todayWorkout.feedback ? getFeedbackDisplay(todayWorkout.feedback) : '';

        const feedbackText = todayWorkout && todayWorkout.feedback ? ` and you felt it was ${todayWorkout.feedback}` : '';

        // Use the emoji selected by the user, or default to 😐
        const selectedEmoji = todayWorkout && todayWorkout.emoji ? todayWorkout.emoji : '😐';

        const messageDiv = document.createElement('div');
        messageDiv.className = 'daily-completion-message';
        messageDiv.innerHTML = `
            <div class="completion-icon">
                <img src="images/good-job.png" />
                <div class="completion-emoji">${selectedEmoji}</div>
            </div>
            <div class="completion-content">
                <h3>Great job today!</h3>
                <p>You've completed your workout for today${feedbackText}.</p>
            </div>
        `;
        workoutList.insertBefore(messageDiv, workoutList.firstChild);
    }

    // Reinitialize Lucide icons for the newly added content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// 2. Open workout screen
function openWorkout(type, fromScreen = 'home') {
    currentWorkout = type;
    previousScreen = fromScreen;
    const workoutState = getWorkoutState(type);
    
    // Load or initialize exercise data based on workout state
    if (workoutState === 'completed' && fromScreen === 'calendar') {
        // Load completed workout data from history for calendar view
        const completedWorkout = workoutData.history
            .filter(h => h.type === type)
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        if (completedWorkout) {
            // Initialize exercise data with completed workout data
            exerciseData = {};
            workoutExercises[type].exercises.forEach(exercise => {
                if (completedWorkout.exercises[exercise.name]) {
                    // Load saved exercise data
                    exerciseData[exercise.name] = {
                        sets: completedWorkout.exercises[exercise.name],
                        completed: true
                    };
                } else {
                    // Initialize empty for exercises not in completed workout
                    exerciseData[exercise.name] = {
                        sets: [],
                        completed: false
                    };
                    // Add default sets for warmup/cooldown exercises
                    if (exercise.type === 'warmup' || exercise.type === 'cooldown') {
                        for (let i = 0; i < exercise.sets; i++) {
                            exerciseData[exercise.name].sets.push({
                                weight: '',
                                reps: workoutData.lastReps[`${type}-${exercise.name}`] || 12
                            });
                        }
                    }
                }
            });
            workoutStartTime = new Date(completedWorkout.date);
        } else {
            // Fallback if no completed workout found
            initializeFreshExerciseData(type);
        }
    } else if (workoutData.pendingWorkouts[type]) {
        // Resume from saved progress
        exerciseData = JSON.parse(JSON.stringify(workoutData.pendingWorkouts[type].exerciseData));
        workoutStartTime = workoutData.pendingWorkouts[type].startTime ? new Date(workoutData.pendingWorkouts[type].startTime) : null;
    } else {
        // Initialize fresh exercise data
        initializeFreshExerciseData(type);
    }
    
    // Show workout screen with slide-in animation
    const workoutScreen = document.getElementById('workoutScreen');
    const homeScreen = document.getElementById('homeScreen');
    const calendarScreen = document.getElementById('calendarScreen');
    
    // Hide other screens
    homeScreen.classList.add('hidden');
    calendarScreen.classList.add('hidden');
    
    // Show workout screen initially positioned off-screen
    workoutScreen.classList.remove('hidden');
    workoutScreen.classList.remove('slide-in');
    
    // Force reflow to ensure the screen is positioned off-screen
    workoutScreen.offsetHeight;
    
    // Trigger slide-in animation
    requestAnimationFrame(() => {
        workoutScreen.classList.add('slide-in');
    });
    
    document.getElementById('workoutTitle').textContent = workoutExercises[currentWorkout].title;
    
    // Show appropriate button based on workout state
    const startBtn = document.getElementById('startWorkoutBtn');
    const completeBtn = document.getElementById('completeWorkoutBtn');
    const deleteBtn = document.getElementById('deleteWorkoutBtn');
    const isOtherWorkoutOngoing = hasOngoingWorkout() && getOngoingWorkoutType() !== currentWorkout;
    
    // Hide all buttons first
    startBtn.classList.add('hidden');
    completeBtn.classList.add('hidden');
    deleteBtn.classList.add('hidden');
    
    switch (workoutState) {
        case 'pending':
            if (isOtherWorkoutOngoing) {
                startBtn.classList.remove('hidden');
                startBtn.disabled = true;
                startBtn.textContent = `Complete ${workoutExercises[getOngoingWorkoutType()].title} First`;
            } else if (hasCompletedWorkoutToday()) {
                startBtn.classList.remove('hidden');
                startBtn.disabled = true;
                startBtn.textContent = 'Workout Already Completed Today';
            } else {
                startBtn.classList.remove('hidden');
                startBtn.disabled = false;
                startBtn.textContent = 'Start Workout';
            }
            // Reset timer display for pending workouts
            const timerElement = document.getElementById('workoutTimer');
            if (timerElement) {
                timerElement.textContent = '00:00:00';
            }
            break;
        case 'ongoing':
            completeBtn.classList.remove('hidden');
            if (workoutStartTime) {
                startWorkoutTimer();
            }
            break;
        case 'completed':
            // Only show delete button when opened from calendar
            if (fromScreen === 'calendar') {
                deleteBtn.classList.remove('hidden');
                // Show completed workout duration in timer
                if (workoutStartTime) {
                    const completedWorkout = workoutData.history
                        .filter(h => h.type === type)
                        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                    if (completedWorkout && completedWorkout.duration) {
                        displayCompletedWorkoutDuration(completedWorkout.duration);
                    }
                }
            } else {
                // If not from calendar, treat as pending
                startBtn.classList.remove('hidden');
                startBtn.disabled = false;
                startBtn.textContent = 'Start Workout';
                const timerElement = document.getElementById('workoutTimer');
                if (timerElement) {
                    timerElement.textContent = '00:00:00';
                }
            }
            break;
    }
    
    updateExerciseList();
}

// Helper function to initialize fresh exercise data
function initializeFreshExerciseData(type) {
    exerciseData = {};
    workoutExercises[type].exercises.forEach(exercise => {
        exerciseData[exercise.name] = {
            sets: [],
            completed: false
        };
        
        const exerciseKey = `${type}-${exercise.name}`;
        
        // For main exercises (no type), use detailed tracking data if available
        if (!exercise.type && workoutData.lastExerciseData[exerciseKey] && workoutData.lastExerciseData[exerciseKey].sets.length > 0) {
            // Use the detailed data from last time for main exercises (including weights)
            const lastData = workoutData.lastExerciseData[exerciseKey];
            lastData.sets.forEach(lastSet => {
                exerciseData[exercise.name].sets.push({
                    weight: '', // Start with empty weight, but store last weight as placeholder
                    reps: lastSet.reps || 12,
                    lastWeight: lastSet.weight || '' // Store last weight for reference
                });
            });
        } else {
            // For warmup/cooldown exercises or when no detailed data exists, use basic logic
            const numSets = workoutData.lastSets[exerciseKey] || exercise.sets || (exercise.type ? exercise.sets : 3);
            const lastReps = workoutData.lastReps[exerciseKey] || 12;
            const lastWeight = workoutData.lastWeights[exerciseKey];
            
            // Add sets based on last recorded data or defaults
            for (let i = 0; i < numSets; i++) {
                const setData = {
                    weight: '',
                    reps: lastReps
                };
                // Add lastWeight for main exercises as a reference
                if (!exercise.type && lastWeight) {
                    setData.lastWeight = lastWeight;
                }
                exerciseData[exercise.name].sets.push(setData);
            }
        }
    });
    workoutStartTime = null;
}

// Display completed workout duration in timer
function displayCompletedWorkoutDuration(duration) {
    const timerElement = document.getElementById('workoutTimer');
    if (timerElement && duration) {
        const totalMinutes = Math.floor(duration / (1000 * 60));
        const seconds = Math.floor((duration % (1000 * 60)) / 1000);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);
        
        if (hours > 0) {
            timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// 3. Start workout (change state to ongoing and start timer)
function startWorkout() {
    if (!currentWorkout) return;
    
    // Create start time and start timer
    workoutStartTime = new Date();
    startWorkoutTimer();
    
    // Set workout state to ongoing
    setWorkoutState(currentWorkout, 'ongoing');
    
    // Save to pending workouts immediately
    workoutData.pendingWorkouts[currentWorkout] = {
        exerciseData: JSON.parse(JSON.stringify(exerciseData)),
        startTime: workoutStartTime.toISOString()
    };
    saveWorkoutData();
    
    // Update UI
    document.getElementById('startWorkoutBtn').classList.add('hidden');
    document.getElementById('completeWorkoutBtn').classList.remove('hidden');
    
}

// 4. Save exercise data (when weights are entered)
function saveExerciseData(exerciseName, setIndex, field, value) {
    if (!exerciseData[exerciseName]) return;
    
    exerciseData[exerciseName].sets[setIndex][field] = value;
    
    // Save to pending workouts
    if (currentWorkout && workoutData.workoutStates[currentWorkout] === 'ongoing') {
        workoutData.pendingWorkouts[currentWorkout] = {
            exerciseData: JSON.parse(JSON.stringify(exerciseData)),
            startTime: workoutStartTime?.toISOString()
        };
        saveWorkoutData();
    }
    
}

// 5. Delete exercise data (when sets with weights are removed)
function deleteExerciseData(exerciseName, setIndex) {
    if (!exerciseData[exerciseName]) return;
    
    exerciseData[exerciseName].sets.splice(setIndex, 1);
    
    // Update UI
    if (currentSheetExercise === exerciseName) {
        updateSheetSets();
    } else {
        updateExerciseList();
    }
    
    // Save to pending workouts
    if (currentWorkout && workoutData.workoutStates[currentWorkout] === 'ongoing') {
        workoutData.pendingWorkouts[currentWorkout] = {
            exerciseData: JSON.parse(JSON.stringify(exerciseData)),
            startTime: workoutStartTime?.toISOString()
        };
        saveWorkoutData();
    }
    
}

// 6. Complete exercise (mark exercise as done)
function completeExercise(exerciseName) {
    if (!exerciseData[exerciseName]) return;
    
    exerciseData[exerciseName].completed = true;
    
    // Update UI
    updateExerciseList();
    
    // Save to pending workouts
    if (currentWorkout && workoutData.workoutStates[currentWorkout] === 'ongoing') {
        workoutData.pendingWorkouts[currentWorkout] = {
            exerciseData: JSON.parse(JSON.stringify(exerciseData)),
            startTime: workoutStartTime?.toISOString()
        };
        saveWorkoutData();
    }
    
}

// 7. Complete workout (show confirmation dialog first)
function completeWorkout() {
    if (!currentWorkout) return;
    
    // Show confirmation dialog
    showConfirmationDialog();
}

// Show confirmation dialog
function showConfirmationDialog() {
    const dialog = document.getElementById('confirmationDialog');
    const dialogContent = dialog.querySelector('.bottom-sheet-content');
    
    dialog.classList.remove('hidden');
    
    // Force reflow to ensure the dialog is visible before animation
    dialog.offsetHeight;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
        dialogContent.classList.add('show');
    });
}

// Close confirmation dialog
function closeConfirmationDialog() {
    const dialog = document.getElementById('confirmationDialog');
    const dialogContent = dialog.querySelector('.bottom-sheet-content');
    
    // Start slide down animation
    dialogContent.classList.remove('show');
    
    // Hide the dialog after animation completes
    setTimeout(() => {
        dialog.classList.add('hidden');
    }, 300); // Match the CSS transition duration
}

// Confirm and actually complete the workout
function confirmCompleteWorkout() {
    if (!currentWorkout) return;
    
    // Close confirmation dialog
    closeConfirmationDialog();
    
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    const workoutDuration = workoutStartTime ? new Date() - workoutStartTime : 0;
    
    // Save workout data and set state to completed
    workoutData.totalWorkouts++;
    setWorkoutState(currentWorkout, 'completed');

    // Reset completed workout to pending immediately so it's available again
    setWorkoutState(currentWorkout, 'pending');
    
    // Update last weights, reps, and sets for completed exercises
    Object.entries(exerciseData).forEach(([exerciseName, data]) => {
        if (data.completed) {
            const key = `${currentWorkout}-${exerciseName}`;
            const exercise = workoutExercises[currentWorkout].exercises.find(ex => ex.name === exerciseName);
            
            // Only track detailed data for main exercises (not warmup/cooldown)
            if (!exercise?.type && data.sets.some(set => set.weight && set.weight > 0)) {
                const setsWithWeights = data.sets.filter(set => set.weight && set.weight > 0);
                const lastSetWithWeight = setsWithWeights[setsWithWeights.length - 1];
                
                if (lastSetWithWeight) {
                    workoutData.lastWeights[key] = lastSetWithWeight.weight;
                    workoutData.lastReps[key] = lastSetWithWeight.reps;
                }
                // Only count sets that have weights
                workoutData.lastSets[key] = setsWithWeights.length;
                
                // Store only sets with weights for main exercises
                workoutData.lastExerciseData[key] = {
                    sets: setsWithWeights.map(set => ({
                        weight: set.weight,
                        reps: set.reps
                    })),
                    completed: data.completed
                };
            } else if (exercise?.type) {
                // For warmup/cooldown exercises, just track completion and basic reps if they have any
                workoutData.lastSets[key] = data.sets.length;
                if (data.sets.length > 0 && data.sets[0].reps) {
                    workoutData.lastReps[key] = data.sets[0].reps;
                }
            }
        }
    });
    
    // Add to history
    workoutData.history.push({
        date: new Date().toISOString(),
        type: currentWorkout,
        duration: workoutDuration,
        exercises: Object.fromEntries(
            Object.entries(exerciseData)
                .filter(([_, data]) => data.completed && data.sets.some(set => set.weight && set.weight > 0))
                .map(([name, data]) => [name, data.sets.filter(set => set.weight && set.weight > 0)])
        ),
        feedback: null // Will be updated when user provides feedback
    });
    
    saveWorkoutData();
    
    // Remove from pending workouts
    if (workoutData.pendingWorkouts[currentWorkout]) {
        delete workoutData.pendingWorkouts[currentWorkout];
        saveWorkoutData();
    }
    
    // Show celebration screen
    showCelebration(workoutDuration);
}

// 8. Open calendar screen
function openCalendar() {
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('workoutScreen').classList.add('hidden');
    document.getElementById('statsScreen').classList.add('hidden');
    document.getElementById('calendarScreen').classList.remove('hidden');

    currentCalendarDate = new Date();
    updateCalendarDisplay();
    renderDailyCheckin(); // Render daily check-in on calendar screen
    updateAppBarState('calendar');
}

// Update app name randomly
function updateAppName() {
    const randomIndex = Math.floor(Math.random() * appNames.length);
    document.querySelector('.header h1').textContent = appNames[randomIndex];
}


// Update stats display
function updateStats() {
    const daysSinceElement = document.getElementById('daysSinceLastWorkout');
    const totalWorkoutsElement = document.getElementById('totalWorkouts');
    const totalCyclesElement = document.getElementById('totalCycles');
    
    // Calculate days since last workout
    let daysSince = 0;
    if (workoutData.history.length > 0) {
        const lastWorkoutDate = new Date(workoutData.history[workoutData.history.length - 1].date);
        const today = new Date();
        daysSince = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));
    }
    
    daysSinceElement.textContent = daysSince;
    totalWorkoutsElement.textContent = workoutData.totalWorkouts;
}


// Get workout state
function getWorkoutState(type) {
    // Check stored state, default to 'pending'
    return workoutData.workoutStates[type] || 'pending';
}

// Set workout state
function setWorkoutState(type, state) {
    workoutData.workoutStates[type] = state;
    saveWorkoutData();
}



// Check if any workout was completed today
function hasCompletedWorkoutToday() {
    const today = new Date();
    const todayDateString = today.toDateString();

    return workoutData.history.some(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate.toDateString() === todayDateString;
    });
}

// Check if any workout is currently ongoing
function hasOngoingWorkout() {
    return Object.keys(workoutData.workoutStates).some(type =>
        workoutData.workoutStates[type] === 'ongoing'
    );
}

// Get the ongoing workout type (if any)
function getOngoingWorkoutType() {
    return Object.keys(workoutData.workoutStates).find(type => 
        workoutData.workoutStates[type] === 'ongoing'
    );
}


// Start workout timer
function startWorkoutTimer() {
    if (!workoutStartTime) {
        workoutStartTime = new Date();
    }
    // Only start timer if not already running
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 100);
    }
}

// Update timer display
function updateTimer() {
    if (!workoutStartTime) return;
    
    const timerElement = document.getElementById('workoutTimer');
    if (timerElement) {
        // Only show running timer if current workout is the ongoing one
        const ongoingWorkoutType = getOngoingWorkoutType();
        if (currentWorkout === ongoingWorkoutType) {
            const timeStr = getFormattedElapsedTime(workoutStartTime);
            timerElement.textContent = timeStr;
        } else {
            timerElement.textContent = '00:00.0';
        }
    }
    
    // Also update home screen workout card timers
    updateHomeScreenTimers();
}

// Update timers on home screen workout cards
function updateHomeScreenTimers() {
    const homeScreen = document.getElementById('homeScreen');
    if (homeScreen && !homeScreen.classList.contains('hidden')) {
        // Update specific timer elements by workout type
        Object.keys(workoutData.pendingWorkouts).forEach(type => {
            if (workoutData.pendingWorkouts[type].startTime) {
                const elapsedTime = getFormattedElapsedTime(workoutData.pendingWorkouts[type].startTime);
                const timerElement = document.querySelector(`.workout-timer[data-workout-type="${type}"]`);
                if (timerElement) {
                    timerElement.innerHTML = `⏱️ ${elapsedTime}`;
                }
            }
        });
    }
}

// Get formatted elapsed time for any start time
function getFormattedElapsedTime(startTime) {
    if (!startTime) return '00:00:00';
    
    const elapsed = new Date() - new Date(startTime);
    const totalSeconds = Math.floor(elapsed / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Format workout completion date/time
function formatWorkoutDateTime(date) {
    const completionDate = new Date(date);
    
    // Round to nearest 15-minute mark
    const roundedDate = new Date(completionDate);
    const minutes = roundedDate.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    roundedDate.setMinutes(roundedMinutes, 0, 0);
    
    const timeStr = roundedDate.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const dayStr = completionDate.toLocaleDateString('en-GB', { 
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }).replace(',', '');
    
    return `${timeStr}, ${dayStr}`;
}

// Format workout duration in milliseconds to readable format
function formatWorkoutDuration(durationMs) {
    if (!durationMs || durationMs <= 0) return '00:00';
    
    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Update exercise list in workout screen
function updateExerciseList() {
    const exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = '';

    // Hide feedback section by default
    const feedbackSection = document.getElementById('workoutFeedbackSection');
    if (feedbackSection) {
        feedbackSection.classList.add('hidden');
    }

    const exercises = workoutExercises[currentWorkout].exercises;
    
    // Separate exercises by type
    const warmupExercises = exercises.filter(ex => ex.type === 'warmup');
    const cooldownExercises = exercises.filter(ex => ex.type === 'cooldown');
    const mainExercises = exercises.filter(ex => !ex.type).sort((a, b) => {
        const aCompleted = exerciseData[a.name].completed;
        const bCompleted = exerciseData[b.name].completed;
        return aCompleted - bCompleted;
    });
    
    // Add warmup exercises
    if (warmupExercises.length > 0) {
        const warmupContainer = document.createElement('div');
        warmupContainer.className = 'section-container';
        
        warmupContainer.innerHTML = `
            <h3 class="section-container-title">🔥 Warm Up</h3>
            <div class="section-container-exercises">
                ${warmupExercises.map(exercise => `
                    <div class="exercise-item-simple warmup">
                        <div class="exercise-name">${exercise.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        exerciseList.appendChild(warmupContainer);
    }
    
    // Add main exercises
    mainExercises.forEach(exercise => {
        const exerciseItem = document.createElement('div');
        const isCompleted = exerciseData[exercise.name].completed;
        const hasWeight = exerciseData[exercise.name].sets.some(set => set.weight && set.weight > 0);
        const isInProgress = !isCompleted && hasWeight;
        
        let className = 'exercise-item';
        if (isCompleted) className += ' completed';
        else if (isInProgress) className += ' in-progress';

        exerciseItem.className = className;

        const info = exerciseInfo[exercise.name];

        exerciseItem.innerHTML = `
            ${isCompleted ? '<i class="exercise-check-icon" data-lucide="check" style="color: #46725e; width: 16px; height: 16px;"></i>' : ''}
            <div class="exercise-name">${exercise.name}</div>
            ${isInProgress ? '<div class="exercise-status-dot"></div>' : ''}
            <div class="exercise-arrow">›</div>
        `;
        
        // Add click event listener
        exerciseItem.addEventListener('click', () => openExerciseSheet(exercise.name));
        
        exerciseList.appendChild(exerciseItem);
        
        // Reinitialize Lucide icons for the newly added exercise item
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
    
    // Add cooldown exercises
    if (cooldownExercises.length > 0) {
        const cooldownContainer = document.createElement('div');
        cooldownContainer.className = 'section-container';
        
        cooldownContainer.innerHTML = `
            <h3 class="section-container-title">❄️ Cool Down</h3>
            <div class="section-container-exercises">
                ${cooldownExercises.map(exercise => `
                    <div class="exercise-item-simple cooldown">
                        <div class="exercise-name">${exercise.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        exerciseList.appendChild(cooldownContainer);
    }
    
    checkWorkoutCompletion();
}

// Render sets for an exercise
function renderSets(exerciseName) {
    const sets = exerciseData[exerciseName].sets;
    const fallbackWeight = workoutData.lastWeights[`${currentWorkout}-${exerciseName}`];

    // Check if workout has been started
    const workoutState = getWorkoutState(currentWorkout);
    const isWorkoutStarted = workoutState === 'ongoing' || workoutState === 'completed';

    // Check exercise type
    const exerciseType = exerciseInfo[exerciseName]?.exerciseType || 'weighted';
    const isWeighted = exerciseType === 'weighted';

    return sets.map((set, index) => {
        // Use individual set's last weight if available, otherwise use fallback
        const placeholderWeight = set.lastWeight || fallbackWeight;
        const placeholder = placeholderWeight ? placeholderWeight + 'kg' : 'KG';

        // Determine if controls should be disabled
        const disabled = isWorkoutStarted ? '' : 'disabled';
        const removeButtonStyle = isWorkoutStarted ? '' : 'style="opacity: 0.5; cursor: not-allowed;"';
        const removeButtonClick = isWorkoutStarted ? `onclick="removeSet('${exerciseName}', ${index})"` : '';
        const weightChange = isWorkoutStarted ? `onchange="updateWeight('${exerciseName}', ${index}, this.value)"` : '';
        const repsChange = isWorkoutStarted ? `onchange="updateReps('${exerciseName}', ${index}, this.value)"` : '';

        // Render weight input only for weighted exercises
        const weightInput = isWeighted ? `
            <input type="number"
                   class="weight-input"
                   placeholder="${placeholder}"
                   value="${set.weight && set.weight !== '' ? set.weight : ''}"
                   ${weightChange}
                   min="0"
                   step="0.25"
                   inputmode="decimal"
                   ${disabled}>
        ` : '';

        return `
            <div class="set-item ${isWeighted ? 'weighted' : 'bodyweight'}" data-exercise="${exerciseName}" data-index="${index}">
                ${weightInput}
                <div class="reps-container">
                    <button class="btn-reps"
                            ${disabled}
                            onclick="adjustReps('${exerciseName}', ${index}, -1)">-</button>
                    <div class="reps-display">${set.reps}</div>
                    <button class="btn-reps"
                            ${disabled}
                            onclick="adjustReps('${exerciseName}', ${index}, 1)">+</button>
                </div>
                <button class="delete-btn" ${removeButtonClick} ${removeButtonStyle}>
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
    }).join('');
}

// Add a set to an exercise
function addSet(exerciseName) {
    const exerciseType = exerciseInfo[exerciseName]?.exerciseType || 'weighted';
    const isWeighted = exerciseType === 'weighted';

    const newSet = {
        reps: workoutData.lastReps[`${currentWorkout}-${exerciseName}`] || 12
    };

    // Only add weight property for weighted exercises
    if (isWeighted) {
        newSet.weight = '';
    }

    exerciseData[exerciseName].sets.push(newSet);
    updatePendingWorkout();
    if (currentSheetExercise === exerciseName) {
        updateSheetSets();
    } else {
        updateExerciseList();
    }
}

// Remove a set from an exercise
function removeSet(exerciseName, setIndex) {
    exerciseData[exerciseName].sets.splice(setIndex, 1);
    updatePendingWorkout();
    if (currentSheetExercise === exerciseName) {
        updateSheetSets();
    } else {
        updateExerciseList();
    }
}

// Update weight for a set
function updateWeight(exerciseName, setIndex, weight) {
    // Only update weight for weighted exercises
    const exerciseType = exerciseInfo[exerciseName]?.exerciseType || 'weighted';
    if (exerciseType === 'weighted') {
        exerciseData[exerciseName].sets[setIndex].weight = weight;
        updatePendingWorkout();
    }
}

// Update reps for a set
function updateReps(exerciseName, setIndex, repsValue) {
    const newReps = parseInt(repsValue) || 12;
    exerciseData[exerciseName].sets[setIndex].reps = newReps;
    updatePendingWorkout();
    if (currentSheetExercise === exerciseName) {
        updateSheetSets();
    } else {
        updateExerciseList();
    }
}

// Adjust reps with +/- buttons
function adjustReps(exerciseName, setIndex, change) {
    const currentReps = exerciseData[exerciseName].sets[setIndex].reps;
    const newReps = Math.max(1, currentReps + change); // Minimum of 1 rep
    exerciseData[exerciseName].sets[setIndex].reps = newReps;
    updatePendingWorkout();
    if (currentSheetExercise === exerciseName) {
        updateSheetSets();
    } else {
        updateExerciseList();
    }
}

// Mark exercise as complete
function markExerciseComplete(exerciseName) {
    exerciseData[exerciseName].completed = true;
    updatePendingWorkout();
    updateExerciseList();
}

// Check if workout can be completed (not needed anymore with state system)
function checkWorkoutCompletion() {
    // Complete button visibility is now handled by workout state
    // This function can be removed or kept for backwards compatibility
}


// Go back to previous screen (replaces cancelWorkout)
function goBackHome() {
    // Update pending workout data BEFORE clearing references
    if (currentWorkout) {
        updatePendingWorkout();
    }
    
    // Clear current references but don't stop timer
    currentWorkout = null;
    exerciseData = {};
    
    // Navigate back to the screen that opened the workout
    if (previousScreen === 'calendar') {
        openCalendar();
        // Refresh the workout details for the current date if available
        const selectedDay = document.querySelector('.calendar-day.selected');
        if (selectedDay) {
            const dayNumber = parseInt(selectedDay.textContent);
            const selectedDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), dayNumber);
            showWorkoutDetails(selectedDate);
        }
    } else {
        showHomeScreen();
    }
}

// Show home screen
function showHomeScreen() {
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('workoutScreen').classList.add('hidden');
    document.getElementById('calendarScreen').classList.add('hidden');
    document.getElementById('statsScreen').classList.add('hidden');
    updateDisplay();
    updateAppBarState('home');
}

let currentSheetExercise = null;

// Open exercise bottom sheet
function openExerciseSheet(exerciseName) {
    currentSheetExercise = exerciseName;
    document.getElementById('sheetExerciseTitle').textContent = exerciseName;

    // Show play button if video is available
    showPlayButton(exerciseName);

    // Check if workout has been started
    const workoutState = getWorkoutState(currentWorkout);
    const isWorkoutStarted = workoutState === 'ongoing' || workoutState === 'completed';

    updateSheetSets();

    // Set up dynamic event listeners and disable state based on workout status
    const addSetBtn = document.getElementById('sheetAddSetBtnHeader');
    const doneBtn = document.getElementById('sheetDoneBtn');

    if (isWorkoutStarted) {
        // Enable buttons for started workouts
        addSetBtn.disabled = false;
        addSetBtn.onclick = () => addSet(exerciseName);
        
        doneBtn.disabled = false;
        doneBtn.onclick = () => {
            // Check if exercise should be marked as completed or reverted to pending
            const exerciseType = exerciseInfo[exerciseName]?.exerciseType || 'weighted';
            const isWeighted = exerciseType === 'weighted';

            let hasValidSets;
            if (isWeighted) {
                // For weighted exercises, check if there are sets with weights
                hasValidSets = exerciseData[exerciseName].sets.some(set =>
                    set.weight && parseFloat(set.weight) > 0
                );
            } else {
                // For bodyweight exercises, just check if there are sets with valid reps
                hasValidSets = exerciseData[exerciseName].sets.some(set =>
                    set.reps && parseInt(set.reps) > 0
                );
            }

            if (hasValidSets) {
                // Mark as completed if there are valid sets
                markExerciseComplete(exerciseName);
            } else {
                // Mark as not completed if no valid sets
                exerciseData[exerciseName].completed = false;
                updatePendingWorkout();
            }
            closeExerciseSheet();
        };
    } else {
        // Disable buttons for pending workouts
        addSetBtn.disabled = true;
        addSetBtn.onclick = null;
        
        doneBtn.disabled = true;
        doneBtn.onclick = null;
    }
    
    // Always show buttons but they may be disabled
    addSetBtn.classList.remove('hidden');
    doneBtn.classList.remove('hidden');
    
    // Show bottom sheet with animation
    const bottomSheet = document.getElementById('exerciseBottomSheet');
    const bottomSheetContent = bottomSheet.querySelector('.bottom-sheet-content');
    
    bottomSheet.classList.remove('hidden');
    
    // Force reflow to ensure the sheet is visible before animation
    bottomSheet.offsetHeight;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
        bottomSheetContent.classList.add('show');
    });
}

// Show play button if video is available
function showPlayButton(exerciseName) {
    const playBtn = document.getElementById('playVideoBtn');
    const exerciseData = exerciseInfo[exerciseName];

    if (exerciseData && exerciseData.video) {
        playBtn.onclick = () => openYouTubeVideo(exerciseData.video);
        playBtn.classList.remove('hidden');

        // Initialize Lucide icons for the play button
        setTimeout(() => {
            lucide.createIcons();
        }, 100);
    } else {
        playBtn.classList.add('hidden');
        playBtn.onclick = null;
    }
}

// Extract video ID from YouTube URL
function extractVideoId(url) {
    if (!url) return '';

    let videoId = '';

    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
    }

    return videoId;
}

// Open YouTube video in YouTube app or browser
function openYouTubeVideo(url) {
    if (!url) return;

    // Create a temporary anchor element with security attributes
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    // Trigger the click programmatically
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Close exercise bottom sheet
function closeExerciseSheet() {
    const bottomSheet = document.getElementById('exerciseBottomSheet');
    const bottomSheetContent = bottomSheet.querySelector('.bottom-sheet-content');
    
    // Start slide down animation
    bottomSheetContent.classList.remove('show');
    
    // Hide the sheet after animation completes
    setTimeout(() => {
        bottomSheet.classList.add('hidden');
        currentSheetExercise = null;

        // Hide play button
        const playBtn = document.getElementById('playVideoBtn');
        playBtn.classList.add('hidden');
        playBtn.onclick = null;

        updateExerciseList();
    }, 300); // Match the CSS transition duration
}

// Update sets in bottom sheet
function updateSheetSets() {
    if (!currentSheetExercise) return;
    
    const container = document.getElementById('sheetSetsContainer');
    container.innerHTML = renderSets(currentSheetExercise);
    
    // Reinitialize Lucide icons for the newly added content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}


// Show celebration
function showCelebration(duration) {
    document.getElementById('celebrationOverlay').classList.remove('hidden');

    // Display the workout duration
    if (duration && duration > 0) {
        const durationElement = document.getElementById('celebrationDuration');
        const formattedDuration = formatWorkoutDuration(duration);
        durationElement.textContent = `in ${formattedDuration}`;
    }

    // Generate emoji options using daily checkin style
    const celebrationMoodOptions = document.getElementById('celebrationMoodOptions');
    const moods = ['amazing', 'good', 'okay', 'tough', 'terrible'];
    const moodEmojis = {
        'amazing': '🔥',
        'good': '😊',
        'okay': '😐',
        'tough': '😮‍💨',
        'terrible': '😞'
    };

    celebrationMoodOptions.innerHTML = moods.map(mood =>
        `<button class="mood-emoji" data-mood="${mood}" onclick="recordWorkoutFeedback('${mood}')">${moodEmojis[mood]}</button>`
    ).join('');
}

// Record workout feedback
function recordWorkoutFeedback(feeling) {
    // Find the most recent workout in history and update its feedback
    if (workoutData.history.length > 0) {
        const lastWorkout = workoutData.history[workoutData.history.length - 1];
        lastWorkout.feedback = feeling;

        // Store the emoji based on the feeling
        const emojiMap = {
            'amazing': '🔥',
            'good': '😊',
            'okay': '😐',
            'tough': '😮‍💨',
            'terrible': '😞'
        };
        lastWorkout.emoji = emojiMap[feeling];

        saveWorkoutData();
    }

    // Highlight the selected mood emoji
    const moodOptions = document.querySelectorAll('#celebrationMoodOptions .mood-emoji');
    moodOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.mood === feeling) {
            option.classList.add('selected');
        }
    });
}


// Close celebration
function closeCelebration() {
    document.getElementById('celebrationOverlay').classList.add('hidden');

    // Navigate back to the screen that opened the workout
    if (previousScreen === 'calendar') {
        openCalendar();
    } else {
        showHomeScreen();
        // Force refresh of home screen to show updated workout states
        updateDisplay();
    }
}

// Show calendar view
function showCalendarView() {
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('workoutScreen').classList.add('hidden');
    document.getElementById('calendarScreen').classList.remove('hidden');
    
    currentCalendarDate = new Date();
    updateCalendarDisplay();
}

// Navigate calendar month
function navigateMonth(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    updateCalendarDisplay();
}

// Update calendar display
function updateCalendarDisplay() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    document.getElementById('currentMonth').textContent = 
        `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;
    
    renderCalendar();
}

// Render calendar grid
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = '600';
        dayHeader.style.color = '#6c6c70';
        calendar.appendChild(dayHeader);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Check if workout was done on this day and get workout type
        const dayDate = new Date(year, month, day);
        const dayWorkout = workoutData.history.find(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.toDateString() === dayDate.toDateString();
        });

        // Check if there's a daily note for this day
        const dateKey = getLocalDateKey(dayDate);
        const dailyNote = workoutData.dailyEntries[dateKey];

        // Check if this is today's date
        const today = new Date();
        const isToday = dayDate.toDateString() === today.toDateString();

        if (dayWorkout) {
            dayElement.classList.add('workout-day');
        }

        // Add dot indicator for daily notes
        if (dailyNote) {
            const dotElement = document.createElement('div');
            dotElement.className = 'note-dot';
            dayElement.appendChild(dotElement);
        }
        
        if (isToday) {
            dayElement.classList.add('selected');
            showWorkoutDetails(dayDate);
        }
        
        dayElement.addEventListener('click', () => {
            // Remove previous selection
            const previousSelected = calendar.querySelector('.calendar-day.selected');
            if (previousSelected) {
                previousSelected.classList.remove('selected');
            }
            
            // Add selection to clicked day
            dayElement.classList.add('selected');
            
            // Update selected calendar date for check-ins
            selectedCalendarDate = new Date(dayDate);
            
            // Refresh calendar check-in display for selected date
            renderCalendarCheckin();
            
            showWorkoutDetails(dayDate);
        });
        calendar.appendChild(dayElement);
    }
}

// Global variable to track selected soreness for calendar
let calendarSelectedSoreness = null;

// Select soreness level for calendar
function selectSoreness(soreness) {
    calendarSelectedSoreness = soreness;

    // Update visual selection (handles both old and new class names)
    const sorenessOptions = document.querySelectorAll('.soreness-option, .checkin-soreness-option');
    sorenessOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.soreness === soreness) {
            option.classList.add('selected');
        }
    });
}

// Save daily note
function saveDailyNote(dateKey) {
    const noteInput = document.getElementById('dailyNoteInput');
    const noteText = noteInput.value.trim();

    // Require at least soreness selection or note text
    if (calendarSelectedSoreness || noteText) {
        workoutData.dailyEntries[dateKey] = {
            note: noteText,
            soreness: calendarSelectedSoreness,
            date: dateKey
        };
        saveWorkoutData();

        // Reset selected soreness
        calendarSelectedSoreness = null;

        // Refresh the calendar display to show the dot indicator
        updateCalendarDisplay();

        // Refresh the selected date details
        const selectedDate = new Date(dateKey + 'T00:00:00');
        showWorkoutDetails(selectedDate);
    } else {
        // Provide feedback if nothing was entered
        alert('Please select a soreness level or enter a note before saving.');
    }
}

// Edit daily note
function editDailyNote(dateKey, currentNote, currentSoreness) {
    // Set the selected soreness for editing
    calendarSelectedSoreness = currentSoreness || null;

    const workoutDetailsDiv = document.getElementById('workoutDetails');
    workoutDetailsDiv.innerHTML = `
        <div class="checkin-header">
            <h3 class="checkin-title">Daily Check-in</h3>
            <div class="checkin-date">${formatDateForDisplay(new Date(dateKey + 'T00:00:00'))}</div>
        </div>

        <div class="checkin-soreness">
            <div class="checkin-soreness-title">How sore are you?</div>
            <div class="checkin-soreness-options">
                <button class="checkin-soreness-option ${currentSoreness === 'none' ? 'selected' : ''}" data-soreness="none" onclick="selectSoreness('none')">
                    <span class="checkin-soreness-emoji">😌</span>
                    <span class="checkin-soreness-label">None</span>
                </button>
                <button class="checkin-soreness-option ${currentSoreness === 'mild' ? 'selected' : ''}" data-soreness="mild" onclick="selectSoreness('mild')">
                    <span class="checkin-soreness-emoji">😐</span>
                    <span class="checkin-soreness-label">Mild</span>
                </button>
                <button class="checkin-soreness-option ${currentSoreness === 'sore' ? 'selected' : ''}" data-soreness="sore" onclick="selectSoreness('sore')">
                    <span class="checkin-soreness-emoji">😣</span>
                    <span class="checkin-soreness-label">Sore</span>
                </button>
                <button class="checkin-soreness-option ${currentSoreness === 'very-sore' ? 'selected' : ''}" data-soreness="very-sore" onclick="selectSoreness('very-sore')">
                    <span class="checkin-soreness-emoji">🤕</span>
                    <span class="checkin-soreness-label">Very sore</span>
                </button>
            </div>
        </div>

        <div class="checkin-note">
            <div class="checkin-note-title">How are you feeling today?</div>
            <textarea class="checkin-note-input" id="dailyNoteInput" placeholder="Any thoughts for today?" maxlength="300">${currentNote}</textarea>
        </div>

        <div class="note-buttons">
            <button class="checkin-save-btn" onclick="saveDailyNote('${dateKey}')">Save Check-in</button>
            <button class="btn-delete-note" onclick="deleteDailyNote('${dateKey}')">Delete</button>
        </div>
    `;
}

// Delete daily note
function deleteDailyNote(dateKey) {
    delete workoutData.dailyEntries[dateKey];
    saveWorkoutData();

    // Refresh the calendar display to remove the dot indicator
    updateCalendarDisplay();

    // Refresh the selected date details
    const selectedDate = new Date(dateKey + 'T00:00:00');
    showWorkoutDetails(selectedDate);
}

// Format date for display
function formatDateForDisplay(date) {
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'short'
    });
}

// Helper function to get feedback display HTML
function getFeedbackDisplay(feedback) {
    const feedbackInfo = feedbackMap[feedback];
    if (!feedbackInfo) return '';

    return `<p class="workout-feedback"><span class="feedback-emoji">${feedbackInfo.emoji}</span> ${feedbackInfo.label}</p>`;
}

// Helper function to get soreness display HTML
function getSorenessDisplay(soreness) {
    const sorenessMap = {
        'none': { emoji: '😌', label: 'No soreness' },
        'mild': { emoji: '😐', label: 'Mild soreness' },
        'sore': { emoji: '😣', label: 'Sore' },
        'very-sore': { emoji: '🤕', label: 'Very sore' }
    };

    const sorenessInfo = sorenessMap[soreness];
    if (!sorenessInfo) return '';

    return `<p class="workout-feedback"><span class="feedback-emoji">${sorenessInfo.emoji}</span> ${sorenessInfo.label}</p>`;
}

// Show workout details for selected date
function showWorkoutDetails(date) {
    const workoutDetailsDiv = document.getElementById('workoutDetails');
    const workout = workoutData.history.find(w => {
        const workoutDate = new Date(w.date);
        return workoutDate.toDateString() === date.toDateString();
    });

    const dateKey = getLocalDateKey(date);
    const dailyEntry = workoutData.dailyEntries[dateKey];

    if (!workout && !dailyEntry) {
        // Hide workout details if no workout or daily entry
        workoutDetailsDiv.classList.add('hidden');
        return;
    }

    if (!workout) {
        // Hide workout details if no workout data (daily entry is now handled by calendar check-in)
        workoutDetailsDiv.classList.add('hidden');
        return;
    }
    
    // Filter exercises that have weights
    const exercisesWithWeights = Object.entries(workout.exercises || {}).filter(([exerciseName, sets]) => 
        sets && sets.length > 0 && sets.some(set => set.weight && parseFloat(set.weight) > 0)
    );
    
    if (exercisesWithWeights.length === 0) {
        // If no exercises with weights, still show the workout but with a message
        const feedbackDisplay = workout.feedback ? getFeedbackDisplay(workout.feedback) : '';
        const feedbackEmoji = workout.feedback ? feedbackMap[workout.feedback]?.emoji || '' : '';
        const workoutDuration = workout.duration ? formatWorkoutDuration(workout.duration) : '';
        workoutDetailsDiv.innerHTML = `
            <div class="workout-details-header" onclick="openWorkoutFromCalendar('${workout.type}')" style="cursor: pointer; display: flex; align-items: center; gap: 12px;">
                ${feedbackEmoji ? `<span style="font-size: 24px;">${feedbackEmoji}</span>` : ''}
                <div class="workout-details-info" style="flex: 1; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3>${workoutExercises[workout.type].title}</h3>
                        <p class="workout-details-date">${formatWorkoutDateTime(workout.date)}</p>
                    </div>
                    ${workoutDuration ? `<div style="background: #e8f5e8; padding: 6px 12px; border-radius: 12px; display: flex; align-items: center; gap: 6px; font-size: 14px; color: #34c759; font-weight: 600;"><i data-lucide="clock" style="width: 16px; height: 16px;"></i>${workoutDuration}</div>` : ''}
                </div>
            </div>
            <p class="no-weights-message">No weight data recorded for this workout.</p>
        `;
        workoutDetailsDiv.classList.remove('hidden');
        
        // Reinitialize Lucide icons for the newly added content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }
    
    const feedbackDisplay = workout.feedback ? getFeedbackDisplay(workout.feedback) : '';
    const feedbackEmoji = workout.feedback ? feedbackMap[workout.feedback]?.emoji || '' : '';
    const workoutDuration = workout.duration ? formatWorkoutDuration(workout.duration) : '';
    let detailsHtml = `
        <div class="workout-details-header" onclick="openWorkoutFromCalendar('${workout.type}')">
            ${feedbackEmoji ? `<span class="workout-emoji">${feedbackEmoji}</span>` : ''}
            <div class="workout-details-info">
                <div>
                    <h3>${workoutExercises[workout.type].title}</h3>
                    <p class="workout-details-date">${formatWorkoutDateTime(workout.date)}</p>
                </div>
                ${workoutDuration ? `<div class="workout-duration-badge"><i data-lucide="clock"></i>${workoutDuration}</div>` : ''}
            </div>
        </div>
        <div class="workout-details-exercises">
    `;
    
    exercisesWithWeights.forEach(([exerciseName, sets]) => {
        const setsWithWeights = sets.filter(set => set.weight && set.weight > 0);
        if (setsWithWeights.length > 0) {
            detailsHtml += `
                <div class="exercise-detail">
                    <div class="exercise-detail-name">${exerciseName}</div>
                    <div class="exercise-detail-sets">
                        ${setsWithWeights.map(set => `${set.weight}kg × ${set.reps}`).join(', ')}
                    </div>
                </div>
            `;
        }
    });
    
    detailsHtml += '</div>';
    
    workoutDetailsDiv.innerHTML = detailsHtml;
    workoutDetailsDiv.classList.remove('hidden');
    
    // Reinitialize Lucide icons for the newly added content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Open workout from calendar view
function openWorkoutFromCalendar(workoutType) {
    // Set the workout state to completed since it's being opened from calendar
    setWorkoutState(workoutType, 'completed');
    
    // Open the workout normally - it will load as completed
    openWorkout(workoutType, 'calendar');

    // Show feedback section for completed workout
    showWorkoutFeedbackSection(workoutType);
}

// Show workout feedback section
function showWorkoutFeedbackSection(workoutType) {
    const feedbackSection = document.getElementById('workoutFeedbackSection');
    const feedbackOptions = document.getElementById('workoutFeedbackOptions');

    // Get current feedback for this workout
    const completedWorkout = workoutData.history
        .filter(h => h.type === workoutType)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    const currentFeedback = completedWorkout?.feedback || null;

    // Create mood options (same as daily checkin)
    const moods = ['amazing', 'good', 'okay', 'tough', 'terrible'];
    const moodEmojis = {
        'amazing': '🔥',
        'good': '😊',
        'okay': '😐',
        'tough': '😮‍💨',
        'terrible': '😞'
    };

    const moodButtons = moods.map(mood => {
        const isSelected = mood === currentFeedback ? 'selected' : '';
        return `<button class="mood-emoji ${isSelected}" data-mood="${mood}" onclick="updateWorkoutFeedback('${workoutType}', '${mood}')">${moodEmojis[mood]}</button>`;
    }).join('');

    feedbackOptions.innerHTML = moodButtons;
    feedbackSection.classList.remove('hidden');
}

// Update workout feedback
function updateWorkoutFeedback(workoutType, feedback) {
    // Find the most recent workout of this type and update its feedback
    const workoutIndex = workoutData.history
        .map((h, index) => ({ ...h, originalIndex: index }))
        .filter(h => h.type === workoutType)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.originalIndex;

    if (workoutIndex !== undefined) {
        workoutData.history[workoutIndex].feedback = feedback;
        saveWorkoutData();

        // Update UI to show selection
        const feedbackOptions = document.querySelectorAll('#workoutFeedbackOptions .mood-emoji');
        feedbackOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.mood === feedback) {
                option.classList.add('selected');
            }
        });

        // Update calendar display if we're coming from calendar
        updateDisplay();
    }
}

// Show delete confirmation dialog
function showDeleteConfirmationDialog() {
    const dialog = document.getElementById('deleteConfirmationDialog');
    const dialogContent = dialog.querySelector('.bottom-sheet-content');
    
    dialog.classList.remove('hidden');
    
    // Force reflow to ensure the dialog is visible before animation
    dialog.offsetHeight;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
        dialogContent.classList.add('show');
    });
}

// Close delete confirmation dialog
function closeDeleteConfirmationDialog() {
    const dialog = document.getElementById('deleteConfirmationDialog');
    const dialogContent = dialog.querySelector('.bottom-sheet-content');

    // Start slide down animation
    dialogContent.classList.remove('show');

    // Hide the dialog after animation completes
    setTimeout(() => {
        dialog.classList.add('hidden');
    }, 300); // Match the CSS transition duration
}

// Show checkin delete confirmation dialog
function showDeleteCheckinConfirmationDialog() {
    const dialog = document.getElementById('deleteCheckinConfirmationDialog');
    const dialogContent = dialog.querySelector('.bottom-sheet-content');

    dialog.classList.remove('hidden');

    // Force reflow to ensure the dialog is visible before animation
    dialog.offsetHeight;

    // Trigger animation on next frame
    requestAnimationFrame(() => {
        dialogContent.classList.add('show');
    });
}

// Close checkin delete confirmation dialog
function closeDeleteCheckinConfirmationDialog() {
    const dialog = document.getElementById('deleteCheckinConfirmationDialog');
    const dialogContent = dialog.querySelector('.bottom-sheet-content');

    // Start slide down animation
    dialogContent.classList.remove('show');

    // Hide the dialog after animation completes
    setTimeout(() => {
        dialog.classList.add('hidden');
    }, 300); // Match the CSS transition duration
}

// Variable to store the dateKey for checkin deletion
let checkinToDelete = null;

// Confirm and actually delete the checkin
function confirmDeleteCheckin() {
    if (checkinToDelete && workoutData.dailyEntries && workoutData.dailyEntries[checkinToDelete]) {
        delete workoutData.dailyEntries[checkinToDelete];
        saveWorkoutData();

        // Determine which screen is currently visible and refresh accordingly
        const calendarScreen = document.getElementById('calendarScreen');
        const homeScreen = document.getElementById('homeScreen');

        if (!calendarScreen.classList.contains('hidden')) {
            renderCalendarCheckin();
            updateCalendarDisplay(); // Refresh calendar to remove dot indicators
        } else if (!homeScreen.classList.contains('hidden')) {
            renderHomeCheckin();
            updateDisplay(); // Refresh the home screen
        }

        // Close popover if it's open
        const popover = document.getElementById('checkinPopover');
        if (!popover.classList.contains('hidden')) {
            closeCheckinPopover();
        }
    }

    // Close the confirmation dialog and reset
    closeDeleteCheckinConfirmationDialog();
    checkinToDelete = null;
}

// Confirm and actually delete the workout
function confirmDeleteWorkout() {
    if (!currentWorkout) return;
    
    // Close confirmation dialog
    closeDeleteConfirmationDialog();
    
    // Remove workout from history
    workoutData.history = workoutData.history.filter(workout => workout.type !== currentWorkout);
    
    
    // Reset workout state to pending
    setWorkoutState(currentWorkout, 'pending');
    
    // Clear last weights, reps, sets, and exercise data for this workout
    Object.keys(workoutData.lastWeights).forEach(key => {
        if (key.startsWith(`${currentWorkout}-`)) {
            delete workoutData.lastWeights[key];
        }
    });
    Object.keys(workoutData.lastReps).forEach(key => {
        if (key.startsWith(`${currentWorkout}-`)) {
            delete workoutData.lastReps[key];
        }
    });
    Object.keys(workoutData.lastSets).forEach(key => {
        if (key.startsWith(`${currentWorkout}-`)) {
            delete workoutData.lastSets[key];
        }
    });
    Object.keys(workoutData.lastExerciseData).forEach(key => {
        if (key.startsWith(`${currentWorkout}-`)) {
            delete workoutData.lastExerciseData[key];
        }
    });
    
    // Remove pending workout if it exists
    if (workoutData.pendingWorkouts[currentWorkout]) {
        delete workoutData.pendingWorkouts[currentWorkout];
    }
    
    // Save data
    saveWorkoutData();
    
    // Navigate back to previous screen
    if (previousScreen === 'calendar') {
        openCalendar();
    } else {
        showHomeScreen();
    }
}

// Service Worker Update Detection for iOS PWA
if ('serviceWorker' in navigator) {
    let refreshing = false;
    
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(registration => {
        
        // Check for updates every time the app is opened
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // Force the new service worker to take control
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                    } else {
                    }
                }
            });
        });
        
        // Listen for controlling service worker changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
        
        // Check for updates on visibility change (iOS PWA switching)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && registration) {
                registration.update();
            }
        });
        
        // Check for updates on focus (when returning to the app)
        window.addEventListener('focus', () => {
            if (registration) {
                registration.update();
            }
        });
        
    }).catch(error => {
        console.error('SW registration failed:', error);
    });
}

// Swipe gesture handling with visual feedback
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isDragging = false;
let workoutScreen = null;

// Handle swipe gesture with visual feedback
function handleSwipeStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    workoutScreen = document.getElementById('workoutScreen');
    
    // Only enable dragging if we're on the workout screen
    if (!workoutScreen.classList.contains('hidden')) {
        isDragging = false;
        // Disable transition during drag
        workoutScreen.style.transition = 'none';
    }
}

function handleSwipeMove(e) {
    if (!workoutScreen || workoutScreen.classList.contains('hidden')) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX;
    const diffY = currentY - touchStartY;
    
    // Only start dragging if horizontal movement is significant
    if (!isDragging && Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
        isDragging = true;
        e.preventDefault(); // Prevent scrolling
    }
    
    if (isDragging && diffX > 0) {
        // Only allow dragging to the right (positive direction)
        const dragDistance = Math.min(diffX, window.innerWidth);
        workoutScreen.style.transform = `translateX(${dragDistance}px)`;
        
        // Add subtle opacity effect
        const opacity = Math.max(0.3, 1 - (dragDistance / (window.innerWidth * 0.7)));
        workoutScreen.style.opacity = opacity;
    }
}

function handleSwipeEnd(e) {
    if (!workoutScreen || workoutScreen.classList.contains('hidden')) return;
    
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const threshold = window.innerWidth * 0.3; // 30% of screen width
    
    // Re-enable transition for smooth animation
    workoutScreen.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
    
    if (isDragging && diffX > threshold) {
        // Complete the swipe - animate off screen then go back
        workoutScreen.style.transform = `translateX(${window.innerWidth}px)`;
        workoutScreen.style.opacity = '0';
        
        setTimeout(() => {
            goBackHome();
            // Reset styles after navigation
            workoutScreen.style.transform = '';
            workoutScreen.style.opacity = '';
            workoutScreen.style.transition = '';
        }, 300);
    } else {
        // Snap back to original position
        workoutScreen.style.transform = '';
        workoutScreen.style.opacity = '';
        
        setTimeout(() => {
            workoutScreen.style.transition = '';
        }, 300);
    }
    
    isDragging = false;
}

// Add touch event listeners
document.addEventListener('touchstart', handleSwipeStart, { passive: false });
document.addEventListener('touchmove', handleSwipeMove, { passive: false });
document.addEventListener('touchend', handleSwipeEnd, { passive: false });


// Developer controls toggle functions
function showDevControls() {
    const devControls = document.getElementById('devControls');
    if (devControls) {
        devControls.classList.remove('hidden');
    }
}

function hideDevControls() {
    const devControls = document.getElementById('devControls');
    if (devControls) {
        devControls.classList.add('hidden');
    }
}

function toggleDevControls() {
    const devControls = document.getElementById('devControls');
    if (devControls) {
        if (devControls.classList.contains('hidden')) {
            showDevControls();
        } else {
            hideDevControls();
        }
    }
}

// Make dev functions available globally for console access
window.showDevControls = showDevControls;
window.hideDevControls = hideDevControls;
window.toggleDevControls = toggleDevControls;
window.addTestData = addTestData;
window.removeTestData = removeTestData;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);