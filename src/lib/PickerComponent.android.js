"use strict";

import React from "react";
import ReactNative, { View, StyleSheet, TouchableOpacity } from "react-native";
import { Field } from "../lib/Field";

import {
  TestPathSegment,
  TText,
  TPicker,
  TPickerItem
} from "@axsy-dev/testable";
import _ from "lodash";

export class PickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.pickerMeasures = {};
  }
  setValue(value) {}
  handleLayoutChange = e => {
    let { x, y, width, height } = { ...e.nativeEvent.layout };
    this.setState(e.nativeEvent.layout);
  };
  handleValueChange = value => {
    this.setState({ value });

    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
  };

  render() {
    // prefer state value if set
    const value = this.state.value ? this.state.value : this.props.value;
    
    const selectedOption = _.find(
      this.props.options,
      o => (
        o.value === this.state.value ||
        o.constant === this.state.value
      )
    );
    
    return (
      <TestPathSegment name={`Field[${this.props.fieldRef}]` || "Picker"}>
        <View>
          <Field {...this.props} ref="inputBox" onPress={this.props.onPress}>
            <View
              style={this.props.containerStyle}
              onLayout={this.handleLayoutChange}
            >
              <TText tid="Label" style={this.props.labelStyle}>
                {this.props.label}
              </TText>
              <View style={this.props.pickerWrapperStyle}>
                <TPicker
                  tid="Picker"
                  {...this.props.pickerProps}
                  selectedValue={selectedOption ? selectedOption.value : null}
                  onValueChange={this.handleValueChange}
                >
                  {this.props.options.map(
                    ({ value, label }, idx) => (
                      <TPickerItem
                        tid={`PickerItem[${idx}]`}
                        key={value}
                        value={value}
                        label={label}
                      />
                    ),
                    this
                  )}
                </TPicker>
                <TouchableOpacity activeOpacity={0} style={pickerCoverStyle} />
              </View>
            </View>
          </Field>
        </View>
      </TestPathSegment>
    );
  }
}

const pickerCoverStyle = {
  position: "absolute",
  top: 0,
  right: "20%",
  bottom: 0,
  left: 0
};
