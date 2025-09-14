import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { Check } from 'lucide-react';
import { useWorkoutOperations } from '../hooks/useWorkoutOperations';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { useWorkout } from '../store/WorkoutContext';
import { WorkoutType, WorkoutExerciseData } from '../types/workout.types';
import { WORKOUT_EXERCISES } from '../types/constants';
import ExerciseModal from '../components/ExerciseModal';

const WorkoutPage: React.FC = () => {
  const { type } = useParams<{ type: WorkoutType }>();
  const history = useHistory();
  const { state } = useWorkout();
  const { startWorkout, completeWorkout, cancelWorkout, isWorkoutOngoing, updateExerciseData } = useWorkoutOperations();
  const { formattedTime } = useWorkoutTimer(state.workoutStartTime);

  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const workoutTemplate = WORKOUT_EXERCISES[type];
  const ongoing = isWorkoutOngoing(type);

  const handleStartWorkout = () => {
    startWorkout(type);
  };

  const openExerciseModal = (exerciseName: string) => {
    setSelectedExercise(exerciseName);
    setModalOpen(true);
  };

  const closeExerciseModal = () => {
    setModalOpen(false);
    setSelectedExercise(null);
  };

  const saveExerciseData = (exerciseName: string, data: WorkoutExerciseData) => {
    updateExerciseData(exerciseName, data);
  };

  const handleComplete = () => {
    completeWorkout();
    history.push('/home');
  };

  const handleCancel = () => {
    cancelWorkout();
    history.push('/home');
  };

  if (!workoutTemplate) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonText color="danger">Workout not found</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Back" />
          </IonButtons>
          <IonTitle>{workoutTemplate.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="workout-container">
          {/* Timer - only show when workout is ongoing */}
          {ongoing && (
            <div className="ion-text-center">
              <div className="timer-display">
                {formattedTime}
              </div>
            </div>
          )}

          {/* Warm-up Exercises */}
          <IonCard className="custom-card">
          <IonCardContent>
            <h3 className="section-title">Warm-up</h3>
            {workoutTemplate.exercises
              .filter(exercise => exercise.type === 'warmup')
              .map((exercise, index) => {
                const exerciseData = state.exerciseData[exercise.name];
                const isCompleted = exerciseData?.completed || false;
                const completedSets = exerciseData?.sets.filter(set => set.weight && parseFloat(String(set.weight)) > 0).length || 0;

                return (
                  <div
                    key={index}
                    className={`exercise-row ${isCompleted ? 'completed' : ''}`}
                    onClick={() => openExerciseModal(exercise.name)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <strong>{exercise.name}</strong>
                        {isCompleted && (
                          <Check
                            size={20}
                            color="var(--ion-color-success)"
                            style={{ marginLeft: '8px' }}
                          />
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--ion-color-medium)' }}>
                        {exercise.sets} sets planned
                        {completedSets > 0 && ` • ${completedSets} completed`}
                      </div>
                    </div>

                    <div style={{ color: 'var(--ion-color-primary)', fontSize: '14px' }}>
                      Tap to {ongoing ? 'edit' : 'view'}
                    </div>
                  </div>
                );
              })}
          </IonCardContent>
        </IonCard>

        {/* Main Exercises */}
        <IonCard className="custom-card">
          <IonCardContent>
            <h3 className="section-title">Main Exercises</h3>
            {workoutTemplate.exercises
              .filter(exercise => !exercise.type || (exercise.type !== 'warmup' && exercise.type !== 'cooldown'))
              .map((exercise, index) => {
                const exerciseData = state.exerciseData[exercise.name];
                const isCompleted = exerciseData?.completed || false;
                const completedSets = exerciseData?.sets.filter(set => set.weight && parseFloat(String(set.weight)) > 0).length || 0;

                return (
                  <div
                    key={index}
                    className={`exercise-row ${isCompleted ? 'completed' : ''}`}
                    onClick={() => openExerciseModal(exercise.name)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <strong>{exercise.name}</strong>
                        {isCompleted && (
                          <Check
                            size={20}
                            color="var(--ion-color-success)"
                            style={{ marginLeft: '8px' }}
                          />
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--ion-color-medium)' }}>
                        {exercise.sets} sets planned
                        {completedSets > 0 && ` • ${completedSets} completed`}
                      </div>
                    </div>

                    <div style={{ color: 'var(--ion-color-primary)', fontSize: '14px' }}>
                      Tap to {ongoing ? 'edit' : 'view'}
                    </div>
                  </div>
                );
              })}
          </IonCardContent>
        </IonCard>

        {/* Cooldown Exercises */}
        <IonCard className="custom-card">
          <IonCardContent>
            <h3 className="section-title">Cooldown</h3>
            {workoutTemplate.exercises
              .filter(exercise => exercise.type === 'cooldown')
              .map((exercise, index) => {
                const exerciseData = state.exerciseData[exercise.name];
                const isCompleted = exerciseData?.completed || false;
                const completedSets = exerciseData?.sets.filter(set => set.weight && parseFloat(String(set.weight)) > 0).length || 0;

                return (
                  <div
                    key={index}
                    className={`exercise-row ${isCompleted ? 'completed' : ''}`}
                    onClick={() => openExerciseModal(exercise.name)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <strong>{exercise.name}</strong>
                        {isCompleted && (
                          <Check
                            size={20}
                            color="var(--ion-color-success)"
                            style={{ marginLeft: '8px' }}
                          />
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--ion-color-medium)' }}>
                        {exercise.sets} sets planned
                        {completedSets > 0 && ` • ${completedSets} completed`}
                      </div>
                    </div>

                    <div style={{ color: 'var(--ion-color-primary)', fontSize: '14px' }}>
                      Tap to {ongoing ? 'edit' : 'view'}
                    </div>
                  </div>
                );
              })}
          </IonCardContent>
        </IonCard>

          {/* Action Buttons */}
          <div>
            {!ongoing ? (
              <IonButton
                expand="block"
                fill="solid"
                color="dark"
                onClick={handleStartWorkout}
              >
                Start Workout
              </IonButton>
            ) : (
              <>
                <IonButton
                  expand="block"
                  fill="solid"
                  color="dark"
                  onClick={handleComplete}
                >
                  Complete Workout
                </IonButton>

                <IonButton
                  className="btn-secondary"
                  expand="block"
                  fill="outline"
                  onClick={handleCancel}
                  style={{ marginTop: '16px' }}
                >
                  Cancel Workout
                </IonButton>
              </>
            )}
          </div>
        </div>

        {/* Exercise Modal */}
        {selectedExercise && (
          <ExerciseModal
            isOpen={modalOpen}
            onDismiss={closeExerciseModal}
            exerciseName={selectedExercise}
            exerciseData={state.exerciseData[selectedExercise] || { sets: [{ weight: undefined, reps: 12 }], completed: false }}
            onSave={(data) => saveExerciseData(selectedExercise, data)}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default WorkoutPage;