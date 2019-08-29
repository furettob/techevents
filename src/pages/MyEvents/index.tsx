import * as React from 'react'
import * as dataHub from '../../utils/DataHub';
import EventGroup from '../../components/EventGroup';
import {EventType, EventFilterType}  from '../../utils/types';

type State = {
  filter?: String, 
  error?: Object,
  events: Array<EventType>,
  loading: boolean
};

type Props = {
  myEvents?: boolean
};

export default class AllEvents extends React.Component<Props, State> {
  state = {
    filter:"x",
    events: [],
    error: undefined,
    loading: true
  }

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.getEvents()
  }

  getEvents = async () => {
    const result = await dataHub.getEventsByDate({myEvents:true})
    if (result.error) {
      this.setState({error:result.error, loading: false})
      return
    }
    this.setState({events:result, loading: false})
  }

  onCancelFromEventCallback = () => {
    console.log("onCancelFromEventCallback")
    this.getEvents()
  }

  render() {

    if (this.state.loading) {
      return <div className="te-ta-c te-p-40">Loading ...</div>
    }

    if (this.state.error) {
      return  <div>
                <h1>Error</h1>
                <div>
                  {JSON.stringify(this.state.error)}
                </div>
              </div>
    }

    return (
      <div>
        <h1>My Events</h1>
        {Object.keys(this.state.events).map( (timestamp, index) => {
          return  <EventGroup
            key={timestamp + "_" + String(index)}
            title={this.state.events[timestamp].title}
            date={this.state.events[timestamp].date}
            events={this.state.events[timestamp].events}
            buttonType="Cancel"
            buttonCallback={this.onCancelFromEventCallback}
          />
        })}
      </div>
    );
  }
}