import React from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonText
} from '@ionic/react';

const StatsPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard className="custom-card">
          <IonCardContent>
            <h2>Statistics</h2>
            <IonText color="medium">
              <p>Statistics functionality will be implemented in Phase 3.</p>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default StatsPage;