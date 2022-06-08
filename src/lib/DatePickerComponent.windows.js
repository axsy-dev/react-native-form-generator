"use strict";

import React from "react";
import PropTypes from "prop-types";

let { View, StyleSheet, TextInput } = require("react-native");

import DateTimePicker from "@react-native-community/datetimepicker";
import { Field } from "./Field";
import { TestPathSegment, TText } from "@axsy-dev/testable";
import {
  formatDateResult,
  normalizeAndFormat,
  handleSetDate,
  dateTimeFormat
} from "./datePickerHelpers";
import { DatePickerPlaceholder } from "./DatePickerPlaceholder";

export class DatePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      isTimePickerVisible: false
    };
  }

  componentWillMount() {
    const dateToSet = normalizeAndFormat(this.props);

    this.setState({ date: dateToSet });
  }

  handleLayoutChange(e) {
    this.setState(e.nativeEvent.layout);
  }

  handleTimeValueChange(event, date) {
    if (date === undefined) {
      return;
    }

    const { mode, dateTimeFormat, onValueChange, onChange, prettyPrint } =
      this.props;

    let dateToSet, dateTimeFormatted;

    // If it's datetime - use existing date set,
    // Only extract the time part here
    if (mode === "datetime") {
      const selectedHours = date.getHours();
      const selectedMinutes = date.getMinutes();

      // Due to some weird time results with offsets returned on Windows
      // We need to manually setDate to make sure that it stays the same as was originally selected.
      dateToSet = new Date(this.state.date);

      const selectedDate = dateToSet.getDate();
      const selectedMonth = dateToSet.getMonth();
      const selectedFullYear = dateToSet.getFullYear();

      dateToSet.setHours(selectedHours);
      dateToSet.setMinutes(selectedMinutes);
      dateToSet.setDate(selectedDate);
      dateToSet.setMonth(selectedMonth);
      dateToSet.setFullYear(selectedFullYear);

      dateTimeFormatted = dateTimeFormat(dateToSet, mode);
    } else {
      dateToSet = formatDateResult(date, mode);
      dateTimeFormatted = dateTimeFormat(dateToSet, mode);
    }

    this.setState({
      date: dateToSet,
      isTimePickerVisible: false
    });

    onChange &&
      onChange(prettyPrint ? dateTimeFormat(dateToSet, mode) : dateToSet);
    onValueChange && onValueChange(dateToSet);
  }

  handleDateValueChange(event, date) {
    if (date === undefined) {
      return;
    }

    const { mode, dateTimeFormat, onValueChange, onChange, prettyPrint } =
      this.props;

    const dateToSet = formatDateResult(date, mode);
    const dateTimeFormatted = dateTimeFormat(dateToSet, mode);

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

    onChange &&
      onChange(prettyPrint ? dateTimeFormat(dateToSet, mode) : dateToSet);
    onValueChange && onValueChange(dateToSet);
  }

  setDate(date) {
    const { mode } = this.props;
    const dateToSet = formatDateResult(date, mode);
    this.setState({ date: dateToSet });

    handleSetDate(dateToSet, this.props);
  }

  async _togglePicker(event) {
    if (this.props.mode === "time") {
      this.setState({ isTimePickerVisible: true });
    } else {
      this.setState({ isDatePickerVisible: true });
    }

    this.props.onPress && this.props.onPress(event);
  }

  onChange = (event, date) => {
    if (this.state.isTimePickerVisible) {
      this.handleTimeValueChange(event, date);
      return;
    }

    this.handleDateValueChange(event, date);
  };

  render() {
    const { placeholderComponent } = this.props;
    const valueString = this.props.dateTimeFormat(
      this.state.date,
      this.props.mode
    );

    const timeValue = this.state.date || new Date();

    const pickerMode = this.state.isTimePickerVisible ? "time" : "date";
    const isPickerVisible =
      this.state.isDatePickerVisible || this.state.isTimePickerVisible;
    const pickerStyle = this.state.isTimePickerVisible
      ? { width: 300, opacity: 1, height: 30, marginTop: 10 }
      : {};
    const valueTestId = "Value";

    return (
      <TestPathSegment name={`Field[${this.props.fieldRef}]` || "DatePicker"}>
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
              {this.props.iconLeft ? this.props.iconLeft : null}
              {placeholderComponent ? (
                placeholderComponent
              ) : (
                <DatePickerPlaceholder {...this.props} />
              )}
              <View style={this.props.valueContainerStyle}>
                <TText tid="Value" style={this.props.valueStyle}>
                  {valueString}
                </TText>
              </View>
              {this.props.iconRight ? this.props.iconRight : null}
            </View>
          </Field>
          {isPickerVisible ? (
            <DateTimePicker
              {...this.props}
              mode={pickerMode}
              value={timeValue}
              style={pickerStyle}
              minDate={this.props.minimumDate}
              maxDate={this.props.maximumDate}
              is24Hour={false}
              dateFormat={"month day year"}
              minuteInterval={5}
              onChange={this.onChange}
              timeZoneOffsetInSeconds={0} // This is necessary since DateTimePicker for some reason adds -1 hr timezone offset
            />
          ) : null}
        </View>
      </TestPathSegment>
    );
  }
}

DatePickerComponent.propTypes = {
  dateTimeFormat: PropTypes.func
};

DatePickerComponent.defaultProps = {
  dateTimeFormat: dateTimeFormat
};
