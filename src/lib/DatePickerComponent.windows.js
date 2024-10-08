"use strict";

import React from "react";
import PropTypes from "prop-types";

import { View, Text, TextInput } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Field } from "./Field";
import {
  formatDateResult,
  normalizeAndFormat,
  handleSetDate,
  dateTimeFormat,
  formatOnPretty
} from "./helpers";
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
    this.onChange = this.onChange.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  UNSAFE_componentWillMount() {
    const dateToSet = this.props.noInitialDate
      ? null
      : normalizeAndFormat(this.props);

    this.setState({ date: dateToSet });
  }

  handleLayoutChange(event) {
    this.setState(event.nativeEvent.layout);
  }

  handleTimeValueChange(event, date) {
    if (date) {
      const { mode, dateTimeFormat, onValueChange, onChange } = this.props;
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

      if (onChange) {
        onChange(formatOnPretty(dateToSet, this.props));
      }

      if (onValueChange) {
        onValueChange(dateToSet);
      }
    }
  }

  handleDateValueChange(event, date) {
    if (date) {
      const { mode, dateTimeFormat, onValueChange, onChange } = this.props;
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

      if (onChange) {
        onChange(formatOnPretty(dateToSet, this.props));
      }

      if (onValueChange) {
        onValueChange(dateToSet);
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

  onChange(event, date) {
    if (this.state.isTimePickerVisible) {
      this.handleTimeValueChange(event, date);
    } else {
      this.handleDateValueChange(event, date);
    }
  }

  handleClear() {
    const { onChange, onValueChange } = this.props;

    this.setState({ date: null });

    if (onChange) {
      onChange(null);
    }

    if (onValueChange) {
      onValueChange(null);
    }
  }

  render() {
    const {
      placeholderComponent,
      iconRight,
      iconClear,
      editable = true,
      readonly = false
    } = this.props;
    const valueString = this.state.date
      ? this.props.dateTimeFormat(this.state.date, this.props.mode)
      : "";

    const timeValue = this.state.date || new Date();

    const pickerMode = this.state.isTimePickerVisible ? "time" : "date";
    const isPickerVisible =
      this.state.isDatePickerVisible || this.state.isTimePickerVisible;
    const pickerStyle = this.state.isTimePickerVisible
      ? { width: 300, opacity: 1, height: 30, marginTop: 10 }
      : {};

    const valueTestId = this.state.date
      ? `Value/${this.state.date?.getTime()}`
      : "Unknown";
    const showClear = !!(iconClear && valueString);
    const active = editable && !readonly;
    const onPress = active ? this._togglePicker : null;
    return (
      <View>
        <Field {...this.props} ref="inputBox" onPress={onPress}>
          <View
            style={this.props.containerStyle}
            onLayout={this.handleLayoutChange}
          >
            {active && this.props.iconLeft ? this.props.iconLeft : null}
            {placeholderComponent ? (
              placeholderComponent
            ) : (
              <DatePickerPlaceholder {...this.props} />
            )}
            <View style={this.props.valueContainerStyle}>
              {readonly ? (
                <TextInput
                  value={valueString}
                  style={[this.props.valueStyle, { flex: 1 }]}
                />
              ) : (
                <Text testID={valueTestId} style={this.props.valueStyle}>
                  {valueString}
                </Text>
              )}
              {active && showClear ? (
                <TouchableContainer
                  tid={`ClearDateValue`}
                  onPress={this.handleClear}
                >
                  {iconClear}
                </TouchableContainer>
              ) : null}
              {active && !showClear && iconRight ? (
                <TouchableContainer
                  tid={`ToggleDatePicker`}
                  onPress={!readonly ? this._togglePicker : () => {}}
                >
                  {iconRight}
                </TouchableContainer>
              ) : null}
            </View>
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
