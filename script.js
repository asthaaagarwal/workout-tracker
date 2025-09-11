// Workout Tracker JavaScript

// Global state variables
let currentWorkout = null;
let workoutStartTime = null;
let timerInterval = null;
let exerciseData = {};
let currentCalendarDate = new Date();

// App names to cycle through
const appNames = [
    "Exercise? I thought you said Extra Fries",
    "Squat Squad",
    "No Whey Out",
    "Gym and Tonic"
];

// Workout colors
const workoutColors = {
    'upper-body': '#007aff',    // iOS blue
    'lower-body': '#ff9500',    // iOS orange
    'full-body': '#34c759'      // iOS green
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
    'Dead bug': { icon: '🐛', description: 'Lie on your back, arms up, knees bent at 90°. Lower opposite arm and leg slowly, return to start.' },
    'Shoulder tap': { icon: '👋', description: 'Start in plank position. Tap opposite shoulder with hand while maintaining stable core.' },
    'Push ups': { icon: '💪', description: 'Start in plank, lower chest to ground, push back up. Keep body straight throughout.' },
    'Bodyweight squats': { icon: '🤸', description: 'Stand with feet shoulder-width apart. Lower hips down and back, then return to standing.' },
    'Hand walks': { icon: '🙏', description: 'From standing, walk hands forward to plank, then walk back to standing position.' },
    'Chest press': { icon: '🏋️', description: 'Lie on bench, press weights from chest level up and slightly forward, then lower slowly.' },
    'Lat pull downs': { icon: '⬇️', description: 'Sit at machine, pull bar down to chest level, squeeze shoulder blades together.' },
    'Bent over rows': { icon: '🦵', description: 'Hinge at hips, pull weights to lower chest, squeeze shoulder blades at the top.' },
    'Shoulder press': { icon: '⬆️', description: 'Press weights overhead from shoulder level, extend arms fully, lower with control.' },
    'Bicep curls': { icon: '💪', description: 'Curl weights from extended arms to shoulders, control the descent.' },
    'Tricep curls': { icon: '💪', description: 'Extend arms overhead, lower weight behind head, press back to start.' },
    'Back squats': { icon: '🏋️', description: 'Bar on upper back, squat down keeping chest up, drive through heels to stand.' },
    'Deadlift': { icon: '🏋️', description: 'Lift bar from ground by extending hips and knees, keep bar close to body.' },
    'Step ups': { icon: '🚆', description: 'Step onto platform with full foot, drive through heel, step down with control.' },
    'Hip thrust': { icon: '🏋️', description: 'Shoulders on bench, drive hips up squeezing glutes, lower with control.' },
    'Single leg extension': { icon: '🦵', description: 'Extend one leg at a time, control the movement, focus on quad engagement.' },
    'Side lunge': { icon: '🤸', description: 'Step wide to one side, lower into lunge, push back to center.' },
    'Single leg deadlift': { icon: '⚖️', description: 'Balance on one leg, hinge at hip lowering weight, return to standing.' },
    'Plank': { icon: '🤸', description: 'Hold straight body position on forearms and toes, engage core throughout.' },
    'Russian twists': { icon: '🌀', description: 'Sit with knees bent, lean back slightly, rotate torso side to side.' },
    'Mountain climbers': { icon: '⛰️', description: 'Start in plank, alternate bringing knees to chest in running motion.' },
    'Bicycle crunches': { icon: '🚲', description: 'Lie on back, alternate elbow to opposite knee in cycling motion.' },
    'Leg raises': { icon: '🦵', description: 'Lie on back, raise straight legs to 90°, lower slowly without touching ground.' },
    'Stretch': { icon: '🤸', description: 'Perform gentle stretches to relax muscles and improve flexibility.' }
};

// Initialize workout data structure
let workoutData = {
    currentCycle: [],
    totalWorkouts: 0,
    totalCycles: 0,
    lastWeights: {},
    lastReps: {},
    lastSets: {},
    weekStartDate: null,
    history: [],
    pendingWorkouts: {},
    workoutStates: {} // Track workout states: 'pending', 'ongoing', 'completed'
};

