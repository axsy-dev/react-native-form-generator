"use strict";

import React from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";

import { DatePickerComponent } from "../lib/DatePickerComponent";

export class DatePickerField extends React.Component {
  setDate(date) {
    this.refs.datePickerComponent.setDate(date);
  }

  render() {
    return (
      <DatePickerComponent
        {...this.props}
        ref="datePickerComponent"
        labelStyle={this.props.labelStyle}
        valueStyle={this.props.valueStyle}
        valueContainerStyle={this.props.valueContainerStyle}
        containerStyle={this.props.containerStyle}
      />
    );
  }
}
