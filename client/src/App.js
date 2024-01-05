import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    NavigationBanner,
    SplashScreen,
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    Statusbar,
    WorkspaceScreen,
    MUIAccountErrorModal,

    PlaylisterYouTubePlayer,
    PlayerAndComments,
} from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const WithPlayerAndComments = ({ children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr', height: '80%' }}>
      {children}
      <PlayerAndComments />
    </div>
  );
  
  const App = () => {
    return (
      <BrowserRouter>
        <AuthContextProvider>
          <GlobalStoreContextProvider>
            <AppBanner />
            <NavigationBanner />
            <div
              style={{
                display: 'grid',
                gridTemplateRows: '9fr 2fr',
                height: '80%',
              }}
            >
              <Switch>
                <Route path="/" exact component={SplashScreen} />
                {/* Route with PlayerAndComments */}
                <Route path="/home">
                  <WithPlayerAndComments>
                    <HomeScreen />
                  </WithPlayerAndComments>
                </Route>
                {/* Route with PlayerAndComments */}
                <Route path="/playlist/:id">
                  <WithPlayerAndComments>
                    <WorkspaceScreen />
                  </WithPlayerAndComments>
                </Route>
                <Route path="/login/" exact component={LoginScreen} />
                <Route path="/register/" exact component={RegisterScreen} />
              </Switch>
              <div id="statusbar-container">
              <Statusbar />
                </div>
            </div>
            <MUIAccountErrorModal />
          </GlobalStoreContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    );
  };
  

export default App