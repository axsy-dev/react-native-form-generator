"use strict";

import React from "react";
import ReactNative from "react-native";

import { DatePickerComponent } from "../lib/DatePickerComponent";

export class TimePickerField extends React.Component {
  constructor(props) {
    super(props);
    this.datePickerRef = React.createRef();
  }
  setTime(date) {
    if (this.datePickerRef.current) {
      this.datePickerRef.current.setDate(date);
    }
  }
  render() {
    return (
      <DatePickerComponent
        {...this.props}
        ref={this.datePickerRef}
        mode="time"
        labelStyle={this.props.labelStyle}
        valueStyle={this.props.valueStyle}
        valueContainerStyle={this.props.valueContainerStyle}
        containerStyle={this.props.containerStyle}
      />
    );
  }
}
