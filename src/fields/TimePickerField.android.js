"use strict";

import React from "react";

import { TimePickerComponent } from "../lib/TimePickerComponent";

export class TimePickerField extends React.Component {
  constructor(props) {
    super(props);
    this.datePickerRef = React.createRef();
  }
  setTime(date) {
    if (this.datePickerRef.current) {
      this.datePickerRef.current.setTime(date);
    }
  }

  render() {
    return (
      <TimePickerComponent
        {...this.props}
        ref={this.datePickerRef}
        labelStyle={this.props.labelStyle}
        valueStyle={this.props.valueStyle}
        valueContainerStyle={this.props.valueContainerStyle}
        containerStyle={this.props.containerStyle}
      />
    );
  }
}
