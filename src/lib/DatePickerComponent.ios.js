"use strict";

import React from "react";
import PropTypes from "prop-types";
import { View, Text, Button } from "react-native";
import { Field } from "./Field";

import DateTimePicker from "@react-native-community/datetimepicker";
import { TestPathSegment, TText } from "@axsy-dev/testable";
import {
  formatDateResult,
  normalizeAndFormat,
  handleSetDate,
  dateTimeFormat,
  formatOnPretty
} from "./datePickerHelpers";
import { DatePickerPlaceholder } from "./DatePickerPlaceholder";

export class DatePickerComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPickerVisible: false
    };

    this._renderContent = this._renderContent.bind(this);
    this._togglePicker = this._togglePicker.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.date) {
      const dateToSet = normalizeAndFormat(this.props);
      this.setState({ date: dateToSet });
    }
  }

  UNSAFE_componentDidUpdate(_prevProps, _prevState, snapshot) {
    const { date } = this.props;

    if (date) {
      const dateToSet = normalizeAndFormat(this.props);

      // If there is no existing date then we set a date.
      const noExistingDate = !this.state.date;

      // If the date argument time differs from the existing date then we set a date.
      const shouldSetDate =
        noExistingDate || this.state.date.getTime() !== dateToSet.getTime();

      if (shouldSetDate) {
        this.setState({ date: dateToSet });
      }
    } else if (this.state.date) {
      this.setState({ date: "" });
    }
  }

  setDate(date) {
    const { mode } = this.props;
    const dateToSet = formatDateResult(date, mode);
    this.setState({ date: dateToSet });

    handleSetDate(dateToSet, this.props);
  }

  handleLayoutChange(e) {
    this.setState(e.nativeEvent.layout);
  }

  handleValueChange(event, date) {
    const { mode, onValueChange, onChange } = this.props;

    if (date) {
      const dateToSet = formatDateResult(date, mode);

      this.setState({ date: dateToSet });

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

  _renderContent() {
    let datePicker = (
      <DateTimePicker
        display={"spinner"}
        maximumDate={this.props.maximumDate}
        minimumDate={this.props.minimumDate}
        minuteInterval={this.props.minuteInterval}
        mode={this.props.mode}
        timeZoneOffsetInMinutes={this.props.timeZoneOffsetInMinutes}
        value={this.state.date || new Date()}
        onChange={this.handleValueChange}
        locale={this.props.locale}
      />
    );

    return React.cloneElement(
      this.props.pickerWrapper,
      {
        onHidePicker: () => {
          this.setState({ isPickerVisible: false });
        }
      },
      datePicker
    );
  }

  _togglePicker(event) {
    if (this.context.actionSheet) {
      this.context.actionSheet.showContent(this._renderContent());
    } else {
      this.setState({ isPickerVisible: !this.state.isPickerVisible });
    }

    this.props.onPress && this.props.onPress(event);
  }

  render() {
    let {
      maximumDate,
      minimumDate,
      minuteInterval,
      mode,
      onDateChange,
      timeZoneOffsetInMinutes,
      placeholderComponent
    } = this.props;

    let valueString = this.state.date
      ? this.props.dateTimeFormat(this.state.date, this.props.mode)
      : "";

    console.log("DatePickerComponent: render: state: date: ", this.state.date);

    let iconLeft = this.props.iconLeft,
      iconRight = this.props.iconRight;

    if (iconLeft && iconLeft.constructor === Array) {
      iconLeft = !this.state.isPickerVisible ? iconLeft[0] : iconLeft[1];
    }

    if (iconRight && iconRight.constructor === Array) {
      iconRight = !this.state.isPickerVisible ? iconRight[0] : iconRight[1];
    }

    const valueTestId = "Value";

    return (
      <TestPathSegment name={`Field[${this.props.fieldRef}]` || "DatePicker"}>
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
              <View style={[this.props.valueContainerStyle]}>
                <TText tid={valueTestId} style={[this.props.valueStyle]}>
                  {valueString}
                </TText>
                {valueString ? (
                  <Button
                    onPress={e => this.handleValueChange(e, "")}
                    title="Clear"
                  />
                ) : null}
                {iconRight ? iconRight : null}
              </View>
            </View>
          </Field>
          {this.state.isPickerVisible ? this._renderContent() : null}
        </View>
      </TestPathSegment>
    );
  }
}

DatePickerComponent.propTypes = {
  dateTimeFormat: PropTypes.func,
  pickerWrapper: PropTypes.element,
  prettyPrint: PropTypes.bool
};

DatePickerComponent.defaultProps = {
  pickerWrapper: <View />,
  dateTimeFormat: dateTimeFormat
};

DatePickerComponent.contextTypes = {
  actionSheet: PropTypes.object
};
