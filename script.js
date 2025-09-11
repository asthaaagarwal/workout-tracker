// Workout Tracker JavaScript

// Global state variables
let currentWorkout = null;
let workoutStartTime = null;
let timerInterval = null;
let exerciseData = {};
let currentCalendarDate = new Date();

// Workout exercises data
const workoutExercises = {
    'upper-body': {
        title: 'Upper Body',
        description: 'Chest, back, shoulders, and arms',
        exercises: [
            { name: 'Dead bug', sets: 2, type: 'warmup' },
            { name: 'Shoulder tap', sets: 2, type: 'warmup' },
            { name: 'Push ups', sets: 2, type: 'warmup' },
            { name: 'Chest press', sets: 3 },
            { name: 'Lat pull downs', sets: 3 },
            { name: 'Bent over rows', sets: 3 },
            { name: 'Shoulder press', sets: 3 },
            { name: 'Bicep curls', sets: 3 },
            { name: 'Tricep curls', sets: 3 },
            { name: 'Stretch', sets: 1, type: 'cooldown' }
        ]
    },
    'lower-body': {
        title: 'Lower Body',
        description: 'Legs, glutes, and lower body strength',
        exercises: [
            { name: 'Bodyweight squats', sets: 2, type: 'warmup' },
            { name: 'Hand walks', sets: 2, type: 'warmup' },
            { name: 'Push ups', sets: 2, type: 'warmup' },
            { name: 'Back squats', sets: 3 },
            { name: 'Deadlift', sets: 3 },
            { name: 'Step ups', sets: 3 },
            { name: 'Hip thrust', sets: 3 },
            { name: 'Single leg extension', sets: 3 },
            { name: 'Side lunge', sets: 3 },
            { name: 'Single leg deadlift', sets: 3 },
            { name: 'Stretch', sets: 1, type: 'cooldown' }
        ]
    },
    'full-body': {
        title: 'Full Body',
        description: 'Complete body workout with core focus',
        exercises: [
            { name: 'Dead bug', sets: 2, type: 'warmup' },
            { name: 'Bodyweight squats', sets: 2, type: 'warmup' },
            { name: 'Hand walks', sets: 2, type: 'warmup' },
            { name: 'Back squats', sets: 3 },
            { name: 'Chest press', sets: 3 },
            { name: 'Bent over rows', sets: 3 },
            { name: 'Shoulder press', sets: 3 },
            { name: 'Hip thrust', sets: 3 },
            { name: 'Plank', sets: 3, type: 'cooldown' },
            { name: 'Russian twists', sets: 3, type: 'cooldown' },
            { name: 'Mountain climbers', sets: 3, type: 'cooldown' },
            { name: 'Bicycle crunches', sets: 3, type: 'cooldown' },
            { name: 'Leg raises', sets: 3, type: 'cooldown' },
            { name: 'Stretch', sets: 1, type: 'cooldown' }
        ]
    }
};

