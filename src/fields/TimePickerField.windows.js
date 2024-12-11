"use strict";

import React from "react";
import ReactNative from "react-native";

import { DatePickerComponent } from "../lib/DatePickerComponent";

export class TimePickerField extends React.Component {
  constructor(props) {
    super(props);
    this.timePickerFieldRef = React.createRef();
  }
  setTime(date) {
    if (this.timePickerFieldRef.current) {
      this.timePickerFieldRef.current.setDate(date);
    }
  }
  render() {
    return (
      <DatePickerComponent
        {...this.props}
        ref={this.timePickerFieldRef}
        mode="time"
        labelStyle={this.props.labelStyle}
        valueStyle={this.props.valueStyle}
        valueContainerStyle={this.props.valueContainerStyle}
        containerStyle={this.props.containerStyle}
      />
    );
  }
}
