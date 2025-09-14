import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButtons,
  IonCheckbox
} from '@ionic/react';
import { Plus, Minus, X } from 'lucide-react';
import { WorkoutExerciseData, WorkoutSet } from '../types/workout.types';

interface ExerciseModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  exerciseName: string;
  exerciseData: WorkoutExerciseData;
  onSave: (data: WorkoutExerciseData) => void;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onDismiss,
  exerciseName,
  exerciseData,
  onSave
}) => {
  const [localData, setLocalData] = useState<WorkoutExerciseData>(exerciseData);

  useEffect(() => {
    setLocalData(exerciseData);
  }, [exerciseData, isOpen]);

  const handleSave = () => {
    onSave(localData);
    onDismiss();
  };

  const updateSet = (setIndex: number, field: 'weight' | 'reps', value: string | number) => {
    const updatedSets = localData.sets.map((set, index) => {
      if (index === setIndex) {
        return { ...set, [field]: value };
      }
      return set;
    });

    setLocalData({ ...localData, sets: updatedSets });
  };

  const addSet = () => {
    const newSet: WorkoutSet = {
      weight: localData.sets.length > 0 ? localData.sets[localData.sets.length - 1].weight : undefined,
      reps: 12
    };
    setLocalData({ ...localData, sets: [...localData.sets, newSet] });
  };

  const removeSet = (setIndex: number) => {
    if (localData.sets.length > 1) {
      const updatedSets = localData.sets.filter((_, index) => index !== setIndex);
      setLocalData({ ...localData, sets: updatedSets });
    }
  };

  const toggleCompleted = () => {
    setLocalData({ ...localData, completed: !localData.completed });
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      presentingElement={undefined}
      canDismiss={true}
      breakpoints={[0, 0.5, 0.75, 1]}
      initialBreakpoint={0.75}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{exerciseName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* Sets */}
        <IonCard>
          <IonCardContent>
            {localData.sets.map((set, setIndex) => (
              <div key={setIndex} className="set-row">
                <input
                  type="number"
                  className="weight-input"
                  value={set.weight || ''}
                  onChange={(e) => updateSet(setIndex, 'weight', e.target.value)}
                  placeholder="Weight (kg)"
                />
                <div className="reps-button-group">
                  <button
                    className="reps-button minus"
                    onClick={() => updateSet(setIndex, 'reps', Math.max(1, set.reps - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="reps-display">
                    {set.reps}
                  </span>
                  <button
                    className="reps-button plus"
                    onClick={() => updateSet(setIndex, 'reps', set.reps + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="remove-set-btn"
                  onClick={() => removeSet(setIndex)}
                  disabled={localData.sets.length <= 1}
                >
                  <X size={20} />
                </button>
              </div>
            ))}

            <IonButton
              expand="block"
              fill="outline"
              onClick={addSet}
              style={{ marginTop: '16px' }}
            >
              <Plus size={20} style={{ marginRight: '8px' }} />
              Add Set
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Save Button */}
        <IonButton
          expand="block"
          fill="solid"
          color="dark"
          onClick={handleSave}
          style={{ marginTop: '24px' }}
        >
          Save Exercise
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default ExerciseModal;