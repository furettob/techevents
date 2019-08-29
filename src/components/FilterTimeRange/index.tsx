import * as React from 'react'

type State = {
};

type Props = {
  timeRangeStart?: number, 
  handleTimeRangeChange: (any) => void
};

export default class FilterTimeRange extends React.Component<Props, State> {

  render() {
    return  (
      <div className={"te-time-range-select"}>
        <select className={"te-fs-16 te-p-16" + (this.props.timeRangeStart ? "" : " te-no-value")} onChange={ this.props.handleTimeRangeChange } defaultValue={"none"}>
          {/*  morning (6am - 12 pm), afternoon (12pm - 17pm), evening (17pm - 21pm) or night (21pm - 6am) */}
          <option value={"none"}>Choose day time</option>
          <option value={"morning"}>Morning</option>
          <option value={"afternoon"}>Afternoon</option>
          <option value={"evening"}>Evening</option>
          <option value={"night"}>Night</option>
        </select>
      </div>
    )
  }
}