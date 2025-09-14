import React from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonText
} from '@ionic/react';

const CalendarPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard className="custom-card">
          <IonCardContent>
            <h2>Calendar View</h2>
            <IonText color="medium">
              <p>Calendar functionality will be implemented in Phase 3.</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;