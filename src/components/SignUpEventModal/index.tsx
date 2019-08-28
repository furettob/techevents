import React from 'react';
import ReactDOM from 'react-dom';
import ReactFocusTrap from 'focus-trap-react';
import * as dataHub from '../../utils/DataHub';

const ModalContent = ({
  event,
  onClose,
  onSubmit,
  onClickAway = () => {console.log("click away")},
  role = 'dialog'
}) => {

  function onSubmitInner() {
    onSubmit()
    onClose()
  } 

  return ReactDOM.createPortal(
    <ReactFocusTrap
      role={role}
      aria-modal="true"
      onClick={onClickAway}
    >
      <div className="te-modal">
        <div className="te-modal-content te-p-40">
            <div>
              <p>You are about to sign up for the event <strong>{event.name}</strong>.</p>
              <p>This event will take place the {dataHub.getFormattedDate(event)} in {event.cityName}</p>
            </div>
            <div className="te-button-inner te-ta-r te-pt-16">
              <button onClick={onClose} className="te-fs-16 te-btn-primary te-btn-orange">Cancel</button>
              <button tabIndex={1} onClick={onSubmitInner} className="te-ml-24 te-fs-16 te-btn-primary">Join</button>
            </div>
            {/*<svg viewBox="0 0 40 40" className="c-modal__close-icon">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
            </svg>*/}
        </div>
      </div>
    </ReactFocusTrap>,
    document.body
  );
}

export default ModalContent