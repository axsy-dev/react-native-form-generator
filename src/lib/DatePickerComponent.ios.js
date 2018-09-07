'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TextInput, Text, DatePickerIOS}  from 'react-native';
import {Field} from './Field';

import { TestPathSegment, TText } from '@axsy/testable';


function formatDateResult(date, mode) {
  return mode === 'date' ? new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ) : date;
}

export class DatePickerComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isPickerVisible: false
    }
  }

  componentWillMount() {
    const { onChange, date, prettyPrint, dateTimeFormat, mode } = this.props;
    const dateToSet = date ? new Date(date) : new Date();

    this.setState({ date: formatDateResult(dateToSet) }, () => {
      onChange && onChange(formatDateResult(dateToSet));
    });
  }

  setDate(date) {
    const dateToSet = formatDateResult(date);
    this.setState({ date: dateToSet });

    if (this.props.onChange) this.props.onChange((this.props.prettyPrint) ? this.props.dateTimeFormat(dateToSet) : dateToSet);
    if (this.props.onValueChange) this.props.onValueChange(dateToSet);
  }
  handleLayoutChange(e){
    let {x, y, width, height} = {... e.nativeEvent.layout};

    this.setState(e.nativeEvent.layout);
  }

  handleValueChange(date) {
    const {
      mode,
      dateTimeFormat,
      onValueChange,
      onChange,
      prettyPrint
    } = this.props;

    const dateToSet = formatDateResult(date);

    this.setState({ date: dateToSet });

    onChange && onChange(prettyPrint ? dateTimeFormat(dateToSet, mode) : dateToSet);
    onValueChange && onValueChange(dateToSet);
  }

  _togglePicker(event){
    this.setState({isPickerVisible:!this.state.isPickerVisible});
    //this._scrollToInput(event);
    this.props.onPress && this.props.onPress(event);
  }

  render(){
    let { maximumDate,    minimumDate,
          minuteInterval, mode,
          onDateChange,   timeZoneOffsetInMinutes } = this.props;

    let  valueString = this.props.dateTimeFormat(this.state.date, this.props.mode);

    let datePicker= <DatePickerIOS
      maximumDate = {maximumDate}
      minimumDate = {minimumDate}
      minuteInterval = {minuteInterval}
      mode = {mode}
      timeZoneOffsetInMinutes = {timeZoneOffsetInMinutes}
      date = {this.state.date || new Date()}
      onDateChange = {this.handleValueChange.bind(this)}
    />

    let pickerWrapper = React.cloneElement(this.props.pickerWrapper,{onHidePicker:()=>{this.setState({isPickerVisible:false})}},datePicker);

    let iconLeft = this.props.iconLeft,
        iconRight = this.props.iconRight;

    if(iconLeft && iconLeft.constructor === Array){
      iconLeft = (!this.state.isPickerVisible)
                  ? iconLeft[0]
                  : iconLeft[1]
    }
    if(iconRight && iconRight.constructor === Array){
      iconRight = (!this.state.isPickerVisible)
                  ? iconRight[0]
                  : iconRight[1]
    }
    let placeholderComponent = (this.props.placeholderComponent)
                      ? this.props.placeholderComponent
                      : <TText tid='placeholder' style={this.props.placeholderStyle}>{this.props.placeholder}</TText>
    return(<TestPathSegment name={`Field[${this.props.fieldRef}]` || 'DatePicker'}><View><Field
      {...this.props}
      ref='inputBox'
      onPress={this._togglePicker.bind(this)}>
      <View style={this.props.containerStyle}
          onLayout={this.handleLayoutChange.bind(this)}>
          {(iconLeft)
            ? iconLeft
            : null
          }
          {placeholderComponent}
          <View style={[this.props.valueContainerStyle]}>
            <TText tid='Value' style={[this.props.valueStyle ]}>{ valueString }</TText>

            {(iconRight)
              ? iconRight
              : null
            }
          </View>

        </View>
      </Field>
      {(this.state.isPickerVisible)?
        pickerWrapper : null
      }

    </View></TestPathSegment>
  )
}

}

DatePickerComponent.propTypes = {
  dateTimeFormat: PropTypes.func,
  pickerWrapper: PropTypes.element,
  prettyPrint: PropTypes.bool
}

DatePickerComponent.defaultProps = {
  pickerWrapper: <View/>,
  dateTimeFormat: (date, mode) => {
    if (!date) return "";
    let value = '';
    switch (mode) {
      case 'datetime':
        value = date.toLocaleDateString()
          + ' '
          + date.toLocaleTimeString()
        break;
      case 'date':
        value = date.toLocaleDateString();
        break;
      case 'time':
        value = date.toLocaleTimeString();
        break;
      case 'countdown':
        value = date.getHours() + ":" + date.getMinutes();
        break;
      default:
        value = date.toLocaleDateString()
    }
    return value;
  }
};
