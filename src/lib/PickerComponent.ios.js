"use strict";

import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Field } from "../lib/Field";
import { Picker } from "@react-native-picker/picker";

class RenderedSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  handleValueChange(value) {
    this.setState({ value: value });

    if (this.props.onChange) this.props.onChange(value);
  }

  render() {
    let picker = (
      <Picker
        testID="Picker"
        {...this.props.pickerProps}
        selectedValue={this.state.value}
        onValueChange={this.handleValueChange.bind(this)}
        mode="dropdown"
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
    );

    return React.cloneElement(
      this.props.pickerWrapper,
      { onHidePicker: this.props.onHidePicker },
      picker
    );
  }
}

export class PickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isPickerVisible: false
    };
    this.pickerMeasures = {};
  }

  componentDidMount() {
    const { value } = this.props;

    !!value && this.handleValueChange(value);
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
  }

  _scrollToInput(event) {
    if (this.props.onFocus) {
      let handle = ReactNative.findNodeHandle(this.refs.inputBox);

      this.props.onFocus(event, handle);
    }
  }

  componentDidUpdate = prevProps => {
    const value = this.props.value;
    const values = Array.isArray(value)
      ? value
      : !value || value === ""
      ? []
      : value.split(";");
    let optionValues = this.props.options.map(o => o.value || o.constant);
    const validValues = values.filter(v => optionValues.indexOf(v) !== -1);
    const invalidValues = values.filter(v => optionValues.indexOf(v) === -1);
    if (invalidValues.length) {
      const nextValue = validValues.join(";");
      this.handleValueChange(nextValue);
    } else if (prevProps.value !== value) {
      this.setState({ value });
    }
  };

  _renderContent() {
    const picker = (
      <RenderedSelector
        {...this.props}
        value={this.state.value}
        onChange={this.handleValueChange.bind(this)}
        onHidePicker={() => this.setState({ isPickerVisible: false })}
      />
    );

    return picker;
  }

  _togglePicker(event) {
    if (this.context.actionSheet) {
      this.context.actionSheet.showContent(this._renderContent(), "done");
    } else {
      this.setState({ isPickerVisible: !this.state.isPickerVisible });
    }

    this.props.onPress && this.props.onPress(event);
  }

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
            <Text testID="Label" style={this.props.labelStyle}>
              {this.props.label}
            </Text>
            <View style={this.props.valueContainerStyle}>
              <Text testID="Value" style={this.props.valueStyle}>
                {selectedOption ? selectedOption.label : ""}
              </Text>
            </View>
            {this.props.iconRight ? this.props.iconRight : null}
          </View>
        </Field>
        {this.state.isPickerVisible ? this._renderContent() : null}
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

PickerComponent.contextTypes = {
  actionSheet: PropTypes.object
};
