import * as React from 'react'
import Event from '../../components/Event';
import {EventType} from '../../utils/types';

type State = {
};

type Props = {
  title?: String, 
  date?: String, 
  events: Array<EventType>
  buttonType?: string
};

export default class EventGroup extends React.Component<Props, State> {

  render() {
    return  <div className="te-events-by-date">
              <div className="te-date">
                <h2 className="te-ph-16">{this.props.title}</h2>
                <div className="te-event-group">
                  {
                    this.props.events.map( (event, index) => {
                      return <Event key={event.id} event={event} buttonType={this.props.buttonType}/>
                    })
                  }
                </div>
              </div>
            </div>
  }
}