// Exercise information with descriptions and emojis
const exerciseInfo = {
    'Dead bug': { emoji: '🐛', description: 'Lie on your back, arms up, knees bent at 90°. Lower opposite arm and leg slowly, return to start.' },
    'Shoulder tap': { emoji: '👋', description: 'Start in plank position. Tap opposite shoulder with hand while maintaining stable core.' },
    'Push ups': { emoji: '💪', description: 'Start in plank, lower chest to ground, push back up. Keep body straight throughout.' },
    'Bodyweight squats': { emoji: '🤸', description: 'Stand with feet shoulder-width apart. Lower hips down and back, then return to standing.' },
    'Hand walks': { emoji: '🙏', description: 'From standing, walk hands forward to plank, then walk back to standing position.' },
    'Chest press': { emoji: '🏋️', description: 'Lie on bench, press weights from chest level up and slightly forward, then lower slowly.' },
    'Lat pull downs': { emoji: '⬇️', description: 'Sit at machine, pull bar down to chest level, squeeze shoulder blades together.' },
    'Bent over rows': { emoji: '🦵', description: 'Hinge at hips, pull weights to lower chest, squeeze shoulder blades at the top.' },
    'Shoulder press': { emoji: '⬆️', description: 'Press weights overhead from shoulder level, extend arms fully, lower with control.' },
    'Bicep curls': { emoji: '💪', description: 'Curl weights from extended arms to shoulders, control the descent.' },
    'Tricep curls': { emoji: '💪', description: 'Extend arms overhead, lower weight behind head, press back to start.' },
    'Back squats': { emoji: '🏋️', description: 'Bar on upper back, squat down keeping chest up, drive through heels to stand.' },
    'Deadlift': { emoji: '🏋️', description: 'Lift bar from ground by extending hips and knees, keep bar close to body.' },
    'Step ups': { emoji: '🚆', description: 'Step onto platform with full foot, drive through heel, step down with control.' },
    'Hip thrust': { emoji: '🏋️', description: 'Shoulders on bench, drive hips up squeezing glutes, lower with control.' },
    'Single leg extension': { emoji: '🦵', description: 'Extend one leg at a time, control the movement, focus on quad engagement.' },
    'Side lunge': { emoji: '🤸', description: 'Step wide to one side, lower into lunge, push back to center.' },
    'Single leg deadlift': { emoji: '⚖️', description: 'Balance on one leg, hinge at hip lowering weight, return to standing.' },
    'Plank': { emoji: '🤸', description: 'Hold straight body position on forearms and toes, engage core throughout.' },
    'Russian twists': { emoji: '🌀', description: 'Sit with knees bent, lean back slightly, rotate torso side to side.' },
    'Mountain climbers': { emoji: '⛰️', description: 'Start in plank, alternate bringing knees to chest in running motion.' },
    'Bicycle crunches': { emoji: '🚲', description: 'Lie on back, alternate elbow to opposite knee in cycling motion.' },
    'Leg raises': { emoji: '🦵', description: 'Lie on back, raise straight legs to 90°, lower slowly without touching ground.' },
    'Stretch': { emoji: '🤸', description: 'Perform gentle stretches to relax muscles and improve flexibility.' }
};

// Initialize workout data structure
let workoutData = {
    currentCycle: [],
    totalWorkouts: 0,
    lastWeights: {},
    lastReps: {},
    lastSets: {},
    weekStartDate: null,
    history: [],
    pendingWorkouts: {}
};

// Load data from localStorage on page load
function loadWorkoutData() {
    const saved = localStorage.getItem('workoutTrackerData');
    if (saved) {
        workoutData = { ...workoutData, ...JSON.parse(saved) };
    }
    console.log('Loaded workout data:', workoutData);
}

// Save data to localStorage
function saveWorkoutData() {
    localStorage.setItem('workoutTrackerData', JSON.stringify(workoutData));
    console.log('Saved workout data:', workoutData);
}

// Initialize the app
function initApp() {
    loadWorkoutData();
    updateDisplay();
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('calendarBtn').addEventListener('click', showCalendarView);
    document.getElementById('cancelWorkoutBtn').addEventListener('click', cancelWorkout);
    document.getElementById('closeCalendarBtn').addEventListener('click', showHomeScreen);
    document.getElementById('completeWorkoutBtn').addEventListener('click', completeWorkout);
    
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
    updateWorkoutList();
    updateStats();
}

// Update workout list on home screen
function updateWorkoutList() {
    const workoutList = document.getElementById('workoutList');
    workoutList.innerHTML = '';
    
    // Check if we need to start a new cycle
    checkNewWeekCycle();
    
    const workoutTypes = Object.keys(workoutExercises);
    
    // Sort workouts: pending first, then available, then completed
    workoutTypes.sort((a, b) => {
        const aCompleted = workoutData.currentCycle.includes(a);
        const bCompleted = workoutData.currentCycle.includes(b);
        const aPending = workoutData.pendingWorkouts[a];
        const bPending = workoutData.pendingWorkouts[b];
        
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        return aCompleted - bCompleted;
    });
    
    workoutTypes.forEach(type => {
        const workout = workoutExercises[type];
        const isCompleted = workoutData.currentCycle.includes(type);
        const isPending = workoutData.pendingWorkouts[type];
        
        let status, statusClass, buttonText;
        if (isPending) {
            status = 'Pending';
            statusClass = 'status-pending';
            buttonText = 'Resume Workout';
        } else if (isCompleted) {
            status = 'Completed';
            statusClass = 'status-completed';
            buttonText = 'Completed';
        } else {
            status = 'Available';
            statusClass = 'status-available';
            buttonText = 'Start Workout';
        }
        
        const workoutCard = document.createElement('div');
        workoutCard.className = 'workout-card';
        workoutCard.innerHTML = `
            <div class="workout-card-header">
                <h3 class="workout-title">${workout.title}</h3>
                <span class="workout-status ${statusClass}">
                    ${status}
                </span>
            </div>
            <p class="workout-description">${workout.description}</p>
            <button class="btn-start-workout" ${isCompleted ? 'disabled' : ''} 
                    onclick="selectWorkout('${type}')">
                ${buttonText}
            </button>
        `;
        
        workoutList.appendChild(workoutCard);
    });
}

