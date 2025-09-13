// Workout Tracker JavaScript

// Global state variables
let currentWorkout = null;
let workoutStartTime = null;
let timerInterval = null;
let exerciseData = {};
let currentCalendarDate = new Date();
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
}

// Update the main display
function updateDisplay() {
    updateAppName();
    renderDailyCheckin();
    renderWorkoutCards();
    updateStats();
}

// Global variable to track selected soreness for home checkin
let homeCheckinSoreness = null;

// Render daily checkin card on home page
function renderDailyCheckin() {
    const dailyCheckinDiv = document.getElementById('dailyCheckin');
    const today = new Date();
    const dateKey = getLocalDateKey(today);
    const todayEntry = workoutData.dailyEntries[dateKey];

    // Check if already completed today
    if (todayEntry) {
        // Show completed state (collapsed by default)
        const sorenessDisplay = todayEntry.soreness ? getSorenessDisplay(todayEntry.soreness) : '';
        dailyCheckinDiv.innerHTML = `
            <div class="checkin-header collapsible" onclick="toggleDailyCheckin()">
                <div>
                    <h3 class="checkin-title">Today's Check-in</h3>
                    <div class="checkin-date">${formatDateForHomeDisplay(today)}</div>
                </div>
                <div class="checkin-toggle">›</div>
            </div>
            <div class="checkin-content collapsed">
                ${sorenessDisplay ? `<div style="margin-top: 8px;">${sorenessDisplay}</div>` : ''}
                ${todayEntry.note ? `<div class="daily-note-display" style="margin-top: 8px; font-size: 14px;">${todayEntry.note}</div>` : ''}
            </div>
        `;
        dailyCheckinDiv.classList.remove('hidden');
        return;
    }

    // Show input form (collapsed by default)
    dailyCheckinDiv.innerHTML = `
        <div class="checkin-header collapsible" onclick="toggleDailyCheckin()">
            <div>
                <h3 class="checkin-title">Daily Check-in</h3>
                <div class="checkin-date">${formatDateForHomeDisplay(today)}</div>
            </div>
            <div class="checkin-toggle">›</div>
        </div>
        <div class="checkin-content collapsed">
            <div class="checkin-soreness">
                <div class="checkin-soreness-title">How sore are you?</div>
                <div class="checkin-soreness-options">
                    <button class="checkin-soreness-option" data-soreness="none" onclick="selectHomeCheckinSoreness('none')">
                        <span class="checkin-soreness-emoji">😌</span>
                        <span class="checkin-soreness-label">None</span>
                    </button>
                    <button class="checkin-soreness-option" data-soreness="mild" onclick="selectHomeCheckinSoreness('mild')">
                        <span class="checkin-soreness-emoji">😐</span>
                        <span class="checkin-soreness-label">Mild</span>
                    </button>
                    <button class="checkin-soreness-option" data-soreness="sore" onclick="selectHomeCheckinSoreness('sore')">
                        <span class="checkin-soreness-emoji">😣</span>
                        <span class="checkin-soreness-label">Sore</span>
                    </button>
                    <button class="checkin-soreness-option" data-soreness="very-sore" onclick="selectHomeCheckinSoreness('very-sore')">
                        <span class="checkin-soreness-emoji">🤕</span>
                        <span class="checkin-soreness-label">Very sore</span>
                    </button>
                </div>
            </div>

            <div class="checkin-note">
                <div class="checkin-note-title">How are you feeling today?</div>
                <textarea class="checkin-note-input" id="homeCheckinNoteInput" placeholder="Any thoughts for today?" maxlength="300"></textarea>
            </div>

            <button class="checkin-save-btn" onclick="saveHomeCheckin()">Save Check-in</button>
        </div>
    `;
    dailyCheckinDiv.classList.remove('hidden');
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
    document.getElementById('homeAppBarBtn').classList.toggle('active', activeTab === 'home');
    document.getElementById('calendarAppBarBtn').classList.toggle('active', activeTab === 'calendar');
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
                    status = 'Ready to start';
                    statusClass = 'status-available';
                }
        }

        const workoutCard = document.createElement('div');
        workoutCard.className = 'workout-card';
        workoutCard.style.background = workoutColors[type];

        // Add timer display for ongoing workouts
        let timerHtml = '';
        if (workoutState === 'ongoing' && workoutData.pendingWorkouts[type] && workoutData.pendingWorkouts[type].startTime) {
            const elapsedTime = getFormattedElapsedTime(workoutData.pendingWorkouts[type].startTime);
            timerHtml = `<div class="workout-timer" data-workout-type="${type}">⏱️ ${elapsedTime}</div>`;
        }

        // Determine description text based on workout state
        let descriptionText = workout.description;

        // For ongoing workouts, replace status badge with timer
        let statusElement;
        if (workoutState === 'ongoing' && workoutData.pendingWorkouts[type] && workoutData.pendingWorkouts[type].startTime) {
            const elapsedTime = getFormattedElapsedTime(workoutData.pendingWorkouts[type].startTime);
            statusElement = `<div class="workout-timer" data-workout-type="${type}">⏱️ ${elapsedTime}</div>`;
        } else if (status) {
            statusElement = `<span class="workout-status ${statusClass}">${status}</span>`;
        } else {
            statusElement = '';
        }

        workoutCard.innerHTML = `
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

        const messageDiv = document.createElement('div');
        messageDiv.className = 'daily-completion-message';
        messageDiv.innerHTML = `
            <div class="completion-icon">✅</div>
            <h3>Great job today!</h3>
            <p>You've completed your workout for today${feedbackText}.</p>
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
    
    // Show workout screen
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('workoutScreen').classList.remove('hidden');
    document.getElementById('calendarScreen').classList.add('hidden');
    
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
        
        return `
            <div class="set-item" data-exercise="${exerciseName}" data-index="${index}">
                <input type="number" 
                       class="weight-input" 
                       placeholder="${placeholder}" 
                       value="${set.weight && set.weight !== '' ? set.weight : ''}" 
                       ${weightChange}
                       min="0"
                       step="0.25"
                       inputmode="decimal"
                       ${disabled}>
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
    updateDisplay();
    updateAppBarState('home');
}

let currentSheetExercise = null;

// Open exercise bottom sheet
function openExerciseSheet(exerciseName) {
    currentSheetExercise = exerciseName;
    document.getElementById('sheetExerciseTitle').textContent = exerciseName;
    
    // Check if workout has been started
    const workoutState = getWorkoutState(currentWorkout);
    const isWorkoutStarted = workoutState === 'ongoing' || workoutState === 'completed';
    
    updateSheetSets();
    
    // Set up dynamic event listeners and disable state based on workout status
    const addSetBtn = document.getElementById('sheetAddSetBtn');
    const doneBtn = document.getElementById('sheetDoneBtn');
    
    if (isWorkoutStarted) {
        // Enable buttons for started workouts
        addSetBtn.disabled = false;
        addSetBtn.onclick = () => addSet(exerciseName);
        
        doneBtn.disabled = false;
        doneBtn.onclick = () => {
            markExerciseComplete(exerciseName);
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

    // Reset feedback and soreness selection
    const feedbackOptions = document.querySelectorAll('.feedback-option');
    feedbackOptions.forEach(option => {
        option.classList.remove('selected');
    });
}

// Record workout feedback
function recordWorkoutFeedback(feeling) {
    // Find the most recent workout in history and update its feedback
    if (workoutData.history.length > 0) {
        const lastWorkout = workoutData.history[workoutData.history.length - 1];
        lastWorkout.feedback = feeling;
        saveWorkoutData();
    }

    // Highlight the selected feedback option
    const feedbackOptions = document.querySelectorAll('.feedback-option');
    feedbackOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.feeling === feeling) {
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
    const feedbackMap = {
        'amazing': { emoji: '🔥', label: 'Amazing' },
        'good': { emoji: '😊', label: 'Good' },
        'tough': { emoji: '😮‍💨', label: 'Tough' }
    };

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
        // Show option to add daily note for non-workout days with same styling as home check-in
        workoutDetailsDiv.innerHTML = `
            <div class="checkin-header">
                <h3 class="checkin-title">Daily Check-in</h3>
                <div class="checkin-date">${formatDateForDisplay(date)}</div>
            </div>

            <div class="checkin-soreness">
                <div class="checkin-soreness-title">How sore are you?</div>
                <div class="checkin-soreness-options">
                    <button class="checkin-soreness-option" data-soreness="none" onclick="selectSoreness('none')">
                        <span class="checkin-soreness-emoji">😌</span>
                        <span class="checkin-soreness-label">None</span>
                    </button>
                    <button class="checkin-soreness-option" data-soreness="mild" onclick="selectSoreness('mild')">
                        <span class="checkin-soreness-emoji">😐</span>
                        <span class="checkin-soreness-label">Mild</span>
                    </button>
                    <button class="checkin-soreness-option" data-soreness="sore" onclick="selectSoreness('sore')">
                        <span class="checkin-soreness-emoji">😣</span>
                        <span class="checkin-soreness-label">Sore</span>
                    </button>
                    <button class="checkin-soreness-option" data-soreness="very-sore" onclick="selectSoreness('very-sore')">
                        <span class="checkin-soreness-emoji">🤕</span>
                        <span class="checkin-soreness-label">Very sore</span>
                    </button>
                </div>
            </div>

            <div class="checkin-note">
                <div class="checkin-note-title">How are you feeling today?</div>
                <textarea class="checkin-note-input" id="dailyNoteInput" placeholder="Any thoughts for today?" maxlength="300"></textarea>
            </div>

            <button class="checkin-save-btn" onclick="saveDailyNote('${dateKey}')">Save Check-in</button>
        `;
        workoutDetailsDiv.classList.remove('hidden');
        return;
    }

    if (!workout) {
        // Show existing daily entry with same styling as home check-in
        const sorenessDisplay = dailyEntry.soreness ? getSorenessDisplay(dailyEntry.soreness) : '';
        workoutDetailsDiv.innerHTML = `
            <div class="checkin-header">
                <h3 class="checkin-title">Daily Check-in</h3>
                <div class="checkin-date">${formatDateForDisplay(date)}</div>
            </div>
            ${sorenessDisplay ? `<div style="margin-top: 8px;">${sorenessDisplay}</div>` : ''}
            ${dailyEntry.note ? `<div class="daily-note-display" style="margin-top: 8px; font-size: 14px;">${dailyEntry.note}</div>` : ''}
            <button class="btn-edit-note" onclick="editDailyNote('${dateKey}', \`${(dailyEntry.note || '').replace(/`/g, '\\`')}\`, '${dailyEntry.soreness || ''}')">Edit Entry</button>
        `;
        workoutDetailsDiv.classList.remove('hidden');
        return;
    }
    
    // Filter exercises that have weights
    const exercisesWithWeights = Object.entries(workout.exercises || {}).filter(([exerciseName, sets]) => 
        sets && sets.length > 0 && sets.some(set => set.weight && parseFloat(set.weight) > 0)
    );
    
    if (exercisesWithWeights.length === 0) {
        // If no exercises with weights, still show the workout but with a message
        const feedbackDisplay = workout.feedback ? getFeedbackDisplay(workout.feedback) : '';
        workoutDetailsDiv.innerHTML = `
            <div class="workout-details-header">
                <div class="workout-details-info">
                    <h3>${workoutExercises[workout.type].title}</h3>
                    <p class="workout-details-date">${formatWorkoutDateTime(workout.date)}</p>
                    ${feedbackDisplay}
                </div>
                <button class="workout-details-open-btn" onclick="openWorkoutFromCalendar('${workout.type}')">
                    <i data-lucide="arrow-right"></i>
                </button>
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
    let detailsHtml = `
        <div class="workout-details-header">
            <div class="workout-details-info">
                <h3>${workoutExercises[workout.type].title}</h3>
                <p class="workout-details-date">${formatWorkoutDateTime(workout.date)}</p>
                ${feedbackDisplay}
            </div>
            <button class="workout-details-open-btn" onclick="openWorkoutFromCalendar('${workout.type}')">
                <i data-lucide="arrow-right"></i>
            </button>
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
        console.log('SW registered:', registration);
        
        // Check for updates every time the app is opened
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('New SW found, installing...');
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        console.log('New SW installed, activating...');
                        // Force the new service worker to take control
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                    } else {
                        console.log('SW installed for the first time');
                    }
                }
            });
        });
        
        // Listen for controlling service worker changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            console.log('SW controller changed, reloading...');
            window.location.reload();
        });
        
        // Check for updates on visibility change (iOS PWA switching)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && registration) {
                console.log('App became visible, checking for updates...');
                registration.update();
            }
        });
        
        // Check for updates on focus (when returning to the app)
        window.addEventListener('focus', () => {
            if (registration) {
                console.log('App focused, checking for updates...');
                registration.update();
            }
        });
        
    }).catch(error => {
        console.error('SW registration failed:', error);
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);