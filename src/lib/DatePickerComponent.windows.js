"use strict";

import React from "react";
import PropTypes from "prop-types";

let {
  View,
  StyleSheet,
  TextInput
} = require("react-native");

import DateTimePicker from '@react-native-community/datetimepicker';
import { Field } from "./Field";
import { TestPathSegment, TText } from "@axsy-dev/testable";

function formatDateResult(date, mode) {
  return mode === "date"
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : date;
}

export class DatePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      isTimePickerVisible: false
    };
  }

  componentWillMount() {
    const { date, mode } = this.props;
    const dateNormalized = date ? new Date(date) : new Date();
    const dateToSet = formatDateResult(dateNormalized, mode);
  
    this.setState({ date: dateToSet });
  }

  handleLayoutChange(e) {
    let { x, y, width, height } = { ...e.nativeEvent.layout };
  
    this.setState(e.nativeEvent.layout);
  }

  handleTimeValueChange(event, date) {
    if (date === undefined) {
      return;
    }
    
    const {
      mode,
      dateTimeFormat,
      onValueChange,
      onChange,
      prettyPrint
    } = this.props;

    let dateToSet, dateTimeFormatted;
    
    // If it's datetime - use existing date set,
    // Only extract the time part here
    if (mode === "datetime") {
      const selectedHours = date.getHours();
      const selectedMinutes = date.getMinutes();
      const timezoneOffsetInHours = new Date().getTimezoneOffset() / 60;
      const selectedHoursWithOffset = selectedHours + timezoneOffsetInHours;

      dateToSet = new Date(this.state.date);
      dateToSet.setHours(selectedHoursWithOffset);
      dateToSet.setMinutes(selectedMinutes);
      dateTimeFormatted = dateTimeFormat(dateToSet, mode);
    }
    else {
      dateToSet = formatDateResult(date, mode);
      dateTimeFormatted = dateTimeFormat(dateToSet, mode);
    }

    this.setState({
      date: dateToSet,
      isTimePickerVisible: false
    })

    onChange &&
      onChange(prettyPrint ? dateTimeFormat(dateToSet, mode) : dateToSet);
    onValueChange && onValueChange(dateToSet);
  }

  handleDateValueChange(event, date) {
    if (date === undefined) {
      return;
    }

    const {
      mode,
      dateTimeFormat,
      onValueChange,
      onChange,
      prettyPrint
    } = this.props;

    const dateToSet = formatDateResult(date, mode);
    const dateTimeFormatted = dateTimeFormat(dateToSet, mode)

    this.setState({
      date: dateToSet,
      isDatePickerVisible: false
    }, () => {
      if (mode === "datetime") {
        this.setState({
          isTimePickerVisible: true
        });
      }
    });

    onChange &&
      onChange(prettyPrint ? dateTimeFormat(dateToSet, mode) : dateToSet);
    onValueChange && onValueChange(dateToSet);
  }

  setDate(date) {
    const { mode } = this.props;

    const dateToSet = formatDateResult(date, mode);
    
    this.setState({ date: dateToSet });
    
    if (this.props.onChange)
      this.props.onChange(
        this.props.prettyPrint
          ? this.props.dateTimeFormat(dateToSet)
          : dateToSet
      );

    if (this.props.onValueChange) this.props.onValueChange(dateToSet);
  }

  async _togglePicker(event) {
    if (this.props.mode === "time") {
      this.setState({ isTimePickerVisible: true });
    }
    else {
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
  }

  render() {
    let placeholderComponent = this.props.placeholderComponent ? (
      this.props.placeholderComponent
    ) : (
      <TText tid="Placeholder" style={this.props.placeholderStyle}>
        {this.props.placeholder}
      </TText>
    );

    const valueString = this.props.dateTimeFormat(
      this.state.date,
      this.props.mode
    );

    const timeValue = this.state.date || new Date();

    const pickerMode = this.state.isTimePickerVisible ? "time" : "date";
    const isPickerVisible = this.state.isDatePickerVisible || this.state.isTimePickerVisible;
    const pickerStyle = this.state.isTimePickerVisible ? {width: 300, opacity: 1, height: 30, marginTop: 10} : {};
 
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
              {placeholderComponent}
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
              minuteInterval={5}
              onChange={this.onChange}
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
  dateTimeFormat: (date, mode) => {
    if (!date) return "";
    let value = "";
    switch (mode) {
      case "datetime":
        value = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        break;
      case "date":
        value = date.toLocaleDateString();
        break;
      case "time":
        value = date.toLocaleTimeString();
        break;
      case "countdown":
        value = date.getHours() + ":" + date.getMinutes();
        break;
      default:
        value = date.toLocaleDateString();
    }
    return value;
  }
};
