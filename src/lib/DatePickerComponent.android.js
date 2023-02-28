"use strict";

import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Field } from "./Field";

import {
  formatDateResult,
  normalizeAndFormat,
  handleSetDate,
  dateTimeFormat,
  formatOnPretty
} from "./datePickerHelpers";
import { DatePickerPlaceholder } from "./DatePickerPlaceholder";
import { TouchableContainer } from "./TouchableContainer";

export class DatePickerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDatePickerVisible: false,
      isTimePickerVisible: false
    };

    this._togglePicker = this._togglePicker.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleDateValueChange = this.handleDateValueChange.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleTimeValueChange = this.handleTimeValueChange.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.date) {
      const dateToSet = this.props.noInitialDate ? "" : normalizeAndFormat(this.props);

      this.setState({ date: dateToSet });
    }
  }

  handleLayoutChange(e) {
    this.setState(e.nativeEvent.layout);
  }

  handleTimeValueChange(event, date) {
    const { mode, onValueChange, onChange } = this.props;

    if (date) {
      const dateToSet = formatDateResult(date, mode);

      this.setState({
        date: dateToSet,
        isTimePickerVisible: false
      });

      if (onChange) {
        const value = formatOnPretty(dateToSet, this.props);

        onChange(value);
      }

      if (onValueChange) {
        onValueChange(dateToSet);
      }
    } else {
      this.setState({ date: "" });

      if (onChange) {
        onChange(date);
      }

      if (onValueChange) {
        onValueChange(date);
      }
    }
  }

  handleDateValueChange(event, date) {
    const { mode, onValueChange, onChange } = this.props;

    if (date) {
      const dateToSet = formatDateResult(date, mode);

      this.setState(
        {
          date: dateToSet,
          isDatePickerVisible: false
        },
        () => {
          if (mode === "datetime") {
            this.setState({
              isTimePickerVisible: true
            });
          }
        }
      );

      if (onChange) {
        const value = formatOnPretty(dateToSet, this.props);

        onChange(value);
      }
      if (onValueChange) {
        onValueChange(dateToSet);
      }
    } else {
      this.setState({ date: "" });

      if (onChange) {
        onChange(date);
      }

      if (onValueChange) {
        onValueChange(date);
      }
    }
  }

  setDate(date) {
    const { mode } = this.props;
    const dateToSet = formatDateResult(date, mode);
    this.setState({ date: dateToSet });

    handleSetDate(dateToSet, this.props);
  }

  async _togglePicker(event) {
    const key =
      this.props.mode === "time"
        ? "isTimePickerVisible"
        : "isDatePickerVisible";

    this.setState({ [key]: true });

    if (this.props.onPress) {
      this.props.onPress(event);
    }
  }

  handleClear(e) {
    const { mode } = this.props;

    if (mode === "time") {
      this.handleTimeValueChange(e, "");
    } else {
      this.handleDateValueChange(e, "");
    }
  }

  render() {
    const { placeholderComponent, iconClear, iconRight, iconLeft } = this.props;

    const valueString = this.state.date
      ? this.props.dateTimeFormat(this.state.date, this.props.mode)
      : "";

    const timeValue = this.state.date || new Date();

    const valueTestId = this.state.date
      ? `Value/${this.state.date?.getTime()}`
      : "Unknown";
    const showClear = !!(iconClear && valueString);
    return (
      <View>
        <Field {...this.props} ref="inputBox" onPress={this._togglePicker}>
          <View
            style={this.props.containerStyle}
            onLayout={this.handleLayoutChange}
          >
            {iconLeft ? iconLeft : null}
            {placeholderComponent ? (
              placeholderComponent
            ) : (
              <DatePickerPlaceholder {...this.props} />
            )}
            <View style={this.props.valueContainerStyle}>
              <Text testID={valueTestId} style={this.props.valueStyle}>
                {valueString}
              </Text>
              {showClear ? (
                <TouchableContainer
                  tid={`ClearDateValue`}
                  onPress={this.handleClear}
                >
                  {iconClear}
                </TouchableContainer>
              ) : null}
              {!showClear && iconRight ? (
                <TouchableContainer
                  tid={`ToggleDatePicker`}
                  onPress={this._togglePicker}
                >
                  {iconRight}
                </TouchableContainer>
              ) : null}
            </View>
          </View>
        </Field>
        {this.state.isDatePickerVisible ? (
          <DateTimePicker
            {...this.props}
            mode="date"
            value={timeValue}
            minDate={this.props.minimumDate}
            maxDate={this.props.maximumDate}
            onChange={this.handleDateValueChange}
          />
        ) : null}
        {this.state.isTimePickerVisible ? (
          <DateTimePicker
            {...this.props}
            mode="time"
            value={timeValue}
            minDate={this.props.minimumDate}
            maxDate={this.props.maximumDate}
            onChange={this.handleTimeValueChange}
          />
        ) : null}
      </View>
    );
  }
}

DatePickerComponent.propTypes = {
  dateTimeFormat: PropTypes.func,
  noInitialDate: PropTypes.bool
};

DatePickerComponent.defaultProps = {
  dateTimeFormat: dateTimeFormat
};
