"use strict";

import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Field } from "./Field";

import DateTimePicker from "@react-native-community/datetimepicker";
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
      isPickerVisible: false
    };
  }

  componentWillMount() {
    const dateToSet = normalizeAndFormat(this.props);
    this.setState({ date: dateToSet });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { date, mode, dateTimeFormat } = this.props;
    const dateNormalized = date ? new Date(date) : new Date();
    const dateToSet = formatDateResult(dateNormalized, mode);
    if (this.state.date.getTime() !== dateToSet.getTime()) {
      this.setState({ date: dateToSet });
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
    const { mode, dateTimeFormat, onValueChange, onChange, prettyPrint } =
      this.props;

    const dateToSet = formatDateResult(date, mode);

    this.setState({ date: dateToSet });

    onChange &&
      onChange(prettyPrint ? dateTimeFormat(dateToSet, mode) : dateToSet);
    onValueChange && onValueChange(dateToSet);
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
        onChange={this.handleValueChange.bind(this)}
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

    let valueString = this.props.dateTimeFormat(
      this.state.date,
      this.props.mode
    );

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
              {placeholderComponent ? (
                placeholderComponent
              ) : (
                <DatePickerPlaceholder {...this.props} />
              )}
              <View style={[this.props.valueContainerStyle]}>
                <TText tid={valueTestId} style={[this.props.valueStyle]}>
                  {valueString}
                </TText>
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