// Update stats display
function updateStats() {
    const daysSinceElement = document.getElementById('daysSinceLastWorkout');
    const totalWorkoutsElement = document.getElementById('totalWorkouts');
    
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

// Check if we need to start a new week cycle
function checkNewWeekCycle() {
    const today = new Date();
    const weekStart = workoutData.weekStartDate ? new Date(workoutData.weekStartDate) : null;
    
    if (!weekStart || (today - weekStart) >= 7 * 24 * 60 * 60 * 1000) {
        // Start new cycle if more than 7 days have passed or no week start date
        if (workoutData.currentCycle.length > 0) {
            workoutData.currentCycle = [];
            workoutData.weekStartDate = today.toISOString();
            saveWorkoutData();
        } else if (!workoutData.weekStartDate) {
            workoutData.weekStartDate = today.toISOString();
            saveWorkoutData();
        }
    }
}

// Select and start a workout
function selectWorkout(type) {
    if (workoutData.currentCycle.includes(type)) return;
    
    currentWorkout = type;
    
    // Check if there's pending workout data to resume
    if (workoutData.pendingWorkouts[type]) {
        // Resume from saved progress
        exerciseData = JSON.parse(JSON.stringify(workoutData.pendingWorkouts[type].exerciseData));
        workoutStartTime = new Date(workoutData.pendingWorkouts[type].startTime);
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
                    weight: workoutData.lastWeights[`${type}-${exercise.name}`] || '',
                    reps: workoutData.lastReps[`${type}-${exercise.name}`] || 12
                });
            }
        });
        
        workoutStartTime = null;
    }
    
    showWorkoutScreen();
    startWorkoutTimer();
}

// Show workout screen
function showWorkoutScreen() {
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('workoutScreen').classList.remove('hidden');
    document.getElementById('calendarScreen').classList.add('hidden');
    
    document.getElementById('workoutTitle').textContent = workoutExercises[currentWorkout].title;
    updateExerciseList();
}

// Start workout timer
function startWorkoutTimer() {
    if (!workoutStartTime) {
        workoutStartTime = new Date();
    }
    timerInterval = setInterval(updateTimer, 1000);
}

// Update timer display
function updateTimer() {
    if (!workoutStartTime) return;
    
    const elapsed = new Date() - workoutStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    document.getElementById('workoutTimer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    
    // Add warmup card
    if (warmupExercises.length > 0) {
        const warmupCard = document.createElement('div');
        warmupCard.className = 'exercise-section-card';
        warmupCard.innerHTML = `
            <h3 class="section-title">🔥 Warm Up</h3>
            <div class="section-exercises">
                ${warmupExercises.map(ex => `<span class="exercise-chip">${exerciseInfo[ex.name].emoji} ${ex.name}</span>`).join('')}
            </div>
        `;
        exerciseList.appendChild(warmupCard);
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
            <div class="exercise-icon-container">
                <div class="exercise-icon">${info.emoji}</div>
            </div>
            <div class="exercise-name">${exercise.name}</div>
            ${isInProgress ? '<div class="exercise-status-dot"></div>' : ''}
            <div class="exercise-arrow">›</div>
        `;
        
        // Add click event listener
        exerciseItem.addEventListener('click', () => openExerciseSheet(exercise.name));
        
        exerciseList.appendChild(exerciseItem);
    });
    
    // Add cooldown card
    if (cooldownExercises.length > 0) {
        const cooldownCard = document.createElement('div');
        cooldownCard.className = 'exercise-section-card';
        cooldownCard.innerHTML = `
            <h3 class="section-title">❄️ Cool Down</h3>
            <div class="section-exercises">
                ${cooldownExercises.map(ex => `<span class="exercise-chip">${exerciseInfo[ex.name].emoji} ${ex.name}</span>`).join('')}
            </div>
        `;
        exerciseList.appendChild(cooldownCard);
    }
    
    checkWorkoutCompletion();
}

// Render sets for an exercise
function renderSets(exerciseName) {
    const sets = exerciseData[exerciseName].sets;
    return sets.map((set, index) => `
        <div class="set-item">
            <button class="btn-remove-set" onclick="removeSet('${exerciseName}', ${index})">×</button>
            <input type="number" 
                   class="weight-input" 
                   placeholder="Weight" 
                   value="${set.weight}" 
                   onchange="updateWeight('${exerciseName}', ${index}, this.value)"
                   min="0">
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
        weight: workoutData.lastWeights[`${currentWorkout}-${exerciseName}`] || '',
        reps: workoutData.lastReps[`${currentWorkout}-${exerciseName}`] || 12
    });
    if (currentSheetExercise === exerciseName) {
        updateSheetSets();
    } else {
        updateExerciseList();
    }
}

