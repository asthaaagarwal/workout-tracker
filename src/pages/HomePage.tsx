import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonText
} from '@ionic/react';
import { useWorkout } from '../store/WorkoutContext';
import { useWorkoutOperations } from '../hooks/useWorkoutOperations';
import { useDailyCheckin } from '../hooks/useDailyCheckin';
import { WORKOUT_EXERCISES, WORKOUT_COLORS } from '../types/constants';
import { WorkoutType } from '../types/workout.types';

const HomePage: React.FC = () => {
  const history = useHistory();
  const { state } = useWorkout();
  const { isWorkoutOngoing, getDaysSinceLastWorkout } = useWorkoutOperations();
  const { hasTodaysEntry } = useDailyCheckin();

  const workoutTypes: WorkoutType[] = ['upper-body', 'lower-body', 'full-body'];

  const handleOpenWorkout = (workoutType: WorkoutType) => {
    // Navigate to workout page using React Router for smooth transition
    history.push(`/workout/${workoutType}`);
  };

  const getStatusText = (workoutType: WorkoutType) => {
    return isWorkoutOngoing(workoutType) ? 'Ongoing' : 'Available';
  };

  const getStatusClass = (workoutType: WorkoutType) => {
    return isWorkoutOngoing(workoutType) ? 'ongoing' : 'available';
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="home-container">
          {/* Daily Check-in Section */}
          <IonCard className="custom-card">
            <IonCardContent>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 16px 0', textAlign: 'center' }}>
                How are you feeling today?
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button className="mood-emoji">😊</button>
                <button className="mood-emoji">😐</button>
                <button className="mood-emoji">😔</button>
                <button className="mood-emoji">😴</button>
                <button className="mood-emoji">💪</button>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Workout Cards */}
          <div className="workout-list">
          {workoutTypes.map((workoutType) => {
            const template = WORKOUT_EXERCISES[workoutType];
            const ongoing = isWorkoutOngoing(workoutType);

            return (
              <IonCard
                key={workoutType}
                className={`workout-card ${getStatusClass(workoutType)}`}
                button
                onClick={() => handleOpenWorkout(workoutType)}
              >
                <IonCardContent>
                  <div className="workout-card-header">
                    <h3 className={`workout-card-title ${ongoing ? 'ongoing' : 'normal'}`}>
                      {template.title}
                    </h3>
                    {isWorkoutOngoing(workoutType) && (
                      <span className={`status-badge ${getStatusClass(workoutType)}`}>
                        {getStatusText(workoutType)}
                      </span>
                    )}
                  </div>
                  <p className={`workout-card-description ${ongoing ? 'ongoing' : 'normal'}`}>
                    {template.description}
                  </p>
                </IonCardContent>
              </IonCard>
            );
          })}
          </div>

          {/* Stats Card */}
          <IonCard className="stats-card">
          <IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--wt-text)',
                  display: 'block'
                }}>
                  {getDaysSinceLastWorkout()}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--wt-gray)',
                  marginTop: '4px'
                }}>
                  Days since last workout
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--wt-text)',
                  display: 'block'
                }}>
                  {state.workoutData.totalWorkouts}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--wt-gray)',
                  marginTop: '4px'
                }}>
                  Total workouts completed
                </div>
              </div>
            </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;