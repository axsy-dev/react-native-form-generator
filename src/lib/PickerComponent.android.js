"use strict";

import React from "react";
import ReactNative from "react-native";
let { View, StyleSheet, Picker } = ReactNative;
import { Field } from "../lib/Field";

import { TestPathSegment, TText, TPicker, TPickerItem } from "@axsy/testable";
import _ from "lodash";

var PickerItem = Picker.Item;

export class PickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    this.pickerMeasures = {};
  }
  setValue(value) {
    this.setState({ value: value });
    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
  }
  handleLayoutChange(e) {
    let { x, y, width, height } = { ...e.nativeEvent.layout };

    this.setState(e.nativeEvent.layout);
  }

  handleValueChange(value) {
    this.setState({ value: value && value !== "" ? value : this.props.label });

    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
  }

  _scrollToInput(event) {
    if (this.props.onFocus) {
      let handle = ReactNative.findNodeHandle(this.refs.inputBox);

      this.props.onFocus(event, handle);
    }
  }
  _togglePicker(event) {}
  render() {
    const selectedOption = _.find(this.props.options, o => o.value === this.state.value);
    return (
      <TestPathSegment name={`Field[${this.props.fieldRef}]` || "Picker"}>
        <View>
          <Field {...this.props} ref="inputBox" onPress={this.props.onPress}>
            <View
              style={this.props.containerStyle}
              onLayout={this.handleLayoutChange.bind(this)}
            >
              <TText tid="Label" style={this.props.labelStyle}>
                {this.props.label}
              </TText>
              <View style={this.props.pickerWrapperStyle}>
                <TPicker
                  tid="Picker"
                  {...this.props.pickerProps}
                  selectedValue={selectedOption ? selectedOption.value : null}
                  onValueChange={this.handleValueChange.bind(this)}
                >
                  {this.props.options.map(
                    ({value, label}, idx) => (
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
              </View>
            </View>
          </Field>
        </View>
      </TestPathSegment>
    );
  }
}
