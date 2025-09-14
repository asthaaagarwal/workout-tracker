import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Home, Calendar, BarChart3 } from 'lucide-react';

/* Core CSS and theme */
import './styles/global.scss';

/* Pages */
import HomePage from './pages/HomePage';
import WorkoutPage from './pages/WorkoutPage';
import CalendarPage from './pages/CalendarPage';
import StatsPage from './pages/StatsPage';

/* Context Provider */
import { WorkoutProvider } from './store/WorkoutContext';

setupIonicReact({
  mode: 'ios', // Force iOS design for consistency
});

const App: React.FC = () => (
  <IonApp>
    <WorkoutProvider>
      <div className="app-container">
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home">
                <HomePage />
              </Route>
              <Route exact path="/workout/:type">
                <WorkoutPage />
              </Route>
              <Route exact path="/calendar">
                <CalendarPage />
              </Route>
              <Route exact path="/stats">
                <StatsPage />
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <Home size={24} />
              </IonTabButton>
              <IonTabButton tab="calendar" href="/calendar">
                <Calendar size={24} />
              </IonTabButton>
              <IonTabButton tab="stats" href="/stats">
                <BarChart3 size={24} />
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </div>
    </WorkoutProvider>
  </IonApp>
);

export default App;