import * as React from 'react'
import * as dataHub from '../../utils/DataHub';
import EventGroup from '../../components/EventGroup';
import {EventType, EventFilterType} from '../../utils/types';
import Filters from '../../components/Filters';
import FilterFree from '../../components/FilterFree';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
 
type State = {
  filters: EventFilterType, 
  error?: Object,
  events: Array<EventType>,
  loading: boolean,
  optionsForTextInput: string[]
};

type Props = {
  logged?: String
};

export default class AllEvents extends React.Component<Props, State> {
  state = {
    filters:{
      myEvents:false,
      onlyFreeEvents:false,
      txtSearch:"",
      timeRangeStart:undefined,
      timeRangeEnd:undefined
    },
    optionsForTextInput:[],
    events: [],
    error: undefined,
    loading: true
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.getEventsByDate()
    this.getOptionsForTextInput()
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

  onSignupClickedCallback = () => {
    console.log("onSignupClickedCallback")
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
          <div className={"te-time-range-select"}>
            <select className={"te-fs-16 te-p-16" + (this.state.filters.timeRangeStart ? "" : " te-no-value")} onChange={ (ev) => { this.handleTimeRangeChange(ev) }} defaultValue={""}>
              {/*  morning (6am - 12 pm), afternoon (12pm - 17pm), evening (17pm - 21pm) or night (21pm - 6am) */}
              <option value={"none"}>Choose day time</option>
              <option value={"morning"}>Morning</option>
              <option value={"afternoon"}>Afternoon</option>
              <option value={"evening"}>Evening</option>
              <option value={"night"}>Night</option>
            </select>
          </div>
          <div className={"te-text-search"}>
            <TextInput
              Component={"input"}
              placeholder={"Search"}
              options={this.state.optionsForTextInput}
              trigger={""}
              matchAny={true}
              onChange={this.handleTxtWithSuggestionSearchChange}
            />
          </div>
        </Filters>
        {Object.keys(this.state.events).map( (timestamp, index) => {
          return  <EventGroup
            key={timestamp + "_" + String(index)}
            title={this.state.events[timestamp].title}
            date={this.state.events[timestamp].date}
            events={this.state.events[timestamp].events}
            buttonType="SignUp"
            buttonCallback={this.onSignupClickedCallback}
          />
        })}
      </div>
    );
  }
}