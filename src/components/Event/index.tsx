import * as React from 'react'
import Moment from 'moment';
import SignUpEventModal from '../../components/SignUpEventModal'
import * as dataHub from '../../utils/DataHub';
import {EventType, EventFilterType} from '../../utils/types';

type State = {
  modalVisible: boolean
};

type Props = {
  event: EventType,
  buttonType?: string
};

export default class Event extends React.Component<Props, State> {
  state = {
    modalVisible: false
  }

  onSignUpClick = () => {
    console.log("on sign up click")
    this.setState({modalVisible:true})
  }

  closeModal = () => {
    console.log("closeModal")
    this.setState({modalVisible:false})
  }

  renderFreeBadge = () => {
    if (this.props.event.isFree) {
      return  <span className="te-green"> Free!!!</span>
    }
    return ""
  }

  renderDescription = () => {
    return <span>{this.getCity()} - {this.getDuration()}</span>
  }

  renderButton = () => {
    if (this.props.buttonType === "SignUp") {
      return (
        <div className="te-button">
          <div className="te-button-inner">
            <button className="te-btn-primary te-btn-extended te-fs-16" onClick={this.onSignUpClick}>Sign Up</button>
          </div>
        </div>
      )
    }
    if (this.props.buttonType === "Cancel") {
      return (
        <div className="te-button">
          <div className="te-button-inner">
            <button className="te-btn-primary te-btn-extended te-fs-16" onClick={this.onSignUpClick}>Cancel</button>
          </div>
        </div>
      )
    }
  }

  renderModal = () => {
    if (this.state.modalVisible === true) {
      return (
        <SignUpEventModal event={this.props.event} onClose={this.closeModal} onSubmit={() => {dataHub.signUpToEvent(this.props.event) } } />
      )
    }
    return ""
  }

  getTime = () => {
    if (this.props.event.startDate) {
      return Moment(new Date(this.props.event.startDate)).utcOffset(0).format('HH:mm')
    }
    return "Unknown"
  }

  getTitle = () => {
    return <span>{this.props.event.name}</span>
  }

  getDuration = () => {
    try {
      const duration = new Date(this.props.event.endDate).getTime() - new Date(this.props.event.startDate).getTime()
      const h = Math.floor(duration / 1000 / 60 / 60);
      const m = Math.floor(duration / 1000 / 60 - 60 * h);
      const hString = h && h > 0 ? h + "h" : ""
      const mString = m && m > 0 ? m + "min" : ""
      // const sep = hString !== "" && mString !== "" ? " " : ""
      return <span>{hString}&nbsp;{mString}</span>
    } catch (e) {
      console.log(e)
      return "TBD"
    }
  }

  getCity = () => {
    return this.props.event.cityName || "To be defined"
  }

  render() {
    return  (
      <React.Fragment>
        <div className="te-pv-8 te-event">
          <div className="te-hour">
            <div className="te-hour-text">
              {this.getTime()}
            </div>
          </div>
          <div className="te-p-16 te-text">
            <h2 className="te-title te-m-0">{this.getTitle()} {this.renderFreeBadge()}</h2>
            <p className="te-description te-mb-0 fc-gray-7">{this.renderDescription()}</p>
          </div>
          {this.renderButton()}
        </div>
        {this.renderModal()}
      </React.Fragment>
    )
  }
}