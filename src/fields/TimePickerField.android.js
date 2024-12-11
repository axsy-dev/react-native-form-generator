"use strict";

import React from "react";

import { TimePickerComponent } from "../lib/TimePickerComponent";

export class TimePickerField extends React.Component {
  constructor(props) {
    super(props);
    this.timePickerFieldRef = React.createRef();
  }
  setTime(date) {
    if (this.timePickerFieldRef.current) {
      this.timePickerFieldRef.current.setTime(date);
    }
  }

  render() {
    return (
      <TimePickerComponent
        {...this.props}
        ref={this.timePickerFieldRef}
        labelStyle={this.props.labelStyle}
        valueStyle={this.props.valueStyle}
        valueContainerStyle={this.props.valueContainerStyle}
        containerStyle={this.props.containerStyle}
      />
    );
  }
}
