"use strict";

import React from "react";
import ReactNative from "react-native";
import PropTypes from "prop-types";
let { View, StyleSheet, TextInput, Text, Picker } = ReactNative;
import { Field } from "../lib/Field";

import {
  TestPathContainer,
  TText,
  TPicker,
  TPickerItem,
  TestPathSegment
} from "@axsy-dev/testable";
import _ from "lodash";

export class PickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isPickerVisible: false
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
    this.setState({ value: value });

    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
    // if (this.props.autoclose) 
    this._togglePicker();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const value = prevProps.value;
    if (this.state.value !== value) {
      this.setState({ value });
    }
  }

  _scrollToInput(event) {
    if (this.props.onFocus) {
      let handle = ReactNative.findNodeHandle(this.refs.inputBox);

      this.props.onFocus(event, handle);
    }
  }
  _togglePicker(event) {
    this.setState({ isPickerVisible: !this.state.isPickerVisible });
    this.props.onPress && this.props.onPress(event);
  }
  render() {
    let picker = (
      <TPicker
        tid="Picker"
        {...this.props.pickerProps}
        selectedValue={this.state.value}
        onValueChange={this.handleValueChange.bind(this)}
        mode="dialog"
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
    );
    let pickerWrapper = React.cloneElement(
      this.props.pickerWrapper,
      {
        onHidePicker: () => {
          this.setState({ isPickerVisible: false });
        }
      },
      picker
    );
    let iconLeft = this.props.iconLeft,
      iconRight = this.props.iconRight;

    if (iconLeft && iconLeft.constructor === Array) {
      iconLeft = !this.state.isPickerVisible ? iconLeft[0] : iconLeft[1];
    }
    if (iconRight && iconRight.constructor === Array) {
      iconRight = !this.state.isPickerVisible ? iconRight[0] : iconRight[1];
    }
    const selectedOption = _.find(
      this.props.options,
      o => o.value === this.state.value
    );

    return (
      <TestPathSegment name={`Field[${this.props.fieldRef}]` || "Picker"}>
        <View>
        
          <Field
            {...this.props}
            ref="inputBox"
            onPress={this._togglePicker.bind(this)}
          >
            <View
              style={this.props.containerStyle}
              onLayout={this.handleLayoutChange.bind(this)}
            >
              {iconLeft ? iconLeft : null}
              <TText tid="Label" style={this.props.labelStyle}>
                {this.props.label}
              </TText>
              {!this.state.isPickerVisible &&
              <View style={this.props.valueContainerStyle}>
                <TText tid="Value" style={this.props.valueStyle}>
                  {selectedOption ? selectedOption.label : ""}
                </TText>
              </View>}
              {!this.state.isPickerVisible && this.props.iconRight ? this.props.iconRight : null}
              {this.state.isPickerVisible ? pickerWrapper : null}
            </View>
          </Field>
          
        </View>
      </TestPathSegment>
    );
  }
}

PickerComponent.propTypes = {
  pickerWrapper: PropTypes.element
};

PickerComponent.defaultProps = {
  pickerWrapper: <View />
};
