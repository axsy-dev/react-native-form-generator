"use strict";

import React from "react";
import PropTypes from "prop-types";
import { View, Text, TextInput } from "react-native";
import { Field } from "./Field";

import DateTimePicker from "@react-native-community/datetimepicker";
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
      isPickerVisible: false
    };

    this._renderContent = this._renderContent.bind(this);
    this._togglePicker = this._togglePicker.bind(this);
    this.inputBoxRef = React.createRef();
    this.handleClear = this.handleClear.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.date) {
      const dateToSet = this.props.noInitialDate
        ? null
        : normalizeAndFormat(this.props);
      this.setState({ date: dateToSet });
    }
  }

  componentDidUpdate(_prevProps, _prevState, snapshot) {
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
      this.setState({ date: null });
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
      this.setState({ date: null });

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
      const options = { onCancel: this.props.onCancel };
      this.context.actionSheet.showContent(this._renderContent(), options);
    } else {
      this.setState({ isPickerVisible: !this.state.isPickerVisible });
    }

    this.props.onPress && this.props.onPress(event);
  }

  handleClear(e) {
    this.handleValueChange(e, null);
  }

  render() {
    const {
      placeholderComponent,
      iconClear,
      editable = true,
      readonly = false
    } = this.props;
    const valueString = this.state.date
      ? this.props.dateTimeFormat(this.state.date, this.props.mode)
      : "";

    const valueTestId = this.state.date
      ? `Value/${this.state.date?.getTime()}`
      : "Unknown";
    const iconLeft = getIcon(this.state.isPickerVisible, this.props.iconLeft);
    const iconRight = getIcon(this.state.isPickerVisible, this.props.iconRight);
    const showClear = !!(iconClear && valueString);
    const active = editable && !readonly;
    const onPress = active ? this._togglePicker : null;
    return (
      <View>
        <Field {...this.props} ref={this.inputBoxRef} onPress={onPress}>
          <View
            style={[this.props.containerStyle]}
            onLayout={this.handleLayoutChange}
          >
            {active && iconLeft ? iconLeft : null}
            {placeholderComponent ? (
              placeholderComponent
            ) : (
              <DatePickerPlaceholder {...this.props} />
            )}
            <View style={[this.props.valueContainerStyle]}>
              {readonly ? (
                <TextInput
                  value={valueString}
                  style={[this.props.valueStyle, { flex: 1 }]}
                />
              ) : (
                <Text testID={valueTestId} style={[this.props.valueStyle]}>
                  {valueString}
                </Text>
              )}
              {active && showClear ? (
                <TouchableContainer
                  tid={`RemoveDateValue`}
                  onPress={this.handleClear}
                >
                  {iconClear}
                </TouchableContainer>
              ) : null}
              {active && !showClear && iconRight ? (
                <TouchableContainer
                  tid={`ToggleDatePicker`}
                  onPress={readonly ? this._togglePicker : () => {}}
                >
                  {iconRight}
                </TouchableContainer>
              ) : null}
            </View>
          </View>
        </Field>
        {this.state.isPickerVisible ? this._renderContent() : null}
      </View>
    );
  }
}

function getIcon(isPickerVisible, icons) {
  if (icons && icons.constructor === Array) {
    return !isPickerVisible ? icons[0] : icons[1];
  }
  return icons;
}

DatePickerComponent.propTypes = {
  dateTimeFormat: PropTypes.func,
  pickerWrapper: PropTypes.element,
  prettyPrint: PropTypes.bool,
  noInitialDate: PropTypes.bool,
  onCancel: PropTypes.func
};

DatePickerComponent.defaultProps = {
  pickerWrapper: <View />,
  dateTimeFormat: dateTimeFormat
};

DatePickerComponent.contextTypes = {
  actionSheet: PropTypes.object
};
