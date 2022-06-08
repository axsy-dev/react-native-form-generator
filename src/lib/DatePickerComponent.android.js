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

    const dateToSet = formatDateResult(date, mode);

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

  render() {
    const { placeholderComponent } = this.props;

    const valueString = this.props.dateTimeFormat(
      this.state.date,
      this.props.mode
    );

    const timeValue = this.state.date || new Date();
    const valueTestId = `Value[${this.state?.date?.getTime() || "unknown"}]`;

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
                <TText tid={valueTestId} style={this.props.valueStyle}>
                  {valueString}
                </TText>
              </View>
              {this.props.iconRight ? this.props.iconRight : null}
            </View>
          </Field>
          {this.state.isDatePickerVisible ? (
            <DateTimePicker
              {...this.props}
              mode="date"
              value={timeValue}
              minDate={this.props.minimumDate}
              maxDate={this.props.maximumDate}
              onChange={this.handleDateValueChange.bind(this)}
            />
          ) : null}
          {this.state.isTimePickerVisible ? (
            <DateTimePicker
              {...this.props}
              mode="time"
              value={timeValue}
              minDate={this.props.minimumDate}
              maxDate={this.props.maximumDate}
              onChange={this.handleTimeValueChange.bind(this)}
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
