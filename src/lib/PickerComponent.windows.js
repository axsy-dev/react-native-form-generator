"use strict";

import React from "react";
import { View, findNodeHandle, Text } from "react-native";
import PropTypes from "prop-types";
import { Field } from "../lib/Field";
import { Picker } from "@react-native-picker/picker";
import _ from "lodash";
import { sanatisePicklistValues } from "./helpers";

export class PickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isPickerVisible: false
    };
    this.inputBoxRef = React.createRef();
    this.pickerMeasures = {};
  }

  componentDidMount() {
    const { value } = this.props;

    !!value && this.handleValueChange(value);
  }

  setValue = value => {
    this.setState({ value: value });
    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
  };

  handleLayoutChange = e => {
    let { x, y, width, height } = { ...e.nativeEvent.layout };

    this.setState(e.nativeEvent.layout);
  };

  handleValueChange = value => {
    this.setState({ value: value });

    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
    if (this.props.autoclose) this._togglePicker();
  };

  componentDidUpdate = () => {
    const { value, options } = this.props;
    const [requiresUpdate, sanatised] = sanatisePicklistValues(value, options);
    if (requiresUpdate) {
      this.handleValueChange(sanatised);
    } else if (this.state.value !== value) {
      this.setState({ value });
    }
  };

  _scrollToInput = event => {
    if (this.props.onFocus) {
      if (this.inputBoxRef) {
        let handle = ReactNative.findNodeHandle(this.inputBoxRef.current);

        this.props.onFocus(event, handle);
      }
    }
  };

  _togglePicker = event => {
    this.setState({ isPickerVisible: !this.state.isPickerVisible });
    this.props.onPress && this.props.onPress(event);
  };

  render() {
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
      o => o.value === this.state.value || o.constant === this.state.value
    );

    return (
      <View>
        <Field {...this.props} ref={this.inputBoxRef} onPress={this.props.onPress}>
          <View
            style={this.props.containerStyle}
            onLayout={this.handleLayoutChange}
          >
            {iconLeft ? iconLeft : null}
            <Text testID="Label" style={this.props.labelStyle}>
              {this.props.label}
            </Text>
            <Picker
              testID="Picker"
              {...this.props.pickerProps}
              selectedValue={selectedOption ? selectedOption.value : ""}
              onValueChange={this.handleValueChange}
            >
              {this.props.options.map(({ value, label }, idx) => (
                <Picker.Item
                  testID={`PickerItem/${idx}`}
                  key={value}
                  value={value}
                  label={label}
                />
              ))}
            </Picker>
          </View>
        </Field>
      </View>
    );
  }
}

PickerComponent.propTypes = {
  pickerWrapper: PropTypes.element
};

PickerComponent.defaultProps = {
  pickerWrapper: <View />
};
