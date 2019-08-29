import * as React from 'react'
import { NavLink } from 'react-router-dom';

type State = {};

type Props = {};

const Navigation: React.FC = () => {

  return (
    <div className="te-navigation te-bg-white">
      <div className="te-nav-inner">
        <div className="te-logo-wrapper">
          <img src="/img/te-logo.png" alt="Hitchhikers" title="Hitchhikers"/>
        </div>
        <ul className="te-p-8 te-m-0">
          <li>
            <NavLink activeClassName={"te-active-link"} to={"/allevents"}>All Events</NavLink>
          </li>
          <li>
            <NavLink activeClassName={"te-active-link"} to={"/myevents"}>My Events</NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navigation; 
