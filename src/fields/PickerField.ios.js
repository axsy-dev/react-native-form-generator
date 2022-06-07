"use strict";

import React from "react";
import ReactNative from "react-native";
let { StyleSheet } = ReactNative;

import { PickerComponent } from "../lib/PickerComponent";

export class PickerField extends React.Component {
  setValue(value) {
    this.refs.fieldComponent.setValue(value);
  }
  render() {
    return (
      <PickerComponent
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