// Load data from localStorage on page load
function loadWorkoutData() {
    const saved = localStorage.getItem('workoutTrackerData');
    if (saved) {
        workoutData = { ...workoutData, ...JSON.parse(saved) };
    }
}

// Save data to localStorage
function saveWorkoutData() {
    localStorage.setItem('workoutTrackerData', JSON.stringify(workoutData));
}

// Update pending workout data if current workout is in progress
function updatePendingWorkout() {
    if (!currentWorkout || !exerciseData) return;
    
    // Check if any exercises are completed or have weight entered
    const hasProgress = Object.values(exerciseData).some(exercise => 
        exercise.completed || exercise.sets.some(set => set.weight && set.weight > 0)
    );
    
    // Check if workout is ongoing (started)
    const isOngoing = getWorkoutState(currentWorkout) === 'ongoing';
    
    
    if (hasProgress || isOngoing) {
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
    
    // Bottom App Bar
    document.getElementById('homeAppBarBtn').addEventListener('click', () => {
        showHomeScreen();
        updateAppBarState('home');
    });
    document.getElementById('calendarAppBarBtn').addEventListener('click', () => {
        openCalendar();
        updateAppBarState('calendar');
    });
    
    // Calendar navigation
    document.getElementById('prevMonthBtn').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('nextMonthBtn').addEventListener('click', () => navigateMonth(1));
    
    // Bottom Sheet
    document.getElementById('closeSheetBtn').addEventListener('click', closeExerciseSheet);
    document.getElementById('exerciseBottomSheet').addEventListener('click', (e) => {
        if (e.target.id === 'exerciseBottomSheet') closeExerciseSheet();
    });
    
    // Close celebration overlay on click
    document.getElementById('celebrationOverlay').addEventListener('click', closeCelebration);
}

// Update the main display
function updateDisplay() {
    updateAppName();
    renderWorkoutCards();
    updateStats();
}

// Update app bar active state
function updateAppBarState(activeTab) {
    document.getElementById('homeAppBarBtn').classList.toggle('active', activeTab === 'home');
    document.getElementById('calendarAppBarBtn').classList.toggle('active', activeTab === 'calendar');
}

// ==== SIMPLIFIED CORE FUNCTIONS ====

// 1. Render workout cards on home screen
function renderWorkoutCards() {
    const workoutList = document.getElementById('workoutList');
    workoutList.innerHTML = '';
    
    // Check if we need to start a new cycle
    checkNewWeekCycle();
    
    // Check if current cycle is complete and reset if needed
    const allWorkoutTypes = Object.keys(workoutExercises);
    const cycleComplete = allWorkoutTypes.every(type => workoutData.currentCycle.includes(type));
    
    if (cycleComplete) {
        workoutData.totalCycles++;
        workoutData.currentCycle = [];
        workoutData.workoutStates = {}; // Reset all workout states to pending
        workoutData.weekStartDate = new Date().toISOString();
        saveWorkoutData();
    }
    
    const workoutTypes = Object.keys(workoutExercises);
    
    // Sort workouts: ongoing first, then available, then completed
    workoutTypes.sort((a, b) => {
        const aState = getWorkoutState(a);
        const bState = getWorkoutState(b);
        const stateOrder = { 'ongoing': 0, 'pending': 1, 'completed': 2 };
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
            case 'completed':
                status = 'Completed';
                statusClass = 'status-completed';
                break;
            default: // 'pending'
                status = 'Available';
                statusClass = 'status-available';
        }
        
        const workoutCard = document.createElement('div');
        workoutCard.className = 'workout-card';
        workoutCard.style.borderLeft = `4px solid ${workoutColors[type]}`;
        
        // Add timer display for ongoing workouts
        let timerHtml = '';
        if (workoutState === 'ongoing' && workoutData.pendingWorkouts[type] && workoutData.pendingWorkouts[type].startTime) {
            const elapsedTime = getFormattedElapsedTime(workoutData.pendingWorkouts[type].startTime);
            timerHtml = `<div class="workout-timer" data-workout-type="${type}">⏱️ ${elapsedTime}</div>`;
        }
        
        // Determine description text based on workout state
        let descriptionText = workout.description;
        if (workoutState === 'completed') {
            // Find the completion time from history
            const completedWorkout = workoutData.history
                .filter(h => h.type === type)
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
            if (completedWorkout) {
                descriptionText = formatWorkoutDateTime(completedWorkout.date);
            }
        }
        
        workoutCard.innerHTML = `
            <div class="workout-card-header">
                <h3 class="workout-title">${workout.title}</h3>
                <span class="workout-status ${statusClass}">
                    ${status}
                </span>
            </div>
            <p class="workout-description">${descriptionText}</p>
            ${timerHtml}
        `;
        
        // Add click event to card (only if not completed)
        if (workoutState !== 'completed') {
            workoutCard.addEventListener('click', () => openWorkout(type));
        } else {
            workoutCard.style.opacity = '0.6';
            workoutCard.style.cursor = 'not-allowed';
        }
        
        workoutList.appendChild(workoutCard);
    });
}

