import * as React from 'react'

type State = {
  checked: boolean
};

type Props = {
};

export default class FilterRow extends React.Component<Props, State> {
 
  render() {
    return  <div className="te-filters-row">
              {this.props.children}
            </div>
  }
}