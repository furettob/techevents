import * as React from 'react'
import * as dataHub from '../../utils/DataHub';
import EventGroup from '../../components/EventGroup';
import {EventType, EventFilterType} from '../../utils/types';
import Filters from '../../components/Filters';
import FilterFree from '../../components/FilterFree';
import FilterTimeRange from '../../components/FilterTimeRange';
import FilterTextSearch from '../../components/FilterTextSearch';
import 'react-autocomplete-input/dist/bundle.css';
import { Link } from 'react-router-dom';


type State = {
  filters: EventFilterType, 
  error?: Object,
  events: Array<EventType>,
  loading: boolean,
  optionsForTextInput: string[]
};

type Props = {
  myEvents?: boolean
};

export default class AllEvents extends React.Component<Props, State> {
  state = {
    filters:{
      myEvents:this.props.myEvents,
      onlyFreeEvents:false,
      txtSearch:"",
      timeRangeStart:undefined,
      timeRangeEnd:undefined
    },
    error: undefined,
    events: [],
    loading: true,
    optionsForTextInput:[]
  }

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.setState({ loading: true, filters:{...this.state.filters, myEvents:this.props.myEvents} }, () => { console.log("STATE:::: ", this.state) });
    this.getEventsByDate()
    this.getOptionsForTextInput()
  }

  onlyMyEvents = () => {
    return this.state.filters.myEvents;
  }

  async getEventsByDate() {
    const result = await dataHub.getEventsByDate(this.state.filters)
    if (result.error) {
      this.setState({error:result.error, loading: false})
      return
    }
    this.setState({events:result, loading: false}, )
  }

  async getOptionsForTextInput() {
    const result = await dataHub.getOptionsForTextInput()
    if (result.error) {
      this.setState({error:result.error, loading: false})
      return
    }
    this.setState({optionsForTextInput:result})
  }

  getButtonText() {
    return this.onlyMyEvents() ? "Cancel" : "SignUp"
  }

  getButtonCallback() {
    return this.onlyMyEvents() ?
    this.onCancelFromEventCallback :
    this.onSignupClickedCallback
  }

  onSignupClickedCallback = () => {
    console.log("onSignupClickedCallback")
  }

  onCancelFromEventCallback = () => {
    console.log("onCancelFromEventCallback")
    this.getEventsByDate()
  }

  handleFilterFreeChange = () => {
    this.setState(prevState => {
      return {
        filters: {...prevState.filters, onlyFreeEvents: !prevState.filters.onlyFreeEvents}
      };
    }, this.getEventsByDate);
  }

  handleTimeRangeChange = (ev) => {
    const option: number = ev.target.value
    const timeTable = {
      none:{timeRangeStart:undefined, timeRangeEnd: undefined},
      morning:{timeRangeStart:6, timeRangeEnd: 12},
      afternoon:{timeRangeStart:12, timeRangeEnd: 17},
      evening:{timeRangeStart:17, timeRangeEnd: 21},
      night:{timeRangeStart:21, timeRangeEnd: 6}
    }
    console.log(ev)
    console.log("VALUE: ", option, timeTable[option].timeRangeStart,
                  timeTable[option].timeRangeEnd)
    console.log("handle change time!")
    this.setState(prevState => {
      return {
        filters: {
                  ...prevState.filters,
                  timeRangeStart: timeTable[option].timeRangeStart,
                  timeRangeEnd: timeTable[option].timeRangeEnd
                }
      };
    }, this.getEventsByDate);
  }

  handleTxtSearchChange = (ev) => {
    console.log(ev)
    const val = ev.target.value;
    this.setState(prevState => {
      return {
        filters: {...prevState.filters, txtSearch: val}
      };
    }, this.getEventsByDate);
  }

  handleTxtWithSuggestionSearchChange = (text) => {
    this.setState(prevState => {
      return {
        filters: {...prevState.filters, txtSearch: text}
      };
    }, this.getEventsByDate);
  }

  renderEventGroupList = () => {
    if (Object.keys(this.state.events).length === 0) {
      if (this.onlyMyEvents()) {
        return <div className="te-no-events"><p>You are not signed up to any event matching this search.</p><p>Make a new search or</p><p><Link className="te-cta" to={"/allevents"}>Find your event here!</Link></p></div>
      } else {
        return <div className="te-no-events"><p>There are no events matching your request.</p><p>Make a new one or come back later :)</p></div>
      }
    }
    return Object.keys(this.state.events).map( (timestamp, index) => {
          return  <EventGroup
            key={timestamp + "_" + String(index)}
            title={this.state.events[timestamp].title}
            date={this.state.events[timestamp].date}
            events={this.state.events[timestamp].events}
            buttonType={this.getButtonText()}
            buttonCallback={this.getButtonCallback()}
          />
  })}

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
        <h1>All Events</h1>
        <Filters>
          <FilterFree handleFilterFreeChange={this.handleFilterFreeChange} onlyFreeEvents={this.state.filters.onlyFreeEvents}/>
          <FilterTimeRange handleTimeRangeChange={this.handleTimeRangeChange} timeRangeStart={this.state.filters.timeRangeStart}/>
          <FilterTextSearch handleTxtWithSuggestionSearchChange={this.handleTxtWithSuggestionSearchChange} optionsForTextInput={this.state.optionsForTextInput} />
        </Filters>
        { this.renderEventGroupList()}
      </div>
    );
  }
}