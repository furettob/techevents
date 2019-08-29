import * as React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import './te.css';
import Navigation from './components/Navigation/';
import AllEvents from './pages/AllEvents/';

const App: React.FC = () => {
  return (
    <div className="App te-app">
      <div>
        <Router>
          <Navigation/>
          <div className="te-content">
            <Switch>
              <Route path="/allevents" render={ () => <AllEvents myEvents={false} key={0}/> } />
              <Route path="/myevents" render={ () => <AllEvents myEvents={true} key={1}/> } />
              <Route render={() => (<Redirect to="/allevents" />)}/>
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
 