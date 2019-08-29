import * as React from 'react'
import Event from '../../components/Event';
import {EventType} from '../../utils/types';
import Switch from "react-switch";

type State = {
};

type Props = {
  onlyFreeEvents: boolean, 
  handleFilterFreeChange: () => void
};

export default class FilterFree extends React.Component<Props, State> {

  render() {
    return  (
      <div className="te-switch-group">
        <div className={"te-toggle-label te-on " + (this.props.onlyFreeEvents ? " te-selected" : "")}>Free only</div>
        <div className="te-ph-8 te-switch-wrapper">
          <Switch
            onChange={this.props.handleFilterFreeChange}
            checked={this.props.onlyFreeEvents}
            offColor={"#127fab"}
            onColor={"#458314"}
            height={32}
            width={64}
          />
        </div>
        <div className={"te-toggle-label te-off " + (this.props.onlyFreeEvents ? "" : " te-selected")}>All events</div>
      </div>
    )
  }
}