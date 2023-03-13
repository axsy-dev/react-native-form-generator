"use strict";

import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { Field } from "./Field";
import { TouchableContainer } from "./TouchableContainer";

export class TimePickerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTimePickerVisible: false
    };
  }

  componentDidMount() {
    const { date } = this.props;

    this.setState({ date: date ? new Date(date) : new Date() });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { date } = this.props;
    const dateToSet = date ? new Date(date) : new Date();
    if (this.state.date && this.state.date.getTime() !== dateToSet.getTime()) {
      this.setState({ date: dateToSet });
    }
  }

  handleLayoutChange(e) {
    let { x, y, width, height } = { ...e.nativeEvent.layout };

    this.setState(e.nativeEvent.layout);
  }

  handleValueChange(event, date) {
    if (event.type !== "dismissed") {
      this.setState({ date: date, isTimePickerVisible: false });

      if (this.props.onChange) this.props.onChange(date);
      if (this.props.onValueChange) this.props.onValueChange(date);
    }
  }

  setTime(date) {
    this.setState({ date: date });

    if (this.props.onChange)
      this.props.onChange(
        this.props.prettyPrint ? this.props.dateTimeFormat(date) : date
      );
    if (this.props.onValueChange) this.props.onValueChange(date);
  }

  _togglePicker = async (event) => {
    this.setState({ isTimePickerVisible: true });
    this.props.onPress && this.props.onPress(event);
  }

  render() {
    const timeValue = this.state.date || new Date(0, 0, 0);

    let placeholderComponent = this.props.placeholderComponent ? (
      this.props.placeholderComponent
    ) : (
      <Text testID="Label" style={this.props.placeholderStyle}>
        {this.props.placeholder}
      </Text>
    );
    return (
      <View>
        <Field
          {...this.props}
          ref="inputBox"
          onPress={this._togglePicker}
        >
          <View
            style={this.props.containerStyle}
            onLayout={this.handleLayoutChange.bind(this)}
          >
            {placeholderComponent}
            <View style={this.props.valueContainerStyle}>
              <Text testID="Value" style={[this.props.valueStyle]}>
                {this.props.dateTimeFormat(this.state.date)}
              </Text>
              {this.props.iconRight ? (
                <TouchableContainer
                  tid="ToggleDatePicker"
                  onPress={this._togglePicker}
                >
                  {this.props.iconRight}
                </TouchableContainer>
              ) : null}
            </View>
          </View>
        </Field>
        {this.state.isTimePickerVisible ? (
          <DateTimePicker
            {...this.props}
            mode="time"
            value={timeValue}
            onChange={this.handleValueChange.bind(this)}
          />
        ) : null}
      </View>
    );
  }
}

TimePickerComponent.propTypes = {
  dateTimeFormat: PropTypes.func,
  prettyPrint: PropTypes.bool
};

TimePickerComponent.defaultProps = {
  dateTimeFormat: date => {
    if (!date) return "";
    return date.toLocaleTimeString();
  }
};