// 2. Open workout screen
function openWorkout(type) {
    if (workoutData.currentCycle.includes(type)) return;
    
    currentWorkout = type;
    
    // Load or initialize exercise data
    if (workoutData.pendingWorkouts[type]) {
        // Resume from saved progress
        exerciseData = JSON.parse(JSON.stringify(workoutData.pendingWorkouts[type].exerciseData));
        workoutStartTime = workoutData.pendingWorkouts[type].startTime ? new Date(workoutData.pendingWorkouts[type].startTime) : null;
    } else {
        // Initialize fresh exercise data
        exerciseData = {};
        workoutExercises[type].exercises.forEach(exercise => {
            exerciseData[exercise.name] = {
                sets: [],
                completed: false
            };
            // Add default sets
            for (let i = 0; i < exercise.sets; i++) {
                exerciseData[exercise.name].sets.push({
                    weight: '',
                    reps: workoutData.lastReps[`${type}-${exercise.name}`] || 12
                });
            }
        });
        workoutStartTime = null;
    }
    
    // Show workout screen
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('workoutScreen').classList.remove('hidden');
    document.getElementById('calendarScreen').classList.add('hidden');
    
    document.getElementById('workoutTitle').textContent = workoutExercises[currentWorkout].title;
    
    // Show appropriate button based on workout state
    const workoutState = getWorkoutState(currentWorkout);
    const startBtn = document.getElementById('startWorkoutBtn');
    const completeBtn = document.getElementById('completeWorkoutBtn');
    const isOtherWorkoutOngoing = hasOngoingWorkout() && getOngoingWorkoutType() !== currentWorkout;
    
    // Hide both buttons first
    startBtn.classList.add('hidden');
    completeBtn.classList.add('hidden');
    
    switch (workoutState) {
        case 'pending':
            if (isOtherWorkoutOngoing) {
                startBtn.classList.remove('hidden');
                startBtn.disabled = true;
                startBtn.textContent = `Complete ${workoutExercises[getOngoingWorkoutType()].title} First`;
            } else {
                startBtn.classList.remove('hidden');
                startBtn.disabled = false;
                startBtn.textContent = 'Start Workout';
            }
            break;
        case 'ongoing':
            completeBtn.classList.remove('hidden');
            if (workoutStartTime) {
                startWorkoutTimer();
            }
            break;
        case 'completed':
            // Both buttons remain hidden
            break;
    }
    
    updateExerciseList();
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

// 7. Complete workout (change to completed state and show celebration)
function completeWorkout() {
    if (!currentWorkout) return;
    
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    const workoutDuration = workoutStartTime ? new Date() - workoutStartTime : 0;
    
    // Save workout data and set state to completed
    workoutData.currentCycle.push(currentWorkout);
    workoutData.totalWorkouts++;
    setWorkoutState(currentWorkout, 'completed');
    
    // Update last weights, reps, and sets for completed exercises
    Object.entries(exerciseData).forEach(([exerciseName, data]) => {
        if (data.completed && data.sets.some(set => set.weight && set.weight > 0)) {
            const key = `${currentWorkout}-${exerciseName}`;
            const lastSetWithWeight = data.sets.filter(set => set.weight && set.weight > 0).pop();
            if (lastSetWithWeight) {
                workoutData.lastWeights[key] = lastSetWithWeight.weight;
                workoutData.lastReps[key] = lastSetWithWeight.reps;
            }
            workoutData.lastSets[key] = data.sets.length;
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
        )
    });
    
    saveWorkoutData();
    
    // Remove from pending workouts
    if (workoutData.pendingWorkouts[currentWorkout]) {
        delete workoutData.pendingWorkouts[currentWorkout];
        saveWorkoutData();
    }
    
    // Show celebration for 5 seconds, then return to home screen
    showCelebration();
    setTimeout(() => {
        closeCelebration();
    }, 5000);
    
}

// 8. Open calendar screen
function openCalendar() {
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('workoutScreen').classList.add('hidden');
    document.getElementById('calendarScreen').classList.remove('hidden');
    
    currentCalendarDate = new Date();
    updateCalendarDisplay();
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
    totalCyclesElement.textContent = workoutData.totalCycles || 0;
}

// Check if we need to start a new week cycle
function checkNewWeekCycle() {
    const today = new Date();
    const weekStart = workoutData.weekStartDate ? new Date(workoutData.weekStartDate) : null;
    
    if (!weekStart || (today - weekStart) >= 7 * 24 * 60 * 60 * 1000) {
        // Start new cycle if more than 7 days have passed or no week start date
        if (workoutData.currentCycle.length > 0) {
            workoutData.currentCycle = [];
            workoutData.weekStartDate = today.toISOString();
            workoutData.workoutStates = {}; // Reset workout states for new cycle
            saveWorkoutData();
        } else if (!workoutData.weekStartDate) {
            workoutData.weekStartDate = today.toISOString();
            saveWorkoutData();
        }
    }
}

// Get workout state
function getWorkoutState(type) {
    // If workout is in current cycle (completed), return 'completed'
    if (workoutData.currentCycle.includes(type)) {
        return 'completed';
    }
    // Otherwise check stored state, default to 'pending'
    return workoutData.workoutStates[type] || 'pending';
}

// Set workout state
function setWorkoutState(type, state) {
    workoutData.workoutStates[type] = state;
    saveWorkoutData();
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
    if (!startTime) return '00:00.0';
    
    const elapsed = new Date() - new Date(startTime);
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const milliseconds = Math.floor((elapsed % 1000) / 100);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
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

// Update exercise list in workout screen
function updateExerciseList() {
    const exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = '';
    
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
        
        let className = 'exercise-item-simple';
        if (isCompleted) className += ' completed';
        else if (isInProgress) className += ' in-progress';
        
        exerciseItem.className = className;
        
        const info = exerciseInfo[exercise.name];
        
        exerciseItem.innerHTML = `
            <div class="exercise-name">${exercise.name}</div>
            ${isInProgress ? '<div class="exercise-status-dot"></div>' : ''}
            <div class="exercise-arrow">›</div>
        `;
        
        // Add click event listener
        exerciseItem.addEventListener('click', () => openExerciseSheet(exercise.name));
        
        exerciseList.appendChild(exerciseItem);
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
    const lastWeight = workoutData.lastWeights[`${currentWorkout}-${exerciseName}`];
    
    return sets.map((set, index) => `
        <div class="set-item">
            <button class="btn-remove-set" onclick="removeSet('${exerciseName}', ${index})">×</button>
            <input type="number" 
                   class="weight-input" 
                   placeholder="${lastWeight ? lastWeight + 'kg' : 'Weight (kg)'}" 
                   value="${set.weight && set.weight !== '' ? set.weight : ''}" 
                   onchange="updateWeight('${exerciseName}', ${index}, this.value)"
                   min="0"
                   inputmode="decimal">
            <div class="reps-container">
                <button class="btn-reps" onclick="updateReps('${exerciseName}', ${index}, -1)">-</button>
                <div class="reps-display">${set.reps}</div>
                <button class="btn-reps" onclick="updateReps('${exerciseName}', ${index}, 1)">+</button>
            </div>
        </div>
    `).join('');
}

// Add a set to an exercise
function addSet(exerciseName) {
    exerciseData[exerciseName].sets.push({
        weight: '',
        reps: workoutData.lastReps[`${currentWorkout}-${exerciseName}`] || 12
    });
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
    exerciseData[exerciseName].sets[setIndex].weight = weight;
    updatePendingWorkout();
}

// Update reps for a set
function updateReps(exerciseName, setIndex, change) {
    const currentReps = exerciseData[exerciseName].sets[setIndex].reps;
    const newReps = Math.max(1, currentReps + change);
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


// Go back to home screen (replaces cancelWorkout)
function goBackHome() {
    // Update pending workout data BEFORE clearing references
    if (currentWorkout) {
        updatePendingWorkout();
    }
    
    // Clear current references but don't stop timer
    currentWorkout = null;
    exerciseData = {};
    
    showHomeScreen();
}

// Show home screen
function showHomeScreen() {
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('workoutScreen').classList.add('hidden');
    document.getElementById('calendarScreen').classList.add('hidden');
    updateDisplay();
    updateAppBarState('home');
}

let currentSheetExercise = null;

// Open exercise bottom sheet
function openExerciseSheet(exerciseName) {
    currentSheetExercise = exerciseName;
    document.getElementById('sheetExerciseTitle').textContent = exerciseName;
    updateSheetSets();
    
    // Set up dynamic event listeners
    document.getElementById('sheetAddSetBtn').onclick = () => addSet(exerciseName);
    document.getElementById('sheetDoneBtn').onclick = () => {
        markExerciseComplete(exerciseName);
        closeExerciseSheet();
    };
    
    // Hide done button if exercise is completed
    document.getElementById('sheetDoneBtn').classList.toggle('hidden', exerciseData[exerciseName].completed);
    
    document.getElementById('exerciseBottomSheet').classList.remove('hidden');
}

// Close exercise bottom sheet
function closeExerciseSheet() {
    document.getElementById('exerciseBottomSheet').classList.add('hidden');
    currentSheetExercise = null;
    updateExerciseList();
}

// Update sets in bottom sheet
function updateSheetSets() {
    if (!currentSheetExercise) return;
    
    const container = document.getElementById('sheetSetsContainer');
    container.innerHTML = renderSets(currentSheetExercise);
}

// Show celebration
function showCelebration() {
    document.getElementById('celebrationOverlay').classList.remove('hidden');
}

// Close celebration
function closeCelebration() {
    document.getElementById('celebrationOverlay').classList.add('hidden');
    showHomeScreen();
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
        dayElement.textContent = day;
        
        // Check if workout was done on this day and get workout type
        const dayDate = new Date(year, month, day);
        const dayWorkout = workoutData.history.find(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.toDateString() === dayDate.toDateString();
        });
        
        // Check if this is today's date
        const today = new Date();
        const isToday = dayDate.toDateString() === today.toDateString();
        
        if (dayWorkout) {
            dayElement.classList.add('workout-day');
            dayElement.style.backgroundColor = workoutColors[dayWorkout.type];
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
            showWorkoutDetails(dayDate);
        });
        calendar.appendChild(dayElement);
    }
}

