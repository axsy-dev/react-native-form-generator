"use strict";

import React from "react";
import ReactNative from "react-native";
let { View, StyleSheet, TextInput, Text } = ReactNative;

import { TimePickerComponent } from "../lib/TimePickerComponent";

export class TimePickerField extends React.Component {
  setTime(date) {
    this.refs.datePickerComponent.setTime(date);
  }

  render() {
    return (
      <TimePickerComponent
        {...this.props}
        ref="fieldComponent"
        labelStyle={this.props.labelStyle}
        valueStyle={this.props.valueStyle}
        valueContainerStyle={this.props.valueContainerStyle}
        containerStyle={this.props.containerStyle}
      />
    );
  }
}