// Remove a set from an exercise
function removeSet(exerciseName, setIndex) {
    exerciseData[exerciseName].sets.splice(setIndex, 1);
    if (currentSheetExercise === exerciseName) {
        updateSheetSets();
    } else {
        updateExerciseList();
    }
}

// Update weight for a set
function updateWeight(exerciseName, setIndex, weight) {
    exerciseData[exerciseName].sets[setIndex].weight = weight;
}

// Update reps for a set
function updateReps(exerciseName, setIndex, change) {
    const currentReps = exerciseData[exerciseName].sets[setIndex].reps;
    const newReps = Math.max(1, currentReps + change);
    exerciseData[exerciseName].sets[setIndex].reps = newReps;
    if (currentSheetExercise === exerciseName) {
        updateSheetSets();
    } else {
        updateExerciseList();
    }
}

// Mark exercise as complete
function markExerciseComplete(exerciseName) {
    exerciseData[exerciseName].completed = true;
    updateExerciseList();
}

// Check if workout can be completed
function checkWorkoutCompletion() {
    const hasCompletedExercises = Object.values(exerciseData).some(exercise => 
        exercise.completed
    );
    
    const completeBtn = document.getElementById('completeWorkoutBtn');
    if (hasCompletedExercises) {
        completeBtn.classList.remove('hidden');
    } else {
        completeBtn.classList.add('hidden');
    }
}

// Complete workout
function completeWorkout() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    const workoutDuration = workoutStartTime ? new Date() - workoutStartTime : 0;
    
    // Save workout data
    workoutData.currentCycle.push(currentWorkout);
    workoutData.totalWorkouts++;
    
    // Update last weights, reps, and sets
    Object.entries(exerciseData).forEach(([exerciseName, data]) => {
        if (data.completed && data.sets.some(set => set.weight && set.weight > 0)) {
            const key = `${currentWorkout}-${exerciseName}`;
            
            // Get the last set with weight
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
    
    // Remove from pending workouts since it's now completed
    if (workoutData.pendingWorkouts[currentWorkout]) {
        delete workoutData.pendingWorkouts[currentWorkout];
        saveWorkoutData();
    }
    
    // Return to home screen
    showHomeScreen();
}

// Cancel workout
function cancelWorkout() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Check if any exercises are completed or have weight entered
    const hasProgress = Object.values(exerciseData).some(exercise => 
        exercise.completed || exercise.sets.some(set => set.weight && set.weight > 0)
    );
    
    if (hasProgress) {
        // Save progress as pending workout
        workoutData.pendingWorkouts[currentWorkout] = {
            exerciseData: JSON.parse(JSON.stringify(exerciseData)),
            startTime: workoutStartTime
        };
        saveWorkoutData();
    }
    
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
        
        // Check if workout was done on this day
        const dayDate = new Date(year, month, day);
        const hasWorkout = workoutData.history.some(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.toDateString() === dayDate.toDateString();
        });
        
        if (hasWorkout) {
            dayElement.classList.add('workout-day');
        }
        
        dayElement.addEventListener('click', () => showWorkoutDetails(dayDate));
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
    
    let detailsHtml = `
        <h3>${workoutExercises[workout.type].title} - ${date.toLocaleDateString()}</h3>
    `;
    
    Object.entries(workout.exercises).forEach(([exerciseName, sets]) => {
        if (sets.length > 0) {
            detailsHtml += `
                <div class="exercise-detail">
                    <div class="exercise-detail-name">${exerciseInfo[exerciseName].emoji} ${exerciseName}</div>
                    <div class="exercise-detail-sets">
                        ${sets.map(set => `${set.weight}lbs × ${set.reps}`).join(', ')}
                    </div>
                </div>
            `;
        }
    });
    
    workoutDetailsDiv.innerHTML = detailsHtml;
    workoutDetailsDiv.classList.remove('hidden');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);