// Show workout details for selected date
function showWorkoutDetails(date) {
    const workoutDetailsDiv = document.getElementById('workoutDetails');
    const workout = workoutData.history.find(w => {
        const workoutDate = new Date(w.date);
        return workoutDate.toDateString() === date.toDateString();
    });
    
    if (!workout) {
        workoutDetailsDiv.classList.add('hidden');
        return;
    }
    
    // Filter exercises that have weights
    const exercisesWithWeights = Object.entries(workout.exercises).filter(([exerciseName, sets]) => 
        sets.length > 0 && sets.some(set => set.weight && parseFloat(set.weight) > 0)
    );
    
    if (exercisesWithWeights.length === 0) {
        // If no exercises with weights, still show the workout but with a message
        workoutDetailsDiv.innerHTML = `
            <div class="workout-details-header">
                <h3>${workoutExercises[workout.type].title}</h3>
                <p class="workout-details-date">${formatWorkoutDateTime(workout.date)}</p>
            </div>
            <p class="no-weights-message">No weight data recorded for this workout.</p>
        `;
        workoutDetailsDiv.classList.remove('hidden');
        return;
    }
    
    let detailsHtml = `
        <div class="workout-details-header">
            <h3>${workoutExercises[workout.type].title}</h3>
            <p class="workout-details-date">${formatWorkoutDateTime(workout.date)}</p>
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
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);