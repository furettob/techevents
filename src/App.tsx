import * as React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

//import logo from './logo.svg';
import './te.css';
import Navigation from './components/Navigation/';
import AllEvents from './pages/AllEvents/';
import MyEvents from './pages/MyEvents/';

const App: React.FC = () => {
  return (
    <div className="App te-app">
      <div>
        <Router>
          <Navigation/>
          <div className="te-content">
            <Switch>
              <Route path="/allevents" component={AllEvents} />
              <Route path="/myevents" component={MyEvents} />
              <Route render={() => (<Redirect to="/allevents" />)}/>
            </Switch>

          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
 