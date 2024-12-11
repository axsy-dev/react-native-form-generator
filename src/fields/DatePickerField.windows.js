"use strict";

import React from "react";
import { DatePickerComponent } from "../lib/DatePickerComponent";

export class DatePickerField extends React.Component {
  constructor(props) {
    super(props);
    this.datePickerComponentRef = React.createRef();
  }
  setDate(date) {
    if (this.datePickerComponentRef.current) {
      this.datePickerComponentRef.current.setDate(date);
    }
  }

  render() {
    return (
      <DatePickerComponent
        {...this.props}
        ref={this.datePickerComponentRef}
        labelStyle={this.props.labelStyle}
        valueStyle={this.props.valueStyle}
        valueContainerStyle={this.props.valueContainerStyle}
        containerStyle={this.props.containerStyle}
      />
    );
  }
}
