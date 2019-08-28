import * as React from 'react'
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

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
            <Route exact path="/allevents" component={AllEvents} />
            <Route exact path="/myevents" component={MyEvents} />
            <Redirect from="/" to="/allevents" />
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
 