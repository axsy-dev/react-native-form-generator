"use strict";

import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Field } from "../lib/Field";
import { Picker } from "@react-native-picker/picker";

import _ from "lodash";

export class PickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.pickerMeasures = {};
  }

  setValue(value) {}

  componentDidMount() {
    const { value } = this.props;

    !!value && this.handleValueChange(value);
  }

  handleLayoutChange = e => {
    let { x, y, width, height } = { ...e.nativeEvent.layout };
    this.setState(e.nativeEvent.layout);
  };

  handleValueChange = value => {
    this.setState({ value });

    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
  };

  componentDidUpdate = () => {
    const value = this.props.value;
    const values = normalisePicklistValue(value);
    let optionValues = this.props.options.map(o => o.value || o.constant);
    const validValues = values.filter(v => optionValues.indexOf(v) !== -1);
    const invalidValues = values.filter(v => optionValues.indexOf(v) === -1);
    if (invalidValues.length) {
      const nextValue = validValues.join(";");
      this.handleValueChange(nextValue);
    } else if (this.state.value !== value) {
      this.setState({ value });
    }
  };

  render() {
    // prefer state value if set
    const value = this.state.value ? this.state.value : this.props.value;

    const selectedOption = _.find(
      this.props.options,
      o => o.value === value || o.constant === value
    );

    return (
      <View>
        <Field {...this.props} ref="inputBox" onPress={this.props.onPress}>
          <View
            style={this.props.containerStyle}
            onLayout={this.handleLayoutChange}
          >
            <Text testID="Label" style={this.props.labelStyle}>
              {this.props.label}
            </Text>
            <View style={this.props.pickerWrapperStyle}>
              <Picker
                testID="Picker"
                {...this.props.pickerProps}
                selectedValue={selectedOption ? selectedOption.value : null}
                onValueChange={this.handleValueChange}
              >
                {this.props.options.map(
                  ({ value, label }, idx) => (
                    <Picker.Item
                      testID={`PickerItem/${idx}`}
                      key={value}
                      value={value}
                      label={label}
                    />
                  ),
                  this
                )}
              </Picker>
              <TouchableOpacity activeOpacity={0} style={pickerCoverStyle} />
            </View>
          </View>
        </Field>
      </View>
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
