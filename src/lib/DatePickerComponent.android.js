'use strict';


import React from 'react';
import PropTypes from 'prop-types';
let { View, StyleSheet, TextInput, DatePickerAndroid} = require('react-native');
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
    const { onChange, onValueChange, date, prettyPrint, dateTimeFormat, mode } = this.props;
    const dateNormalized = date ? new Date(date) : new Date();
    const dateToSet = formatDateResult(dateNormalized, mode)

    this.setState({ date: dateToSet }, () => {
      onChange && onChange(prettyPrint ? dateTimeFormat(dateToSet) : dateToSet);
      onValueChange && onValueChange(dateToSet);
    });
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

      const dateToSet = formatDateResult(date, mode);

      this.setState({ date: dateToSet });

      onChange && onChange(prettyPrint ? dateTimeFormat(dateToSet, mode) : dateToSet);
      onValueChange && onValueChange(dateToSet);
    }
    setDate(date) {
      const { mode } = this.props;
      const dateToSet = formatDateResult(date, mode);
      this.setState({ date: dateToSet });

      if (this.props.onChange) this.props.onChange((this.props.prettyPrint) ? this.props.dateTimeFormat(dateToSet) : dateToSet);
      if (this.props.onValueChange) this.props.onValueChange(dateToSet);
    }


    async _togglePicker(event){
      try {

        const {action, year, month, day} = await DatePickerAndroid.open({
          date: this.props.date || new Date(),
	  minDate:this.props.minimumDate,

          maxDate:this.props.maximumDate
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          this.handleValueChange(new Date(year,month,day));
          // Selected year, month (0-11), day
        }
      } catch ({code, message}) {
          console.warn('Cannot open time picker', message);
      }
      this.props.onPress && this.props.onPress(event);
    }

    render(){
      let placeholderComponent = (this.props.placeholderComponent)
                        ? this.props.placeholderComponent
                        : <TText tid='Placeholder' style={this.props.placeholderStyle}>{this.props.placeholder}</TText>
      return(<TestPathSegment name={`Field[${this.props.fieldRef}]` || 'DatePicker'}>
        <View><Field
          {...this.props}
          ref='inputBox'
          onPress={this._togglePicker.bind(this)}>
          <View style={this.props.containerStyle}
            onLayout={this.handleLayoutChange.bind(this)}>
        {(this.props.iconLeft)
              ? this.props.iconLeft
              : null
            }
            {placeholderComponent}
            <View style={this.props.valueContainerStyle}>
              <TText tid='Value' style={this.props.valueStyle}>{
              (this.state.date)?this.state.date.toLocaleDateString():""
            }</TText>


            </View>
        {(this.props.iconRight)
                ? this.props.iconRight
                : null
            }
          </View>
          </Field>
          {(this.state.isPickerVisible)?
            <DatePickerAndroid
              {...this.props}
            date={this.state.date || new Date()}

            onDateChange={this.handleValueChange.bind(this)}
          />

          : null
        }

      </View>
    </TestPathSegment>
      )
    }

  }

  DatePickerComponent.propTypes = {
    dateTimeFormat: PropTypes.func
  }

  DatePickerComponent.defaultProps = {
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
