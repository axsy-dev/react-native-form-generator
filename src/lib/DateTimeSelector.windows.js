"use strict";

import React, { Component } from "react";

import {
  View,
  Text,
  Picker,
  requireNativeComponent,
  ViewPropTypes
} from "react-native";

import Moment from "moment";
import { extendMoment } from "moment-range";
import _ from "lodash";

const moment = extendMoment(Moment);

import { PropTypes } from "prop-types";

const datePickerWindowsInterface = {
  name: "DatePickerWindows",
  propTypes: {
    date: PropTypes.datetime,
    minDate: PropTypes.datetime,
    maxDate: PropTypes.datetime,
    onValueChange: PropTypes.func,
    ...ViewPropTypes // include the default view properties
  }
};

const DatePickerWindows = requireNativeComponent(
  "RCTDatePicker",
  datePickerWindowsInterface,
  { nativeOnly: { onChange: true } }
);

class DateSelector extends Component {
  constructor(props: Object) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }
  _onChange(event: Event) {
    if (!this.props.onChange) {
      return;
    }
    event.persist();
    this.props.onChange(event.nativeEvent.date);
  }
  render() {
    return (
      <DatePickerWindows
        date={this.props.selectedDate}
        minDate={this.props.minimumDate}
        maxDate={this.props.maximumDate}
        onValueChange={this._onChange}
      />
    );
  }
}

const timePickerWindowsInterface = {
  name: "TimePickerWindows",
  propTypes: {
    date: PropTypes.datetime,
    onValueChange: PropTypes.func,
    ...ViewPropTypes // include the default view properties
  }
};

const TimePickerWindows = requireNativeComponent(
  "RCTTimePicker",
  timePickerWindowsInterface,
  {
    nativeOnly: { onChange: true }
  }
);

class TimeSelector extends Component {
  constructor(props: Object) {
    super(props);

    this._onChange = this._onChange.bind(this);
  }

  _onChange(event: Event) {
    if (!this.props.onChange) {
      return;
    }
    event.persist();
    this.props.onChange(event.nativeEvent.time);
  }

  render() {
    return (
      <TimePickerWindows
        time={this.props.selectedTime}
        onValueChange={this._onChange}
      />
    );
  }
}

class DateTimeSelector extends Component {
  state: {
    selectedDate: "",
    selectedTime: "",
    setDate: null
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      selectedTime: "",
      selectedDate: "",
      setDate: null
    };
  }

  componentWillMount() {
    const { date } = this.props;

    if (date) {
      const m = moment(date);

      const selectedDate = m.format("YYYY-MM-DD");
      const selectedTime = m.format("h:mm A");
      const setDate = m.format("MMMM DD, YYYY, h:mm A");

      this.setState({ selectedDate, selectedTime, setDate });
    }
  }

  _setDate(selectedDate: string) {
    this.setState({ selectedDate }, this._setDateResult);
  }

  _setTime(selectedTime: string) {
    this.setState({ selectedTime }, this._setDateResult);
  }

  _setDateResult() {
    const { selectedDate, selectedTime } = this.state;
    const setDate = moment(
      `${selectedDate} ${selectedTime}`,
      "YYYY-MM-DD h:mm A"
    ).toDate();

    this.setState({ setDate }, this._updateResult);
  }

  _updateResult() {
    this.props.onDateChange && this.props.onDateChange(this.state.setDate);
  }

  render() {
    const {
      minimumDate,
      maximumDate,
      minuteSelector,
      mode,
      date,
      timeZoneOffsetInMinutes,
      onDateChange
    } = this.props;
    const { setDate } = this.state;

    if (mode !== "datetime" && mode !== "date") {
      console.warn(
        "Only 'datetime' or 'date' modes are supported at the moment"
      );
    }

    if (timeZoneOffsetInMinutes) {
      console.warn(
        "'timeZoneOffsetInMinutes' property is not supported on Windows (yet)"
      );
    }

    const renderTimeSelector = mode === "date" ? false : true;

    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ height: 40, flex: 1, flexDirection: "row" }}>
          <DateSelector
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            selectedDate={setDate || moment().format("MMMM DD, YYYY, h:mm A")}
            onChange={this._setDate.bind(this)}
          />
        </View>
        {renderTimeSelector && (
          <View style={{ height: 40, flex: 1, flexDirection: "row" }}>
            <TimeSelector
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              minuteSelector={minuteSelector}
              selectedTime={setDate || moment().format("MMMM DD, YYYY, h:mm A")}
              onChange={this._setTime.bind(this)}
            />
          </View>
        )}
      </View>
    );
  }
}

export default DateTimeSelector;
