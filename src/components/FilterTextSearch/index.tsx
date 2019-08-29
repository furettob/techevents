import * as React from 'react'
import TextInput from 'react-autocomplete-input';

type State = {
};

type Props = {
  optionsForTextInput: string[], 
  handleTxtWithSuggestionSearchChange: (string) => void
};

export default class FilterTimeRange extends React.Component<Props, State> {

  render() {
    return  (
      <div className={"te-text-search"}>
        <TextInput
          Component={"input"}
          placeholder={"Search"}
          options={this.props.optionsForTextInput}
          trigger={""}
          matchAny={true}
          onChange={this.props.handleTxtWithSuggestionSearchChange}
        />
      </div>
    )
  }
}

